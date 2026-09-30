/* Renderer. Reads window.SITE from content/data.js. No dependencies, no build. */
(function () {
  "use strict";
  var S = window.SITE;
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var q = function (k) { return new URLSearchParams(location.search).get(k); };
  var visible = function () { return S.projects.filter(function (p) { return p.visible !== false; }); };
  var byId = function (id) { return S.projects.filter(function (p) { return p.id === id; })[0]; };
  var mount = function (id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; };
  // Placeholder text never reaches a visitor: an empty field, or one still
  // reading "TODO", is treated as absent and its section is left out.
  var real = function (t) { return !!t && !/^\s*TODO\b/.test(t); };

  /* Fast images. optimize-images.py writes WebP copies of each original at a
     few widths and lists them in content/images.js; the browser then picks the
     one that suits the screen. data.js always names the original, and an image
     with no copies yet is simply served as it is. width and height carry only
     the proportions, so the page does not jump while pictures arrive. */
  var IMAGES = window.IMAGES || {};
  function imgSrc(src, sizes) {
    var m = src && IMAGES[src];
    if (!m) return 'src="' + esc(src) + '"';
    var stem = "assets/opt/" + src.slice(7).replace(/\.[^.\/]+$/, "");
    var set = m.w.map(function (w) { return encodeURI(stem + "-" + w + ".webp") + " " + w + "w"; }).join(", ");
    var mid = m.w.filter(function (w) { return w <= 1280; }).pop() || m.w[0];
    return 'src="' + esc(encodeURI(stem + "-" + mid + ".webp")) + '" srcset="' + esc(set) +
      '" sizes="' + esc(sizes || "100vw") + '" width="1280" height="' + Math.round(1280 / m.r) + '"';
  }
  // where each kind of picture sits on the page, for the browser's choice of size
  var SZ = {
    plate: "(max-width: 760px) 100vw, 60vw",
    wide: "(max-width: 760px) 100vw, 92vw",
    photo: "(max-width: 760px) 50vw, 33vw",
    portrait: "(max-width: 900px) 100vw, 40vw"
  };

  // Plates hold photographs. Absent one, an honest mist field — no colour panel.
  var plateFig = function (src, alt, ratio, caption, credit, bg, contain, focus) {
    return '<figure><div class="plate' + (bg ? " field" : (contain ? " contain" : "")) + '" style="aspect-ratio:' + ratio +
      (bg ? ";background:" + esc(bg) : "") + '">' +
      (src ? '<img ' + imgSrc(src, SZ.plate) + ' alt="' + esc(alt || "") + '" loading="lazy"' +
        (focus ? ' style="object-position:' + esc(focus) + '"' : "") + ">" : "") + "</div>" +
      (caption ? '<figcaption class="cap">' + esc(caption) + "</figcaption>" : "") +
      (credit ? '<figcaption class="cred">' + esc(credit) + "</figcaption>" : "") + "</figure>";
  };

  /* ---------- photographs ---------- */
  function photoTile(item) {
    if (typeof item === "string") item = { src: item };
    var P = S.profile.photographs || {};
    var src = item.src || item.mediaUrl || item.media_url;
    var link = item.link || item.permalink;
    if (!src) return "";
    var img = '<img ' + imgSrc(src, SZ.photo) + ' alt="' + esc(String(item.alt || "").slice(0, 120)) + '" loading="lazy">';
    return link
      ? '<a class="photo" href="' + esc(link) + '" rel="noopener" target="_blank">' + img + "</a>"
      : '<span class="photo">' + img + "</span>";
  }

  function photographs() {
    var P = S.profile.photographs;
    if (!P || !(P.posts || []).length) return "";
    // every other section on the page sits in the shell; this one was escaping it
    return '<section class="band shell"><h2>' + esc(P.title || "Photographs") + "</h2>" +
      (P.note ? '<p class="small" style="margin:calc(var(--space-6) * -1) 0 var(--space-6)">' + esc(P.note) + "</p>" : "") +
      '<div class="photo-grid" id="photo-grid">' +
      (P.posts || []).slice(0, P.limit || 9).map(photoTile).join("") + "</div>" +
      "</section>";
  }

  /* ---------- contact dialog ---------- */
  function contactDialog() {
    var c = S.profile.contact;
    return '<dialog id="contact-dialog" aria-labelledby="contact-title">' +
      '<form method="dialog" class="cdialog" novalidate>' +
      '<div class="chead">' +
      '<h2 id="contact-title">Get in touch</h2>' +
      '<button type="button" class="cclose" value="cancel">Close</button>' +
      "</div>" +
      '<p class="csub">Or write directly to <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>.</p>" +
      '<div class="cfields">' +
      '<label class="cfield"><span>Your name</span>' +
      '<input name="name" type="text" autocomplete="name" required></label>' +
      '<label class="cfield"><span>Email</span>' +
      '<input name="email" type="email" autocomplete="email" required></label>' +
      '<label class="cfield"><span>Message</span>' +
      '<textarea name="message" rows="4" required></textarea></label>' +
      "</div>" +
      '<div class="chp" aria-hidden="true"><label>Company' +
      '<input name="company" type="text" tabindex="-1" autocomplete="off"></label></div>' +
      '<label class="cconsent"><input name="consent" type="checkbox" required>' +
      "<span>" + esc(c.consent ||
        "Your name and email are used to know who wrote and to reply. Nothing else, and they are not passed on.") +
      "</span></label>" +
      '<p class="cerror" hidden></p>' +
      '<div class="cactions"><button type="submit" class="csend">Send</button></div>' +
      "</form>" +
      '<div class="cdone" hidden><h2>Thank you.</h2>' +
      '<p>Your mail client should have opened with the message ready to send. ' +
      'If it did not, write to <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>.</p>" +
      '<button type="button" class="cclose">Close</button></div>' +
      "</dialog>";
  }

  function wireContact() {
    var dlg = document.getElementById("contact-dialog");
    if (!dlg) return;
    var form = dlg.querySelector("form");
    var err = dlg.querySelector(".cerror");
    var done = dlg.querySelector(".cdone");
    var c = S.profile.contact;

    function open(e) {
      if (e) e.preventDefault();
      err.hidden = true; done.hidden = true; form.hidden = false;
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
      var first = form.querySelector("input");
      if (first) setTimeout(function () { first.focus(); }, 60);
    }
    function close() { form.reset(); if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }

    function showDone(how) {
      var sent = how === "sent";
      done.querySelector("h2").textContent = sent ? "Sent." : "Thank you.";
      done.querySelector("p").innerHTML = sent
        ? "It is in my inbox. I will come back to you at that address."
        : "Your mail client should have opened with the message ready to send. " +
          'If it did not, write to <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>.";
      form.hidden = true; done.hidden = false;
    }

    document.querySelectorAll('a[href="#contact"]').forEach(function (a) {
      a.addEventListener("click", open);
    });
    dlg.querySelectorAll(".cclose").forEach(function (b) { b.addEventListener("click", close); });
    // clicking the veil closes it
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get("name") || "").trim();
      var email = (d.get("email") || "").trim();
      var message = (d.get("message") || "").trim();
      var consent = !!d.get("consent");

      var problem = !name ? "A name would help."
        : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "That email address does not look right."
        : !message ? "The message is empty."
        : !consent ? "Tick the box and the message can go."
        : null;
      if (problem) { err.textContent = problem; err.hidden = false; return; }
      err.hidden = true;

      // A bot filled the field no human can see: pretend it went, send nothing.
      if ((d.get("company") || "").trim()) { showDone("sent"); return; }

      if (c.formEndpoint) {
        var payload = {};
        // whatever the provider needs of its own — an access key, a redirect
        Object.keys(c.formFields || {}).forEach(function (k) { payload[k] = c.formFields[k]; });
        payload.name = name;
        payload.email = email;
        payload.message = message;
        // the subject line, and Reply going straight back to the sender
        payload.subject = "Portfolio — message from " + name;
        payload.replyto = email;

        var btn = form.querySelector(".csend");
        var restore = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

        fetch(c.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(function (r) {
          return r.json().catch(function () { return { ok: r.ok }; });
        }).then(function (body) {
          var failed = !body || body.ok === false || body.success === false ||
                       body.success === "false";
          if (failed) throw new Error((body && body.message) || "The service refused the message.");
          showDone("sent");
        }).catch(function (e) {
          // It did not send. Say so plainly, leave everything they wrote in
          // the form so they can try again, and never push them out to a mail
          // program. The service's own reason goes to the console for the
          // owner — e.g. that the address still needs activating.
          if (window.console) console.warn("Contact form not delivered:", e && e.message);
          if (btn) { btn.disabled = false; btn.textContent = restore; }
          err.innerHTML = "That didn’t go through. Please try again in a moment, or write to " +
            '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>.";
          err.hidden = false;
        });
        return;
      }

      openMailClient();
      showDone("mail");

      function openMailClient() {
        var body = message + "\n\n—\n" + name + "\n" + email;
        window.location.href = "mailto:" + c.email +
          "?subject=" + encodeURIComponent("Portfolio — message from " + name) +
          "&body=" + encodeURIComponent(body);
      }
    });
  }

  // Search engines cut descriptions around 155 characters. Cut on a word.
  var clamp = function (t, n) {
    t = String(t).replace(/\s+/g, " ").trim();
    if (t.length <= n) return t;
    var cut = t.slice(0, n - 1);
    return cut.slice(0, Math.max(cut.lastIndexOf(" "), 0)).replace(/[\s,;:—-]+$/, "") + "…";
  };

  /* ---------- per-page metadata ----------
     The static <head> carries the defaults every crawler reads. Query-string
     pages (a project, a lens) refine them here, so the tab, the bookmark and
     any crawler that runs JS get the specific page rather than the default.
     Social crawlers do not run JS — a shared project link still previews with
     the site card, which is correct rather than wrong. */
  function meta(o) {
    var abs = function (u) {
      if (!u) return null;
      if (/^https?:/.test(u)) return u;
      return location.origin === "null" ? u : location.origin +
        location.pathname.replace(/[^/]*$/, "") + u;
    };
    var set = function (sel, attr, val) {
      if (!val) return;
      var el = document.head.querySelector(sel);
      if (el) el.setAttribute(attr, val);
    };
    if (o.title) document.title = o.title;
    set('meta[name="description"]', "content", o.description);
    set('link[rel="canonical"]', "href", o.url);
    set('meta[property="og:title"]', "content", o.title);
    set('meta[property="og:description"]', "content", o.description);
    set('meta[property="og:url"]', "content", o.url);
    set('meta[name="twitter:title"]', "content", o.title);
    set('meta[name="twitter:description"]', "content", o.description);
    var img = abs(o.image);
    if (img) {
      set('meta[property="og:image"]', "content", img);
      set('meta[name="twitter:image"]', "content", img);
      set('meta[property="og:image:alt"]', "content", o.imageAlt || o.title);
      set('meta[name="twitter:image:alt"]', "content", o.imageAlt || o.title);
      ["og:image:width", "og:image:height", "og:image:type"].forEach(function (k) {
        var el = document.head.querySelector('meta[property="' + k + '"]');
        if (el) el.remove();          // dimensions of the default card, not this one
      });
    }
    if (o.robots) set('meta[name="robots"]', "content", o.robots);
  }

  /* ---------- chrome ---------- */
  function nav(active) {
    var items = [["work.html", "Work"], ["video.html", "Video"], ["profile.html", "Profile"], ["#contact", "Contact"]];
    return '<nav class="nav shell" aria-label="Primary">' +
      '<a class="id" href="index.html">' + esc(S.profile.name) + '<span>' + esc(S.profile.role) + '</span></a><ul>' +
      items.map(function (i) {
        var cur = i[0] === active ? ' aria-current="page"' : "";
        return '<li><a href="' + i[0] + '"' + cur + '>' + i[1] + "</a></li>";
      }).join("") + "</ul></nav>";
  }

  function footer() {
    var c = S.profile.contact;
    return '<footer><div class="shell fgrid">' +
      '<span style="font-family:var(--font-serif);font-weight:var(--weight-medium);font-size:var(--fs-18)">' +
      esc(S.profile.name) + "</span>" +
      '<div class="fcol">' +
      '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>" +
      (c.linkedin ? '<a href="' + esc(c.linkedin) + '" rel="noopener">LinkedIn</a>' : "") +
      (c.instagram ? '<a href="' + esc(c.instagram) + '" rel="noopener">Instagram</a>' : "") +
      '<span class="v">' + esc(c.note) + "</span></div>" +
      "</div></footer>";
  }

  // Home plates are cropped, so a project may nominate a different image for the
  // home page — a key image composed to be fitted rarely survives a crop.
  function plate(p, i) {
    var ratio = [ "3 / 2", "4 / 5", "4 / 5", "3 / 2" ][i % 4] || "3 / 2";
    var src = p.homeImage || ((p.images && p.images.length) ? p.images[0] : null);
    return '<a href="project.html?p=' + encodeURIComponent(p.id) + '" class="rise">' +
      plateFig(src, p.title, ratio, p.title + (p.year ? ", " + p.year : ""), p.clientEn || p.client,
        p.plateBg, p.fit === "contain", p.homeFocus) + "</a>";
  }

  /* ---------- the living thesis ----------
     Two words in the opening line change every few seconds. The heading keeps
     a fixed accessible name, so assistive technology reads one stable sentence
     rather than narrating every swap, and the still version is what ships in
     the HTML for anything that never runs this file. */
  function thesisHTML(pr) {
    var T = pr.thesisLive;
    if (!T) return '<h1 class="lede">' + esc(pr.thesis) + "</h1>";
    return '<h1 class="lede thesis-live" aria-label="' + esc(pr.thesis) + '">' +
      esc(T.opening) +
      '<span class="swap" data-slot="subject">' + esc(T.subjects[0]) + "</span>" +
      esc(T.middle) +
      '<span class="swap" data-slot="ending">' + esc(T.endings[0]) + "</span>" +
      esc(T.closing) + "</h1>";
  }

  function wireThesis() {
    var h = document.querySelector(".thesis-live");
    if (!h) return;
    var T = S.profile.thesisLive;
    var sub = h.querySelector('[data-slot="subject"]');
    var end = h.querySelector('[data-slot="ending"]');
    if (!sub || !end) return;

    // Asked for less motion: the line stays as it was set, at its natural height.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var at = { subject: 0, ending: 0 };

    /* The line is set to the width of the paragraph below it, so its depth
       depends on the words in it: ten of the eleven endings set to three or
       four lines, and "take it across the finish line" sets to six. Holding
       the tallest would leave two empty lines under most readings; letting the
       box snap would throw the page around. So the height is measured for the
       words that are about to arrive and moved to on a transition, under the
       cross-fade — the line changes depth as quietly as it changes words. */
    // The measuring copy is a plain div set in the headline's own type — not
    // a clone, which would put a second <h1> on the page.
    var probe = document.createElement("div");
    probe.innerHTML = h.innerHTML;
    probe.setAttribute("aria-hidden", "true");
    var cs = getComputedStyle(h);
    ["fontFamily", "fontSize", "fontWeight", "fontStyle", "fontStretch", "fontFeatureSettings",
     "fontKerning", "lineHeight", "letterSpacing", "wordSpacing", "textTransform", "textWrap",
     "textWrapMode", "textWrapStyle", "hyphens"].forEach(function (k) { if (cs[k]) probe.style[k] = cs[k]; });
    probe.style.position = "absolute"; probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none"; probe.style.left = "0"; probe.style.top = "0";
    probe.style.margin = "0"; probe.style.padding = "0";
    [].forEach.call(probe.querySelectorAll(".swap"), function (e) { e.style.display = "inline-block"; });
    h.parentNode.appendChild(probe);
    var pSub = probe.querySelector('[data-slot="subject"]');
    var pEnd = probe.querySelector('[data-slot="ending"]');

    function heightOf(subjectIndex, endingIndex) {
      probe.style.width = h.getBoundingClientRect().width + "px";
      pSub.textContent = T.subjects[subjectIndex];
      pEnd.textContent = T.endings[endingIndex];
      return Math.ceil(probe.getBoundingClientRect().height);
    }
    function fit() { h.style.minHeight = heightOf(at.subject, at.ending) + "px"; }
    fit();

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt); rt = setTimeout(fit, 180);
    });

    var FADE = 340, STAGGER = 260;
    function pick(n, current) {
      var i = current;
      while (n > 1 && i === current) i = Math.floor(Math.random() * n);
      return i;
    }
    function advance() {
      var next = {
        subject: pick(T.subjects.length, at.subject),
        ending: pick(T.endings.length, at.ending)
      };
      // move to the depth the new words need while the old ones are fading out
      h.style.minHeight = heightOf(next.subject, next.ending) + "px";
      swap(sub, T.subjects[next.subject], 0);
      swap(end, T.endings[next.ending], STAGGER);   // the eye reads left to right
      at = next;
    }
    function swap(el, word, delay) {
      setTimeout(function () {
        el.classList.add("out");
        setTimeout(function () {
          el.textContent = word;
          el.classList.remove("out");
        }, FADE);
      }, delay);
    }

    /* It turns a set number of times and then settles, on the line it opened
       with. Moving text that never stops is hard on anyone trying to read the
       page around it; a few turns make the point. It also holds still while
       the pointer rests on it. turns: 0 in data.js lets it run forever. */
    var turnsLeft = T.turns === 0 ? Infinity : (T.turns || 6);
    var done = false;
    var inner = advance;
    advance = function () {
      turnsLeft -= 1;
      if (turnsLeft <= 0) {
        // the last turn goes home to the opening reading, then stops for good
        h.style.minHeight = heightOf(0, 0) + "px";
        if (at.subject !== 0) swap(sub, T.subjects[0], 0);
        if (at.ending !== 0) swap(end, T.endings[0], STAGGER);
        at = { subject: 0, ending: 0 };
        done = true; stop();
        return;
      }
      inner();
    };

    var timer;
    function start() {
      stop();
      if (done || document.hidden) return;   // finished, or a background tab
      timer = setInterval(advance, T.everyMs || 3000);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });
    h.addEventListener("mouseenter", stop);
    h.addEventListener("mouseleave", start);
    start();
  }

  /* ---------- film facade ----------
     A film shows a still until someone asks for it. YouTube publishes a poster
     at a predictable address; Vimeo's is behind a hashed URL, so those frames
     are saved into assets/ and named in the data. Either way the page holds a
     real frame rather than an empty black box, loads no third-party player
     until it is wanted, and works from disk, where neither service will
     configure a player on an origin-less page. */
  function filmFacade(v, fallbackTitle) {
    var vimeo = v.provider === "vimeo";
    var name = v.title || fallbackTitle || "Film";
    var watch = vimeo ? "https://vimeo.com/" + encodeURIComponent(v.id)
                      : "https://www.youtube.com/watch?v=" + encodeURIComponent(v.id);
    var poster = v.poster || (vimeo ? "" : "https://i.ytimg.com/vi/" + v.id + "/maxresdefault.jpg");
    var still = poster
      ? '<img ' + imgSrc(poster, SZ.wide) + ' alt="' + esc(name) + '" loading="lazy">' : "";

    if (location.protocol === "file:") {
      return '<a class="embed facade" href="' + esc(watch) + '" rel="noopener" target="_blank">' +
        still + '<span class="playbtn">Watch on ' + (vimeo ? "Vimeo" : "YouTube") + "</span></a>";
    }
    return '<div class="embed facade" data-provider="' + (vimeo ? "vimeo" : "youtube") +
      '" data-id="' + esc(v.id) + '" data-title="' + esc(name) + '">' + still +
      '<button class="playbtn" type="button" aria-label="Play: ' + esc(name) + '">Play</button></div>';
  }

  /* ---------- radio ----------
     A live stream, so there is nothing to scrub and no length to show: the
     whole control is one word that changes state. The audio element is not
     built until the control is pressed, so the page makes no request to NTS
     unless it is asked to. */
  function radioLine(pr) {
    var R = pr.radio;
    if (!R || !R.url) return "";
    return '<p class="radio"><span class="radio-q">' + esc(R.question || "") + "</span>" +
      '<button class="radio-btn u" type="button" data-state="idle">' +
      "Play " + esc(R.station || "the stream") + "</button>" +
      '<span class="radio-now" hidden></span></p>';
  }

  function wireRadio() {
    var btn = document.querySelector(".radio-btn");
    if (!btn) return;
    var R = S.profile.radio;
    var audio = null;
    var station = R.station || "the stream";

    function label(state) {
      btn.dataset.state = state;
      btn.textContent =
        state === "connecting" ? "Connecting…" :
        state === "playing" ? "Pause " + station :
        state === "error" ? station + " is not answering" :
        "Play " + station;
    }

    /* What is actually on air, read straight from NTS. It is one small public
       request and it fails quietly: if it does not answer, the line never
       appears and the control behaves exactly as before. Show titles are other
       people's words, so they go in as text, never as markup. */
    var nowEl = document.querySelector(".radio-now");
    function loadListing() {
      if (!R.apiUrl || !nowEl) return;
      fetch(R.apiUrl).then(function (r) {
        if (!r.ok) throw new Error();
        return r.json();
      }).then(function (d) {
        var ch = (d.results || []).filter(function (c) {
          return String(c.channel_name) === String(R.channel || "1");
        })[0];
        var on = ch && ch.now;
        if (!on) return;
        var det = (on.embeds && on.embeds.details) || {};
        var show = det.name || on.broadcast_title;
        if (!show) return;
        // show and place on their own lines: a mid-dot at the end of a wrapped
        // line reads as a mistake, and show titles are long more often than not
        nowEl.textContent = "";
        var a = document.createElement("span");
        a.className = "radio-show";
        a.textContent = show;
        nowEl.appendChild(a);
        if (det.location_long) {
          var b = document.createElement("span");
          b.className = "radio-loc";
          b.textContent = det.location_long;
          nowEl.appendChild(b);
        }
        nowEl.hidden = false;
        // look again when this show ends, and not more than once an hour
        var ends = Date.parse(on.end_timestamp);
        if (ends) setTimeout(loadListing,
          Math.min(Math.max(ends - Date.now() + 5000, 60000), 3600000));
      }).catch(function () { /* no listing, no line */ });
    }
    loadListing();

    btn.addEventListener("click", function () {
      if (audio && !audio.paused) { audio.pause(); label("idle"); return; }

      if (!audio) {
        audio = new Audio();
        audio.preload = "none";
        audio.addEventListener("playing", function () { label("playing"); });
        audio.addEventListener("waiting", function () { label("connecting"); });
        audio.addEventListener("error", function () { label("error"); audio = null; });
        audio.addEventListener("stalled", function () { label("error"); });
      }
      label("connecting");
      // a live stream has no position to resume from: ask for it fresh each time
      audio.src = R.url + (R.url.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now();
      var p = audio.play();
      if (p && p.catch) p.catch(function () { label("error"); });
    });
  }

  /* ---------- home ---------- */
  function careerBrief(n) {
    var endOf = function (c) { return parseInt(c.to, 10) || parseInt(c.from, 10) || 0; };
    return S.career.slice().sort(function (a, b) {
      return endOf(b) - endOf(a) || (parseInt(b.from, 10) || 0) - (parseInt(a.from, 10) || 0);
    }).slice(0, n).map(function (c) {
      var span = (c.from || "") + (c.to ? "–" + c.to : "");
      return '<li><span class="yr">' + esc(span || "—") + "</span><div>" +
        '<span class="org">' + esc(c.org) + "</span> " +
        '<span class="rl">' + esc(c.role) + "</span></div></li>";
    }).join("");
  }

  function home() {
    var pr = S.profile, H = pr.home || {};
    var feat = visible().filter(function (p) { return p.home; }).slice(0, 4);
    if (feat.length < 4) feat = feat.concat(visible().filter(function (p) { return !p.home; })).slice(0, 4);
    var recent = visible().slice().sort(function (a, b) {
      return (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
    }).slice(0, 5);

    var aside = '<div class="aside">' +
      "<span>" + esc(pr.role) + "</span>" +
      "<span>" + esc(pr.contact.note) + "</span>" +
      '<span class="gap">' + esc((H.capabilities || []).map(function (c) { return c.title; }).join(", ")) +
      " — brand systems, campaigns, film, production</span></div>";

    return nav("index.html") + '<main id="main" class="shell">' +
      '<header class="hero">' + thesisHTML(pr) + 
      '<div class="intro"><div><p>' + esc(H.statement || "") + "</p>" +
      "<p>" + esc(pr.now) + "</p></div>" + aside + "</div>" +
      radioLine(pr) + "</header>" +

      '<section class="band"><h2>Selected work</h2>' +
      '<div class="worklist">' + recent.map(workEntry).join("") + "</div></section>" +

      '<section class="band"><div class="figures">' +
      feat.map(function (p, i) { return plate(p, i); }).join("") + "</div></section>" +

      '<section class="band"><h2>Practice</h2><ul class="tl brief">' + careerBrief(4) + "</ul>" +
      '<span class="go-wrap"><a class="go" href="profile.html">Full profile</a></span></section>' +

      ((H.clients || []).length ? '<section class="band"><h2>Selected clients</h2>' +
        '<div class="clientline">' + H.clients.map(function (c) { return "<span>" + esc(c) + "</span>"; }).join("") + "</div>" +
        '<span class="go-wrap"><a class="go" href="work.html#archive">The full record</a></span></section>' : "") +

      "</main>" + footer();
  }

  /* ---------- work ---------- */
  function facets(list) {
    var set = {};
    list.forEach(function (p) { (p.sectors || []).forEach(function (s) { set[s] = 1; }); });
    return Object.keys(set).sort();
  }

  function workEntry(p) {
    return '<a class="wentry rise" data-sectors="' + esc((p.sectors || []).join(" ")) +
      '" href="project.html?p=' + encodeURIComponent(p.id) + '">' +
      '<span class="wt"><span class="u">' + esc(p.title) + "</span></span>" +
      '<span class="wd">' + esc(p.premise || "") + "</span>" +
      '<span class="wy">' + esc(p.years || p.year || "") + "</span></a>";
  }

  function work() {
    var list = visible().slice().sort(function (a, b) {
      return (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
    });
    var fs = facets(list);
    return nav("work.html") + '<main id="main" class="shell">' +
      '<section class="band" style="margin-top:clamp(72px,11vh,132px)"><h1 class="pagehead">Selected work</h1>' +
      '<div class="filters" role="group" aria-label="Filter by sector">' +
      '<button aria-pressed="true" data-f="all">All</button>' +
      fs.map(function (f) { return '<button aria-pressed="false" data-f="' + esc(f) + '">' + esc(f) + "</button>"; }).join("") +
      "</div>" +
      '<div class="worklist" id="worklist">' + list.map(workEntry).join("") + "</div>" +
      "</section>" + record() + "</main>" + footer();
  }

  /* ---------- the record ----------
     Everything the selection leaves out, at the foot of the same page. The
     selection is what to look at; this is proof of scale. Separating them onto
     two pages only made the second one easy to miss. */
  function record() {
    return '<section class="band record" id="archive">' +
      "<h2>The full record</h2>" +
      '<p class="lede">' + esc(S.archive.note) + "</p>" +
      '<p class="serif-note">Listed as clients of the studio, or as ventures of my own. ' +
      "Individual project credits vary; the selected work is above.</p>" +
      '<div class="filters" style="padding-top:14px"><input id="asearch" type="search" ' +
      'aria-label="Search the record" placeholder="Search clients" ' +
      'style="font-family:var(--font-sans);font-size:var(--fs-15);background:none;border:0;' +
      'border-bottom:1px solid var(--text-tertiary);color:var(--text-primary);padding:7px 2px;min-width:260px"></div>' +
      '<div id="agroups">' + S.archive.groups.map(function (g) {
        return '<div class="agroup"><h3>' + esc(g.name) + '</h3><div class="alist">' +
          g.items.map(function (i) { return "<span>" + esc(i) + "</span>"; }).join("") + "</div></div>";
      }).join("") + "</div></section>";
  }

  function writeup(p) {
    var parts = [];
    if (real(p.context)) parts.push(["Context", "<p>" + esc(p.context) + "</p>"]);
    var steps = (p.approach || []).filter(real);
    if (steps.length) parts.push(["Approach", steps.map(function (a) { return "<p>" + esc(a) + "</p>"; }).join("")]);
    return parts.map(function (x, i) {
      return '<section class="band"' + (i === 0 ? ' style="padding-top:clamp(30px,5vw,52px)"' : "") +
        '><div class="cols"><p class="eyebrow">' + x[0] + "</p><div>" + x[1] + "</div></div></section>";
    }).join("");
  }

  /* ---------- dossier ---------- */
  function project() {
    var p = byId(q("p")) || visible()[0];
    if (!p) return nav("work.html") + '<main class="shell band"><h2>Not found</h2></main>' + footer();
    meta({
      title: p.title + " — " + S.profile.name,
      description: p.premise || (p.role + ", " + p.client + ", " + p.year + "."),
      url: location.href.split("#")[0],
      image: ((p.images && p.images[0]) || p.homeImage || null),
      imageAlt: p.title + (p.client && p.title.indexOf(p.client) < 0 ? ", " + p.client : "")
    });

    // A series of films: stacked embeds, each captioned with what it is.
    var films = (p.videos || []).map(function (v) {
      return '<figure class="filmfig">' + filmFacade(v, p.title) +
        (v.title ? '<figcaption class="cap">' + esc(v.title) + "</figcaption>" : "") + "</figure>";
    }).join("");

    var loopFilm = films ? '<div class="filmseries">' + films + "</div>" : "";

    var film = p.video
      ? '<div class="embed facade" data-yt="' + esc(p.video) + '" data-title="' + esc(p.title) + '">' +
        '<img ' + imgSrc(p.poster || (p.images && p.images[0]) ||
          ("https://i.ytimg.com/vi/" + p.video + "/maxresdefault.jpg"), SZ.wide) + ' alt="" loading="lazy">' +
        '<button class="playbtn" type="button" aria-label="Play film: ' + esc(p.title) + '">' +
        'Play film</button></div>' : "";

    var hero = loopFilm ? loopFilm
      : (p.images && p.images.length)
      ? '<div class="plateFull' + (p.plateBg ? " field" : (p.fit === "contain" ? " contain" : "")) + '"' +
        (p.plateBg ? ' style="background:' + esc(p.plateBg) + '"' : "") + '><img ' +
        imgSrc(p.images[0], SZ.wide) + ' alt="' + esc(p.title) + '" fetchpriority="high"></div>'
      : (film || '<div class="plateFull" style="aspect-ratio:3/2"></div>');

    var rest = (p.images || []).slice(loopFilm ? 0 : 1);
    var gal = rest.length
      ? '<div class="gallery">' + rest.map(function (src) {
          return '<figure><img ' + imgSrc(src, rest.length === 1 ? SZ.wide : SZ.plate) +
            ' alt="' + esc(p.title) + '" loading="lazy"></figure>';
        }).join("") + "</div>" : "";
    if (p.images && p.images.length && film) gal = film + gal;

    var credits = (p.credits || []).length
      ? '<div class="credits"><dl>' + p.credits.map(function (c) {
          return "<dt>" + esc(c[0]) + "</dt><dd>" + esc(c[1]) + "</dd>";
        }).join("") + "</dl></div>" : "";

    var outs = (p.outcome || []).filter(real);
    var outcome = outs.length
      ? '<section class="band shell"><div class="cols"><p class="eyebrow">Outcome</p><div><ul class="facts">' +
        outs.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul></div></div></section>" : "";

    var links = (p.links || []).length
      ? '<p style="margin-top:18px">' + p.links.map(function (l) {
          return '<a class="go" style="margin-right:18px" href="' + esc(l[1]) + '" rel="noopener">' + esc(l[0]) + "</a>";
        }).join("") + "</p>" : "";

    return nav("work.html") + '<main id="main"><article class="dossier shell">' +
      '<div class="dhead"><div>' +
      '<p class="eyebrow">' + esc(p.category) + "</p>" +
      '<h1 class="display" style="font-size:clamp(2rem,5vw,4.5rem);margin:var(--space-3) 0 var(--space-5)">' + esc(p.title) + "</h1>" +
      '<p class="premise">' + esc(p.premise) + "</p></div>" +
      '<div class="dmeta"><dl>' +
      "<dt>Client</dt><dd>" + esc(p.clientEn || p.client) + "</dd>" +
      (p.titleOriginal ? "<dt>Known as</dt><dd>" + esc(p.titleOriginal) + "</dd>" : "") +
      (p.years || p.year ? "<dt>Year</dt><dd>" + esc(p.years || p.year) + "</dd>" : "") +
      "<dt>My role</dt><dd>" + esc(p.role) + "</dd>" +
      (p.roleDetail ? "<dt></dt><dd style='color:var(--muted)'>" + esc(p.roleDetail) + "</dd>" : "") +
      "</dl>" + credits + links + "</div></div>" +
      hero +
      writeup(p) +
      (gal ? '<section class="band"><div class="cols"><p class="eyebrow">Material</p><div>' + gal + "</div></div></section>" : "") +
      outcome +
      "</article></main>" + footer();
  }

  /* ---------- video production ---------- */
  function videoPage() {
    var V = S.video || {};
    var films = (V.films || []).filter(function (f) { return f.visible !== false; });
    var todo = document.body.dataset.todo === "on";

    var list = films.map(function (f) {
      var meta = [f.client, f.year, f.duration].filter(Boolean).join(" · ");
      var missing = /^TODO/.test(f.description || "");
      return '<article class="vfilm rise">' + filmFacade(f, f.title) +
        '<div class="vmeta"><div>' +
        '<h2 class="vtitle">' + esc(f.title) + "</h2>" +
        (f.titleOriginal ? '<p class="vorig">' + esc(f.titleOriginal) + "</p>" : "") +
        '<p class="vclient">' + esc(meta) + "</p></div>" +
        '<div><p class="vdesc' + (missing ? " todo-row" : "") + '">' +
        (missing && todo ? '<span class="todo">needs your line</span> ' : "") +
        esc(f.description || "") + "</p></div>" +
        "</div></article>";
    }).join("");

    return nav("video.html") + '<main id="main" class="shell">' +
      '<header class="hero"><h1 class="lede">' + esc(V.title || "Video Production") + "</h1>" +
      (V.intro ? '<p class="lede vintro">' + esc(V.intro) + "</p>" : "") + "</header>" +
      '<section class="band vlist">' + list + "</section>" +
      (V.note && todo ? '<p class="small todo-row" style="margin-top:var(--space-8)">' +
        '<span class="todo">still needed</span> ' + esc(V.note) + "</p>" : "") +
      "</main>" + footer();
  }

  /* ---------- profile ---------- */
  function profile() {
    var pr = S.profile;
    var endOf = function (c) { return parseInt(c.to, 10) || parseInt(c.from, 10) || 0; };
    var tl = S.career.slice().sort(function (a, b) {
      return endOf(b) - endOf(a) || (parseInt(b.from, 10) || 0) - (parseInt(a.from, 10) || 0);
    }).map(function (c) {
      var span = (c.from || "") + (c.to ? "–" + c.to : (c.from ? "" : ""));
      return '<li class="' + (c.todo ? "todo-row" : "") + '"><span class="yr">' + esc(span || "—") + "</span><div>" +
        '<div class="org">' + esc(c.org) + (c.todo ? '<span class="todo">needs dates</span>' : "") + "</div>" +
        '<div class="rl">' + esc(c.role) + (c.place ? " · " + esc(c.place) : "") + "</div>" +
        (c.note ? '<div class="nt">' + esc(c.note) + "</div>" : "") + "</div></li>";
    }).join("");

    return nav("profile.html") + '<main id="main">' +
      '<header class="band shell" style="border:0;padding-top:clamp(40px,7vw,84px)"><div class="dhead">' +
      "<div><p class='eyebrow'>Profile</p>" +
      '<h1 class="display" style="font-size:clamp(2rem,4.6vw,4rem);margin:var(--space-3) 0 var(--space-5)">' + esc(pr.name) + "</h1>" +
      pr.intro.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
      '<div class="portrait"><img ' + imgSrc(pr.portrait, SZ.portrait) + ' alt="Portrait of ' + esc(pr.name) + '"></div>' +
      "</div></header>" +

      '<section class="band shell"><div class="cols"><p class="eyebrow">Where I\'m from</p><div>' +
      pr.origin.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div></div></section>" +

      '<section class="band shell"><div class="cols"><p class="eyebrow">How I work</p><div>' +
      "<p><strong>Fast at.</strong> " + esc(pr.method.fast) + "</p>" +
      "<p><strong>No patience for.</strong> " + esc(pr.method.slow) + " What I want instead: " + esc(pr.method.wants).toLowerCase() + "</p>" +
      "<p><strong>The best part.</strong> " + esc(pr.method.best) + "</p>" +
      "<p><strong>Leading.</strong> " + esc(pr.leading) + "</p></div></div></section>" +

      '<section class="band shell"><div class="cols"><p class="eyebrow">Looking at</p><div><ul class="plain">' +
      pr.taste.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div></div></section>" +

      ((S.writing) ?
        '<section class="band shell"><div class="cols"><p class="eyebrow">Writing</p><div>' +
        '<p class="lede" style="margin-bottom:10px">' + esc(S.writing.years) + '</p>' +
        '<p>' + esc(S.writing.note) + '</p>' +
        ((S.writing.outlets || []).length ? '<div class="clientline">' +
          S.writing.outlets.map(function (o) { return "<span>" + esc(o) + "</span>"; }).join("") + "</div>" : "") +
        (S.writing.todo ? '<p class="todo-row" style="margin-top:10px"><span class="todo">needs detail</span> ' +
          esc(S.writing.todoNote || "") + "</p>" : "") +
        "</div></div></section>" : "") +
      '<section class="band shell"><div class="cols"><p class="eyebrow">Career</p><div><ul class="tl">' + tl + "</ul>" +
      '<h3 style="margin-top:34px">Education</h3><ul class="tl">' +
      S.education.map(function (e) {
        return '<li class="' + (e.todo ? "todo-row" : "") + '"><span class="yr">' + esc(e.year || "—") + "</span><div>" +
          '<div class="org">' + esc(e.org) + "</div><div class=\"rl\">" + esc(e.award) + "</div>" +
          (e.note ? '<div class="nt">' + esc(e.note) + "</div>" : "") + "</div></li>";
      }).join("") + "</ul>" +
      ((S.recognition || []).length ?
        '<h3 style="margin-top:34px">Recognition</h3><ul class="tl">' +
        S.recognition.map(function (r) {
          return '<li class="' + (r.todo ? "todo-row" : "") + '"><span class="yr">' + esc(r.year || "—") + "</span><div>" +
            '<div class="org">' + esc(r.what) + (r.todo ? '<span class="todo">needs detail</span>' : "") + "</div>" +
            (r.forWhat ? '<div class="rl">' + esc(r.forWhat) + "</div>" : "") + "</div></li>";
        }).join("") + "</ul>" : "") +
      '<h3 style="margin-top:34px">Languages</h3><p>' +
      pr.languages.map(function (l) { return esc(l.name) + " — " + esc(l.level); }).join(" · ") + "</p>" +
      "</div></div></section>" +
      photographs() +
      "</main>" + footer();
  }

  /* ---------- lens ---------- */
  function lens() {
    var id = q("lens");
    var L = (S.lenses || []).filter(function (l) { return l.id === id; })[0];
    // a mistyped or retired link: point home, and do not advertise the mechanism
    if (!L) return nav("") + '<main id="main" class="shell"><header class="hero">' +
      '<h1 class="lede">Nothing here.</h1><p class="lede lensintro">' +
      'The portfolio is at <a href="index.html">' + esc(location.host || "the home page") + "</a>.</p>" +
      "</header></main>" + footer();
    meta({
      title: S.profile.name + " — " + L.label,
      description: L.intro ? clamp(L.intro, 155) : null,
      url: location.href.split("#")[0],
      robots: "noindex, nofollow"      // a lens is sent to one employer, never published
    });
    var picks = L.projects.map(byId).filter(Boolean);
    return nav("") + '<main id="main" class="shell">' +
      '<header class="hero lenshead">' +
      '<h1 class="display" style="font-size:clamp(34px,6vw,72px)">' + esc(S.profile.name) + "</h1>" +
      '<p class="role">' + esc(S.profile.role) + "</p>" +
      '<p class="lede">' + esc(L.intro) + "</p></header>" +
      '<section class="band"><div class="figures">' +
      picks.map(function (p, i) { return plate(p, i); }).join("") + "</div></section>" +
      (L.showArchive ? '<section class="band"><div class="cols"><p class="eyebrow">Scale</p><div><p>' +
        esc(S.archive.note) + '</p><a class="go" href="work.html#archive">The full record</a></div></div></section>' : "") +
      "</main>" + footer();
  }


  /* ---------- behaviour ---------- */
  function wire() {
    document.querySelectorAll(".facade").forEach(function (fa) {
      var id = fa.dataset.id || fa.dataset.yt;
      var vimeo = fa.dataset.provider === "vimeo";
      var btn = fa.querySelector(".playbtn");
      if (!btn || !id) return;

      // maxresdefault does not exist for every YouTube upload; hqdefault always does
      var img = fa.querySelector("img");
      if (img) img.addEventListener("error", function () {
        if (img.src.indexOf("maxresdefault") > -1) {
          img.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
        } else {
          img.remove();      // no frame to show: leave the plate, not a broken icon
        }
      });

      btn.addEventListener("click", function () {
        // A page opened from disk has no origin, and neither service will
        // configure a player on one. Open the film on its own site instead.
        if (location.protocol === "file:") {
          window.open(vimeo ? "https://vimeo.com/" + id
                            : "https://www.youtube.com/watch?v=" + id, "_blank", "noopener");
          return;
        }
        var src = vimeo
          ? "https://player.vimeo.com/video/" + id + "?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479"
          : "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
        fa.classList.remove("facade");
        fa.innerHTML = '<iframe src="' + src + '" title="' + (fa.dataset.title || "Film") +
          '" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" ' +
          'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      });
    });
    document.querySelectorAll(".plate img, .plateFull img, .gallery img, .photo img").forEach(function (im) {
      im.addEventListener("error", function () {
        var tile = im.closest(".photo");
        if (tile) { tile.remove(); return; }
        var box = im.closest(".plate") || im.closest(".plateFull");
        if (box) box.innerHTML = "";
      });
    });
    var fbtns = document.querySelectorAll(".filters button[data-f]");
    fbtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        var f = btn.dataset.f;
        fbtns.forEach(function (o) { o.setAttribute("aria-pressed", o === btn ? "true" : "false"); });
        document.querySelectorAll(".wentry").forEach(function (it) {
          var hit = f === "all" || (it.dataset.sectors || "").split(" ").indexOf(f) > -1;
          it.style.display = hit ? "" : "none";
        });
      });
    });

    var as = document.getElementById("asearch");
    if (as) as.addEventListener("input", function () {
      var v = as.value.trim().toLowerCase();
      document.querySelectorAll("#agroups .agroup").forEach(function (g) {
        var hits = 0;
        g.querySelectorAll(".alist span").forEach(function (s) {
          var m = !v || s.textContent.toLowerCase().indexOf(v) > -1;
          s.style.display = m ? "" : "none"; if (m) hits++;
        });
        g.style.display = hits ? "" : "none";
      });
    });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".rise").forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll(".rise").forEach(function (el) { el.classList.add("in"); });
    }
  }

  var views = { home: home, work: work, project: project, profile: profile, video: videoPage, lens: lens };
  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("js");
    var v = document.body.dataset.view;
    mount("app", (views[v] || home)() + contactDialog());
    wire();
    wireContact();
    wireThesis();
    wireRadio();
    // The page is rendered after the browser has already handled the URL hash,
    // so an anchor arriving with the request has nothing to scroll to yet.
    if (location.hash.length > 1) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ block: "start" });
    }
  });
})();
