"""ImageGen edit specifications for the two personality styles.

Each style contains 200 accessory combinations and 20 unaccessorized outfits.
The minimal style continues to use the existing catalog unchanged.
"""
import json

from accessory_catalog import ROOT, GARMENTS, COLORS, accessory_variants

STYLES = {
    "genz": "one pair of black sunglasses worn naturally over the model's eyes, with realistic temples, reflections and perspective",
    "classic": "one elegant single-strand white pearl necklace worn around the model's neck, resting naturally over the collar or upper chest with realistic highlights and shadows",
}
ACCESSORY_DESCRIPTIONS = {
    "khan": "wrapped headscarf",
    "ngoc": "jade earrings",
    "non": "conical straw hat",
    "tui": "silk bags",
}


def style_variants() -> list[dict]:
    bases = [
        {"key": f"{garment}-{color}", "garment": garment, "color": color, "accessories": []}
        for garment in GARMENTS for color in COLORS
    ]
    return [
        {
            **job,
            "style": style,
            "registry_key": f"{style}/{job['key']}",
            "source": f"frontend/assets/outfits/{'accessories/' if job['accessories'] else ''}{job['key']}.png",
            "target": f"frontend/assets/outfits/styles/{style}/{job['key']}.png",
            "prompt": (
                "Use case: precise-object-edit / identity-preserve. "
                f"Asset type: AttireCraft {style} outfit photo. Input image 1 is the EDIT TARGET. "
                f"Add only {addition}. Keep the same model identity, expression, pose, hair, "
                "outfit color, garment details, existing accessories, hands, backdrop and lighting. "
                "Keep the exact full-body framing, dimensions and aspect ratio of the input. "
                "Do not remove or add any other accessories. No text, no watermark. "
                "Preserve these selected accessories: "
                + (", ".join(ACCESSORY_DESCRIPTIONS[key] for key in job["accessories"]) or "none") + ". "
                "Produce one complete standalone portrait photo."
            ),
        }
        for style, addition in STYLES.items()
        for job in bases + accessory_variants()
    ]


if __name__ == "__main__":
    output = ROOT / "artifacts/style-review"
    output.mkdir(parents=True, exist_ok=True)
    jobs = style_variants()
    (output / "generation-jobs.json").write_text(json.dumps(jobs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    pending = sorted((job for job in jobs if not (ROOT / job["target"]).is_file()), key=lambda job: (-len(job["accessories"]), job["registry_key"]))
    (output / "pending-jobs.json").write_text(json.dumps(pending, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Prepared {len(jobs)} ImageGen edits: 400 accessory variants + 40 base outfits; {len(pending)} still pending.")
