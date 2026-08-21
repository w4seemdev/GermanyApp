# Zukunft Service — Website Plan

**Bilingual (DE/AR) showcase site · React + TypeScript + Tailwind · UI only · $700 fixed fee**

Planning artifact, August 2026. No code written yet. Produced by a 12-agent workflow; 5 research specialists completed, the downstream synthesis/critique agents were lost to a session limit, so the adjudication below was done by hand. Full specialist reports are in [`docs/research/`](./research/) and are the authoritative detail behind every summary here.

---

## 0. Decisions at a glance

| # | Question | Decision | Why |
|---|---|---|---|
| 1 | Framework | **Next.js 16 App Router, every route prerendered** | WhatsApp/Telegram link-preview crawlers don't run JS, and this audience shares links via WhatsApp. Also gives server-rendered `<html lang dir>` — no RTL flash. |
| 2 | Service detail UX | **Real pages, not modals** | 12 indexable URLs instead of 2; removes a focus-trap a11y risk. Marginal cost ≈ 0. |
| 3 | URL slugs | **Latin/German slugs in both locales** | Guarantees the language switch always has a target; avoids percent-encoding breakage in WhatsApp and in static-export file paths. |
| 4 | i18n library | **None — typed TS content modules** | Arabic content is *structurally* different from German. `tsc --noEmit` becomes the completeness check. |
| 5 | Typography | **IBM Plex Serif + Sans + Sans Arabic**, via `next/font` | One superfamily with a real Arabic companion — DE and AR read as one brand. Self-hosted ⇒ no Google Fonts DSGVO exposure. |
| 6 | Brand gold as text | **Banned.** `#c48a16` is fills only; gold text is `#8a6013` | `#c48a16` is **2.96:1** on the page background — fails even the 3:1 non-text floor. |
| 7 | Cookie banner | **None** — zero cookies, zero third-party requests | Cheaper, faster, and a better first impression than a good banner. Held by hard build rules. |
| 8 | DSGVO consent checkbox | **No checkbox.** Always-visible privacy notice + link beside submit | A contact form runs on Art. 6(1)(b)/(f), not consent. A checkbox manufactures a withdrawable "consent" and adds friction. Client's lawyer has the final say; it's a one-line flag. |
| 9 | Dark mode | **No.** Token layer built dark-ready | "What is cream in the dark?" is an unasked brand question. Quote separately. |
| 10 | Analytics | **None in v1** | Any analytics reopens the consent-banner question. |
| 11 | Google Maps | **Link out + static tile — never an iframe** | An iframe transmits IP to Google on load ⇒ consent ⇒ banner. |
| 12 | Mobile nav | **Full-screen overlay at `lg` (1024px)**, native `<dialog>` | Fixes the reference site's worst bug. Full-screen has zero directional geometry, so RTL is free. |
| 13 | WhatsApp FAB colour | **`#128c7e`**, not `#25d366` | White glyph on `#25d366` is 1.98:1 — invisible to low-vision users. `#128c7e` is WhatsApp's own darker brand green at 4.14:1. |
| 14 | Tests | **3 Vitest files, no DOM tests** (~45 min) | Schema contract, content parity + banned-language lint, locale path swapping. Everything else is a manual bilingual QA pass. |
| 15 | Hosting | **EU region** (Vercel `fra1`, Hetzner, netcup, IONOS) | Shortens and hardens the privacy declaration; also a TTFB win. |

---

## 1. What we are building

A calm, fast, bilingual German/Arabic brochure website for **Zukunft Service**, a Dortmund service agency that helps mostly Arabic-speaking residents with German bureaucracy — naturalisation, documents, marriage and translation, study and visas, finance, real estate — plus a commercial cleaning arm.

It is a **showcase site with exactly one moving part**: a contact form that emails the owner. We build the complete UI and hand it to a backend developer who implements the send. Everything else is presentational.

Two things make this harder than it looks, and both are non-negotiable:

- **It is genuinely bilingual with full RTL**, and the client's German and Arabic source documents are *not* translations of each other — they differ in structure, not just wording.
- **The copy is legally load-bearing.** In Germany, legal, tax and insurance advice are licensed activities. The client's own copy is carefully hedged ("support with", "prepare", "refer to a suitable partner") and their live draft already carries the line *"Keine Rechtsberatung."* Rewriting that for punchiness creates real liability.

---

## 2. Confirmed business data ✅

Client-confirmed 20 Aug 2026. This is the single source of truth for `src/content/shared/nap.ts`, the footer, the info strip, the `LocalBusiness` JSON-LD, and the Impressum shell.

| Field | Value |
|---|---|
| Address | **Ruhrallee 55, 44139 Dortmund** |
| Phone / WhatsApp | **+49 177 3825632** → `https://wa.me/491773825632` |
| Email (form destination) | **info@zukunftservice.de** |
| Opening hours | **Monday–Friday, 10:00–16:00.** Closed Saturday and Sunday. |

> ⚠️ **The hours differ from the reference site**, which published Thu 10–15 and Fri 10–13. The client's confirmation (*"كل يوم من الساعة ١٠ ل١٦، عدا السبت والاحد"*) is uniform 10–16 Mon–Fri. **Use the client's version everywhere** — including `openingHoursSpecification` in JSON-LD, which Google surfaces directly in search and Maps. Worth telling the client their existing draft site shows outdated hours.

Stored structurally so one shape serves the German page, the Arabic page and the schema markup:

