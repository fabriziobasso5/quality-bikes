import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Eyebrow from "@/components/Eyebrow";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Visita nuestro showroom en Caracas o contáctanos por WhatsApp. ${siteConfig.name}, motos de alta cilindrada.`,
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Eyebrow>Contacto</Eyebrow>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">
        Hablemos de tu próxima moto
      </h1>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <RevealItem>
          <h2 className="font-display text-xl uppercase tracking-wide text-brand-navy">
            Escríbenos
          </h2>
          <div className="mt-6">
            <ContactForm />
          </div>

          <div className="mt-10 space-y-2 text-sm text-brand-text/70">
            <p>{siteConfig.contact.address}</p>
            <p>WhatsApp: {siteConfig.contact.whatsappDisplay}</p>
            <p>Tel: {siteConfig.contact.phoneAltDisplay}</p>
            <p>{siteConfig.contact.email}</p>
            <p>{siteConfig.contact.hours}</p>
          </div>
        </RevealItem>

        <RevealItem>
          <h2 className="font-display text-xl uppercase tracking-wide text-brand-navy">
            Nuestro showroom
          </h2>
          <div className="mt-6 aspect-video w-full overflow-hidden border border-black/10">
            <iframe
              src={siteConfig.contact.mapsEmbedUrl}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Quality Bikes en Caracas"
            />
          </div>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
