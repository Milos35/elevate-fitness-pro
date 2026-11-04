#!/usr/bin/env python3
"""Render the master app icon (public/pwa-512.png): BUSY / 90 / Strong on #fdfcfa.

Run this first, then `npm run generate:brand-icons` to derive favicons + PWA sizes.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "pwa-512.png"

BEBAS = ROOT / "node_modules/@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff"
DM_SANS = ROOT / "node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2"

BG = "#fdfcfa"
INK = "#111111"
TEAL = "#298e7f"  # brand teal darkened (hsl 171 55% 36%) for contrast on light bg

S = 2048  # supersampled canvas, downscaled to 512 at the end


def spaced_width(draw, text, font, tracking):
    widths = [draw.textlength(ch, font=font) for ch in text]
    return sum(widths) + tracking * (len(text) - 1), widths


def draw_line(draw, text, font, cy, fill, tracking=0):
    """Draw text horizontally centred, with its ink box vertically centred on cy."""
    total, widths = spaced_width(draw, text, font, tracking)
    top, bottom = font.getbbox(text)[1], font.getbbox(text)[3]
    y = cy - (top + bottom) / 2
    x = (S - total) / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + tracking


def main() -> None:
    img = Image.new("RGB", (S, S), BG)
    d = ImageDraw.Draw(img)

    busy = ImageFont.truetype(str(BEBAS), int(S * 0.17))
    ninety = ImageFont.truetype(str(BEBAS), int(S * 0.34))
    strong = ImageFont.truetype(str(DM_SANS), int(S * 0.105))
    strong.set_variation_by_axes([700])

    # Teal ring; outer edge sits on the maskable safe-zone circle (radius 40%).
    ring_r, ring_w = S * 0.388, S * 0.017
    c = S / 2
    d.ellipse(
        (c - ring_r - ring_w / 2, c - ring_r - ring_w / 2, c + ring_r + ring_w / 2, c + ring_r + ring_w / 2),
        outline=TEAL,
        width=int(ring_w),
    )

    draw_line(d, "BUSY", busy, S * 0.285, INK, tracking=S * 0.011)
    draw_line(d, "90", ninety, S * 0.505, TEAL, tracking=S * 0.004)
    draw_line(d, "Strong", strong, S * 0.725, INK, tracking=-S * 0.002)

    img.resize((512, 512), Image.Resampling.LANCZOS).save(OUT, format="PNG", optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
