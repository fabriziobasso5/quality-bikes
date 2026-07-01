export type MotoCategory = "sport" | "touring" | "cruiser" | "naked" | "adventure";
export type PriceTier = "20k-40k" | "40k-60k" | "60k-100k";

export interface Motorcycle {
  slug: string;
  brand: string;
  model: string;
  year: number;
  cc: number;
  category: MotoCategory;
  condition: "0km" | "seminueva";
  featured: boolean;
  // Franja de precio SOLO para filtrar el catálogo. El precio exacto nunca se
  // muestra en el sitio por decisión de negocio ("consultar precio" fuerza contacto).
  priceTier: PriceTier;
  summary: string;
  specs: {
    power: string;
    torque: string;
    weight: string;
    tank: string;
  };
}

// TODO: reemplazar por el inventario real (fotos, specs y franjas de precio)
// cuando el cliente entregue el catálogo. Los "consultar precio" son intencionales
// (decisión de negocio: forzar contacto directo vía WhatsApp/formulario).
export const motorcycles: Motorcycle[] = [
  {
    slug: "ducati-panigale-v4",
    brand: "Ducati",
    model: "Panigale V4",
    year: 2025,
    cc: 1103,
    category: "sport",
    condition: "0km",
    featured: true,
    priceTier: "40k-60k",
    summary:
      "La máxima expresión de ingeniería deportiva Ducati. Tecnología MotoGP para la calle.",
    specs: { power: "214 hp", torque: "124 Nm", weight: "198 kg", tank: "16 L" },
  },
  {
    slug: "bmw-r18-transcontinental",
    brand: "BMW Motorrad",
    model: "R 18 Transcontinental",
    year: 2025,
    cc: 1802,
    category: "touring",
    condition: "0km",
    featured: true,
    priceTier: "40k-60k",
    summary:
      "Touring de lujo con el carácter inconfundible del boxer BMW más grande jamás construido.",
    specs: { power: "91 hp", torque: "158 Nm", weight: "427 kg", tank: "24 L" },
  },
  {
    slug: "harley-davidson-cvo-road-glide",
    brand: "Harley-Davidson",
    model: "CVO Road Glide",
    year: 2025,
    cc: 1977,
    category: "cruiser",
    condition: "0km",
    featured: true,
    priceTier: "60k-100k",
    summary:
      "La cúspide de la personalización de fábrica Harley-Davidson. Exclusividad absoluta.",
    specs: { power: "115 hp", torque: "175 Nm", weight: "379 kg", tank: "22.7 L" },
  },
  {
    slug: "ktm-1390-super-duke-r-evo",
    brand: "KTM",
    model: "1390 Super Duke R Evo",
    year: 2025,
    cc: 1350,
    category: "naked",
    condition: "0km",
    featured: true,
    priceTier: "20k-40k",
    summary: "\"The Beast\" evolucionada: potencia bruta con electrónica de punta.",
    specs: { power: "190 hp", torque: "145 Nm", weight: "189 kg", tank: "16 L" },
  },
  {
    slug: "ducati-multistrada-v4-s",
    brand: "Ducati",
    model: "Multistrada V4 S",
    year: 2024,
    cc: 1158,
    category: "adventure",
    condition: "seminueva",
    featured: false,
    priceTier: "40k-60k",
    summary: "Versatilidad extrema para quien no quiere elegir entre asfalto y aventura.",
    specs: { power: "170 hp", torque: "121 Nm", weight: "232 kg", tank: "22 L" },
  },
  {
    slug: "bmw-s1000rr",
    brand: "BMW Motorrad",
    model: "S 1000 RR",
    year: 2024,
    cc: 999,
    category: "sport",
    condition: "seminueva",
    featured: false,
    priceTier: "20k-40k",
    summary: "Referencia absoluta en superbikes de producción. Precisión alemana.",
    specs: { power: "210 hp", torque: "113 Nm", weight: "197 kg", tank: "16.5 L" },
  },
  {
    slug: "ktm-990-duke",
    brand: "KTM",
    model: "990 Duke",
    year: 2025,
    cc: 947,
    category: "naked",
    condition: "0km",
    featured: false,
    priceTier: "20k-40k",
    summary: "El equilibrio perfecto entre agilidad urbana y carácter naked KTM.",
    specs: { power: "123 hp", torque: "103 Nm", weight: "179 kg", tank: "14.9 L" },
  },
  {
    slug: "harley-davidson-cvo-street-glide",
    brand: "Harley-Davidson",
    model: "CVO Street Glide",
    year: 2024,
    cc: 1977,
    category: "touring",
    condition: "seminueva",
    featured: false,
    priceTier: "60k-100k",
    summary: "Touring premium con acabados exclusivos de la línea CVO.",
    specs: { power: "115 hp", torque: "175 Nm", weight: "374 kg", tank: "22.7 L" },
  },
];

export const brands = Array.from(new Set(motorcycles.map((m) => m.brand)));

export const categories: { value: MotoCategory; label: string }[] = [
  { value: "sport", label: "Sport" },
  { value: "touring", label: "Touring" },
  { value: "cruiser", label: "Cruiser" },
  { value: "naked", label: "Naked" },
  { value: "adventure", label: "Adventure" },
];

export const priceTiers: { value: PriceTier; label: string }[] = [
  { value: "20k-40k", label: "USD 20.000 – 40.000" },
  { value: "40k-60k", label: "USD 40.000 – 60.000" },
  { value: "60k-100k", label: "USD 60.000 – 100.000" },
];

export function getMotoBySlug(slug: string) {
  return motorcycles.find((m) => m.slug === slug);
}
