import Link from "next/link";
import OpenCatalogButton from "@/components/OpenCatalogButton";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

// Enlaces del footer distintos de "Catálogo" (ese abre el mega-menú, no navega).
const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

// Instagram (outline, con el degradado de marca en el trazo).
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <defs>
        <linearGradient id="ig-grad-footer" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#F58529" />
          <stop offset="0.3" stopColor="#DD2A7B" />
          <stop offset="0.6" stopColor="#8134AF" />
          <stop offset="1" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="url(#ig-grad-footer)" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="url(#ig-grad-footer)" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="url(#ig-grad-footer)" />
    </svg>
  );
}

// WhatsApp (outline, verde de marca).
function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#25D366"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 0 0-7.74 13.58L3 21l4.53-1.23A9 9 0 1 0 12 3z" />
      <path d="M9 8.4c0 4 2.6 6.6 6.6 6.6a.9.9 0 0 0 .9-.9v-1.3c0-.42-.3-.78-.72-.88l-1.4-.3c-.3-.06-.6.03-.8.24l-.4.42a5.7 5.7 0 0 1-2.6-2.6l.42-.4c.2-.2.3-.5.24-.8l-.3-1.4A.9.9 0 0 0 10.06 6.5H9.9A.9.9 0 0 0 9 7.4z" />
    </svg>
  );
}

/**
 * Footer sobre fibra de carbono forjada (oscuro, sutil) con el logo en versión
 * clara y el texto claro. Diseño centrado y simétrico también en móvil. Íconos
 * sociales de línea con sus colores de marca (WhatsApp verde, Instagram
 * degradado) como toque de color.
 */
export default function Footer() {
  const socialClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] transition hover:border-white/40 hover:bg-white/[0.06]";

  return (
    // Base carbón MUY oscura: la legibilidad manda. La textura forjada va encima
    // pero nunca aclara el fondo lo suficiente para estorbar al logo/el texto.
    <footer className="relative overflow-hidden bg-[#0d0f11] text-brand-bg">
      {/* Fibra de carbono forjada: foto real de la textura, UNA sola imagen con
          background-size: cover y no-repeat → sin costuras ni rayas. Cubre todo
          el ancho del footer, igual en móvil y desktop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${withBasePath("/images/carbono-forjado.jpg")}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      {/* Velo oscuro semitransparente encima de la textura: asegura el contraste
          del logo claro y el texto. Es un tinte mate, no un brillo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/55"
      />
      {/* Viñeta sutil hacia los bordes para dar profundidad sin aclarar el centro. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 0%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-16 text-center sm:py-20">
        {/* Logo en versión clara (blanco) sobre el carbón */}
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
        <img
          src={withBasePath("/assets/logo/quality-bikes-logo-venezuela.svg")}
          alt={siteConfig.name}
          className="h-20 w-auto max-w-full sm:h-24"
          style={{ filter: "brightness(0) invert(1)" }}
        />

        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 text-[11px] tracking-[0.12em] uppercase sm:gap-x-7 sm:tracking-[0.2em]">
          {/* Catálogo abre el MISMO mega-menú Ducati que el nav/hero/showroom. */}
          <OpenCatalogButton className="text-brand-bg/70 uppercase transition hover:text-brand-bg">
            Catálogo
          </OpenCatalogButton>
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-brand-bg/70 transition hover:text-brand-bg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${siteConfig.social.instagramHandle}`}
            className={socialClass}
          >
            <InstagramIcon />
          </a>
          <a
            href={buildWhatsAppLink("Hola, quiero más información sobre Quality Bikes.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className={socialClass}
          >
            <WhatsAppIcon />
          </a>
        </div>

        {/* Contacto apilado y centrado: simétrico en cualquier ancho. */}
        <div className="mt-8 flex flex-col items-center gap-1 text-xs text-brand-bg/50">
          <span>{siteConfig.contact.address}</span>
          <span className="flex flex-wrap items-center justify-center gap-x-2">
            <a href={`tel:+${siteConfig.contact.whatsappNumber}`} className="transition hover:text-brand-bg">
              {siteConfig.contact.whatsappDisplay}
            </a>
            <span aria-hidden className="text-white/20">·</span>
            <a href={`mailto:${siteConfig.contact.email}`} className="transition hover:text-brand-bg">
              {siteConfig.contact.email}
            </a>
          </span>
        </div>

        <p className="mt-8 text-[11px] tracking-wide text-brand-bg/35">
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
