from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og-invitacion-cata-javier.png"

WIDTH = 1200
HEIGHT = 630
SCALE = 2


def scaled(value: float) -> int:
    return round(value * SCALE)


def color(hex_value: str) -> tuple[int, int, int]:
    hex_value = hex_value.lstrip("#")
    return tuple(int(hex_value[index : index + 2], 16) for index in (0, 2, 4))


def load_font(size: int, candidates: list[str]) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), scaled(size))
    return ImageFont.load_default()


SERIF = [
    "/System/Library/Fonts/Supplemental/Didot.ttc",
    "/System/Library/Fonts/Supplemental/Baskerville.ttc",
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
]
SANS = [
    "/System/Library/Fonts/Supplemental/Avenir Next.ttc",
    "/System/Library/Fonts/Supplemental/Helvetica.ttc",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
]


def text_center(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    spacing: int = 0,
) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    width = bbox[2] - bbox[0]
    draw.text((xy[0] - width // 2, xy[1]), text, font=font, fill=fill, spacing=spacing)


def draw_leaf(
    draw: ImageDraw.ImageDraw,
    center: tuple[float, float],
    angle: float,
    length: float,
    fill: tuple[int, int, int],
) -> None:
    cx, cy = center
    radius = length / 2
    points = []
    for step in range(22):
        theta = math.pi * step / 21
        x = math.cos(theta) * radius
        y = math.sin(theta) * radius * 0.38
        rot_x = x * math.cos(angle) - y * math.sin(angle)
        rot_y = x * math.sin(angle) + y * math.cos(angle)
        points.append((scaled(cx + rot_x), scaled(cy + rot_y)))
    for step in range(22):
        theta = math.pi * (21 - step) / 21
        x = math.cos(theta) * radius
        y = -math.sin(theta) * radius * 0.38
        rot_x = x * math.cos(angle) - y * math.sin(angle)
        rot_y = x * math.sin(angle) + y * math.cos(angle)
        points.append((scaled(cx + rot_x), scaled(cy + rot_y)))
    draw.polygon(points, fill=fill)


def main() -> None:
    random.seed(926)
    canvas = Image.new("RGB", (scaled(WIDTH), scaled(HEIGHT)), color("#f4eee3"))
    draw = ImageDraw.Draw(canvas)

    # Paper grain.
    grain = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    grain_pixels = grain.load()
    for y in range(0, canvas.height, 2):
        for x in range(0, canvas.width, 2):
            delta = random.randint(-7, 7)
            alpha = random.randint(6, 14)
            tone = 255 if delta > 0 else 92
            grain_pixels[x, y] = (tone, tone, tone, alpha)
    canvas = Image.alpha_composite(canvas.convert("RGBA"), grain)
    draw = ImageDraw.Draw(canvas)

    ink = color("#45372e")
    muted = color("#7f6d5d")
    line = color("#c6ad8d")
    paper = color("#fbf5ea")
    flap = color("#f1e5d3")
    shadow = color("#5b4031")
    sage = color("#64755b")
    olive = color("#7f8a68")
    wax = color("#8d3f37")

    # Botanical corner hints.
    for base_x, mirror in ((94, 1), (1106, -1)):
        stem_points = []
        for i in range(58):
            t = i / 57
            x = base_x + mirror * math.sin(t * math.pi * 1.2) * 36
            y = 84 + t * 460
            stem_points.append((scaled(x), scaled(y)))
        draw.line(stem_points, fill=(*sage, 112), width=scaled(3))
        for i in range(9):
            t = 0.08 + i * 0.1
            x = base_x + mirror * math.sin(t * math.pi * 1.2) * 36
            y = 84 + t * 460
            angle = mirror * (0.7 + (i % 2) * 0.35)
            draw_leaf(draw, (x + mirror * 30, y), angle, 46, (*olive,))
            draw_leaf(draw, (x - mirror * 24, y + 24), angle + mirror * 2.0, 34, (*sage,))

    # Soft card shadow.
    shadow_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)
    shadow_draw.rounded_rectangle(
        [scaled(238), scaled(102), scaled(962), scaled(546)],
        radius=scaled(18),
        fill=(*shadow, 54),
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(scaled(18)))
    canvas = Image.alpha_composite(canvas, shadow_layer)
    draw = ImageDraw.Draw(canvas)

    x, y, w, h = 238, 94, 724, 430
    draw.rounded_rectangle(
        [scaled(x), scaled(y), scaled(x + w), scaled(y + h)],
        radius=scaled(20),
        fill=paper,
        outline=line,
        width=scaled(3),
    )
    draw.polygon(
        [
            (scaled(x + 18), scaled(y + 18)),
            (scaled(x + w - 18), scaled(y + 18)),
            (scaled(x + w / 2), scaled(y + 226)),
        ],
        fill=flap,
        outline=line,
    )
    draw.line(
        [(scaled(x + 18), scaled(y + h - 18)), (scaled(x + w / 2), scaled(y + 228))],
        fill=line,
        width=scaled(2),
    )
    draw.line(
        [(scaled(x + w - 18), scaled(y + h - 18)), (scaled(x + w / 2), scaled(y + 228))],
        fill=line,
        width=scaled(2),
    )
    draw.line(
        [(scaled(x + 18), scaled(y + 18)), (scaled(x + w / 2), scaled(y + 230)), (scaled(x + w - 18), scaled(y + 18))],
        fill=color("#d3bea2"),
        width=scaled(2),
    )

    # Wax seal.
    seal_center = (x + w / 2, y + 216)
    for radius, alpha in ((52, 48), (43, 255), (34, 255)):
        draw.ellipse(
            [
                scaled(seal_center[0] - radius),
                scaled(seal_center[1] - radius),
                scaled(seal_center[0] + radius),
                scaled(seal_center[1] + radius),
            ],
            fill=(*wax, alpha),
            outline=color("#78352e") if radius == 43 else None,
            width=scaled(2),
        )
    seal_font = load_font(36, SERIF)
    text_center(draw, (scaled(seal_center[0]), scaled(seal_center[1] - 23)), "C&J", seal_font, color("#f9ead9"))

    label_font = load_font(24, SANS)
    names_font = load_font(82, SERIF)
    date_font = load_font(28, SANS)
    cta_font = load_font(25, SANS)

    text_center(draw, (scaled(WIDTH / 2), scaled(144)), "INVITACIÓN DE BODA", label_font, muted)
    text_center(draw, (scaled(WIDTH / 2), scaled(182)), "Cata & Javier", names_font, ink)
    text_center(draw, (scaled(WIDTH / 2), scaled(370)), "5 de septiembre de 2026", date_font, muted)

    pill = [scaled(479), scaled(446), scaled(721), scaled(492)]
    draw.rounded_rectangle(pill, radius=scaled(23), fill=color("#ede1cf"), outline=line, width=scaled(2))
    text_center(draw, (scaled(WIDTH / 2), scaled(453)), "Abrir invitación", cta_font, ink)

    # Thin outer frame.
    draw.rounded_rectangle(
        [scaled(28), scaled(28), scaled(WIDTH - 28), scaled(HEIGHT - 28)],
        radius=scaled(28),
        outline=(*line, 170),
        width=scaled(2),
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas = canvas.convert("RGB").resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    canvas.save(OUT, optimize=True, quality=94)
    print(OUT)


if __name__ == "__main__":
    main()
