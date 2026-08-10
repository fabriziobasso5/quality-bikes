#!/usr/bin/env python3
"""Normaliza una foto de prensa a portada de catálogo.

Todas las portadas de public/images/catalog/ comparten encuadre para que en la
rejilla y en el mega-menú las motos se vean del mismo tamaño: lienzo 1600x1200
blanco, la moto ajustada a una caja de 1380x1000 y centrada. Este script
reproduce ese encuadre a partir de cualquier foto con fondo blanco.

Uso:  python3 scripts/make-catalog-cover.py entrada.png salida.webp
"""

import subprocess
import sys
import tempfile
from pathlib import Path

CANVAS = (1600, 1200)
CONTENT_BOX = (1380, 1000)
QUALITY = 90


def main():
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".png") as tmp:
        subprocess.run(
            [
                "magick", str(src),
                # Alfa sobre blanco antes de recortar: si la foto viene con
                # transparencia, -trim mediría el canal alfa y no la moto.
                "-background", "white", "-alpha", "remove", "-alpha", "off",
                "-fuzz", "6%", "-trim", "+repage",
                "-resize", f"{CONTENT_BOX[0]}x{CONTENT_BOX[1]}",
                "-background", "white", "-gravity", "center",
                "-extent", f"{CANVAS[0]}x{CANVAS[1]}",
                "-unsharp", "0x0.75+0.55+0.008",
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
