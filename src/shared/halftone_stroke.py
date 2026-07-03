#!/usr/bin/env python3
"""Reusable image post-processing for this channel's cut-out assets.

Applies two effects to a transparent PNG (alpha channel already cut out —
this script never touches background removal):

1. Black-and-white halftone dots, rendered only inside the existing opaque
   silhouette. Dot radius scales with how dark the source pixel is.
2. An offset outline "stroke" ring around the silhouette: the alpha mask is
   dilated by `--stroke-offset` px, then by `--stroke-offset + --stroke-width`
   px, and the ring between those two dilations is filled with the stroke
   color. This matches the red-stroke look used on earlier projects, just
   with a configurable color (cyan by default here).

Usage:
    python halftone_stroke.py --input-dir DIR --output-dir DIR \
        --process bible.png dry-valley.png water-texture.png \
        --copy background.jpeg
"""

import argparse
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import binary_dilation

DEFAULT_CELL_SIZE = 6
DEFAULT_STROKE_OFFSET = 4
DEFAULT_STROKE_WIDTH = 3
CYAN = (0, 255, 255, 255)
WHITE = (255, 255, 255, 255)
STROKE_COLOR_PRESETS = {"cyan": CYAN, "white": WHITE}


def _disk(radius: int) -> np.ndarray:
    y, x = np.ogrid[-radius : radius + 1, -radius : radius + 1]
    return (x**2 + y**2) <= radius**2


def halftone_dots(rgba: Image.Image, cell_size: int = DEFAULT_CELL_SIZE) -> Image.Image:
    """Render the opaque region of `rgba` as black halftone dots on a
    transparent background. Dot size scales with darkness; fully white
    areas get no dot at all."""
    w, h = rgba.size
    gray_arr = np.array(rgba.convert("L"), dtype=np.float32)
    alpha_arr = np.array(rgba.split()[-1], dtype=np.float32)

    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(out)

    for cy in range(0, h, cell_size):
        for cx in range(0, w, cell_size):
            cell_alpha = alpha_arr[cy : cy + cell_size, cx : cx + cell_size]
            weights = cell_alpha / 255.0
            weight_sum = weights.sum()
            if weight_sum <= 0:
                continue
            cell_gray = gray_arr[cy : cy + cell_size, cx : cx + cell_size]
            avg_brightness = float((cell_gray * weights).sum() / weight_sum)
            darkness = 1.0 - (avg_brightness / 255.0)
            if darkness <= 0.02:
                continue
            radius = (cell_size / 2.0) * darkness
            if radius < 0.5:
                continue
            cx_center = cx + cell_size / 2.0
            cy_center = cy + cell_size / 2.0
            draw.ellipse(
                [cx_center - radius, cy_center - radius, cx_center + radius, cy_center + radius],
                fill=(0, 0, 0, 255),
            )

    # Clip dots to the exact original silhouette (respects soft/AA edges).
    out_arr = np.array(out)
    out_arr[..., 3] = np.minimum(out_arr[..., 3], alpha_arr.astype(np.uint8))
    return Image.fromarray(out_arr, mode="RGBA")


def offset_stroke_ring(
    rgba: Image.Image,
    offset: int = DEFAULT_STROKE_OFFSET,
    width: int = DEFAULT_STROKE_WIDTH,
    color=CYAN,
) -> Image.Image:
    """Build a uniform outline ring around the silhouette: the area between
    `offset` px and `offset + width` px of outward dilation, filled with
    `color`."""
    alpha_arr = np.array(rgba.split()[-1])
    mask = alpha_arr > 0

    inner = binary_dilation(mask, structure=_disk(offset))
    outer = binary_dilation(mask, structure=_disk(offset + width))
    ring = outer & ~inner

    w, h = rgba.size
    out_arr = np.zeros((h, w, 4), dtype=np.uint8)
    out_arr[ring] = color
    return Image.fromarray(out_arr, mode="RGBA")


def process_image(
    src_path: Path,
    dst_path: Path,
    cell_size: int = DEFAULT_CELL_SIZE,
    stroke_offset: int = DEFAULT_STROKE_OFFSET,
    stroke_width: int = DEFAULT_STROKE_WIDTH,
    stroke_color=CYAN,
    apply_halftone: bool = True,
) -> None:
    rgba = Image.open(src_path).convert("RGBA")

    ring = offset_stroke_ring(rgba, offset=stroke_offset, width=stroke_width, color=stroke_color)
    foreground = halftone_dots(rgba, cell_size=cell_size) if apply_halftone else rgba

    result = Image.alpha_composite(ring, foreground)
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    result.save(dst_path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--process", nargs="*", default=[], help="Filenames to halftone + stroke")
    parser.add_argument("--copy", nargs="*", default=[], help="Filenames to copy through untouched")
    parser.add_argument("--cell-size", type=int, default=DEFAULT_CELL_SIZE)
    parser.add_argument("--stroke-offset", type=int, default=DEFAULT_STROKE_OFFSET)
    parser.add_argument("--stroke-width", type=int, default=DEFAULT_STROKE_WIDTH)
    parser.add_argument(
        "--no-halftone",
        action="store_true",
        help="Keep original full color instead of converting to halftone dots",
    )
    parser.add_argument(
        "--stroke-color",
        choices=sorted(STROKE_COLOR_PRESETS),
        default="cyan",
        help="Color of the offset stroke ring",
    )
    args = parser.parse_args()
    stroke_color = STROKE_COLOR_PRESETS[args.stroke_color]

    args.output_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for name in args.process:
        src = args.input_dir / name
        dst = args.output_dir / (Path(name).stem + ".png")
        try:
            process_image(
                src,
                dst,
                cell_size=args.cell_size,
                stroke_offset=args.stroke_offset,
                stroke_width=args.stroke_width,
                stroke_color=stroke_color,
                apply_halftone=not args.no_halftone,
            )
            results.append((name, "ok", dst))
        except Exception as exc:  # noqa: BLE001
            results.append((name, f"failed: {exc}", None))

    for name in args.copy:
        src = args.input_dir / name
        dst = args.output_dir / name
        try:
            shutil.copy2(src, dst)
            results.append((name, "copied", dst))
        except Exception as exc:  # noqa: BLE001
            results.append((name, f"failed: {exc}", None))

    print("\nSummary:")
    ok = True
    for name, status, dst in results:
        print(f"  {name}: {status}" + (f" -> {dst}" if dst else ""))
        if "failed" in status:
            ok = False

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