```ts
hours: [
  { day: 'mo', open: '10:00', close: '16:00' },
  { day: 'tu', open: '10:00', close: '16:00' },
  { day: 'we', open: '10:00', close: '16:00' },
  { day: 'th', open: '10:00', close: '16:00' },
  { day: 'fr', open: '10:00', close: '16:00' },
  { day: 'sa', open: null, close: null },
  { day: 'su', open: null, close: null },
]
```

Weekday names are rendered per locale via `Intl.DateTimeFormat` (`ar-u-nu-latn-ca-gregory` — bare `ar` can resolve to the Umm al-Qura calendar in some ICU builds). **Still outstanding for the Impressum:** legal name and legal form, register data, USt-IdNr., and the licence questions in §13.

---

## 3. Scope: in / out / paid extra

### IN — the $700

React + TypeScript + Tailwind v4 UI, prerendered static · 11 routes × 2 locales · full DE/AR with RTL · accessibility-corrected brand palette · responsive to 320px · WCAG 2.2 AA build practices · contact form UI with validation, all states, a working mock and a documented typed backend seam · WhatsApp deep links + FAB · Impressum and Datenschutzerklärung **page shells and rendering** · SEO head tags, hreflang, canonical, JSON-LD, sitemap, robots · OG images · enforced performance budget · `HANDOFF.md`.

### OUT — name these now, price them separately

Backend / actual email sending · email deliverability setup (SPF/DKIM/DMARC) · **the legal texts themselves** · copywriting beyond adapting the client's PDFs · translating new copy · photography · logo redesign · Google Business Profile setup · analytics + cookie banner (one implies the other) · a third locale · blog / CMS · booking or payment (would likely pull the site into BFSG scope) · hosting, domain, deployment, maintenance · formal accessibility audit · post-launch content updates.

### Scope: full bilingual, confirmed

The fee is not a rationing constraint, so **build the full DE + AR scope** — 22 prerendered pages, all 67 service items in both languages. Planning figure: **~62–66 hours**.

The largest single line item is content, not code. Roughly 11 h of that is bilingual content entry, and the Arabic carries real risk because it describes regulated activities — visas, insurance, insolvency. Budget the review time honestly rather than compressing it; that is where this project would actually go wrong, not in the components.

**Two things still worth putting in writing**, because they protect the schedule rather than the fee: two revision rounds included, further rounds by arrangement; and if client content (legal text, photos) is outstanding more than 14 days after the UI is complete, deliver with placeholders rather than letting the project hang open indefinitely. UI delivery is also not contingent on the backend developer finishing.

---

## 4. Design concept

Two concepts were commissioned; the session limit killed both before they returned. What follows is the direction the five research reports converge on, and it is buildable as-is.

**Concept: "Split" — the duality is real, so make it the system.**

The business genuinely has two arms, and says so itself on its live draft: *"Wie können wir Ihnen helfen? **Zwei Leistungsbereiche**, ein verlässlicher Ansprechpartner"* — Büroservice and Reinigungsservice. The logo encodes the same duality (a document and a broom). And there are two languages. So the developer's own "split app concept" instinct has business justification, not just visual appeal.

Make it an **asymmetric** split system, not a 50/50 gimmick. One `SplitSection` primitive with ratio tokens (`1.03:0.97` hero → `0.8:1.2` contact), varied deliberately down the page. Three reasons this is architecturally right and not just decorative:

1. **CSS Grid column order follows `dir`** — the entire motif mirrors into Arabic with zero extra code. The visual concept and the RTL requirement are aligned rather than fighting.
2. Six bespoke section layouts collapse into six *compositions* of one primitive. At $700 that is real time.
3. The reference site *has* splits; it has no *system* of them. That is the difference the client is paying for.

**Grafted from the second concept ("Guided path"), because it is too good to lose:** the client's own closing line in both PDFs is *"You have a matter and don't know where to begin?"* — the product **is** removing that uncertainty. So the home page gains a **3-step process strip** (`Anliegen schildern` → `Gemeinsam sortieren` → `Nächste Schritte`). It costs one row, it is the single best anxiety-reducer available, and it is the **legally safest way to describe the business** — a process description makes no outcome promise.

---

## 5. Design system

The reference site's stylesheet gave us the exact brand tokens. We keep them, fix what fails accessibility, and add what's missing.

### 5.1 Brand tokens (unchanged, from the reference)

```css
--green: #075344   --deep: #043b32   --sage: #769b7e
--gold:  #c48a16   --cream: #f7f0e5  --ink:  #19312c
/* page background #fffdf9 */
```

### 5.2 The contrast fixes — three real failures

Every ratio below was computed from WCAG relative luminance, not estimated.

| Problem | Measured | Fix |
|---|---|---|
| **Gold as text** — eyebrows, "Details →" links | `#c48a16` on `#fffdf9` = **2.96:1**. On cream = **2.65:1**. Fails AA normal text *and* the 3:1 large-text/non-text floor. | Gold becomes **fills only**. Gold text on light = **`#8a6013`** (5.49:1 on page bg, 4.93 on cream, and specifically chosen to clear the deeper `#f4ecdf` footer at 4.76). Gold text on dark green = **`#e3bd52`** (6.95:1). |
| **The focus ring** | `#c48a1666` (gold at 40%) ≈ **1.6:1** — functionally invisible. | **`#a97612`**, 3px, `outline-offset: 2px` so the gap renders in the surface colour. 3.91:1 on page bg, 3.51 on cream. On dark surfaces: `#e3bd52`. |
| **Small muted text** — footnotes, info strip, footer copyright | `#6c7a76` = **4.41:1** on page bg, **3.82:1** on the footer. `#6f7a77` and `#687773` also fail. These are the *smallest* text on the page. | Nine muted greys collapse to **one token, `#5a6b66`** — ≥4.80:1 on every light surface we ship. Highest value-per-hour change in the whole system. |

