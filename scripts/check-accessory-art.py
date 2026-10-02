"""Check image coverage, portrait framing and unchanged background regions.

This reads finished images for QA and never edits artwork. Visual review is
still required to check accessory presence and model identity.
"""
import json

from PIL import Image, ImageChops, ImageStat
from accessory_catalog import ROOT, REVIEW, accessory_variants

ASSETS = ROOT / "frontend/assets/outfits"
JOBS = accessory_variants()
results = []
missing = []
for job in JOBS:
    variant = ASSETS / "accessories" / (job["key"] + ".png")
    if not variant.exists():
        missing.append(job["key"])
        continue
    with Image.open(ASSETS / f"{job['garment']}-{job['color']}.png") as source, Image.open(variant) as edited:
        original = source.convert("RGB")
        photo = edited.convert("RGB")
        if photo.size != original.size:
            raise ValueError(f"Framing changed: {job['key']}, {photo.size} instead of {original.size}")
        width, height = photo.size
        tiles = [(0, 0, .22, .3), (.8, .45, 1, .75), (0, .8, .22, 1)]
        differences = []
        for x1, y1, x2, y2 in tiles:
            box = (round(x1 * width), round(y1 * height), round(x2 * width), round(y2 * height))
            difference = ImageChops.difference(original.crop(box), photo.crop(box))
            differences.append(round(sum(ImageStat.Stat(difference).mean) / 3, 3))
        results.append({"key": job["key"], "background_mean_difference_0_255": differences, "review_required": max(differences) > 12})
report = {"checked": len(results), "expected": len(JOBS), "missing": missing, "background_review": [result["key"] for result in results if result["review_required"]], "images": results}
REVIEW.mkdir(parents=True, exist_ok=True)
(REVIEW / "quality-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps({key: report[key] for key in ["checked", "expected", "missing", "background_review"]}, indent=2))
if missing:
    raise SystemExit(1)
