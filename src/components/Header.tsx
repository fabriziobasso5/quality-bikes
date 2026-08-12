"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import MotoCover from "./MotoCover";
import { motorcycles } from "@/data/motorcycles";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";
import { rememberBackTarget } from "@/lib/back-target";
import {
  closeCatalogPanel,
  isCatalogOpen,
  notifyCatalogHistoryChanged,
  openCatalogPanel,
  subscribeToCatalogHistory,
} from "@/lib/catalog-panel";

const PANEL_SCROLL_KEY = "qb:catalog-scroll";

const navItems = [
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Ducati-style mega menu: "Catálogo" abre un panel blanco a todo el ancho con
 * todas las motos. Click-driven (como Ducati) en vez de hover: sin aperturas
 * accidentales y con soporte de teclado. "Productos" es un link normal a la
 * página real /productos (tiene su propia página con las 5 marcas, no
 * necesita un panel propio aquí).
 */
export default function Header() {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  // Que el panel esté abierto se LEE de la URL, no se guarda: el historial es
  // la única fuente de verdad, así que volver atrás y abrirlo a mano llegan al
  // mismo sitio por el mismo camino.
  const catalogOpen = useSyncExternalStore(
    subscribeToCatalogHistory,
    isCatalogOpen,
    () => false // en el servidor no hay URL del cliente: nace cerrado
  );

  // Navegar a otra página también cambia la URL (se va el hash y el panel debe
  // cerrarse), pero Next lo hace con pushState, que no dispara popstate: sin
  // este aviso la suscripción no se entera y el panel se queda montado y
  // "abierto" encima de la página nueva.
  useEffect(notifyCatalogHistoryChanged, [pathname]);

  // Navegar DESDE el panel lo oculta en el acto tocando el DOM, sin pasar por
  // el estado: la parada del historial tiene que sobrevivir (es lo que permite
  // volver), y esperar al cambio de ruta dejaba 0.22s de salida animada
  // cruzándose con la entrada de la página nueva — el click parecía no hacer
  // nada.
  //
  // Se oculta con opacidad, NO con display:none ni visibility:hidden: con esas
  // dos el navegador deja de animar el elemento, la salida de AnimatePresence
  // no termina nunca y el panel se quedaba montado para siempre — invisible,
  // pero con todos sus enlaces en el DOM. La opacidad la anima framer de todas
  // formas al salir, así que el panel se desmonta solo y se lleva estos estilos.
  function hideCatalog() {
    const el = panelRef.current;
    if (!el) return;
    // La altura se apunta AQUÍ, al salir, y no escuchando el scroll: es el
    // único instante que importa y evita depender de un evento que en el panel
    // no siempre llega.
    sessionStorage.setItem(PANEL_SCROLL_KEY, String(el.scrollTop));
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
  }

  useEffect(() => {
    window.addEventListener("qb:open-catalog", openCatalogPanel);
    return () => window.removeEventListener("qb:open-catalog", openCatalogPanel);
  }, []);

  useEffect(() => {
    if (!catalogOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCatalogPanel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [catalogOpen]);

  // Devuelve el panel a la altura en la que se dejó: "volver al catálogo" tiene
  // que caer en la misma moto que se estaba mirando, no al principio de la
  // rejilla.
  useEffect(() => {
    const el = panelRef.current;
    if (!catalogOpen || !el) return;
    const saved = Number(sessionStorage.getItem(PANEL_SCROLL_KEY) ?? 0);
    if (saved > 0) el.scrollTop = saved;
  }, [catalogOpen, pathname]);

  function toggle() {
    if (catalogOpen) closeCatalogPanel();
    else openCatalogPanel();
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Misma familia visual que el footer: fibra de carbono forjada con un
          velo oscuro + viñeta radial encima. Sin overflow-hidden aquí: cada
          capa de fondo ya es "absolute inset-0" (se recorta sola a su caja,
          no necesita el contenedor) y el panel del menú móvil, que sí es
          descendiente de este div, necesita poder desbordar hacia abajo. */}
      <div className="relative bg-[#0d0f11]">
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
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(120% 85% at 50% 0%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* items-center: los cuatro accesos del nav quedan a media altura del
            header, no pegados arriba. Como el bloque del logo puede crecer con
            la flecha, centrar es lo único que los mantiene entre techo y piso. */}
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* items-center: la flecha va centrada bajo el logo, no alineada a su
              borde izquierdo. */}
          <div className="flex shrink-0 flex-col items-center">
            {/* Anchor plano en vez de next/link: navegación dura al home con el
                basePath ya resuelto — funciona desde cualquier subpágina de
                GitHub Pages sin depender del estado del router del cliente. */}
            <a href={withBasePath("/")} className="flex items-center" aria-label={siteConfig.name}>
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
              <img
                src={withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg")}
                alt={siteConfig.name}
                className="h-10 w-auto md:hidden"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
              <img
                src={withBasePath("/assets/logo/quality-bikes-logo-venezuela.svg")}
                alt={siteConfig.name}
                className="hidden h-16 w-auto md:block"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </a>

            {/* Vuelta a la portada. El logo ya lleva al inicio, pero eso no se
                ve: la flecha lo dice. Aparece en los cuatro apartados — y eso
                incluye el catálogo abierto SOBRE la portada, donde el pathname
                sigue siendo "/" pero el visitante ya no está viendo la portada
                sino el panel, y necesita la misma salida. */}
            {(!isHome || catalogOpen) && (
              <a
                href={withBasePath("/")}
                aria-label="Ir a la página principal"
                className="group mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-white/45 transition hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M15 4 7 12l8 8" />
                </svg>
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase">Inicio</span>
              </a>
            )}
          </div>

          <nav className="hidden items-center gap-8 font-display text-base tracking-wide uppercase md:flex">
            <button
              onClick={toggle}
              aria-expanded={catalogOpen}
              aria-controls="mega-catalogo"
              className={`uppercase tracking-wide transition ${
                catalogOpen ? "text-brand-red" : "text-white/85 hover:text-brand-red"
              }`}
            >
              Catálogo
            </button>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                // Cierra el panel de Catálogo YA al hacer click, en vez de
                // esperar a que cambie el pathname: si no, la salida
                // animada del panel (0.22s) se cruza con la entrada de la
                // página nueva y el click "parece" no hacer nada.
                onClick={hideCatalog}
                className="text-white/85 transition hover:text-brand-red"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <MobileMenu />
        </div>
      </div>

      {/* Invisible catch-all behind the panel: outside click closes. Fuera del
          AnimatePresence y sin animación: no la necesita, y como hijo directo
          obligaría a envolver todo en un fragmento — y AnimatePresence no sabe
          seguir la salida de un fragmento, así que el panel no llegaba a
          desmontarse nunca y se quedaba en la página con todos sus enlaces. */}
      {catalogOpen && (
        <div
          className="fixed inset-0 z-[-1] hidden cursor-default md:block"
          onClick={closeCatalogPanel}
          aria-hidden
        />
      )}

      {/* Sin AnimatePresence: su salida animada terminaba pero nunca llegaba a
          retirar el nodo, y el panel se quedaba para siempre en la página —
          invisible, pero con sus enlaces dentro, robándole los clicks a los de
          la página de debajo. Se monta y se desmonta a secas; la entrada sí se
          anima, que es la que se ve. */}
      {catalogOpen && (
            <motion.div
                id="mega-catalogo"
                ref={panelRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                // Solo escritorio: en el teléfono el catálogo se despliega
                // dentro del menú de la hamburguesa, y como los dos leen la
                // misma parada del historial, sin esto saldrían a la vez.
                className="absolute inset-x-0 top-full hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-black/10 bg-white shadow-xl shadow-black/5 md:block"
              >
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-8">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4">
                    {motorcycles.map((moto) => (
                      <Link
                        key={moto.slug}
                        href={`/catalogo/${moto.slug}`}
                        onClick={() => {
                          rememberBackTarget(`/catalogo/${moto.slug}`, "catalogo");
                          hideCatalog();
                        }}
                        className="group text-center"
                      >
                        <div className="relative">
                          <MotoCover
                            moto={moto}
                            className="mx-auto aspect-[4/3] w-full overflow-hidden"
                            imgClassName="transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 45vw, 220px"
                          />
                          {moto.availability === "proximo-arribo" && (
                            <span className="absolute top-1.5 left-1.5 rounded-full border border-brand-red/40 bg-white/90 px-2 py-0.5 text-[8px] tracking-[0.18em] text-brand-red uppercase">
                              Próximo arribo
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-[11px] tracking-widest text-brand-text/50 uppercase">
                          {moto.brand}
                        </p>
                        <p className="font-display text-sm tracking-wide uppercase text-brand-text group-hover:text-brand-red">
                          {moto.model}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center border-t border-black/10 pt-6">
                    <Link
                      href="/catalogo/inventario"
                      onClick={() => {
                        rememberBackTarget("/catalogo/inventario", "catalogo");
                        hideCatalog();
                      }}
                      className="rounded-full bg-brand-navy px-8 py-3 text-xs tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
                    >
                      Ver inventario completo →
                    </Link>
                  </div>
                </div>
            </motion.div>
      )}
    </header>
  );
}
