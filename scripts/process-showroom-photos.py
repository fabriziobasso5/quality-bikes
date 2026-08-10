#!/usr/bin/env python3
"""Prepara fotos del showroom para la web.

Las tomas del showroom salen del iPhone en HEIC con un leve tinte azul de las
luces LED del techo. Este script neutraliza ese tinte usando la pared blanca
como referencia, aplica un contraste suave y exporta webp al tamaño de la
galería. No recorta por su cuenta: los encuadres se declaran a mano en el
manifiesto (`crop`), porque el recorte automático por detección de la moto se
comía la rueda delantera en las tomas de tres cuartos.

Uso:  python3 scripts/process-showroom-photos.py manifiesto.json
"""

import io
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

# Lado largo del webp final. 1600 px cubre la caja de la galería a 2x sin
# inflar el peso de la página.
LONG_EDGE = 1600
WEBP_QUALITY = 86

# Percentil que se considera "blanco de referencia" (pared y techo).
WHITE_PCT = 97
# A dónde se lleva ese blanco. Por debajo de 255 para no quemar la carrocería
# blanca del KLE, que vive justo por debajo del blanco de la pared.
WHITE_TARGET = 247


def decode(path: Path) -> np.ndarray:
    """HEIC/JPG -> RGB float con la orientación EXIF ya aplicada."""
    png = subprocess.run(
        ["magick", str(path), "-auto-orient", "png:-"],
        capture_output=True,
        check=True,
    ).stdout
    return np.asarray(Image.open(io.BytesIO(png)).convert("RGB")).astype(np.float32)


def neutralize(a: np.ndarray) -> np.ndarray:
    """Quita la dominante de color igualando los canales sobre la pared.

    La referencia NO puede ser "los píxeles más claros": los paneles LED del
    techo salen quemados y muy azules, y corregirlos a neutro tiñe la foto
    entera de amarillo. Se busca en su lugar superficie de pared — claridad
    alta pero sin quemar, y poca saturación.
    """
    lum = a.mean(axis=2)
    spread = a.max(axis=2) - a.min(axis=2)
    mask = (
        (lum >= np.percentile(lum, 80))
        & (lum <= np.percentile(lum, 99))
        & (a.max(axis=2) < 248)
        & (spread < 28)
    )
    if mask.sum() < 500:  # sin pared reconocible, se deja como está
        return a

    ref = a[mask].mean(axis=0)
    gains = ref.mean() / np.maximum(ref, 1.0)
    # Corrección parcial: llevar el tinte a cero deja las fotos planas y
    # delata el retoque. 70 % limpia lo suficiente conservando la luz real.
    gains = 1.0 + (gains - 1.0) * 0.70
    a = a * np.clip(gains, 0.90, 1.15)

    # Y ahora sí, la pared al blanco objetivo (subida suave, tope 1.12 para no
    # quemar la carrocería blanca perla del KLE, que está justo por debajo).
    lift = min(WHITE_TARGET / max(ref.mean(), 1.0), 1.12)
    return a * max(lift, 1.0)


def tone(a: np.ndarray) -> np.ndarray:
    """Curva en S suave + un punto de saturación. Nada agresivo: las motos
    negras se empastan enseguida y el blanco perla se quema."""
    x = np.clip(a / 255.0, 0.0, 1.0)
    # S-curve suave alrededor del gris medio (±14/255 como mucho).
    x = x - 0.35 * np.sin(2 * np.pi * x) / (2 * np.pi)
    x = np.clip(x, 0.0, 1.0)
    # Saturación +6 % en espacio lineal simple.
    gray = x.mean(axis=2, keepdims=True)
    x = np.clip(gray + (x - gray) * 1.06, 0.0, 1.0)
    return x * 255.0


def process(src: Path, dst: Path, crop=None, flop=False):
    a = decode(src)
    if crop:  # [x, y, w, h] en píxeles del original ya orientado
        x, y, w, h = crop
        a = a[y : y + h, x : x + w]
    a = tone(neutralize(a))
    img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    if flop:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    w, h = img.size
    scale = LONG_EDGE / max(w, h)
    if scale < 1:
        img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

    dst.parent.mkdir(parents=True, exist_ok=True)
    # cwebp no lee de stdin, así que pasa por un PNG intermedio. -sharp_yuv
    # evita el sangrado de color en los filos de alto contraste (los verdes
    # Kawasaki sobre carrocería blanca lo notaban).
    with tempfile.NamedTemporaryFile(suffix=".png") as tmp:
        img.save(tmp.name, format="PNG")
        subprocess.run(
            ["cwebp", "-q", str(WEBP_QUALITY), "-sharp_yuv", "-m", "6", "-quiet",
             tmp.name, "-o", str(dst)],
            check=True,
        )
    return img.size


def main():
    manifest = json.loads(Path(sys.argv[1]).read_text())
    src_dir = Path(manifest["sourceDir"]).expanduser()
    out_root = Path(manifest["outputRoot"]).expanduser()
    for item in manifest["photos"]:
        size = process(
            src_dir / item["src"],
            out_root / item["out"],
            crop=item.get("crop"),
            flop=item.get("flop", False),
        )
        print(f"{item['src']:>16}  ->  {item['out']:<48} {size[0]}x{size[1]}")


if __name__ == "__main__":
    main()
