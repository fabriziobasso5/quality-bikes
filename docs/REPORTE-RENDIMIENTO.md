# Reporte — velocidad, catálogo y fotos (3 nov 2026)

## 1. Antes y después (portada en teléfono)

Medido con un navegador automático simulando un iPhone (375×812, pantalla 2x)
con conexión 4G lenta (1,6 Mbps, 150 ms) y procesador 4 veces más lento, sin
caché, sobre https://qualitybikesvzla.com. Dos pasadas cada vez.

| | Antes | Después |
|---|---|---|
| Peso total al cargar | 1.670 – 2.145 KB | 630 – 719 KB |
| Peso en imágenes | 1.248 – 1.723 KB (13–16 imágenes) | 197 – 286 KB (17–27 imágenes, casi todas de 5–15 KB) |
| Carga completa (evento load) | 10,6 – 11,7 s | 4,3 – 4,8 s |
| Imagen principal visible (LCP) | 5,0 – 10,6 s | 2,5 – 4,1 s |
| Peticiones a /_next/image | 0 | 0 |
| Imágenes rotas | — | 0 |

La meta de ~2 s no se alcanza con esta simulación tan exigente: lo que queda
pesa sobre todo el código de la web (~230 KB) y las tipografías (~160 KB),
que no se tocaron porque mueven la portada. En un 4G normal la carga es
bastante más rápida que estas cifras.

Las cifras de 2,1 MB / 6,6 s que tenías venían de otra herramienta y otra
velocidad simulada; aquí las dos columnas están medidas igual, para que la
comparación sea justa.

## 2. Qué se hizo en cada tarea

**Tarea 1 — Diagnóstico.** Confirmado: fotos de catálogo de 1600 px mostradas
a ~330 px en el teléfono; logos de tienda en PNG de hasta 236 KB (EWAY);
`carbono-forjado.jpg` de 262 KB cargado ya en el encabezado; la moto del plano
pedida por dos capas. La web NO usaba el optimizador de Vercel (`/_next/image`):
`next.config.ts` ya tenía `images: { unoptimized: true }`. Aun así se quitó
`next/image` de todas las fotos para no depender de él nunca. Fuentes: se
cargan desde el propio sitio (sin Google externo); son 5 familias (~160 KB) y
todas se usan en la primera pantalla, así que no se tocaron. Scripts: ~225 KB
comprimidos, sin cambios.

**Tarea 2 — Velocidad de imágenes.**
- `scripts/variantes-fotos.mjs` crea al compilar versiones de cada foto en
  varios anchos (160 a 2400 px según el tipo), AVIF + WebP para portadas,
  plano y fotos a sangre; WebP para galerías, productos y logos. No van a git
  (`public/v/`); Vercel las genera en cada publicación y guarda una caché, así
  que solo se recodifica lo que cambia.
- Cada nombre lleva una huella del contenido: si cambias una foto, cambia la
  dirección. Por eso se sirven con caché de un año (`vercel.json`). El resto de
  archivos de `/images` tiene caché de un día.
- Componente `<Foto>`: el navegador elige el tamaño justo (srcset + sizes),
  carga perezosa fuera de la primera pantalla, espacio reservado y color de
  relleno en las fotos del showroom.
- Logos de tienda: de 236 / 119 / 96 KB a ~10–20 KB.
- `carbono-forjado.jpg`: 262 KB → 45 KB en teléfono (versión de 960 px a calidad
  50; va bajo el velo negro y se comparó: indistinguible).
- Moto del plano: las dos capas piden exactamente la misma versión → una sola
  descarga (49 KB en vez de 157 KB). Comparada píxel a píxel con producción:
  idéntica (la portada no cambió en nada visible).

**Tarea 3 — Suzuki V-Strom 250 SX.** Ficha nueva `/catalogo/suzuki-v-strom-250-sx`,
DISPONIBLE, 0 km. Portada: la foto de prensa de perfil sobre blanco que estaba
en la carpeta (IMG_1098.PNG, negra con rojo, igual que la unidad), centrada con
el mismo encuadre que las demás. Galería: las 8 fotos reales del showroom con el
color corregido (mismo proceso que las demás). Marca Suzuki creada en los
filtros solo con texto (no hay logo de Suzuki en "Logos Marcas QB"). El botón de
WhatsApp lleva "Hola, me interesa la Suzuki V-Strom 250 SX disponible en
Quality Bikes."

*Actualización (mismo día, pedido tuyo):* la V-Strom es 0 km **2027** y se
añadió el color **Azul** (Suzuki: Pearl Fresh Blue / Glass Sparkle Black) con
la foto de prensa oficial de Suzuki de perfil (1280 px; venía con la marca de
agua de la revista Young Machine en una esquina del fondo, que se quitó sin
tocar la moto, y el fondo gris claro se pasó a blanco). Las 8 fotos de tu
showroom quedan en el color Negra. Datos técnicos de la ficha oficial de Suzuki
Japón (modelo 2026, el más reciente publicado; Suzuki aún no publica datos
"2027"): 249 cc monocilíndrico refrigerado por aceite, 19 kW (26 PS ≈ 25,5 hp)
a 9.300 rpm, 22 Nm a 7.300 rpm, 6 marchas, asiento 835 mm, 164 kg en orden de
marcha, tanque 12 L, ruedas 19"/17", ABS de serie. Logos de Yamaha y Suzuki
(los que dejaste en "Logos Marcas QB") puestos en los botones de marca del
catálogo, junto a BMW, Ducati, Kawasaki y Voge.

