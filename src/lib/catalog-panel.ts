/**
 * El panel de catálogo como PARADA del historial.
 *
 * Que esté abierto o no es una propiedad de la URL, no un estado de React: se
 * marca con un hash. Así "Volver", la flecha del navegador y el gesto de atrás
 * del móvil regresan al panel igual que a cualquier página, sin que el sitio
 * tenga que llevar por su cuenta la cuenta de por dónde pasó el visitante.
 *
 * Es un hash y no una ruta porque el panel se superpone a CUALQUIER página: al
 * volver, el visitante aterriza en la que estaba con el panel abierto encima.
 */
const CATALOG_HASH = "#catalogo";

// Ni pushState al abrir el panel ni la navegación de Next disparan popstate, así
// que los cambios de URL que no son "atrás/adelante" hay que anunciarlos a mano
// para que las vistas suscritas vuelvan a mirar.
const CHANGED = "qb:catalog-history";

export function notifyCatalogHistoryChanged() {
  window.dispatchEvent(new Event(CHANGED));
}

export function subscribeToCatalogHistory(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  // Un enlace normal a "/" desde "/#catalogo" es navegación dentro del mismo
  // documento: cambia el hash y avisa por hashchange, NUNCA por popstate. Es
  // justo lo que hacen el logo y la flecha de inicio con el panel abierto.
  window.addEventListener("hashchange", onChange);
  window.addEventListener(CHANGED, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(CHANGED, onChange);
  };
}

/** Devuelve un booleano y no un objeto: React compara por identidad. */
export function isCatalogOpen() {
  return window.location.hash === CATALOG_HASH;
}

export function openCatalogPanel() {
  if (isCatalogOpen()) return;
  window.history.pushState(null, "", CATALOG_HASH);
  notifyCatalogHistoryChanged();
}

/**
 * Cerrar a mano (Escape, click fuera, segundo toque en "Catálogo") retrocede en
 * el historial para consumir la parada. Cerrando solo la vista quedaría una
 * parada fantasma y habría que pulsar atrás dos veces para salir de la página.
 */
export function closeCatalogPanel() {
  if (isCatalogOpen()) window.history.back();
}
