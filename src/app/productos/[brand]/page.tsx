import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import Eyebrow from "@/components/Eyebrow";
import BrandLogo from "@/components/products/BrandLogo";
import BrandCatalog, { type CatalogLane, type CatalogNode } from "@/components/products/BrandCatalog";
import { Reveal } from "@/components/Reveal";
import {
  getProductBrand,
  getProductsByBrand,
  productBrands,
  type Product,
  type ProductBrandMeta,
} from "@/data/products";
import { withBasePath } from "@/lib/base-path";

type Params = Promise<{ brand: string }>;

export function generateStaticParams() {
  return productBrands.map((b) => ({ brand: b.id }));
}

// Export estático: solo se sirven las marcas de generateStaticParams.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand } = await params;
  const meta = getProductBrand(brand);
  if (!meta) return {};
  return {
    title: `${meta.name} — ${meta.tagline}`,
    description: `${meta.name} en Quality Bikes: ${meta.tagline}. Arma tu pedido y cotízalo por WhatsApp.`,
  };
}

// Título de subsección por tipo de lubricante (campo tags, caso Mobil).
const TAG_TITLE: Record<string, string> = {
  "Sintético": "Sintéticos (Full)",
  "Semisintético": "Semisintéticos",
  "Mineral": "Minerales",
};

// Subgrupos por línea (campo group), preservando el orden de los datos.
function lanesByGroup(items: Product[]): CatalogLane[] {
  const order: string[] = [];
  const map = new Map<string, Product[]>();
  for (const p of items) {
    if (!map.has(p.group)) {
      map.set(p.group, []);
      order.push(p.group);
    }
    map.get(p.group)!.push(p);
  }
  return order.map((g) => ({ title: g, products: map.get(g)! }));
}

// Subsecciones por tipo (tags) en el orden indicado; nada se queda fuera.
function lanesByTag(items: Product[], tagOrder: string[]): CatalogLane[] {
  const lanes: CatalogLane[] = [];
  const placed = new Set<Product>();
  for (const tag of tagOrder) {
    const ps = items.filter((p) => p.tags?.includes(tag));
    if (ps.length) {
      ps.forEach((p) => placed.add(p));
      lanes.push({ title: TAG_TITLE[tag] ?? tag, products: ps });
    }
  }
  const rest = items.filter((p) => !placed.has(p));
  if (rest.length) lanes.push({ title: "Otros", products: rest });
  return lanes;
}

const laneCount = (lanes: CatalogLane[]) => lanes.reduce((n, l) => n + l.products.length, 0);

const leaf = (id: string, label: string, lanes: CatalogLane[]): CatalogNode => ({
  id,
  label,
  count: laneCount(lanes),
  lanes,
});
const nodeCount = (children: CatalogNode[]) => children.reduce((n, c) => n + c.count, 0);
const branch = (id: string, label: string, children: CatalogNode[]): CatalogNode => ({
  id,
  label,
  count: nodeCount(children),
  children,
});

// Una opción por valor único de "group", en el orden en que aparecen los
// datos — cada familia es su propia hoja con un único carril (mismo patrón
// que ya usan las líneas nuevas de Mobil).
function leavesByGroup(items: Product[]): CatalogNode[] {
  const order: string[] = [];
  const map = new Map<string, Product[]>();
  const slugs = new Map<string, string>();
  for (const p of items) {
    if (!map.has(p.group)) {
      map.set(p.group, []);
      order.push(p.group);
      slugs.set(p.group, p.groupSlug);
    }
    map.get(p.group)!.push(p);
  }
  return order.map((g) => leaf(slugs.get(g)!, g, lanesByGroup(map.get(g)!)));
}

// Segundo nivel de Falken WildPeak: una opción por "subgroup" (A/T, M/T,
// R/T), en el orden en que aparecen los datos.
function leavesBySubgroup(items: Product[]): CatalogNode[] {
  const order: string[] = [];
  const map = new Map<string, Product[]>();
  const slugs = new Map<string, string>();
  for (const p of items) {
    const label = p.subgroupLabel ?? p.subgroup ?? "Otros";
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
      slugs.set(label, p.subgroupSlug ?? label.toLowerCase());
    }
    map.get(label)!.push(p);
  }
  return order.map((label) => leaf(slugs.get(label)!, label, [{ title: label, products: map.get(label)! }]));
}

// Grupos "de siempre" de la categoría aditivos de VP (elevadores, potencia,
// limpiadores, estabilizadores, lubricantes de combustible). Todo lo demás
// que sea category "aditivos" (refrigerantes, aerosoles, frenos, accesorios)
// tiene su propia sección.
const VP_ADITIVOS_CLASICOS = [
  "Elevador de octanaje",
  "Mejorador de potencia",
  "Limpiador de combustible",
  "Estabilizador",
  "Lubricante de combustible",
];

