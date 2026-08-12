#!/usr/bin/env python3
"""Limpia y afina una foto blanda sin inventarle detalle.

Pensado para las portadas del KLE 500, que vienen de capturas de pantalla: el
JPEG/WebP de origen dejó "papilla" en las zonas planas y los filos llegaron
romos. Esto NO es superresolución — no añade nada que no estuviera: solo quita
el ruido de compresión, devuelve microcontraste y afila los bordes reales.

Tres pasos, en este orden:
  1. Suavizado que respeta los bordes, para que el paso 3 no amplifique ruido.
  2. Microcontraste local muy suave (CLAHE) sobre la luminosidad.
  3. Máscara de enfoque APLICADA SOLO EN LOS BORDES. Sin esa máscara, el fondo
     blanco y los degradados de la carrocería salen con halos y grano.

Uso:  python3 scripts/polish-photo.py entrada.webp salida.webp [--calidad 92]
"""

import subprocess
import sys
import tempfile

import cv2
import numpy as np

# Fuerza del enfoque. Por encima de ~0.9 empiezan a verse halos en el contorno
# de la moto contra el blanco.
SHARPEN_AMOUNT = 0.75
SHARPEN_RADIUS = 1.4


def decode(path: str) -> np.ndarray:
    png = subprocess.run(["magick", path, "png:-"], capture_output=True, check=True).stdout
    return cv2.imdecode(np.frombuffer(png, np.uint8), cv2.IMREAD_COLOR)


def edge_mask(bgr: np.ndarray) -> np.ndarray:
    """1 en los filos reales, 0 en superficies planas y en el fondo."""
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    gx = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
    mag = cv2.magnitude(gx, gy)
    mag = cv2.GaussianBlur(mag, (0, 0), 1.6)
    # Normaliza por un percentil alto y no por el máximo: un solo píxel extremo
    # (un reflejo) aplanaría toda la máscara.
    top = np.percentile(mag, 99.0)
    return np.clip(mag / max(top, 1e-6), 0, 1)[..., None]


def polish(bgr: np.ndarray) -> np.ndarray:
    # 1. Ruido de compresión fuera, conservando los filos.
    clean = cv2.bilateralFilter(bgr, d=7, sigmaColor=28, sigmaSpace=7)

    # 2. Microcontraste en la luminosidad; los canales de color no se tocan
    #    para no mover ni un tono real de la moto.
    lab = cv2.cvtColor(clean, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.createCLAHE(clipLimit=1.15, tileGridSize=(8, 8)).apply(l)
    clean = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)

    # 3. Enfoque guiado por la máscara de bordes.
    blur = cv2.GaussianBlur(clean, (0, 0), SHARPEN_RADIUS)
    detail = clean.astype(np.float32) - blur.astype(np.float32)
    out = clean.astype(np.float32) + SHARPEN_AMOUNT * detail * edge_mask(clean)
    return np.clip(out, 0, 255).astype(np.uint8)


def sharpness(bgr: np.ndarray) -> float:
    return cv2.Laplacian(cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var()


def main():
    src, dst = sys.argv[1], sys.argv[2]
    quality = "92"
    if "--calidad" in sys.argv:
        quality = sys.argv[sys.argv.index("--calidad") + 1]

    original = decode(src)
    result = polish(original)
    print(f"{src}: nitidez {sharpness(original):.0f} -> {sharpness(result):.0f}")

    with tempfile.NamedTemporaryFile(suffix=".png") as tmp:
        cv2.imwrite(tmp.name, result)
        subprocess.run(
            ["cwebp", "-q", quality, "-sharp_yuv", "-m", "6", "-quiet", tmp.name, "-o", dst],
            check=True,
        )


if __name__ == "__main__":
    main()
