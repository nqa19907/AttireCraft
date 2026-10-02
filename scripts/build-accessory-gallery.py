"""Create a visual review gallery for local accessory photographs."""
import html
from accessory_catalog import ROOT, REVIEW, GARMENTS, COLORS, ACCESSORIES, accessory_variants

DEST = REVIEW / "gallery.html"
jobs = accessory_variants()
sections = []
count = 0
for garment, name in GARMENTS.items():
    for color, color_name in COLORS.items():
        base = f"{garment}-{color}"
        cards = [f'<figure><a href="../../frontend/assets/outfits/{base}.png"><img src="../../frontend/assets/optimized/thumbs/{base}.webp" loading="lazy" alt="Ảnh gốc"></a><figcaption>Ảnh gốc</figcaption></figure>']
        for job in jobs:
            if job["garment"] != garment or job["color"] != color:
                continue
            target = ROOT / "frontend/assets/optimized/accessories/thumbs" / (job["key"] + ".webp")
            if not target.exists():
                continue
            label = html.escape(" + ".join(ACCESSORIES[key] for key in job["accessories"]))
            cards.append(f'<figure><a href="../../frontend/assets/outfits/accessories/{job["key"]}.png"><img src="../../frontend/assets/optimized/accessories/thumbs/{job["key"]}.webp" loading="lazy" alt="{label}"></a><figcaption>{label}</figcaption></figure>')
            count += 1
        sections.append(f'<section id="{base}"><h2>{name} · {color_name}</h2><div class="grid">{"".join(cards)}</div></section>')
markup = '''<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AttireCraft · Kiểm tra phụ kiện</title><style>
*{box-sizing:border-box}body{margin:0;padding:32px;background:#d8dfd2;color:#243d34;font:15px/1.6 system-ui,sans-serif}main{max-width:1400px;margin:auto}h1{font-size:32px}section{margin:32px 0;padding:24px;background:#eee8dc;border-radius:16px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}figure{margin:0;background:#cad8c3;border-radius:12px;overflow:hidden}img{display:block;width:100%;aspect-ratio:1122/1402;object-fit:cover}figcaption{padding:12px;font-size:13px}a:focus-visible{outline:3px solid #974331;outline-offset:4px}@media(max-width:540px){body{padding:16px}section{padding:16px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style><main><h1>Ảnh trang phục và phụ kiện</h1><p>COUNT / 200 ảnh biến thể. Nhấn ảnh để mở bản PNG đầy đủ; ảnh gốc ở đầu mỗi nhóm.</p>SECTIONS</main></html>'''
REVIEW.mkdir(parents=True, exist_ok=True)
DEST.write_text(markup.replace("COUNT", str(count)).replace("SECTIONS", "".join(sections)), encoding="utf-8")
print(f"Saved gallery with {count}/200 local images: {DEST}")