/**
 * Árbol de navegación in-page por marca.
 * - BK3: Para Motores a Gasolina (octane boosters + performance marine) y
 *   Para Motores a Diesel (cetanium) — mismos ids "gasolina"/"diesel" de
 *   siempre, solo cambia el label mostrado.
 * - VP Racing: 6 tarjetas planas, en este orden — Combustibles de
 *   Competencia (gasolinas + alcoholes de carrera), Diesel y Maquinaria
 *   Pesada (aceites diesel + fluidos de maquinaria + aditivos diesel +
 *   Diesel Armor), Aditivos (clásicos + lubricante de combustible),
 *   Aceites y Fluidos (Street Legal + transmisión/dirección +
 *   moto/especiales + refrigerantes + frenos), Limpieza y Detailing
 *   (aerosoles + power wash) y Accesorios (cuidado del tanque + bidones).
 *   Diesel Armor vive en "Cuidado del tanque" pero está tags:["Diesel"]:
 *   se saca de ahí y se suma a "Diesel y Maquinaria Pesada", no a
 *   "Accesorios".
 * - Mobil: 5 tarjetas, en este orden — Para Motores a Gasolina, Para Motores
 *   a Diesel (incluye el refrigerante Delvac Extended Life, antes en
 *   "Especialidades"), Para Motos y Lanchas (2T/4T + Outboard),
 *   Transmisiones e Industrial (incluye
 *   la grasa Mobilgrease XHP 222, antes en "Grasas").
 * - Falken: 3 tarjetas de primer nivel, en este orden — WildPeak (abre un
 *   2do nivel con 3 sub-opciones A/T, R/T, M/T, tomadas del campo
 *   "subgroup" en ese orden), Ziex y Azenis (van directo a su lista de
 *   productos).
 */
