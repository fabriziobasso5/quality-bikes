import Foto, { FondoCarbono } from "@/components/Foto";
import Link from "next/link";
import BrandStats from "@/components/BrandStats";
import BlueprintReveal from "@/components/BlueprintReveal";
import CatalogoMotos from "@/components/CatalogoMotos";
import FeaturedArrivals from "@/components/FeaturedArrivals";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { motorcycles } from "@/data/motorcycles";
import { productBrands } from "@/data/products";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";

// Home editorial (referencias aprobadas: mega-menú Ducati, estética CAKE).
// Regla de composición: una idea protagonista por pantalla, aire generoso,
// bloques de producto sobre blanco alternados con fotos lifestyle a sangre.
export default function Home() {
  const upcoming = motorcycles.filter((m) => m.availability === "proximo-arribo");

  return (
    <>
      {/* Portada: la R 1250 GS Adventure Triple Black materializándose sobre
          el plano técnico, con la identidad de la casa (título rojo, isotipo,
          marcas y eslogan). Intercambiada con el despiece de la R 1300, que
          ahora cierra la página. */}
      <BlueprintReveal />

      {/* Catálogo: todas las motos en tarjetas compactas con filtros por
          marca, tipo y estado, buscador y contador. Antes era una columna con
          solo las del showroom, una moto por pantalla en el teléfono. El id es
          "motos" y no "catalogo": #catalogo es la parada del historial que abre
          el mega-menú, y con ese id el navegador saltaría aquí al abrirlo. */}
      <section id="motos" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 sm:py-28">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Catálogo</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-5xl">
            Encuentra tu moto
          </h2>
          <p className="mt-4 max-w-lg text-brand-text/65">
            Nuevas, usadas y por llegar. Filtra por marca, tipo o estado y escríbenos por
            WhatsApp por la que te guste.
          </p>
        </Reveal>
        <div className="mt-10">
          <CatalogoMotos motos={motorcycles} origin="catalogo" />
        </div>
      </section>

      {/* Productos en tienda: marcas complementarias, mismos logos en placas
          idénticas. Fondo de fibra de carbono forjada — misma familia visual
          que header/footer — con divisor superior + eyebrow en rojo de marca
          para marcar que aquí empieza la zona de tienda. Intercambiada con la
          foto de la R 1300, que ahora va después de los contadores. */}
      <section className="relative overflow-hidden border-t border-black/10">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <FondoCarbono sizes="(max-width: 1024px) 1600px, 100vw" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(120% 85% at 50% 0%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
          <Reveal className="text-center">
            <span aria-hidden className="mx-auto mb-6 block h-px w-12 bg-brand-red" />
            <p className="text-sm font-medium tracking-[0.3em] text-brand-red uppercase">
              También en tienda
            </p>
          </Reveal>
          {/* Cinco marcas no se reparten parejo en 2 ni en 3 columnas: siempre
              sobraba una placa suelta pegada a la izquierda. Hasta lg va una
              sola columna centrada (toda fila llena, simetría trivial) y en lg
              entran las cinco en una única fila. */}
          <RevealGroup className="mx-auto mt-14 grid max-w-sm grid-cols-1 gap-8 lg:max-w-6xl lg:grid-cols-5">
          {siteConfig.productsCarried.map((product, i) => {
            // productsCarried y productBrands describen las mismas casas en el
            // mismo orden (VP Racing, Mobil, BK3, Falken, EWAY): el índice da
            // el id de la ruta. (Asunción: si se reordena una lista, reordenar
            // la otra.)
            const brandId = productBrands[i]?.id;
            return (
              <RevealItem key={product.name} className="text-center">
                <Link href={brandId ? `/productos/${brandId}` : "/productos"} className="group block">
                  {/* Placas idénticas: el logo se maximiza dentro del mismo
                      marco en todas las marcas, así se ven simétricos en tamaño. */}
                  <div className="flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white px-7 shadow-sm shadow-black/[0.04] transition duration-300 group-hover:-translate-y-1 group-hover:border-black/20 group-hover:shadow-lg group-hover:shadow-black/10">
                    <Foto
                      src={product.logo}
                      alt={`Logo de ${product.name}`}
                      sizes="(max-width: 1024px) 330px, 180px"
                      sinMedidas
                      className="max-h-16 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* En la fila de cinco las columnas son estrechas y algunas
                      descripciones caen a dos líneas: se reservan las dos
                      siempre para que el "Ver productos" quede a la misma
                      altura en las cinco. En una columna sobra, todas caben
                      en una línea. */}
                  <p className="mt-4 text-sm text-white/60 lg:min-h-10">{product.description}</p>
                  <p className="link-underline mt-2 inline-block text-xs tracking-widest text-white/85 uppercase">
                    Ver productos →
                  </p>
                </Link>
              </RevealItem>
            );
          })}
          </RevealGroup>
        </div>
      </section>

      {/* Franja de datos de marca: respira entre la tienda y el lifestyle */}
      <BrandStats />

      {/* Lifestyle a sangre — BMW R 1300 GS Adventure en paisaje de montaña
          (foto de prensa oficial, alta resolución). La foto va recortada de
          origen a 2:1 quitándole cielo: a 3:2 el recorte de object-cover se
          comía las ruedas. */}
      <section className="relative h-[65vh] overflow-hidden">
        <Foto
          src="/images/lifestyle/bmw-r1300-gsa-scenic.webp"
          alt="BMW R 1300 GS Adventure sobre un mirador de montaña al atardecer"
          fill
          placeholder
          /* La caja es más alta que ancha en el teléfono y la foto es 2:1:
             con object-cover se ve al ancho de 2 × 65vh, no al de la pantalla. */
          sizes="(orientation: portrait) 130vh, 100vw"
          /* En móvil la caja es vertical y solo cabe un tercio del ancho de la
             foto, así que el foco horizontal tiene que caer sobre la moto: en
             el recorte actual está centrada (~49%), no a la derecha.
             En escritorio el foco vertical se baja al 60%: la caja es muy
             apaisada (65vh) y con el foco centrado, en pantallas anchas y
             bajas el recorte volvía a comerse las ruedas. Bajarlo sacrifica
             cielo, que es justo lo que sobra. */
          className="object-cover object-center sm:object-[50%_60%]"
        />
      </section>

      {/* Moto destacada rotativa (estilo CAKE): alterna cada ~5 s entre TODAS
          las motos de próximo arribo — foto flotante, specs y "Reservar". */}
      {upcoming.length > 0 && <FeaturedArrivals motos={upcoming} />}

      {/* Cierre: la invitación y el mapa en un solo bloque. Antes eran dos
          secciones separadas por una franja de foto; al quitarla, el texto se
          quedaba huérfano entre dos bloques y con su propio "Visítanos"
          repetido justo encima del del mapa. */}
      <section className="border-t border-black/5 bg-brand-bg-soft">
        <Reveal className="mx-auto max-w-3xl px-6 py-14 text-center sm:py-16">
          <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Visítanos</p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-wide uppercase sm:text-4xl">
            Te ayudamos a conseguir la moto de tus sueños
          </h2>
          <p className="mx-auto mt-5 max-w-md text-brand-text/70">
            Te acompañamos en todo el proceso, desde elegir el modelo correcto hasta la
            entrega. Pásate por el showroom.
          </p>
        </Reveal>
        <div className="relative">
          <div className="h-[500px] w-full">
            <iframe
              src={siteConfig.contact.mapsEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Quality Bikes en Caracas"
            />
          </div>
          {/* Tarjeta de datos: overlay flotante en desktop; en mobile fluye
              debajo del mapa (static) para no ocultar la ubicación. */}
          <div className="static m-6 sm:absolute sm:bottom-8 sm:left-8 sm:m-0 sm:max-w-xs">
            <div className="rounded-2xl border border-black/10 bg-white/95 p-6 shadow-xl shadow-black/10 backdrop-blur-sm">
              <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Quality Bikes</p>
              <dl className="mt-4 space-y-3 text-sm text-brand-text/80">
                <div>
                  <dt className="text-xs tracking-widest text-brand-text/50 uppercase">Dirección</dt>
                  <dd className="mt-1">C. Comercio, Caracas 1080, Miranda</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-widest text-brand-text/50 uppercase">Horario</dt>
                  <dd className="mt-1">Lun–Vie · 8:00 am – 5:00 pm</dd>
                </div>
              </dl>
              <a
                href={buildWhatsAppLink("Hola, quiero más información sobre Quality Bikes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-xs tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
              >
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
