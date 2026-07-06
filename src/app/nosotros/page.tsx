import type { Metadata } from "next";
import MotoImagePlaceholder from "@/components/MotoImagePlaceholder";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Conoce la historia y el equipo detrás de ${siteConfig.name}, el concesionario de motos premium en Caracas.`,
};

// TODO: reemplazar con historia real, fotos del equipo y del showroom cuando el cliente las entregue.
const team = [
  { name: "Nombre Apellido", role: "Fundador / Director" },
  { name: "Nombre Apellido", role: "Asesor de ventas senior" },
  { name: "Nombre Apellido", role: "Jefe de taller y servicio técnico" },
];

export default function NosotrosPage() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Nosotros</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">
          {siteConfig.name}
        </h1>
        <p className="font-script mt-2 text-3xl text-brand-navy">{siteConfig.slogan}</p>
        <p className="mt-6 max-w-2xl text-brand-text/70">
          Quality Bikes abrió sus puertas hace 4 años, pero nuestro equipo trae consigo
          más de 40 años de experiencia en la industria de venta de motocicletas en
          Venezuela. Esa trayectoria es la que nos permite ofrecer una curaduría
          rigurosa, asesoría experta y un respaldo postventa que protege tu inversión a
          largo plazo. Somos multimarca: BMW, Ducati, Honda, Yamaha, Suzuki, Kawasaki y
          Voge, con especial atención a los modelos más buscados de cada una — como la
          BMW R 1250 GS Adventure, nuestra más vendida, junto a la Honda Africa Twin, la
          Ducati Multistrada, la Yamaha Ténéré, la Suzuki DR650 y la Kawasaki KLR 650 ABS.
        </p>
        <p className="mt-4 max-w-2xl text-brand-text/70">
          Formamos parte del mismo grupo que Moto Accesorios Baro, nuestra otra tienda
          — en funcionamiento desde hace décadas — especializada en motos económicas y
          de baja cilindrada. Quality Bikes nace como su extensión natural hacia el
          segmento premium.
        </p>
      </section>

      <section className="border-y border-black/10 bg-brand-bg-soft py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl uppercase tracking-wide">Nuestro equipo</h2>
          </Reveal>
          <RevealGroup className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {team.map((member) => (
              <RevealItem key={member.name}>
                <MotoImagePlaceholder brand={member.name} model="" className="h-48 w-full" />
                <p className="mt-4 font-display tracking-wide uppercase">{member.name}</p>
                <p className="text-sm text-brand-text/60">{member.role}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-2xl uppercase tracking-wide">Nuestro showroom</h2>
          <p className="mt-4 max-w-2xl text-brand-text/70">
            Visítanos en {siteConfig.contact.address}. Un espacio pensado para que vivas la
            experiencia de marca antes de decidir.
          </p>
          <MotoImagePlaceholder brand="Showroom" model="Quality Bikes" className="mt-8 h-80 w-full" />
        </Reveal>
      </section>
    </div>
  );
}
