#!/usr/bin/env node
/**
 * Genera las imágenes de vista previa (Open Graph) que salen al compartir un
 * link del sitio por WhatsApp, Instagram, iMessage, etc.
 *
 *   public/og/home.jpg                  portada, nosotros, contacto, inventario
 *   public/og/productos.jpg             /productos
 *   public/og/motos/<slug>.jpg          una por moto del catálogo
 *   public/og/productos/<marca>.jpg     una por marca de la tienda
 *
 * Cada imagen se diseña como una página HTML con las tipografías y colores de
 * la marca, se fotografía con Chromium al doble de resolución y se reduce a
 * 1200x630 (el formato estándar de las vistas previas) en JPEG. WhatsApp no
 * muestra imágenes pesadas: se apunta a menos de ~300 KB.
 *
 * Al añadir una moto o una marca nueva hay que volver a correrlo:
 *   npm run og                 (todas)
 *   npm run og -- voge-cu-625  (solo las que coincidan)
 * Mientras una página no tenga su imagen, usa la general (ver src/lib/og.ts).
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { motorcycles } from "../src/data/motorcycles.ts";
import { productBrands } from "../src/data/products.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC = join(ROOT, "public");
const OUT = join(PUBLIC, "og");
const W = 1200;
const H = 630;
const filter = process.argv[2];

// Chromium que ya descarga Playwright. Se puede forzar otro con CHROME_PATH.
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = join(homedir(), "Library/Caches/ms-playwright");
  const dir = readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop();
  return join(cache, dir, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
}

const asset = (p) => pathToFileURL(join(PUBLIC, p)).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── Base común ────────────────────────────────────────────────────────────────
const BASE_CSS = `
:root { --navy:#003462; --red:#D51C29; --taupe:#A79F9D; --ink:#14181d; --gold:#B8912F; }
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:${W}px; height:${H}px; overflow:hidden; background:#fff; }
body { font-family:'Inter',sans-serif; color:var(--ink); -webkit-font-smoothing:antialiased; }
.mono { font-family:'Space Mono',monospace; }
.display { font-family:'Space Grotesk',sans-serif; }
.slogan { font-family:'Cormorant Garamond',serif; font-style:italic; font-weight:500; }
.white-logo { filter:brightness(0) invert(1); }
.eyebrow { display:flex; align-items:center; gap:12px; font-family:'Space Mono',monospace;
  font-size:13px; letter-spacing:.22em; text-transform:uppercase; color:var(--navy); }
.eyebrow::before { content:""; width:26px; height:2px; background:var(--red); }
`;
const FONTS = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Inter:wght@400;500&family=Montserrat:wght@400;500&family=Space+Grotesk:wght@400;500;600&family=Space+Mono:wght@400;700&display=block" rel="stylesheet">`;
const page = (css, body) =>
  `<!doctype html><html lang="es"><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}${css}</style></head><body>${body}</body></html>`;

// ── 1. General: el plano azul de la portada con la GS de luces ámbar ─────────
function homeHtml() {
  return page(
    `
body { background:#062a55; }
.bg { position:absolute; inset:0;
  background:
    radial-gradient(ellipse 34% 46% at 68% 54%, rgba(150,195,245,.42), transparent 72%),
    radial-gradient(ellipse 60% 70% at 70% 55%, rgba(80,140,210,.30), transparent 70%),
    linear-gradient(180deg,#0b3a72 0%,#072d5c 55%,#041d3d 100%); }
.grid { position:absolute; inset:0; opacity:.55;
  background-image:
    linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px),
    linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
  background-size:150px 150px,150px 150px,30px 30px,30px 30px; background-position:-1px -1px; }
.vignette { position:absolute; inset:0; background:radial-gradient(ellipse at center, transparent 50%, rgba(2,8,18,.55) 100%); }
.frame { position:absolute; inset:22px; border:1px solid rgba(255,255,255,.14); }
.top { position:absolute; top:46px; left:0; right:0; text-align:center; font-family:'Montserrat',sans-serif;
  font-weight:400; font-size:17px; letter-spacing:.62em; color:#E8323E; text-transform:uppercase; padding-left:.62em; }
.glow { position:absolute; left:850px; top:170px; width:300px; height:250px; border-radius:50%;
  background:radial-gradient(closest-side, rgba(255,150,40,.40), rgba(255,120,20,.12) 55%, transparent); filter:blur(10px); }
.floor { position:absolute; left:500px; top:500px; width:600px; height:30px; border-radius:50%;
  background:radial-gradient(closest-side, rgba(0,0,0,.55), transparent); filter:blur(6px); }
.bike { position:absolute; left:478px; top:136px; width:640px;
  filter:drop-shadow(0 0 1px rgba(170,205,245,.55)) drop-shadow(0 16px 26px rgba(0,0,0,.45)); }
.brand { position:absolute; left:74px; top:170px; width:330px; }
.brand img { width:300px; display:block; }
.rule { width:56px; height:2px; background:var(--red); margin:34px 0 22px; }
.slogan { font-size:44px; line-height:1.08; color:#fff; }
.foot { position:absolute; left:74px; right:74px; bottom:50px; display:flex; justify-content:space-between;
  font-family:'Space Mono',monospace; font-size:12.5px; letter-spacing:.24em; text-transform:uppercase; color:rgba(255,255,255,.62); }
`,
    `<div class="bg"></div><div class="grid"></div><div class="vignette"></div><div class="frame"></div>
<div class="top">Quality Bikes Venezuela · Caracas</div>
<div class="glow"></div><div class="floor"></div>
<img class="bike" src="${asset("images/blueprint/gs-adventure-719.webp")}">
<div class="brand"><img class="white-logo" src="${asset("assets/logo/quality-bikes-logo-venezuela.svg")}">
<div class="rule"></div><div class="slogan">…Mucho más<br>que solo motos.</div></div>
<div class="foot"><span>Motos de alta cilindrada</span><span>qualitybikesvzla.com</span></div>`
  );
}

// ── 2. Moto: ficha de lujo, la moto sobre blanco como en el catálogo ─────────
const LEFT_CSS = `
.left { position:absolute; left:0; top:0; bottom:0; width:470px; padding:56px 0 0 64px; }
.qb { height:62px; display:block; margin-left:-4px; }
.stage { position:absolute; left:470px; right:0; top:0; bottom:0;
  background:radial-gradient(ellipse 75% 70% at 52% 52%, #ffffff 0%, #f6f5f3 62%, #eceae7 100%); }
.stage::before { content:""; position:absolute; left:0; top:64px; bottom:64px; width:1px; background:rgba(0,0,0,.08); }
.base { position:absolute; left:0; right:0; bottom:0; height:7px; background:var(--navy); }
.base::after { content:""; position:absolute; left:0; top:0; bottom:0; width:200px; background:var(--red); }
.url { position:absolute; right:40px; bottom:26px; font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.2em;
  text-transform:uppercase; color:rgba(20,24,29,.42); }
.pill { display:inline-block; border-radius:999px; padding:9px 18px 8px; font-family:'Space Mono',monospace;
  font-size:12.5px; letter-spacing:.2em; text-transform:uppercase; }
.pill.navy { background:var(--navy); color:#fff; }
.pill.red { border:1.5px solid var(--red); color:var(--red); background:#fff; }
`;

function motoHtml(m) {
  const cw = m.colorways?.[0];
  // El distintivo sobra si el nombre del modelo ya lo dice.
  const special = Boolean(cw?.special) && !/black knight/i.test(m.model);
  const cover = cw?.lead ?? `/images/catalog/${m.slug}.webp`;
  const state = m.condition === "0km"
    ? "0 km"
    : `Seminueva${m.mileageKm ? ` · ${m.mileageKm.toLocaleString("es-VE")} km` : ""}`;
  const stats = [
    [String(m.cc), "cc", "Cilindrada"],
    [m.specs.power.replace(/\s*hp$/i, ""), "hp", "Potencia"],
    [(m.specs.weight ?? "—").replace(/\s*kg$/i, ""), "kg", "Peso"],
  ].filter(([v]) => v !== "—"); // sin dato oficial, mejor no mostrar un guion en un anuncio
  const len = m.model.length;
  const size = len <= 8 ? 62 : len <= 12 ? 54 : len <= 16 ? 46 : 40;
  const pill = m.availability === "proximo-arribo"
    ? `<span class="pill red">Próximo arribo</span>`
    : `<span class="pill navy">Disponible en showroom</span>`;
  return page(
    LEFT_CSS +
      `
.model { font-family:'Space Grotesk',sans-serif; font-weight:500; text-transform:uppercase; letter-spacing:.01em;
  font-size:${size}px; line-height:1.02; margin-top:14px; color:var(--ink); text-wrap:balance; max-width:380px; }
.meta { margin-top:16px; font-family:'Space Mono',monospace; font-size:15px; letter-spacing:.08em; color:rgba(20,24,29,.6); }
.special { margin-top:14px; display:inline-block; border:1px solid rgba(201,162,39,.6); color:#8A6D1F; border-radius:999px;
  padding:6px 14px 5px; font-family:'Space Mono',monospace; font-size:11.5px; letter-spacing:.22em; text-transform:uppercase; }
.stats { display:flex; gap:34px; margin-top:30px; padding-top:24px; border-top:1px solid rgba(0,0,0,.1); width:360px; }
.num { font-family:'Space Mono',monospace; font-size:34px; letter-spacing:-.02em; }
.num small { font-size:14px; color:rgba(20,24,29,.5); margin-left:4px; letter-spacing:0; }
.lab { margin-top:6px; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:rgba(20,24,29,.45); }
.cta { position:absolute; left:64px; bottom:58px; }
.bike { position:absolute; left:50%; top:50%; width:760px; transform:translate(-50%,-49%); mix-blend-mode:multiply; }
`,
    `<div class="left">
  <img class="qb" src="${asset("assets/logo/quality-bikes-logo-color.svg")}">
  <div style="height:44px"></div>
  <div class="eyebrow">${esc(m.brand)}</div>
  <div class="model">${esc(m.model)}</div>
  <div class="meta">${m.year} · ${esc(state)}</div>
  ${special ? `<div class="special">Edición especial Black Knight</div>` : ""}
  <div class="stats">${stats
    .map(([v, u, l]) => `<div><div class="num">${esc(v)}<small>${u}</small></div><div class="lab">${l}</div></div>`)
    .join("")}</div>
  <div class="cta">${pill}</div>
</div>
<div class="stage"><img class="bike" src="${asset(cover.replace(/^\//, ""))}"></div>
<div class="url">qualitybikesvzla.com</div><div class="base"></div>`
  );
}

// ── 3. Marca de la tienda: logo + tres productos estrella en escena ──────────
// Elegidos a mano: los más reconocibles de cada casa y que se vean bien juntos.
// El del medio va delante y más grande.
const BRAND_PICKS = {
  "vp-racing": ["vp-motoboost", "vp-c16", "vp-power-boost"],
  mobil: ["mobil-super-moto-4t-mx-15w50", "mobil-1-0w40", "mobil-super-moto-4t-20w50"],
  bk3: ["bk3-octane-booster-motos", "bk3-octane-booster-racing", "bk3-cetanium-booster"],
  falken: ["falken-wildpeak-at3w", "falken-azenis-fk510", "falken-ziex-ze914"],
  eway: ["eway-super-plus-98", "gulf-racing-fuel"],
};

function productFile(brand, slug) {
  const dir = join(PUBLIC, "images/products", brand);
  const f = readdirSync(dir).find((x) => x.replace(/\.\w+$/, "") === slug);
  if (!f) throw new Error(`No hay foto para ${brand}/${slug}`);
  return asset(`images/products/${brand}/${f}`);
}

function brandHtml(b) {
  const picks = BRAND_PICKS[b.id] ?? [];
  // El logo de la casa y no la mascota del header: en miniatura se reconoce mejor.
  const logo = b.logo;
  const n = picks.length;
  const slots = n === 3
    ? [{ x: 175, h: 300, z: 1 }, { x: 365, h: 400, z: 2 }, { x: 555, h: 300, z: 1 }]
    : [{ x: 250, h: 380, z: 2 }, { x: 480, h: 380, z: 2 }];
  return page(
    LEFT_CSS +
      `
.logo { margin-top:30px; height:130px; width:340px; display:flex; align-items:center; }
.logo img { max-height:120px; max-width:320px; object-fit:contain; }
.name { margin-top:22px; font-family:'Space Grotesk',sans-serif; font-weight:500; font-size:44px; text-transform:uppercase; line-height:1; }
.tag { margin-top:22px; width:360px; font-size:18px; line-height:1.45; color:rgba(20,24,29,.66); }
.accent { position:absolute; left:470px; top:0; bottom:0; width:4px; background:${b.accent}; opacity:.9; }
.cta { position:absolute; left:64px; bottom:58px; }
.p { position:absolute; bottom:120px; transform:translateX(-50%); mix-blend-mode:multiply; object-fit:contain; }
.shadow { position:absolute; bottom:106px; height:30px; border-radius:50%; transform:translateX(-50%);
  background:radial-gradient(closest-side, rgba(0,0,0,.22), transparent); }
`,
    `<div class="left">
  <img class="qb" src="${asset("assets/logo/quality-bikes-logo-color.svg")}">
  <div style="height:34px"></div>
  <div class="eyebrow">Tienda Quality Bikes</div>
  <div class="logo"><img src="${asset(logo.replace(/^\//, ""))}"></div>
  <div class="tag">${esc(b.tagline)}</div>
  <div class="cta"><span class="pill navy">Arma tu pedido por WhatsApp</span></div>
</div>
<div class="stage">${picks
      .map((slug, i) => {
        const s = slots[i];
        return `<div class="shadow" style="left:${s.x}px;width:${s.h * 0.62}px;z-index:${s.z - 1}"></div>
<img class="p" src="${productFile(b.id, slug)}" style="left:${s.x}px;height:${s.h}px;max-width:${s.h * 0.95}px;z-index:${s.z}">`;
      })
      .join("")}</div>
<div class="accent"></div>
<div class="url">qualitybikesvzla.com</div><div class="base"></div>`
  );
}

// ── 4. /productos: las cinco casas sobre fibra de carbono ────────────────────
function productosHtml() {
  return page(
    `
body { background:#0b0c0e; }
.bg { position:absolute; inset:0; background:url("${asset("images/carbono-forjado.jpg")}") center/cover; filter:brightness(.55) contrast(1.05); }
.shade { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0), rgba(0,0,0,.55)); }
.head { position:absolute; left:74px; top:62px; right:74px; display:flex; justify-content:space-between; align-items:flex-start; }
.head img { height:62px; }
.eyebrow { color:rgba(255,255,255,.75); }
.title { position:absolute; left:74px; top:170px; font-family:'Space Grotesk',sans-serif; font-weight:500; font-size:58px;
  text-transform:uppercase; color:#fff; letter-spacing:.01em; }
.sub { position:absolute; left:74px; top:244px; font-size:19px; color:rgba(255,255,255,.72); }
.cards { position:absolute; left:74px; right:74px; top:310px; display:flex; gap:18px; }
.card { flex:1; height:178px; background:#fff; display:flex; align-items:center; justify-content:center; padding:26px;
  box-shadow:0 18px 40px rgba(0,0,0,.35); }
.card img { max-width:100%; max-height:86px; object-fit:contain; }
.foot { position:absolute; left:74px; right:74px; bottom:50px; display:flex; justify-content:space-between;
  font-family:'Space Mono',monospace; font-size:12.5px; letter-spacing:.24em; text-transform:uppercase; color:rgba(255,255,255,.6); }
`,
    `<div class="bg"></div><div class="shade"></div>
<div class="head"><div class="eyebrow">Tienda</div><img class="white-logo" src="${asset("assets/logo/quality-bikes-logo-venezuela.svg")}"></div>
<div class="title">Productos</div>
<div class="sub">Aditivos, combustibles de competencia, aceites y cauchos.</div>
<div class="cards">${productBrands.map((b) => `<div class="card"><img src="${asset(b.logo.replace(/^\//, ""))}"></div>`).join("")}</div>
<div class="foot"><span>Arma tu pedido por WhatsApp</span><span>qualitybikesvzla.com</span></div>`
  );
}

// ── Render ────────────────────────────────────────────────────────────────────
const jobs = [
  ["home.jpg", homeHtml],
  ["productos.jpg", productosHtml],
  ...motorcycles.map((m) => [`motos/${m.slug}.jpg`, () => motoHtml(m)]),
  ...productBrands.map((b) => [`productos/${b.id}.jpg`, () => brandHtml(b)]),
].filter(([f]) => !filter || f.includes(filter));

mkdirSync(join(OUT, "motos"), { recursive: true });
mkdirSync(join(OUT, "productos"), { recursive: true });
const tmp = join(tmpdir(), `qb-og-${process.pid}.png`);
const browser = await chromium.launch({ executablePath: chromePath() });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
for (const [file, html] of jobs) {
  // Se carga desde un archivo para que las rutas file:// de las fotos funcionen.
  const htmlPath = join(tmpdir(), `qb-og-${process.pid}.html`);
  (await import("node:fs")).writeFileSync(htmlPath, html());
  await p.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.screenshot({ path: tmp });
  const dst = join(OUT, file);
  // Reducción en luz lineal (los filos claros no se oscurecen) y JPEG progresivo.
  execFileSync("magick", [
    tmp, "-colorspace", "RGB", "-filter", "Lanczos", "-resize", `${W}x${H}`, "-colorspace", "sRGB",
    "-strip", "-interlace", "Plane", "-sampling-factor", "4:2:0", "-quality", "86", dst,
  ]);
  const kb = Math.round(Number(execFileSync("stat", ["-f", "%z", dst]).toString()) / 1024);
  console.log(`${file.padEnd(40)} ${kb} KB${kb > 300 ? "  ← pesada para WhatsApp" : ""}`);
}
await browser.close();
if (!existsSync(join(OUT, "home.jpg"))) process.exitCode = 1;
