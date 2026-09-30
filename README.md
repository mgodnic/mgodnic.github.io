# The site

No build step, no framework, no dependencies. Open `index.html` in a browser and it runs.

**But use the local server when you want to check it properly.** Opening a file straight from disk gives the page no origin, and YouTube refuses to load a player on it — that is the "Napaka 153" error. The site handles this (pressing play opens the film on YouTube instead), but embeds, and anything else origin-dependent, only behave as they will in production when served:

```bash
cd /Users/mitjagodnic/CV/site && python3 -m http.server 8899
```

Then open http://localhost:8899

**After editing `content/data.js`, hard-reload** — `Cmd+Shift+R` on macOS. The browser caches it aggressively, and a normal refresh will show you the old content. If a change of yours seems not to have taken effect, that is almost always why.

To publish: upload the whole `site/` folder to any static host — Netlify, Vercel, GitHub Pages, or plain FTP. Nothing needs compiling.

---

## Editing

**Everything lives in one file: `content/data.js`.** Open it in any text editor, change it, save, refresh the browser.

| To do this | Do this |
|---|---|
| Add a project | Copy an existing block inside `projects:` and change the fields |
| Reorder work | Move the blocks up or down — the order in the file is the order on the site |
| Hide something | Set `visible: false` |
| Put it on the home page | Set `home: true` on four projects — the home page shows two uneven pairs |
| Fix a bad home crop | Home plates are **cropped, not fitted**. If the key image is a lockup a crop would cut, add `homeImage: "assets/…"` — a second image used only on the home page |
| Add images | Drop files in `assets/`, list the paths in `images: []`, then run `python3 optimize-images.py` (see below) |
| Add a film | Put the YouTube id in `video:` — e.g. `video: "h6yCiE3KP_I"` |
| Change contact, bio, taste | The `profile:` block at the top |
| Change the words in the moving headline | `profile.thesisLive` — two lists, `subjects` and `endings`. They are combined freely, so adding one word to either list adds a whole row of new readings. `everyMs` sets the beat |
| Add a job | The `career:` block |

### The Instagram grid

Curated by hand — nine images you choose, not the last nine you posted.

1. Drop the images into `assets/instagram/`. Square or near-square crops.
2. List them in the `instagram.posts` array in `content/data.js`, newest first.
3. Add a `link` per post if you want the tile to open that post; without one it opens your profile.
4. The section hides itself entirely while the list is empty, and any file that isn't there removes its own tile. Nothing breaks half-finished.

There is deliberately no live feed. Instagram's Basic Display API was retired in December 2024, and every remaining option needs either a server holding a refreshing token or a third-party script that would bring its own styling and tracking onto the one page arguing that you art direct.

### Credits are not optional

Every project has a `credits:` array. If someone else designed it, shot it, or wrote it, they go in there by name. The rule the whole site is built on: **never claim the design, always claim the direction.** It is both accurate and stronger.

### The TODO markers

Anything with `todo: true` shows a red flag on the site so you can see what still needs your input. When the site goes live, switch them off — change `data-todo="on"` to `data-todo="off"` in each `.html` file's `<body>` tag.

---

## Lenses

A lens is a tailored version for one application. Unlisted — it is linked from
nowhere, kept out of the sitemap and marked `noindex`, so nobody stumbles on it.

**Unlisted is not private.** While the GitHub repository is public, anyone who
browses it can read every lens in `data.js`. Don't write anything in a lens you
wouldn't want the wrong employer to read. Real privacy needs a private
repository (GitHub Pro, or a host such as Cloudflare Pages that publishes from
one for free).

Three exist already: `culture`, `design`, `corporate`.

```
for.html?lens=culture
```

To make a new one, copy a block in `lenses:` and list the project ids you want, in the order you want them.

**Write the `intro` by hand every time.** Two sentences, specific to that employer. A lens that reads as a filter destroys the thing it exists to build — it has to read as a deliberate edit.

---

## Metadata, favicon and sharing

The mark is an **M set in Shippori Mincho**, the site's own serif — a letterform, not a drawn logo, which is the only kind of mark the design system allows.

```
favicon.ico               16 / 32 / 48 / 64, for every browser and feed reader
assets/meta/icon.svg      the same M as a real outline — crisp at any size
assets/meta/icon-180.png  apple-touch-icon, for a home-screen bookmark
assets/meta/icon-192.png  ·  icon-512.png   for the web manifest
assets/meta/og.jpg        1200×630 — the card people see when the link is pasted.
                          Cropped from mitja_cropped.JPG (now in ../site-archive), with the crop
                          taken off the bottom so the head is never clipped.
assets/meta/og-typographic.jpg   the earlier name-and-thesis card, kept in case
site.webmanifest · robots.txt · sitemap.xml
```

