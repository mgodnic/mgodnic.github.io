#!/usr/bin/env python3
"""
Make fast versions of every image the site uses.

    python3 optimize-images.py

Reads content/data.js, finds every image it names, and writes WebP copies at a
few widths into assets/opt/, plus content/images.js — a small list the site
reads to hand each screen the right size. A phone gets a 640px file, a large
retina screen a 2560px one, and nobody downloads a 7 MB PNG again.

Originals are never touched, and data.js always names the original. An image
you add without running this still works — it is simply served as it is,
heavier, until the next run. Runs are incremental: only new or changed files
are processed; add --force to rebuild everything.

Needs Pillow:  pip3 install pillow
"""
import json
import os
import re
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Needs Pillow. Install it with:  pip3 install pillow")

ROOT = os.path.dirname(os.path.abspath(__file__))
FORCE = "--force" in sys.argv   # rebuild every copy, e.g. after changing quality
OUT = os.path.join(ROOT, "assets", "opt")
WIDTHS = [640, 1280, 1920, 2560]
# High on purpose. Several sources are film stills with grain over soft
# studio backdrops; lower settings smooth the grain away and the gradient
# behind it breaks into visible bands. AVIF was tested and was worse for the
# same reason. The files are still a small fraction of the originals.
QUALITY_JPEG_SOURCE = 90   # already lossy: re-encode without adding more loss
QUALITY_PNG_SOURCE = 95    # film stills and flat graphics: keep grain and edges


def referenced_images():
    data = open(os.path.join(ROOT, "content", "data.js"), encoding="utf-8").read()
    found = re.findall(r'["\'](assets/[^"\']+\.(?:jpe?g|png))["\']', data, re.I)
    return sorted({p for p in found if not p.startswith("assets/meta/")
                   and not p.startswith("assets/opt/")})


def target_widths(original_width):
    ws = [w for w in WIDTHS if w < original_width]
    ws.append(min(original_width, WIDTHS[-1]))
    return sorted(set(ws))


def flatten_if_opaque(im):
    """Drop an alpha channel nobody is using: it only costs bytes."""
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        im = im.convert("RGBA")
        if im.getchannel("A").getextrema()[0] == 255:
            return im.convert("RGB")
        return im
    return im.convert("RGB")


def main():
    manifest, made, kept, missing = {}, 0, 0, []
    for rel in referenced_images():
        src = os.path.join(ROOT, rel)
        if not os.path.exists(src):
            missing.append(rel)
            continue
        stem = os.path.splitext(rel[len("assets/"):])[0]
        with Image.open(src) as im:
            im.load()
            w, h = im.size
            widths = target_widths(w)
            quality = QUALITY_PNG_SOURCE if rel.lower().endswith(".png") else QUALITY_JPEG_SOURCE
            base = None
            for tw in widths:
                dest = os.path.join(OUT, "%s-%d.webp" % (stem, tw))
                if not FORCE and os.path.exists(dest) and os.path.getmtime(dest) >= os.path.getmtime(src):
                    kept += 1
                    continue
                if base is None:
                    base = flatten_if_opaque(im)
                th = round(h * tw / w)
                out = base if tw == w else base.resize((tw, th), Image.LANCZOS)
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                out.save(dest, "WEBP", quality=quality, method=6)
                made += 1
        manifest[rel] = {"w": widths, "r": round(w / h, 4)}

    js = ("/* Written by optimize-images.py — do not edit by hand. Lists the widths\n"
          "   of the fast copies in assets/opt/ for each original image. */\n"
          "window.IMAGES = " + json.dumps(manifest, indent=1, sort_keys=True) + ";\n")
    open(os.path.join(ROOT, "content", "images.js"), "w", encoding="utf-8").write(js)

    print("%d images: %d copies written, %d already current." % (len(manifest), made, kept))
    for m in missing:
        print("  missing file, skipped:", m)


if __name__ == "__main__":
    main()
