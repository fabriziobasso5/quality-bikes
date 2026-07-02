"use client";

import { useState } from "react";
import { buildWhatsAppLink } from "@/lib/site-config";

// Por ahora el formulario arma el mensaje y abre WhatsApp (no requiere backend).
// TODO: cuando haya backend/CRM, reemplazar el submit por un POST real y dejar
// WhatsApp como confirmación adicional en vez de único canal.
export default function QuoteForm({ motoLabel }: { motoLabel: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = [
      `Hola, soy ${name}.`,
      `Quiero recibir una cotización para la ${motoLabel}.`,
      `Mi teléfono: ${phone}.`,
    ]
      .filter(Boolean)
      .join(" ");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-none border border-black/15 bg-brand-bg px-4 py-3 text-base text-brand-text placeholder:text-brand-text/40 focus:border-brand-navy focus:outline-none sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-black/10 bg-brand-bg-soft p-6">
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

      <button
        type="submit"
        className="w-full bg-brand-navy px-6 py-3 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
      >
        Solicitar cotización
      </button>
      <p className="text-center text-xs text-brand-text/40">
        Al enviar, se abrirá WhatsApp con tu solicitud ya redactada.
      </p>
    </form>
  );
}