Every page carries a title, description, canonical link, Open Graph and Twitter
card tags, a `theme-color`, and — on the home and profile pages — JSON-LD
`Person` markup so search engines read the role, the languages and the city.

**Before going live, set the domain.** Absolute URLs are unavoidable in Open
Graph tags — a crawler will not resolve a relative one — so they are written
out in full, with a placeholder until you have the real address:

```bash
./set-domain.sh https://your-domain.com
```

That rewrites the canonical links, every OG and Twitter tag, the sitemap,
robots.txt and the JSON-LD in one pass. Safe to run twice.

**A limit worth knowing.** Project pages are one file with a query string
(`project.html?p=tonemo`). The browser tab, bookmarks and Google all get the
project's own title, description and lead image, because they run the page's
JavaScript. Facebook, LinkedIn, Slack and WhatsApp do not — a shared project
link previews with the site card instead. That is correct, not broken. If you
ever want per-project previews, that is the one thing that needs a real host
with pre-rendering, rather than plain static files.

Lenses are `noindex, nofollow` and blocked in robots.txt. They stay unlisted.

---

## The moving headline

The line on the home page is live: the subject and the closing verb each change
every three seconds, drawn at random from the two lists in `profile.thesisLive`.
Ten subjects and ten endings make **100 readings** of the same claim.

Three things it does quietly:

- **It is set to the width of the paragraph below it** — the two share a left
  and a right edge at every screen size.
- **Its depth moves with the words, not in a jolt.** At that width most
  readings set to four lines and the shortest to three. The height for the
  words that are *about to arrive* is measured off-screen and moved to on a
  transition, underneath the cross-fade, so the line changes depth as quietly
  as it changes words — and no reading sits under a hole of reserved space.
  This is also why a very long ending is worth avoiding: one phrase far longer
  than the rest sets the line several lines deeper than everything else, and
  the whole page feels it.
- **It says one thing to a screen reader.** The heading carries `profile.thesis`
  as its accessible name, so assistive technology announces a single steady
  sentence instead of narrating every swap.
- **It settles.** It turns six times — about eighteen seconds — then returns
  to the reading it opened with and stays there. Text that never stops moving
  is hard on anyone reading the page around it. It also holds still while the
  pointer rests on it. `turns` in `profile.thesisLive` sets the count; `0`
  lets it run forever.
- **It stops when nobody is looking** — on a background tab, and for anyone who
  has asked their system for less motion.

---

## Images

Every image is served as a right-sized WebP: a phone gets a 640px file, a big
retina screen a 2560px one. `data.js` always names your original; the fast
copies live in `assets/opt/` and are listed in `content/images.js`.

**After adding or replacing an image, run:**

```bash
cd /Users/mitjagodnic/CV/site && python3 optimize-images.py
```

It only processes new or changed files. It needs Pillow once:
`pip3 install pillow`. If you forget to run it, nothing breaks — the new image
is simply served as it is, heavier, until the next run.

Quality is set high on purpose (90–95). Several images are film stills with
grain over soft backdrops, and lower settings smooth the grain away and leave
visible bands in the gradient.

---

## Private notes

Notes about missing credits, unconfirmed facts and files never to publish live
in **`CV/NOTES-private.md`**, outside this folder — so they are never uploaded.
Keep them there, not in `data.js`: everything in this folder is readable by
anyone, through the page source or on GitHub.

The renderer also refuses to show any field that still starts with `TODO`, so a
placeholder left in `data.js` leaves its section out rather than appearing on
the page.

---

## Where the record lives

There is no separate archive page. **The full record — around 130 organisations,
grouped by sector — is the last section of `work.html`**, below the selected work,
at `work.html#archive`.

Two pages made the second one easy to miss, and the split asked a visitor to
decide whether the archive was worth a click before they knew what was in it.
One page answers the real question in one scroll: here is what to look at, and
here is the scale behind it. The search field still filters the whole list.

`archive.html` remains as a redirect, so any link sent before the change still
lands in the right place. It is out of the sitemap and marked `noindex`.

---

## Files

```
site/
  index.html · work.html · project.html · profile.html · for.html
  archive.html         ← a redirect to work.html#archive, for links already sent
  content/data.js      ← the only file you edit
  css/site.css         ← design system
  js/app.js            ← renderer
  assets/              ← images
  assets/opt/          ← fast WebP copies, made by optimize-images.py
  assets/meta/         ← icons and the sharing card
  content/images.js    ← written by optimize-images.py; do not edit
  favicon.ico · site.webmanifest · robots.txt · sitemap.xml
  optimize-images.py   ← run after adding images
  set-domain.sh        ← run once, when you have a domain

Outside this folder, never published:
  ../NOTES-private.md  ← your private notes
  ../site-archive/     ← retired files and unused images, kept not deleted
  ../_backups/         ← dated archives of the site
```
