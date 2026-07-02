"use client";

import { useState } from "react";
import { buildWhatsAppLink } from "@/lib/site-config";

// TODO: cuando exista backend/CRM, reemplazar el submit por un POST real
// (guardar el lead, notificar al equipo) y dejar WhatsApp como paso adicional.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = [
      `Hola, soy ${name}.`,
      interest ? `Me interesa: ${interest}.` : null,
      message,
      `Mi teléfono: ${phone}.`,
    ]
      .filter(Boolean)
      .join(" ");

    window.open(buildWhatsAppLink(text), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-none border border-black/15 bg-brand-bg px-4 py-3 text-base text-brand-text placeholder:text-brand-text/40 focus:border-brand-navy focus:outline-none sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <input
        placeholder="Modelo o marca de interés (opcional)"
        className={inputClass}
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
      />
      <textarea
        placeholder="Cuéntanos qué buscas"
        rows={4}
        className={inputClass}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-brand-navy px-6 py-3 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
      >
        Enviar por WhatsApp
      </button>
    </form>
  );
}
