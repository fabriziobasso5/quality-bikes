export type MotoCategory = "dual-sport" | "enduro" | "naked" | "adventure";

// Una combinación de color de fábrica de un modelo/año concreto. Solo se
// declara cuando hay fotos REALES de cada color: media docena de muestras de
// color que al pulsarlas no cambian nada se ve peor que no tenerlas.
export interface MotoColorway {
  // Coincide con la subcarpeta de fotos: /images/inventory/<slug>/<id>/
  id: string;
  // Nombre de fábrica, tal cual aparece en la ficha oficial.
  name: string;
  // Muestra circular del selector. Color CSS o degradado para las bicolor.
  swatch: string;
  photoCount: number;
  // Foto sobre fondo blanco que abre la galería de este color. Solo la hay
  // cuando el fabricante publicó prensa de esa combinación.
  lead?: string;
  // Accesorios montados en la unidad fotografiada — no vienen con la moto.
  accessories?: string[];
  // Edición especial de fábrica (las Black Knight de Voge): la ficha le da un
  // tratamiento visual propio en vez de tratarla como un color más.
  special?: boolean;
}

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
  // Tres o cuatro argumentos de venta de la moto, en la ficha. Salen de la
  // hoja técnica del fabricante — nada de adjetivos sin dato detrás.
  highlights?: string[];
  // Fotos en public/images/inventory/<slug>/ — reales cuando la unidad ya pasó por
  // el showroom; fotos oficiales de fábrica para modelos de próximo arribo.
  // Cuando hay `colorways`, cada color trae las suyas y este número es el del
  // primer color (el que se muestra al entrar).
  photoCount: number;
  colorways?: MotoColorway[];
}

// Portada de catálogo/mega-menú: foto de prensa oficial del fabricante en
// public/images/catalog/<slug>.webp — perfil derecho sobre fondo blanco puro,
// normalizada a lienzo 4:3 para que todas las motos se vean del mismo tamaño
// (estilo ducati.com). La galería de la ficha sigue usando las fotos reales
// de public/images/inventory/<slug>/.
export function catalogCoverPath(slug: string) {
  return `/images/catalog/${slug}.webp`;
}

/** El color que se muestra al entrar en la ficha, si el modelo tiene varios. */
export function defaultColorway(moto: Motorcycle) {
  return moto.colorways?.[0];
}

/**
 * Rutas de las fotos de la unidad. Con `colorways`, las fotos cuelgan de una
 * subcarpeta por color; sin ellos, directamente de la carpeta del modelo. Todo
 * el sitio pasa por aquí para que las tarjetas y la galería nunca apunten a
 * rutas distintas.
 */
export function motoPhotoPaths(moto: Motorcycle, colorwayId?: string): string[] {
  const cw = moto.colorways?.find((c) => c.id === colorwayId) ?? defaultColorway(moto);
  if (cw) {
    return Array.from(
      { length: cw.photoCount },
      (_, i) => `/images/inventory/${moto.slug}/${cw.id}/${i + 1}.webp`
    );
  }
  return Array.from(
    { length: moto.photoCount },
    (_, i) => `/images/inventory/${moto.slug}/${i + 1}.webp`
  );
}

/** Secuencia completa de la galería: la foto sobre blanco y luego las reales. */
export function galleryPaths(moto: Motorcycle, colorwayId?: string): string[] {
  const cw = moto.colorways?.find((c) => c.id === colorwayId) ?? defaultColorway(moto);
  const lead = cw ? cw.lead : catalogCoverPath(moto.slug);
  return [...(lead ? [lead] : []), ...motoPhotoPaths(moto, colorwayId)];
}

