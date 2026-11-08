"""Генерация PWA-иконок «Гиря 12» — силуэт гири в фирменных цветах."""
import os
from PIL import Image, ImageDraw

BG = (25, 25, 25, 255)        # #191919 — цвет темы
PEACH = (249, 180, 126, 255)  # акцент приложения
OUT_DIR = "assets/icons"

# Геометрия задана на условной сетке 512x512
HANDLE_OUTER = (95, 85)   # радиусы внешнего овала ручки
HANDLE_INNER = (58, 48)   # радиусы отверстия ручки
HANDLE_CY = 190
BODY_R = 132
BODY_CY = 335
CX = 256


def render(size, art_scale, filename):
    ss = 4  # суперсэмплинг для гладких краёв
    w = size * ss
    img = Image.new("RGBA", (w, w), BG)
    d = ImageDraw.Draw(img)

    unit = w * art_scale / 512
    off = (w - 512 * unit) / 2

    def box(cx, cy, rx, ry):
        return [off + (cx - rx) * unit, off + (cy - ry) * unit,
                off + (cx + rx) * unit, off + (cy + ry) * unit]

    # Ручка (внешний овал)
    d.ellipse(box(CX, HANDLE_CY, *HANDLE_OUTER), fill=PEACH)
    # Корпус гири
    d.ellipse(box(CX, BODY_CY, BODY_R, BODY_R), fill=PEACH)
    # Отверстие ручки
    d.ellipse(box(CX, HANDLE_CY, *HANDLE_INNER), fill=BG)

    img = img.resize((size, size), Image.LANCZOS)
    img.save(os.path.join(OUT_DIR, filename), optimize=True)
    print(f"  {filename} — {size}x{size}")


os.makedirs(OUT_DIR, exist_ok=True)

render(192, 1.0, "icon-192.png")
render(512, 1.0, "icon-512.png")
# Maskable: рисунок в безопасной зоне (80% центра)
render(192, 0.72, "icon-maskable-192.png")
render(512, 0.72, "icon-maskable-512.png")
# Apple touch icon
render(180, 1.0, "apple-touch-icon-180.png")
print("Готово")
