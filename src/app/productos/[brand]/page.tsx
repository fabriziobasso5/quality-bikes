import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/products/BrandLogo";
import BrandCatalog, { type CatalogLane, type CatalogOption } from "@/components/products/BrandCatalog";
import { Reveal } from "@/components/Reveal";
import {
  categoryLabels,
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

// Export estático: solo se sirven las tres marcas de generateStaticParams.
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

// Título de subsección por tipo de lubricante (campo tags).
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

/**
 * Opciones (pantalla de entrada) por marca:
 * - Mobil: "Gasolina" (líneas gasolina + moto, separado por tipo) y "Diesel"
 *   (con el orden Minerales → Full → Semi). No son categorías: Mobil es toda
 *   una categoría "lubricantes".
 * - VP / BK3: cada categoría de la marca es una opción; dentro, subgrupos por
 *   línea (group). BK3 tiene una sola opción → entra directo a sus productos.
 */
function buildOptions(meta: ProductBrandMeta, products: Product[]): CatalogOption[] {
  if (meta.id === "mobil") {
    const gasolina = products.filter(
      (p) => p.group === "Línea gasolina" || p.group === "Línea moto 2T y 4T",
    );
    const diesel = products.filter((p) => p.group === "Línea diesel");
    const options: CatalogOption[] = [];
    if (gasolina.length)
      options.push({
        id: "gasolina",
        label: "Gasolina",
        count: gasolina.length,
        lanes: lanesByTag(gasolina, ["Sintético", "Semisintético", "Mineral"]),
      });
    if (diesel.length)
      options.push({
        id: "diesel",
        label: "Diesel",
        count: diesel.length,
        lanes: lanesByTag(diesel, ["Mineral", "Sintético", "Semisintético"]),
      });
    return options;
  }

  return meta.categories
    .map((category) => {
      const items = products.filter((p) => p.category === category);
      return {
        id: category,
        label: categoryLabels[category],
        count: items.length,
        lanes: lanesByGroup(items),
      };
    })
    .filter((o) => o.lanes.length > 0);
}

export default async function BrandPage({ params }: { params: Params }) {
  const { brand } = await params;
  const meta = getProductBrand(brand);
  if (!meta) notFound();

  const products = getProductsByBrand(meta.id);
  const options = buildOptions(meta, products);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
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
          <div
            className="flex h-24 w-52 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundImage: `radial-gradient(120% 120% at 50% 30%, ${meta.accent}12 0%, transparent 62%)`,
            }}
          >
            <BrandLogo brand={meta} imgClassName="max-h-14 max-w-[170px]" className="text-3xl" />
          </div>
        </div>
      </Reveal>

      <BrandCatalog options={options} accent={meta.accent} />
    </div>
  );
}
