export type MotoCategory = "dual-sport" | "enduro" | "scooter";

export interface Motorcycle {
  slug: string;
  brand: string;
  model: string;
  year: number;
  cc: number;
  category: MotoCategory;
  condition: "0km" | "seminueva";
  featured: boolean;
  summary: string;
  specs: {
    power: string;
    transmission: string;
    gears: string;
    cylinders: string;
    color: string;
  };
  // Fotos reales del inventario, en public/images/inventory/<slug>/
  photoCount: number;
}

// Inventario real, extraído del sitio anterior (qualitybikesvzla.com) el 2026-07-01.
// El precio nunca se muestra (hide_price activo en el sistema de origen) — decisión
// de negocio consistente: "consultar disponibilidad y precio" fuerza contacto directo.
export const motorcycles: Motorcycle[] = [
  {
    slug: "bmw-g-310-gs",
    brand: "BMW",
    model: "G 310 GS",
    year: 2025,
    cc: 313,
    category: "dual-sport",
    condition: "0km",
    featured: true,
    summary: "La puerta de entrada BMW al mundo dual sport: ágil, confiable y lista para la aventura urbana o fuera de carretera.",
    specs: { power: "—", transmission: "Sincrónica", gears: "6", cylinders: "1 cilindro", color: "Azul" },
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
    featured: true,
    summary: "Utiliza el mismo motor que el BMW F 900, mismo chasis, suspensiones, frenos y tornillería — a un precio nunca antes visto.",
    specs: { power: "94 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Negro" },
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
    featured: true,
    summary: "El enduro de largo recorrido más legendario de Kawasaki, ahora con ABS y equipamiento Adventure de fábrica.",
    specs: { power: "40 hp", transmission: "Sincrónica", gears: "6", cylinders: "1 cilindro", color: "Gris" },
    photoCount: 5,
  },
  {
    slug: "kymco-ak-550-premium",
    brand: "Kymco",
    model: "AK 550 Premium",
    year: 2024,
    cc: 550,
    category: "scooter",
    condition: "0km",
    featured: true,
    summary: "El maxi-scooter insignia de Kymco: potencia bicilíndrica y confort premium para ciudad y carretera.",
    specs: { power: "51 hp", transmission: "Automática", gears: "—", cylinders: "2 cilindros", color: "Negro" },
    photoCount: 5,
  },
  {
    slug: "voge-ds-800x-rally",
    brand: "Voge",
    model: "DS 800X Rally",
    year: 2026,
    cc: 895,
    category: "dual-sport",
    condition: "0km",
    featured: false,
    summary: "Versión Rally del DS 800X, pensada para quienes exigen aún más presencia y carácter off-road.",
    specs: { power: "94 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Negro" },
    photoCount: 5,
  },
  {
    slug: "voge-ds-525x",
    brand: "Voge",
    model: "DS 525X",
    year: 2026,
    cc: 500,
    category: "dual-sport",
    condition: "0km",
    featured: false,
    summary: "Dual sport bicilíndrico de cilindrada intermedia, ideal para quien busca versatilidad sin sacrificar carácter.",
    specs: { power: "94 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Plateado" },
    photoCount: 5,
  },
  {
    slug: "voge-sr4-350-max",
    brand: "Voge",
    model: "SR4 350 MAX",
    year: 2024,
    cc: 350,
    category: "scooter",
    condition: "0km",
    featured: false,
    summary: "Usa el mismo motor y chasis que el BMW C 400 GT: un scooter de gran calidad a un precio muy competitivo.",
    specs: { power: "29 hp", transmission: "Automática", gears: "—", cylinders: "1 cilindro", color: "Negro" },
    photoCount: 5,
  },
  {
    slug: "voge-sr3-250-max",
    brand: "Voge",
    model: "SR3 250 MAX",
    year: 2024,
    cc: 244,
    category: "scooter",
    condition: "0km",
    featured: false,
    summary: "Comodidad y versatilidad son lo que más destaca en este scooter urbano.",
    specs: { power: "26 hp", transmission: "Automática", gears: "—", cylinders: "1 cilindro", color: "Blanco" },
    photoCount: 5,
  },
];

export const brands = Array.from(new Set(motorcycles.map((m) => m.brand)));

export const categories: { value: MotoCategory; label: string }[] = [
  { value: "dual-sport", label: "Dual Sport" },
  { value: "enduro", label: "Enduro" },
  { value: "scooter", label: "Scooter" },
];

export function getMotoBySlug(slug: string) {
  return motorcycles.find((m) => m.slug === slug);
}