Two more, worth naming: the gold button is fine (`#172c27` on `#c48a16` = 4.90:1) but must get **lighter** on hover (`#d3a32c`, 6.34:1) not darker. And `border-subtle #dfe7e1` on white is **1.42:1** — it is not a perceivable boundary, so a clickable card must never rely on its border as the affordance.

**Ship this rule verbatim in the README:**

```
GOLD RULE
#c48a16  → FILLS ONLY. Buttons, ≥3px rules, dots, the logo. NEVER text.
#a97612  → focus rings on light; gold text only ≥24px regular / ≥18.66px bold.
#8a6013  → ALL gold text on light surfaces, any size.
#e3bd52  → ALL gold text on dark-green surfaces.
```

### 5.3 Typography

**IBM Plex Serif (DE display) + IBM Plex Sans (DE body/UI) + IBM Plex Sans Arabic (all Arabic).** One superfamily; the Arabic was drawn to the same brief as the Latin with matched vertical metrics, so the two locales genuinely read as one brand rather than a bolted-on script. All SIL OFL, loaded through `next/font` — which self-hosts, so there is no request to `fonts.gstatic.com` and none of the DSGVO exposure that produced ~100,000 Abmahnungen after *LG München I, 3 O 17493/20*.

Weight sets are trimmed to hit the performance budget: Serif 600 only; Sans 400/600; Sans Arabic 400/600/700. **Locales never load each other's faces** — ~68 KB on `/de`, ~90 KB on `/ar`.

**Arabic is not "German in a different font."** Four things change, and this is where most bilingual sites fail:

- **Display sizes go *down* ~12–17%** (Arabic ascenders/descenders make headlines run taller and heavier — a Latin-sized Arabic h1 looks shouty and wraps to two lines).
- **Body sizes go *up* ~5–8%** (Arabic glyphs are optically smaller relative to the em).
- **Line-height increases substantially** — body 1.90 vs 1.65, h1 1.28 vs 0.96.
- **Letter-spacing must be exactly 0, and `text-transform` must never fire.** Positive or negative tracking *breaks the cursive joins* between Arabic letterforms. The eyebrow's `0.16em` tracking and `uppercase` are disabled in Arabic entirely.

Also: never `font-style: italic` in Arabic (the browser synthesises a sheared, broken join), and never justify Arabic text.

### 5.4 The bidi rule that will otherwise bite

Every Latin run inside Arabic copy — phone numbers, email addresses, `+49`, "Zukunft Service", street numbers — must be wrapped in `<bdi dir="ltr">`. Without it, **`+49 177 3825632` renders as `3825632 177 49+`** and the user **cannot dial the number**. This is the single most common Arabic-web bug and it *will* happen on the info strip, which now carries a confirmed phone number. Phone/email inputs get an explicit `dir="ltr"` so the user types in the right direction too.

### 5.5 Everything else

Full token set, the complete Tailwind v4 `@theme` block, component specs (buttons × 6 variants × every state, cards, inputs, the segmented language switcher, modal/sheet, FAB), the 4-easing/5-duration motion system, and the reduced-motion policy are in **[`docs/research/02-design-system.md`](./research/02-design-system.md)** and should be treated as the build spec.

One motion note worth surfacing: reveal-on-scroll elements must be **visible by default in CSS**, with JS *adding* the hide-then-reveal hook only after confirming motion is allowed. A site where `opacity: 0` is the CSS default is a blank page for anyone whose JS fails — unacceptable for a brochure site whose only job is being read.

---

## 6. Information architecture

**Hybrid: one rich home page plus six real service pages.** The reference puts all six services behind a JS modal on a single URL; that is wrong, and the reason is economic. The six verticals do not share a search results page — *"syrische Urkunden Dortmund"*, *"Studienvisum Unterlagen Hilfe"* and *"Reinigungsfirma Dortmund Gewerbe"* are unrelated query universes. A modal can't be linked, can't be shared into a WhatsApp group, can't carry a title, and can't be a Google Business Profile service link.

```
/                                    → 307 → /de
/de/                                 /ar/
/de/leistungen/einbuergerung-behoerden-dokumente   /ar/leistungen/…
/de/leistungen/ehe-uebersetzungen-dokumente        /ar/leistungen/…
/de/leistungen/studium-universitaet-visa           /ar/leistungen/…
/de/leistungen/finanzen-kredite-vorsorge           /ar/leistungen/…
/de/leistungen/immobilien-investitionen            /ar/leistungen/…
/de/leistungen/reinigungsservice                   /ar/leistungen/…
/de/kontakt/                         /ar/kontakt/
/de/impressum/                       /ar/impressum/     ← label stays German
/de/datenschutz/                     /ar/datenschutz/
/de/404                              /ar/404
```

**22 prerendered documents, 6 templates.** Slugs are Latin and defined once, so the language switcher is guaranteed a target and always lands on the **equivalent page** — never dumping the user back at the homepage, which the reference does and which is a guaranteed abandonment.

