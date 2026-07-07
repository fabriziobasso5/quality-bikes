// Configuración central de la marca.
export const siteConfig = {
  name: "Quality Bikes",
  slogan: "...mucho más que solo motos",
  tagline: "Motocicletas de alta cilindrada. Curadas para quienes exigen lo mejor.",
  description:
    "Concesionario multimarca de motocicletas de alta cilindrada en Caracas: BMW, Ducati, Honda, Suzuki, Kawasaki, Yamaha y Voge. Asesoría experta y personalizada para conseguir la moto de tus sueños.",
  url: "https://fabriziobasso5.github.io/quality-bikes/",
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
  // Concesionario multimarca — sin orden de énfasis por marca.
  brandsRepresented: ["BMW", "Ducati", "Honda", "Yamaha", "Suzuki", "Kawasaki", "Voge"],
  // Productos complementarios en tienda física (lubricantes/racing), no
  // motocicletas. El logo oficial de BK3 tiene elementos blancos, por eso se
  // usa la versión sobre tarjeta azul marino de marca (card: true); la versión
  // de fondo transparente queda de respaldo en /images/brands/bk3-transparente.webp.
  productsCarried: [
    {
      name: "VP Racing",
      description: "Aditivos, gasolina de alto octanaje, ethanol y aceites",
      logo: "/images/brands/vp-racing.png",
      card: false,
    },
    {
      name: "Mobil 1",
      description: "Aceites",
      logo: "/images/brands/mobil-1.svg",
      card: false,
    },
    {
      name: "BK3",
      description: "Aditivos",
      logo: "/images/brands/bk3-tarjeta-navy.webp",
      card: true,
    },
  ],
} as const;

export function buildWhatsAppLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encoded}`;
}
