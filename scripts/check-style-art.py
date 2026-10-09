"""Read-only QA for style coverage, unique artwork and portrait framing."""
import hashlib
import json
from collections import Counter

from PIL import Image, ImageChops, ImageStat
from accessory_catalog import ROOT
from style_catalog import style_variants


def main() -> None:
    images, missing, failures = [], [], []
    for job in style_variants():
        target = ROOT / job["target"]
        if not target.is_file():
            missing.append(job["registry_key"])
            continue
        digest = hashlib.sha256(target.read_bytes()).hexdigest()
        with Image.open(ROOT / job["source"]) as source, Image.open(target) as edited:
            base, photo = source.convert("RGB"), edited.convert("RGB")
            if abs(base.width / base.height - photo.width / photo.height) > .025:
                failures.append(job["registry_key"] + ": aspect ratio changed")
            if base.size == photo.size:
                difference = ImageChops.difference(base, photo)
                if difference.getbbox() is None:
                    failures.append(job["registry_key"] + ": identical to source")
                width, height = photo.size
                values = []
                for x1, y1, x2, y2 in [(0, 0, .22, .3), (.8, .45, 1, .75), (0, .8, .22, 1)]:
                    box = tuple(round(v * (width if i % 2 == 0 else height)) for i, v in enumerate((x1, y1, x2, y2)))
                    values.append(round(sum(ImageStat.Stat(difference.crop(box)).mean) / 3, 3))
            else:
                values = None
        images.append({"key": job["registry_key"], "sha256": digest, "dimensions": list(photo.size), "background_difference": values})
    duplicates = [digest for digest, count in Counter(row["sha256"] for row in images).items() if count > 1]
    if duplicates:
        failures.append("Duplicate style images")
    counts = {style: sum(row["key"].startswith(style + "/") for row in images) for style in ("genz", "classic")}
    background_review = [row["key"] for row in images if row["background_difference"] and max(row["background_difference"]) > 12]
    report = {"checked": len(images), "expected": 440, "by_style": counts, "missing": missing, "failures": failures, "background_review": background_review, "images": images}
    output = ROOT / "artifacts/style-review"
    output.mkdir(parents=True, exist_ok=True)
    (output / "quality-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: report[key] for key in ("checked", "expected", "by_style", "failures", "background_review")}))
    if missing or failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