function buildNodes(meta: ProductBrandMeta, products: Product[]): CatalogNode[] {
  if (meta.id === "bk3") {
    const gasolina = products.filter((p) => p.group === "Gasolina" || p.group === "Marino");
    const diesel = products.filter((p) => p.group === "Diesel");
    return [
      leaf("gasolina", "Para Motores a Gasolina", lanesByGroup(gasolina)),
      leaf("diesel", "Para Motores a Diesel", lanesByGroup(diesel)),
    ].filter((n) => n.count > 0);
  }

  if (meta.id === "vp-racing") {
    const combustibles = products.filter(
      (p) => p.category === "gasolinas" || p.category === "alcoholes",
    );
    const aditivos = products.filter(
      (p) => p.category === "aditivos" && VP_ADITIVOS_CLASICOS.includes(p.group),
    );
    // "Aceites y Fluidos" (ex "Fluidos y Refrigerantes", luego "Lubricantes y
    // Fluidos"): aceites Street Legal + transmisión/dirección +
    // moto/especiales primero, luego los fluidos de siempre (refrigerantes y
    // frenos).
    const lubricantes = products.filter(
      (p) =>
        p.group === "Aceites de motor Street Legal" ||
        p.group === "Transmisión y dirección" ||
        p.group === "Moto y especiales",
    );
    const fluidos = products.filter((p) => p.group === "Refrigerantes" || p.group === "Frenos");
    const limpieza = products.filter(
      (p) => p.group === "Aerosoles" || p.group === "Power Wash y Sprays",
    );
    // Diesel Armor vive en "Cuidado del tanque" pero está tagueado Diesel:
    // se saca de aquí y se suma al filtro top-level de Diesel más abajo.
    const cuidadoTanque = products.filter(
      (p) => p.group === "Cuidado del tanque" && !p.tags?.includes("Diesel"),
    );
    const bidones = products.filter((p) => p.group === "Accesorios");
    const accesorios = [...cuidadoTanque, ...bidones];
    const dieselTanque = products.filter(
      (p) => p.group === "Cuidado del tanque" && p.tags?.includes("Diesel"),
    );
    const dieselAditivos = products.filter((p) => p.category === "aditivos" && p.group === "Diesel");
    // "Diesel y Maquinaria Pesada" (ex "Motores a Diesel"): aceites y fluidos
    // de maquinaria primero, luego los aditivos diesel y Diesel Armor.
    const dieselMaquinaria = products.filter(
      (p) => p.group === "Aceites de motor diesel" || p.group === "Fluidos de maquinaria",
    );
    return [
      leaf("combustibles", "Combustibles de Competencia", lanesByGroup(combustibles)),
      leaf("diesel", "Diesel y Maquinaria Pesada", lanesByGroup([...dieselMaquinaria, ...dieselAditivos, ...dieselTanque])),
      leaf("aditivos", "Aditivos", lanesByGroup(aditivos)),
      leaf("fluidos", "Aceites y Fluidos", lanesByGroup([...lubricantes, ...fluidos])),
      leaf("limpieza", "Limpieza y Detailing", lanesByGroup(limpieza)),
      leaf("accesorios", "Accesorios", lanesByGroup(accesorios)),
    ].filter((n) => n.count > 0);
  }

  // EWAY: sin divisores — un único leaf que BrandCatalog abre solo (son 4
  // combustibles, van directo en cuadrícula).
  if (meta.id === "eway") {
    return [leaf("combustibles", "Combustibles", lanesByGroup(products))].filter((n) => n.count > 0);
  }

  if (meta.id === "falken") {
    const azenis = products.filter((p) => p.group === "Azenis");
    const ziex = products.filter((p) => p.group === "Ziex");
    const wildpeak = products.filter((p) => p.group === "WildPeak");
    return [
      branch("wildpeak", "WildPeak", leavesBySubgroup(wildpeak)),
      leaf("ziex", "Ziex", lanesByGroup(ziex)),
      leaf("azenis", "Azenis", lanesByGroup(azenis)),
    ].filter((n) => n.count > 0);
  }

  // Mobil — "Línea especialidades" (Delvac Extended Life) se suma a Diesel;
  // "Línea grasas" (Mobilgrease XHP 222) se suma a Industrial.
  const gasolina = products.filter((p) => p.group === "Línea gasolina");
  const diesel = products.filter(
    (p) => p.group === "Línea diesel" || p.group === "Línea especialidades",
  );
  const moto = products.filter((p) => p.group === "Línea moto 2T y 4T");
  const transmisiones = products.filter((p) => p.group === "Línea transmisiones");
  const industrial = products.filter(
    (p) => p.group === "Línea industrial" || p.group === "Línea grasas",
  );
  return [
    leaf("gasolina", "Para Motores a Gasolina", lanesByTag(gasolina, ["Sintético", "Semisintético", "Mineral"])),
    leaf("diesel", "Para Motores a Diesel", lanesByTag(diesel, ["Mineral", "Sintético", "Semisintético", "Refrigerante"])),
    leaf("moto", "Para Motos y Lanchas", lanesByTag(moto, ["Semisintético", "Mineral"])),
    leaf("transmisiones", "Transmisiones", lanesByGroup(transmisiones)),
    leaf("industrial", "Industrial", lanesByGroup(industrial)),
  ].filter((n) => n.count > 0);
}

export default async function BrandPage({ params }: { params: Params }) {
  const { brand } = await params;
  const meta = getProductBrand(brand);
  if (!meta) notFound();

  const products = getProductsByBrand(meta.id);
  const nodes = buildNodes(meta, products);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <BackLink fallbackHref="/productos" className="mb-6" />
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-brand-text/60 uppercase">
        <span aria-hidden className="text-brand-red">
          ›
        </span>
        <span>
          <Link href="/productos" className="hover:text-brand-red">
            Productos
          </Link>{" "}
          / {meta.name}
        </span>
      </nav>

      <Reveal>
        <div className="flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Tienda</Eyebrow>
            <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">{meta.name}</h1>
            <p className="mt-3 max-w-xl text-brand-text/70">{meta.tagline}</p>
            {/* Sello discreto "Fuel by Gulf": EWAY trae y vende gasolina
                Gulf de competencia — el respaldo se muestra, no grita. */}
            {meta.id === "eway" && (
              <div className="mt-4 flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- sello de tercero */}
                <img
                  src={withBasePath("/images/brands/gulf-seal.png")}
                  alt="Gulf"
                  className="h-9 w-auto"
                />
                <span className="font-mono text-[11px] tracking-[0.15em] text-brand-text/60 uppercase">
                  Fuel by Gulf
                </span>
              </div>
            )}
          </div>
          {/* Placa de logo protagonista: más grande que el logo chico de
              /productos, mascota propia cuando la hay (VP, Mobil), mismo
              alto de placa entre las 4 marcas aunque cada gráfico tenga
              proporciones distintas. */}
          <div className="flex h-32 w-72 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white px-6 sm:h-40 sm:w-80">
            <BrandLogo brand={meta} useHeaderLogo imgClassName="max-h-28 sm:max-h-36" />
          </div>
        </div>
      </Reveal>

      <BrandCatalog nodes={nodes} accent={meta.accent} />
    </div>
  );
}
