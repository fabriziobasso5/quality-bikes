import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/products/BrandLogo";
import ProductCarousel from "@/components/products/ProductCarousel";
import { Reveal } from "@/components/Reveal";
import {
  categoryLabels,
  getProductBrand,
  getProductsByBrand,
  productBrands,
  type Product,
  type ProductCategory,
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

// Tipos de lubricante (campo tags) en orden de gama, con su título de subsección.
const TAG_ORDER = ["Sintético", "Semisintético", "Mineral"] as const;
const TAG_TITLE: Record<string, string> = {
  "Sintético": "Sintéticos (Full)",
  "Semisintético": "Semisintéticos",
  "Mineral": "Minerales",
};

interface Lane {
  title: string;
  items: Product[];
}
interface GroupBlock {
  group: string;
  tagged: boolean;
  lanes: Lane[];
}
interface CategorySection {
  category: ProductCategory;
  blocks: GroupBlock[];
}

/**
 * Separación clara: categoría → línea (group) → y, cuando los productos traen
 * tipo (tags, caso Mobil), cada tipo (Sintéticos Full / Semisintéticos /
 * Minerales) en su propia fila con subtítulo. Marcas sin tags (VP, BK3) usan
 * la línea directamente como carrusel. Se preserva el orden de los datos.
 */
function buildSections(products: Product[], categories: ProductCategory[]): CategorySection[] {
  return categories
    .map((category) => {
      const inCategory = products.filter((p) => p.category === category);

      const groupOrder: string[] = [];
      const byGroup = new Map<string, Product[]>();
      for (const p of inCategory) {
        if (!byGroup.has(p.group)) {
          byGroup.set(p.group, []);
          groupOrder.push(p.group);
        }
        byGroup.get(p.group)!.push(p);
      }

      const blocks: GroupBlock[] = groupOrder.map((group) => {
        const items = byGroup.get(group)!;
        const tagged = items.some((p) => p.tags && p.tags.length > 0);
        if (!tagged) return { group, tagged: false, lanes: [{ title: group, items }] };

        const lanes: Lane[] = [];
        const placed = new Set<Product>();
        for (const tag of TAG_ORDER) {
          const laneItems = items.filter((p) => p.tags?.includes(tag));
          if (laneItems.length) {
            laneItems.forEach((p) => placed.add(p));
            lanes.push({ title: TAG_TITLE[tag], items: laneItems });
          }
        }
        // Cualquier producto con un tag fuera del orden conocido no se pierde.
        const rest = items.filter((p) => !placed.has(p));
        if (rest.length) lanes.push({ title: group, items: rest });
        return { group, tagged: true, lanes };
      });

      return { category, blocks };
    })
    .filter((c) => c.blocks.length > 0);
}

export default async function BrandPage({ params }: { params: Params }) {
  const { brand } = await params;
  const meta = getProductBrand(brand);
  if (!meta) notFound();

  const products = getProductsByBrand(meta.id);
  const sections = buildSections(products, meta.categories);

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

      <div className="mt-14 space-y-20">
        {sections.map(({ category, blocks }) => (
          <section key={category}>
            <Reveal>
              <h2 className="mb-10 font-display text-2xl uppercase tracking-wide text-brand-text">
                {categoryLabels[category]}
              </h2>
            </Reveal>
            <div className="space-y-14">
              {blocks.map((block) =>
                block.tagged ? (
                  <div key={block.group}>
                    <Reveal>
                      <h3 className="mb-7 flex items-center gap-3 font-display text-xl tracking-wide text-brand-navy">
                        <span
                          aria-hidden
                          className="inline-block h-5 w-1.5 rounded-full"
                          style={{ backgroundColor: meta.accent }}
                        />
                        {block.group}
                      </h3>
                    </Reveal>
                    <div className="space-y-10 border-l border-black/[0.06] pl-4 sm:pl-6">
                      {block.lanes.map((lane) => (
                        <Reveal key={lane.title}>
                          <ProductCarousel title={lane.title} products={lane.items} accent={meta.accent} />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Reveal key={block.group}>
                    <ProductCarousel title={block.group} products={block.lanes[0].items} accent={meta.accent} />
                  </Reveal>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
