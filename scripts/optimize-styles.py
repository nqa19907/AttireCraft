"""Publish WebP photos, thumbnails and a registry from completed style PNGs.

This only optimizes existing artwork; it never draws or adds accessories.
"""
import hashlib
import json

from PIL import Image, ImageOps
from accessory_catalog import ROOT
from style_catalog import style_variants

ASSETS = ROOT / "frontend/assets"
OUTPUT = ASSETS / "optimized/styles"


def main() -> None:
    jobs = style_variants()
    available, manifest = [], []
    for job in jobs:
        source = ROOT / job["target"]
        if not source.is_file():
            continue
        folder = OUTPUT / job["style"]
        (folder / "thumbs").mkdir(parents=True, exist_ok=True)
        with Image.open(source) as original, Image.open(ROOT / job["source"]) as base:
            image = ImageOps.exif_transpose(original).convert("RGB")
            if abs(image.width / image.height - base.width / base.height) > .025:
                raise ValueError(f"Unexpected framing for {source.name}: {image.size}")
            outputs = []
            for directory, width in [(folder, 1122), (folder / "thumbs", 384)]:
                target = directory / (job["key"] + ".webp")
                if not target.is_file() or target.stat().st_mtime < source.stat().st_mtime:
                    photo = image.copy()
                    if photo.width > width:
                        photo.thumbnail((width, round(photo.height * width / photo.width)), Image.Resampling.LANCZOS)
                    photo.save(target, "WEBP", quality=90, method=4)
                outputs.append({"path": target.relative_to(ASSETS).as_posix(), "bytes": target.stat().st_size})
        available.append(job["registry_key"])
        manifest.append({"key": job["registry_key"], "source": source.relative_to(ASSETS).as_posix(), "sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "outputs": outputs})
    registry = (
        "/* Local image registry maintained by scripts/optimize-styles.py. */\n"
        "(function (root, variants) {\n"
        "  if (typeof module === 'object' && module.exports) module.exports = Object.freeze(variants);\n"
        "  else root.AttireStyleImageVariants = Object.freeze(variants);\n"
        "})(typeof globalThis !== 'undefined' ? globalThis : this, "
        + json.dumps(available, indent=2) + ");\n"
    )
    (ROOT / "frontend/style-image-variants.js").write_text(registry, encoding="utf-8")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    counts = {style: sum(row["key"].startswith(style + "/") for row in manifest) for style in ("genz", "classic")}
    report = {"available": len(available), "expected": len(jobs), "by_style": counts, "images": manifest}
    (OUTPUT / "manifest.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: report[key] for key in ("available", "expected", "by_style")}))


if __name__ == "__main__":
    main()
