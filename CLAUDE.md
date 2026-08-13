# Quality Bikes — contexto permanente del proyecto

## Quién es el dueño y cómo trabajamos
Fabrizio, dueño de Quality Bikes. NO programa. Tú escribes todo el código.
Explica las cosas en lenguaje claro, sin jerga técnica y sin dar por sentado conocimientos.
Las órdenes llegan de a poco; ejecútalas de principio a fin.

## El negocio
Quality Bikes: concesionario de motos premium de alta cilindrada en Caracas, Venezuela
(Av. Principal, Urb. Prados del Este). Slogan: "mucho más que solo motos".
También vende productos de mantenimiento de 5 marcas: VP Racing, Mobil, BK3, Falken y EWAY.
Marca hermana: Quality Yachts (lanchas, todavía sin web).

REGLA DE NEGOCIO INNEGOCIABLE: los precios NUNCA se muestran en el sitio.
Todo el flujo de compra o cotización termina en WhatsApp: +58 414 026 7022.

## Proyecto técnico
- Repo local: ~/quality-bikes
- GitHub: fabriziobasso5/quality-bikes, rama main
- En vivo: https://fabriziobasso5.github.io/quality-bikes/
- Stack: Next.js (App Router) + Tailwind CSS, export estático a GitHub Pages
- basePath: /quality-bikes (cuidado con rutas de imágenes y links)

## Identidad de marca — respetar siempre
- Colores: azul marino #003462, rojo #D51C29, gris taupe #A79F9D, sobre fondo blanco
- Tipografías: Space Grotesk (titulares), Inter (cuerpo), Space Mono (datos técnicos)
- Estética: minimalista y de lujo. Referencias: Ducati (mega-menú de catálogo),
  CAKE / ridecake.com (limpieza escandinava, producto sobre blanco con sombra),
  efectos interactivos tipo Jesko Jets y Lando Norris.
- Todo lo nuevo debe verse como si siempre hubiera estado ahí. Nada genérico,
  nada que parezca plantilla.

## Estructura actual de la portada (en orden)
1. Plano de entrada / hero
2. Motos del showroom (disponibles hoy)
3. Foto grande de la BMW (respiro visual, sin texto encima)
4. Contadores (45 motos, +250 clientes)
5. Productos de tienda (las 5 marcas)
6. Carrusel de próximos arribos
7. Cierre: invitación + mapa

Otras páginas: /productos (las 5 marcas, fondo fibra de carbono), /productos/[marca],
/nosotros (termina con la animación de despiece de la moto), /contacto.

## Reglas de trabajo — seguir en cada tarea
1. Dividir el trabajo en pasos numerados y anunciarlos antes de ejecutarlos.
2. Verificar SIEMPRE el resultado visualmente en el navegador, en desktop Y en móvil
   (ancho ~390px). Nada se da por terminado sin haberlo visto.
3. Al terminar y verificar: build + commit + push a main de una vez, sin pedir
   confirmación aparte. El cambio debe quedar en producción.
4. No descargar imágenes de internet ni intentar generarlas: las fotos las provee Fabrizio.
5. Si una orden nueva contradice algo ya hecho, avisarlo en vez de mezclar las dos versiones.
6. Si algo no se puede hacer como se pidió, proponer la alternativa más cercana en lugar
   de improvisar.
