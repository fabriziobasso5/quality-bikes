#!/usr/bin/env node
/**
 * Versiones livianas de las fotos del sitio, generadas al compilar.
 *
 * Las fotos originales del repo (public/images/…) se quedan como están: son
 * la "fuente". Antes de cada build (y de cada `npm run dev`) este script crea
 * a partir de ellas copias más pequeñas en varios anchos — 320, 480, 640… px —
 * en AVIF y/o WebP, y el navegador del visitante elige la que le hace falta
 * según el tamaño de su pantalla (srcset + sizes en <Foto>). Un teléfono baja
 * una foto de ~30 KB en vez del original de ~180 KB.
 *
 *   public/v/…                   las versiones (NO van a git: .gitignore)
 *   src/generated/fotos.json     índice que lee <Foto>: huella, anchos, tamaño
 *   .next/cache/qb-fotos/        caché entre builds (Vercel la conserva), así
 *                                solo se recodifica lo que cambió
 *
 * No se usa el optimizador de imágenes de Vercel (/_next/image): el cupo de la
 * cuenta está agotado y en otras webs eso dejó todas las fotos rotas.
 *
 * El nombre de cada versión lleva una huella del contenido del original
 * (p. ej. voge-cu-250.3f9a1c2e-640.avif). Si una foto se reemplaza, cambia la
 * huella y con ella la dirección: por eso se pueden servir con caché de un año
 * ("immutable") sin que nadie vea una foto vieja.
 *
 * Uso:  node scripts/variantes-fotos.mjs
 */

import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { dirname, extname, join, relative } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC = join(ROOT, "public");
const OUT = join(PUBLIC, "v");
const CACHE = join(ROOT, ".next", "cache", "qb-fotos");
const INDEX = join(ROOT, "src", "generated", "fotos.json");

// Se sube si cambian calidades o anchos: invalida la caché entera.
const VERSION = "1";

/**
 * Grupos de fotos. `avif`: además de WebP se genera AVIF (≈30 % menos peso;
 * solo en las fotos que se ven en la portada y el catálogo, porque codificar
 * AVIF es lento y la máquina de build de Vercel tiene 2 núcleos).
 * `color`: guarda el color medio de la foto para pintarlo mientras carga.
 */
const GROUPS = [
  // Portadas del catálogo: 1600x1200, moto sobre blanco.
  { dir: "images/catalog", widths: [320, 480, 640, 960, 1280, 1600], avif: true, q: { avif: 58, webp: 80 } },
  // Moto de la portada (plano): PNG transparente pasado a webp, con alfa.
  { dir: "images/blueprint", widths: [480, 640, 960, 1280, 1600], avif: true, q: { avif: 64, webp: 86 } },
  // Fotos a sangre.
  { dir: "images/lifestyle", widths: [640, 960, 1280, 1600, 2400], avif: true, q: { avif: 55, webp: 78 }, color: true },
  // Galerías de las fichas (fotos reales del showroom y de prensa).
  { dir: "images/inventory", widths: [160, 320, 480, 640, 960, 1280, 1600], avif: false, q: { webp: 78 }, color: true },
  // Productos de la tienda (sobre blanco).
  { dir: "images/products", widths: [240, 480, 800], avif: false, q: { webp: 80 } },
  // Logos de marcas: se muestran pequeños, pero algunos PNG pesan 240 KB.
  { dir: "images/brands", widths: [240, 480, 960], avif: false, q: { webp: 88 } },
  { dir: "images/brands-motos", widths: [240, 480], avif: false, q: { webp: 88 } },
  // Textura de fibra de carbono de cabecera, tienda y pie. Va bajo un velo
  // negro al 55 %: a calidad 50 es indistinguible del JPG original (262 KB).
  { file: "images/carbono-forjado.jpg", widths: [640, 960, 1600], avif: false, q: { webp: 50 } },
];

const EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);

function walk(dir) {
  const abs = join(PUBLIC, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true }).flatMap((d) => {
    const rel = `${dir}/${d.name}`;
    if (d.isDirectory()) return walk(rel);
    return EXT.has(extname(d.name).toLowerCase()) ? [rel] : [];
  });
}

const jobs = [];
for (const g of GROUPS) {
  for (const rel of g.file ? [g.file] : walk(g.dir)) jobs.push({ rel, g });
}

const widthSets = [];
const setIndex = (ws) => {
  const key = ws.join(",");
  let i = widthSets.findIndex((s) => s.join(",") === key);
  if (i < 0) i = widthSets.push(ws) - 1;
  return i;
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(CACHE, { recursive: true });
mkdirSync(dirname(INDEX), { recursive: true });

const index = {};
let encoded = 0;
let reused = 0;
const t0 = Date.now();

async function run({ rel, g }) {
  const buf = readFileSync(join(PUBLIC, rel));
  const hash = createHash("sha1").update(VERSION).update(JSON.stringify(g.q)).update(buf).digest("hex").slice(0, 8);
  // rotate() sin argumentos aplica la orientación EXIF: nada sale de lado.
  const meta = await sharp(buf).rotate().metadata();
  const autoOriented = meta.orientation && meta.orientation >= 5;
  const W = autoOriented ? meta.height : meta.width;
  const H = autoOriented ? meta.width : meta.height;
  // Nunca se amplía: los anchos mayores que el original se cambian por el
  // ancho del original.
  const widths = [...new Set(g.widths.map((w) => Math.min(w, W)))].sort((a, b) => a - b);
  const base = rel.slice(0, -extname(rel).length);
  const formats = g.avif ? ["avif", "webp"] : ["webp"];

  for (const w of widths) {
    for (const f of formats) {
      const name = `${base}.${hash}-${w}.${f}`;
      const dst = join(OUT, name);
      const cached = join(CACHE, name.replaceAll("/", "__"));
      mkdirSync(dirname(dst), { recursive: true });
      if (existsSync(cached)) {
        copyFileSync(cached, dst);
        reused++;
        continue;
      }
      let img = sharp(buf).rotate().resize({ width: w, withoutEnlargement: true });
      img = f === "avif" ? img.avif({ quality: g.q.avif, effort: 4 }) : img.webp({ quality: g.q.webp, effort: 5, smartSubsample: true });
      await img.toFile(dst);
      copyFileSync(dst, cached);
      encoded++;
    }
  }

  const entry = [hash, setIndex(widths), g.avif ? 1 : 0, W, H];
  if (g.color) {
    // Color medio (no el "dominante", que redondea a tonos extremos).
    const { channels } = await sharp(buf).stats();
    const hex = (c) => Math.round(c.mean).toString(16).padStart(2, "0");
    entry.push(`#${hex(channels[0])}${hex(channels[1])}${hex(channels[2])}`);
  }
  index[`/${rel}`] = entry;
}

// Cola con tantos trabajos en paralelo como núcleos.
const queue = [...jobs];
const workers = Array.from({ length: Math.max(1, cpus().length) }, async () => {
  while (queue.length) await run(queue.shift());
});
await Promise.all(workers);

const sorted = Object.fromEntries(Object.entries(index).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(INDEX, JSON.stringify({ sets: widthSets, fotos: sorted }) + "\n");

const kb = (n) => `${Math.round(n / 1024)} KB`;
let total = 0;
const sizeOf = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? sizeOf(join(d, e.name)) : (total += statSync(join(d, e.name)).size)));
sizeOf(OUT);
console.log(
  `variantes-fotos: ${jobs.length} fotos → ${encoded} versiones nuevas, ${reused} desde caché (${kb(total)} en ${relative(ROOT, OUT)}) en ${((Date.now() - t0) / 1000).toFixed(1)} s`
);
