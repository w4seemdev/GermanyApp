# PROJECT BRIEF — "Zukunft Service" marketing website (UI only)

## 1. Engagement facts

- **Freelance project, fee: $700 USD.** Scope discipline matters; this is a small-budget job.
- **Deliverable: PURE UI ONLY.** React + TypeScript + Tailwind CSS. No backend, no database, no auth.
- The developer hands the finished UI to a **separate backend developer** who wires up the real work.
- **Current phase: PLANNING ONLY.** No code is being written yet. The output of this phase is a plan.
- Working directory `c:\Users\Dell\Desktop\Ui` is **completely empty**. Node v22.19.0, npm 10.9.3 available. Windows 11, PowerShell.
- Client's own words (Levantine Arabic, paraphrased): *"He's a business owner who opened a new business and wants a website, but purely as a **show-off / showcase** site that presents the business info — and all he needs is that an **email reaches him from the form the user filled in**."*
  - Translation of intent: **brochure/showcase site + one working contact form that emails the owner.** Nothing more. No dashboard, no CMS, no user accounts, no payments, no booking system.
- The developer said: *"I was thinking build it like split app concept."* — This phrase is **ambiguous**; treat both readings and recommend:
  - (a) **Split-screen layout** as the signature visual motif (the reference site's hero is literally a split grid), or
  - (b) **Split architecture** — clean UI/API separation so the backend dev only fills in one seam.
- User instruction: **"work with multiagents"** — multi-agent planning is expected and wanted.

## 2. The business — "Zukunft Service"

A German-based, multilingual (German + Arabic) **one-stop service agency** for immigrants/expats, primarily serving Arabic-speaking (Syrian and Iraqi) communities in Germany, plus a **commercial cleaning arm**.

- **Legal/marketing name:** Zukunft Service
- **Logo lockup:** dark green document-with-checkmark + broom + gold sparkles + sage-green leaf
- **Logo subtitle:** `DIENSTLEISTUNGEN & REINIGUNG` (Services & Cleaning)
- **Logo tagline (gold script):** `Alles aus einer Hand` (Everything from one hand / All from a single source)
- **German slogans in use:**
  - `Viele Anliegen. Ein Ansprechpartner.` (Many concerns. One contact person.)
  - `Viele Lösungen. Ein Ansprechpartner.` (Many solutions. One contact person.) — used as page footer/running header
- **Arabic slogan:** `خدمات متعددة... وجهة واحدة` (Multiple services... one destination)
- **Positioning line (DE):** "Ob Behörden, Dokumente, Studium, Visa, Finanzen, Immobilien oder Reinigung: Zukunft Service unterstützt Sie bei organisatorischen und alltäglichen Anliegen - persönlich, verständlich und Schritt für Schritt."

### CRITICAL LEGAL/POSITIONING CONSTRAINT
The German source copy is **very carefully worded** to avoid claiming to be a licensed legal, tax, or immigration advisor (in Germany, *Rechtsberatung* is regulated by the **RDG / Rechtsdienstleistungsgesetz**, and tax advice by the **StBerG**). Notice the repeated hedging verbs:
- "**Unterstützung bei** der Vorbereitung…" (support with preparing)
- "**Organisation und Beschaffung**…" (organizing and obtaining)
- "**Vorbereitung von** Unterlagen…" (preparation of documents)
- "**Vermittlung an** geeignete Partner / Fachstellen" (referral to suitable partners / specialist offices)
- "**über geeignete Partner** vermitteln wir…" (via suitable partners we broker…)

**The website copy MUST preserve this hedging.** Never write "we do your naturalization", "we get you a visa", "we give you legal advice", "wir beraten Sie rechtlich", or "guaranteed". Always: *support with, prepare, organize, structure, refer to a suitable partner.* This is a real legal exposure for the client and a genuine value-add the plan must call out.

## 3. Full service taxonomy (from client's German + Arabic PDFs)

### Section 1 — Einbürgerung, Behörden & Dokumente / الجنسية، المعاملات الرسمية والوثائق
Intro (DE): "Behördliche Verfahren und Dokumente können kompliziert und zeitaufwendig sein. Wir unterstützen Sie bei der Vorbereitung Ihrer Unterlagen und bei den organisatorischen Schritten rund um Ihr Anliegen."
Items:
- Unterstützung bei der Vorbereitung von Einbürgerungsanträgen
- Zusammenstellung und Prüfung der erforderlichen Unterlagen
- Hilfe beim Ausfüllen von Formularen und Anträgen
- Unterstützung bei Schriftverkehr und Kommunikation mit Behörden
- Organisation und Beschaffung syrischer Dokumente
- Organisation und Beschaffung irakischer Dokumente
- Unterstützung bei Angelegenheiten rund um syrische und irakische Reisepässe
- Geburtsurkunden, Heiratsurkunden und Personenstandsdokumente
- Register- und Personenstandsauszüge (AR: إخراج القيد / بيانات الولادة)
- Vorbereitung von Unterlagen für Beglaubigungen und weitere amtliche Verfahren
Closing CTA (DE): "Sie wissen nicht, welche Unterlagen Sie benötigen? Sprechen Sie uns an - wir helfen Ihnen, die nächsten Schritte übersichtlich zu strukturieren."

### Section 2 — Ehe, Übersetzungen & internationale Dokumente / الزواج، الترجمة وتصديق الوثائق
Intro (DE): "Wir unterstützen Sie bei ausländischen Dokumenten und organisatorischen Fragen rund um Übersetzung, Beglaubigung und Eheschließung."
Items:
- Übersetzung von Dokumenten über geeignete Übersetzer
- Vorbereitung von Unterlagen für Beglaubigungen
- Vorbereitung ausländischer Urkunden für deutsche Behörden
- Heiratsurkunden und weitere Dokumente zur Eheschließung
- Unterstützung bei der Registrierung und Anerkennung von Eheschließungen in Deutschland
- Beschaffung fehlender Personenstands- und Familienstandsdokumente
Sub-block **Übersetzungsservice**: "Über unser Netzwerk vermitteln wir Übersetzer für unterschiedliche Anliegen, zum Beispiel für Behörden, Dokumente, Termine, Anträge sowie persönliche oder geschäftliche Unterlagen."

### Section 3 — Studium, Universität & Visa / الدراسة، الجامعات والتأشيرات
Intro (DE): "Sie möchten in Deutschland oder Europa studieren oder benötigen Unterstützung bei der Vorbereitung eines Visumantrags? Wir helfen Ihnen bei den organisatorischen Schritten."
**Studium & Universität:**
- Suche nach passenden Studienmöglichkeiten
- Unterstützung bei Hochschulbewerbungen
- Vorbereitung und Zusammenstellung der Bewerbungsunterlagen
- Unterstützung bei Zulassungsverfahren
- Organisation erforderlicher Dokumente
- Vorbereitung von Unterlagen für ein Studienvisum
**Visa:**
- Studienvisa
- Schengen-Visa
- Touristenvisa
- Besuchsvisa
- Vorbereitung und strukturierte Zusammenstellung der erforderlichen Unterlagen
**Sub-block "Auch nach der Ankunft sind wir für Sie da"** (a real differentiator — post-arrival support):
Intro: "Unsere Unterstützung endet nicht mit dem Visum oder der Einreise nach Deutschland. Gerade in der ersten Zeit begleiten wir Studierende bei den wichtigsten organisatorischen Schritten und helfen dabei, den Start in Deutschland so einfach wie möglich zu gestalten."
- Suche nach einer geeigneten Unterkunft
- Unterstützung bei der Anmeldung beim Einwohnermeldeamt
- Orientierung und Begleitung bei wichtigen Behördengängen
- Vorbereitung notwendiger Unterlagen
- organisatorische Unterstützung rund um Universität und Studienbeginn
- Orientierung bei den ersten Schritten im Alltag in Deutschland
Closing: "Vom ersten Antrag bis zu den ersten Schritten in Deutschland - wir begleiten Sie auf Ihrem Weg."

### Section 4 — Finanzen, Kredite & Vorsorge / الأمور المالية، القروض والتأمين
Intro (DE): "Bei finanziellen Themen unterstützen wir Sie organisatorisch und vermitteln bei Bedarf an geeignete Partner oder Fachstellen."
**Kredite & Finanzierung:** Vorbereitung von Kreditanfragen / Zusammenstellung erforderlicher Unterlagen und Nachweise / Unterstützung bei Finanzierungsanfragen / Vermittlung an geeignete Finanzierungspartner / Vorbereitung einer möglichen Immobilienfinanzierung
**Finanzielle Schwierigkeiten & Insolvenz:** Sortierung und Vorbereitung finanzieller Unterlagen / Organisatorische Vorbereitung einer möglichen Privatinsolvenz / Kontaktaufnahme mit geeigneten Beratungsstellen oder Fachpartnern / Zusammenstellung erforderlicher Dokumente
**Versicherungen & Vorsorge** ("Über geeignete Partner vermitteln wir Unterstützung zu Themen wie:"): Lebensversicherung / Alters- und Zukunftsvorsorge / Absicherung der Familie / Sterbegeld- und Bestattungsvorsorge / weitere Versicherungsangebote je nach Bedarf
> NOTE: this section is the highest legal-sensitivity area (insurance brokerage in Germany requires §34d GewO licensing; debt counselling is regulated). The hedging language is doing heavy lifting here.

### Section 5 — Immobilien & Investitionen / العقارات والاستثمار
Intro (DE): "Sie möchten eine Immobilie kaufen oder interessieren sich für Investitionsmöglichkeiten? Wir unterstützen Sie bei der Orientierung, Vorbereitung und Vermittlung an passende Ansprechpartner."
**Immobilien in Deutschland:** Orientierung rund um den Immobilienkauf / Vorbereitung einer möglichen Immobilienfinanzierung / Zusammenstellung benötigter Unterlagen / Kontakt zu geeigneten Partnern / Strukturierung der nächsten Schritte beim geplanten Immobilienkauf
**Immobilien & Investitionen in Dubai:** Informationen zu verfügbaren Immobilienprojekten / Vermittlung von Immobilienangeboten in Dubai / Kontakt zu Projektentwicklern und Partnern / Organisation von Gesprächen und Terminen / Begleitung des Vermittlungsprozesses
Closing: "Ein Ansprechpartner in Deutschland - für Ihre Möglichkeiten in Dubai." (AR: نقطة تواصل واحدة في ألمانيا لفرصك الاستثمارية في دبي)

### Section 6 — Reinigungsservice / خدمات التنظيف
Intro (DE): "Neben unseren Büro- und Servicedienstleistungen bieten wir professionelle Reinigung für Privatkunden, Unternehmen und Einrichtungen."
"Wir reinigen unter anderem": Büros / Wohnungen / Häuser / Schulen / Restaurants / Geschäfte / Praxen / Gewerberäume / Treppenhäuser / Gemeinschaftsflächen
Closing: "Ob einmalige Reinigung oder regelmäßiger Reinigungsservice - wir finden eine passende Lösung für Ihren Bedarf."

### "Warum Zukunft Service?" / لماذا Zukunft Service؟
- Persönliche Betreuung und ein direkter Ansprechpartner (personal support, one direct contact)
- Viele Leistungen aus einer Hand (many services from one source)
- Mehrsprachige Unterstützung (multilingual support — AR version elaborates: "we help people who struggle with German paperwork/institutions because of the language")
- Zusammenarbeit mit geeigneten Partnern und Fachstellen (network of partners and specialists)
- Individuelle Unterstützung passend zu Ihrem Anliegen (AR version adds: "clear and simple steps — our goal is that you know what's required of you and what the next step is, without complication")

### Final CTA
DE: "Sie haben ein Anliegen und wissen nicht, wo Sie anfangen sollen? Kontaktieren Sie uns und schildern Sie uns kurz Ihre Situation. Wir prüfen gemeinsam, welche Unterstützung für Ihr Anliegen passend ist."
AR: "لديك معاملة ولا تعرف من أين تبدأ؟ تواصل معنا واشرح لنا موضوعك باختصار. سنساعدك في معرفة الخطوات المناسبة والخدمات التي تحتاجها."

### NOTE on DE/AR content parity
The Arabic PDF is **not a 1:1 translation**. Differences the content model must handle:
- AR section 3 **omits** the "Auch nach der Ankunft" (post-arrival) block entirely.
- AR section 4 merges Kredite + Insolvenz + Versicherungen into one flat list.
- AR "Warum" block has **richer, more explanatory** copy than the DE bullets.
- AR cleaning list includes "المنازل" (houses) AND "الشقق" (apartments) as separate items; DE has Wohnungen + Häuser.
- Arabic uses colloquial-friendly, reassuring second-person tone ("نساعدك على…"), German uses formal Sie-form.
→ Do **not** assume symmetric translation keys will just work. Plan for per-locale content that may differ structurally.

## 4. Reference site — EXACT extracted design system

Client pointed at `https://zukunft-service.khaledalmadi222.chatgpt.site/` and said **"make our website's colors look like this one."**
It is a same-business draft (likely an AI-generated/other-freelancer version). We match the **color system and brand feel**, but must deliver a **distinctly better, non-cloned** layout — the client is paying for an upgrade, not a copy.

Its stack (detected): Vite + React RSC + Tailwind v4 base layer + hand-written CSS. Single page, hash anchors, `.rtl` class toggle, service-detail modal.

### Exact `:root` tokens (verbatim from its stylesheet)
```css
:root{
  --green: #075344;  /* primary brand green */
  --deep:  #043b32;  /* darkest green — h1/h2 headings, contact section bg */
  --sage:  #769b7e;  /* muted sage (from the logo leaf) */
  --gold:  #c48a16;  /* accent gold — eyebrows, links, CTA, focus ring */
  --cream: #f7f0e5;  /* warm cream — hero + alternating section bg */
  --ink:   #19312c;  /* body text */
}
body { color: var(--ink); background: #fffdf9; font-family: Arial, Helvetica, sans-serif; }
html { scroll-behavior: smooth; }
.rtl { font-family: Arial, Tahoma, sans-serif; }
```

### Full derived / secondary palette actually used in its CSS
| Hex | Role |
|---|---|
| `#fffdf9` | page background (warm off-white) |
| `#f7f0e5` | cream section bg (hero, "why") |
| `#f5f7f3` | services section bg (cool grey-green) |
| `#e8f0e9` | cleaning feature-card bg (mint) |
| `#edf2ed` | image placeholder / letterbox bg |
| `#f4ecdf` | footer bg (deeper cream) |
| `#fbfcfa` | form input bg |
| `#ffffff` | cards, form card, info strip, lang pill |
| `#ffffffa8` | translucent white card on cream ("why" grid) |
| `#fffdf9f0` | sticky header bg (with `backdrop-filter: blur(14px)`) |
| `#4f625e` | hero paragraph text |
| `#61716d` | section subtitle / card body text |
| `#566864` | feature-card paragraph |
| `#5c6e69` / `#50625e` / `#526762` | muted body variants |
| `#6c7a76` / `#687773` / `#6f7a77` | small / footnote text |
| `#dfe7e1` | service-card border |
| `#cdd9d5` | input border |
| `#e2e8e5` | info-strip divider |
| `#0753441a` | header bottom border (green @ 10%) |
| `#07534440` | lang-pill border (green @ 25%) |
| `#c48a168c` | clickable-card border (gold @ 55%) |
| `#c48a1666` | focus-visible outline (gold @ 40%) |
| `#172c27` | text color on gold button |
| `#ffffff33` | list divider inside green panel |
| `#03231db8` | modal backdrop (+ `backdrop-filter: blur(7px)`) |
| `#033b32e0` | gallery figcaption bg |
| `#25d366` | WhatsApp brand green (floating FAB) |

### Typography
- **Headings:** `Georgia, serif` — h1 `clamp(48px, 6.2vw, 90px)`, `line-height: .96`, `letter-spacing: -.045em`, color `--deep`
- **Section h2:** `clamp(34px, 4vw, 54px)`, `line-height: 1.08`
- **Feature-card h3:** 32px Georgia · **Service-card h3:** 23px Georgia · **Info-strip h3:** 28px Georgia
- **Body:** `Arial, Helvetica, sans-serif`; hero lead 19px/1.75; section sub 18px/1.6; card body ~16px/1.65
- **Eyebrow:** 12px, `font-weight: 900`, `letter-spacing: .16em`, `text-transform: uppercase`, color `--gold`
- **Nav links:** 14px / 700 · **Buttons:** 800 · **Gold links & accents:** 900
- **RTL override:** `.rtl .hero h1 { letter-spacing: 0; line-height: 1.16 }` — Arabic needs looser leading, zero tracking
- No webfonts loaded — 100% system fonts (fast, but visually generic; an upgrade opportunity)

### Radii
`999px` (pill/lang switch) · `50%` (circle FAB/close) · `22px` (modal, `22px 22px 0 0` on mobile sheet) · `20px` (feature card) · `18px` (cleaning panel, form card) · `14px` (service card) · `8px` (buttons) · `7px` (inputs, figcaption)

### Shadows
- card hover: `0 15px 35px #07534417`
- FAB: `0 10px 25px #00000038`
- modal close btn: `0 4px 16px #00000026`
- modal: `0 30px 90px #00000052`

### Gradients (only one motif — image edge fade into cream)
- LTR: `linear-gradient(90deg, var(--cream), transparent 22%)`
- RTL: `linear-gradient(-90deg, var(--cream), transparent 22%)`
- mobile: `linear-gradient(0deg, var(--cream), transparent 30%)`

### Motion
Only `transition: all .2s` on `.service-card` + `transform: translateY(-4px)` on hover. Essentially no motion design — a clear upgrade opportunity (but respect `prefers-reduced-motion`).

### Layout / spacing rhythm
- Header: sticky, `height: 88px` (74px @640), `padding: 10px clamp(22px, 6vw, 90px)`, backdrop blur, `z-index: 50`
- Logo img: `168×68` (124×58 @640); footer logo `180×90` (155 @640)
- Section padding: `110px clamp(24px, 7vw, 110px)`; `75px 20px` @640
- Hero: `grid-template-columns: 1.03fr .97fr`, `min-height: 720px`
- Service split: 2 cols, gap 24px, `max-width: 1240px`
- Service grid: `repeat(3, 1fr)`, gap 16px, card `min-height: 240px`, padding 32px
- Why grid: `repeat(4, 1fr)`, gap 18px, `border-top: 3px solid var(--gold)`
- Contact: `.8fr 1.2fr`, gap 80px, form is a 2-col white card w/ `.full` span class
- Info strip: `1.2fr .8fr`, gap 100px, padding `72px …`
- **Breakpoints: `980px` and `640px` only.** At 980: nav hidden (⚠️ **no mobile menu replacement — a real bug in the reference**), hero stacks with image `order:-1`, grids → 2col. At 640: everything → 1col, buttons full-width.

### Its section order (for reference — we should improve on it)
1. Sticky header (logo, nav: Start · Leistungen · Über uns · Kontakt, `العربية` lang pill)
2. Hero (split, cream, eyebrow + h1 + lead + 2 CTAs + trust row + faded image)
3. Service split — 2 big feature cards (Büroservice / Reinigungsservice)
4. Services grid — 6 clickable cards (opens detail modal) on `#f5f7f3`
5. Cleaning panel — green block with 2-col checklist
6. "Warum" — 4 cards on cream with gold top-border
7. Contact — deep-green section, white 2-col form card (name, phone, service type, description, preferred contact time) → **submits to WhatsApp**, not email
8. Info strip — white; hours, address, phone, email, Google Maps link
9. Footer — `#f4ecdf`, logo + links + copyright
10. Floating WhatsApp FAB (bottom-right; bottom-**left** in RTL)
11. Service-detail modal — `max-width: 1060px`, image gallery + copy + notice callout + WhatsApp CTA

### Known weaknesses of the reference (our opportunities)
- No mobile navigation at all below 980px (nav simply `display: none`)
- System fonts only — generic, no brand typography
- Near-zero motion/micro-interaction design
- Form goes to **WhatsApp**, not email — our client explicitly wants **email**
- No visible Impressum / Datenschutzerklärung links
- Accessibility: unclear focus management on modal, no skip link, gold `#c48a16` on white is ~3.4:1 (fails WCAG AA for normal text)
- Single flat page; no per-service deep pages for SEO

## 5. Hard requirements for OUR build

1. **React + TypeScript + Tailwind CSS.** UI only.
2. **Bilingual German + Arabic with full RTL.** German is the default/primary locale. This is non-negotiable given the client's own bilingual PDFs and target audience.
3. **Contact form that produces an email to the owner** — the single functional requirement. We build the complete UI + validation + all states; the backend dev implements the send. Must be a *clean, documented, typed seam*.
4. **Match the brand palette above** (green/deep/sage/gold/cream/ink).
5. **Showcase/brochure site.** Presentational. No app-like complexity.
6. Must be **handoff-ready** for a backend developer who did not write the frontend.
7. Budget $700 → the plan must be **honest about scope**, name what is IN and what is explicitly OUT/paid-extra.

## 5b. REAL BUSINESS DATA — recovered from the reference site's HTML (HIGH CONFIDENCE, verify with client)

I scraped these directly out of the reference site's markup. **Use these as the working values** in the plan (content model examples, JSON-LD, footer, Impressum shell, `wa.me` link construction), but mark them "client to confirm."

| Field | Value |
|---|---|
| **City** | **Dortmund, Germany** (this was previously unknown) |
| Address | `Ruhrallee 55, 44139 Dortmund` |
| Phone / WhatsApp | `+49 177 3825632` → `https://wa.me/491773825632` |
| Email | `info@zukunftservice.de` |
| Google Maps | `https://maps.google.com/?q=Ruhrallee+55+44139+Dortmund` |
| `<html lang>` | `de` (reference has NO Arabic `lang`/`hreflang` — an SEO bug we fix) |
| Page title | `Zukunft Service | Dienstleistungen & Reinigung in Dortmund` |
| Meta description | `Büroservice, Dokumentenhilfe und professioneller Reinigungsservice in Dortmund – persönlich, mehrsprachig und zuverlässig.` |
| Copyright line | `© 2026 Zukunft Service · Rechtliche Angaben werden vor der öffentlichen Veröffentlichung ergänzt.` |

### Opening hours (already published bilingually — note the DE/AR inline pairing)
| Day | Hours |
|---|---|
| Montag / الاثنين | 10:00–16:00 |
| Dienstag / الثلاثاء | 10:00–16:00 |
| Mittwoch / الأربعاء | 10:00–16:00 |
| Donnerstag / الخميس | 10:00–15:00 |
| Freitag / الجمعة | 10:00–13:00 |
Footnote: "Termine außerhalb der Öffnungszeiten nach Vereinbarung." (Appointments outside opening hours by arrangement.) Saturday/Sunday closed — not listed.
→ This is exact `openingHours` data for schema.org LocalBusiness JSON-LD.

### Existing image assets — I downloaded and inspected all four

| File | Dimensions | Weight | Depicts |
|---|---|---|---|
| `zukunft-logo.png` | 1206×812 | **883 KB** | The logo lockup (document+broom+sparkles+leaf, "Zukunft Service", "DIENSTLEISTUNGEN & REINIGUNG", gold script "Alles aus einer Hand") |
| `zukunft-hero.png` | 1672×941 | **1.67 MB** | Consultation scene: an advisor in a dark-green blazer reviewing documents with a client at a light-wood desk; cream walls, plants, gold tray, dark-green cabinet |
| `zukunft-buero-arabic.png` | 1448×1086 | **1.91 MB** | Office/paperwork scene (Arabic-locale variant) |
| `zukunft-reinigung.png` | 1448×1086 | **2.00 MB** | A cleaner in a **dark-green uniform** wiping a desk in a bright office; green cleaning cart, plants, green accent wall |

**Total: ~6.4 MB of unoptimized PNG.** The logo alone is 883 KB and is rendered at 168×68 — roughly a 100× oversupply. This single fact is the biggest, cheapest performance win available to us: convert to WebP/AVIF at correct display sizes with `srcset`, and the image payload drops by well over 90%. Put a real number on it in the performance section.

**Art direction is genuinely on-brand** — both photos are built around dark green, warm wood, cream walls and greenery, matching `--green`/`--cream`/`--gold` almost exactly. We can and should reuse them. The hero in particular has a large empty cream wall on the left, which is *why* the reference fades cream over it — it was chosen/generated for text overlay. Our hero must preserve a safe text area or re-crop.

**Caveats to flag:**
- These are clearly **AI-generated stock**, not photographs of the real office, real team, or real work. The client may or may not care; the plan should ask.
- ⚠️ **Audience-fit concern:** the people shown read as White/European, while the stated target audience is Arabic-speaking Syrian and Iraqi communities. For a business whose core promise is *"Mehrsprachig — we help you overcome the language barrier,"* imagery that doesn't reflect the audience undercuts the trust signal. Worth raising with the client as a conversion issue, not a political one.
- Only **four** images exist. Any concept requiring distinct per-service photography (6 verticals × imagery) needs new assets — a real cost/time risk. Prefer concepts that lean on typography, iconography and color fields over photo volume.

### ⚠️ The client's own legal disclaimer — already live on the reference site
> "**Hinweis:** Wir bieten organisatorische und sprachliche Unterstützung und vermitteln bei Bedarf an geeignete Fachstellen. **Keine Rechtsberatung.**"
> (Note: We provide organizational and linguistic support and refer to suitable specialist offices where needed. **No legal advice.**)

This CONFIRMS the legal-hedging constraint in section 2 is real and client-acknowledged. **Our site must carry this disclaimer prominently** (at minimum near the services and in the footer), in both DE and AR. Draft the Arabic equivalent.

Also note the footer admits: *"Rechtliche Angaben werden vor der öffentlichen Veröffentlichung ergänzt"* — the client **knows** the Impressum is missing and is deferring it. Our plan must make this a tracked blocker, not an afterthought.

### The reference site's ACTUAL 6-card service taxonomy (differs from the PDF's 6 sections — reconcile these)
| # | Card title (DE) | Card description (DE) |
|---|---|---|
| 01 | Einbürgerung & Behörden | Anträge, Formulare, Korrespondenz und Vorbereitung erforderlicher Unterlagen. |
| 02 | Dokumente & Personenstand | Syrische und irakische Dokumente, Reisepässe, Geburts- und Heiratsurkunden. |
| 03 | Eheschließung & Übersetzung | Vorbereitung, Übersetzung und Beglaubigung ausländischer Unterlagen. |
| 04 | Studium & Visa | Hochschulsuche, Bewerbungen, Zulassung sowie Studien-, Besuchs- und Schengenvisa. |
| 05 | Finanzen & Vorsorge | Unterlagen für Kredite, Finanzierungen, Versicherungen und erste Schritte bei Privatinsolvenz. |
| 06 | Immobilien & Investitionen | Unterstützung beim Immobilienkauf in Deutschland und bei Investitionsmöglichkeiten in Dubai. |

Note it **splits PDF section 1 into two cards** (Einbürgerung&Behörden / Dokumente&Personenstand) and treats Reinigung as a separate *Leistungsbereich* rather than a 7th card. The content architect should decide which taxonomy we ship and justify it.

### ⭐ The reference's top-level framing — strong validation of the "split" concept
It opens with: **"Wie können wir Ihnen helfen? Zwei Leistungsbereiche, ein verlässlicher Ansprechpartner."**
(How can we help you? **Two service areas**, one reliable contact person.)
Then: `01 Büroservice` / `02 Reinigungsservice`.
→ The business genuinely self-describes as a **two-arm** business. Any "split" design concept has real business justification, not just decorative appeal.

### Other live reference copy worth reusing/improving
- Hero eyebrow: `Dienstleistungen & Reinigung in Dortmund`
- Hero h1: `Viele Leistungen. Eine Anlaufstelle.` (note: a THIRD slogan variant, differing from both PDFs)
- Hero lead: "Ob Behörden, Dokumente, Studium, Finanzen, Immobilien oder Reinigung – wir begleiten Sie persönlich, klar und Schritt für Schritt."
- Hero CTAs: `Leistungen entdecken` / `Jetzt kontaktieren`
- Trust row: `✓ Persönliche Begleitung` · `✓ Mehrsprachiger Service` · `✓ Klare nächste Schritte`
- Services intro: "Wir ordnen Ihr Anliegen und helfen Ihnen, die passenden nächsten Schritte zu finden."
- "Warum" cards: `Alles aus einer Hand` / `Persönlich begleitet` / `Mehrsprachig` / `Gut vernetzt`
- Contact heading: `Schildern Sie uns kurz Ihr Anliegen`
- Contact sub: "Füllen Sie die Felder aus. Ihre Anfrage wird als vorbereitete Nachricht direkt in WhatsApp geöffnet." → **we must rewrite this**, since our form sends EMAIL, not WhatsApp.
- Its form fields: Name · Telefonnummer · Leistungsbereich (Büroservice/Reinigungsservice) · Gewünschte Leistung · Kurze Beschreibung · Bevorzugte Kontaktzeit. **No email field** — because it went to WhatsApp. Ours needs an email field.
- Cleaning checklist as shipped: Büros · Häuser & Wohnungen · Schulen · Restaurants & Geschäfte · Arztpraxen · Treppenhäuser & Gemeinschaftsflächen

> ⚠️ **Slogan inconsistency to resolve with the client:** three variants are in circulation — `Viele Anliegen. Ein Ansprechpartner.` (DE PDF), `Viele Lösungen. Ein Ansprechpartner.` (PDF footer), and `Viele Leistungen. Eine Anlaufstelle.` (live site). Pick one and use it consistently.

## 6. Open questions the plan should surface for the client
(Do not invent answers — flag them.)
- ~~Address, phone, email, hours~~ — **RECOVERED, see section 5b**; still needs client confirmation that these are current and that `info@zukunftservice.de` is the intended form destination.
- Still missing for the Impressum (**legally mandatory in Germany, §5 DDG**): the legal entity form and full legal name (Einzelunternehmen? GmbH?), the **Vertretungsberechtigter** (named responsible person), USt-IdNr or the §19 UStG small-business notice, Handelsregister number if applicable, and the §55 Abs. 2 RStV/MStV content-responsible person.
- Photography: does the client have real photos of the office/team/cleaning work, or do we need stock? Reference site uses large imagery heavily.
- Logo source files (SVG/PNG transparent, and an Arabic-locale logo variant?).
- Domain + hosting: who deploys? Does $700 include deployment?
- Does the client also want WhatsApp click-to-chat (very common for this audience) in addition to email?
- Is a third locale (English/Turkish) ever coming? Affects i18n design now.
- Datenschutz: any analytics/cookies? → cookie consent banner obligation (TTDSG/DSGVO).
