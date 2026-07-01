import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-brand-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="inline-block rounded bg-brand-bg px-3 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
            <img
              src="/assets/logo/quality-bikes-logo-color.svg"
              alt={siteConfig.name}
              className="h-8 w-auto"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm text-brand-bg/60">{siteConfig.tagline}</p>
        </div>

        <div>
          <p className="text-xs tracking-widest text-brand-red uppercase">Navegación</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-bg/70">
            <li><Link href="/catalogo" className="hover:text-brand-red">Catálogo</Link></li>
            <li><Link href="/financiamiento" className="hover:text-brand-red">Financiamiento</Link></li>
            <li><Link href="/nosotros" className="hover:text-brand-red">Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-brand-red">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-widest text-brand-red uppercase">Contacto</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-bg/70">
            <li>{siteConfig.contact.address}</li>
            <li>{siteConfig.contact.whatsappDisplay}</li>
            <li>{siteConfig.contact.phoneAltDisplay}</li>
            <li>{siteConfig.contact.email}</li>
            <li>{siteConfig.contact.hours}</li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-widest text-brand-red uppercase">Síguenos</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-bg/70">
            <li>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">
                Instagram ({siteConfig.social.instagramHandle})
              </a>
            </li>
            <li>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-brand-bg/40">
        © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
