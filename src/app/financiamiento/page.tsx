import type { Metadata } from "next";
import { buildWhatsAppLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Financiamiento y formas de pago",
  description:
    "Conoce las modalidades de pago para adquirir tu moto de alta cilindrada en Quality Bikes: contado en USD, financiamiento y consignación.",
};

// TODO: reemplazar textos con las condiciones reales de financiamiento/consignación
// que defina el cliente (tasas, plazos, aliados bancarios, requisitos).
const modalities = [
  {
    title: "Contado en USD",
    body: "La forma más directa: transferencia o efectivo en divisas, con entrega inmediata sujeta a disponibilidad de inventario.",
  },
  {
    title: "Financiamiento",
    body: "Trabajamos con aliados financieros para estructurar planes de pago a tu medida. Cada caso se evalúa de forma personalizada con un asesor.",
  },
  {
    title: "Consignación / Trade-in",
    body: "¿Tienes una moto premium que quieres cambiar? La recibimos en consignación o como parte de pago de tu próxima unidad.",
  },
];

const faqs = [
  {
    q: "¿Qué documentos necesito para comprar una moto?",
    a: "Varía según la modalidad de pago. Un asesor te indicará el detalle exacto en tu primera consulta.",
  },
  {
    q: "¿Las motos vienen con garantía?",
    a: "Sí, las unidades 0 km cuentan con garantía de fábrica. Las seminuevas se evalúan caso por caso.",
  },
  {
    q: "¿Puedo ver la moto antes de decidir?",
    a: "Por supuesto. Agenda una cita en nuestro showroom en Caracas o solicita un test ride.",
  },
];

export default function FinanciamientoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Formas de pago</p>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">Financiamiento</h1>
      <p className="mt-4 max-w-2xl text-brand-text/70">
        Sabemos que una moto de alta cilindrada es una inversión importante. Por eso
        ofrecemos distintas modalidades y te acompañamos en cada paso del proceso.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {modalities.map((m) => (
          <div key={m.title} className="border border-black/10 bg-brand-bg-soft p-6">
            <h2 className="font-display text-lg uppercase tracking-wide text-brand-navy">
              {m.title}
            </h2>
            <p className="mt-3 text-sm text-brand-text/70">{m.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="font-display text-2xl uppercase tracking-wide">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none text-brand-text/90 marker:content-none">
                {f.q}
              </summary>
              <p className="mt-3 text-sm text-brand-text/60">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <a
          href={buildWhatsAppLink("Hola, quiero información sobre financiamiento.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-brand-navy px-8 py-3 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
        >
          Habla con un asesor financiero
        </a>
      </div>
    </div>
  );
}
