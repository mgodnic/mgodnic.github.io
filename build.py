#!/usr/bin/env python3
"""
Build the site: fast images, share cards, and real HTML for every page.

    cd /Users/mitjagodnic/CV/site && ../.venv/bin/python build.py

1. Images       runs optimize-images.py — WebP copies at several widths.
2. Share cards  a 1200x630 JPEG per project, for link previews.
3. Pages        writes each page's content into its own HTML file. The content
                is rendered by the site's own js/app.js, run in the Mac's
                built-in JavaScript engine (osascript), so what a search engine,
                a link preview or an AI reader gets is exactly what a visitor's
                browser draws. Each project gets its own page, work-<id>.html.
4. Versions     stamps css/js/data links with a content hash, so browsers
                fetch the new files after a change and cache them otherwise.
5. sitemap.xml  lists every page.

Visitors' browsers still build every page live from data.js, so an unbuilt
change is already visible to people; only previews, search engines and AI
readers wait for the next build. Run it before publishing.

Needs Pillow for steps 1-2 (it is in ../.venv). Rendering needs nothing extra.
"""
import datetime
import hashlib
import html
import json
import os
import re
import runpy
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(ROOT, *a)
read = lambda f: open(P(f), encoding="utf-8").read()


def write(f, text):
    with open(P(f), "w", encoding="utf-8") as fh:
        fh.write(text)


def base_url():
    m = re.search(r'<link rel="canonical" href="(https?://[^/"]+)', read("index.html"))
    return m.group(1) if m else "https://mgodnic.github.io"


# ---------------------------------------------------------------- 1. images
def images():
    try:
        import PIL  # noqa: F401
    except ImportError:
        print("  skipped images and share cards: Pillow missing (use ../.venv/bin/python)")
        return False
    runpy.run_path(P("optimize-images.py"), run_name="__main__")
    return True


# ---------------------------------------------------------------- 3. render
SHIM = r"""
var window = this;
var __q = "", __meta = {};
function URLSearchParams(s) {
  var m = {}; String(s || "").replace(/^\?/, "").split("&").forEach(function (kv) {
    if (!kv) return; var i = kv.indexOf("=");
    m[decodeURIComponent(i < 0 ? kv : kv.slice(0, i))] = decodeURIComponent(i < 0 ? "" : kv.slice(i + 1));
  });
  this.get = function (k) { return k in m ? m[k] : null; };
}
var location = { protocol: "https:", host: "%(host)s", origin: "%(base)s", pathname: "/", hash: "",
  get search() { return __q; }, get href() { return "%(base)s/" + __q; } };
var __body = { dataset: { todo: "off" }, classList: { add: function () {} } };
function __el(sel) { return { setAttribute: function (a, v) { __meta[sel] = v; }, remove: function () {} }; }
var document = { title: "", body: __body, head: { querySelector: __el },
  addEventListener: function () {}, getElementById: function () { return null; },
  querySelector: function () { return null; }, querySelectorAll: function () { return []; } };
window.matchMedia = function () { return { matches: false }; };
window.addEventListener = function () {};
var console = { log: function () {}, warn: function () {} };
"""

DRIVER = r"""
;(function () {
  var S = window.SITE, out = { pages: [], projects: [] };
  function page(file, view, project) {
    __meta = {}; document.title = "";
    __body.dataset.view = view; __body.dataset.project = project || "";
    var h = window.SiteRender(view);
    out.pages.push({ file: file, view: view, project: project || null, html: h, title: document.title,
      description: __meta['meta[name="description"]'] || null });
  }
  page("index.html", "home"); page("work.html", "work");
  page("video.html", "video"); page("profile.html", "profile");
  S.projects.filter(function (p) { return p.visible !== false; }).forEach(function (p) {
    out.projects.push({ id: p.id, title: p.title, premise: p.premise || "", client: p.client || "",
      image: p.homeImage || (p.images && p.images[0]) || null, fit: p.fit || "",
      bg: p.plateBg || "", hasHome: !!p.homeImage });
    page("work-" + p.id + ".html", "project", p.id);
  });
  return JSON.stringify(out);
})();
"""


def render(base):
    host = re.sub(r"^https?://", "", base)
    src = (SHIM % {"base": base, "host": host} + read("content/data.js") + "\n" +
           (read("content/images.js") if os.path.exists(P("content/images.js")) else "") + "\n" +
           read("js/app.js") + DRIVER)
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as fh:
        fh.write(src)
        tmp = fh.name
    try:
        r = subprocess.run(["osascript", "-l", "JavaScript", tmp], capture_output=True, text=True, timeout=120)
    finally:
        os.remove(tmp)
    if r.returncode != 0:
        sys.exit("Rendering failed:\n" + r.stderr[-2000:])
    return json.loads(r.stdout)


# ---------------------------------------------------------------- 2. share cards
def share_cards(projects):
    from PIL import Image
    os.makedirs(P("assets", "opt", "og"), exist_ok=True)
    made = 0
    for p in projects:
        if not p["image"] or not os.path.exists(P(p["image"])):
            continue
        out = P("assets", "opt", "og", p["id"] + ".jpg")
        if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(P(p["image"])):
            continue
        W, H = 1200, 630
        with Image.open(P(p["image"])) as im:
            im = im.convert("RGB")
            if (p["fit"] == "contain" or p["bg"]) and not p["hasHome"]:
                # a mark or a board: show all of it, on its own colour
                bg = p["bg"].lstrip("#") or "e8e6e5"
                card = Image.new("RGB", (W, H), tuple(int(bg[i:i + 2], 16) for i in (0, 2, 4)))
                im.thumbnail((int(W * 0.84), int(H * 0.84)), Image.LANCZOS)
                card.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
            else:
                # a photograph: fill the card, keeping the middle
                s = max(W / im.width, H / im.height)
                im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
                l, t = (im.width - W) // 2, (im.height - H) // 2
                card = im.crop((l, t, l + W, t + H))
            card.save(out, "JPEG", quality=85, optimize=True, progressive=True)
            made += 1
    print("  share cards: %d written" % made)


