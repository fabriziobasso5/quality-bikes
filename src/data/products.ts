// src/data/products.ts
// Sección "Productos" de Quality Bikes (VP Racing, Mobil, BK3).
// Regla de negocio: los precios NUNCA se muestran. El cliente arma un pedido
// ("añadir al pedido") y se envía por WhatsApp, igual que la consulta de una moto.
// Logos: se reutilizan los que ya existen en el home (public/images/brands/).
//   vp-racing -> vp-racing.png | mobil -> mobil-1.svg | bk3 -> wordmark (sin archivo).
// Fotos de producto: public/images/products/<brand>/<slug>.webp cuando existan;
//   mientras tanto se muestra un placeholder (ver ProductPlaceholder).
// Datos transcritos de las listas de precios oficiales (BK3, VP Racing, Mobil).

export type ProductBrandId = "vp-racing" | "mobil" | "bk3";
export type ProductCategory = "aditivos" | "gasolinas" | "lubricantes";

export interface ProductBrandMeta {
  id: ProductBrandId;
  name: string;
  tagline: string;
  logo: string;      // ruta del logo real que ya usa el home; "" => usar wordmark
  accent: string;
  accent2?: string;
  categories: ProductCategory[];
}

export interface Product {
  slug: string;
  brand: ProductBrandId;
  name: string;
  category: ProductCategory;
  group: string;       // subtipo real dentro de la categoría (visible)
  groupSlug: string;
  tags?: string[];     // atributos extra (p. ej. tipo de aceite) para etiquetas/filtros
  summary: string;     // 1 línea: qué es
  highlights: string[];// datos cortos importantes (chips)
  presentations?: string[]; // tamaños para elegir al añadir al pedido
  featured?: boolean;
  image?: string;      // /images/products/<brand>/<slug>.webp si existe; si no, placeholder
}

export const categoryLabels: Record<ProductCategory, string> = {
  aditivos: "Aditivos",
  gasolinas: "Gasolinas de competencia",
  lubricantes: "Lubricantes",
};

export const productBrands: ProductBrandMeta[] = [
  { id: "vp-racing", name: "VP Racing", tagline: "Aditivos y combustibles de competencia", logo: "/images/brands/vp-racing.png", accent: "#E4002B", accent2: "#003DA5", categories: ["aditivos", "gasolinas"] },
  { id: "mobil", name: "Mobil", tagline: "Lubricantes sintéticos, semisintéticos y minerales", logo: "/images/brands/mobil-1.svg", accent: "#0033A0", accent2: "#ED1C24", categories: ["lubricantes"] },
  { id: "bk3", name: "BK3", tagline: "Elevadores de octanaje y cetano", logo: "", accent: "#E30613", accent2: "#111111", categories: ["aditivos"] },
];

