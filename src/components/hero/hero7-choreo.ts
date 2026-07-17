// Coreografía del despiece en 7 fases reales (fotos BMW alineadas por
// chasis): 6 transiciones; en cada una la fase superior se funde rápido y
// las piezas que YA NO están en la siguiente foto salen volando como sprites
// (generados 1:1 desde las mismas fotos, recortados en cuadrado).
//
// El chasis es el ancla: las 7 imágenes están registradas al píxel (ejes de
// rueda por ajuste de círculos en fases 1-4; correlación de fase FFT sobre
// pipa de dirección/subchasis en 5-7), así que entre fase y fase nada se
// mueve — solo desaparece lo que vuela.
//
// Vuelo deliberadamente sutil: velocidades moderadas, giros <60° (las ruedas
// ruedan, es lo único que gira de verdad). El scrub es 1:1 con el scroll:
// scroll lento = se puede detallar cada pieza; scroll rápido = despiece
// corrido y limpio.

export const STAGE_RATIO = 1.5333; // aspecto del frame de las 7 fotos (4905/3199)

export type HeroPhase = {
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** momento del timeline (0-1) en que esta fase se funde a la siguiente */
  fadeAt: number;
};

// La fase 7 (chasis desnudo) nunca se funde: es el final.
export const PHASES: HeroPhase[] = [
  { n: 1, fadeAt: 0.055 },
  { n: 2, fadeAt: 0.225 },
  { n: 3, fadeAt: 0.415 },
  { n: 4, fadeAt: 0.525 },
  { n: 5, fadeAt: 0.745 },
  { n: 6, fadeAt: 0.895 },
];

export type HeroSprite = {
  id: string;
  /** centro de la pieza en % del frame de la moto */
  cx: number;
  cy: number;
  /** ancho del sprite (cuadrado) en % del ancho del frame */
  w: number;
  /** velocidad de salida en vw/vh */
  vx: number;
  vy: number;
  /** rotación total durante el vuelo (grados) */
  rot: number;
  /** ventana [t0, t1] del progreso 0-1 */
  t: [number, number];
};

export const SPRITES: HeroSprite[] = [
  // ---- T1: moto completa → sin carrocería (la fase 1 se funde en 0.055) ----
  // Coordenadas en el frame de la fase 1 CORREGIDA (translate -0.33%,-1.02%
  // + scale 0.982 aplicados en ExplodedHero para registrarla con la sesión
  // de despiece): cx' = 50+(cx-50)·0.982-0.33, cy' = 50+(cy-50)·0.982-1.02,
  // w' = w·0.982.
  { id: "windscreen", cx: 70.3, cy: 14.9, w: 25.5, vx: 45,  vy: -70, rot: 35,   t: [0.05, 0.17] },
  { id: "seat",       cx: 35.9, cy: 39.7, w: 33.4, vx: -55, vy: -60, rot: -25,  t: [0.06, 0.19] },
  { id: "exhaust",    cx: 22.7, cy: 59.8, w: 25.5, vx: -70, vy: 25,  rot: -30,  t: [0.07, 0.21] },
  { id: "beak",       cx: 80.6, cy: 50.9, w: 14.7, vx: 65,  vy: -20, rot: 40,   t: [0.08, 0.20] },
  { id: "tail",       cx: 12.9, cy: 31.3, w: 14.7, vx: -60, vy: -35, rot: -45,  t: [0.09, 0.22] },
  // ---- T2: → tanque de aluminio desnudo ----
  { id: "tankcover",  cx: 52.5, cy: 35.5, w: 27, vx: 40,  vy: -70, rot: 25,   t: [0.22, 0.35] },
  { id: "silverpanel",cx: 61.5, cy: 40.0, w: 13, vx: 70,  vy: -25, rot: 50,   t: [0.23, 0.35] },
  { id: "deflector",  cx: 58.5, cy: 32.0, w: 11, vx: 25,  vy: -75, rot: -35,  t: [0.24, 0.36] },
  { id: "handguards", cx: 57.0, cy: 21.0, w: 14, vx: 55,  vy: -55, rot: 60,   t: [0.25, 0.37] },
  { id: "hugger",     cx: 81.0, cy: 54.0, w: 15, vx: 70,  vy: 20,  rot: 55,   t: [0.26, 0.39] },
  // ---- T3: → sin manubrio ----
  { id: "handlebar",  cx: 64.5, cy: 19.0, w: 22, vx: 30,  vy: -80, rot: 40,   t: [0.41, 0.50] },
  // ---- T4: → chasis rodante desarmado (ruedas, tenedor, tanque, tren trasero) ----
  { id: "frontwheel", cx: 84.4, cy: 76.0, w: 30, vx: 75,  vy: 30,  rot: 240,  t: [0.52, 0.68] },
  { id: "rearwheel",  cx: 16.7, cy: 75.5, w: 30, vx: -75, vy: 32,  rot: -240, t: [0.53, 0.69] },
  { id: "fork",       cx: 78.5, cy: 47.0, w: 17, vx: 60,  vy: -35, rot: 30,   t: [0.54, 0.68] },
  { id: "tank",       cx: 52.0, cy: 33.5, w: 25, vx: 20,  vy: -75, rot: -18,  t: [0.55, 0.70] },
  { id: "shock",      cx: 37.5, cy: 60.0, w: 10, vx: -35, vy: 55,  rot: -50,  t: [0.56, 0.69] },
  { id: "swingarm",   cx: 23.0, cy: 70.0, w: 24, vx: -65, vy: 35,  rot: -35,  t: [0.56, 0.71] },
  { id: "sidepanels", cx: 44.0, cy: 54.0, w: 19, vx: -45, vy: -55, rot: -30,  t: [0.57, 0.72] },
  // ---- T5: → motor y chasis pelados ----
  { id: "harness",    cx: 49.5, cy: 49.0, w: 19, vx: 25,  vy: -70, rot: 30,   t: [0.74, 0.85] },
  { id: "airbox",     cx: 42.5, cy: 58.5, w: 15, vx: -50, vy: -45, rot: -35,  t: [0.75, 0.86] },
  { id: "headcover",  cx: 59.0, cy: 67.0, w: 17, vx: 60,  vy: 25,  rot: 35,   t: [0.76, 0.87] },
  { id: "ancillaries",cx: 40.5, cy: 69.0, w: 11, vx: -45, vy: 45,  rot: -55,  t: [0.76, 0.87] },
  // ---- T6: → solo el chasis tubular ----
  { id: "engine",     cx: 52.0, cy: 62.0, w: 31, vx: 12,  vy: 85,  rot: -14,  t: [0.89, 0.98] },
];

/** layout precalculado del sprite (posición estática; GSAP solo transforma) */
export function spriteBox(s: HeroSprite) {
  const h = s.w * STAGE_RATIO; // % de alto del frame (el sprite es cuadrado)
  return {
    left: `${s.cx - s.w / 2}%`,
    top: `${s.cy - h / 2}%`,
    width: `${s.w}%`,
    height: `${h}%`,
  };
}
