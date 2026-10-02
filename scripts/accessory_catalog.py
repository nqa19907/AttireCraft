"""Catalog of local outfit photographs and accessory combinations."""
from itertools import combinations
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT / "artifacts" / "accessory-review"
GARMENTS = {"ao-dai": "Áo dài", "tu-than": "Áo tứ thân", "ngu-than": "Áo ngũ thân", "ba-ba": "Áo bà ba"}
COLORS = {"ivory": "Ngà", "red": "Đỏ son", "teal": "Xanh ngọc", "pink": "Hồng sen", "black": "Đen lĩnh"}
ACCESSORIES = {"khan": "Khăn vấn", "ngoc": "Khuyên ngọc", "non": "Nón lá", "tui": "Túi lụa"}


def accessory_variants() -> list[dict]:
    return [
        {
            "key": f"{garment}-{color}--{'-'.join(items)}",
            "garment": garment,
            "color": color,
            "accessories": list(items),
        }
        for garment in GARMENTS
        for color in COLORS
        for count in (1, 2)
        for items in combinations(ACCESSORIES, count)
    ]
