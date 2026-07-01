"use client";

import { useState } from "react";
import { buildWhatsAppLink } from "@/lib/site-config";

// Por ahora el formulario arma el mensaje y abre WhatsApp (no requiere backend).
// TODO: cuando haya backend/CRM, reemplazar el submit por un POST real y dejar
// WhatsApp como confirmación adicional en vez de único canal.
export default function TestRideForm({ motoLabel }: { motoLabel: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [intent, setIntent] = useState<"test-ride" | "cotizacion">("test-ride");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const intentLabel =
      intent === "test-ride" ? "agendar un test ride" : "recibir una cotización";
    const message = [
      `Hola, soy ${name}.`,
      `Quiero ${intentLabel} para la ${motoLabel}.`,
      preferredDate ? `Fecha preferida: ${preferredDate}.` : null,
      `Mi teléfono: ${phone}.`,
    ]
      .filter(Boolean)
      .join(" ");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-none border border-black/15 bg-brand-bg px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/40 focus:border-brand-navy focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-black/10 bg-brand-bg-soft p-6">
      <div className="flex gap-3 text-sm">
        <button
          type="button"
          onClick={() => setIntent("test-ride")}
          className={`flex-1 border px-4 py-2 uppercase tracking-wide transition ${
            intent === "test-ride"
              ? "border-brand-navy text-brand-navy"
              : "border-black/15 text-brand-text/60"
          }`}
        >
          Test ride
        </button>
        <button
          type="button"
          onClick={() => setIntent("cotizacion")}
          className={`flex-1 border px-4 py-2 uppercase tracking-wide transition ${
            intent === "cotizacion"
              ? "border-brand-navy text-brand-navy"
              : "border-black/15 text-brand-text/60"
          }`}
        >
          Cotización
        </button>
      </div>

      <input
        required
        placeholder="Nombre completo"
        className={inputClass}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        required
        type="tel"
        placeholder="Teléfono / WhatsApp"
        className={inputClass}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {intent === "test-ride" && (
        <input
          type="date"
          className={inputClass}
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
        />
      )}

      <button
        type="submit"
        className="w-full bg-brand-navy px-6 py-3 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
      >
        {intent === "test-ride" ? "Agendar test ride" : "Solicitar cotización"}
      </button>
      <p className="text-center text-xs text-brand-text/40">
        Al enviar, se abrirá WhatsApp con tu solicitud ya redactada.
      </p>
    </form>
  );
}
