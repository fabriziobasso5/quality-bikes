# Chequeo general de la web — 14 nov 2026

Revisado en vivo (https://qualitybikesvzla.com) y en el código, en computadora
(1440 px), tablet (768 px) y teléfono (375 px). 26 páginas por cada tamaño,
más pruebas a mano del menú, el catálogo, el buscador y el pedido de productos.
**En esta revisión no se cambió nada de la web**: solo se anotó.

---

## Tarea 1 — Voge DS 900X usada: retirada ✅

- **Qué se quitó:** la ficha de la *DS 900X Black Knight 2025 usada* (4.861 km).
  Desaparece del catálogo de la portada, del inventario completo, del menú
  "Catálogo", de "También te puede interesar" y de los filtros. La web no tiene
  sitemap (ver 🔴 3), así que no hubo que tocarlo.
- **La DS 900X nueva (Gris Verde) sigue igual:** misma ficha, misma foto, mismo
  botón de WhatsApp.
- **Contadores después del cambio:** 15 motos en total · Usadas 4 · Voge 8 ·
  Nuevas 6 · Próximo arribo 5. Ningún filtro queda vacío.
- **Redirección:** `/catalogo/voge-ds-900x-usada` → `/catalogo/inventario` con
  301 (redirección permanente), comprobada en vivo. Se añadió esa sola regla a
  `vercel.json`, con tu permiso.
- **Fotos:** las 10 de la galería, la portada sobre blanco y la imagen para
  compartir se movieron a `_archivo/vendidas/voge-ds900x-usada/`. Ya no se
  publican (sus direcciones viejas dan 404), pero no se borraron.
- **Publicado:** commit `5b6c7e9`, deploy de Vercel en estado "Ready". Revisado
  en vivo en computadora y en teléfono: 0 errores, 0 fotos rotas, 0 peticiones
  a `/_next/image`.

---

## Lo que está bien (sin cambios necesarios)

- **Enlaces:** los 27 enlaces distintos de la web responden bien. Ningún 404 interno.
- **WhatsApp:** todos van al +58 414 026 7022 con mensaje precargado. Cada moto
  lleva su nombre. El pedido de productos arma la lista con las cantidades y
  presentaciones, y se mantiene si recargas la página.
- **Fotos:** 0 rotas y 0 peticiones a `/_next/image` en las 78 combinaciones de
  página y tamaño.
- **Precios:** ninguno visible en ninguna página.
- **Catálogo:** el buscador funciona ("vstrom", "V-Strom", "ducati", "bmw f800",
  "900"). Los 14 filtros cuadran, y cuando no hay resultados sale "¿No encuentras
  lo que buscas?" con botón a WhatsApp.
- **Diseño:** en ninguna página la pantalla se desplaza hacia los lados. El menú
  del teléfono abre y navega bien, y el mega-menú de computadora también.
- **Consola:** 0 errores en las páginas reales. Solo un aviso menor en /productos
  (ver 🟢).
- **Compilación:** sin errores ni avisos.
- **Mapa** de Google: carga bien en la portada y en Contacto.

---

## Puntuaciones Lighthouse (teléfono, en vivo, 2 pasadas)

| Página | Velocidad | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Portada | 83–85 | 93 | 100 | 100 |
| Catálogo (inventario) | 93 | 94 | 100 | 100 |
| Ficha (DS 900X) | 81–85 | 96 | 100 | 100 |
| /productos | 81–82 | 96 | 100 | 100 |

**Por qué no llega a 100 en velocidad (las 3 causas principales):**
1. **La imagen principal tarda en verse (LCP de 2,2 a 4,1 s).** En la portada,
   el catálogo y /productos es la textura de fibra de carbono del encabezado. En
   la ficha es la foto de la moto.
2. **Código que se descarga y no se usa al abrir la página** (48–70 KB), sobre
   todo de las animaciones.
3. **Algunas fotos se piden más grandes de lo que se muestran** (de 32 a 150 KB
   de ahorro posible; lo peor está en /productos).

**Accesibilidad (las 3 causas):**
1. **Textos gris claro sobre blanco con poco contraste:** las etiquetas pequeñas
   ("MARCA", "KAWASAKI", "CILINDRADA", "cc/hp/kg") y las etiquetas de categoría
   de /productos.
2. **En la portada (teléfono), las flechas y los puntos del carrusel de próximos
   arribos son pequeños y están muy juntos** para tocarlos con el dedo.
3. **En el catálogo, los títulos no siguen un orden** (salta de un nivel a otro).
   Solo afecta a quien navega con lector de pantalla.

SEO saca 100 en Lighthouse, pero esa prueba es básica. Abajo están las cosas
que Lighthouse no mira (sitemap, datos para Google, etc.).

---

## 🔴 Arreglar ya

### 1. www.qualitybikesvzla.com da error de seguridad
- **Qué es:** si alguien escribe la dirección con "www", el navegador muestra
  "conexión no segura" y no abre la web. El certificado de seguridad de "www"
  venció el 17 de junio de 2025 y esa dirección no apunta a la web actual.
- **Por qué importa:** mucha gente escribe "www" por costumbre, y algunos
  enlaces viejos (tarjetas, Instagram, Google) pueden llevarla. Esos clientes
  ven una alerta de peligro en vez de la web.
- **Dónde:** el dominio (no es una página).
- **Trabajo:** poco. Se añade "www" en el panel de Vercel para que redirija a
  qualitybikesvzla.com y se ajusta un registro DNS donde compraste el dominio.
  Es configuración del dominio, así que necesita tu permiso (y quizá tu acceso).

### 2. DS 625X: dice "aún no llega a Venezuela" pero muestra 9 fotos reales del showroom
- **Qué es:** la ficha está marcada "Próximo arribo" y dice "Esta unidad aún no
  llega a Venezuela". Pero su galería tiene 9 fotos de la unidad Beige *en el
  showroom* (sesión de septiembre).
- **Por qué importa:** un cliente puede creer que no la hay, cuando quizá está
  ahí mismo. O al revés: si se vendió, la galería muestra una moto que no existe.
- **Dónde:** /catalogo/voge-ds-625x, el carrusel de la portada y el catálogo.
- **Trabajo:** poco. Solo necesito que me digas su estado real: disponible,
  vendida o de verdad por llegar.

### 3. Faltan el mapa del sitio (sitemap.xml) y robots.txt
- **Qué es:** son dos archivos que le dicen a Google qué páginas existen y que
  puede revisarlas. Hoy las dos direcciones dan 404.
- **Por qué importa:** Google descubre más lento las fichas nuevas, y quitar
  motos vendidas (como hoy) tarda más en reflejarse en las búsquedas.
- **Dónde:** todo el sitio.
- **Trabajo:** poco. Se generan solos en cada compilación, a partir del catálogo.

---

## 🟡 Mejorar pronto

### 4. El WhatsApp de las motos "Próximo arribo" dice "disponible"
- **Qué es:** el mensaje es el mismo para todas: "Hola, me interesa la Voge DS
  800X Rally **disponible** en Quality Bikes". Pasa en las 5 de próximo arribo.
  Las usadas tampoco dicen "usada" (por eso las dos DS 900X mandaban el mismo
  texto).
- **Por qué importa:** el vendedor recibe un mensaje confuso y el cliente cree
  que la moto ya está. Algo como "...la Voge DS 800X Rally (próximo arribo)"
  o "...la BMW F 800 GS usada" ahorra preguntas.
- **Dónde:** botones de WhatsApp de las fichas y del catálogo.
- **Trabajo:** poco.

### 5. Revisar las otras 4 motos de "Próximo arribo"
- **Qué es:** KLE 500 SE ABS, DS 800X Rally, DS 525X y SR 450X están "por llegar"
  desde el 7 de octubre (más de 5 semanas). La KLE 500 además tiene 10 fotos en
  su galería, que conviene confirmar si son de prensa o de una unidad real.
- **Por qué importa:** si alguna ya llegó, aparece como "no disponible" y se
  pierden consultas.
- **Dónde:** catálogo, carrusel de la portada y fichas.
- **Trabajo:** poco. Solo dime cuáles llegaron.

### 6. La página de error está en inglés
- **Qué es:** si alguien abre una dirección que no existe, ve "404 — This page
  could not be found", en inglés y sin ningún botón para volver.
- **Por qué importa:** se ve descuidado y el cliente se pierde. Debería decir
  algo como "Esta página no existe" con botones a Catálogo y WhatsApp.
- **Dónde:** cualquier dirección mala.
- **Trabajo:** poco.

### 7. Datos que no cuadran entre sí
- **Marcas:** la descripción que ve Google en la portada nombra *Honda y Triumph*,
  y el contador dice "8 marcas". El catálogo de hoy tiene 6 (BMW, Ducati,
  Kawasaki, Suzuki, Voge, Yamaha). Si son marcas que venden por encargo, está
  bien; si no, conviene quitarlas. *(La cinta de marcas de la animación de
  portada también las nombra. Esa no la toco: es tu decisión.)*
- **Dirección:** la web dice "C. Comercio, Caracas 1080, Miranda". En las notas
  internas del proyecto figura "Av. Principal, Urb. Prados del Este". Confirma
  cuál es la buena.
- **Descripción de la portada para Google:** tiene 204 caracteres y Google corta
  hacia los 155, así que el final no se lee.
- **Trabajo:** poco, cuando me confirmes los datos.

### 8. Datos para Google (datos estructurados)
- **Qué es:** la web no le "explica" a Google que es una tienda de motos con
  dirección, horario, teléfono y un catálogo de motos. Hoy no hay ninguno.
- **Por qué importa:** ayuda a salir con ficha de negocio enriquecida (horario,
  mapa) y a que cada moto aparezca mejor en las búsquedas. Sin precio, como
  manda la regla.
- **Dónde:** portada, Contacto y fichas.
- **Trabajo:** medio.

### 9. La portada no tiene un título principal para Google (H1)
- **Qué es:** todas las páginas tienen su título principal, menos la portada
  (la animación no lleva uno).
- **Por qué importa:** es la página más importante para buscar "motos en Caracas".
- **Dónde:** portada. Se puede añadir uno invisible para la vista, sin tocar la
  animación.
- **Trabajo:** poco.

### 10. El repositorio de GitHub es PÚBLICO
- **Qué es:** cualquiera puede ver y descargar el código de la web, sus fotos y
  sus notas internas. Eso incluye el historial: la foto azul vieja de la V-Strom
  y las fotos de la DS 900X usada.
- **Por qué importa:** la competencia puede copiar el trabajo, y las notas
  internas (decisiones, correos) quedan a la vista.
- **Dónde:** github.com/fabriziobasso5/quality-bikes.
- **Trabajo:** poco. Se cambia a privado en GitHub en un minuto. Vercel sigue
  publicando igual porque ya está conectado (conviene confirmarlo tras el cambio).
  No lo cambié, como pediste.

### 11. Contraste de los textos pequeños
- **Qué es:** las etiquetas gris claro ("MARCA", "KAWASAKI", "CILINDRADA"…) cuestan
  de leer al sol en el teléfono.
- **Por qué importa:** legibilidad y accesibilidad (sube la nota de Lighthouse).
- **Dónde:** catálogo, fichas y /productos.
- **Trabajo:** poco (oscurecer un poco ese gris).

### 12. Fotos con poca resolución
- **Portada de la V-Strom 250 SX (negra):** la foto original mide 859 px. En la
  ficha, en tablet y en computadora, se ve algo suave. Falta una foto más grande.
- **Foto "wheelie" de Nosotros:** mide 952 px. En tablet se ve suave.
- **Fotos de prensa usadas en motos USADAS:** la Ducati Monster usada lleva de
  portada una foto de prensa de una moto nueva, no la de tu unidad.
- **Trabajo:** poco para mí. Hacen falta tus fotos.

---

## 🟢 Ideas opcionales

13. **Imagen para compartir propia** en Inventario, Nosotros y Contacto. Hoy
    usan la general de la portada. *Trabajo: poco.*
14. **Textos en inglés en productos:** "detailing" (VP Racing), "heavy duty",
    "Power Wash y Sprays", y "diesel" sin tilde (en español es "diésel"). Los
    nombres de producto (p. ej. "Radiator Cleaner and Flush") son marcas y
    pueden quedarse. *Trabajo: poco.*
15. **"Transmisión: Sincrónica"** en todas las fichas: en motos se dice
    "Manual" (o "Manual de 6 velocidades"). *Trabajo: poco.*
16. **"↓ SCROLL" en la portada** está en inglés ("Desliza" o "Baja"). Es parte
    de la animación de portada, así que solo si tú lo autorizas.
    *Trabajo: poco.*
17. **Pedido de productos:** el mensaje muestra paréntesis dobles, "(Paila 5 gal
    (18.9 L))", y usa punto decimal; en Venezuela es "18,9 L".
    *Trabajo: poco.*
