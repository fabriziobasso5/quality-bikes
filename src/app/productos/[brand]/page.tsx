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

/**
 * Agrupa los productos de la marca por categoría (en el orden que declara la
 * marca) y, dentro de cada categoría, por subgrupo (group) preservando el
 * orden de aparición en los datos. Cada subgrupo va a un carrusel.
 */
function groupByCategory(products: Product[], categories: ProductCategory[]) {
  return categories
    .map((category) => {
      const inCategory = products.filter((p) => p.category === category);
      const groups: { group: string; items: Product[] }[] = [];
      for (const product of inCategory) {
        const existing = groups.find((g) => g.group === product.group);
        if (existing) existing.items.push(product);
        else groups.push({ group: product.group, items: [product] });
      }
      return { category, groups };
    })
    .filter((c) => c.groups.length > 0);
}

export default async function BrandPage({ params }: { params: Params }) {
  const { brand } = await params;
  const meta = getProductBrand(brand);
  if (!meta) notFound();

  const products = getProductsByBrand(meta.id);
  const sections = groupByCategory(products, meta.categories);

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

      <div className="mt-14 space-y-16">
        {sections.map(({ category, groups }) => (
          <section key={category}>
            <Reveal>
              <h2 className="mb-8 font-display text-2xl uppercase tracking-wide">
                {categoryLabels[category]}
              </h2>
            </Reveal>
            <div className="space-y-12">
              {groups.map(({ group, items }) => (
                <Reveal key={group}>
                  <ProductCarousel title={group} products={items} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
