import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import MotoGallery from "@/components/MotoGallery";
import MotoCard from "@/components/MotoCard";
import TestRideForm from "@/components/TestRideForm";
import { motorcycles, getMotoBySlug } from "@/data/motorcycles";
import { buildWhatsAppLink } from "@/lib/site-config";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return motorcycles.map((moto) => ({ slug: moto.slug }));
}

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
      <nav className="mb-8 text-xs tracking-wide text-brand-text/50 uppercase">
        <Link href="/catalogo" className="hover:text-brand-red">
          Catálogo
        </Link>{" "}
        / {moto.brand} {moto.model}
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <MotoGallery moto={moto} />

        <div>
          <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">{moto.brand}</p>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">{moto.model}</h1>
          <p className="mt-4 text-brand-text/70">{moto.summary}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-black/10 py-6 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-brand-text/50 uppercase">Año</dt>
              <dd className="mt-1 font-mono">{moto.year}</dd>
            </div>
            <div>
              <dt className="text-brand-text/50 uppercase">Cilindrada</dt>
              <dd className="mt-1 font-mono">{moto.cc} cc</dd>
            </div>
            <div>
              <dt className="text-brand-text/50 uppercase">Potencia</dt>
              <dd className="mt-1 font-mono">{moto.specs.power}</dd>
            </div>
            <div>
              <dt className="text-brand-text/50 uppercase">Cilindros</dt>
              <dd className="mt-1 font-mono">{moto.specs.cylinders}</dd>
            </div>
            <div>
              <dt className="text-brand-text/50 uppercase">Transmisión</dt>
              <dd className="mt-1 font-mono">{moto.specs.transmission}</dd>
            </div>
            <div>
              <dt className="text-brand-text/50 uppercase">Marchas</dt>
              <dd className="mt-1 font-mono">{moto.specs.gears}</dd>
            </div>
            <div>
              <dt className="text-brand-text/50 uppercase">Color</dt>
              <dd className="mt-1 font-mono">{moto.specs.color}</dd>
            </div>
            <div>
              <dt className="text-brand-text/50 uppercase">Estado</dt>
              <dd className="mt-1 font-mono">{moto.condition === "0km" ? "0 km" : "Seminueva"}</dd>
            </div>
          </dl>

          <p className="mt-6 text-sm text-brand-text/60">
            Precio disponible por consulta directa con un asesor.{" "}
            <Link href="/financiamiento" className="text-brand-red hover:underline">
              Ver formas de pago y financiamiento
            </Link>
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={buildWhatsAppLink(`Hola, me interesa la ${label} disponible en Quality Bikes.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-navy px-8 py-3 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-xl">
        <h2 className="mb-6 text-center font-display text-2xl uppercase tracking-wide">
          Agenda tu test ride o solicita cotización
        </h2>
        <TestRideForm motoLabel={label} />
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl uppercase tracking-wide">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((m) => (
              <MotoCard key={m.slug} moto={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
