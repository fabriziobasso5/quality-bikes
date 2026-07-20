"""Regeneración v2: registro fino de la fase 1 + limpieza más agresiva.

Mejoras sobre v1:
1. La corrección de la fase 1 (scale/translate) se OPTIMIZA por búsqueda
   de rejilla minimizando la diferencia global con la fase 2 (la mayor
   parte del cuadro es estática en 1→2), en vez de usar los valores
   medidos a ojo — elimina el ruido de registro que metía pedazos de
   rueda en los sprites T1.
2. Umbral adaptativo + limpieza morfológica más fuerte, y etiquetado de
   componentes conexas (BFS numpy) para descartar motas pequeñas lejos
   del cuerpo principal de la pieza.
"""

from PIL import Image, ImageFilter
import numpy as np
from collections import deque

DIR = "/Users/fabriziobasso/quality-bikes/public/images/hero7"
OUT = f"{DIR}/sprites"
RATIO = 1.5333

SPRITES = [
    ("windscreen", 70.3, 14.9, 25.5, 1, 2),
    ("seat", 35.9, 39.7, 33.4, 1, 2),
    ("exhaust", 22.7, 59.8, 25.5, 1, 2),
    ("beak", 80.6, 50.9, 14.7, 1, 2),
    ("tail", 12.9, 31.3, 14.7, 1, 2),
    ("tankcover", 52.5, 35.5, 27, 2, 3),
    ("silverpanel", 61.5, 40.0, 13, 2, 3),
    ("deflector", 58.5, 32.0, 11, 2, 3),
    ("handguards", 57.0, 21.0, 14, 2, 3),
    ("hugger", 81.0, 54.0, 15, 2, 3),
    ("handlebar", 64.5, 19.0, 22, 3, 4),
    ("frontwheel", 84.4, 76.0, 30, 4, 5),
    ("rearwheel", 16.7, 75.5, 30, 4, 5),
    ("fork", 78.5, 47.0, 17, 4, 5),
    ("tank", 52.0, 33.5, 25, 4, 5),
    ("shock", 37.5, 60.0, 10, 4, 5),
    ("swingarm", 23.0, 70.0, 24, 4, 5),
    ("sidepanels", 44.0, 54.0, 19, 4, 5),
    ("harness", 49.5, 49.0, 19, 5, 6),
    ("airbox", 42.5, 58.5, 15, 5, 6),
    ("headcover", 59.0, 67.0, 17, 5, 6),
    ("ancillaries", 40.5, 69.0, 11, 5, 6),
]

phases = {n: Image.open(f"{DIR}/phase-{n}.webp").convert("RGBA") for n in range(1, 7)}
W, H = phases[2].size


def correct_p1(img, scale, dx_pct, dy_pct):
    sw, sh = round(W * scale), round(H * scale)
    scaled = img.resize((sw, sh), Image.LANCZOS)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ox = round((W - sw) / 2 + dx_pct / 100 * W)
    oy = round((H - sh) / 2 + dy_pct / 100 * H)
    canvas.paste(scaled, (ox, oy))
    return canvas


