/* ===========================================================================
   CONTENT — this is the only file you edit to change the site.
   No build step. Save, refresh, done.

   TO ADD A PROJECT      copy a block in PROJECTS, change the fields
   TO REORDER            drag the block up or down — order here is order shown
   TO HIDE               set  visible: false
   TO FEATURE ON HOME    set  home: true   (four — shown as two uneven pairs, wide/narrow
                         then narrow/wide. Order here decides which slot each takes.
                         Home plates are CROPPED. If the key image is a lockup that
                         a crop would cut, add  homeImage: "assets/…"  as well.
                         homeImage also stands in on its own when images is empty —
                         use it when a project's still would only repeat its film.)
   TO ADD A LENS         copy a block in LENSES, list the project ids you want
   IMAGE CROPPING        fit: "cover" (default) fills the frame and crops.
                         fit: "contain" shows the whole image inside the frame —
                         use it for mockups, boards and anything composed edge to edge.

   LANGUAGE              The site is in English. Project and client names use their
                         official English forms. Where a Slovenian phrase IS the
                         designed work — a campaign slogan, a podcast title — it is
                         quoted in the original with the English beside it, because
                         translating it away would misrepresent the work itself.

   FIELD NOTES
   strand     studio | employment | independent | personal   — never blurred
   evidence   strong | thin | none   — controls whether it can be featured
   role       always yours, precisely
   credits    always everyone else's, by name. Non-negotiable.
   =========================================================================== */

