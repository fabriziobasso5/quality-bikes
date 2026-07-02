// Configuración central de la marca.
export const siteConfig = {
  name: "Quality Bikes",
  slogan: "...mucho más que solo motos",
  tagline: "Motocicletas de alta cilindrada. Curadas para quienes exigen lo mejor.",
  description:
    "Concesionario de motocicletas en Caracas especializado en marcas de lujo como BMW, además de Ducati, Honda, Suzuki, Kawasaki, Yamaha, Voge y Kymco. Asesoría experta, financiamiento y servicio especializado.",
  url: "https://www.qualitybikes.example", // TODO: dominio real
  contact: {
    whatsappNumber: "584140267022",
    whatsappDisplay: "+58 414 026 7022",
    phoneAltDisplay: "+58 414 325 6868",
    email: "fabrizio@qualitybikesvzla.com",
    address: "C. Comercio, Caracas 1080, Miranda, Venezuela",
    mapsUrl: "https://maps.app.goo.gl/CpP6jYSy3NXsYs2x6",
    mapsEmbedUrl: "https://www.google.com/maps?cid=4800077332504803431&output=embed",
    hours: "Lunes a Viernes, 8:00 am – 5:00 pm",
  },
  social: {
    instagram: "https://instagram.com/qualitybikes_vzla",
    instagramHandle: "@qualitybikes_vzla",
  },
  // Orden intencional: BMW y Ducati primero (marcas de lujo, el foco del negocio),
  // el resto son las marcas adicionales que también se comercializan.
  brandsRepresented: [
    "BMW",
    "Ducati",
    "Honda",
    "Yamaha",
    "Suzuki",
    "Kawasaki",
    "Voge",
    "Kymco",
  ],
  // Productos complementarios en tienda física (lubricantes/racing), no motocicletas.
  productsCarried: [
    { name: "VP Racing", description: "Combustibles y aditivos de competición" },
    { name: "Mobil 1", description: "Lubricantes sintéticos de alto desempeño" },
    { name: "BK3", description: "Aceites y productos de mantenimiento" },
  ],
} as const;

export function buildWhatsAppLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encoded}`;
}
