/**
 * De dónde vino el visitante a la página en la que está.
 *
 * Solo sirve para ROTULAR el botón "Volver" ("Volver al catálogo" / "Volver al
 * inventario"): el salto en sí lo hace siempre el historial del navegador, así
 * que aunque esto se quedara corto, el botón nunca llevaría a un sitio
 * equivocado — como mucho diría "Volver" a secas.
 *
 * Se apunta en el momento del click, con la ruta de DESTINO como clave. Esa es
 * la clave correcta y no "la última página visitada": al retroceder del detalle
 * de una moto al inventario, la nota del inventario sigue siendo la que se
 * escribió al entrar en él, que es justo lo que hay que rotular.
 */
export type BackTarget = "catalogo" | "inventario" | "moto";

const PREFIX = "qb:back:";

const LABELS: Record<BackTarget, string> = {
  catalogo: "Volver al catálogo",
  inventario: "Volver al inventario",
  moto: "Volver",
};

export function rememberBackTarget(destPath: string, target: BackTarget) {
  try {
    sessionStorage.setItem(PREFIX + destPath, target);
  } catch {
    // Safari en navegación privada tira al escribir: el rótulo cae a "Volver".
  }
}

export function readBackTarget(path: string): BackTarget | null {
  try {
    return (sessionStorage.getItem(PREFIX + path) as BackTarget | null) ?? null;
  } catch {
    return null;
  }
}

export function backLabel(target: BackTarget | null) {
  return target ? LABELS[target] : "Volver";
}
