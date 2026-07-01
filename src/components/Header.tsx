import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import MobileMenu from "./MobileMenu";

const navItems = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-brand-bg/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center" aria-label={siteConfig.name}>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
          <img
            src="/assets/logo/quality-bikes-isotipo-qb.svg"
            alt={siteConfig.name}
            className="h-9 w-auto md:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
          <img
            src="/assets/logo/quality-bikes-logo-color.svg"
            alt={siteConfig.name}
            className="hidden h-11 w-auto md:block"
          />
        </Link>
        <nav className="hidden gap-8 text-sm tracking-wide uppercase md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-brand-text/70 transition hover:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/catalogo"
          className="hidden rounded-full bg-brand-navy px-5 py-2 text-xs tracking-widest uppercase text-brand-bg transition hover:bg-brand-navy-soft md:inline-block"
        >
          Ver inventario
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}
