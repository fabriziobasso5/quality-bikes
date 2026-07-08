export type MotoCategory = "dual-sport" | "enduro" | "naked" | "adventure";

export interface Motorcycle {
  slug: string;
  brand: string;
  model: string;
  year: number;
  cc: number;
  category: MotoCategory;
  condition: "0km" | "seminueva";
  // Kilometraje real, solo aplica a unidades "seminueva".
  mileageKm?: number;
  // "en-stock": la unidad física está en el showroom.
  // "proximo-arribo": ya se puede reservar/consultar, pero aún no llega al país.
  availability: "en-stock" | "proximo-arribo";
  featured: boolean;
  summary: string;
  specs: {
    power: string;
    transmission: string;
    gears: string;
    cylinders: string;
    color: string;
    seatHeight?: string;
    weight?: string;
  };
  // Fotos en public/images/inventory/<slug>/ — reales cuando la unidad ya pasó por
  // el showroom; fotos oficiales de fábrica para modelos de próximo arribo.
  photoCount: number;
}

// Portada de catálogo/mega-menú: foto de prensa oficial del fabricante en
// public/images/catalog/<slug>.webp — perfil derecho sobre fondo blanco puro,
// normalizada a lienzo 4:3 para que todas las motos se vean del mismo tamaño
// (estilo ducati.com). La galería de la ficha sigue usando las fotos reales
// de public/images/inventory/<slug>/.
export function catalogCoverPath(slug: string) {
  return `/images/catalog/${slug}.webp`;
}

