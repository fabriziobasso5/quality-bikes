import { siteConfig } from "@/lib/site-config";

/**
 * Botón flotante de Instagram, gemelo del de WhatsApp y justo encima de él
 * (misma esquina, apilado, sin solaparse). Degradado de marca de Instagram.
 */
export default function InstagramFloat() {
  return (
    <a
      href={siteConfig.social.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Instagram ${siteConfig.social.instagramHandle}`}
      className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 transition hover:scale-105"
      style={{
        backgroundImage:
          "linear-gradient(45deg, #FEDA75 0%, #FA7E1E 25%, #D62976 55%, #962FBF 80%, #4F5BD5 100%)",
        right: "calc(1.25rem + env(safe-area-inset-right))",
        // Justo arriba del de WhatsApp (h-14 = 3.5rem + separación de 0.75rem).
        bottom: "calc(5.5rem + env(safe-area-inset-bottom))",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5.2" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    </a>
  );
}
