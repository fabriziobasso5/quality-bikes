import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCover from "@/components/products/ProductCover";
import ProductCard from "@/components/products/ProductCard";
import AddToOrder from "@/components/products/AddToOrder";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import {
  categoryLabels,
  getProductBrand,
  getProductBySlug,
  products,
} from "@/data/products";

type Params = Promise<{ brand: string; slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ brand: p.brand, slug: p.slug }));
}

// Export estático: solo las combinaciones marca/slug de generateStaticParams.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const brand = getProductBrand(product.brand);
  return {
    title: `${brand?.name ?? ""} ${product.name}`.trim(),
    description: product.summary,
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { brand, slug } = await params;
  const product = getProductBySlug(slug);
  // El slug es único, pero la ruta lleva marca: si no coinciden, 404 (evita
  // /productos/mobil/bk3-octane-booster resolviendo a otra marca).
  if (!product || product.brand !== brand) notFound();

  const meta = getProductBrand(product.brand);
  const related = products
    .filter((p) => p.brand === product.brand && p.group === product.group && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <nav className="mb-8 text-xs tracking-wide text-brand-text/50 uppercase">
        <Link href="/productos" className="hover:text-brand-red">
          Productos
        </Link>{" "}
        /{" "}
        <Link href={`/productos/${product.brand}`} className="hover:text-brand-red">
          {meta?.name}
        </Link>{" "}
        / {product.name}
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Reveal>
          <ProductCover
            product={product}
            className="aspect-square w-full overflow-hidden border border-black/10"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>

        <div>
          <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">{meta?.name}</p>
          <h1 className="mt-2 font-display text-3xl uppercase tracking-wide sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-brand-text/70">{product.summary}</p>

          {/* Specs cortas: categoría, grupo y tags (tipo de aceite en Mobil). */}
          <dl className="mt-8 divide-y divide-black/[0.07] border-y border-black/10">
            {(
              [
                ["Categoría", categoryLabels[product.category]],
                ["Línea", product.group],
                ...(product.tags && product.tags.length
                  ? ([["Tipo", product.tags.join(" · ")]] as const)
                  : []),
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-6 py-3.5">
                <dt className="text-[11px] tracking-[0.2em] text-brand-text/45 uppercase">
                  {label}
                </dt>
                <dd className="text-right font-mono text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          {product.highlights.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-black/10 px-3 py-1 text-[11px] tracking-wide text-brand-text/60"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          <AddToOrder product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <Reveal>
            <h2 className="mb-6 font-display text-2xl uppercase tracking-wide">
              También en {product.group}
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <RevealItem key={p.slug} className="h-full">
                <ProductCard product={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}
    </div>
  );
}
