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
    # exhaust y beak: cajas re-medidas a mano contra la foto real (19-jul) —
    # las originales (por diff bruto) recortaban la punta del escape/tubo
    # conector y casi todo el guardabarros delantero
    ("exhaust", 24, 73, 30, 1, 2),
    ("beak", 87, 56, 25, 1, 2),
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


# --- Registro fino de la fase 1: rejilla en dos etapas (gruesa + fina)
# sobre TRES regiones estáticas en 1→2 — tapa del tanque (el salto que más
# se nota), rueda trasera y rueda delantera/horquilla. Así el tanque queda
# clavado al píxel entre la foto 1 y la 2.
REGIONS = [
    (0.40, 0.25, 0.70, 0.48),  # tapa del tanque
    (0.05, 0.55, 0.28, 0.92),  # rueda trasera
    (0.76, 0.45, 0.95, 0.92),  # rueda delantera + horquilla
]
ref = phases[2].resize((W // 2, H // 2), Image.BILINEAR)
ref_a = np.asarray(ref, dtype=np.int16)


def reg_err(scale, dx, dy):
    c = correct_p1(phases[1], scale, dx, dy).resize((W // 2, H // 2), Image.BILINEAR)
    ca = np.asarray(c, dtype=np.int16)
    total = 0.0
    for rx0, ry0, rx1, ry1 in REGIONS:
        x0, x1 = int(rx0 * W / 2), int(rx1 * W / 2)
        y0, y1 = int(ry0 * H / 2), int(ry1 * H / 2)
        total += float(np.abs(ca[y0:y1, x0:x1, :3] - ref_a[y0:y1, x0:x1, :3]).mean())
    return total


best = None
for scale in np.arange(0.980, 0.9985, 0.002):
    for dx in np.arange(-0.75, 0.16, 0.1):
        for dy in np.arange(-1.25, 0.26, 0.1):
            d = reg_err(scale, dx, dy)
            if best is None or d < best[0]:
                best = (d, scale, dx, dy)
# etapa fina alrededor del mejor
_, S0, DX0, DY0 = best
for scale in np.arange(S0 - 0.002, S0 + 0.0021, 0.001):
    for dx in np.arange(DX0 - 0.1, DX0 + 0.11, 0.05):
        for dy in np.arange(DY0 - 0.1, DY0 + 0.11, 0.05):
            d = reg_err(scale, dx, dy)
            if d < best[0]:
                best = (d, scale, dx, dy)
_, S, DX, DY = best
S, DX, DY = round(float(S), 4), round(float(DX), 2), round(float(DY), 2)
print(f"registro fase 1: scale={S} dx={DX}% dy={DY}%  (err={best[0]:.2f})")
print(f">>> actualizar en ExplodedHero.tsx: transform: translate({DX}%, {DY}%) scale({S})")
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


# ---------------------------------------------------------------------------
# FRONTERAS DE PRECISIÓN (aplicar DESPUÉS de la generación por diff):
# cada sprite conserva SOLO su pieza — sin fragmentos de piezas vecinas ni
# de partes que se quedan en la moto. Rectángulos (x0,y0,x1,y1) en fracción
# del lienzo del sprite, borde plumado con blur 5-6.
# Pedido del cliente (19-jul-2026): "que esté cada pieza separada de la otra".
# ---------------------------------------------------------------------------
ERASE_PATCHES = {
    "windscreen": [(0.00, 0.08, 0.25, 0.55), (0.05, 0.52, 0.42, 0.80),
                   (0.00, 0.50, 0.09, 0.80), (0.00, 0.74, 1.00, 1.00)],
    "seat":       [(0.72, 0.00, 1.00, 0.42), (0.00, 0.72, 0.52, 1.00),
                   (0.72, 0.40, 1.00, 1.00)],
    # escape: caja re-medida (24,73,30) contra la foto real — quedan los
    # DOS silenciadores Akrapovic completos + el tubo conector con su
    # punta de carbono; fuera solo la rueda trasera y el subchasis
    "exhaust":    [(0.63, 0.00, 1.00, 0.40), (0.88, 0.40, 1.00, 1.00),
                   (0.00, 0.62, 1.00, 1.00), (0.00, 0.30, 0.35, 0.66)],
    # guardabarros delantero: caja re-medida (87,56,25) — fuera visera,
    # espejo+mástil completo (se extiende horizontal, no solo el borde
    # izquierdo), horquilla/reflector y rueda/disco/aro
    "beak":       [(0.00, 0.00, 1.00, 0.13), (0.00, 0.00, 0.62, 0.22),
                   (0.00, 0.15, 0.16, 0.32), (0.00, 0.32, 0.22, 1.00),
                   (0.55, 0.62, 1.00, 1.00), (0.10, 0.72, 0.55, 1.00),
                   (0.28, 0.58, 0.60, 1.00)],
    "hugger":     [(0.00, 0.00, 0.50, 1.00), (0.50, 0.45, 1.00, 1.00)],
    "tankcover":  [(0.76, 0.42, 1.00, 0.78), (0.55, 0.00, 1.00, 0.20),
                   (0.00, 0.80, 1.00, 1.00), (0.00, 0.55, 0.10, 1.00),
                   (0.74, 0.40, 1.00, 1.00)],
    # panel plateado: el corte izquierdo NO puede tocar el logo BMW (el
    # roundel empieza en x≈0.35) — fuera solo la franja dorada y el verde
    "silverpanel":[(0.00, 0.00, 0.33, 1.00), (0.20, 0.00, 1.00, 0.12),
                   (0.68, 0.72, 1.00, 1.00)],
    "deflector":  [(0.00, 0.00, 1.00, 0.16), (0.00, 0.55, 1.00, 1.00)],
    "handguards": [(0.30, 0.00, 0.62, 0.30), (0.00, 0.68, 1.00, 1.00),
                   (0.26, 0.00, 0.68, 0.34)],
    "tank":       [(0.00, 0.86, 1.00, 1.00)],
    "sidepanels": [(0.00, 0.00, 1.00, 0.30), (0.00, 0.30, 0.28, 1.00),
                   (0.86, 0.00, 1.00, 1.00)],
    "swingarm":   [(0.00, 0.00, 0.62, 1.00), (0.62, 0.00, 1.00, 0.28)],
}

def apply_patches():
    from PIL import ImageDraw
    for sid, rects in ERASE_PATCHES.items():
        im = Image.open(f"{OUT}/{sid}.webp").convert("RGBA")
        s = im.size[0]
        hole = Image.new("L", im.size, 0)
        d = ImageDraw.Draw(hole)
        for x0, y0, x1, y1 in rects:
            d.rectangle([x0 * s, y0 * s, x1 * s, y1 * s], fill=255)
        hole = hole.filter(ImageFilter.GaussianBlur(5))
        a = np.asarray(im, dtype=np.float32)
        h = np.asarray(hole, dtype=np.float32) / 255.0
        a[..., 3] = a[..., 3] * (1.0 - h)
        Image.fromarray(a.astype(np.uint8)).save(
            f"{OUT}/{sid}.webp", "WEBP", quality=92, method=6
        )
        print(sid, "parcheado")

apply_patches()


# ---------------------------------------------------------------------------
# Logo BMW del tanque: el overlay foto2/foto3 confirma que la insignia NO se
# mueve entre las dos fotos — está atornillada al tanque de aluminio, no al
# panel plástico que la rodea. Si se deja en "silverpanel" (T2), el logo
# "vuela" y luego reaparece en la foto 3 en el mismo punto, dando la
# sensación de que nunca se fue. Se borra del sprite con un círculo preciso.
# ---------------------------------------------------------------------------
def erase_badge():
    from PIL import ImageDraw
    im = Image.open(f"{OUT}/silverpanel.webp").convert("RGBA")
    s = im.size[0]
    hole = Image.new("L", im.size, 0)
    d = ImageDraw.Draw(hole)
    cx, cy, r = 0.565 * s, 0.53 * s, 0.155 * s
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    hole = hole.filter(ImageFilter.GaussianBlur(4))
    a = np.asarray(im, dtype=np.float32)
    h = np.asarray(hole, dtype=np.float32) / 255.0
    a[..., 3] = a[..., 3] * (1.0 - h)
    Image.fromarray(a.astype(np.uint8)).save(
        f"{OUT}/silverpanel.webp", "WEBP", quality=92, method=6
    )
    print("silverpanel: logo BMW eliminado (no se mueve, queda en el tanque)")

erase_badge()