# --- Registro fino de la fase 1: rejilla alrededor de los valores medidos.
# Se evalúa a media resolución sobre la zona delantera (rueda/tenedor),
# estática en 1→2, para no premiar alineaciones que "apaguen" la pieza.
ref = phases[2].resize((W // 2, H // 2), Image.BILINEAR)
ref_a = np.asarray(ref, dtype=np.int16)
# zona estática: rueda delantera y tren (60-95% x, 40-95% y)
sx0, sx1 = int(0.60 * W / 2), int(0.95 * W / 2)
sy0, sy1 = int(0.40 * H / 2), int(0.95 * H / 2)

best = None
for scale in [0.978, 0.980, 0.982, 0.984, 0.986]:
    for dx in [-0.53, -0.43, -0.33, -0.23, -0.13]:
        for dy in [-1.22, -1.12, -1.02, -0.92, -0.82]:
            c = correct_p1(phases[1], scale, dx, dy).resize((W // 2, H // 2), Image.BILINEAR)
            ca = np.asarray(c, dtype=np.int16)
            d = np.abs(ca[sy0:sy1, sx0:sx1, :3] - ref_a[sy0:sy1, sx0:sx1, :3]).mean()
            if best is None or d < best[0]:
                best = (d, scale, dx, dy)
_, S, DX, DY = best
print(f"registro fase 1: scale={S} dx={DX}% dy={DY}%  (err={best[0]:.2f})")
phases[1] = correct_p1(phases[1], S, DX, DY)


def components(mask):
    """Etiquetado BFS de componentes conexas (4-conn) sobre bool array."""
    lab = np.zeros(mask.shape, dtype=np.int32)
    cur = 0
    for i, j in zip(*np.nonzero(mask & (lab == 0))):
        if lab[i, j]:
            continue
        cur += 1
        q = deque([(i, j)])
        lab[i, j] = cur
        while q:
            y, x = q.popleft()
            for ny, nx in ((y-1, x), (y+1, x), (y, x-1), (y, x+1)):
                if 0 <= ny < mask.shape[0] and 0 <= nx < mask.shape[1] and mask[ny, nx] and not lab[ny, nx]:
                    lab[ny, nx] = cur
                    q.append((ny, nx))
    return lab, cur


for sid, cx, cy, w, na, nb in SPRITES:
    size = round(w / 100 * W)
    left = round((cx - w / 2) / 100 * W)
    top = round((cy - w * RATIO / 2) / 100 * H)
    box = (left, top, left + size, top + size)

    a = np.asarray(phases[na].crop(box), dtype=np.int16)
    b = np.asarray(phases[nb].crop(box), dtype=np.int16)

    thresh = 30 if na == 1 else 22  # T1: resampleado → más ruido de borde
    rgb_diff = np.abs(a[..., :3] - b[..., :3]).max(axis=2)
    alpha_diff = np.abs(a[..., 3] - b[..., 3])
    changed = (rgb_diff > thresh) | (alpha_diff > 40)
    present = a[..., 3] > 40
    mask = changed & present

    m = Image.fromarray(mask.astype(np.uint8) * 255)
    m = m.filter(ImageFilter.MedianFilter(7))
    m = m.filter(ImageFilter.MaxFilter(5))
    m = m.filter(ImageFilter.MedianFilter(5))
    mk = np.asarray(m) > 128

    # Componentes a resolución 1/4 (rápido); conserva solo las que pesan
    # ≥6% de la mayor — fuera motas y fragmentos de piezas vecinas.
    small = mk[::4, ::4]
    lab, n = components(small)
    if n:
        sizes = np.bincount(lab.ravel())[1:]
        keep = set((np.nonzero(sizes >= sizes.max() * 0.06)[0] + 1).tolist())
        keep_small = np.isin(lab, list(keep))
        keep_full = np.kron(keep_small, np.ones((4, 4), dtype=bool))[: mk.shape[0], : mk.shape[1]]
        # engorda 8px la zona conservada para no morder el borde plumado
        keep_img = Image.fromarray(keep_full.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(9))
        mk = mk & (np.asarray(keep_img) > 128)

    m = Image.fromarray(mk.astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(1.5))

    alpha = (np.asarray(m, dtype=np.float32) / 255.0) * (a[..., 3].astype(np.float32) / 255.0)
    out = np.zeros((size, size, 4), dtype=np.uint8)
    out[..., :3] = a[..., :3].astype(np.uint8)
    out[..., 3] = (alpha * 255).astype(np.uint8)

    Image.fromarray(out).save(f"{OUT}/{sid}.webp", "WEBP", quality=92, method=6)
    cov = (out[..., 3] > 128).mean() * 100
    print(f"{sid:12s} T{na}->{nb} cobertura={cov:.1f}%")

print("OK")