// Inventario 2026-07-07: unidades físicas en showroom (BMW G 310 GS, Kawasaki KLR
// 650 ABS, Ducati Monster, Ducati Multistrada V4) + la gama dual sport Voge DS-X
// de próximo arribo. Se retiró
// Kymco y los scooters Voge SR3/SR4 del catálogo. El precio nunca se muestra (decisión
// de negocio): "consultar disponibilidad y precio" fuerza contacto directo.
export const motorcycles: Motorcycle[] = [
  {
    slug: "bmw-g-310-gs",
    brand: "BMW",
    model: "G 310 GS",
    year: 2025,
    cc: 313,
    category: "dual-sport",
    condition: "seminueva",
    mileageKm: 255,
    availability: "en-stock",
    featured: true,
    summary: "La puerta de entrada BMW al mundo dual sport: ágil, confiable y lista para la aventura urbana o fuera de carretera.",
    specs: { power: "34 hp", transmission: "Sincrónica", gears: "6", cylinders: "1 cilindro", color: "Polar White / Racing Blue", seatHeight: "835 mm", weight: "175 kg" },
    photoCount: 5,
  },
  {
    slug: "kawasaki-klr-650-abs",
    brand: "Kawasaki",
    model: "KLR 650 ABS",
    year: 2026,
    cc: 650,
    category: "enduro",
    condition: "0km",
    availability: "en-stock",
    featured: true,
    summary: "El enduro de largo recorrido más legendario de Kawasaki, ahora con ABS de fábrica.",
    specs: { power: "40 hp", transmission: "Sincrónica", gears: "6", cylinders: "1 cilindro", color: "Negro (Ebony)", seatHeight: "870 mm", weight: "209 kg" },
    photoCount: 5,
  },
  {
    slug: "ducati-monster",
    brand: "Ducati",
    model: "Monster",
    year: 2025,
    cc: 937,
    category: "naked",
    condition: "seminueva",
    availability: "en-stock",
    featured: true,
    summary: "La naked italiana por excelencia: motor Testastretta 11° de 111 hp, 166 kg en seco y la agilidad que hizo leyenda al nombre Monster.",
    specs: { power: "111 hp", transmission: "Sincrónica", gears: "6 + Quick Shift", cylinders: "2 cilindros (L-Twin)", color: "Rojo Ducati", seatHeight: "820 mm", weight: "188 kg" },
    photoCount: 10,
  },
  {
    slug: "ducati-multistrada-v4",
    brand: "Ducati",
    model: "Multistrada V4",
    year: 2025,
    cc: 1158,
    category: "adventure",
    condition: "seminueva",
    availability: "en-stock",
    featured: true,
    summary: "La sport-touring definitiva: V4 Granturismo de 170 hp con radar, electrónica de punta y comodidad para devorar continentes.",
    specs: { power: "170 hp", transmission: "Sincrónica", gears: "6 + Quick Shift", cylinders: "4 cilindros (V4)", color: "Rojo Ducati", seatHeight: "840–860 mm", weight: "229 kg" },
    // TODO(cliente): aún no hay fotos reales de esta unidad — la galería
    // muestra solo la portada oficial. Cuando lleguen las fotos del showroom,
    // copiarlas a public/images/inventory/ducati-multistrada-v4/1..N.webp y
    // poner photoCount: N.
    photoCount: 0,
  },
  {
    slug: "voge-ds-900x",
    brand: "Voge",
    model: "DS 900X",
    year: 2026,
    cc: 895,
    category: "dual-sport",
    condition: "0km",
    availability: "proximo-arribo",
    featured: true,
    summary: "Utiliza el motor 895cc fabricado por Loncin, la misma planta que provee el motor del BMW F 900 GS — mismo bloque, tornillería BMW-compatible, a un precio muy inferior.",
    specs: { power: "94 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Negro", seatHeight: "825 mm", weight: "215 kg" },
    photoCount: 2,
  },
  {
    slug: "voge-ds-800x-rally",
    brand: "Voge",
    model: "DS 800X Rally",
    year: 2026,
    cc: 798,
    category: "dual-sport",
    condition: "0km",
    availability: "proximo-arribo",
    featured: true,
    summary: "Bicilíndrico de 798cc con ABS y control de tracción conmutables, pensado para quienes exigen presencia y carácter off-road de verdad.",
    specs: { power: "94 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Negro", seatHeight: "850 mm", weight: "213 kg" },
    photoCount: 2,
  },
  {
    slug: "voge-ds-625x",
    brand: "Voge",
    model: "DS 625X",
    year: 2026,
    cc: 581,
    category: "dual-sport",
    condition: "0km",
    availability: "proximo-arribo",
    featured: false,
    summary: "Bicilíndrico de cigüeñal a 270° con dos modos de manejo (Eco/Sport), ABS y control de tracción conmutables — el punto medio ideal entre agilidad y presencia.",
    specs: { power: "63 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Arena", seatHeight: "835 mm", weight: "191 kg" },
    photoCount: 2,
  },
  {
    slug: "voge-ds-525x",
    brand: "Voge",
    model: "DS 525X",
    year: 2026,
    cc: 494,
    category: "dual-sport",
    condition: "0km",
    availability: "proximo-arribo",
    featured: false,
    summary: "Dual sport bicilíndrico de cilindrada intermedia con ABS Bosch desconectable, ideal para quien busca versatilidad sin sacrificar carácter.",
    specs: { power: "47 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Plateado", seatHeight: "810 mm", weight: "206 kg" },
    photoCount: 2,
  },
  {
    slug: "voge-ds-300x",
    brand: "Voge",
    model: "DS 300X",
    year: 2026,
    cc: 292,
    category: "dual-sport",
    condition: "0km",
    availability: "proximo-arribo",
    featured: false,
    summary: "La puerta de entrada de la gama dual sport Voge: monocilíndrico ágil y liviano, perfecto para dar el salto a las motos de alta cilindrada.",
    specs: { power: "28 hp", transmission: "Sincrónica", gears: "6", cylinders: "1 cilindro", color: "Gris", seatHeight: "810 mm", weight: "155 kg" },
    photoCount: 2,
  },
];

export const brands = Array.from(new Set(motorcycles.map((m) => m.brand)));

export const categories: { value: MotoCategory; label: string }[] = [
  { value: "dual-sport", label: "Dual Sport" },
  { value: "enduro", label: "Enduro" },
  { value: "naked", label: "Naked" },
  { value: "adventure", label: "Adventure" },
];

export function getMotoBySlug(slug: string) {
  return motorcycles.find((m) => m.slug === slug);
}