**Tarea 4 — Voge DS 900X.** La portada y la única foto de la ficha es ahora la
Gris Verde (foto de prensa sobre blanco que ya estaba procesada). Se quitaron
de la página el selector de colores y las fotos Black Knight y Gris Azul de la
0 km; el color de la ficha dice "Gris Verde" y se quitó el argumento "Edición
especial Black Knight" de la 0 km. La DS 900X Black Knight **usada** 2025 sigue
igual en su ficha. Nada borrado de tu Escritorio.

**Tarea 5 — Fotos de las usadas.** Ver decisiones (punto 3).

**Tarea 6 — Catálogo.** La columna larga de la portada ("En el showroom
ahora", una moto por pantalla) se cambió por el catálogo completo: 2 tarjetas
por fila en el teléfono, 3 en tablet, 4 en computadora; foto sobre blanco con
sombra suave, marca, modelo, etiqueta Nueva / Usada / Próximo arribo, "Ver
ficha" y botón de WhatsApp con el nombre de la moto. Barra pegada bajo el
encabezado al bajar: buscador (encuentra "vstrom", "V-Strom", "ducati"…),
contador "N motos" y chips deslizables: Todas · Marca · Tipo · Estado. Sin
resultados sale "¿No encuentras lo que buscas?" con botón a WhatsApp. Lo mismo
en la página "Inventario completo". Sin precios en ningún sitio.

**Tarea 7 — Botones flotantes y detalles.** WhatsApp más pequeño en el teléfono
(48 px), a 1 rem del borde y respetando la barra del iPhone. Instagram ya no
flota en el teléfono (sigue en el pie de página); en computadora se mantiene
encima de WhatsApp. Textos alternativos descriptivos en fotos de motos ("Suzuki
V-Strom 250 SX en Quality Bikes Caracas"), logos y galería; las decorativas
llevan alt vacío. Sin desplazamiento horizontal en ninguna página revisada
(portada, 5 fichas, inventario, productos, una marca, nosotros, contacto).

**Tarea 8 — Verificación.** Compilación sin errores. Capturas en 375×812, 768 y
1440 de portada, catálogo, filtros, fichas (V-Strom, DS 900X, Multistrada V2 S,
WR450F, F 800 GS), menú y pie. 0 imágenes rotas, 0 errores de consola, 0
peticiones a /_next/image. Publicado en dos lotes.

## 3. Decisiones dudosas (revísalas)

- **Motos usadas (Tarea 5):** en cada carpeta encontré UNA foto sobre blanco
  (del 30 de septiembre), no tres. Y la web ya muestra algo igual o mejor:
  - **BMW F 800 GS:** la portada actual es el recorte de *tu unidad real* (con
    maletas y baúl). La foto "nueva" (`f800.jpeg`, 643 px) es de prensa, de una
    moto plateada sin maletas y con fondo gris. Se dejó la actual.
  - **Ducati Multistrada V2 S:** la foto nueva (`v2s fondo blanco.webp`) es la
    misma que ya está publicada. Sin cambios.
  - **Yamaha WR450F — opción 1 (ya aplicada desde antes):** la portada actual es
    el recorte de la foto real de *vuestra unidad en versión motard*, sobre
    blanco. La foto nueva (`wr450f.jpeg`) es la WR450F original de enduro y NO se
    usó. No hizo falta editar ni fabricar nada.
  - No vi otras usadas con una foto claramente peor que otra disponible.
- **Portada de la V-Strom:** pediste frente/tres cuartos; usé la foto de perfil
  sobre blanco para que se vea igual que las demás motos del catálogo (todas de
  perfil, mirando a la derecha). La foto de tres cuartos real abre la galería
  justo después. La foto de prensa es pequeña (810 px): se ve bien en tarjetas;
  en la ficha en computadora se nota un poco más suave.
- **Tipos de moto:** los datos ya tenían un campo de categoría; el filtro las
  agrupa así: *Aventura* = KLR 650, KLE 500, Multistrada V2 S, F 800 GS,
  V-Strom 250 SX y todas las Voge DS; *Naked* = Monster; *Supermotard* = WR450F;
  *Cruiser* = CU 250 y CU 625; *Scooter* = SR 450X. Dudé con la **KLR 650**
  (estaba como "enduro"; la puse en Aventura) y la **DS 300X** (trail pequeña,
  en Aventura).
- **Menú "Catálogo":** sigue abriendo el panel con todas las motos (como hasta
  hoy, también en el teléfono). El catálogo con filtros está en la portada
  (debajo del plano) y en "Ver inventario completo".
- **Se quitó el botón "Ver todo el catálogo"** de la portada: la sección ya
  muestra todas las motos.
- **vercel.json nuevo:** solo añade las reglas de caché; no cambia cómo se
  publica.

## 4. Lo que necesito de ti

- **Suzuki V-Strom 250 SX:** confirma que los datos oficiales del modelo 2026
  valen para tus unidades 2027. Cuando tengas la azul en el showroom, fotos
  reales de ella.
- Si tenías más fotos nuevas de la Ducati, Yamaha o BMW (pediste revisar 3 por
  carpeta y solo había 1), déjalas en esas carpetas y las reviso.
