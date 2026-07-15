// Coreografía del "desvestido" del hero: la moto NO se mueve — cada tile es
// una región poligonal (% del frame 16:9) recortada con clip-path del MISMO
// asset de la moto completa (bike.webp), así el desprendimiento es
// pixel-perfect por construcción. Debajo queda chassis.webp (edición
// encadenada del master, alineación verificada por overlay).
//
// Física simulada: piezas livianas (espejos, guardabarros) salen rápido, con
// ventanas cortas y mucho giro; pesadas (tanque, motor, cauchos) con ventanas
// largas, menos giro y arranque tardío. Los cauchos giran mucho (ruedan).
// vx/vy en unidades de viewport (vw/vh) para garantizar salida de pantalla en
// cualquier breakpoint. t = ventana [inicio, fin] del progreso 0–1 del scrub.

export type Tile = {
  id: string;
  /** polígono en % del frame (x, y) */
  poly: [number, number][];
  /** velocidad de salida, en vw (x) y vh (y) */
  vx: number;
  vy: number;
  /** rotación total en grados durante el vuelo */
  rot: number;
  /** ventana [t0, t1] dentro del progreso 0–1 */
  t: [number, number];
};

// Orden de desprendimiento: exterior → interior (maletas, espejos,
// parabrisas, escape, manubrio, asiento, panel, tanque, careta/guardabarros,
// cauchos, rayos, motor). Las ventanas se solapan para flujo continuo.
// Los polígonos son deliberadamente GENEROSOS: sobrecortar hacia el chasis es
// gratis (la capa chassis.webp repone esos píxeles), mientras que un píxel
// no cubierto queda flotando como residuo al final. Solapes entre piezas =
// píxeles duplicados solo durante el vuelo (imperceptible en movimiento).
export const TILES: Tile[] = [
  { id: "maleta",     vx: -120, vy: -12,  rot: -24,  t: [0.02, 0.30], poly: [[10.5,24],[36,24],[36,35],[33,36],[33,58],[27,59.5],[21,58],[11,58],[10.5,44]] },
  { id: "espejoA",    vx: -55,  vy: -130, rot: -280, t: [0.05, 0.17], poly: [[55,2],[62,2],[62,14],[58.5,17],[54.5,14.5]] },
  { id: "espejoB",    vx: 45,   vy: -135, rot: 320,  t: [0.07, 0.19], poly: [[62,0.5],[68,0.5],[68,10.5],[63,13],[62,10]] },
  { id: "parabrisas", vx: 85,   vy: -120, rot: 130,  t: [0.10, 0.26], poly: [[62,1],[79.5,1],[81.5,13],[77,27],[70,26],[62.5,13]] },
  { id: "escape",     vx: -110, vy: 75,   rot: -80,  t: [0.14, 0.33], poly: [[19,52],[39,52],[40,58],[46,61],[46,74],[29,74],[20,70]] },
  { id: "manubrio",   vx: 15,   vy: -140, rot: 100,  t: [0.18, 0.35], poly: [[52,10],[67,10],[71.5,16],[71.5,27.5],[58,29],[52,20]] },
  { id: "asiento",    vx: -75,  vy: -115, rot: -70,  t: [0.22, 0.41], poly: [[27,26],[58,26],[58,33],[53,42],[43,44],[33,42],[28,34]] },
  { id: "panelLat",   vx: -125, vy: -35,  rot: -110, t: [0.25, 0.41], poly: [[28,32],[42,38],[47,42],[47,54],[36,56],[28,44]] },
  { id: "tanque",     vx: 65,   vy: -105, rot: 32,   t: [0.28, 0.54], poly: [[40,44],[42,27],[55,22],[65,21],[73,23],[73,50],[66,56],[56,60],[47,58],[42,53]] },
  { id: "frontmask",  vx: 125,  vy: -40,  rot: 48,   t: [0.33, 0.55], poly: [[70,18],[81,20],[86,28],[91,42],[90.5,56],[87,67],[76,66],[69.5,56],[70,23]] },
  { id: "guardatras", vx: -105, vy: 85,   rot: -150, t: [0.35, 0.49], poly: [[9.5,51],[22,54],[23.5,60],[21,69],[10,67]] },
  // Caucho trasero con tope plano en y=68: excluye la zona del muffler (esos
  // píxeles vuelan solo con el escape) para no ver un escape "fantasma"
  // pegado a la rueda mientras espera su ventana.
  { id: "cauchoTras", vx: -95,  vy: 95,   rot: -420, t: [0.42, 0.70], poly: [[39.7,77],[37.9,88],[33.2,95.8],[26.3,98.8],[19.4,95.8],[14.7,88],[12.9,77],[13.1,67.5],[37.2,67.5],[39.4,71.5]] },
  { id: "cauchoDel",  vx: 95,   vy: 90,   rot: 460,  t: [0.46, 0.74], poly: [[90.3,77.5],[88.6,88.1],[84.1,95.7],[77,98.5],[69.9,95.7],[65.4,88.1],[63.7,77.5],[65.4,66.9],[69.9,59.3],[77,56.5],[84.1,59.3],[88.6,66.9]] },
  { id: "motor",      vx: 8,    vy: 130,  rot: -16,  t: [0.58, 0.88], poly: [[44,46],[67,46],[72,53],[71,62],[69,68],[66,81],[52,81],[45,70],[43,56]] },
];

// Rayos de rin sueltos: nacen del centro de cada rueda justo después de que
// el caucho se desprende y salen disparados radialmente con mucho giro.
export type Spoke = {
  /** centro de origen en % del frame */
  cx: number;
  cy: number;
  /** dirección radial en vw/vh y giro */
  vx: number;
  vy: number;
  rot: number;
  t0: number;
  /** alto del rayo en % del alto del frame */
  h: number;
};

const REAR = { cx: 25.3, cy: 75 };
const FRONT = { cx: 78, cy: 74.5 };

function burst(c: { cx: number; cy: number }, tStart: number, seedOffset: number): Spoke[] {
  const out: Spoke[] = [];
  for (let i = 0; i < 6; i++) {
    const a = ((i * 60 + seedOffset) * Math.PI) / 180;
    out.push({
      cx: c.cx,
      cy: c.cy,
      // velocidades altas: garantizan salir del viewport desde cualquier
      // origen (un rayo lento se quedaba "aterrizado" dentro de la escena)
      vx: Math.cos(a) * (105 + (i % 3) * 30),
      vy: Math.sin(a) * (95 + ((i + 1) % 3) * 30) - 30,
      rot: (i % 2 ? 1 : -1) * (540 + i * 70),
      t0: tStart + i * 0.014,
      h: 8 + (i % 3) * 2.5,
    });
  }
  return out;
}

export const SPOKES: Spoke[] = [...burst(REAR, 0.47, 12), ...burst(FRONT, 0.51, 40)];

export function polyToClip(poly: [number, number][]): string {
  return `polygon(${poly.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}

export function centroid(poly: [number, number][]): [number, number] {
  const n = poly.length;
  return [poly.reduce((a, p) => a + p[0], 0) / n, poly.reduce((a, p) => a + p[1], 0) / n];
}
