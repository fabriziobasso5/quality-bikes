"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Foto from "./Foto";
import MotoCover from "./MotoCover";
import {
  estadoDe,
  estadoLabels,
  tipoDe,
  tipoLabels,
  type Estado,
  type Motorcycle,
  type Tipo,
} from "@/data/motorcycles";
import { buildWhatsAppLink } from "@/lib/site-config";
import { rememberBackTarget, type BackTarget } from "@/lib/back-target";

/**
 * Catálogo compacto con filtros: rejilla de tarjetas (2 por fila en el
 * teléfono, 3 en tablet, 4 en computadora), barra de filtros que se queda
 * pegada bajo el encabezado al bajar, buscador por texto y contador.
 *
 * Las marcas y los tipos salen de los datos reales (src/data/motorcycles.ts):
 * al sumar una moto de una marca nueva, su botón aparece solo.
 */

const ORDEN_ESTADO: Estado[] = ["nueva", "usada", "proximo-arribo"];

// Logos de las marcas (public/images/brands-motos, fondo transparente). Una
// marca sin logo aquí sale solo con su nombre.
const LOGOS: Record<string, string> = {
  BMW: "/images/brands-motos/bmw.webp",
  Ducati: "/images/brands-motos/ducati.webp",
  Kawasaki: "/images/brands-motos/kawasaki.webp",
  Suzuki: "/images/brands-motos/suzuki.webp",
  Voge: "/images/brands-motos/voge.webp",
  Yamaha: "/images/brands-motos/yamaha.webp",
};

// Normaliza para buscar sin importar tildes, guiones ni mayúsculas:
// "vstrom", "V-Strom" y "v strom" encuentran la misma moto.
const normal = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

