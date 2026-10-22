"""Genera cert/fondo.jpg: el fondo futurista del certificado (16:9, 1920x1080).

El Apps Script lo pone de fondo de una diapositiva y escribe encima los textos y las barras.
Las coordenadas están pensadas en puntos de Google Slides (720x405 pt): 1 pt = 2.6667 px.
Uso: python herramientas/fondo_certificado.py
"""
import math, pathlib, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1920, 1080
K = W / 720  # px por punto de Slides
OUT = pathlib.Path(__file__).resolve().parent.parent / "cert"
OUT.mkdir(exist_ok=True)
random.seed(7)
pt = lambda v: int(round(v * K))

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

# 1. Degradado base
img = Image.new("RGB", (W, H))
d = ImageDraw.Draw(img)
for y in range(H):
    d.line([(0, y), (W, y)], fill=lerp((9, 5, 20), (22, 10, 38), y / H))

# 2. Auroras (manchas de luz desenfocadas)
glow = Image.new("RGB", (W, H), (0, 0, 0))
g = ImageDraw.Draw(glow)
for (cx, cy, r, col) in [(-80, -60, 620, (255, 122, 0)), (W + 60, 260, 560, (255, 46, 119)),
                         (760, H + 160, 600, (123, 77, 255)), (W * .55, -200, 380, (255, 94, 58))]:
    g.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
glow = glow.filter(ImageFilter.GaussianBlur(190))
img = Image.blend(img, Image.composite(glow, img, Image.new("L", (W, H), 255)), .42)

lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
L = ImageDraw.Draw(lay)

# 3. Rejilla en perspectiva (estilo synthwave) en la parte baja
hy, vx = pt(300), W / 2
for i in range(-26, 27):
    L.line([(vx + i * 26, hy), (vx + i * 190, H)], fill=(255, 138, 0, 26), width=2)
y, step = hy, 6
while y < H:
    L.line([(0, y), (W, y)], fill=(255, 138, 0, int(16 + (y - hy) / (H - hy) * 30)), width=2)
    step *= 1.28; y += step

# 4. Puntos de datos / estrellas
for _ in range(260):
    x, yy = random.randint(0, W), random.randint(0, H)
    a = random.randint(25, 110)
    L.ellipse([x, yy, x + 2, yy + 2], fill=(255, 220, 180, a))

# 5. Hexágonos tenues detrás del panel de desempeño
def hexa(cx, cy, r, col, w=2):
    pts = [(cx + r * math.cos(math.radians(60 * k + 30)), cy + r * math.sin(math.radians(60 * k + 30))) for k in range(7)]
    L.line(pts, fill=col, width=w)
for row in range(9):
    for colm in range(9):
        cx = pt(455) + colm * 78 + (39 if row % 2 else 0); cy = pt(70) + row * 68
        if random.random() < .55: hexa(cx, cy, 40, (157, 123, 255, random.randint(10, 26)))

# 6. Trazos de circuito en la esquina superior izquierda e inferior derecha
def circuito(x0, y0, sx, sy):
    for k in range(7):
        x, yy = x0, y0 + sy * k * 22
        pts = [(x, yy)]
        for _ in range(3):
            if random.random() < .5: x += sx * random.randint(40, 140)
            else: x += sx * 40; yy += sy * 40
            pts.append((x, yy))
        L.line(pts, fill=(255, 160, 60, 70), width=2)
        L.ellipse([x - 5, yy - 5, x + 5, yy + 5], outline=(255, 194, 61, 140), width=2)
# Columna de marcas tipo regla a lo largo del borde izquierdo (no invade el texto)
for k in range(46):
    yy = pt(70) + k * 18
    if yy > pt(330): break
    ln = 26 if k % 5 == 0 else 12
    L.line([(pt(24), yy), (pt(24) + ln, yy)], fill=(255, 160, 60, 110 if k % 5 == 0 else 55), width=2)