Dropped deliberately: a standalone About page (the client's material yields five bullets — a 90-word page is an SEO liability; it becomes `#ueber-uns` on home) and the `/leistungen/` hub (ships only if the client writes ~150 words of unique overview copy).

### Home page order

| # | Section | Purpose |
|---|---|---|
| 0 | Skip link + sticky header | nav, locale switch, **working mobile drawer** |
| 1 | Hero (split, cream) | position in 3 seconds |
| 2 | Two arms — Büroservice / Reinigungsservice | the mental model of the business |
| 3 | **★ 3-step process strip** | convert anxiety into clarity |
| 4 | Leistungen grid — 6 cards | the taxonomy; each a real link |
| 5 | Cleaning highlight panel (deep green) | the second buyer persona |
| 6 | Warum Zukunft Service — **5** cards | trust |
| 7 | **★ "Was wir tun – und was nicht"** | legal shield *and* trust signal |
| 8 | Kontakt (deep green) | **the one functional requirement** |
| 9 | Info strip | hours, address, phone, email, maps |
| 10 | Footer | **Impressum · Datenschutz**, slogan, © |
| 11 | WhatsApp FAB | this audience's default channel |

Changes worth defending: cleaning moves *into* the grid as card 06 (the client's own PDF makes it a peer service; the reference excluded it); "Warum" goes back to **5** cards, restoring *"Individuelle Unterstützung"* — which is precisely the point the Arabic PDF expands on most; and section 7 promotes the hedging from a grey footnote to a calm, confident band, which does three jobs at once (RDG/GewO protection, trust, and filtering out "can you represent me in court" enquiries before they reach the owner's inbox).

---

## 7. Content model

Six services with genuinely different internal shapes. The central modelling move: **do not** model "flat list service" and "sub-block service" as different types — that would make the *same service* two different types in two languages, which is unworkable.

Instead **every service is `ServiceBlock[]`**. A flat list is one untitled `list` block; sub-blocks are several titled ones. Same type, same renderer, and the two locales are free to differ in block *count* without differing in *type*.

```ts
export type ServiceBlock = ListBlock | HighlightBlock | ProseBlock | NoticeBlock;
export type ServiceContentMap = Record<Locale, Record<ServiceId, ServiceContent>>;
//                                     ↑ spine: both locales, all six, mandatory
//                                                            ↑ body inside is free
```

### The DE/AR asymmetry decision — the highest-risk call in the project

The Arabic PDF omits the entire "Auch nach der Ankunft" post-arrival block, merges the three finance sub-blocks into one flat list, has *richer* "Warum" copy than the German, and lists cleaning types differently.

**Decision: shared spine, per-locale body, explicit gap registry.**

- **Rejected: forced symmetry.** It would mean *we* author the missing Arabic — which is not translation, it is writing regulated marketing copy about visas and insurance in the customers' own language. Get a hedging verb wrong and the client carries the liability. It also silently converts "content is missing" into "content is wrong", the worst failure mode.
- **Rejected: two free-form trees.** The switcher couldn't guarantee a destination, hreflang pairs break, and nobody could answer "what's missing in Arabic?" without diffing by eye.

The **spine** (6 service ids, 5 why-points, nav, all UI microcopy, every `title`/`cardDescription`/`slug`/`seo`) is `Record<Locale, Record<Key, …>>` — TypeScript errors on any omission. The **body** (`blocks[]`, `items[]`) may diverge freely. A ~25-line `CONTENT_GAPS` registry plus an `auditParity()` CI check turns every divergence into a line the client initials, and unregistered drift into a build failure.

**Hard rule: never machine-translate hedged legal copy.** Any Arabic we author carries `status: 'draft-needs-client-approval'` and does not go live without written client sign-off.

Full types, a worked bilingual example, the six-vertical taxonomy, the copy-fit budget, and the DE/AR forbidden-phrasing lists are in **[`docs/research/01-content-and-ia.md`](./research/01-content-and-ia.md)**.

---

## 8. Technical architecture

**Next.js 16 App Router + React 19 + TypeScript 5.9 + Tailwind v4, every route prerendered.**

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Astro is the honest runner-up — it would ship less JS and is arguably the better tool for a pure brochure — but the brief hard-requires React as the handed-over artifact, and the React form island drags React back in anyway, shrinking the real saving to ~60 KB. A plain Vite SPA is rejected outright: no link previews, no server-rendered `hreflang`, and a visible LTR→RTL flash on every Arabic page load.

**Runtime dependencies — nine, ~25 KB gzipped total:** `next`, `react`, `react-dom`, `react-hook-form`, `zod`, `@hookform/resolvers`, `clsx`, `lucide-react`.

**Explicitly rejected:** framer-motion (~34 KB for what `@keyframes` does here, and CSS respects `prefers-reduced-motion` for free) · any i18n library (they all assume key symmetry; ours is asymmetric by design) · Radix/shadcn/headlessui (native `<dialog>` gives focus trap + Esc + `inert` + backdrop for 0 KB) · any state library (there is not one piece of state read by two unrelated subtrees) · React Query · carousel libraries (CSS `scroll-snap` is RTL-correct with no configuration; carousel libs need explicit `direction: 'rtl'` and negative-signed `scrollLeft` maths) · reCAPTCHA (US processor, consent trigger).

### RTL — three layers

1. **~95%: CSS logical properties** via Tailwind v4 (`ps-` `pe-` `ms-` `me-` `start-` `end-` `text-start` `border-s-` `rounded-s-`). **`pl-` `pr-` `ml-` `mr-` `left-` `right-` `text-left` `text-right` are banned**, enforced by a ~25-line `scripts/check-logical-props.mjs` in `npm run verify`. A code-review convention will not survive a deadline; a failing build will.
2. **~4%: `rtl:` / `ltr:` variants** for the few cases with no logical equivalent.
3. **~1%: custom `@utility` with a `[dir="rtl"]` override** — gradients, the one thing CSS has no logical syntax for.

**Shadows: mirroring is eliminated, not solved** — every shadow token has x-offset `0`. **Grid and flex mirror for free**, which is the real argument for building the split motif on Grid.

**Icons that mirror:** arrows, chevrons, step connectors. **Icons that must never mirror:** the logo, checkmarks, phone, mail, clock, map-pin, the WhatsApp glyph, photographs, any numeral. Implemented by *swapping the component* (`ArrowRight`↔`ArrowLeft`), not CSS-scaling — scaled strokes shift optical weight.

Full folder tree, the complete component inventory with real props interfaces, middleware, locale detection, and the performance plan are in **[`docs/research/03-frontend-architecture.md`](./research/03-frontend-architecture.md)**.

---

## 9. The contact form and the backend contract

This is the entire functional surface of the site. Everything else can be judged by eye; this is the only thing that can be *broken*.

**Two invariants everything depends on:**
1. **`submitContactForm()` never throws.** Every failure is a value in a discriminated union — no `try/catch` anywhere in a component, and the UI state machine is total.
2. **The backend developer changes zero frontend files in the happy path.** He sets one env var and implements a documented HTTP contract. If his API shape differs, he edits exactly one ~40-line function.

### Field order — deliberately not the conventional one

**Do not open with "Name."** Asking a user worried about their residency status to identify themselves first is the highest-friction possible opening.

1. **`Worum geht es?`** — service select, 6 options **+ `Sonstiges / Ich bin mir nicht sicher`**. That 7th option is the most important control on the form: the client's own headline is *"you don't know where to start?"*, so a required select with no escape hatch would contradict the brand promise.
2. **`Beschreiben Sie kurz Ihre Situation`** — the textarea, second, because it lets the user tell their story before being asked who they are.
3. **Name**, then **email** (required — it is the `Reply-To`), **phone** (optional, becomes required if WhatsApp opt-in is ticked).
4. Optional preferred contact time. Because the confirmed hours are uniform **10:00–16:00 Mon–Fri**, the options should be **`Vormittags (10–13 Uhr)` / `Nachmittags (13–16 Uhr)` / `Egal`** — never offer an evening slot the business cannot honour.
5. Honeypot, submit, privacy notice, hedging notice.

Phone validation is deliberately **permissive**: no `libphonenumber` (78–145 KB for one optional field), and the hint reads *"z. B. +49 oder +963"* — a form that implies German numbers only reads as exclusionary to exactly the audience this business serves. A false rejection on a phone field is a lost lead; the receiving human is the real validator.

The message field carries a hint asking users **not** to paste ID or case numbers — a genuine Art. 9 special-category risk reducer for a clientele that will absolutely try, and it costs one line of copy.

### The contract

```ts
export interface ContactFormPayload {
  name: string;                       // 2–80, no CR/LF
  email: string;                      // lowercased, trimmed. Reply-To — NEVER From
  phone: PhoneValue | null;           // { raw, e164, assumedCountry } — raw is authoritative
  whatsappOptIn: boolean;
  serviceCategory: ServiceCategory;
  message: string;                    // 10–2000, untrusted — escape before HTML email
  preferredContactTime: ContactTime;
  privacyNoticeVersion: string;       // which privacy text was shown
  locale: 'de' | 'ar';                // REPLY IN THIS LANGUAGE
  meta: { submittedAt, elapsedMs, linkCount, pagePath, timezone, clientVersion };
}

export type ContactFormResult =
  | { ok: true; referenceId: string | null }
  | { ok: false; error: ContactFormError };   // validation | rateLimited | network
                                              // | timeout | server | rejected | misconfigured
```

Five files (`types` · `config` · `http` · `mock` · `submit`), with `parseApiResponse()` marked as the only function the backend developer may need to touch. **The mock ships enabled by default**, with magic email addresses (`429@test.de`, `500@test.de`, `offline@test.de`, `slow@test.de`) that demo every UI state with no backend at all — which on a fixed-fee project is worth real money, because it lets the developer get sign-off and close out the UI phase without waiting on anyone.

Destination address is confirmed: **`info@zukunftservice.de`**.

### Non-negotiables for the backend developer

The full list is in the research report; three of them are the ones that silently destroy the feature:

- **`From:` must be the site's own domain, never the submitter's address.** Setting `From: user@gmail.com` fails Gmail's DMARC and the owner's notification is rejected or spam-filed. This is the most common contact-form mistake in existence.
- **SPF, DKIM and DMARC on `zukunftservice.de`.** Without them, notifications quietly disappear and the client concludes "the website doesn't work."
- **Strip `\r`/`\n` from any value interpolated into a mail header.** SMTP header injection. We block it at the edge too, but the edge is bypassable.

Plus: re-validate server-side with the same zod schema, rate limit (5/hr, 20/day per IP) returning `429` + `Retry-After`, reject non-`application/json`, honour `Idempotency-Key`, and never log the full message body.

**Spam: honeypot + a 3-second timing trap, and nothing else in v1.** Both traps trigger *silent success* — the bot logs a win and gets no signal to tune against. Turnstile/hCaptcha are deferred deliberately: they are US processors loaded on page render, which for a German site means a privacy-declaration entry, an AV-Vertrag, and an argument about consent gating your own contact form. If real spam appears, escalate to **Friendly Captcha** (German, EU-hosted) as a small paid change.

Full spec — every field's bilingual copy, the zod schema, the complete state matrix, ARIA wiring, draft persistence across a language switch, and the `.env` contract — is in **[`docs/research/04-contact-form-and-backend-contract.md`](./research/04-contact-form-and-backend-contract.md)**.

---

## 10. Compliance, accessibility and SEO

### The legal must-dos

**The Impressum obligation is now § 5 DDG, not § 5 TMG.** The TMG was replaced on 14 May 2024. Any generated boilerplate still citing "§ 5 TMG" is citing a repealed provision — and signals to an Abmahn-lawyer that nobody reviewed the site. There is **no small-business exemption**; a one-person Einzelunternehmen brochure site is fully in scope. The link must be labelled literally `Impressum` (case law has rejected "Kontakt", "Legal", "Info") and reachable in at most two clicks from every page. In Arabic keep the German word with a gloss: `Impressum — بيانات الناشر`.

Also: **the EU ODR platform shut down on 20 July 2025** — any boilerplate still linking `ec.europa.eu/consumers/odr` must be deleted; a dead link to a dead platform is now itself a defect.

**Why this matters commercially:** a missing or defective Impressum is actionable under § 3a UWG. Typical Streitwert €1,500–€5,000, first-letter fees €300–€900, and contractual penalties of €2,500–€5,100 per repeat. **Shipping without a complete Impressum can cost more than the entire project fee on the first letter.**

**The mitigation is mechanical, ~15 lines, and non-negotiable:** every still-missing Impressum field is typed with a `«…»` sentinel that renders loudly red in dev and **fails the production build**. Address, phone, email and hours are now confirmed (§2); the legal name, legal form, register data and licence details are not, and those sentinels stay armed until they are.

**We build the page shells and the renderer. The client supplies the remaining values, and the entire Datenschutzerklärung text** (lawyer, or eRecht24 / Dr. Schwenke). We are not lawyers and must not be the source of the legal text.

**Four regulated activities need a direct question to the client**, because each one — if licensed — *adds mandatory Impressum fields*, and if unlicensed makes the hedged copy load-bearing: **§ 34d GewO** (insurance mediation — "Lebensversicherung, Alters- und Zukunftsvorsorge" is squarely in this territory and is the highest-risk copy on the site), **§ 34c/§ 34i GewO** (real estate and loan brokerage, including the Dubai section), **RDG** (the naturalisation and authorities work), and **Handwerkskammer** registration for the cleaning arm.

**Enforce the hedging in the build, not in a document.** A copy constraint written in Word is violated within one edit cycle. Ship a banned-lexicon lint over `src/content/**` running in CI (`/\bwir beraten\b/i`, `/\bgarantier/i`, `/نضمن/`, `/استشارة\s*قانونية/`, …) plus a `<HedgeNotice>` component mandatory on the Finanzen, Immobilien and Behörden pages. **This converts a legal-exposure requirement into a build gate** — roughly 90 minutes, and the cheapest risk mitigation in the plan.

### No cookie banner — and the rules that hold that position

Zero cookies, zero `localStorage` of personal data, zero third-party requests ⇒ **§ 25 TDDDG is never triggered** ⇒ no banner. This is better at any budget: a banner costs design time, a11y work (it's a focus-trap modal on first paint), CLS budget, and conversion — it is a wall between an anxious first-time visitor and the page.

Hard rules that hold it: no Google Fonts CDN · no Maps iframe (address card + "In Google Maps öffnen ↗" link to `maps.google.com/?q=Ruhrallee+55+44139+Dortmund` instead) · no video embeds · no analytics in v1 · no CDN-hosted JS/CSS. Enforced by a build script that greps `dist/**` for any external origin and fails on a match, plus a `Content-Security-Policy` of `default-src 'self'`. One `localStorage` key is approved: the chosen locale, which is strictly necessary under § 25 Abs. 2 Nr. 2.

**Write this trigger into the handoff doc:** *"Adding any third-party script requires a consent banner and a revised Datenschutzerklärung. This is a scope change."*

### Accessibility

WCAG 2.2 AA as the build standard. Beyond the contrast fixes in §5.2: skip link as the first focusable element · proper landmarks and heading order · `scroll-padding-block-start` so hash anchors don't land under the sticky header · native `<dialog>` for the mobile nav (free focus trap, Esc, `inert`, focus return) · 44×44 minimum targets · error messages never colour-only · `aria-describedby` with the **error id first** so the problem is heard before the generic hint.

Two ARIA details that are routinely got wrong and are specified correctly here: individual field errors are **not** live regions (that produces a machine-gun of announcements while tabbing — they're announced via `aria-describedby` on focus and via the submit summary); and the error summary uses **focus movement alone, not `role="alert"`** — adding both causes a double announcement.

### SEO

Prerendered HTML per route is a hard requirement — it's simultaneously a legal argument (§ 5 DDG "ständig verfügbar"), an SEO requirement (hreflang and JSON-LD must be in the initial response), and the reason WhatsApp link previews work at all.

Per-page `<title>`/description formulas in both languages · hreflang clusters with `x-default` → German · `LocalBusiness` JSON-LD generated from the confirmed NAP (including the corrected `openingHoursSpecification` — Mo–Fr 10:00–16:00 — and `availableLanguage: [de, ar]`) · `BreadcrumbList` and `Service` on service pages · `sitemap.ts` and `robots.ts`.

**Set one expectation in writing now:** verticals 1–5 are long-tail and trust-driven. The real discovery engine for this business is **Google Business Profile + reviews + WhatsApp sharing**, not organic search. Only the cleaning vertical has genuine transactional search volume. GBP setup is a separate, named, priced deliverable — do not let it become an unbilled expectation of "the website project." Now that the NAP is confirmed, keeping it byte-identical across the site, the GBP listing and any directory is the cheapest local-SEO win available.

### Performance budget

Test device: a 3–5-year-old mid-range Android on a German mobile network, often on a prepaid data plan. Targets: **LCP ≤ 2.0 s · INP ≤ 150 ms · CLS ≤ 0.03 · initial JS ≤ 80 KB gz · fonts ≤ 110 KB per locale · third-party requests: 0.** Enforced by `size-limit` and Lighthouse CI as build-failing gates — a budget that isn't enforced by a failing build is a wish.

Free win available immediately: the reference site ships **~6.4 MB of unoptimised PNG**, including an 883 KB logo rendered at 168×68. Correct sizing plus AVIF/WebP drops the image payload by well over 90%.

Full detail — statute citations with sources, the complete a11y checklist, JSON-LD markup, keyword targets in both languages, the conversion playbook for this audience, and a 17-item risk register — is in **[`docs/research/05-compliance-seo-a11y-conversion.md`](./research/05-compliance-seo-a11y-conversion.md)**.

---

## 11. Conversion notes worth acting on

The visitor is on a phone, in the evening, holding a German letter they don't fully understand, has already been turned away from one Amt for a missing document, isn't sure whether contacting you costs money, and is quietly worried that contacting a private company could affect their case. Standard SaaS conversion patterns actively backfire here.

- **A real face and a real name is the highest-impact single element on the site.** This audience buys a person, not a company. One portrait with a first-person line beats four abstract benefit cards. *Open question: will the client publish a portrait? If not, this lever is gone and the design is materially weaker — ask early.*
- **"Wir sprechen Arabisch" must be visible on the German page**, in Arabic script, in the hero trust row — not hidden behind the language toggle. A large share of this audience lands on `/de/` from Google and needs to know in one second.
- **WhatsApp is co-equal with email, not a fallback.** The confirmed number is a mobile line (`+49 177…`), which strongly suggests WhatsApp is already the owner's working channel. Pre-fill the message with the service name so the user never faces a blank box; it also arrives pre-qualified. The client asked for email, so the form emails — *and* WhatsApp exists in parallel. Both.
- **Show the hours as a reassurance, not just data.** "Mo–Fr 10–16 Uhr" plus *"Außerhalb der Öffnungszeiten: schreiben Sie uns — wir melden uns am nächsten Werktag"* converts a closed-office moment into a captured lead instead of a bounce.
- **"Unverbindlich und kostenlos anfragen"** as microcopy directly under every primary CTA. Not in a footnote.
- **No stock photos of smiling business people.** This audience has seen a thousand scam pages and recognises stock instantly — it is worse than no photo. Three real phone photos of the actual office beat fifteen stock images.
- **No countdown timers, no "only 3 slots left."** Predatory-adjacent, poisons a trust-driven sale, and false scarcity is UWG-actionable in Germany anyway.
- **Specificity beats claims.** *"Wir organisieren syrische und irakische Personenstandsdokumente"* proves domain knowledge; *"Erfahren und zuverlässig"* is what every scam site says. The itemised lists **are** the trust signal — surface them, don't summarise them into benefit-speak.

---

## 12. Build plan

Milestones 1–8 build the site with German content (~35 h); milestone 9 adds the Arabic locale (~27 h). Both are in scope — the split just reflects the order of work, since every prior milestone is reviewed in both directions as it lands.

| # | Milestone | h | Verification |
|---|---|---|---|
| 1 | Scaffold, `@theme` tokens, fonts, `check-logical-props`, CI gates | 5 | `npm run verify` green; contrast spot-checks pass |
| 2 | UI primitives — Button, Card, Section, SplitSection, CheckList, MediaFrame, DirectionalIcon, NoticeCallout | 6 | Every variant × state rendered on a scratch page; keyboard-only pass |
| 3 | Layout — header, **mobile nav**, footer, skip link, locale switch, FAB | 5 | Nav traps focus, closes on Esc, returns focus; FAB sits bottom-inline-end in both dirs |
| 4 | Home sections 1–7 | 7 | 320 px → 1920 px with no horizontal scroll; reveal works with JS disabled |
| 5 | Contact form — fields, validation, all states, mock, contract | 6 | Every mock scenario demoed; error announced; summary takes focus |
| 6 | Service page template + 6 DE data objects | 4 | All 6 render; parity + banned-lexicon tests pass |
| 7 | Legal shells, SEO, JSON-LD, sitemap, robots, OG | 3 | Rich-results test passes; placeholder sentinel fails a prod build |
| 8 | Perf, images, a11y sweep, `HANDOFF.md` | 4 | Lighthouse ≥ 92/100/100/100 mobile; `size-limit` green |
| | *Subtotal — German site complete* | *~35* | |
| 9 | **Arabic locale** — content entry, RTL QA, bidi sweep, AR fonts | 27 | Every screen reviewed RTL; `<bdi>` on every Latin run; parity registry signed off |
| | **Total** | **~62** | |

**Review both directions at every milestone, never at the end.** Retrofitting RTL costs 3–4× building it in.

---

## 13. Top risks

| # | Risk | Mitigation |
|---|---|---|
| **R1** | Ships with a placeholder Impressum → § 3a UWG Abmahnung costing more than the fee | `«…»` sentinel **fails the production build**. Named client deliverable with a date. |
| **R2** | Client never supplies the remaining legal text / photos; fixed-fee project stalls | Numbered data request (§14). Contract clause: >14 days outstanding ⇒ deliver with placeholders and invoice. |
| **R3** | Copy drifts into unhedged claims → RDG / § 34d / § 34c / UWG exposure | Banned-lexicon lint in CI + `<HedgeNotice>` on the three highest-risk pages + written note that a lawyer should review final copy. |
| **R4** | A third-party asset sneaks in (a pasted Google Fonts link, a Maps iframe) → the whole no-banner position collapses | Build script greps `dist/**` for external origins and fails. CSP `default-src 'self'` enforces it at runtime. |
| **R5** | Scope creep against a fixed fee | Signed IN/OUT table with a **stated price** on every OUT item, so "yes, and it costs €X" is always available. |
| **R6** | RTL bugs found late — mirrored padding, `49+` phone numbers, FAB on the wrong side | Logical properties from commit 1, enforced by a build check. Review both directions every milestone. |
| **R7** | Email deliverability fails; client concludes "the website is broken" | Flag SPF/DKIM/DMARC on `zukunftservice.de` in `HANDOFF.md` in writing. Backend-owned, but the complaint lands on the frontend developer. |
| **R8** | Client expects page-one Google rankings from the site alone | Set the expectation now: GBP + reviews + WhatsApp sharing is the discovery engine. Price GBP separately. |

---

## 14. Open questions — still outstanding

Address, phone, email and hours are **confirmed** (§2). What remains:

**Blocking the build:**

1. **Exact legal name and legal form** (Einzelunternehmen / GbR / UG / GmbH), plus Handelsregister court + number if registered, and USt-IdNr. — or confirmation of Kleinunternehmer status under § 19 UStG.
2. **Do they hold § 34d GewO (insurance), § 34c/§ 34i GewO (real estate/loans), or Handwerkskammer registration?** Each adds mandatory Impressum fields and changes how far the copy may go. The finance and Dubai sections depend on the answer.
3. **Who supplies the Datenschutzerklärung text, and by when?**
4. **Who reviews and signs off the Arabic before launch?** Scope is full bilingual, so this is on the critical path. Any Arabic we author for gaps in the client's PDFs describes regulated activities and needs a named human to approve the wording.

**Blocking the design:**

5. **Real photos or none?** Only four images exist, all AI-generated stock, and the people in them read as European while the audience is Arabic-speaking Syrians and Iraqis — which undercuts the "mehrsprachig" trust promise. Ninety minutes with a modern phone beats any stock library here.
6. **Will the client publish a portrait and their name?** Highest-impact trust element on the site.
7. **Logo source files** — SVG or ≥1000px transparent PNG. Is there an Arabic lockup variant?
8. **Which slogan?** Three are in circulation: `Viele Anliegen. Ein Ansprechpartner.` (PDF), `Viele Lösungen. Ein Ansprechpartner.` (PDF footer), `Viele Leistungen. Eine Anlaufstelle.` (live site). Pick one.
9. **Two golds acceptable?** We ship `#c48a16` for fills and `#8a6013` for gold text. The client asked us to "match the colours" and will see two. Show a comparison before build.
10. **Arabic numerals** — Western `0–9` (recommended: the audience transacts with German forms and phone numbers) or Eastern `٠–٩`?
11. **Arabic grammatical gender** — masculine-singular default, or dual-form? A cultural call the client should make.

**Blocking launch:**

12. **What response time will the client commit to?** It goes on the page. A promised 24 h that becomes 5 days is worse than promising 2–3 working days and hitting it.
13. **Was the Arabic omission of the post-arrival support block deliberate or an oversight?** Everything about the audience says oversight — it is the strongest differentiator in the whole deck and Arabic-speaking students are exactly who needs it.
14. **Hosting and domain** — `zukunftservice.de` presumably exists (the email is on it); who owns the accounts, is hosting in the EU, is an AVV in place, and does the $700 include deployment?
15. **Any analytics, ever?** If yes, the no-banner position ends and the privacy declaration must be rewritten.
16. **Is a third locale (EN/TR) coming?** The architecture supports it; do not build it now, but confirm so nobody later assumes it was designed out.
17. **Tell the client their current draft site shows outdated opening hours** (Thu 10–15, Fri 10–13 instead of 10–16). Small, but it is wrong information in front of customers today.

---

## 15. Handoff deliverables

Source repo · `HANDOFF.md` (the backend contract, the env vars, the one file to edit, the mock scenarios, the SPF/DKIM/DMARC warning, and the "third-party script = scope change" trigger) · `docs/DESIGN-TOKENS.md` (semantic tokens + the gold rule) · `.env.example` · an 18-item bilingual QA checklist · the `npm run verify` gate · a recorded bundle-analyzer result · and this plan plus the six research reports in `docs/`.

---

## Notes on this document

Five of twelve planned agents completed. The two design-concept agents, the synthesizer, three adversarial critics and the finalizer were lost to a session limit. Consequences worth knowing:

- **The design concept in §4 is a convergence of the research, not a competed-and-judged winner.** It is well-supported but it has not been adversarially tested.
- **The effort estimate in §3 is mine, not a specialist's** — summed from the research reports' own numbers. Scope is confirmed as full bilingual, so ~62–66 h is the planning figure to work against.
- **Conflicts between reports were adjudicated by hand.** The four real ones: Arabic-script vs Latin slugs (chose Latin — encoding risk and switcher reliability); modal vs real service pages (chose pages, 2-to-1); the typeface pairing (chose the design system's IBM Plex superfamily over two competing suggestions); and the DSGVO consent checkbox — where the compliance specialist argues *against* the checkbox that two other reports mandate. **I followed the compliance specialist and flagged it for the client's lawyer**, since a contact form's legal basis is Art. 6(1)(b)/(f) rather than consent. It is a one-line flag either way.
- Environment variables in the contact-form report are written `VITE_*` because that agent assumed Vite; under the chosen Next.js they become `NEXT_PUBLIC_*`. Same contract otherwise.
- The research reports were written before the client confirmed the NAP data, so several of them still list address, phone, email and hours as unverified placeholders. **§2 of this document supersedes them** — and note the corrected opening hours.