18. **En tablet, los botones flotantes de Instagram y WhatsApp tapan** el botoncito
    de WhatsApp de la tarjeta de la derecha en el catálogo. *Trabajo: poco.*
19. **Logos de /productos de tamaño desigual:** VP Racing se ve bastante más
    pequeño que Mobil 1 y Falken. *Trabajo: poco.*
20. **Aviso menor en la consola de /productos:** se precarga un logo
    (`gulf-seal.png`) que esa página no usa. *Trabajo: poco.*
21. **Limpieza del código:** el revisor automático marca 7 avisos internos (no
    rompen nada ni se ven), y el archivo `public/images/hero/adventure-hero.webp`
    ya no se usa. *Trabajo: poco.*
22. **La dirección técnica de Vercel** (quality-bikes.vercel.app) también muestra
    la web. Google ya sabe que la buena es qualitybikesvzla.com, así que no es
    urgente. *Trabajo: poco.*

---

## Pendientes conocidos (estado hoy)

- **Fotos que no son propias** (lista en `docs/REPORTE-RENDIMIENTO.md`, punto 5):
  siguen todas en la web. Son la moto de la portada (generada con IA), las dos
  BMW R 1300 GS Adventure, la Ducati Monster, la KLR 650, la DS 300X, la CU 250,
  la CU 625 y la SR 450X. `adventure-hero.webp` sigue en el proyecto, pero no se
  muestra.
- **Fotos reales de la V-Strom azul:** siguen pendientes. El color azul solo
  tiene la foto de perfil sobre blanco, sin galería.
- **Repositorio de GitHub:** **público** (ver 🟡 10).