# ---------------------------------------------------------------- 3b. write pages
APP = re.compile(r'<div id="app">(?:<!-- built -->.*?<!-- /built -->)?</div>', re.S)
EARLY_JS = '<script>document.documentElement.className += " js";</script>'


def inject(doc, body):
    new = '<div id="app"><!-- built -->' + body + "<!-- /built --></div>"
    doc, n = APP.subn(lambda m: new, doc, count=1)
    if n != 1:
        sys.exit("Could not find the app container")
    # the entrance animation is switched on before the first paint, so written-out
    # content never shows, vanishes, and fades back in
    if EARLY_JS not in doc:
        doc = doc.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + EARLY_JS, 1)
    return doc


def set_meta(doc, attr, key, value):
    pat = re.compile(r'(<meta %s="%s" content=")[^"]*(")' % (attr, re.escape(key)))
    return pat.sub(lambda m: m.group(1) + html.escape(value, quote=True) + m.group(2), doc, count=1)


def clamp(t, n=155):
    t = re.sub(r"\s+", " ", t).strip()
    if len(t) <= n:
        return t
    cut = t[:n - 1]
    return cut[:cut.rfind(" ")].rstrip(",;:—- ") + "…"


def write_pages(data, base):
    for pg in data["pages"]:
        if pg["view"] != "project":
            write(pg["file"], inject(read(pg["file"]), pg["html"]))
    template = read("work.html")
    cards = {p["id"]: os.path.exists(P("assets", "opt", "og", p["id"] + ".jpg")) for p in data["projects"]}
    info = {p["id"]: p for p in data["projects"]}
    for pg in (x for x in data["pages"] if x["view"] == "project"):
        p, url = info[pg["project"]], "%s/%s" % (base, pg["file"])
        title = pg["title"] or (p["title"] + " — Mitja Godnic")
        desc = clamp(pg["description"] or p["premise"])
        doc = template
        doc = re.sub(r"<title>.*?</title>", lambda m: "<title>%s</title>" % html.escape(title), doc, count=1)
        doc = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), doc, count=1)
        doc = re.sub(r'<body data-view="work"', '<body data-view="project" data-project="%s"' % html.escape(p["id"]), doc, count=1)
        for a, k, v in [("name", "description", desc), ("property", "og:title", title),
                        ("property", "og:description", desc), ("property", "og:url", url),
                        ("property", "og:type", "article"), ("name", "twitter:title", title),
                        ("name", "twitter:description", desc)]:
            doc = set_meta(doc, a, k, v)
        if cards.get(p["id"]):
            img = "%s/assets/opt/og/%s.jpg" % (base, p["id"])
            alt = p["title"] + (", " + p["client"] if p["client"] and p["client"] not in p["title"] else "")
            for a, k, v in [("property", "og:image", img), ("name", "twitter:image", img),
                            ("property", "og:image:width", "1200"), ("property", "og:image:height", "630"),
                            ("property", "og:image:type", "image/jpeg"), ("property", "og:image:alt", alt),
                            ("name", "twitter:image:alt", alt)]:
                doc = set_meta(doc, a, k, v)
        write(pg["file"], inject(doc, pg["html"]))
    # retired project files — a project removed from data.js loses its page
    keep = {pg["file"] for pg in data["pages"]}
    for f in os.listdir(ROOT):
        if re.match(r"work-.+\.html$", f) and f not in keep:
            os.remove(P(f))
    print("  pages: %d written (%d projects)" % (len(data["pages"]), len(data["projects"])))


# ---------------------------------------------------------------- 4. versions
def stamp_versions():
    h = hashlib.sha1()
    for f in ("css/site.css", "js/app.js", "content/data.js", "content/images.js"):
        if os.path.exists(P(f)):
            h.update(open(P(f), "rb").read())
    v = h.hexdigest()[:8]
    pat = re.compile(r'((?:css/site\.css|js/app\.js|content/data\.js|content/images\.js)\?v=)[0-9a-f]+')
    for f in os.listdir(ROOT):
        if f.endswith(".html"):
            doc = read(f)
            new = pat.sub(lambda m: m.group(1) + v, doc)
            if new != doc:
                write(f, new)
    print("  version: %s" % v)


# ---------------------------------------------------------------- 5. sitemap
def sitemap(data, base):
    today = datetime.date.today().isoformat()
    rows = [("", "1.0"), ("work.html", "0.9"), ("video.html", "0.8"), ("profile.html", "0.8")]
    rows += [(pg["file"], "0.7") for pg in data["pages"] if pg["view"] == "project"]
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u, pr in rows:
        out.append("  <url>\n    <loc>%s/%s</loc>\n    <lastmod>%s</lastmod>\n    <priority>%s</priority>\n  </url>"
                   % (base, u, today, pr))
    write("sitemap.xml", "\n".join(out + ["</urlset>"]) + "\n")
    print("  sitemap: %d pages" % len(rows))


def main():
    base = base_url()
    print("Building for %s" % base)
    have_pillow = images()
    stamp_versions()                     # before rendering, so the pages carry it
    data = render(base)
    if have_pillow:
        share_cards(data["projects"])
    write_pages(data, base)
    stamp_versions()                     # again: new project pages need the stamp too
    sitemap(data, base)
    print("Done.")


if __name__ == "__main__":
    main()
