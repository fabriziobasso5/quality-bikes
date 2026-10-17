import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

// Vista previa al compartir un link por WhatsApp, Instagram, iMessage, etc.
// Las imágenes las genera scripts/make-og-images.mjs en public/og/ (1200x630,
// JPEG liviano: WhatsApp descarta las pesadas). Si una página todavía no tiene
// la suya — una moto recién añadida antes de correr el script —, sale la
// general en vez de un link sin foto.
const FALLBACK = "/og/home.jpg";

export function shareMetadata({
  title,
  description,
  path,
  image,
  alt,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  alt: string;
}): Pick<Metadata, "openGraph" | "twitter" | "alternates"> {
  const file = image && existsSync(join(process.cwd(), "public", image)) ? image : FALLBACK;
  return {
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "es_VE",
      type: "website",
      images: [{ url: file, width: 1200, height: 630, alt, type: "image/jpeg" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [file] },
  };
}
