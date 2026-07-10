import Link from "next/link";
import CursorGlow from "@/components/CursorGlow";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.888.51 3.716 1.476 5.318L2 22l4.828-1.442a9.96 9.96 0 0 0 5.176 1.442h.004c5.518 0 10.004-4.486 10.004-10.004C22.012 6.486 17.526 2 12.004 2zm0 18.176a8.14 8.14 0 0 1-4.152-1.136l-.298-.177-2.868.856.86-2.797-.194-.287a8.15 8.15 0 0 1-1.242-4.335c0-4.51 3.67-8.18 8.18-8.18a8.13 8.13 0 0 1 5.786 2.398 8.13 8.13 0 0 1 2.395 5.784c0 4.51-3.67 8.18-8.18 8.18z" />
    </svg>
  );
}

/**
 * Footer sobrio y centrado sobre azul marino de marca: logo en versión clara,
 * lema, navegación, datos de contacto y redes. La dirección y el horario viven
 * ahora aquí (se retiraron del bloque de ubicación del home).
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-navy text-brand-bg">
      <CursorGlow />
      <div className="relative mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
        {/* Logo en versión clara (blanco) sobre el navy */}
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
        <img
          src={withBasePath("/assets/logo/quality-bikes-logo-color.svg")}
          alt={siteConfig.name}
          className="mx-auto h-11 w-auto"
          style={{ filter: "brightness(0) invert(1)" }}
        />

        <p className="mt-6 text-sm tracking-wide text-brand-bg/70">
          Caracas · Venezuela
          <span className="mx-2 text-brand-bg/30">—</span>
          <span className="font-script text-lg text-brand-bg/90">{siteConfig.slogan}</span>
        </p>

        <div className="mx-auto my-9 h-px w-16 bg-white/15" />

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs tracking-widest uppercase">
          {navLinks.map((item, i) => (
            <span key={item.href} className="flex items-center gap-x-5">
              {i > 0 && <span aria-hidden className="text-white/20">·</span>}
              <Link href={item.href} className="text-brand-bg/75 transition hover:text-white">
                {item.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="mt-9 space-y-1.5 text-sm text-brand-bg/60">
          <p>{siteConfig.contact.address}</p>
          <p>
            <a href={`tel:+${siteConfig.contact.whatsappNumber}`} className="transition hover:text-brand-bg">
              {siteConfig.contact.whatsappDisplay}
            </a>
            <span className="mx-2 text-white/20">·</span>
            <span>{siteConfig.contact.phoneAltDisplay}</span>
          </p>
          <p>
            <a href={`mailto:${siteConfig.contact.email}`} className="transition hover:text-brand-bg">
              {siteConfig.contact.email}
            </a>
          </p>
          <p>{siteConfig.contact.hours}</p>
        </div>

        <div className="mt-9 flex items-center justify-center gap-4">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${siteConfig.social.instagramHandle}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-brand-bg/80 transition hover:border-white hover:text-white"
          >
            <InstagramIcon />
          </a>
          <a
            href={buildWhatsAppLink("Hola, quiero más información sobre Quality Bikes.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-brand-bg/80 transition hover:border-white hover:text-white"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-6 text-center text-xs text-brand-bg/40">
        © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