// Inventario 2026-08-10: unidades físicas en showroom (Kawasaki KLE 500 SE ABS,
// Kawasaki KLR 650 ABS, Ducati Monster, Ducati Multistrada V4 S) + la gama dual
// sport Voge DS-X de próximo arribo. Se retiraron Kymco, los scooters Voge
// SR3/SR4 y la BMW G 310 GS. El precio nunca se muestra (decisión de negocio):
// "consultar disponibilidad y precio" fuerza contacto directo.
export const motorcycles: Motorcycle[] = [
  {
    // Datos de la ficha oficial Kawasaki 2026 (2026KLE500-SE-ABS.pdf): las
    // medidas del folleto vienen en pulgadas y libras, aquí van convertidas.
    slug: "kawasaki-kle-500",
    brand: "Kawasaki",
    model: "KLE 500 SE ABS",
    year: 2026,
    cc: 451,
    category: "dual-sport",
    condition: "0km",
    availability: "en-stock",
    featured: true,
    summary:
      "El regreso del nombre KLE: bicilíndrico paralelo de 451 cc con rueda delantera de 21\", chasis trellis y equipamiento SE de serie. La adventure de acceso que no se siente de acceso.",
    highlights: [
      "Bicilíndrico paralelo de 451 cc con 51 hp a 10.000 rpm y 43 Nm a 7.500 rpm",
      "Rueda delantera de 21\" y horquilla invertida de 43 mm con 211 mm de recorrido",
      "185 mm de despeje al suelo sobre chasis trellis de acero de alta resistencia",
      "Acabado SE de serie: pantalla regulable en altura, cubremanos, cubrecárter de aluminio y toma USB-C",
      "Cuadro TFT a color de 4,3\" con conectividad al móvil e iluminación full LED",
      "ABS de serie en los dos discos — 300 mm delante, 230 mm detrás",
    ],
    specs: {
      power: "51 hp",
      transmission: "Sincrónica",
      gears: "6",
      cylinders: "2 cilindros (paralelo)",
      color: "Pearl Blizzard White / Metallic Bluish Green",
      seatHeight: "871 mm",
      weight: "194 kg",
    },
    photoCount: 10,
    colorways: [
      {
        id: "blanco",
        name: "Pearl Blizzard White",
        swatch: "#EDEFF1",
        photoCount: 10,
        // Única de las dos con foto de prensa sobre blanco publicada por
        // Kawasaki, así que es también la portada del catálogo.
        lead: "/images/catalog/kawasaki-kle-500.webp",
        accessories: ["Escape Akrapovič", "Barras laterales", "Center stand"],
      },
      {
        id: "verde",
        name: "Metallic Bluish Green",
        swatch: "#2C3E3B",
        photoCount: 10,
        lead: "/images/catalog/kawasaki-kle-500-verde.webp",
      },
    ],
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
    highlights: [
      "Monocilíndrico de 650 cc y 40 hp, la mecánica más probada del segmento",
      "ABS de fábrica, por primera vez de serie en el KLR",
      "870 mm de altura de asiento y 209 kg listos para cargar equipaje",
      "Unidad 0 km disponible ahora mismo en el showroom",
    ],
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
    mileageKm: 500,
    availability: "en-stock",
    featured: true,
    summary: "La naked italiana por excelencia: motor Testastretta 11° de 111 hp, 166 kg en seco y la agilidad que hizo leyenda al nombre Monster.",
    highlights: [
      "Testastretta 11° de 937 cc con 111 hp — potencia de superbike en formato naked",
      "166 kg en seco: de las naked medias más ligeras que se pueden comprar",
      "Cambio de 6 marchas con Quick Shift subida y bajada",
      "820 mm de altura de asiento, accesible sin renunciar a nada",
    ],
    specs: { power: "111 hp", transmission: "Sincrónica", gears: "6 + Quick Shift", cylinders: "2 cilindros (L-Twin)", color: "Rojo Ducati", seatHeight: "820 mm", weight: "188 kg" },
    photoCount: 10,
  },
  {
    slug: "ducati-multistrada-v4",
    brand: "Ducati",
    model: "Multistrada V4 S",
    year: 2025,
    cc: 1158,
    category: "adventure",
    condition: "seminueva",
    availability: "en-stock",
    featured: true,
    summary: "La sport-touring definitiva: V4 Granturismo de 170 hp con radar, electrónica de punta y comodidad para devorar continentes.",
    highlights: [
      "V4 Granturismo de 1.158 cc y 170 hp — el motor de cuatro cilindros más compacto de su clase",
      "Altura de asiento regulable entre 840 y 860 mm sin herramientas",
      "Cambio de 6 marchas con Quick Shift subida y bajada",
      "Unidad seminueva en el showroom, lista para entrega inmediata",
    ],
    specs: { power: "170 hp", transmission: "Sincrónica", gears: "6 + Quick Shift", cylinders: "4 cilindros (V4)", color: "Rojo Ducati", seatHeight: "840–860 mm", weight: "229 kg" },
    // Galería con las 14 fotos reales de la unidad en el showroom (sesión de
    // agosto 2026). La portada del catálogo sigue siendo la oficial sobre blanco.
    photoCount: 14,
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
    highlights: [
      "Bicilíndrico de 895 cc y 94 hp: el mismo bloque que fabrica Loncin para el BMW F 900 GS",
      "Tornillería y despieces compatibles con BMW, a una fracción del precio",
      "825 mm de altura de asiento, la más accesible de la gama grande",
      "Edición especial Black Knight en negro, con llantas de radios doradas",
    ],
    specs: { power: "94 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Black Knight · Gris Azul · Gris Verde", seatHeight: "825 mm", weight: "215 kg" },
    photoCount: 0,
    colorways: [
      {
        id: "black-knight",
        name: "Black Knight",
        swatch: "#16181A",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-900x.webp",
        special: true,
      },
      {
        id: "gris-azul",
        name: "Gris Azul",
        swatch: "linear-gradient(135deg, #E8EAEC 50%, #1F4E9C 50%)",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-900x-gris-azul.webp",
      },
      {
        id: "gris-verde",
        name: "Gris Verde",
        swatch: "linear-gradient(135deg, #D9DCDE 50%, #B4D435 50%)",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-900x-gris-verde.webp",
      },
    ],
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
    highlights: [
      "Bicilíndrico de 798 cc y 94 hp con ABS y control de tracción conmutables",
      "850 mm de asiento y cotas de rally: la más off-road de la gama DS",
      "213 kg, doce menos que la DS 900X pese a la misma potencia",
    ],
    specs: { power: "94 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Blanco Azul · Black Knight", seatHeight: "850 mm", weight: "213 kg" },
    photoCount: 0,
    colorways: [
      {
        id: "blanco-azul",
        name: "Blanco Azul",
        swatch: "linear-gradient(135deg, #F2F4F6 50%, #1B3D7A 50%)",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-800x-rally.webp",
      },
      {
        id: "black-knight",
        name: "Black Knight",
        swatch: "#16181A",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-800x-rally-negro.webp",
        special: true,
      },
    ],
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
    highlights: [
      "Cigüeñal a 270°: el tacto y el sonido de una gran trail en 581 cc",
      "Dos modos de manejo, Eco y Sport, con ABS y control de tracción conmutables",
      "191 kg, la más ligera de las bicilíndricas de la gama",
    ],
    specs: { power: "63 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Beige · Black Knight", seatHeight: "835 mm", weight: "191 kg" },
    photoCount: 0,
    colorways: [
      {
        id: "beige",
        name: "Beige",
        swatch: "#E5C9A6",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-625x.webp",
      },
      {
        id: "black-knight",
        name: "Black Knight",
        swatch: "#16181A",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-625x-negra.webp",
        special: true,
      },
    ],
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
    highlights: [
      "Bicilíndrico de 494 cc y 47 hp — dentro del límite del carné A2",
      "ABS Bosch desconectable para salir del asfalto sin pelear con la moto",
      "810 mm de asiento: pies en el suelo con toda la pinta de una trail grande",
    ],
    specs: { power: "47 hp", transmission: "Sincrónica", gears: "6", cylinders: "2 cilindros", color: "Azul · Amarilla · Black Knight", seatHeight: "810 mm", weight: "206 kg" },
    photoCount: 0,
    colorways: [
      {
        id: "azul",
        name: "Azul",
        swatch: "linear-gradient(135deg, #DCE0E4 50%, #1F5BB5 50%)",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-525x.webp",
      },
      {
        id: "amarilla",
        name: "Amarilla",
        swatch: "linear-gradient(135deg, #D7DADD 50%, #E8C21C 50%)",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-525x-amarilla.webp",
      },
      {
        id: "black-knight",
        name: "Black Knight",
        swatch: "#16181A",
        photoCount: 0,
        lead: "/images/catalog/voge-ds-525x-negra.webp",
        special: true,
      },
    ],
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
    highlights: [
      "155 kg: la más ligera del catálogo, se maneja parada y en ciudad sin esfuerzo",
      "Monocilíndrico de 292 cc y 28 hp, pensado para hacer kilómetros sin dramas",
      "810 mm de asiento — el escalón natural antes de una alta cilindrada",
    ],
    specs: { power: "28 hp", transmission: "Sincrónica", gears: "6", cylinders: "1 cilindro", color: "Gris", seatHeight: "810 mm", weight: "155 kg" },
    // Próximo arribo: solo la foto de prensa sobre blanco, que ya es la portada.
    photoCount: 0,
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