# 7. Panel de desempeño (vidrio con borde neón)
px0, py0, px1, py1 = pt(462), pt(96), pt(692), pt(304)
L.rounded_rectangle([px0, py0, px1, py1], radius=pt(10), fill=(18, 10, 32, 190), outline=(255, 138, 0, 150), width=3)
L.line([(px0 + pt(14), py0), (px0 + pt(80), py0)], fill=(255, 194, 61, 255), width=6)
L.line([(px1 - pt(80), py1), (px1 - pt(14), py1)], fill=(255, 61, 127, 255), width=6)

# 8. Línea neón bajo el encabezado (degradado naranja → magenta)
for x in range(pt(44), pt(692)):
    t = (x - pt(44)) / (pt(692) - pt(44))
    c = lerp((255, 194, 61), (255, 61, 127), t)
    L.line([(x, pt(60)), (x, pt(60) + 3)], fill=c + (230,))

# 9. Línea de firma
L.line([(pt(44), pt(350)), (pt(210), pt(350))], fill=(255, 246, 236, 160), width=2)

# 10. Sello holográfico (abajo a la derecha)
sx, sy, sr = pt(640), pt(346), pt(36)
for k, (rr, a) in enumerate([(sr, 230), (sr - 14, 120), (sr - 30, 200)]):
    L.ellipse([sx - rr, sy - rr, sx + rr, sy + rr], outline=lerp((255, 194, 61), (255, 61, 127), k / 2) + (a,), width=4 if k != 1 else 2)
for k in range(72):
    ang = math.radians(k * 5)
    r0 = sr - 8 if k % 6 else sr - 14
    L.line([(sx + r0 * math.cos(ang), sy + r0 * math.sin(ang)), (sx + (sr - 3) * math.cos(ang), sy + (sr - 3) * math.sin(ang))], fill=(255, 210, 150, 150), width=2)
try:
    f_big = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 54)
    f_sm = ImageFont.truetype("C:/Windows/Fonts/bahnschrift.ttf", 17)
except OSError:
    f_big = f_sm = ImageFont.load_default()
L.text((sx, sy - 6), "NGE", font=f_big, fill=(255, 246, 236, 240), anchor="mm")
L.text((sx, sy + 30), "UNIFRANZ", font=f_sm, fill=(255, 194, 61, 230), anchor="mm")

# 11. Marco con esquinas cortadas y escuadras brillantes
m, c = pt(14), pt(18)
frame = [(m + c, m), (W - m - c, m), (W - m, m + c), (W - m, H - m - c), (W - m - c, H - m), (m + c, H - m), (m, H - m - c), (m, m + c), (m + c, m)]
L.line(frame, fill=(255, 138, 0, 120), width=3)
b = pt(44)
for (x, yy, dx, dy) in [(m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)]:
    L.line([(x + dx * c, yy), (x + dx * (c + b), yy)], fill=(255, 194, 61, 255), width=7)
    L.line([(x, yy + dy * c), (x, yy + dy * (c + b))], fill=(255, 194, 61, 255), width=7)

# Brillo suave de las líneas neón
blur = lay.filter(ImageFilter.GaussianBlur(10))
img = img.convert("RGBA")
img = Image.alpha_composite(img, blur)
img = Image.alpha_composite(img, lay)

# Viñeta para que el texto central se lea bien
v = Image.new("L", (W, H), 0)
ImageDraw.Draw(v).ellipse([-W * .3, -H * .4, W * 1.3, H * 1.4], fill=255)
v = v.filter(ImageFilter.GaussianBlur(160))
dark = Image.new("RGBA", (W, H), (5, 3, 12, 255))
img = Image.composite(img, dark, v.point(lambda p: 90 + p * 165 // 255))

img.convert("RGB").save(OUT / "fondo.jpg", quality=90, optimize=True, progressive=True)
print("cert/fondo.jpg", (OUT / "fondo.jpg").stat().st_size // 1024, "KB")