export const products: Product[] = [
  // ── BK3 ────────────────────────────────────────────────────────────────
  { slug: "bk3-octane-booster", brand: "bk3", name: "BK3 Octane Booster", category: "aditivos", group: "Gasolina", groupSlug: "gasolina", summary: "Elevador de octanaje para gasolina; mejora la combustión y el rendimiento.", highlights: ["Eleva el octanaje", "Para gasolina", "Más rendimiento"], presentations: ["1/2 L", "1 L", "5 L"], featured: true },
  { slug: "bk3-octane-booster-racing", brand: "bk3", name: "BK3 Octane Booster Racing", category: "aditivos", group: "Gasolina", groupSlug: "gasolina", summary: "Máximo octanaje para motores de alto desempeño y competencia.", highlights: ["Máximo octanaje", "Uso racing", "Para gasolina"], presentations: ["1 L", "5 L"], featured: true },
  { slug: "bk3-octane-booster-motos", brand: "bk3", name: "BK3 Octane Booster Motos", category: "aditivos", group: "Gasolina", groupSlug: "gasolina", summary: "Elevador de octanaje formulado especialmente para motos.", highlights: ["Eleva el octanaje", "Especial motos"], presentations: ["1/4 L"], featured: true },
  { slug: "bk3-cetanium-booster", brand: "bk3", name: "BK3 Cetanium Booster", category: "aditivos", group: "Diesel", groupSlug: "diesel", summary: "Elevador de cetano para diesel; mejor encendido y menos humo.", highlights: ["Eleva el cetano", "Para diesel", "Mejor encendido"], presentations: ["1 L", "5 L"] },
  { slug: "bk3-performance-marine", brand: "bk3", name: "BK3 Performance Marine", category: "aditivos", group: "Marino", groupSlug: "marino", summary: "Tratamiento de combustible para motores marinos.", highlights: ["Uso marino", "Protege el motor"], presentations: ["5 L"] },

  // ── VP RACING · Aditivos ───────────────────────────────────────────────
  { slug: "vp-octanium-unleaded", brand: "vp-racing", name: "Octanium Unleaded", category: "aditivos", group: "Elevador de octanaje", groupSlug: "octanaje", summary: "Elevador de octanaje para gasolina sin plomo.", highlights: ["Eleva el octanaje", "Sin plomo"] },
  { slug: "vp-octanium", brand: "vp-racing", name: "Octanium", category: "aditivos", group: "Elevador de octanaje", groupSlug: "octanaje", summary: "Elevador de octanaje para gasolina con plomo.", highlights: ["Eleva el octanaje", "Con plomo"] },
  { slug: "vp-octane-booster-unleaded", brand: "vp-racing", name: "Octane Booster Unleaded", category: "aditivos", group: "Elevador de octanaje", groupSlug: "octanaje", summary: "Elevador de octanaje para gasolina sin plomo.", highlights: ["Eleva el octanaje", "Sin plomo"] },
  { slug: "vp-autoboost", brand: "vp-racing", name: "Autoboost", category: "aditivos", group: "Elevador de octanaje", groupSlug: "octanaje", summary: "Nuevo elevador de octanaje para autos, gasolina sin plomo.", highlights: ["Nuevo", "Autos", "Sin plomo"], featured: true },
  { slug: "vp-motoboost", brand: "vp-racing", name: "Motoboost", category: "aditivos", group: "Elevador de octanaje", groupSlug: "octanaje", summary: "Nuevo elevador de octanaje para moto y carros pequeños.", highlights: ["Nuevo", "Moto y autos pequeños", "Sin plomo"], featured: true },
  { slug: "vp-power-boost", brand: "vp-racing", name: "Power Boost", category: "aditivos", group: "Mejorador de potencia", groupSlug: "potencia", summary: "Mejora la explosión y la potencia; ideal para motos. 1 L trata hasta 1.280 L.", highlights: ["Más potencia", "Ideal motos", "1 L : 1.280 L"], featured: true },
  { slug: "vp-7-in-one", brand: "vp-racing", name: "7 in One Fuel Treatment", category: "aditivos", group: "Limpiador de combustible", groupSlug: "limpiador", summary: "Limpiador de combustible y mejorador de potencia, 7 funciones en 1.", highlights: ["7 en 1", "Limpia + potencia"] },
  { slug: "vp-fuel-system-cleaner-rp21", brand: "vp-racing", name: "Fuel System Cleaner with RP21", category: "aditivos", group: "Limpiador de combustible", groupSlug: "limpiador", summary: "Limpiador del sistema de combustible reforzado con RP21.", highlights: ["Limpia inyectores", "Con RP21"] },
  { slug: "vp-fuel-stabilizer-ethanol", brand: "vp-racing", name: "Fuel Stabilizer with Ethanol Shield", category: "aditivos", group: "Estabilizador", groupSlug: "estabilizador", summary: "Estabilizador de combustible con protector de ethanol.", highlights: ["Estabiliza", "Protege del ethanol"] },
  { slug: "vp-ultra-marine-stabilizer", brand: "vp-racing", name: "Ultra Marine Stabilizer", category: "aditivos", group: "Estabilizador", groupSlug: "estabilizador", summary: "Estabilizador de combustible para uso marino.", highlights: ["Uso marino", "Estabiliza"] },
  { slug: "vp-cetanium", brand: "vp-racing", name: "Cetanium", category: "aditivos", group: "Diesel", groupSlug: "diesel", summary: "Aditivo elevador de cetano para diesel.", highlights: ["Eleva el cetano", "Para diesel"] },
  { slug: "vp-diesel-all-in-one", brand: "vp-racing", name: "Diesel All-in-One", category: "aditivos", group: "Diesel", groupSlug: "diesel", summary: "Todo en uno diesel: potencia, limpieza, ahorro y protección de bomba e inyectores.", highlights: ["Todo en 1", "Limpia + protege", "Diesel"] },

  // ── VP RACING · Gasolinas de competencia ───────────────────────────────
  { slug: "vp-c12", brand: "vp-racing", name: "C12", category: "gasolinas", group: "Con plomo", groupSlug: "con-plomo", summary: "Gasolina de competencia con plomo, 110.5 octanos.", highlights: ["110.5 oct", "Con plomo", "Competencia"] },
  { slug: "vp-c16", brand: "vp-racing", name: "C16", category: "gasolinas", group: "Con plomo", groupSlug: "con-plomo", summary: "120 octanos, con plomo; alto desempeño.", highlights: ["120 oct", "Con plomo"] },
  { slug: "vp-q16", brand: "vp-racing", name: "Q16", category: "gasolinas", group: "Con plomo", groupSlug: "con-plomo", summary: "117.5 octanos, con plomo.", highlights: ["117.5 oct", "Con plomo"] },
  { slug: "vp-vp110", brand: "vp-racing", name: "VP110", category: "gasolinas", group: "Con plomo", groupSlug: "con-plomo", summary: "109.5 octanos, con plomo.", highlights: ["109.5 oct", "Con plomo"] },
  { slug: "vp-c9", brand: "vp-racing", name: "C9", category: "gasolinas", group: "Sin plomo", groupSlug: "sin-plomo", summary: "96.8 octanos, sin plomo.", highlights: ["96.8 oct", "Sin plomo"] },
  { slug: "vp-performance-unleaded", brand: "vp-racing", name: "Performance Unleaded Reg", category: "gasolinas", group: "Sin plomo", groupSlug: "sin-plomo", summary: "100.1 octanos, sin plomo.", highlights: ["100.1 oct", "Sin plomo"] },
  { slug: "vp-c50-reg", brand: "vp-racing", name: "C50+ Reg", category: "gasolinas", group: "Sin plomo", groupSlug: "sin-plomo", summary: "94.8 octanos, gasolina de competencia.", highlights: ["94.8 oct", "Competencia"] },
  { slug: "vp-ms109", brand: "vp-racing", name: "MS109 Reg", category: "gasolinas", group: "Sin plomo", groupSlug: "sin-plomo", summary: "105.5 octanos, sin plomo.", highlights: ["105.5 oct", "Sin plomo"] },
  { slug: "vp-t2", brand: "vp-racing", name: "T2", category: "gasolinas", group: "Moto", groupSlug: "moto", summary: "Gasolina de competencia para moto, 105.5 oct, con plomo.", highlights: ["105.5 oct", "Moto", "Con plomo"] },
  { slug: "vp-t2-plus", brand: "vp-racing", name: "T2+", category: "gasolinas", group: "Moto", groupSlug: "moto", summary: "105.5 oct, con plomo, para moto.", highlights: ["105.5 oct", "Moto", "Con plomo"] },
  { slug: "vp-t4", brand: "vp-racing", name: "T4", category: "gasolinas", group: "Moto", groupSlug: "moto", summary: "98.6 oct, sin plomo, para moto.", highlights: ["98.6 oct", "Moto", "Sin plomo"] },
  { slug: "vp-t4-plus", brand: "vp-racing", name: "T4+", category: "gasolinas", group: "Moto", groupSlug: "moto", summary: "98.5 oct, sin plomo, +2% potencia.", highlights: ["98.5 oct", "+2% potencia", "Moto"] },
  { slug: "vp-mr12", brand: "vp-racing", name: "MR12", category: "gasolinas", group: "Moto", groupSlug: "moto", summary: "92.7 oct, con plomo, para moto.", highlights: ["92.7 oct", "Moto", "Con plomo"] },
  { slug: "vp-x98", brand: "vp-racing", name: "X98", category: "gasolinas", group: "Ethanol", groupSlug: "ethanol", summary: "Ethanol 98%, 111.5 oct, sin plomo.", highlights: ["Ethanol 98%", "111.5 oct"] },
  { slug: "vp-x85", brand: "vp-racing", name: "X85", category: "gasolinas", group: "Ethanol", groupSlug: "ethanol", summary: "Ethanol 85%, 101.6 oct.", highlights: ["Ethanol 85%", "101.6 oct"] },
  { slug: "vp-x85v", brand: "vp-racing", name: "X85V", category: "gasolinas", group: "Ethanol", groupSlug: "ethanol", summary: "Ethanol 85% (Green), 101.6 oct.", highlights: ["Ethanol 85% Green", "101.6 oct"] },
  { slug: "vp-c85", brand: "vp-racing", name: "C85", category: "gasolinas", group: "Ethanol", groupSlug: "ethanol", summary: "Ethanol, 96.3 oct, sin plomo.", highlights: ["Ethanol", "96.3 oct"] },
  { slug: "vp-m1", brand: "vp-racing", name: "M1", category: "gasolinas", group: "Methanol", groupSlug: "methanol", summary: "Methanol puro, 101.6 oct.", highlights: ["Methanol puro", "101.6 oct"] },
  { slug: "vp-nitro-25-9", brand: "vp-racing", name: "25% Nitro Race Car 9% Oil", category: "gasolinas", group: "Nitro", groupSlug: "nitro", summary: "Mezcla nitro para autos R/C, 25% nitro / 9% aceite.", highlights: ["25% nitro", "R/C car"] },

  // ── MOBIL · Lubricantes (group = línea; tags = tipo) ───────────────────
  { slug: "mobil-1-0w16", brand: "mobil", name: "Mobil 1 0W-16", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Sintético"], summary: "100% sintético 0W-16, hasta 10.000 millas. API SP.", highlights: ["0W-16", "Sintético", "API SP"], featured: true },
  { slug: "mobil-1-0w20", brand: "mobil", name: "Mobil 1 0W-20", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Sintético"], summary: "Sintético 0W-20, API SP/SN, 10.000 millas.", highlights: ["0W-20", "Sintético", "API SP/SN"] },
  { slug: "mobil-1-5w20", brand: "mobil", name: "Mobil 1 5W-20", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Sintético"], summary: "Sintético 5W-20, API SP/SN.", highlights: ["5W-20", "Sintético", "API SP/SN"] },
  { slug: "mobil-1-5w30", brand: "mobil", name: "Mobil 1 5W-30", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Sintético"], summary: "Sintético 5W-30, API SP/SN.", highlights: ["5W-30", "Sintético", "API SP/SN"], featured: true },
  { slug: "mobil-1-10w30", brand: "mobil", name: "Mobil 1 10W-30", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Sintético"], summary: "Sintético 10W-30, API SP/SN.", highlights: ["10W-30", "Sintético", "API SP/SN"] },
  { slug: "mobil-1-0w40", brand: "mobil", name: "Mobil 1 0W-40", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Sintético"], summary: "Sintético 0W-40, API SP/SN.", highlights: ["0W-40", "Sintético", "API SP/SN"] },
  { slug: "mobil-super-3000-xe-5w30", brand: "mobil", name: "Mobil Super 3000 XE 5W-30", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Sintético"], summary: "Sintético 5W-30; ACEA A3/B4, MB 229.3, Porsche A40.", highlights: ["5W-30", "Sintético", "ACEA A3/B4"] },
  { slug: "mobil-super-3000-x4-5w40", brand: "mobil", name: "Mobil Super 3000 X4 5W-40", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Sintético"], summary: "Sintético 5W-40; ACEA A3/B4, Porsche A40.", highlights: ["5W-40", "Sintético", "Porsche A40"] },
  { slug: "mobil-super-2000-5w20", brand: "mobil", name: "Mobil Super 2000 5W-20", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Semisintético"], summary: "Semisintético 5W-20, API SP, GF-6A.", highlights: ["5W-20", "Semisintético", "API SP"] },
  { slug: "mobil-super-2000-5w30", brand: "mobil", name: "Mobil Super 2000 5W-30", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Semisintético"], summary: "Semisintético 5W-30, API SP, GF-6A.", highlights: ["5W-30", "Semisintético", "API SP"] },
  { slug: "mobil-super-2000-10w30", brand: "mobil", name: "Mobil Super 2000 10W-30", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Semisintético"], summary: "Semisintético 10W-30, API SP, GF-6A.", highlights: ["10W-30", "Semisintético", "API SP"] },
  { slug: "mobil-super-2000-x1-10w40", brand: "mobil", name: "Mobil Super 2000 X1 10W-40", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Semisintético"], summary: "Semisintético 10W-40, API SN Plus, ACEA A3/B3.", highlights: ["10W-40", "Semisintético", "API SN Plus"] },
  { slug: "mobil-super-1000-20w50", brand: "mobil", name: "Mobil Super 1000 20W-50", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Mineral"], summary: "Mineral 20W-50, API SN.", highlights: ["20W-50", "Mineral", "API SN"] },
  { slug: "mobil-special-hd-50", brand: "mobil", name: "Mobil Special HD 50", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Mineral"], summary: "Mineral SAE 50, API SF/CC.", highlights: ["SAE 50", "Mineral", "API SF/CC"] },
  { slug: "mobil-special-alto-kilom-25w50", brand: "mobil", name: "Mobil Special Alto Kilometraje 25W-50", category: "lubricantes", group: "Línea gasolina", groupSlug: "gasolina", tags: ["Mineral"], summary: "Mineral 25W-50 para alto kilometraje, API SG.", highlights: ["25W-50", "Mineral", "Alto kilometraje"] },
  { slug: "mobil-super-moto-4t-mx-10w40", brand: "mobil", name: "Mobil Super Moto 4T MX 10W-40", category: "lubricantes", group: "Línea moto 2T y 4T", groupSlug: "moto", tags: ["Semisintético"], summary: "Aceite moto 4T 10W-40; API SL, JASO MA2.", highlights: ["4T · 10W-40", "Semisintético", "JASO MA2"], featured: true },
  { slug: "mobil-super-moto-scooter-mx-10w40", brand: "mobil", name: "Mobil Super Moto Scooter MX 10W-40", category: "lubricantes", group: "Línea moto 2T y 4T", groupSlug: "moto", tags: ["Semisintético"], summary: "Para scooter 4T; JASO MB.", highlights: ["Scooter 4T", "10W-40", "JASO MB"] },
  { slug: "mobil-super-moto-4t-mx-15w50", brand: "mobil", name: "Mobil Super Moto 4T MX 15W-50", category: "lubricantes", group: "Línea moto 2T y 4T", groupSlug: "moto", tags: ["Semisintético"], summary: "Moto 4T 15W-50; JASO MA2.", highlights: ["4T · 15W-50", "Semisintético", "JASO MA2"] },
  { slug: "mobil-super-moto-4t-20w50", brand: "mobil", name: "Mobil Super Moto 4T 20W-50", category: "lubricantes", group: "Línea moto 2T y 4T", groupSlug: "moto", tags: ["Mineral"], summary: "Moto 4T 20W-50 mineral; JASO MA2.", highlights: ["4T · 20W-50", "Mineral", "JASO MA2"] },
  { slug: "mobil-extra-2t", brand: "mobil", name: "Mobil Extra 2T", category: "lubricantes", group: "Línea moto 2T y 4T", groupSlug: "moto", tags: ["Semisintético"], summary: "Aceite moto 2T; API TC, JASO FD.", highlights: ["2T", "Semisintético", "JASO FD"] },
  { slug: "mobil-super-moto-2t", brand: "mobil", name: "Mobil Super Moto 2T", category: "lubricantes", group: "Línea moto 2T y 4T", groupSlug: "moto", tags: ["Mineral"], summary: "Aceite moto 2T mineral; API TC.", highlights: ["2T", "Mineral", "API TC"] },
  { slug: "mobil-outboard-plus-4t-10w40", brand: "mobil", name: "Mobil Outboard Plus 4T 10W-40", category: "lubricantes", group: "Línea moto 2T y 4T", groupSlug: "moto", tags: ["Mineral"], summary: "Fuera de borda 4T; NMMA FC-W.", highlights: ["Fuera de borda 4T", "NMMA FC-W"] },
  { slug: "mobil-outboard-plus-2t", brand: "mobil", name: "Mobil Outboard Plus 2T", category: "lubricantes", group: "Línea moto 2T y 4T", groupSlug: "moto", tags: ["Mineral"], summary: "Fuera de borda 2T; NMMA TC-W3.", highlights: ["Fuera de borda 2T", "NMMA TC-W3"] },
  { slug: "mobil-1-turbo-diesel-truck-5w40", brand: "mobil", name: "Mobil 1 Turbo Diesel Truck 5W-40", category: "lubricantes", group: "Línea diesel", groupSlug: "diesel", tags: ["Sintético"], summary: "Sintético diesel 5W-40, para EGR; API CK-4.", highlights: ["5W-40", "Sintético", "API CK-4"] },
  { slug: "mobil-delvac-mx-esp-15w40", brand: "mobil", name: "Mobil Delvac MX ESP 15W-40", category: "lubricantes", group: "Línea diesel", groupSlug: "diesel", tags: ["Semisintético"], summary: "Diesel 15W-40 alta protección; API CK-4.", highlights: ["15W-40", "Semisintético", "API CK-4"] },
  { slug: "mobil-delvac-mx-15w40", brand: "mobil", name: "Mobil Delvac MX 15W-40", category: "lubricantes", group: "Línea diesel", groupSlug: "diesel", tags: ["Mineral"], summary: "Diesel 15W-40; API CI-4 Plus.", highlights: ["15W-40", "Mineral", "API CI-4+"] },
  { slug: "mobil-delvac-1350-sae50", brand: "mobil", name: "Mobil Delvac 1350 SAE 50", category: "lubricantes", group: "Línea diesel", groupSlug: "diesel", tags: ["Mineral"], summary: "Diesel SAE 50; API CF/SF.", highlights: ["SAE 50", "Mineral", "API CF/SF"] },
  { slug: "mobil-delvac-1640-sae40", brand: "mobil", name: "Mobil Delvac 1640 SAE 40", category: "lubricantes", group: "Línea diesel", groupSlug: "diesel", tags: ["Mineral"], summary: "Diesel alto desempeño SAE 40; TBN 12.", highlights: ["SAE 40", "Mineral", "TBN 12"] },
  { slug: "mobil-delvac-25w50", brand: "mobil", name: "Mobil Delvac 25W-50", category: "lubricantes", group: "Línea diesel", groupSlug: "diesel", tags: ["Mineral"], summary: "Diesel 25W-50, alto kilometraje; API CF-4.", highlights: ["25W-50", "Mineral", "Alto kilometraje"] },
];

export const getProductBrand = (id: string) => productBrands.find((b) => b.id === id);
export const getProductsByBrand = (id: string) => products.filter((p) => p.brand === id);
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