function Chip({
  active,
  onClick,
  children,
  logo,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  logo?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 text-[11px] tracking-[0.12em] whitespace-nowrap uppercase transition ${
        logo ? "pr-3.5 pl-1.5" : "px-3.5"
      } ${
        active
          ? "border-brand-navy bg-brand-navy text-white"
          : "border-black/12 bg-white text-brand-text/70 hover:border-brand-navy/50 hover:text-brand-navy"
      }`}
    >
      {/* El logo va en su círculo blanco: así se lee también con el botón
          activo (azul marino), aunque el logo sea negro. */}
      {logo && (
        <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white">
          <Foto src={logo} alt="" fill sizes="24px" className="object-contain p-[3px]" />
        </span>
      )}
      {children}
    </button>
  );
}

function Separador({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2 pl-2 font-mono text-[9px] tracking-[0.2em] text-brand-text/35 uppercase">
      <span aria-hidden className="h-4 w-px bg-black/10" />
      {label}
    </span>
  );
}

const etiquetaEstado: Record<Estado, string> = {
  nueva: "border-brand-navy/30 text-brand-navy",
  usada: "border-brand-taupe/70 text-[#6f6765]",
  "proximo-arribo": "border-brand-red/45 text-brand-red",
};

function Tarjeta({ moto, origin }: { moto: Motorcycle; origin: BackTarget }) {
  const label = `${moto.brand} ${moto.model}`;
  const estado = estadoDe(moto);
  const href = `/catalogo/${moto.slug}`;
  return (
    <article className="group relative flex flex-col">
      <Link
        href={href}
        onClick={() => rememberBackTarget(href, origin)}
        className="block"
        aria-label={`${label} — ver ficha`}
      >
        {/* Producto sobre blanco con sombra suave de piso, estilo CAKE */}
        <div className="relative overflow-hidden rounded-lg border border-black/[0.06] bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-navy/25 group-hover:shadow-[0_18px_40px_-20px_rgba(0,52,98,0.45)]">
          <MotoCover
            moto={moto}
            className="aspect-[4/3] w-full"
            imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) calc(50vw - 28px), (max-width: 1024px) 31vw, 300px"
          />
          <span
            className={`absolute top-2 left-2 rounded-full border bg-white/95 px-2 py-0.5 font-mono text-[8.5px] tracking-[0.14em] uppercase sm:text-[9px] ${etiquetaEstado[estado]}`}
          >
            {estadoLabels[estado]}
          </span>
        </div>
        <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-brand-text/50 uppercase">
          {moto.brand}
        </p>
        <h3 className="mt-0.5 font-display text-[15px] leading-snug tracking-wide uppercase transition group-hover:text-brand-red sm:text-lg">
          {moto.model}
        </h3>
      </Link>
      <div className="mt-2 flex items-center justify-between gap-2">
        <Link
          href={href}
          onClick={() => rememberBackTarget(href, origin)}
          className="text-[11px] tracking-[0.12em] text-brand-navy uppercase hover:text-brand-red"
          tabIndex={-1}
        >
          Ver ficha →
        </Link>
        <a
          href={buildWhatsAppLink(`Hola, me interesa la ${label} disponible en Quality Bikes.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar la ${label} por WhatsApp`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#1faa53] transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.888.51 3.716 1.476 5.318L2 22l4.828-1.442a9.96 9.96 0 0 0 5.176 1.442h.004c5.518 0 10.004-4.486 10.004-10.004C22.012 6.486 17.526 2 12.004 2zm0 18.176a8.14 8.14 0 0 1-4.152-1.136l-.298-.177-2.868.856.86-2.797-.194-.287a8.15 8.15 0 0 1-1.242-4.335c0-4.51 3.67-8.18 8.18-8.18a8.13 8.13 0 0 1 5.786 2.398 8.13 8.13 0 0 1 2.395 5.784c0 4.51-3.67 8.18-8.18 8.18z" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function CatalogoMotos({
  motos,
  origin = "inventario",
}: {
  motos: Motorcycle[];
  origin?: BackTarget;
}) {
  const [marca, setMarca] = useState<string | null>(null);
  const [tipo, setTipo] = useState<Tipo | null>(null);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [texto, setTexto] = useState("");
  // Alto del encabezado fijo: la barra de filtros se pega justo debajo.
  const [topHeader, setTopHeader] = useState(72);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const medir = () => setTopHeader(header.getBoundingClientRect().height);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Primero lo que está en el showroom (nuevas, luego usadas) y al final las
  // de próximo arribo; dentro de cada grupo, el orden de los datos.
  const ordenadas = useMemo(
    () =>
      [...motos].sort(
        (a, b) => ORDEN_ESTADO.indexOf(estadoDe(a)) - ORDEN_ESTADO.indexOf(estadoDe(b))
      ),
    [motos]
  );
  const marcas = useMemo(() => [...new Set(motos.map((m) => m.brand))].sort(), [motos]);
  const tipos = useMemo(
    () => (Object.keys(tipoLabels) as Tipo[]).filter((t) => motos.some((m) => tipoDe(m) === t)),
    [motos]
  );
  const estados = useMemo(
    () => ORDEN_ESTADO.filter((e) => motos.some((m) => estadoDe(m) === e)),
    [motos]
  );

  const q = normal(texto);
  const visibles = ordenadas.filter(
    (m) =>
      (!marca || m.brand === marca) &&
      (!tipo || tipoDe(m) === tipo) &&
      (!estado || estadoDe(m) === estado) &&
      (!q || normal(`${m.brand} ${m.model} ${m.brand}`).includes(q) || normal(m.model).includes(q))
  );
  const hayFiltro = Boolean(marca || tipo || estado || q);
  const limpiar = () => {
    setMarca(null);
    setTipo(null);
    setEstado(null);
    setTexto("");
  };

  return (
    <div>
      <div
        className="sticky z-30 -mx-6 border-b border-black/[0.07] bg-white/95 px-6 pt-3 pb-3 backdrop-blur-md sm:mx-0 sm:rounded-b-xl sm:px-4"
        style={{ top: topHeader }}
      >
        <div className="flex items-center gap-3">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Buscar por marca o modelo</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brand-text/40"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Buscar marca o modelo"
              enterKeyHint="search"
              className="w-full rounded-full border border-black/12 bg-white py-2 pr-3 pl-9 text-[16px] text-brand-text placeholder:text-brand-text/40 focus:border-brand-navy focus:outline-none sm:text-sm"
            />
          </label>
          <p className="shrink-0 font-mono text-xs text-brand-text/60" aria-live="polite">
            {visibles.length} {visibles.length === 1 ? "moto" : "motos"}
          </p>
        </div>

        {/* Una sola fila de chips que se desliza de lado en el teléfono */}
        <div className="hide-scrollbar -mx-6 mt-3 flex items-center gap-2 overflow-x-auto px-6 sm:-mx-4 sm:px-4 lg:mx-0 lg:flex-wrap lg:px-0">
          <Chip active={!hayFiltro} onClick={limpiar}>
            Todas
          </Chip>
          <Separador label="Marca" />
          {marcas.map((b) => (
            <Chip key={b} logo={LOGOS[b]} active={marca === b} onClick={() => setMarca(marca === b ? null : b)}>
              {b}
            </Chip>
          ))}
          <Separador label="Tipo" />
          {tipos.map((t) => (
            <Chip key={t} active={tipo === t} onClick={() => setTipo(tipo === t ? null : t)}>
              {tipoLabels[t]}
            </Chip>
          ))}
          <Separador label="Estado" />
          {estados.map((e) => (
            <Chip key={e} active={estado === e} onClick={() => setEstado(estado === e ? null : e)}>
              {estadoLabels[e]}
            </Chip>
          ))}
        </div>
      </div>

      {visibles.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {visibles.map((m) => (
            <Tarjeta key={m.slug} moto={m} origin={origin} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-black/[0.07] bg-brand-bg-soft px-6 py-10 text-center">
          <p className="font-display text-xl tracking-wide uppercase">¿No encuentras lo que buscas?</p>
          <p className="mt-3 text-sm text-brand-text/65">
            Escríbenos: te contamos qué tenemos en camino y te avisamos cuando llegue.
          </p>
          <a
            href={buildWhatsAppLink(
              `Hola, estoy buscando una moto${texto ? ` (${texto})` : ""} y no la encontré en la web.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-navy px-7 py-3 text-xs tracking-widest text-white uppercase transition hover:bg-brand-navy-soft"
          >
            Escríbenos por WhatsApp
          </a>
          <button
            type="button"
            onClick={limpiar}
            className="mt-4 block w-full text-[11px] tracking-[0.14em] text-brand-text/50 uppercase hover:text-brand-red"
          >
            Ver todas las motos
          </button>
        </div>
      )}
    </div>
  );
}
