#!/usr/bin/env python3
r"""Build the site's WebP images without changing the PNG source artwork.

Run from any directory with Python 3.10+ and Pillow installed::

    .venv\Scripts\python.exe -m pip install Pillow==12.3.0
    .venv\Scripts\python.exe scripts/optimize-assets.py

Full images retain their source resolution (up to 1122 pixels wide). Small
cards use separate 384-pixel-wide thumbnails so they do not download portraits.
Both use quality 90 and WebP's highest compression effort. Output is repeatable
with the same Pillow/libwebp version; metadata is deliberately not copied.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

try:
    from PIL import Image, ImageOps, features
except ImportError as exc:
    raise SystemExit(
        "Pillow is required. Install it with: python -m pip install Pillow==12.3.0"
    ) from exc


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "frontend" / "assets"
OUTPUT = ASSETS / "optimized"
MAIN_WIDTH = 1122
THUMB_WIDTH = 384
QUALITY = 90


def save_webp(source: Image.Image, target: Path, max_width: int) -> dict:
    """Keep the full composition and aspect ratio; never upscale an image."""
    image = source.copy()
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.Resampling.LANCZOS)
    image.save(target, format="WEBP", quality=QUALITY, method=6)
    return {
        "path": target.relative_to(ASSETS).as_posix(),
        "width": image.width,
        "height": image.height,
        "bytes": target.stat().st_size,
    }


def main() -> None:
    if not features.check("webp"):
        raise SystemExit("This Pillow installation does not include WebP support.")

    sources = sorted(ASSETS.glob("*.png")) + sorted((ASSETS / "outfits").glob("*.png"))
    if not sources:
        raise SystemExit(f"No PNG source images found in {ASSETS}")
    stems = [path.stem.casefold() for path in sources]
    if len(stems) != len(set(stems)):
        raise SystemExit("Source basenames must be unique to avoid overwriting an image.")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "thumbs").mkdir(exist_ok=True)
    images = []
    for path in sources:
        with Image.open(path) as original:
            source = ImageOps.exif_transpose(original)
            source = source.convert("RGBA" if "A" in source.getbands() else "RGB")
            full = save_webp(source, OUTPUT / f"{path.stem}.webp", MAIN_WIDTH)
            thumb = save_webp(source, OUTPUT / "thumbs" / f"{path.stem}.webp", THUMB_WIDTH)
        entry = {
            "source": path.relative_to(ASSETS).as_posix(),
            "source_bytes": path.stat().st_size,
            "source_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "full": full,
            "thumbnail": thumb,
        }
        images.append(entry)
        print(f"{path.stem:<24} {entry['source_bytes']:>9,} -> {full['bytes']:>7,} bytes"
              f" | thumbnail {thumb['bytes']:>6,} bytes")

    totals = {
        "source_bytes": sum(entry["source_bytes"] for entry in images),
        "full_bytes": sum(entry["full"]["bytes"] for entry in images),
        "thumbnail_bytes": sum(entry["thumbnail"]["bytes"] for entry in images),
    }
    manifest = {
        "quality": QUALITY,
        "webp_version": features.version("webp"),
        "totals": totals,
        "images": images,
    }
    (OUTPUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    savings = 100 * (1 - totals["full_bytes"] / totals["source_bytes"])
    print(f"\n{len(images)} full images: {totals['source_bytes']:,} -> "
          f"{totals['full_bytes']:,} bytes ({savings:.1f}% smaller)")
    print(f"{len(images)} thumbnails: {totals['thumbnail_bytes']:,} bytes")


if __name__ == "__main__":
    main()
