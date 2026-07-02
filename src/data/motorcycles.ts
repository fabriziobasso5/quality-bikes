export type MotoCategory = "dual-sport" | "enduro";

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

// Inventario 2026-07-02: 2 unidades físicas en showroom (BMW G 310 GS, Kawasaki KLR
// 650 Adventure ABS) + la gama dual sport Voge DS-X de próximo arribo. Se retiró
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
    specs: { power: "34 hp", transmission: "Sincrónica", gears: "6", cylinders: "1 cilindro", color: "Azul" },
    photoCount: 5,
  },
  {
    slug: "kawasaki-klr-650-adventure-abs",
    brand: "Kawasaki",
    model: "KLR 650 Adventure ABS",
    year: 2026,
    cc: 650,
    category: "enduro",
    condition: "0km",
    availability: "en-stock",
    featured: true,
    summary: "El enduro de largo recorrido más legendario de Kawasaki, ahora con ABS y equipamiento Adventure de fábrica.",
    specs: { power: "40 hp", transmission: "Sincrónica", gears: "6", cylinders: "1 cilindro", color: "Gris" },
    photoCount: 5,
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
];

export function getMotoBySlug(slug: string) {
  return motorcycles.find((m) => m.slug === slug);
}
