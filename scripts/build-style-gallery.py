"""Make a local visual comparison gallery from existing style artwork."""
import html

from accessory_catalog import ROOT, GARMENTS, COLORS, ACCESSORIES
from style_catalog import style_variants

output = ROOT / "artifacts/style-review"
output.mkdir(parents=True, exist_ok=True)
jobs = style_variants()
sections = []
for garment, garment_label in GARMENTS.items():
    for color, color_label in COLORS.items():
        cards = []
        for job in jobs:
            if job["style"] != "genz" or job["garment"] != garment or job["color"] != color:
                continue
            label = html.escape(" + ".join(ACCESSORIES[key] for key in job["accessories"]) or "Không thêm phụ kiện")
            photos = []
            for style, title in [("minimal", "Tối giản"), ("genz", "Gen Z · Kính râm"), ("classic", "Cổ điển · Ngọc trai")]:
                source = ROOT / (job["source"] if style == "minimal" else job["target"].replace("/genz/", f"/{style}/"))
                if source.exists():
                    relative = "../../" + source.relative_to(ROOT).as_posix()
                    photos.append(f'<figure><img src="{relative}" loading="lazy" alt="{label} · {title}"><figcaption>{title}</figcaption></figure>')
                else:
                    photos.append(f'<figure class="missing"><p>Chưa có ảnh</p><figcaption>{title}</figcaption></figure>')
            cards.append(f'<article><h3>{label}</h3><div class="photos">{"".join(photos)}</div></article>')
        sections.append(f'<section id="{garment}-{color}"><h2>{garment_label} · {color_label}</h2>{"".join(cards)}</section>')
page = '''<!doctype html><html lang="vi"><meta charset="utf-8"><title>Đối chiếu phong cách AttireCraft</title>
<style>body{margin:24px;background:#eee8dc;color:#24483d;font:16px system-ui}section{margin:0 0 64px}article{margin:24px 0}.photos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;max-width:1200px}figure{margin:0;background:#cedac6;border-radius:10px;overflow:hidden}img{display:block;width:100%;height:auto}figcaption{padding:12px}.missing{min-height:200px}.missing p{padding:24px}</style>
<h1>Đối chiếu ảnh gốc, kính râm và vòng cổ ngọc trai</h1>''' + "".join(sections) + "</html>"
(output / "gallery.html").write_text(page, encoding="utf-8")
print(f"Saved {output / 'gallery.html'}")
