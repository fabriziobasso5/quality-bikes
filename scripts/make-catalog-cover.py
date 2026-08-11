#!/usr/bin/env python3
"""Normaliza una foto de prensa a portada de catálogo.

Todas las portadas de public/images/catalog/ comparten encuadre para que en la
rejilla y en el mega-menú las motos se vean del mismo tamaño: lienzo 1600x1200
blanco, la moto ajustada a una caja de 1380x1000 y centrada. Este script
reproduce ese encuadre a partir de cualquier foto con fondo blanco.

Con --no-upscale la moto nunca se amplía: si la foto de origen es más pequeña
que la caja, se encoge el lienzo en la misma proporción en lugar de estirar los
píxeles. El encuadre relativo sale idéntico (la moto ocupa la misma fracción
del lienzo), así que en la rejilla se ve igual, pero sin la blandura de una
ampliación. Útil con capturas de pantalla, que ya vienen justas de resolución.

Uso:  python3 scripts/make-catalog-cover.py [--no-upscale] entrada.png salida.webp
"""

import subprocess
import sys
import tempfile
from pathlib import Path

CANVAS = (1600, 1200)
CONTENT_BOX = (1380, 1000)
QUALITY = 92


def trimmed_size(src: Path) -> tuple[int, int]:
    out = subprocess.run(
        ["magick", str(src), "-background", "white", "-alpha", "remove",
         "-alpha", "off", "-fuzz", "6%", "-trim", "-format", "%w %h", "info:"],
        capture_output=True, text=True, check=True,
    ).stdout.split()
    return int(out[0]), int(out[1])


def main():
    args = sys.argv[1:]
    no_upscale = "--no-upscale" in args
    args = [a for a in args if a != "--no-upscale"]
    src, dst = Path(args[0]), Path(args[1])

    canvas, box = CANVAS, CONTENT_BOX
    if no_upscale:
        w, h = trimmed_size(src)
        scale = min(box[0] / w, box[1] / h)
        if scale > 1:
            canvas = (round(canvas[0] / scale), round(canvas[1] / scale))
            box = (round(box[0] / scale), round(box[1] / scale))

    dst.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".png") as tmp:
        subprocess.run(
            [
                "magick", str(src),
                # Alfa sobre blanco antes de recortar: si la foto viene con
                # transparencia, -trim mediría el canal alfa y no la moto.
                "-background", "white", "-alpha", "remove", "-alpha", "off",
                "-fuzz", "6%", "-trim", "+repage",
                # El remuestreo va en luz lineal: hacerlo sobre valores gamma
                # oscurece los filos claros de la carrocería contra el blanco.
                "-colorspace", "RGB",
                "-filter", "Lanczos", "-resize", f"{box[0]}x{box[1]}",
                "-colorspace", "sRGB",
                "-background", "white", "-gravity", "center",
                "-extent", f"{canvas[0]}x{canvas[1]}",
                "-unsharp", "0x0.7+0.5+0.01",
                str(tmp.name),
            ],
            check=True,
        )
        subprocess.run(
            ["cwebp", "-q", str(QUALITY), "-sharp_yuv", "-m", "6", "-quiet",
             tmp.name, "-o", str(dst)],
            check=True,
        )
    print(subprocess.run(["magick", "identify", str(dst)],
                         capture_output=True, text=True).stdout.strip())


if __name__ == "__main__":
    main()
