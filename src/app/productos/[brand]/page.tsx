import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BackLink from "@/components/BackLink";
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

// Grupos "de siempre" de la categoría aditivos de VP (elevadores, potencia,
// limpiadores, estabilizadores). Todo lo demás que sea category "aditivos"
// (refrigerantes, aerosoles, frenos, accesorios) tiene su propia sección.
const VP_ADITIVOS_CLASICOS = [
  "Elevador de octanaje",
  "Mejorador de potencia",
  "Limpiador de combustible",
  "Estabilizador",
];

/**
 * Árbol de navegación in-page por marca: una opción (tarjeta) por sección,
 * cada una hoja con sus carriles de producto (campo "group"). Sin niveles
 * anidados — todas las marcas quedan al mismo nivel de navegación.
 * - BK3: Gasolina (octane boosters + performance marine) y Diesel (cetanium).
 * - VP Racing: Gasolina de competencia, Aditivos (clásicos), Alcoholes,
 *   Refrigerantes, Aerosoles y Sprays, Frenos, Accesorios (cuidado del
 *   tanque + bidones) y Diesel (aditivos diesel).
 * - Mobil: Gasolina, Diesel (separados por tipo: Min → Full → Semi), Moto
 *   (2T y 4T, sección propia) y las líneas adicionales (Transmisiones,
 *   Industrial, Grasas, Especialidades).
 * - Falken: SIN Gasolina/Diesel — una opción por FAMILIA de caucho (Azenis,
 *   Ziex, WildPeak A/T, WildPeak M/T, WildPeak R/T), tomada directo del campo
 *   "group" de cada producto.
 */
function buildNodes(meta: ProductBrandMeta, products: Product[]): CatalogNode[] {
  if (meta.id === "bk3") {
    const gasolina = products.filter((p) => p.group === "Gasolina" || p.group === "Marino");
    const diesel = products.filter((p) => p.group === "Diesel");
    return [
      leaf("gasolina", "Gasolina", lanesByGroup(gasolina)),
      leaf("diesel", "Diesel", lanesByGroup(diesel)),
    ].filter((n) => n.count > 0);
  }

  if (meta.id === "vp-racing") {
    const combustibles = products.filter((p) => p.category === "gasolinas");
    const aditivos = products.filter(
      (p) => p.category === "aditivos" && VP_ADITIVOS_CLASICOS.includes(p.group),
    );
    const alcoholes = products.filter((p) => p.category === "alcoholes");
    const refrigerantes = products.filter((p) => p.group === "Refrigerantes");
    const aerosoles = products.filter(
      (p) => p.group === "Aerosoles" || p.group === "Power Wash y Sprays",
    );
    const frenos = products.filter((p) => p.group === "Frenos");
    const accesorios = products.filter(
      (p) => p.group === "Cuidado del tanque" || p.group === "Bidones y accesorios",
    );
    const diesel = products.filter((p) => p.category === "aditivos" && p.group === "Diesel");
    return [
      leaf("combustibles", "Gasolina de competencia", lanesByGroup(combustibles)),
      leaf("aditivos", "Aditivos", lanesByGroup(aditivos)),
      leaf("alcoholes", "Alcoholes", lanesByGroup(alcoholes)),
      leaf("refrigerantes", "Refrigerantes", lanesByGroup(refrigerantes)),
      leaf("aerosoles", "Aerosoles y Sprays", lanesByGroup(aerosoles)),
      leaf("frenos", "Frenos", lanesByGroup(frenos)),
      leaf("accesorios", "Accesorios", lanesByGroup(accesorios)),
      leaf("diesel", "Diesel", lanesByGroup(diesel)),
    ].filter((n) => n.count > 0);
  }

  if (meta.id === "falken") {
    return leavesByGroup(products).filter((n) => n.count > 0);
  }

  // Mobil
  const gasolina = products.filter((p) => p.group === "Línea gasolina");
  const diesel = products.filter((p) => p.group === "Línea diesel");
  const moto = products.filter((p) => p.group === "Línea moto 2T y 4T");
  const transmisiones = products.filter((p) => p.group === "Línea transmisiones");
  const industrial = products.filter((p) => p.group === "Línea industrial");
  const grasas = products.filter((p) => p.group === "Línea grasas");
  const especialidades = products.filter((p) => p.group === "Línea especialidades");
  return [
    leaf("gasolina", "Gasolina", lanesByTag(gasolina, ["Sintético", "Semisintético", "Mineral"])),
    leaf("diesel", "Diesel", lanesByTag(diesel, ["Mineral", "Sintético", "Semisintético"])),
    leaf("moto", "Moto", lanesByTag(moto, ["Semisintético", "Mineral"])),
    leaf("transmisiones", "Transmisiones", lanesByGroup(transmisiones)),
    leaf("industrial", "Industrial", lanesByGroup(industrial)),
    leaf("grasas", "Grasas", lanesByGroup(grasas)),
    leaf("especialidades", "Especialidades", lanesByGroup(especialidades)),
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
      <nav className="mb-8 text-xs tracking-wide text-brand-text/50 uppercase">
        <Link href="/productos" className="hover:text-brand-red">
          Productos
        </Link>{" "}
        / {meta.name}
      </nav>

      <Reveal>
        <div className="flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Tienda</p>
            <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">{meta.name}</h1>
            <p className="mt-3 max-w-xl text-brand-text/70">{meta.tagline}</p>
          </div>
          {/* Placa de logo consistente entre marcas: fondo claro, alto fijo,
              centrado y con aire. */}
          <div className="flex h-24 w-56 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white px-8">
            <BrandLogo brand={meta} />
          </div>
        </div>
      </Reveal>

      <BrandCatalog nodes={nodes} accent={meta.accent} />
    </div>
  );
}
