"""Optimize local accessory photos and publish the image registry.

Run with .venv/Scripts/python.exe scripts/optimize-accessories.py.
This script creates WebP copies and thumbnails from local PNG files.
"""
from __future__ import annotations

import hashlib
import json

from PIL import Image, ImageOps
from accessory_catalog import ROOT, accessory_variants

ASSETS = ROOT / "frontend" / "assets"
SOURCE = ASSETS / "outfits" / "accessories"
OUTPUT = ASSETS / "optimized" / "accessories"


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "thumbs").mkdir(exist_ok=True)
    expected = accessory_variants()
    available = []
    manifest = []
    for job in expected:
        source = SOURCE / (job["key"] + ".png")
        if not source.is_file():
            continue
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            with Image.open(ASSETS / "outfits" / f"{job['garment']}-{job['color']}.png") as base:
                if abs(image.width / image.height - base.width / base.height) > .025:
                    raise ValueError(f"Unexpected framing for {source.name}: {image.size}")
            outputs = []
            for folder, width in [(OUTPUT, 1122), (OUTPUT / "thumbs", 384)]:
                target = folder / (job["key"] + ".webp")
                if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
                    photo = image.copy()
                    if photo.width > width:
                        photo.thumbnail((width, round(photo.height * width / photo.width)), Image.Resampling.LANCZOS)
                    photo.save(target, "WEBP", quality=90, method=6)
                outputs.append({"path": target.relative_to(ASSETS).as_posix(), "bytes": target.stat().st_size})
        available.append(job["key"])
        manifest.append({"key": job["key"], "source": source.relative_to(ASSETS).as_posix(), "sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "outputs": outputs})
    registry = (
        "/* Local image registry maintained by scripts/optimize-accessories.py. */\n"
        "(function (root, variants) {\n"
        "  if (typeof module === 'object' && module.exports) module.exports = Object.freeze(variants);\n"
        "  else root.AttireImageVariants = Object.freeze(variants);\n"
        "})(typeof globalThis !== 'undefined' ? globalThis : this, "
        + json.dumps(available, indent=2) + ");\n"
    )
    (ROOT / "frontend/image-variants.js").write_text(registry, encoding="utf-8")
    (OUTPUT / "manifest.json").write_text(json.dumps({"available": len(available), "expected": len(expected), "images": manifest}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Published {len(available)}/{len(expected)} accessory photos and thumbnails.")


if __name__ == "__main__":
    main()
