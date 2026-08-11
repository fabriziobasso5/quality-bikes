import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Eyebrow from "@/components/Eyebrow";
import MotoGallery from "@/components/MotoGallery";
import OpenCatalogButton from "@/components/OpenCatalogButton";
import MotoCard from "@/components/MotoCard";
import QuoteForm from "@/components/QuoteForm";
import Magnetic from "@/components/Magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { motorcycles, getMotoBySlug } from "@/data/motorcycles";
import { buildWhatsAppLink } from "@/lib/site-config";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return motorcycles.map((moto) => ({ slug: moto.slug }));
}

// Static export only serves the slugs above; there's no server to resolve
// anything else at request time.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const moto = getMotoBySlug(slug);
  if (!moto) return {};

  return {
    title: `${moto.brand} ${moto.model} — Consultar disponibilidad`,
    description: moto.summary,
  };
}

export default async function MotoDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const moto = getMotoBySlug(slug);

  if (!moto) notFound();

  const label = `${moto.brand} ${moto.model}`;
  const related = motorcycles
    .filter((m) => m.category === moto.category && m.slug !== moto.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* forceFallback: desde una ficha "Volver" siempre lleva al catálogo, no
          al historial. Al catálogo se entra por el mega-menú, que es un panel
          sobre la página anterior — sin esto, router.back() devolvía a la
          portada, y saltando entre fichas relacionadas devolvía a la ficha
          anterior. */}
      <BackLink
        fallbackHref="/catalogo/inventario"
        label="Volver al catálogo"
        forceFallback
        className="mb-6"
      />
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-brand-text/60 uppercase">
        <span aria-hidden className="text-brand-red">
          ›
        </span>
        <span>
          <OpenCatalogButton className="hover:text-brand-red">Catálogo</OpenCatalogButton>{" "}
          / {moto.brand} {moto.model}
        </span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <MotoGallery moto={moto} />

        {/* Sticky en desktop: la galería vertical es más alta que la ficha, así
            que sin esto las specs y el botón de WhatsApp se quedan atrás
            mientras se recorren las fotos. */}
        <div className="lg:sticky lg:top-28">
          <div className="flex items-center gap-3">
            <Eyebrow>{moto.brand}</Eyebrow>
            {moto.availability === "proximo-arribo" && (
              <span className="rounded-full border border-brand-red px-3 py-0.5 text-[10px] tracking-widest text-brand-red uppercase">
                Próximo arribo
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">{moto.model}</h1>
          <p className="mt-4 text-brand-text/70">{moto.summary}</p>
          {moto.availability === "proximo-arribo" && (
            <p className="mt-2 text-sm text-brand-text/60">
              Esta unidad aún no llega a Venezuela — puedes reservarla o consultar fecha
              estimada de arribo con un asesor.
            </p>
          )}

          {/* Spec sheet estilo hoja técnica de lujo: los tres datos estrella
              en grande arriba, el resto en filas finas etiqueta-valor. */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-y border-black/10 py-8">
            {[
              { value: `${moto.cc}`, unit: "cc", label: "Cilindrada" },
              { value: moto.specs.power.replace(/\s*hp$/i, ""), unit: "hp", label: "Potencia" },
              { value: (moto.specs.weight ?? "—").replace(/\s*kg$/i, ""), unit: "kg", label: "Peso" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-3xl tracking-tight sm:text-4xl">
                  {stat.value}
                  <span className="ml-1 text-sm text-brand-text/50 sm:text-base">{stat.unit}</span>
                </p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-brand-text/50 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <dl className="divide-y divide-black/[0.07] border-b border-black/10">
            {(
              [
                ["Año", String(moto.year)],
                ["Cilindros", moto.specs.cylinders],
                ["Transmisión", moto.specs.transmission],
                ["Marchas", moto.specs.gears],
                ["Color", moto.specs.color],
                ...(moto.specs.seatHeight
                  ? ([["Altura de asiento", moto.specs.seatHeight]] as const)
                  : []),
                [
                  "Estado",
                  moto.condition === "0km"
                    ? "0 km"
                    : `Seminueva${moto.mileageKm ? ` · ${moto.mileageKm} km` : ""}`,
                ],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-6 py-3.5">
                <dt className="font-mono text-[11px] tracking-[0.15em] text-brand-text/45 uppercase">
                  {label}
                </dt>
                <dd className="text-right font-mono text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm text-brand-text/60">
            Precio disponible por consulta directa con un asesor.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Magnetic className="inline-block">
              <a
                href={buildWhatsAppLink(`Hola, me interesa la ${label} disponible en Quality Bikes.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-brand-navy px-8 py-3 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
              >
                Consultar por WhatsApp
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Las bondades van a todo el ancho y no en la columna de specs: la
          columna ya llega justa al alto de la galería, y aquí respiran como
          una ficha editorial en vez de amontonarse como viñetas. */}
      {moto.highlights && moto.highlights.length > 0 && (
        <div className="mt-24">
          <Reveal>
            <Eyebrow>Por qué esta moto</Eyebrow>
          </Reveal>
          <RevealGroup className="mt-8 grid grid-cols-1 gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {moto.highlights.map((point, i) => (
              <RevealItem key={point}>
                <div className="border-t border-black/10 pt-5">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-brand-red">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 leading-relaxed text-brand-text/80">{point}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}

      <Reveal className="mx-auto mt-24 max-w-xl">
        <h2 className="mb-6 text-center font-display text-2xl uppercase tracking-wide">
          Solicita tu cotización
        </h2>
        <QuoteForm motoLabel={label} />
      </Reveal>

      {related.length > 0 && (
        <div className="mt-20">
          <Reveal>
            <h2 className="mb-6 font-display text-2xl uppercase tracking-wide">
              También te puede interesar
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((m) => (
              <RevealItem key={m.slug}>
                <MotoCard moto={m} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}
    </div>
  );
}