window.SITE = {

  profile: {
    name: "Mitja Godnic",
    role: "Art Director & Executive Producer",
    /* The thesis is a live line: two words in it change every three seconds.
       The string below is the still version. It is the heading's accessible
       name, so a screen reader announces one steady sentence instead of
       narrating every swap, and it is what the line falls back to if the
       thesisLive block is removed. Keep it a real sentence.

       The two lists are the moving parts. They are combined freely, so every
       subject can meet every ending: 10 x 11 = 110 readings of the same claim.
       Add a word to either list and it joins the rotation. Remove the
       thesisLive block entirely and the line simply stops moving. */
    thesis: "I can tell what a thing wants to be — and how to get it made.",
    thesisLive: {
      opening: "I can tell what ",
      subjects: ["a concept", "a vision", "an idea", "a design", "a project",
                 "a creation", "the work", "a brief", "a piece", "a story"],
      middle: " wants to be — and how to ",
      endings: ["get it right", "bring it to life", "craft it", "elevate it",
                "execute it", "deliver it", "get it built", "realize it",
                "make it real", "land it"],
      closing: ".",
      everyMs: 3000,
      /* How many times it turns before settling back on the first reading.
         Six is about eighteen seconds. 0 means it never stops. */
      turns: 6
    },
    /* A live radio stream offered on the home page. Nothing is requested from
       NTS until someone presses the control, so the page costs nothing to
       anyone who does not want it. Delete this block and the line disappears. */
    radio: {
      question: "Wanna listen to my favourite radio while reading?",
      station: "NTS 1",
      url: "https://stream-relay-geo.ntslive.net/stream",
      /* NTS publishes what is on air right now, and allows a browser to read it
         directly. The line under the control is that listing, so the block says
         something different every hour instead of sitting there as a button.
         Remove apiUrl and the listing disappears; everything else still works. */
      apiUrl: "https://www.nts.live/api/v2/live",
      channel: "1"
    },
    now: "Closing eight years as partner at Top Stories. Looking for the next thing, in design, art, architecture and fashion.",
    intro: [
      "Co-founder and partner of Top Stories, a design, communication and production studio in Ljubljana, 2018–2026. Work for the Ministry of Culture, the International Centre of Graphic Arts, and a long list of institutions and corporations across Slovenia and the region.",
      "Trained as a journalist. Ten years reporting on music, architecture, fashion and design before moving to the other side of it — first at the Italian Trade Agency in Ljubljana, then Expo Milano, then the EU Intellectual Property Office in Alicante, where the DesignEuropa Awards ran through my hands for a full annual cycle.",
      "I carry work the whole way: idea, art concept, execution, production, post, distribution. Knowing every step is what lets me hold a whole project in my head at once — and say early, with reasons, what it should become."
    ],
    origin: [
      "I'm from a small town near Trieste, on the Karst — vineyards and olive trees, rocky ground, sea views, Mediterranean summers. I feel more Italian than Slovenian. Italian culture was strong in my family and in the region, and I grew up on Italian television, books, music and film. Rome and Milan only made it stronger. If pressed, I'd call myself Friulano before either.",
      "I played guitar, and I'm learning piano. I used to DJ and record house music sets. I built and repaired computers, which is how I earned my first money. I was a curious child who couldn't choose, so I studied journalism — the one subject that let me be curious about several things at once. My second option was architecture.",
      "I know a little about everything and not much in depth. What I have instead is resourcefulness, the whole picture, and the ability to see the finished thing before anyone else does."
    ],
    method: {
      fast: "Execution. I find the route to a result quickly and turn things around fast — especially anything I can carry end to end myself, and anything involving digital tools. I can cut an image or a video before most people have opened the brief.",
      slow: "Long meetings that produce nothing. Surface-level ideas with no research behind them.",
      wants: "Concrete ideas, deep thinking, real references.",
      best: "The moment the pieces fall into place, the concept picks up momentum, and everyone knows exactly what to make."
    },
    leading: "Led a team of up to ten. Never wanted it bigger — the studio stayed boutique and worked almost entirely on referral. Camera crews, video editors, motion designers and graphic designers reported to me directly, alongside freelance crews.",
    taste: [
      "Cinema. European festival cinema most weeks. My favourite film is Blow-Up, by Michelangelo Antonioni.",
      "No genre loyalty in music. Open to all good tunes. Most of what I find comes through NTS.",
      "Architecture and design books, read properly. Fiction rarely. Favourite architect Mies van der Rohe.",
      "Long walks, which is where the ideas actually arrive.",
      "Solo travel — USA, Japan, Peru, and many more to come.",
      "Running, gym, and tennis. Every week."
    ],
    languages: [
      { name: "Slovenian", level: "Native" },
      { name: "Italian", level: "Proficient" },
      { name: "English", level: "Proficient" }
    ],
    contact: {
      email: "mitja.godnic@gmail.com",

      /* ---- where the form sends ----------------------------------------
         Messages go through Web3Forms, which forwards them to the address
         the access key was issued for. No account, no password: the key is
         emailed to you from https://web3forms.com and is meant to sit in a
         public page — it can only send mail to you, never read anything.

         To set up or replace it: get a key at web3forms.com for
         mitja.godnic@gmail.com and paste it between the quotes below.

         If a message can't be delivered, the visitor is told so plainly,
         keeps what they wrote, and is given this address to write to instead.
         (FormSubmit was used first and went down; it is not coming back.) */
      formEndpoint: "https://api.web3forms.com/submit",
      formFields: { access_key: "21b1280e-2807-42ff-9c07-26d8a19314f8", from_name: "Portfolio contact form" },

      linkedin: "https://www.linkedin.com/in/mitjagodnic/",
      instagram: "https://www.instagram.com/mitjagodnic/",
      note: "Working across Europe."
    },
    portrait: "assets/IMG_2755.JPG",

    /* A selection of photographs, at the foot of the profile.

       Curated by hand — you choose these, they are not a feed.
       Drop images into assets/photographs/ and list them below, best first.
       Two forms both work:
         "assets/photographs/01.jpg"
         { src: "assets/photographs/01.jpg", link: "https://…" }
       A file that isn't there removes its own tile. The whole section hides
       itself while the list is empty. */
    photographs: {
      title: "Photographs",
      note: "Ongoing. Mostly on walks, mostly on the way to something else.",
      limit: 9,
      posts: [
        "assets/photographs/01.jpg",
        "assets/photographs/02.jpg",
        "assets/photographs/03.jpg",
        "assets/photographs/04.jpg",
        "assets/photographs/05.jpg",
        "assets/photographs/06.jpg",
        "assets/photographs/07.jpg",
        "assets/photographs/08.jpg",
        "assets/photographs/09.jpg"
      ]
    },

    /* What the home page shows above the work. Keep it short — this is the
       thirty-second version for someone deciding whether to keep reading. */
    home: {
      statement: "Eight years as partner at a design, communication and production studio in Ljubljana, working for the Ministry of Culture, national museums and institutions, and corporations across the region. Before that, ten years as a journalist covering music, architecture, fashion and design, and four years inside European institutions — the Italian Trade Agency, the Slovenian Pavilion at Expo Milano, and the EU Intellectual Property Office in Alicante.",
      capabilities: [
        { title: "Direction", text: "Concept, art direction and brand architecture — naming, identity systems, campaign ideas that hold across print, screen, film and space." },
        { title: "Production", text: "The whole chain: script, storyboard, shoot, post, rollout. Crews, budgets and schedules on simultaneous projects, delivered on fixed public-sector budgets." },
        { title: "Leadership", text: "Led a team of up to ten and hired into it. Built the approval pipelines that got work past boards and ministries without grinding it flat." }
      ],
      clientsIntro: "Selected clients",
      clients: ["Ministry of Culture", "International Centre of Graphic Arts", "Museum of Architecture and Design", "Slovenian Philharmonic", "European Parliament", "Chamber of Architecture", "Novartis", "Triglav", "SAP", "Mercator"]
    }
  },

  /* ------------------------------------------------------------------ */

  /* ---------- video production ----------
     Its own page. Order here is the order on the page — move a block up and it
     moves up. Set  visible: false  to hold one back without deleting it.
     Posters come from YouTube automatically; nothing is requested from them
     until a visitor presses Play. */
  video: {
    title: "Video Production",
    intro: "Films made at Top Stories, where I ran production. Documentary, brand and public-information work for ministries, institutions and companies — most of it in Slovenian, some of it half an hour long.",
    films: [
      {
        id: "tt47xL-TKFg", provider: "youtube", visible: true,
        title: "Is there really a chance we become capitalists?",
        titleOriginal: "Je res kaj možnosti, da postanemo kapitalisti?",
        client: "Ljubljana Stock Exchange, with RTV Slovenia",
        year: "2020", duration: "30 min",
        description: "A documentary feuilleton for the thirtieth anniversary of the Ljubljana Stock Exchange and of the Slovenian capital market. Half an hour, made with the national broadcaster."
      },
      {
        id: "Aufojr81X-4", provider: "youtube", visible: true,
        title: "How a biological medicine is made",
        titleOriginal: "Novartis: Predstavitev TRD",
        client: "Novartis", year: "2025", duration: "9 min",
        description: "What it takes to develop a biological medicine, and why they are needed, told by the people who do it at the Novartis site in Mengeš."
      },
      {
        id: "OYDd9zJnhn4", provider: "youtube", visible: true,
        title: "Long-term care",
        titleOriginal: "Dolgotrajna oskrba",
        client: "Ministry of Solidarity-Based Future",
        year: "2024", duration: "4 min",
        description: "The Long-Term Care Act explained around the person it is written for — what it protects, and its aim of building care into the community rather than into institutions."
      },
      {
        id: "coTs6jVElAc", provider: "youtube", visible: true,
        title: "Stories of bohemian Ljubljana: Plečnik",
        titleOriginal: "Zgodbe bohemske Ljubljane — Zgodba o Plečniku",
        client: "Hotel Mrak", year: "2024", duration: "8 min",
        description: "One of a series positioning a hotel in the centre of Ljubljana for guests who come for the culture. The building is where the writer Ivan Mrak grew up; this episode takes Plečnik."
      },
      {
        id: "lL4omAfUi3s", provider: "youtube", visible: true,
        title: "Immerse yourself in nature",
        client: "Ravne pri Bohinju", year: "2023", duration: "3 min",
        description: "A day in the Bohinj valley, first light to evening, carried entirely by image and the sound of the place. No voice and no script: an art piece in which the atmosphere is the whole subject."
      },
      {
        id: "7OSAkS0y39A", provider: "youtube", visible: true,
        title: "A country of athletes",
        titleOriginal: "Slovenija je dežela športnikov",
        client: "Government Communication Office",
        year: "2022", duration: "2 min",
        description: "Slovenia is known abroad for what its athletes win. The film argues it is known just as much for staging the events they win at — and that the teams people follow are part of how the country reads itself."
      },
      {
        id: "umfT8fs0_98", provider: "youtube", visible: true,
        title: "A light that starts a new day",
        titleOriginal: "Luč, ki prižiga nov dan",
        client: "Faculty of Arts, University of Ljubljana",
        year: "2021", duration: "5 min",
        description: "The faculty introduced through its alumni — their stories, and the music they brought with them."
      },
      {
        id: "oXiTjRftA-I", provider: "youtube", visible: true,
        title: "Cyber Security — trailer",
        client: "NIL", year: "2021", duration: "3 min",
        description: "A short documentary series on cyber security and the problems it presents, carried by NIL's own specialists — their knowledge as the argument, working for recruitment and for business at the same time. This is the trailer for the series."
      }
    ]
  },

  career: [
    { from: "2018", to: "2026", org: "Top Stories", place: "Ljubljana",
      role: "Co-founder, Partner — Executive Producer & Creative Direction", strand: "studio",
      note: "Founded with two colleagues from journalism, out of a demand nobody was serving: video made with a reporter's method rather than an advertiser's. Grew from production into an editorial desk for business content, relationships and process. Clients across culture, government, pharma, finance, retail, energy and EU institutions." },
    { from: "2021", to: "2022", org: "Zemanta (Outbrain)", place: "Remote",
      role: "Product Marketing Specialist", strand: "employment",
      note: "Release communications and go-to-market alignment for a programmatic advertising platform." },
    { from: "2016", to: "2018", org: "EU Intellectual Property Office", place: "Alicante",
      role: "Communications — DesignEuropa Awards", strand: "employment",
      note: "The DesignEuropa Awards are the European Union's prizes for product and industrial design, judged across the whole EU and awarded to holders of registered Community designs. I worked a full annual cycle — launch, call for entries, selection, shortlisting, and the two-day ceremony itself. It is where I learned what design looks like at institutional scale, and I still cover the awards as a journalist." },
    { from: "2015", to: "2016", org: "Faculty of Computer & Information Science, University of Ljubljana", place: "Ljubljana",
      role: "Communications", strand: "employment",
      note: "The first time I owned all of it alone — internal and external communication, media relations, events, and the launch and delivery of the faculty's campaigns." },
    { from: "2015", to: "", org: "Expo Milano 2015", place: "Milan",
      role: "Press Office — Slovenian Pavilion", strand: "employment", note: "" },
    { from: "2014", to: "", org: "Italian Trade Agency / Embassy of Italy in Slovenia", place: "Ljubljana",
      role: "PR & Events", strand: "employment",
      note: "Italian Fashion Week and Italian Cuisine Week in Slovenia." },
    { from: "2018", to: "", org: "RTV Slovenia", place: "Ljubljana",
      role: "Journalist & News Reporter — contract", strand: "employment",
      note: "Daily television news for the national broadcaster." },
    { from: "2011", to: "2016", org: "Siol.net and Slovenian magazines", place: "Ljubljana",
      role: "Journalist — music, architecture, fashion, design", strand: "employment",
      note: "Began during my journalism degree and continued alongside everything else." }
  ],

  /* Journalism, 2011–2018. No images survive — this is set typographically. */
  writing: {
    years: "2011–2018",
    note: "Ten years reporting and writing, on and off, alongside everything else. Mostly music, architecture, fashion and design — interviews, profiles, opinion. Daily television news at RTV Slovenia in 2018. I still cover the DesignEuropa Awards.",
    /* Publication names go here and appear as a line under the section.
       Empty, and no line is drawn. */
    outlets: []
  },

  education: [
    { year: "2019", org: "University of Ljubljana", award: "MA — Visual Communication & Film",
      note: "Two years of the degree taken on exchange at La Sapienza, Rome, studying visual communication and Italian cinema." },
    { year: "2014", org: "University of Ljubljana", award: "BA — Journalism" }
  ],

  recognition: [
    { year: "2025", what: "Silver — Slovenian Advertising Festival", forWhat: "Triglav Insurance, internal communication formats" },
    { year: "2025", what: "Finalist — Marketing Excellence", forWhat: "Triglav Insurance" }
  ],

  /* ------------------------------------------------------------------ */

  projects: [

    {
      id: "zagovornik",
      title: "Equality campaign",
      client: "Advocate of the Principle of Equality",
      year: "2024",
      category: "Film, campaign",
      strand: "studio", evidence: "strong", visible: true, home: true,
      disciplines: ["art direction", "production", "film"],
      sectors: ["government", "culture"],
      premise: "Three films for the state body people come to when they have been discriminated against — one for each ground, made so the person arrives before the category.",
      role: "Head of Production & Art Director",
      roleDetail: "Ran production and set the visual approach across the series: casting, studio, lighting, and the decision to hold a single figure in frame.",
      credits: [
        ["Films by", "Diskont films"],
        ["Produced by", "Top Stories"]
      ],
      context: "The Advocate of the Principle of Equality is Slovenia's independent body for discrimination complaints. Campaigns on this subject usually illustrate the category rather than the person, which is the same mistake the discrimination makes.",
      approach: [
        "Three films, one for each ground: pregnancy, disability, ethnic origin.",
        "Each holds a single person in a plain studio. No set, no props, nothing to read except them — so the viewer meets the person first and the protected characteristic second.",
        "The films are titled plainly. The work of the campaign is done by who you are looking at, not by what the voiceover claims."
      ],
      outcome: [],
      /* Vimeo hides its poster frames behind hashed URLs, so these three are
         saved locally. Without a poster the films would sit as black boxes. */
      videos: [
        { provider: "vimeo", id: "907477362", title: "Discrimination — Pregnancy",
          poster: "assets/zagovornik/pregnancy.jpg" },
        { provider: "vimeo", id: "907476423", title: "Discrimination — Disability",
          poster: "assets/zagovornik/disability.jpg" },
        { provider: "vimeo", id: "907477880", title: "Discrimination — Ethnic origin",
          poster: "assets/zagovornik/ethnic-origin.jpg" }
      ],
      /* The frame is a still from the third film, so it earns nothing on the
         project page under three films that already show it moving. Kept as a
         homeImage: it is what represents the project on the home page and in a
         shared link, and nothing else. */
      images: [],
      homeImage: "assets/equality_key.png",
    },

    {
      id: "sap",
      title: "SAP CEE",
      client: "SAP Central and Eastern Europe",
      year: "2024",
      years: "2021–2024",
      category: "Events, film, concept, copywriting",
      strand: "studio", evidence: "strong", visible: true, home: false,
      disciplines: ["production", "art direction", "film", "editorial"],
      sectors: ["technology"],
      premise: "Three annual events for a market unit of one of the world's largest software companies — each year built on a single idea, then made to work across film, stage, print and an app in six hundred hands.",
      role: "Head of Production & Art Direction",
      roleDetail: "Led production and art direction across all three annual events, every year: concept development with the client, animated titles, awards films, event reportage, and the technical team on site.",
      credits: [
        ["Produced by", "Top Stories"]
      ],
      context: "SAP is among the twenty-five most successful companies in the world by Forbes's count, and is large enough to be split into market units. SAP Central and Eastern Europe is one of them, run in part from Ljubljana — and since a 2022 reorganisation it reaches into Western and Central Asia too. The relationship began small: when Top Stories could still count its staff on one hand, SAP asked whether the market unit's annual reports could stop being annual reports and become short films instead. It grew from there into three events a year.",
      approach: [
        "Customer Success Kick-off — the internal one. Several days, held each year in a different Central or Eastern European capital, where the unit reports its results, awards its best people and sets out the strategy for the year ahead. We help build the governing concept. The most recent ran on Einstein's relativity: a month before, staff were invited on a three-day mission, expeditions to points in space and time to gather intelligence they would need for what was coming. The concept then had to hold across animated titles that opened each section, print, static graphics and the host's script.",
        "A large part of the work every year is writing. The client runs the event through Eventee, an app that is the main channel to everyone in the room — push notifications for sessions, transport, meals and every change of plan. It runs both ways, so we write to draw people onto the social wall and keep quizzes running through the talks, with results appearing live on stage for the host to react to. We also write the host's linking script and every film script, including the nominee and winner announcements.",
        "Partner Kick-off — the external one, a month or two later, for the partners who sell SAP software with their own tools built on top and account for a substantial share of its revenue. The content is close enough to the internal event that each year's concept can be worked again rather than started again. In Bratislava in 2023 we reworked the idea that had run internally on the unit's cultural range, which mattered that year: it made the newly joined Asian countries part of the room rather than guests in it. Alongside the titles, awards animations and app copy, we ran the technical team on site, and cut a reportage film afterwards that the client's team and the attendees posted to their own LinkedIn.",
        "Quality Awards — the customer one, for the companies that implemented SAP fastest, most efficiently or most inventively. We first made it during Covid, when it could not be held. Rather than move it online as a virtual or hybrid event, we turned it into two series of films on LinkedIn: the first revealing the nominees in each category, the second telling the winning project in full. Client, partners and customers all shared them."
      ],
      outcome: [
        "Four consecutive Customer Success Kick-offs",
        "Around 450 people at the most recent, in Zagreb",
        "The Quality Awards reached beyond the room for the first time — client, partners and customers all posting the films",
        "The client kept the LinkedIn format after the pandemic ended, and reuses the films for internal best practice and for selling"
      ],
      videos: [
        { provider: "youtube", id: "ccrP13En2GM", title: "Opening titles, Customer Success Kick-off 2024" }
      ],
      images: ["assets/sap_key.png"],
    },

    {
      id: "nacionalni-dan-stripa",
      title: "National Comics Day",
      titleOriginal: "Nacionalni dan stripa",
      client: "Ministry of Culture, Slovenia",
      year: "2025",
      category: "Campaign, identity, print, outdoor, events",
      strand: "studio", evidence: "strong", visible: true, home: false,
      disciplines: ["art direction", "campaign", "identity", "production"],
      sectors: ["culture", "government"],
      premise: "Slovenia's first National Comics Day, built on an empty panel and the invitation to fill it.",
      role: "Executive Producer & Project Lead — art direction",
      roleDetail: "Led the project and directed content production: concept direction with the strategy lead, art direction of the designer, and production across print, outdoor, film, installations and three live events.",
      credits: [
        ["Design", "Aleksandra Vugrin"],
        ["Strategy", "Jernej Verbic"],
        ["Live illustration", "Slika z jezika"],
        ["Team", "Jakob Kužnik, Timotej Kresnik, Uroš Gorican"],
        ["Produced by", "Top Stories"]
      ],
      context: "Comics sit between literature and visual art and are taken entirely seriously as neither. The centenary of the cartoonist Miki Muster gave the Ministry a date; declining reading across every age group gave it a reason. What it did not have was a form.",
      approach: [
        "We refused a conventional brand. The governing line was that a comic lives in its reader, not in a logo.",
        "The mark is a four-panel comic grid: the letters of the word break across two panels, and the date, 22.11, occupies the other two. The date sits inside the structure rather than being applied to it.",
        "Every element is drawn in the language of the thing itself. Speech bubbles carry the messages. The panel border becomes the frame for a poster, a totem, a citylight, a shelf sign.",
        "The empty panel became the object of the campaign. Printed at A4 and handed out at workshops, it turned the argument into something a person could hold and fill in themselves.",
        "For libraries and schools we made an educational poster — How do we read comics? — a comic that teaches you how to read a comic, in six panels. It went out with a display board for featured titles and a totem for events.",
        "Press and digital advertising ran on one open sentence, A comic is …, completed by a scatter of hand-lettered bubbles: story, satire, commentary, community, art, reading, serious, for everyone.",
        "The slogan, I have character, I read comics, turns on a word that means both a personality and a drawn character."
      ],
      outcome: [
        "60+ media placements, national and regional",
        "700+ attendees across the live events",
        "1,988,418 outdoor impressions across 40 screens",
        "Four-page feature in Delo, the national daily",
        "Adopted by schools and libraries without prompting",
        "Delivered within a fixed budget"
      ],
      video: "M1DhEM2jUIM",
      links: [["Case study", "https://dobrezgodbe.si/nacionalni-dan-stripa-kako-smo-praznemu-okvirju-dali-znacaj/"]],
      images: ["assets/nds-master.jpg"], fit: "contain",
    },

    {
      id: "tonemo",
      title: "MRFY — Tonemo",
      client: "MRFY",
      year: "2024",
      category: "Music video, production",
      strand: "independent", evidence: "strong", visible: true, home: true,
      disciplines: ["production", "film"],
      sectors: ["music"],
      premise: "A night shoot in a forest and a field, for one of Slovenia's best-known bands — robed figures, a bonfire and the last of the light.",
      role: "Production assistant",
      roleDetail: "On the crew, not directing it. The photographs here are mine, taken on set across the two days.",
      credits: [
        ["Band", "MRFY"]
      ],
      context: "",
      approach: [],
      outcome: [],
      videos: [
        { provider: "youtube", id: "6j1kbWCZuJY", title: "MRFY — Tonemo, official video" }
      ],
      images: [
        "assets/tonemo/01.jpg",
        "assets/tonemo/02.jpg",
        "assets/tonemo/03.jpg",
        "assets/tonemo/04.jpg",
        "assets/tonemo/05.jpg",
        "assets/tonemo/06.jpg"
      ],
    },

    {
      id: "graficni-bienale",
      title: "35th Ljubljana Biennial of Graphic Arts",
      titleOriginal: "35. graficni bienale Ljubljana",
      client: "International Centre of Graphic Arts",
      year: "2023",
      category: "Content systems, podcast, social",
      strand: "studio", evidence: "strong", visible: true, home: true,
      disciplines: ["production", "editorial", "content strategy"],
      sectors: ["culture", "museums"],
      premise: "Making a graphic arts biennial legible to people outside it, without flattening what it is.",
      role: "Executive Producer",
      roleDetail: "Produced the podcast end to end, built and ran the TikTok channel, and delivered the communication framework and the team workshop.",
      credits: [
        ["Content concept", "Jernej Verbic"],
        ["Data storytelling", "Aleksandra Vugrin"],
        ["Podcast host", "Nevenka Šivavec, Director"],
        ["Produced by", "Top Stories"]
      ],
      context: "Specialist art writing is hermetic by default. The biennial needed to reach people who would enjoy it but would never get past the first paragraph.",
      approach: [
        "Produced a four-episode podcast, To ni nobena umetnost — That's Not Art At All — hosted by the centre's own director. Audio and video, transcripts and subtitles, titles, music, and cut-downs for every channel.",
        "Built a TikTok channel from nothing on a single format: one artist, three questions, one video a day from mid-August through to the opening.",
        "Ran a workshop with the team and named the audiences honestly — the cultural tourist, the cultural snob, the Instagram culture-follower, the scenester, the merely curious, the collector of experiences. Naming them accurately is what made the writing possible."
      ],
      outcome: [
        "Four podcast episodes, published across podcast platforms, YouTube, social and the biennial's own site",
        "A daily film from mid-August through to the opening",
        "The channel took hold, and the centre now runs and makes content for it themselves"
      ],
      links: [["Case study", "https://dobrezgodbe.si/35-graficni-bienale-ljubljana-umetnost-pripovedovanja-zgodb-za-mglc/"]],
      images: ["assets/key-images/mglc.jpg", "assets/mglc-podcast.png", "assets/mglc.png"],
      fit: "contain", plateBg: "#e5c439",
      homeImage: "assets/key-images/mglc-home.jpg",
    },

    {
      id: "go2insure",
      title: "Go2insure",
      client: "Go2insure",
      year: "2023",
      category: "Motion, 3D, creative direction",
      strand: "independent", evidence: "strong", visible: true, home: false,
      disciplines: ["art direction", "motion", "production"],
      sectors: ["insurance"],
      premise: "Explaining dynamic pricing in insurance without a single stock photograph of a happy family.",
      role: "Creative direction, production",
      credits: [],
      context: "Insurance sells an abstraction, and its advertising almost always reaches for people instead of the idea. Dynamic pricing is a mechanism — so the film shows the mechanism.",
      approach: [
        "Built the whole thing from 3D objects, diagrammatic marks and kinetic type. No cast, no location.",
        "Type does the emotional work: LIVE HEALTHIER repeating across the frame until a heart lands inside it."
      ],
      outcome: [],
      video: "3h5o0qgANFQ",
      images: ["assets/key-images/go2insure.png"],
    },

    {
      id: "ekultura",
      tile: "#d6fa53",
      title: "e-Kultura",
      client: "Ministry of Culture, Slovenia",
      year: "2026",
      category: "Launch campaign, print, merchandise",
      strand: "studio", evidence: "strong", visible: true, home: false,
      disciplines: ["art direction", "campaign", "print"],
      sectors: ["culture", "government"],
      premise: "A launch for the national culture portal, held together by one typographic joke.",
      role: "Executive Producer & Project Lead — art direction",
      credits: [
        ["Design", "Aleksandra Vugrin"],
        ["Strategy", "Jernej Verbic"],
        ["Produced by", "Top Stories"]
      ],
      context: "The portal joins four separate public systems into one, with the National Library, the Museum of Modern Art, the Slovenian Theatre Institute and the Slovenian Film Centre as partners. Four systems, three quite different audiences, one launch.",
      approach: [
        "Split the message three ways rather than averaging it — a separate one-pager for the public, for creators, and for institutions.",
        "The merchandise carries the idea: the word for everything stretched letter by letter until it becomes e-Kultura, so it reads as everything is e-Kultura, while the repeated letter turns into the texture that fills the surface."
      ],
      outcome: [
        "Launched 19 June 2026 with a conference and panel at the National Museum",
        "Three one-pagers, a perforated leaflet-index, digital banners and a social system",
        "Merchandise carrying the campaign line"
      ],
      images: [
        "assets/key-images/mk.png",
        "assets/ekultura/tote.jpg",
        "assets/ekultura/event-03.jpg",
        "assets/ekultura/event-04.jpg",
        "assets/ekultura/event-01.jpg",
        "assets/ekultura/event-02.jpg"
      ],
      fit: "contain", plateBg: "#cd5528",
    },

    {
      id: "triglav",
      tile: "#3d8574",
      title: "Triglav",
      client: "Triglav Group",
      year: "2025",
      years: "2022–2025",
      category: "Internal communication, film, events",
      strand: "studio", evidence: "strong", visible: true, home: false,
      disciplines: ["production", "editorial", "content strategy", "events"],
      sectors: ["insurance"],
      premise: "Three years of formats built to move a strategy off paper and into how several thousand people actually behave.",
      role: "Executive Producer",
      roleDetail: "Ran production across the programme — the monthly film series, the conference, the company-wide day and the recruitment films.",
      credits: [
        ["Strategy", "Jernej Verbic"],
        ["Produced by", "Top Stories"]
      ],
      context: "In 2022 Triglav adopted a new strategy and a new archetypal identity. Leadership understood the part most companies skip: a strategy document changes nothing by itself. The culture had to move with it, and the movement had to be measurable — tracked against the Human Synergistics model, which scores constructive behaviour against defensive and passive.",
      approach: [
        "We did not make a campaign. Campaigns end, and this needed somewhere to live month after month for three years.",
        "Instead we built four repeatable formats and handed them over as a working system: Triglav Ekspres, a monthly internal video newsletter; Festival idej, a months-long competition for employee ideas; a leadership conference held every two years; and Naš dan, a company-wide gathering built around sport, content and the values themselves.",
        "Alongside them, portrait-led recruitment films and the group's International Business Academy.",
        "The values the whole thing had to carry were narrow on purpose — simplicity, responsiveness, reliability. Three words that a person can act on without a workshop."
      ],
      outcome: [
        "Constructive organisational behaviours up 11% between 2021 and 2025",
        "Triglav Ekspres averaged 78.8% viewership, against roughly 20% for standard internal communication",
        "New formats averaged 50% higher viewership than 2023",
        "18 episodes of Triglav Ekspres produced",
        "Silver, Slovenian Advertising Festival",
        "Finalist, Marketing Excellence"
      ],
      links: [["Case study", "https://capital-h.eu/triglav_case_study/Triglav%20Case%20Study.dc.html"]],
      images: ["assets/key-images/triglav.jpg"], fit: "contain", plateBg: "#434a9a",
    },

    {
      id: "schwarzbartl",
      title: "schwarzbartl",
      client: "Schwarzbartl Institute",
      year: "2024",
      category: "Brand architecture, naming",
      strand: "independent", evidence: "strong", visible: true, home: false,
      disciplines: ["brand architecture", "naming", "art direction", "web"],
      sectors: ["education"],
      premise: "A parent institute and three sub-brands, named and structured on a single convention.",
      role: "Brand architecture, naming, art direction, website design",
      credits: [["Founder", "Ana Lara Schwarzbartl"]],
      context: "A cognitive development and therapeutic language practice, founded in Vienna and expanding to Ljubljana, with a method and a product that both needed names of their own.",
      approach: [
        "Built the architecture on a dot convention — schwarzbartl.kinderlab, schwarzbartl.method, schwarzbartl.tiletak — so the parent is present in every child without repeating itself.",
        "Named TileTak, the set of 25 engraved beech tiles the method is taught with.",
        "The tiles carry a drawn symbol set — figures, gestures, marks — so the method can be taught to a child before the child can read."
      ],
      outcome: [],
      links: [["Website", "https://www.schwarzbartlkinderlab.com/en"]],
      images: ["assets/schwarzbartl-key.png"], fit: "contain",
    },

    {
      id: "zblizevalnik",
      title: "Zbliževalnik",
      titleOriginal: "A coined Slovenian name — the thing that brings people closer",
      client: "Self-initiated — published by Outsider",
      year: "2020",
      category: "Design response, film",
      strand: "independent", evidence: "strong", visible: true, home: true,
      disciplines: ["production", "film"],
      sectors: ["architecture", "health"],
      premise: "A transparent frame that let families sit close and talk through lockdown, released free for anyone to build.",
      role: "One of six. Filmed and edited the film; worked on production.",
      credits: [
        ["Created by", "Katja Simoncic, Matic Vrabic, Petra Varl, Danilo Oncevski, Nikola Shekerinov, Mitja Godnic"],
        ["Drawing", "Vrabic Arhitekti"],
        ["Photography", "Klemen Ilovar"]
      ],
      context: "Lockdown separated people in care homes from their families. Social distancing was an abstraction; the people it applied to were not.",
      approach: [
        "A transparent barrier that holds two people at conversational distance while keeping them epidemiologically apart.",
        "Prototyped in our own time on sponsorship covering materials and manufacture. Non-profit.",
        "The construction drawings were published as a free PDF so anyone could build one."
      ],
      outcome: ["Published in Outsider, 13 November 2020."],
      links: [["Outsider", "https://outsider.si/zblizevalnik/"]],
      images: [
        "assets/zblizevalnik/zblizevalnik-large.jpg",
        "assets/zblizevalnik/zblizevalnik.jpeg",
        "assets/zblizevalnik/zblizevalnik-vrabic-arhitekti.jpg"
      ]
    },

    {
      id: "flet",
      title: "The Flat",
      client: "Personal",
      year: "2024",
      category: "Interior, self-directed",
      strand: "personal", evidence: "strong", visible: true, home: false,
      disciplines: ["interior", "design"],
      sectors: ["architecture"],
      premise: "An old Ljubljana flat taken back to its skeleton and rebuilt as somewhere to keep things.",
      role: "Design, self-directed. My own architect.",
      credits: [],
      context: "A postmodern quarter of Ljubljana, and a flat that had not been touched in decades.",
      approach: [
        "Stripped to the shell. New water, electrics, screed and floors. Walls removed to open the plan. Only the windows stayed.",
        "Designed the bed myself — a hybrid of a Western frame and a Japanese one.",
        "It works as a gallery, or a shop. Everything is scattered and everything makes sense."
      ],
      outcome: [],
      images: [
        "assets/flet/IMG_1612-45.jpg",
        "assets/flet/IMG_6725-45.jpg",
        "assets/flet/IMG_8616-45.jpg",
        "assets/flet/IMG_3958-45.jpg",
        "assets/flet/IMG_2681-45.jpg",
        "assets/flet/IMG_6357-45.jpg"
      ],
    }

  ],

  /* ------------------------------------------------------------------
     ARCHIVE — the full record. Deliberately plain, deliberately deep.
     ------------------------------------------------------------------ */

  archive: {
    note: "Selected clients through Top Stories, 2018–2026, and earlier roles. Around 130 organisations in total.",
    groups: [
      { name: "Culture, museums, architecture", items: ["Museum of Architecture and Design", "Centre for Creativity", "International Centre of Graphic Arts", "Ministry of Culture", "Slovenian Philharmonic", "Chamber of Architecture and Spatial Planning", "Creative Europe Desk Slovenia", "Association of Arts and Culture NGOs", "Ljubljana Exhibition and Convention Centre", "Expo 2025", "Slovenian Olympic Committee", "Kamnik Music School", "Gigodesign"] },
      { name: "European & international", items: ["European Parliament", "Renew Europe", "DW Akademie", "Thomson Foundation", "Internews", "Transparency International", "Ostro", "Fortenova", "Fraport", "IBM", "SAP", "Wusthof", "Seascape Beneteau", "Advantage Austria", "GIZ", "AmCham"] },
      { name: "Pharma, medtech & health", items: ["Novartis", "Roche", "Abbott", "Bayer", "Krka", "Medis", "Belimed", "National Institute of Public Health", "Ministry of Health"] },
      { name: "Finance & insurance", items: ["Triglav Insurance", "NLB", "NLB Funds", "Dezelna banka Slovenije", "Ljubljana Stock Exchange", "Grawe", "Go2insure", "Slovenian Insurance Association"] },
      { name: "Retail, industry, energy, infrastructure", items: ["Mercator", "SPAR", "Lidl", "Merkur", "Bauhaus", "Petrol", "Motorway Company of Slovenia", "Slovenian Railways", "Port of Koper", "JUB", "Jelovica", "Slovenian State Forests", "A1", "Supernova", "Ljubljana Dairy / Lactalis"] },
      { name: "Government & public", items: ["Ministry of Labour, Family and Social Affairs", "Ministry of Defence", "Ministry of Agriculture", "City of Ljubljana", "Government Communication Office", "Advocate of the Principle of Equality", "Labour Inspectorate", "Slovenian Institute for Adult Education", "Slovenia Forest Service", "Slovenian Tourist Board"] },
      { name: "Research & education", items: ["Jozef Stefan Institute", "National Institute of Chemistry", "Faculty of Arts, University of Ljubljana", "Faculty of Computer & Information Science", "XLAB"] },
      { name: "Ventures", items: ["Capital H — pay transparency consulting, with Metamorfoza", "strim.team — live event production, founded during Covid"] }
    ]
  },

  /* ------------------------------------------------------------------
     LENSES — one per application. Unlisted. /for.html?lens=id
     Each one needs a hand-written opening. If it reads as a filter it fails.
     ------------------------------------------------------------------ */

  lenses: [
    {
      id: "culture",
      label: "Culture & institutions",
      intro: "Six years of work for museums, biennials and ministries — campaigns, identity and content systems for organisations whose subject is harder to communicate than a product.",
      projects: ["nacionalni-dan-stripa", "graficni-bienale", "ekultura", "zblizevalnik"]
    },
    {
      id: "design",
      label: "Identity & art direction",
      intro: "Brand architecture and art direction, from a national campaign built on an empty comic panel to a three-part naming system for a children's institute.",
      projects: ["nacionalni-dan-stripa", "schwarzbartl", "ekultura", "flet"]
    },
    {
      id: "corporate",
      label: "Scale & regulated sectors",
      intro: "Multi-year programmes for pharma, insurance, banking and public institutions — the work that proves delivery at scale, under approval, on budget.",
      projects: ["triglav", "ekultura", "nacionalni-dan-stripa", "graficni-bienale"],
      showArchive: true
    }
  ]
};
