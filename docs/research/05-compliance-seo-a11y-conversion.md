# COMPLIANCE, SEO, ACCESSIBILITY & CONVERSION PLAN
## Zukunft Service — German bilingual (DE/AR) brochure site, UI-only, $700

**Author role:** German-market compliance / SEO / a11y / conversion specialist
**Status:** planning artifact. No code written. All statute references verified against live sources August 2026 (source list at end).
**Standing constraint applied throughout:** we are not lawyers. This document tells the developer what to *build* and what the *client must supply*. It is not legal advice, and the plan explicitly budgets for the client to obtain their own legal text.

---

# 0. THE ONE ARCHITECTURAL REQUIREMENT THAT COMES FROM MY DOMAIN

Before anything else, because it constrains the stack choice the architecture agent makes:

> **Every route, in both locales, must ship as real pre-rendered HTML — not a client-side-only SPA shell.**

Three independent reasons, any one of which is sufficient:

1. **Legal.** § 5 Abs. 1 DDG requires the Impressum be *"leicht erkennbar, unmittelbar erreichbar und ständig verfügbar."* An Impressum that only exists after a JS bundle boots is not "ständig verfügbar" if the bundle 404s, a CSP blocks it, or the visitor is on a throttled connection. This is a cheap risk to eliminate and an expensive one to argue about.
2. **SEO.** `hreflang` clusters, per-page `<title>`/`<meta description>`, and JSON-LD must be in the initial HTML response. Google renders JS, but Bing, and — more importantly for this audience — WhatsApp/Facebook/Telegram link-preview crawlers **do not execute JavaScript**. This site will be shared primarily via WhatsApp. A blank preview card kills the share.
3. **Performance.** See §6. An empty-shell SPA cannot hit LCP ≤ 2.0s on a 4-year-old Android on German mobile.

**Two acceptable implementations** (architecture agent picks; either satisfies me):
- **Vite 7 + React 19 + `vite-react-ssg` ^1.x** — static pre-render of all routes at build, output is a plain `dist/` folder of HTML the backend dev drops anywhere. Lightest, cheapest, most handoff-friendly.
- **Next.js 15 App Router + `output: 'export'`** — more familiar to most backend devs, slightly heavier.

**Unacceptable:** plain `vite build` SPA with a single `index.html`. If the plan lands there, items 1–3 above all fail and my SEO/legal sections are largely unimplementable.

---

# 1. LEGALLY MANDATORY PAGES — GERMAN COMMERCIAL WEBSITE, 2026

## 1.1 Impressum — statute has changed, the brief's "§5 DDG/TMG" needs cleaning up

**The TMG is gone for this purpose.** Since **14 May 2024**, the *Digitale-Dienste-Gesetz (DDG)* replaced the *Telemediengesetz (TMG)*. The Impressum obligation now lives in **§ 5 DDG** ("Allgemeine Informationspflichten"). Any footer link, comment, or generated legal text that still cites "§ 5 TMG" is citing a repealed provision — cosmetically embarrassing, and a signal to an Abmahn-lawyer that the site was never reviewed.

**Action for the build:** the footer link label is `Impressum`; the page H1 is `Impressum`; and the boilerplate line the client's generator produces must read **"Angaben gemäß § 5 DDG"**, not "§ 5 TMG". Add this to the QA checklist.

**Scope — there is no small-business exemption.** § 5 DDG applies to all *geschäftsmäßige* digital services. No revenue threshold, no headcount threshold. A one-person Einzelunternehmen brochure site is fully in scope.

**Reachability requirement.** "Leicht erkennbar, unmittelbar erreichbar und ständig verfügbar" is interpreted in practice as: reachable from **every** page in **at most two clicks**, via a link that is **literally labelled `Impressum`** (case law has repeatedly rejected creative labels — "Kontakt", "Über uns", "Legal", "Info" are all risky; "Impressum" is the safe word). In Arabic, keep the German word as the primary label with an Arabic gloss: `Impressum — بيانات الناشر`. Do not translate it away.

### § 5 Abs. 1 DDG — the required fields, and which apply here

| # | § 5 Abs. 1 Nr. | Field | Einzelunternehmen (likely case) | GmbH / UG |
|---|---|---|---|---|
| 1 | Nr. 1 | Name and the address where established | **Full personal name** (first + last, not "Zukunft Service" alone) + **physical street address**. A Postfach is **not** sufficient. | Registered company name incl. legal form, registered seat address, **all** Geschäftsführer by name |
| 2 | Nr. 1 | Legal form / capital | n/a | Legal form in the name; if capital figures are stated voluntarily, all of them must be (Stamm-/Grundkapital, outstanding contributions) |
| 3 | Nr. 2 | Fast electronic contact **incl. an e-mail address** | **E-mail is mandatory.** Phone is not strictly mandatory but a second fast channel is expected; give phone anyway. A contact form alone does **not** satisfy this. | same |
| 4 | Nr. 3 | Supervisory authority | Only if the activity requires authorisation → **see §1.5 below, this is a live question for this client** | same |
| 5 | Nr. 4 | Register + register number | n/a for Einzelunternehmen not in HR | **Handelsregister (Amtsgericht + HRB number)** |
| 6 | Nr. 5 | Chamber / professional title / professional rules | Only for reglementierte Berufe → **see §1.5** | same |
| 7 | Nr. 6 | **USt-IdNr.** (§ 27a UStG) or Wirtschafts-IdNr. | **Only if one actually exists.** A Kleinunternehmer under § 19 UStG often has none — in that case, state nothing. Never publish the Steuernummer as a substitute; that is a different number and publishing it is a bad idea. | same |
| 8 | Nr. 7 | Liquidation status | n/a | Only if in Abwicklung/Liquidation |

**Additional items that are not § 5 DDG but belong on the same page** (this is what makes an Impressum "complete" in the eyes of a German lawyer):

- **§ 18 Abs. 2 MStV** — "Verantwortlicher für den Inhalt" with full name and address, required once the site carries journalistic-editorial content. A pure service brochure arguably doesn't, **but the line costs nothing and removes the argument entirely.** Include it. Same person, same address.
- **EU ODR platform link** — Art. 14 ODR-VO. **Note: the ODR platform was shut down on 20 July 2025.** Do **not** add an ODR link. Any generated boilerplate that still includes `https://ec.europa.eu/consumers/odr` must be deleted — a dead link to a dead platform is now itself a defect. Add this to QA.
- **VSBG statement** (§ 36 VSBG) — a one-line declaration on whether the business is willing to participate in consumer arbitration. Standard safe wording: *"Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."* — **client decides**, we render.
- **Bildnachweise / image credits** — if any stock photography is used, the licence often requires attribution. Put a `Bildnachweise` block at the bottom of the Impressum page. Cheap insurance.

### What WE build vs. what the CLIENT supplies

| | We build | Client supplies |
|---|---|---|
| **Impressum** | The `/de/impressum` + `/ar/impressum` route, a `<LegalPage>` layout component, a typed `impressum.de.ts` / `impressum.ar.ts` content module with a **structured schema** (see below), the footer link, the two-click reachability, the print styles | Every actual value: legal name, street address, phone, e-mail, register data, USt-IdNr., supervisory authority, chamber, § 34d/§ 34c registration numbers, VSBG stance |
| **Datenschutzerklärung** | The `/de/datenschutz` + `/ar/datenschutz` route, a renderer that accepts headed sections, the footer link, the inline link next to the contact form's submit button | **The entire text.** Obtained from a lawyer or a paid generator (eRecht24 Premium ~€25/mo, activeMind, or Dr. Thomas Schwenke's generator). We do not write it. |

I recommend the content module be **structured, not a wall of HTML**, so the client can hand a filled-in form to the backend dev later without touching JSX:

```ts
// src/content/legal/impressum.de.ts
export const impressum: ImpressumData = {
  heading: "Impressum",
  legalBasis: "Angaben gemäß § 5 DDG",
  provider: {
    // CLIENT-SUPPLIED — do not ship placeholder values to production
    name: "«Vor- und Nachname / Firmenname mit Rechtsform»",
    street: "«Straße Hausnummer»",
    postalCode: "«PLZ»",
    city: "«Ort»",
    country: "Deutschland",
  },
  contact: {
    phone: "«+49 ...»",
    email: "«info@…»",
  },
  register: null,          // { court: "Amtsgericht …", number: "HRB …" } | null
  vatId: null,             // "DE…" | null  — omit the whole block if null
  supervisoryAuthority: null,   // see §1.5 — likely NOT null for this client
  professionalRegulation: null, // § 34d/§ 34c GewO block if applicable
  contentResponsible: { /* § 18 Abs. 2 MStV — same person by default */ },
  vsbgStatement: "«Klientenentscheidung»",
  imageCredits: [],
} as const;
```

Every field with `«…»` renders in dev as a loud red placeholder and **fails the production build** via a simple assertion in the SSG step. This is ~15 lines of code and it is the single highest-ROI compliance measure in this plan: it makes it *impossible* to ship the site with a placeholder Impressum.

### Abmahnung risk — the real numbers

A missing or defective Impressum is treated as a *Marktverhaltensregel* breach and is actionable under **§ 3a UWG** by competitors and Wettbewerbsverbände. It remains one of the most-abmahnt website defects in Germany. Typical **Streitwert** for a pure Impressum defect: **€1,500 – €5,000**, with OLG Stuttgart having capped a straightforward Impressumsverstoß at **€2,500**. Resulting lawyer's fees for the *first* letter: roughly **€300 – €900**; and if the client signs a strafbewehrte Unterlassungserklärung and later regresses, the contractual penalty per repeat is typically **€2,500 – €5,100** each. Add the client's own defence-lawyer cost.

Practical translation for the client: **shipping this site without a complete Impressum can cost more than the entire $700 project fee, on the first letter.** This is why the placeholder-fails-the-build rule above is non-negotiable.

## 1.2 Datenschutzerklärung — DSGVO Art. 13

Mandatory the moment any personal data is processed — and it is, from the first HTTP request (server access logs contain the IP address). There is no "we don't collect anything" exemption for a brochure site.

**Art. 13 requires**, at minimum: identity + contact of the Verantwortlicher; contact of the DSB if one exists (unlikely at this size — § 38 BDSG threshold is 20 persons regularly processing); purposes and **legal basis** for each processing; recipients / categories of recipients (hoster, mail provider, form-handling backend); any third-country transfer and its safeguard; retention period or the criteria for it; the data-subject rights (Art. 15–21) including the **right to object** and the **right to complain to a supervisory authority** (Art. 77); and whether provision of data is required and the consequences of not providing it.

**What must be described specifically for THIS site:**

1. **Hosting + server logs** — legal basis Art. 6(1)(f). *Client must name the hoster and confirm an AVV (Art. 28 DSGVO) is in place.* If the hoster is US-owned (Vercel, Netlify, Cloudflare Pages), this needs an explicit third-country paragraph. **Recommendation: host in the EU** — Hetzner, netcup, IONOS, or Vercel with an EU-only region — purely to keep the Datenschutzerklärung short and defensible. Cost difference is ~€5/mo.
2. **The contact form** — this is the whole functional surface of the site. Legal basis is **Art. 6(1)(b)** (Vertragsanbahnung) or **Art. 6(1)(f)** (berechtigtes Interesse an der Kommunikation); the latter is the more common framing for a general enquiry form. The declaration must state: which fields, where the mail goes, retention period, and that the data is used only to answer the enquiry.
3. **WhatsApp** — if we ship a `wa.me` click-to-chat link (recommended, see §5), the Datenschutzerklärung needs a WhatsApp paragraph: initiating a chat transfers data to Meta/WhatsApp Ireland with onward transfer to the US. **Important build detail: a `wa.me` link is inert until clicked** — no data leaves on page load, so it needs no consent gate. Never embed a WhatsApp *widget script*.
4. **Fonts** — see §1.4. If we self-host (we will), the declaration says so explicitly: *"Schriftarten werden lokal von unserem Server ausgeliefert; es erfolgt keine Verbindung zu Servern Dritter."* That sentence alone forecloses the single most-abmahnt DSGVO defect of the last four years.

### Contact-form specifics — the details that are usually got wrong

- **No "I have read the privacy policy" checkbox.** It is not legally required for a contact form and German practitioners regard the standard formulation as actively harmful (it manufactures a fictitious "consent" that then has to be withdrawable, and it adds friction to our single conversion event). **What is required is a visible link to the Datenschutzerklärung immediately adjacent to the submit button.** Build it as static text, always visible, not a modal:

  > `Mit dem Absenden stimmen Sie zu, dass wir Ihre Angaben zur Bearbeitung Ihrer Anfrage verwenden. Weitere Informationen: `**`Datenschutzerklärung`**`.`
  >
  > `بإرسال هذا النموذج أنت توافق على استخدام بياناتك لمعالجة طلبك. لمزيد من المعلومات: `**`سياسة الخصوصية`**`.`

- **Data minimisation, Art. 5(1)(c).** Every field must earn its place. My recommendation for required fields is **Name, one contact channel (e-mail *or* phone), and the message** — nothing else. Service-category and preferred-contact-time are optional. Do **not** make both e-mail and phone mandatory; that is a minimisation problem *and* a conversion problem in one.
- **Spam protection: no Google reCAPTCHA.** reCAPTCHA loads Google resources and transmits data to the US on page load, which requires consent under § 25 TDDDG and blows up the privacy declaration. **Build a honeypot field + a submission-time trap** (reject if the form is submitted < 3s after first interaction) — both are zero-third-party, zero-cost, and ~20 lines. Document the honeypot field name in the backend handoff contract so the backend dev knows to reject on it too. If the client later reports real spam volume, the paid escalation is **Friendly Captcha** (German provider, Munich, DSGVO-designed) — flag as a post-launch option, **out of scope at $700**.
- **HTTPS is mandatory** (Art. 32 DSGVO, "Stand der Technik"). Hosting decision, but state it in the handoff doc.

## 1.3 Cookies / consent — § 25 TDDDG

The former **TTDSG was renamed TDDDG** as part of the same May 2024 reform package. The operative provision is **§ 25 TDDDG**: storing information on, or accessing information already stored on, a user's terminal equipment requires **prior, informed, active consent** — regardless of whether the information is personal data. The only exception is what is *strictly necessary* to deliver a service the user explicitly requested.

The `EinwV` (Einwilligungsverwaltungsverordnung, in force since 1 April 2025) creates a framework for recognised consent-management services (PIMS) so users can set preferences once centrally. As of mid-2026 exactly one service is registered with the BfDI and adoption is negligible. **It is irrelevant to this project.** Do not build for it.

### The decision I am making for this project

> **Ship with zero cookies, zero localStorage of personal data, and zero third-party requests. Therefore: no consent banner at all.**

This is the correct answer at $700 and it is also the *better* answer at any budget. A consent banner would cost design time, dev time, a11y work (it's a focus-trap modal on first paint), CLS budget, and conversion (it's a wall between an anxious first-time visitor and the page). Removing the need for it is worth more than building a good one.

**To hold that position, the following are hard build rules:**

| Rule | Why | Alternative we use instead |
|---|---|---|
| **No Google Fonts CDN. No fonts.gstatic.com. No `<link>` to any font host.** | LG München I, 20.01.2022, Az. 3 O 17493/20 held dynamic Google Fonts embedding unlawful; an estimated 100,000+ Abmahnschreiben followed at €500–€2,000 each. The wave has receded but the legal position has not changed. | **Self-host via `@fontsource` npm packages.** See §6. |
| **No Google Maps iframe.** | Loads Google resources + transmits IP to the US on page load → consent required → banner required. | An **address card** with a large `In Google Maps öffnen ↗` / `افتح في خرائط جوجل ↗` link (user-initiated navigation = no consent needed), optionally beside a **static OpenStreetMap tile render** we generate at build time and serve from our own origin, with the required `© OpenStreetMap-Mitwirkende` attribution. |
| **No YouTube/Vimeo embeds.** | Same problem. | Poster image + link out, if video ever appears. |
| **No analytics in v1.** | Any analytics is a privacy-declaration paragraph and a possible § 25 trigger. | If the client insists: **Plausible (EU/cloudless-cookie)** or self-hosted **Umami**. Both are cookieless and store nothing on the device, so § 25 TDDDG is not triggered and consent is arguable under Art. 6(1)(f) — but this is **out of scope at $700**; quote separately. |
| **No CDN-hosted JS/CSS of any kind.** Everything bundled from our origin. | Same reasoning; also a performance win. | Vite bundles everything. |

**One `localStorage` key is acceptable and I am approving it:** the chosen locale, e.g. `zs.locale = "de" | "ar"`. Rationale under § 25 Abs. 2 Nr. 2 TDDDG: it is strictly necessary to deliver the language the user explicitly requested. Store **nothing else** — no session ID, no partial form data, no "seen the popup" flags. Document it in one line of the Datenschutzerklärung.

**If the client later adds anything from the "no" column, they need a consent banner and the privacy declaration must be re-done — this is a scope-change trigger. Write that sentence into the handoff document.**

## 1.4 Footer link block — the exact spec

Present on **every** page including the two legal pages themselves, in a `<nav aria-label="Rechtliches">` inside the `<footer>`:

```
Impressum · Datenschutzerklärung          (DE)
Impressum · سياسة الخصوصية                 (AR — "Impressum" stays German)
```

Requirements: real `<a href>` elements with real hrefs (crawlable, middle-clickable, right-clickable); no JS-only handlers; visually distinguishable from surrounding footer text (not the same weight and colour as the copyright line); contrast ≥ 4.5:1 against the `#f4ecdf` footer background — **`#6c7a76` on `#f4ecdf` fails this**, see §2.7.

## 1.5 The regulatory questions this specific business raises — OPEN QUESTIONS

The service taxonomy in the brief touches four separately regulated activities. Each one, if the client is actually licensed for it, **adds mandatory Impressum fields** under § 5 Abs. 1 Nr. 3 and Nr. 5 DDG. Each one, if the client is *not* licensed, makes the hedged copy load-bearing.

> **OPEN QUESTION 1 — RDG / Rechtsdienstleistung.**
> § 2 RDG defines *Rechtsdienstleistung* as any activity in a concrete third-party matter requiring legal examination of the individual case. § 5 RDG permits it **as a Nebenleistung** where it belongs to the professional profile of the main activity, judged by content, scope and factual connection. "Help filling in a form" and "compile the required documents" are on the permitted side of that line; "we assess whether you meet the naturalisation requirements" or "we'll handle the objection" are not.
> **Ask the client:** has a lawyer reviewed their service description against the RDG? Do they have a cooperating Rechtsanwalt they refer to?
> **What we do regardless:** enforce the hedging vocabulary — see §1.6.

> **OPEN QUESTION 2 — § 34d GewO / insurance mediation.**
> Section 4 of the taxonomy ("Versicherungen & Vorsorge": Lebensversicherung, Alters- und Zukunftsvorsorge, Sterbegeld- und Bestattungsvorsorge) is insurance mediation territory. Mediation requires an **Erlaubnis nach § 34d GewO** and an entry in the **Vermittlerregister** at the DIHK. **If the client holds one**, § 5 Abs. 1 Nr. 3 + Nr. 5 DDG require the Impressum to name: the Erlaubnis, the issuing IHK, the Vermittlerregister number, the register's contact, and a reference to the applicable professional rules (§§ 34d GewO, 59–68 VVG, VersVermV) with the § 11a GewO / § 15 VersVermV disclosures. **If the client does not hold one**, the site must never read as if they mediate — the brief's existing wording *"Über geeignete Partner vermitteln wir Unterstützung zu Themen wie…"* is doing exactly the right work and must not be "improved" by a copywriter.
> **This is the highest-risk copy on the site. Flag it to the client in writing.**

> **OPEN QUESTION 3 — § 34c GewO / real estate.**
> Section 5 ("Immobilien & Investitionen", incl. Dubai brokerage, "Vermittlung von Immobilienangeboten in Dubai", "Vorbereitung einer möglichen Immobilienfinanzierung"). Immobilienmakler and Darlehensvermittler activities require **§ 34c GewO** permission; Immobiliardarlehensvermittlung requires **§ 34i GewO**. Same structure as above: if licensed → additional mandatory Impressum fields + the MaBV disclosures; if not → the copy must stay strictly on "Orientierung / Kontakt zu geeigneten Partnern / Organisation von Gesprächen".

> **OPEN QUESTION 4 — Handwerksrolle for the cleaning arm.**
> Gebäudereinigung is, to my understanding, a *zulassungsfreies* Handwerk under HwO Anlage B1, which still requires registration with the competent **Handwerkskammer**. If the client is registered, the HWK and the registration are worth naming — both as an Impressum data point and as a **trust signal** in the cleaning section. **Verify with the client's HWK; I am not certain enough to assert it as fact.**

> **OPEN QUESTION 5 — StBerG.**
> Nothing in the taxonomy is overtly tax advice, but "Sortierung und Vorbereitung finanzieller Unterlagen" sits next to it. Ensure no copy ever implies Steuerberatung or Buchhaltung.

## 1.6 Enforcing the hedging in the build — not just in the copy doc

The brief's hedging constraint is the single most valuable non-obvious thing in this engagement, and a copy constraint written in a Word document will be violated within one edit cycle. **Make it mechanical.**

**Banned lexicon (DE)** — a build-time content lint over the `src/content/**` modules:

```ts
// scripts/lint-legal-language.ts  — runs in CI and pre-build
const BANNED_DE = [
  /\bwir beraten\b/i, /\bberatung\b/i, /\brechtsberatung\b/i, /\brechtlich beraten\b/i,
  /\bsteuerberat/i, /\banwalt/i, /\bjuristisch/i,
  /\bgarantier/i, /\bgarantie\b/i, /\b100\s*%/i, /\bsicher(?:e|es)?\s+(?:visum|einbürgerung)/i,
  /\bwir erledigen\b/i, /\bwir übernehmen (?:die|Ihre) (?:einbürgerung|beantragung)/i,
  /\bwir besorgen Ihnen (?:das|ein) visum\b/i, /\bschnellste?r?\b.*\bvisum\b/i,
  /\bwir vertreten Sie\b/i, /\bmandat/i, /\bversicherungsberat/i,
];
const BANNED_AR = [
  /استشارة\s*قانونية/, /محام(?:ي|اة)/, /نضمن/, /ضمان\s*الحصول/, /مضمون/,
  /نحصل\s*لك\s*على\s*(?:الفيزا|التأشيرة|الجنسية)/, /نتكفل\s*بـ?الملف/, /استشارة\s*ضريبية/,
];
```

**Approved verb set** the copy must use (DE / AR):
`unterstützen bei` / `نساعدك في` · `Vorbereitung von` / `تجهيز` · `Zusammenstellung` / `تجميع` · `Organisation und Beschaffung` / `تنظيم واستخراج` · `Orientierung` / `توجيه` · `Vermittlung an geeignete Partner / Fachstellen` / `التواصل مع جهات مختصة` · `begleiten` / `نرافقك` · `strukturieren` / `ترتيب الخطوات`.

**A `<HedgeNotice>` component**, rendered at the bottom of the Finanzen, Immobilien, and Behörden service pages, and inside the service-detail modal:

> **DE:** „Zukunft Service erbringt organisatorische Unterstützungsleistungen. Wir erbringen keine Rechts-, Steuer- oder Versicherungsberatung. Bei Bedarf vermitteln wir an geeignete Partner und Fachstellen."
> **AR:** «تقدّم Zukunft Service خدمات تنظيمية ومساندة. نحن لا نقدّم استشارات قانونية أو ضريبية أو تأمينية. وعند الحاجة، نوجّهك إلى شركاء وجهات مختصة.»

This is a real value-add the client is not expecting and costs about 90 minutes.

---

# 2. ACCESSIBILITY

## 2.1 Which standard actually applies — the honest answer

**The BFSG (Barrierefreiheitsstärkungsgesetz), in force since 28 June 2025, almost certainly does *not* apply to this website.** Two independent reasons:

1. **Subject-matter scope.** BFSG § 1 Abs. 3 covers a closed list of services: telecoms, elements of passenger transport, consumer banking, e-books, and *Dienstleistungen im elektronischen Geschäftsverkehr*. That last category requires the service to be provided **with a view to concluding a consumer contract online**. A brochure site with a contact form that produces an e-mail concludes no contract. German practitioner commentary is explicit that a typical company/"Über uns" website falls outside the Act's scope.
2. **Kleinstunternehmen exemption.** BFSG § 3 Abs. 3 exempts micro-enterprises — **fewer than 10 employees AND ≤ €2m annual turnover** — that provide *services*. (Note: the exemption does **not** cover firms placing *products* on the market, and the thresholds are cumulative — exceed either and the exemption is lost.) A new one-stop agency is comfortably inside this.

**So: no statutory accessibility obligation. And we are going to build to WCAG 2.2 AA anyway.** Reasons that survive the $700 test:

- The moment the client adds online booking or online payment, item (1) flips and the exemption in (2) becomes the only defence. Retrofitting a11y later costs multiples of building it in.
- **EN 301 549** — the harmonised European standard, currently v3.2.1 (WCAG 2.1 AA), with **v4.1.1 incorporating WCAG 2.2 AA expected in the Official Journal around late 2026** — is the reference everyone will be measured against. Building to 2.2 AA now means the site is already aligned when it lands.
- **This audience disproportionately needs it.** Older/cheaper Android devices, users who zoom text, users on their third language, users under stress filling in a form about their residency status. Every a11y measure below is simultaneously a conversion measure.
- Nearly all of it is free if done from the first commit and expensive if bolted on.

**What we do NOT do at $700:** commission an external audit, produce a formal *Barrierefreiheitserklärung* (not required — that's a BITV 2.0 / public-sector obligation), or buy an overlay widget (overlays are actively harmful and would themselves be a third-party script requiring consent).

## 2.2 Skip link

First focusable element in the DOM. Visually hidden until focused, then visible with high contrast.

```tsx
<a href="#main" className="skip-link">
  {t('a11y.skipToContent')}  {/* DE: "Zum Inhalt springen" · AR: "تخطّي إلى المحتوى" */}
</a>
```

```css
.skip-link{
  position:fixed; inset-inline-start:16px; top:-100px; z-index:100;
  background:var(--deep); color:#fff; padding:14px 20px; border-radius:8px;
  font-weight:800; text-decoration:none;
  transition:top .15s ease;
}
.skip-link:focus-visible{ top:16px; outline:3px solid var(--gold-on-dark); outline-offset:3px; }
@media (prefers-reduced-motion:reduce){ .skip-link{ transition:none; } }
```

Note `inset-inline-start`, not `left` — it flips automatically in RTL. **This is the general rule for the whole build: use logical properties (`margin-inline`, `padding-block`, `border-inline-start`, `text-align: start`) everywhere. Tailwind's `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-` utilities do this natively.** Doing so eliminates ~90% of the usual RTL bug backlog for free — a significant hidden cost saving on a bilingual build.

## 2.3 Landmark structure and heading order

Exactly one of each per page:

```html
<a class="skip-link" …>
<header>                       <!-- banner -->
  <nav aria-label="Hauptnavigation"> … </nav>
</header>
<main id="main" tabindex="-1"> <!-- tabindex -1 so the skip link actually moves focus -->
  <h1>…</h1>
  <section aria-labelledby="s-leistungen"><h2 id="s-leistungen">…</h2>…</section>
  …
</main>
<footer>                       <!-- contentinfo -->
  <nav aria-label="Rechtliches"> … </nav>
</footer>
```

Rules for the QA checklist: exactly one `<h1>` per page; no level skips (h1→h3 is a bug); `<section>` only gets an implicit `region` role when it has an accessible name, so **every `<section>` gets `aria-labelledby` pointing at its own heading**; the eyebrow text (12px/900/uppercase gold) is **never** a heading element — it is a `<p>` or `<span>`, because it is decorative kicker text and putting it in the heading outline wrecks screen-reader navigation. The reference site's "eyebrow + h2" pattern is a classic place this goes wrong.

## 2.4 Focus visibility — and the sticky-header trap

The reference site's focus ring is `#c48a1666` — **gold at 40% alpha**. That is far too weak; WCAG 2.2 SC 1.4.11 (Non-text Contrast) requires 3:1 for focus indicators against adjacent colours, and SC 2.4.13 (Focus Appearance, AAA but cheap here) wants a minimum area and contrast. Replace globally:

```css
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible{
  outline: 3px solid var(--focus);
  outline-offset: 2px;
  border-radius: 4px;
}
:root{ --focus: #8a6008; }                       /* on light surfaces */
.on-dark, .contact-section, .cleaning-panel{ --focus: #e8b64a; }  /* on green surfaces */
```

**WCAG 2.2 SC 2.4.11 — Focus Not Obscured (Minimum) — is new in 2.2 and this design will fail it by default.** The header is `position: sticky; height: 88px` (74px @640). Tab into a link just below the fold and the browser scrolls it exactly to the viewport top, i.e. underneath the sticky header. Fix, one line, applies site-wide:

```css
html{ scroll-padding-top: 104px; }               /* 88px header + 16px breathing room */
@media (max-width:640px){ html{ scroll-padding-top: 90px; } }
```

This *also* fixes every in-page hash anchor (`#leistungen`, `#kontakt`) landing under the header — a visible bug on the reference site.

## 2.5 Modal (service detail) — focus trap, Escape, restore

The reference site has a service-detail modal with, per the brief, "unclear focus management". Specification:

**Recommendation: use `<dialog>` with `showModal()`.** Baseline-available in all target browsers since 2022, gives you the focus trap, the top-layer stacking, the `::backdrop`, `Escape`-to-close, and `inert`-ing of the rest of the page **for free from the platform**. At $700, native `<dialog>` is worth more than any library. If the team wants a component API around it, **Radix UI `@radix-ui/react-dialog` ^1.1** is the fallback (~11 KB gz) — but only if a real requirement emerges.

Requirements checklist:

| Requirement | Implementation |
|---|---|
| Focus moves into the dialog on open | `dialogRef.current.showModal()` — put focus on the dialog heading (`tabIndex={-1}` on the `<h2>`) not on the close button, so the SR announces what opened |
| Focus is trapped | Native to `showModal()` |
| `Escape` closes | Native — but handle the `cancel` event so React state stays in sync |
| Focus returns to the trigger card on close | Store `document.activeElement` before opening; `.focus()` it in the close handler. **Native `<dialog>` does this, but only reliably if the trigger is still mounted — verify in QA** |
| Background does not scroll | `body{ overflow:hidden }` while open, and restore the exact `scrollY` |
| Accessible name | `aria-labelledby` → the modal `<h2>` id |
| Close button is a real button | `<button type="button" aria-label="Schließen">` / `aria-label="إغلاق"` — icon-only buttons **must** have an accessible name |
| Backdrop click closes | Optional; if implemented, it must not be the *only* way |
| RTL | `dir` inherits from `<html>`; close button uses `inset-inline-end`, so it lands top-left in Arabic automatically |

```tsx
const openerRef = useRef<HTMLElement | null>(null);

function open(trigger: HTMLElement) {
  openerRef.current = trigger;
  dialogRef.current?.showModal();
  headingRef.current?.focus();
}
function close() {
  dialogRef.current?.close();
  openerRef.current?.focus();      // SC 2.4.3 Focus Order
}
```

```css
dialog::backdrop{ background:#03231db8; backdrop-filter: blur(7px); }
@media (prefers-reduced-motion: reduce){ dialog::backdrop{ backdrop-filter:none; } }
```

**Design note that is also an a11y note:** the reference makes the six service cards clickable-to-modal. A modal is the wrong container for content Google needs to index. **My recommendation is to make the six services real pages** (see §3) and keep the modal, if at all, only as a fast-preview on desktop with a "Alle Details ansehen →" link to the real page inside it. This turns one accessibility liability into six indexable landing pages.

## 2.6 Mobile navigation — the reference site's worst defect

Below 980px the reference simply does `nav { display: none }`. **There is no navigation on mobile at all.** For a site whose audience is overwhelmingly mobile, this is close to a total failure. Our spec:

```tsx
<button
  type="button"
  aria-expanded={open}
  aria-controls="mobile-nav"
  className="nav-toggle"
>
  <span className="sr-only">{open ? t('nav.close') : t('nav.open')}</span>
  <MenuIcon aria-hidden="true" focusable="false" />
</button>

<nav id="mobile-nav" aria-label={t('nav.mainLabel')} hidden={!open}>…</nav>
```

Rules: `aria-expanded` toggles on the **button**, never on the panel. `aria-controls` points at the panel's id. **Do not use `aria-haspopup`** — this is a disclosure, not a menu, and `role="menu"` is for application menus, not site nav. Use `hidden` (or `display:none`) rather than opacity/visibility so the links are genuinely removed from the tab order when closed. `Escape` closes and returns focus to the toggle. Focus is trapped in the panel while it is open and covering the viewport. Close on route change. The toggle must be **≥ 44×44 CSS px** (see §2.9).

## 2.7 Contrast — I computed these; several tokens in the brief fail

Measured against the WCAG relative-luminance formula. **These are the actual numbers, not estimates.**

| Foreground | Background | Ratio | AA normal (4.5) | Verdict |
|---|---|---|---|---|
| `--gold #c48a16` | `#ffffff` | **3.00:1** | ✗ | **FAIL** — brief's "~3.4:1" is optimistic; it's worse |
| `--gold #c48a16` | `--cream #f7f0e5` | **2.65:1** | ✗ | **FAIL — also fails the 3:1 large-text floor.** This is the eyebrow text on the hero. |
| `--gold #c48a16` | `--green #075344` | **3.00:1** | ✗ | **FAIL** — gold eyebrow in the green contact section |
| `--sage #769b7e` | `#ffffff` | **3.11:1** | ✗ | FAIL for body; OK for large text (≥24px, or ≥18.66px bold) and for non-text UI |
| `#6c7a76` (footnote grey) | `--cream #f7f0e5` | **3.96:1** | ✗ | **FAIL** — and this is the footer-link colour |
| `#61716d` (section sub) | `--cream #f7f0e5` | **4.53:1** | ✓ | Passes by 0.03. Too tight; one nudge to the cream and it breaks |
| `#4f625e` (hero lead) | `--cream #f7f0e5` | **5.72:1** | ✓ | Pass |
| `--ink #19312c` | `--cream #f7f0e5` | **12.23:1** | ✓ | Excellent |
| `#ffffff` | `--green #075344` | **9.02:1** | ✓ | Excellent |
| `#ffffff` | `--deep #043b32` | **12.52:1** | ✓ | Excellent |
| `#172c27` on `--gold #c48a16` (the gold button) | | **4.90:1** | ✓ | **Pass — keep the gold button exactly as it is** |

### The fix: split gold into three tokens

The mistake in the reference is using one gold for three different jobs. Separate them. **These two new values are computed to pass, not eyeballed:**

```css
:root{
  /* brand identity + non-text only: fills, rules, borders, button backgrounds, icons */
  --gold:          #c48a16;

  /* gold TEXT on light surfaces (cream, white). 4.94:1 on cream, 5.59:1 on white */
  --gold-ink:      #8a6008;

  /* gold TEXT on dark green surfaces. 4.80:1 on --green, 6.66:1 on --deep */
  --gold-on-dark:  #e8b64a;

  /* single muted body-text grey replacing the eight near-duplicates.
     5.21:1 on cream, 5.94:1 on #fffdf9 */
  --muted:         #5a6764;

  --focus:         #8a6008;
}
```

**Mapping instructions for the design/build agents:**
- Eyebrow text → `--gold-ink` on light sections, `--gold-on-dark` on green sections. **Never `--gold`.**
- Inline gold links → `--gold-ink`, plus a persistent `text-decoration: underline` with `text-underline-offset: 3px` (SC 1.4.1 — colour must not be the only distinguisher).
- Gold button (`background: --gold`, `color: #172c27`) → **unchanged**, it passes.
- The gold top-border on the "Warum" cards, the gold rules, the logo sparkles → `--gold` unchanged, decorative.
- **Collapse `#61716d`, `#566864`, `#5c6e69`, `#50625e`, `#526762`, `#6c7a76`, `#687773`, `#6f7a77` into the single `--muted: #5a6764`.** Eight indistinguishable greys is a maintenance liability, three of them fail contrast, and nobody will ever notice the difference visually.
- `--sage #769b7e`: demote to decorative/large-display only. Never body text.

Add a CI step: **`npm i -D @axe-core/cli` and run `axe` against the built `dist/` for all 24 routes.** Roughly 30 minutes to wire up, catches contrast and ARIA regressions forever. Also add **Lighthouse CI** with an a11y score gate of 95.

## 2.8 Forms — labelling, errors, and the bilingual complication

This is the site's only functional surface. It must be flawless.

```tsx
<div className="field">
  <label htmlFor="cf-name">
    {t('form.name.label')}
    <span aria-hidden="true"> *</span>
    <span className="sr-only">{t('form.required')}</span>
  </label>

  <input
    id="cf-name"
    name="name"
    type="text"
    required
    autoComplete="name"
    aria-describedby={errors.name ? 'cf-name-err cf-name-hint' : 'cf-name-hint'}
    aria-invalid={errors.name ? true : undefined}
  />

  <p id="cf-name-hint" className="hint">{t('form.name.hint')}</p>
  {errors.name && (
    <p id="cf-name-err" className="err">
      <ErrorIcon aria-hidden="true" /> {t(errors.name.messageKey)}
    </p>
  )}
</div>
```

Non-negotiables:

- **Every input has a real `<label>` with `htmlFor`.** Placeholders are not labels — they vanish on input, fail contrast at typical greys, and are catastrophic for a user filling in their fourth field in their second language.
- `autoComplete` on every field (`name`, `email`, `tel`, `organization`). This is **SC 1.3.5 Identify Input Purpose** and, far more importantly, it means a returning mobile user can fill the form in two taps.
- `type="email"` / `type="tel"` — surfaces the right on-screen keyboard. Real conversion impact on mobile.
- `inputMode="tel"` on the phone field.
- **Errors: `aria-invalid` on the field + `aria-describedby` pointing at the message + an icon + text.** Never colour alone.
- **On failed submit:** render a summary at the top of the form in a `role="alert"` container listing each error as an anchor link to the offending field, then **move focus to that summary**. This is the single most impactful form-a11y pattern and it costs ~20 lines.
- **On success:** replace the form with a confirmation in a `role="status"` region and move focus to it. Do not just flash a toast.
- `aria-live` regions must exist in the DOM **before** content is injected, or nothing is announced. Render the empty container always.
- **Do not disable the submit button while the form is invalid.** A disabled button gives the user no feedback about *why*. Keep it enabled; validate on submit.
- **Validation on blur is hostile to this audience** — someone typing a foreign-format phone number gets punished mid-entry. Validate on submit, then re-validate on change once a field has errored (`mode: 'onSubmit', reValidateMode: 'onChange'`).

**Library recommendation: `react-hook-form` ^7.5x + `zod` ^3.2x + `@hookform/resolvers` ^3.x.** Combined ~13 KB gzipped. Rationale over hand-rolling: RHF is uncontrolled by default (no re-render per keystroke → helps INP on cheap phones), has first-class `aria-invalid`/`aria-describedby` wiring, and — decisively for this project — **the zod schema is the handoff contract**. The backend dev receives a `ContactPayload` type and the exact same zod schema to re-validate server-side. That is the "clean, documented, typed seam" the brief asks for, delivered by an artefact we had to write anyway.

```ts
// src/features/contact/schema.ts — SHARED WITH BACKEND. Do not fork.
import { z } from 'zod';

export const SERVICE_KEYS = [
  'behoerden-dokumente','ehe-uebersetzungen','studium-visa',
  'finanzen-vorsorge','immobilien-investitionen','reinigung','sonstiges',
] as const;

export const contactSchema = z.object({
  name:      z.string().trim().min(2,  'form.err.nameShort').max(100, 'form.err.tooLong'),
  email:     z.string().trim().email('form.err.email').max(180).optional().or(z.literal('')),
  phone:     z.string().trim().min(6,  'form.err.phoneShort').max(40).optional().or(z.literal('')),
  service:   z.enum(SERVICE_KEYS),
  message:   z.string().trim().min(10, 'form.err.messageShort').max(3000, 'form.err.tooLong'),
  preferred: z.enum(['email','phone','whatsapp']).default('email'),
  locale:    z.enum(['de','ar']),                       // so the backend replies in the right language
  hp:        z.string().max(0, 'form.err.spam'),        // honeypot — must stay empty
})
.refine(v => Boolean(v.email) || Boolean(v.phone), {
  message: 'form.err.needOneChannel', path: ['email'],
});

export type ContactPayload = z.infer<typeof contactSchema>;
```

Note: **error messages are i18n keys, not strings.** Non-obvious, and the thing that makes a bilingual form actually work.

## 2.9 Target sizes — WCAG 2.2 SC 2.5.8

New in WCAG 2.2, **Level AA**: pointer targets must be at least **24×24 CSS px**, unless spaced so that a 24px circle centred on each does not overlap. Our own floor is stricter: **44×44** for every primary interactive element, because the audience skews to older devices and to users tapping one-handed while stressed.

Specific items to check: the language switcher pill (small by design in the reference), the mobile-nav toggle, the modal close button, footer links (need `padding-block: 8px` and generous line-height, otherwise adjacent links are 16px tall and effectively untappable), the WhatsApp FAB (fine at 56px), and inline gold links inside body copy (exempt under the "inline in a sentence" exception, but keep line-height ≥ 1.6).

## 2.10 Language attributes on mixed-script content — the bilingual-specific requirement

**SC 3.1.1 (Language of Page)** and **SC 3.1.2 (Language of Parts)**. Both are AA-relevant and both are routinely botched on bilingual sites.

```tsx
// Root — set BOTH attributes, always together
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

Then, **anywhere Arabic appears inside a German page or vice versa, mark the run**:

```tsx
{/* Language switcher on the German page */}
<a href="/ar/leistungen/studium-visa"
   lang="ar" dir="rtl" hrefLang="ar">العربية</a>

{/* The Arabic slogan used decoratively on the German homepage */}
<p lang="ar" dir="rtl" className="slogan-ar">خدمات متعددة... وجهة واحدة</p>

{/* The German brand name inside Arabic copy — keep it LTR inside an RTL paragraph */}
<span lang="de" dir="ltr">Zukunft Service</span>

{/* Terms of art that must stay German inside Arabic copy */}
<span lang="de" dir="ltr">Einbürgerung</span>
```

Without these, a German screen reader will attempt to pronounce Arabic with German phonemes (unintelligible), and — the more common and more visible failure — **Latin brand names and Latin/European numbers inside RTL paragraphs will render in the wrong visual order** because of the bidirectional algorithm. `dir="ltr"` on the span fixes it. Phone numbers are the classic case: `<span dir="ltr">+49 30 12345678</span>` inside Arabic copy, always, or the `+` migrates to the wrong end.

Two more RTL build rules that belong here:
- Directional icons (arrows, chevrons, the "next step" indicators in a process diagram) must mirror: `.rtl [data-mirror]{ transform: scaleX(-1) }`, or use logical-aware icon components.
- The image-fade gradient already has an RTL variant in the reference (`linear-gradient(-90deg, …)`). Keep it, but express it once via a CSS custom property flipped at `[dir="rtl"]`, not duplicated.
- **The WhatsApp FAB moves to bottom-left in RTL** (the reference already does this) — `inset-inline-end: 24px` handles it with no `.rtl` override.

## 2.11 Reduced motion

The brief flags "near-zero motion design" as an upgrade opportunity. Whatever motion the design agent adds, gate it:

```css
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after{
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
    scroll-behavior:auto !important;
  }
}
```

Note `scroll-behavior: auto !important` — the reference sets `html{ scroll-behavior: smooth }` globally, and smooth-scrolling a full page height is a genuine vestibular trigger. Also: any scroll-triggered reveal animation must leave content **visible** when reduced-motion is on (a common bug is `opacity:0` initial state that never resolves because the animation was disabled). Implement reveals as `@media (prefers-reduced-motion: no-preference){ .reveal{ opacity:0; … } }` — opt-in, not opt-out.

## 2.12 The a11y QA checklist (put this in the handoff doc)

1. Tab through every page start to finish. Focus is always visible, never trapped outside a dialog, never lands under the sticky header, order matches visual order in **both** LTR and RTL.
2. Every page: exactly one `h1`, no skipped levels, one `main`, one `header`, one `footer`, every `section` named.
3. `axe` clean on all 24 routes.
4. Lighthouse a11y ≥ 95, all routes.
5. Zoom to 200% and to 400% at 320px width — no horizontal scroll, no clipped content (SC 1.4.10 Reflow).
6. Force text-spacing overrides (SC 1.4.12) — nothing clips.
7. Windows High Contrast / `forced-colors: active` — the gold button still reads as a button (add `@media (forced-colors: active){ .btn{ border:2px solid ButtonText } }`).
8. NVDA + Firefox on the German page; VoiceOver iOS on the Arabic page. Confirm the Arabic page is announced in Arabic and the language-switcher link is announced in the target language.
9. Form: submit empty → error summary announced, focus moved, every error reachable by its anchor.
10. All images have `alt`; decorative ones have `alt=""`; the logo's alt is `"Zukunft Service – Dienstleistungen & Reinigung"`, not `"logo"`.

---

# 3. SEO PLAN

## 3.1 URL and routing architecture — decisions

**Locale in the path, always. No cookie-based or IP-based redirect.**

```
https://zukunft-service.de/            → 301 to /de/          (or a 200 x-default hub; see below)
https://zukunft-service.de/de/         → German home
https://zukunft-service.de/ar/         → Arabic home
```

**Decision: ASCII slugs in both locales, identical, differing only by the locale prefix.**

```
/de/leistungen/behoerden-dokumente     /ar/leistungen/behoerden-dokumente
/de/leistungen/ehe-uebersetzungen      /ar/leistungen/ehe-uebersetzungen
/de/leistungen/studium-visa            /ar/leistungen/studium-visa
/de/leistungen/finanzen-vorsorge       /ar/leistungen/finanzen-vorsorge
/de/leistungen/immobilien-investitionen /ar/leistungen/immobilien-investitionen
/de/leistungen/reinigung               /ar/leistungen/reinigung
/de/ueber-uns          /ar/ueber-uns
/de/kontakt            /ar/kontakt
/de/impressum          /ar/impressum
/de/datenschutz        /ar/datenschutz
```

Rationale for *not* using Arabic slugs, which is the conventional advice: Arabic slugs must be percent-encoded, and **percent-encoded URLs look like `%D8%A7%D9%84%D8%AC...` when pasted into WhatsApp**, which is this audience's primary sharing channel. A URL that looks like a phishing string is a conversion problem that dwarfs the marginal keyword-in-URL benefit. Secondary benefit: one router config, one sitemap generator, trivially correct hreflang pairs — real savings at $700.

**Root URL decision:** serve a real `200` at `/` containing a minimal bilingual language-choice hub (logo, one sentence in each language, two large buttons) and mark it `x-default`. This is better than a 301 because (a) it gives `x-default` a genuine target, (b) it handles the "shared link, unknown recipient language" case that will happen constantly on WhatsApp, and (c) it is ~20 lines of static HTML. Alternative — 301 `/` → `/de/` and point `x-default` at `/de/` — is acceptable and cheaper; the architecture agent may choose. **Never** IP-sniff or `Accept-Language`-redirect: it breaks crawling and it strands an Arabic speaker in Germany on the German page with no obvious escape.

## 3.2 hreflang + canonical

Every page emits a **complete, reciprocal, self-referencing** cluster with **absolute** URLs. Three tags on every page, no exceptions:

```html
<!-- on /de/leistungen/studium-visa -->
<link rel="canonical"  href="https://zukunft-service.de/de/leistungen/studium-visa" />
<link rel="alternate" hreflang="de"        href="https://zukunft-service.de/de/leistungen/studium-visa" />
<link rel="alternate" hreflang="ar"        href="https://zukunft-service.de/ar/leistungen/studium-visa" />
<link rel="alternate" hreflang="x-default" href="https://zukunft-service.de/" />
```

Rules, all of which are the top causes of broken clusters in practice:
1. **Self-referencing canonical on every page**, pointing at itself — never at the German "master". A canonical pointing away from an hreflang target silently kills the whole cluster.
2. **hreflang must be reciprocal.** `/de/x` names `/ar/x`, and `/ar/x` names `/de/x`. Generate both from one table; never hand-write.
3. **Absolute URLs only.** Relative paths break it.
4. **hreflang targets must be the canonical URLs.** Same string, character for character — including the trailing-slash policy. Pick one (I recommend **no trailing slash** except at locale roots) and enforce it in the SSG config.
5. **`hreflang="de"` and `hreflang="ar"`, not `de-DE`/`ar-SA`.** We target languages, not countries. `de-DE` would exclude Austrian and Swiss searchers; `ar-SA` would be wrong for a Syrian or Iraqi audience in Germany. Language-only is correct here.
6. **One `x-default` per cluster**, same target on every page.
7. Because the pages are pre-rendered, emit these in `<head>` at build time — not via a client-side head manager only.

Implementation: a single `routes.ts` table drives the router, the sitemap, and the hreflang tags. One source of truth.

```ts
export const ROUTES = [
  { key:'home',      de:'/de/',                                ar:'/ar/',                                priority:1.0, changefreq:'monthly' },
  { key:'services',  de:'/de/leistungen',                      ar:'/ar/leistungen',                      priority:0.9, changefreq:'monthly' },
  { key:'svc.behoerden', de:'/de/leistungen/behoerden-dokumente', ar:'/ar/leistungen/behoerden-dokumente', priority:0.8, changefreq:'monthly' },
  // …
  { key:'impressum', de:'/de/impressum',   ar:'/ar/impressum',   priority:0.1, changefreq:'yearly' },
  { key:'datenschutz', de:'/de/datenschutz', ar:'/ar/datenschutz', priority:0.1, changefreq:'yearly' },
] as const;
```

## 3.3 Title and meta description formulas — all pages, both locales

**Formulas.** DE title: `{Page benefit} in {Stadt} | Zukunft Service` — target ≤ 60 chars. AR title: `{المنفعة} في {المدينة} | Zukunft Service` — target ≤ 50 characters, because Arabic glyphs are wider in the SERP and truncate earlier. Keep the brand token in Latin script in the Arabic title: it is the brand, it is how people will recognise it, and it doubles as a signal that this is a German-registered business.

Meta description: 140–158 chars DE, 110–130 chars AR. Every one must contain (a) the reassurance verb, (b) "auf Deutsch und Arabisch" / «بالألمانية والعربية», and (c) a soft CTA. **`{Stadt}` is a CLIENT-SUPPLIED blank — see §3.8.**

| Page | DE title | DE description |
|---|---|---|
| Home | `Behördengänge, Dokumente & Reinigung in {Stadt} \| Zukunft Service` | `Viele Anliegen, ein Ansprechpartner: Wir unterstützen Sie bei Behörden, Dokumenten, Studium, Visa, Finanzen, Immobilien und Reinigung – auf Deutsch und Arabisch. Jetzt unverbindlich anfragen.` |
| Leistungen | `Unsere Leistungen im Überblick \| Zukunft Service {Stadt}` | `Sechs Bereiche, ein Ansprechpartner: Behörden & Dokumente, Ehe & Übersetzungen, Studium & Visa, Finanzen, Immobilien und Reinigung. Persönlich, mehrsprachig, Schritt für Schritt.` |
| Behörden & Dokumente | `Hilfe bei Behörden & Dokumenten in {Stadt} \| Zukunft Service` | `Unterstützung bei Einbürgerungsanträgen, Formularen und Schriftverkehr mit Behörden. Organisation syrischer und irakischer Dokumente. Auf Deutsch und Arabisch – unverbindlich anfragen.` |
| Ehe & Übersetzungen | `Übersetzungen & Urkunden für Behörden \| Zukunft Service {Stadt}` | `Wir vermitteln Übersetzer und bereiten ausländische Urkunden für deutsche Behörden vor: Heiratsurkunden, Beglaubigungen, Personenstandsdokumente. Arabischsprachige Unterstützung.` |
| Studium & Visa | `Studium in Deutschland & Visum-Unterlagen \| Zukunft Service` | `Unterstützung bei Hochschulbewerbung, Zulassung und der Zusammenstellung von Unterlagen für Studien-, Schengen- und Besuchsvisa – und beim Ankommen: Wohnung, Anmeldung, erste Behördengänge.` |
| Finanzen & Vorsorge | `Unterlagen für Kredite & Vorsorge vorbereiten \| Zukunft Service` | `Wir sortieren und bereiten Ihre finanziellen Unterlagen organisatorisch vor und vermitteln an geeignete Partner und Fachstellen – zu Finanzierung, Insolvenzvorbereitung und Vorsorge.` |
| Immobilien & Investitionen | `Immobilien in Deutschland & Dubai \| Zukunft Service {Stadt}` | `Orientierung beim Immobilienkauf in Deutschland und Kontakt zu Projektpartnern in Dubai. Ein Ansprechpartner in Deutschland – für Ihre Möglichkeiten in Dubai. Jetzt Gespräch anfragen.` |
| Reinigung | `Gebäudereinigung in {Stadt} – Büro, Praxis, Treppenhaus` | `Professionelle Reinigung für Büros, Wohnungen, Schulen, Restaurants, Praxen und Treppenhäuser in {Stadt} und Umgebung. Einmalig oder regelmäßig. Kostenloses Angebot anfragen.` |
| Über uns | `Über Zukunft Service – Ihr Ansprechpartner in {Stadt}` | `Persönliche Betreuung, mehrsprachige Unterstützung und ein Netzwerk geeigneter Partner. Lernen Sie kennen, wer Ihnen bei Zukunft Service zur Seite steht.` |
| Kontakt | `Kontakt & Termin \| Zukunft Service {Stadt}` | `Schildern Sie uns kurz Ihre Situation – per Formular, Telefon oder WhatsApp. Wir melden uns zurück und klären gemeinsam, welche Unterstützung passt. Unverbindlich, auf Deutsch oder Arabisch.` |
| Impressum | `Impressum \| Zukunft Service` | `Angaben gemäß § 5 DDG.` + `<meta name="robots" content="noindex,follow">` |
| Datenschutz | `Datenschutzerklärung \| Zukunft Service` | `Informationen zur Verarbeitung personenbezogener Daten gemäß Art. 13 DSGVO.` + `noindex,follow` |

| Page | AR title | AR description |
|---|---|---|
| Home | `معاملات ووثائق وخدمات تنظيف في {المدينة} \| Zukunft Service` | `خدمات متعددة ووجهة واحدة: نساعدك في المعاملات الرسمية والوثائق والدراسة والتأشيرات والأمور المالية والعقارات والتنظيف — بالألمانية والعربية. تواصل معنا دون التزام.` |
| Leistungen | `خدماتنا \| Zukunft Service في {المدينة}` | `ستة مجالات ونقطة تواصل واحدة: المعاملات والوثائق، الزواج والترجمة، الدراسة والتأشيرات، الأمور المالية، العقارات، والتنظيف. خطوات واضحة وبسيطة.` |
| Behörden | `مساعدة في المعاملات الرسمية والوثائق \| Zukunft Service` | `نساعدك في تجهيز طلبات التجنيس، وتعبئة النماذج، والمراسلات مع الدوائر الرسمية، واستخراج الوثائق السورية والعراقية. تواصل معنا بالعربية.` |
| Ehe & Übersetzung | `الترجمة وتصديق الوثائق والزواج \| Zukunft Service` | `نوجّهك إلى مترجمين مناسبين ونجهّز وثائقك الأجنبية للدوائر الألمانية: عقود الزواج، التصديقات، ووثائق الأحوال المدنية.` |
| Studium & Visa | `الدراسة في ألمانيا والتأشيرات \| Zukunft Service` | `مساعدة في التقديم على الجامعات وتجهيز أوراق تأشيرة الدراسة وشنغن والزيارة، وترتيب خطواتك الأولى بعد الوصول إلى ألمانيا.` |
| Finanzen | `تجهيز أوراق القروض والتأمين \| Zukunft Service` | `نرتّب أوراقك المالية ونجهّزها تنظيمياً، ونوصلك بشركاء وجهات مختصة في التمويل والإفلاس الشخصي والتأمين والادخار.` |
| Immobilien | `عقارات في ألمانيا ودبي \| Zukunft Service` | `توجيه في شراء العقار في ألمانيا، وتواصل مع شركاء ومطوّرين في دبي. نقطة تواصل واحدة في ألمانيا لفرصك الاستثمارية.` |
| Reinigung | `شركة تنظيف في {المدينة} — مكاتب وعيادات ودرج` | `تنظيف احترافي للمكاتب والشقق والمدارس والمطاعم والعيادات والأدراج في {المدينة} وما حولها. مرة واحدة أو بشكل منتظم. اطلب عرض سعر مجاني.` |
| Über uns | `من نحن \| Zukunft Service` | `متابعة شخصية، دعم بعدة لغات، وشبكة من الشركاء المختصين. تعرّف على من يقف إلى جانبك في Zukunft Service.` |
| Kontakt | `تواصل معنا \| Zukunft Service` | `اشرح لنا موضوعك باختصار عبر النموذج أو الهاتف أو واتساب. سنعاود التواصل معك ونحدّد الخطوات المناسبة. دون أي التزام.` |
| Impressum | `Impressum — بيانات الناشر \| Zukunft Service` | `بيانات وفق المادة 5 من قانون الخدمات الرقمية الألماني (DDG).` + `noindex,follow` |
| Datenschutz | `سياسة الخصوصية \| Zukunft Service` | `معلومات حول معالجة البيانات الشخصية وفق المادة 13 من اللائحة الأوروبية لحماية البيانات.` + `noindex,follow` |

**Note on `noindex` for legal pages:** they must remain **crawlable and linked** (`follow`) and reachable by humans in two clicks — the `noindex` is purely to keep thin duplicate pages out of the index. This does not affect the § 5 DDG obligation, which is about human reachability, not indexing.

## 3.4 Open Graph / Twitter cards

Critical for this project specifically, because **WhatsApp is the dominant sharing channel for this audience** and WhatsApp reads OG tags and does **not** execute JavaScript. These must be in the pre-rendered HTML.

```html
<meta property="og:type"         content="website">
<meta property="og:site_name"    content="Zukunft Service">
<meta property="og:locale"       content="de_DE">
<meta property="og:locale:alternate" content="ar">
<meta property="og:title"        content="Hilfe bei Behörden & Dokumenten in {Stadt} | Zukunft Service">
<meta property="og:description"  content="…">
<meta property="og:url"          content="https://zukunft-service.de/de/leistungen/behoerden-dokumente">
<meta property="og:image"        content="https://zukunft-service.de/og/behoerden-dokumente-de.jpg">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt"    content="Zukunft Service – Unterstützung bei Behördengängen">

<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="…">
<meta name="twitter:description" content="…">
<meta name="twitter:image"       content="https://zukunft-service.de/og/behoerden-dokumente-de.jpg">
```

Hard requirements: **1200×630 JPEG or PNG — not WebP, not AVIF, not SVG.** WhatsApp's fetcher is conservative and will silently drop formats it does not like. Keep each file **under 300 KB**; WhatsApp truncates large fetches. Absolute `https://` URLs. On the Arabic pages set `og:locale` to `ar` and use an **Arabic OG image** — Latin text in a preview shared into an Arabic-language group chat is a wasted impression.

**Budget-conscious production plan:** 4 OG images total, not 24. One per locale for the brand (home/über uns/kontakt/legal fall back to it) and one per locale for services, with the service name composited. If the design agent can produce a simple SVG→PNG build script, do 12 (6 services × 2 locales); if not, 4 is acceptable. **Do not attempt dynamic OG image generation** — it needs a runtime, which we do not have and are not being paid for.

## 3.5 JSON-LD — the actual markup

Placed in the pre-rendered `<head>`. In React, escape `<` to avoid a script-injection break:

```tsx
const json = JSON.stringify(data).replace(/</g, '\\u003c');
return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
```

### A. Site-wide organisation graph — emitted on **every** page

Values wrapped in `«…»` are **CLIENT-SUPPLIED** and must fail the build if unfilled (same mechanism as the Impressum).

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": "https://zukunft-service.de/#organization",
      "name": "Zukunft Service",
      "alternateName": "Zukunft Service – Dienstleistungen & Reinigung",
      "slogan": "Viele Anliegen. Ein Ansprechpartner.",
      "description": "Organisatorische Unterstützung bei Behörden, Dokumenten, Studium, Visa, Finanzen und Immobilien sowie professionelle Gebäudereinigung. Deutsch- und arabischsprachige Betreuung.",
      "url": "https://zukunft-service.de/de/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://zukunft-service.de/#logo",
        "url": "https://zukunft-service.de/assets/logo-zukunft-service-512.png",
        "width": 512, "height": 512,
        "caption": "Zukunft Service"
      },
      "image": { "@id": "https://zukunft-service.de/#logo" },
      "telephone": "«+49 XXX XXXXXXX»",
      "email": "«info@zukunft-service.de»",
      "address": {
        "@type": "PostalAddress",
        "streetAddress":   "«Straße Hausnummer»",
        "postalCode":      "«PLZ»",
        "addressLocality": "«Ort»",
        "addressRegion":   "«Bundesland»",
        "addressCountry":  "DE"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": "«lat»", "longitude": "«lng»" },
      "hasMap": "«https://maps.app.goo.gl/…»",
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          "opens": "«09:00»", "closes": "«17:00»" },
        { "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"], "opens": "«10:00»", "closes": "«14:00»" }
      ],
      "priceRange": "€€",
      "currenciesAccepted": "EUR",
      "paymentAccepted": "«Bar, Überweisung, EC-Karte»",
      "knowsLanguage": [
        { "@type": "Language", "name": "German", "alternateName": "de" },
        { "@type": "Language", "name": "Arabic", "alternateName": "ar" }
      ],
      "availableLanguage": [
        { "@type": "Language", "name": "German", "alternateName": "de" },
        { "@type": "Language", "name": "Arabic", "alternateName": "ar" }
      ],
      "areaServed": [
        { "@type": "City", "name": "«Ort»" },
        { "@type": "AdministrativeArea", "name": "«Bundesland»" },
        { "@type": "Country", "name": "Deutschland", "alternateName": "DE" }
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": { "@type": "GeoCoordinates", "latitude": "«lat»", "longitude": "«lng»" },
        "geoRadius": "«50000»"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": "«+49 XXX XXXXXXX»",
          "email": "«info@zukunft-service.de»",
          "availableLanguage": ["de", "ar"],
          "areaServed": "DE"
        },
        {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "telephone": "«+49 XXX XXXXXXX»",
          "contactOption": "TollFree",
          "availableLanguage": ["ar"],
          "areaServed": "DE",
          "description": "WhatsApp"
        }
      ],
      "sameAs": [
        "«https://www.facebook.com/…»",
        "«https://www.instagram.com/…»",
        "«https://www.tiktok.com/@…»",
        "«https://maps.app.goo.gl/…»"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Leistungen",
        "inLanguage": "de",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Einbürgerung, Behörden & Dokumente",
            "url": "https://zukunft-service.de/de/leistungen/behoerden-dokumente",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Unterstützung bei der Vorbereitung von Einbürgerungsanträgen" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Zusammenstellung und Prüfung der erforderlichen Unterlagen" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hilfe beim Ausfüllen von Formularen und Anträgen" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Unterstützung bei Schriftverkehr mit Behörden" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Organisation und Beschaffung syrischer Dokumente" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Organisation und Beschaffung irakischer Dokumente" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Geburtsurkunden, Heiratsurkunden und Personenstandsdokumente" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Register- und Personenstandsauszüge" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Ehe, Übersetzungen & internationale Dokumente",
            "url": "https://zukunft-service.de/de/leistungen/ehe-uebersetzungen",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vermittlung von Übersetzern für Dokumente und Termine" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vorbereitung von Unterlagen für Beglaubigungen" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vorbereitung ausländischer Urkunden für deutsche Behörden" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Unterstützung bei Registrierung und Anerkennung von Eheschließungen" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Beschaffung fehlender Personenstands- und Familienstandsdokumente" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Studium, Universität & Visa",
            "url": "https://zukunft-service.de/de/leistungen/studium-visa",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Suche nach passenden Studienmöglichkeiten" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Unterstützung bei Hochschulbewerbungen und Zulassungsverfahren" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vorbereitung von Unterlagen für ein Studienvisum" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vorbereitung von Unterlagen für Schengen-, Touristen- und Besuchsvisa" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Unterstützung bei der Anmeldung beim Einwohnermeldeamt" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Orientierung und Begleitung bei Behördengängen nach der Ankunft" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Finanzen, Kredite & Vorsorge",
            "url": "https://zukunft-service.de/de/leistungen/finanzen-vorsorge",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vorbereitung von Kreditanfragen und Zusammenstellung der Nachweise" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vermittlung an geeignete Finanzierungspartner" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sortierung und Vorbereitung finanzieller Unterlagen" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Organisatorische Vorbereitung einer möglichen Privatinsolvenz" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vermittlung an geeignete Beratungsstellen und Fachpartner" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Immobilien & Investitionen",
            "url": "https://zukunft-service.de/de/leistungen/immobilien-investitionen",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Orientierung rund um den Immobilienkauf in Deutschland" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Zusammenstellung benötigter Unterlagen und Kontakt zu geeigneten Partnern" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Informationen zu Immobilienprojekten in Dubai" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Kontakt zu Projektentwicklern und Partnern in Dubai" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Organisation von Gesprächen und Terminen" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Reinigungsservice",
            "url": "https://zukunft-service.de/de/leistungen/reinigung",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Büroreinigung", "serviceType": "Büroreinigung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wohnungs- und Hausreinigung", "serviceType": "Unterhaltsreinigung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Schulreinigung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Restaurant- und Geschäftsreinigung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Praxisreinigung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Treppenhaus- und Gemeinschaftsflächenreinigung" } }
            ]
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://zukunft-service.de/#website",
      "url": "https://zukunft-service.de/",
      "name": "Zukunft Service",
      "publisher": { "@id": "https://zukunft-service.de/#organization" },
      "inLanguage": ["de", "ar"]
    }
  ]
}
```

**Type note:** `ProfessionalService` is a subtype of `LocalBusiness`. Declaring both in the `@type` array is safe and gives maximum parser compatibility. The `Reinigung` arm arguably wants `HousePainterAndDecorator`-style specificity, but schema.org has no `CleaningService` type — `ProfessionalService` + a `serviceType` on each `Service` is the correct modelling.

**Honesty note:** `LocalBusiness` markup does **not** produce a rich result in Google Search for a business like this. Its value is (a) entity disambiguation, feeding the Knowledge Graph and the Google Business Profile match, and (b) — increasingly the bigger payoff in 2026 — machine-readable grounding for AI Overviews and LLM-based answer engines, which is exactly how a confused first-time user is now likely to find a service like this. It is worth the two hours. Do not promise the client star ratings.

### B. Per-service-page addition

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://zukunft-service.de/de/leistungen/studium-visa#service",
  "name": "Studium, Universität & Visa",
  "serviceType": "Organisatorische Unterstützung bei Studium und Visumantrag",
  "description": "Unterstützung bei Hochschulbewerbungen, Zulassungsverfahren und der Zusammenstellung von Unterlagen für Studien-, Schengen-, Touristen- und Besuchsvisa sowie Begleitung nach der Ankunft in Deutschland.",
  "provider": { "@id": "https://zukunft-service.de/#organization" },
  "areaServed": { "@type": "Country", "name": "Deutschland" },
  "availableLanguage": ["de", "ar"],
  "inLanguage": "de",
  "audience": { "@type": "Audience", "audienceType": "Internationale Studierende und Zuwanderer in Deutschland" },
  "hasOfferCatalog": { "…": "the matching sub-catalog from above" },
  "url": "https://zukunft-service.de/de/leistungen/studium-visa"
}
```

Plus a `BreadcrumbList` on every non-home page — this **does** produce a visible SERP enhancement and is cheap:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Start",      "item": "https://zukunft-service.de/de/" },
    { "@type": "ListItem", "position": 2, "name": "Leistungen", "item": "https://zukunft-service.de/de/leistungen" },
    { "@type": "ListItem", "position": 3, "name": "Studium, Universität & Visa" }
  ]
}
```

(Last item has no `item` — that is correct per Google's spec.)

**On FAQ markup:** the service pages should carry a short FAQ block (it is genuinely useful for this audience — see §5). Mark it up as `FAQPage` if it costs nothing, but **be honest with the client: Google restricted FAQ rich results to authoritative government and health sites in August 2023.** No stars, no accordions in the SERP. The value now is AI-answer grounding. Do not sell it as a rich result.

Arabic pages emit the **same graph** with `inLanguage: "ar"`, Arabic `name`/`description` on the `Service` and catalog nodes, and the Arabic `url`. The `@id` for the organisation stays **identical across both locales** — it is one entity.

## 3.6 sitemap.xml

Generated at build from `ROUTES`. Include hreflang alternates inside the sitemap as well as in the HTML — belt and braces, and it is free.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://zukunft-service.de/de/</loc>
    <xhtml:link rel="alternate" hreflang="de"        href="https://zukunft-service.de/de/"/>
    <xhtml:link rel="alternate" hreflang="ar"        href="https://zukunft-service.de/ar/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://zukunft-service.de/"/>
    <lastmod>2026-08-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://zukunft-service.de/ar/</loc>
    <xhtml:link rel="alternate" hreflang="de"        href="https://zukunft-service.de/de/"/>
    <xhtml:link rel="alternate" hreflang="ar"        href="https://zukunft-service.de/ar/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://zukunft-service.de/"/>
    <lastmod>2026-08-20</lastmod><changefreq>monthly</changefreq><priority>1.0</priority>
  </url>
  <!-- …20 more; exclude /impressum and /datenschutz (noindex) -->
</urlset>
```

Every URL in the sitemap must be the canonical URL. Exclude the `noindex` legal pages. `lastmod` from the build timestamp, not hand-maintained.

## 3.7 robots.txt

```
User-agent: *
Allow: /

# No crawlable state to protect; this is a static brochure site.
Sitemap: https://zukunft-service.de/sitemap.xml
```

Deliberately minimal. Notes on what I am **not** doing and why:
- **No `Disallow` for the legal pages** — they carry `noindex` in the HTML; disallowing them in robots.txt would prevent Google from *seeing* the `noindex`, which is the classic self-defeating mistake.
- **No `Crawl-delay`** — not honoured by Google, and there is nothing to protect.
- **AI crawler blocking (`GPTBot`, `CCBot`, `ClaudeBot`, `PerplexityBot`) is an OPEN QUESTION for the client.** My recommendation is **do not block them.** This audience increasingly asks an AI assistant "wie beantrage ich die Einbürgerung, gibt es jemanden der arabisch spricht" — being in the training and retrieval corpus is a discovery channel, not a leak. But it is the client's call and it is one line of config either way.

## 3.8 What is impossible without the client's real data — say this out loud

Local SEO for a service business is roughly 60% Google Business Profile and NAP consistency, and **none of it can be done from the UI side**. Explicitly out of reach until the client supplies data:

- **The `{Stadt}` token in every title and meta description above.** Local intent ("Büroreinigung *Essen*", "شركة تنظيف في *دورتموند*") is where the actual search volume is. Without the city, all the title formulas are ~40% less effective and I cannot finalise them.
- The entire `PostalAddress`, `geo`, `openingHoursSpecification`, `telephone`, `email` block of the JSON-LD.
- The Google Business Profile itself (§4) — cannot be created, verified, or optimised without the address and a postcard/phone verification the client must complete.
- `sameAs` social profiles.
- Any Bewertungen / `AggregateRating` — and note that **`AggregateRating` markup must reflect ratings genuinely displayed on the page and collected honestly; fabricating it is both a Google penalty risk and, in Germany, an actionable UWG § 5 Irreführung.** Do not invent reviews. Ever.

**Recommendation for the proposal:** make delivery of the NAP data an explicit **client obligation with a date**, and state that the site cannot ship without it (the build literally will not pass). This protects the developer from an indefinite "waiting on client" tail on a fixed-fee project — which is, historically, the number one way a $700 job becomes a $200/hour-equivalent job.

---

# 4. LOCAL / ORGANIC DISCOVERY

## 4.1 Google Business Profile — the highest-ROI item in this entire document, and it is not the website

For a local service business, GBP typically drives more first contacts than the website's organic listings do. **It is free.** At $700 the honest framing to the client is: *the website is your credibility layer and your conversion surface; GBP is your discovery layer.* Both are needed; only one of them is in scope.

**Setup recommendations (deliver as a one-page checklist in the handoff doc; setup itself is client work or a paid add-on):**

1. **Primary category:** this business straddles two categories, and GBP allows one primary + up to nine secondary. Recommended primary: **`Behörde für Ausländerangelegenheiten`**-adjacent options do not exist for private firms — the realistic candidates are **`Beratungsstelle` / `Consultant`** or **`Übersetzungsbüro`** or **`Gebäudereinigung`**. **This is a real strategic decision and it is an OPEN QUESTION for the client**, because primary category is the single strongest local-ranking factor and the two arms of the business pull in opposite directions.
   - **My recommendation:** if the cleaning arm has meaningful revenue, **create two separate GBP listings** — one for the office/services business at the office address, one for `Gebäudereinigung` as a service-area business. Google permits distinct listings for genuinely distinct businesses at one address if they have separate categories and ideally separate phone lines. This roughly doubles local reach. **Flag it; do not do it unilaterally — a duplicate-listing suspension is painful to unwind.**
2. **NAP must be byte-identical** on GBP, the website footer, the Impressum, the info strip, the JSON-LD, and every directory. Same spelling of the street ("Str." vs "Straße" matters), same phone formatting. Pick one canonical form, put it in **one TypeScript constant**, and render the footer, the info strip, the Impressum and the JSON-LD from it. This is ~10 lines and it permanently eliminates the most common local-SEO defect.

```ts
// src/content/nap.ts — SINGLE SOURCE OF TRUTH. Everything renders from here.
export const NAP = {
  legalName: "«…»",
  tradeName: "Zukunft Service",
  street:    "«Musterstraße 12»",
  postalCode:"«45127»",
  city:      "«Essen»",
  country:   "Deutschland",
  phoneE164: "«+4920112345678»",       // for tel: links & JSON-LD
  phoneDisplay: "«+49 201 1234 5678»", // for humans; identical everywhere
  whatsappE164: "«4920112345678»",     // wa.me format, no + and no spaces
  email:     "«info@zukunft-service.de»",
} as const;
```

3. **Profile language:** pick **German as the canonical GBP language** — name, description, posts. Mixing scripts in the GBP name or description looks spammy to Google's systems and to users. Then declare Arabic through the structured route: the **`Sprachen` attribute** if available for the category, and one clean sentence at the *end* of the German description: *"Wir sprechen Deutsch und Arabisch — نتحدث العربية."* That one bilingual sentence, in the description, is the highest-value 40 characters on the profile for this audience.
4. **Photos** — 10+ real photos, geo-relevant, uploaded over weeks not all at once. Storefront, interior, the owner, the cleaning team at work. See §5 on why the owner's face matters.
5. **Google Posts** — one per fortnight. Free, and it keeps the profile active.
6. **Reviews** — the single strongest ranking and conversion factor. Give the client a **short link + a QR code** (`https://g.page/r/…/review`) to hand over at the end of an appointment. **Never** incentivise reviews (Google policy violation *and* UWG § 5a). Encourage clients who write in Arabic to do so — Arabic-language reviews are a powerful signal to Arabic-speaking searchers scanning the local pack. **Reply to every review, in the language it was written in.**
7. **Messaging** — enable it, but **only if the client will actually answer within hours.** A slow-response badge is worse than no messaging.
8. **Citations** — a handful of consistent German directories: Das Örtliche, Gelbe Seiten, 11880, Cylex, Apple Business Connect, Bing Places. Not fifty. Ten consistent ones beat fifty inconsistent ones, and inconsistency actively harms.

## 4.2 Arabic-language search behaviour in Germany — the strategic insight

The observation in the brief is correct and it is the most under-exploited opportunity in this project. Behavioural patterns to design around:

- **People search in Arabic for the *problem*, and in German for the *institution*.** A typical query is script-mixed: `مساعدة في Einbürgerung` or `مكتب خدمات عربي Essen` or `Ausländerbehörde موعد`. The German bureaucratic noun stays German because that is the word on the letter they received.
  → **Design implication: the Arabic copy must retain the German terms of art**, in Latin script, rather than translating them away. Write `التجنيس (Einbürgerung)` and `مكتب تسجيل السكان (Einwohnermeldeamt)` — first the Arabic gloss, then the German term the user will actually recognise from their paperwork. This is simultaneously a **keyword strategy**, a **usability win** (the user can now match the word on the page to the word on the form), and a **trust signal** (it shows you actually know the German system). Wrap each German term in `<span lang="de" dir="ltr">` per §2.10.
- **Discovery is heavily social, not search-first.** Facebook groups ("سوريون في ألمانيا", city-specific groups), TikTok, YouTube and WhatsApp forwards carry more first-contact volume than Google for parts of this audience.
  → **Design implication:** the site must be *shareable*. Excellent OG cards (§3.4), clean URLs (§3.1), and — worth building — a **share affordance on each service page** (`Diese Seite teilen` / `شارك هذه الصفحة`) using the native `navigator.share()` API with a copy-link fallback. ~25 lines, no dependency, no third-party script, meaningful reach multiplier for this specific audience.
- **Query volume is thin and long-tail in Arabic.** German keyword tools have poor Arabic-in-Germany data. **Be honest with the client: I cannot give you verified Arabic search volumes for Germany. The strategy is coverage, not volume-chasing.** The right play is to be the *only* well-built Arabic page for these topics in the client's city — a low bar that almost nobody clears.
- **Voice and transliteration.** Some users type Arabic in Latin characters ("mokhalasat", "moamalat"). Not worth optimising for explicitly, but it argues for the German page also being findable by someone whose Arabic keyboard is off.

## 4.3 Keyword targets — six verticals, both languages

`{Stadt}` / `{المدينة}` = client's city. **Volumes unverified — treat as a coverage map, not a forecast.**

### 1 · Behörden, Einbürgerung & Dokumente
**DE:** `hilfe einbürgerungsantrag {Stadt}` · `unterstützung behördengänge {Stadt}` · `hilfe beim ausfüllen von anträgen` · `syrische dokumente beschaffen deutschland` · `irakische urkunden beschaffen` · `syrischer reisepass verlängern deutschland` · `personenstandsurkunde syrien besorgen` · `arabisch sprechendes büro {Stadt}` · `begleitung ausländerbehörde {Stadt}`
**AR:** `مساعدة في التجنيس في ألمانيا` · `استخراج وثائق سورية من ألمانيا` · `إخراج قيد سوري` · `تجديد جواز سفر سوري في ألمانيا` · `مكتب خدمات عربي {المدينة}` · `مكتب معاملات عربي في ألمانيا` · `مساعدة في تعبئة الطلبات الرسمية` · `مرافقة إلى دائرة الأجانب`

### 2 · Ehe, Übersetzungen & internationale Dokumente
**DE:** `beglaubigte übersetzung arabisch deutsch {Stadt}` (⚠ copy must say *Übersetzer vermitteln*, not that we translate) · `übersetzer arabisch behörden {Stadt}` · `heiratsurkunde anerkennung deutschland` · `ausländische urkunde für standesamt vorbereiten` · `eheschließung mit ausländischen dokumenten` · `apostille beglaubigung unterlagen vorbereiten`
**AR:** `ترجمة محلفة عربي ألماني {المدينة}` · `مترجم عربي للدوائر الرسمية` · `تصديق وثائق في ألمانيا` · `تسجيل عقد زواج في ألمانيا` · `اعتراف بعقد الزواج في ألمانيا` · `استخراج وثيقة زواج`

### 3 · Studium, Universität & Visa
**DE:** `studienvisum deutschland unterlagen hilfe` · `hochschulbewerbung unterstützung ausländische studierende` · `bewerbung uni deutschland hilfe {Stadt}` · `schengen visum unterlagen zusammenstellen` · `besuchsvisum deutschland einladung unterlagen` · `anmeldung einwohnermeldeamt hilfe {Stadt}` · `wohnung finden studenten {Stadt}`
**AR:** `الدراسة في ألمانيا مساعدة` · `فيزا دراسية ألمانيا الأوراق المطلوبة` · `التقديم على جامعات ألمانيا` · `فيزا شنغن من ألمانيا` · `فيزا زيارة إلى ألمانيا` · `التسجيل في البلدية في ألمانيا (Anmeldung)` · `سكن طلاب في {المدينة}`

### 4 · Finanzen, Kredite & Vorsorge
**DE:** `kredit unterlagen vorbereiten hilfe` · `finanzierungsanfrage unterlagen zusammenstellen` · `privatinsolvenz vorbereitung unterlagen {Stadt}` · `schuldnerberatung termin vorbereiten` · `lebensversicherung arabisch sprechend` · `sterbegeldversicherung {Stadt}` · `altersvorsorge beratung arabisch`
**AR:** `قرض في ألمانيا مساعدة` · `تجهيز أوراق القرض` · `إفلاس شخصي في ألمانيا` · `تأمين حياة في ألمانيا بالعربي` · `تأمين الدفن في ألمانيا` · `ادخار وتقاعد في ألمانيا`
⚠ **Every page and snippet in this vertical carries the `<HedgeNotice>` from §1.6. This is the § 34d GewO exposure zone.**

### 5 · Immobilien & Investitionen
**DE:** `immobilienkauf deutschland unterstützung arabisch` · `hauskauf unterlagen vorbereiten {Stadt}` · `immobilienfinanzierung vorbereitung` · `immobilien dubai kaufen von deutschland aus` · `dubai investment ansprechpartner deutschland` · `dubai immobilien ratenzahlung`
**AR:** `شراء عقار في ألمانيا` · `تمويل عقاري في ألمانيا` · `استثمار عقاري في دبي من ألمانيا` · `عقارات دبي بالتقسيط` · `وكيل عقارات دبي في ألمانيا`

### 6 · Reinigungsservice — the vertical with the real commercial search volume
**DE:** `büroreinigung {Stadt}` · `gebäudereinigung {Stadt}` · `treppenhausreinigung {Stadt}` · `praxisreinigung {Stadt}` · `restaurantreinigung {Stadt}` · `schulreinigung {Stadt}` · `unterhaltsreinigung {Stadt} angebot` · `reinigungsfirma {Stadt} preise` · `wohnungsreinigung {Stadt}` · `grundreinigung nach umzug {Stadt}`
**AR:** `شركة تنظيف في {المدينة}` · `تنظيف مكاتب في ألمانيا` · `تنظيف درج البناية` · `تنظيف بعد الترحيل/الانتقال` · `شركة تنظيف عربية في ألمانيا`

**Strategic note the client should hear:** vertical 6 is the only one with substantial, high-intent, transactional German search volume and a clear price-quote conversion. It should get **its own dedicated landing page with its own conversion path** (a "Kostenloses Angebot anfragen" form variant with object type + square metres + frequency), and it should be the primary target of any future paid spend. Verticals 1–5 are long-tail, trust-driven, and will convert primarily from GBP, referral and social — not from Google organic. Say this plainly so the client's expectations are calibrated.

**Cross-linking:** each service page links to two sibling services in a "Passt auch zu Ihrem Anliegen" block. Free internal-link equity, and genuinely useful — someone preparing an Einbürgerungsantrag very often also needs a translation.

---

# 5. CONVERSION DESIGN FOR THIS AUDIENCE

## 5.1 The emotional starting state

Assume the visitor is: on a phone, possibly an older Android, in the evening; holding a German letter they do not fully understand; has already been to one Amt and been turned away for a missing document; has been burned before by someone who took money and did nothing; is **not sure whether contacting you costs money**; and is **worried that contacting a private company could somehow affect their residency status or their case**.

Every design decision below is aimed at one of those five states. This is not a SaaS landing page and standard SaaS conversion patterns will actively backfire here.

## 5.2 What builds trust — ranked, with concrete UI

**1. A real human face and a real name. Highest-impact single element on the site.**
This audience buys a *person*, not a company. A `Warum` section with four abstract benefit cards (the reference's approach) is worth less than one photograph of the owner with their name and one sentence in the first person.
- **Build:** an "Ihr Ansprechpartner" block on the homepage, above the fold on mobile or immediately below the hero — portrait photo, first + last name, one line in German and one in Arabic. Repeat it on `/ueber-uns` and beside the contact form.
- **Copy pattern (DE):** *„Ich bin {Name}. Wenn Sie anrufen oder schreiben, sprechen Sie mit mir — nicht mit einem Callcenter."*
- **(AR):** «أنا {الاسم}. عندما تتصل أو تكتب، ستتحدث معي شخصياً — لا مع مركز اتصال.»
- **OPEN QUESTION:** does the client consent to a portrait photo, and do they have one? If not, this whole lever is gone and the site is materially weaker. **Ask early — it changes the design.** A stock photo of a smiling generic businessman is *worse than nothing* here: this audience has seen a thousand scam pages and recognises stock immediately.

**2. "Wir sprechen Arabisch" as a first-class, visible, above-the-fold statement — not a language toggle.**
The toggle is a mechanism. The *promise* is the conversion driver, and it needs to be readable **on the German page too**, because a large share of this audience will land on `/de/` from a Google result and needs to know within one second that they can speak Arabic here.
- **Build:** in the hero trust row, a badge reading `Deutsch · العربية` with the Arabic in native script, `lang="ar" dir="rtl"` per §2.10. Plus, in the German hero lead paragraph, one Arabic sentence rendered in Arabic script. Yes — deliberately mixed-script on the German page. It is the single clearest signal available and it costs one line.

**3. WhatsApp, prominent, as a co-equal primary channel.**
For this audience WhatsApp is not a nice-to-have; for a substantial share it is *the* channel. Email is a formal, intimidating, low-usage channel. The reference site's WhatsApp FAB is the one thing it got exactly right.
- **Build:** floating WhatsApp FAB (56px, `#25d366`, bottom-inline-end, `inset-inline-end: 24px` so it flips in RTL), **plus** a WhatsApp button beside every primary CTA, **plus** WhatsApp listed in the info strip.
- **Pre-fill the message** so the user does not face a blank box: `https://wa.me/{NAP.whatsappE164}?text=` + `encodeURIComponent("Guten Tag, ich habe eine Frage zu: Studium & Visa")` — and on Arabic pages, the Arabic equivalent, and on each service page, that service's name. Pre-filled context is a large, nearly free conversion lift, and it also arrives at the owner pre-qualified.
- **Accessibility:** the FAB is a link with a visible-on-focus label, an `aria-label`, and it must not obscure the footer legal links on mobile (`padding-block-end` on the footer to clear it) — obscuring the Impressum link would be an own goal on both §1 and §2.
- **⚠ The client explicitly asked for email.** So: **the form emails the owner** (the functional requirement), **and** WhatsApp exists as a parallel low-friction path. Do not replace the form with WhatsApp as the reference site did. Both.

**4. Process transparency — "what happens after I hit send".**
The largest single source of abandonment is *not knowing what happens next*, in a context where "what happens next" has historically meant an unanswered letter and a lost month.
- **Build:** a 3-step strip immediately above the contact form:
  `1. Sie schildern kurz Ihr Anliegen` → `2. Wir melden uns innerhalb von {24 Stunden}` → `3. Gemeinsam klären wir die nächsten Schritte`
  `١. تشرح لنا موضوعك باختصار` → `٢. نعاود التواصل معك خلال {٢٤ ساعة}` → `٣. نحدّد معاً الخطوات المناسبة`
- **OPEN QUESTION:** what response time will the client actually honour? A promised 24h that becomes 5 days is worse than promising 2–3 working days and hitting it. Get a number the client commits to and put it in writing on the page.

**5. Explicit, repeated, unmissable "no obligation, no cost to ask".**
- **Build:** the phrase `Unverbindlich und kostenlos anfragen` / «الاستفسار مجاني ودون أي التزام» as **microcopy directly under the primary CTA button**, on every instance of it. Not in a footnote. Not in an FAQ. Under the button, every time.

**6. Plain language — this is a design constraint, not a copy preference.**
Target roughly **B1 German**. Short sentences. Active voice. No Behördendeutsch, no nested subordinate clauses, no `Nominalstil`. Where a German bureaucratic term is unavoidable (`Einbürgerung`, `Aufenthaltstitel`, `Beglaubigung`), gloss it in a parenthetical on first use. In Arabic, the brief already notes the source uses a warm, colloquial-friendly second person (`نساعدك على…`) versus the formal German Sie-form — **preserve that asymmetry**; do not "harmonise" the tone across locales. It is correct as-is.

**7. Specificity beats claims.**
"Wir organisieren syrische und irakische Personenstandsdokumente" is worth more than "Erfahren und zuverlässig", because the first proves domain knowledge and the second is what every scam site says. The service taxonomy in the brief is unusually specific — **surface the specifics, do not summarise them away into benefit-speak.** The itemised lists ARE the trust signal.

**8. Physical presence.**
An address, an opening-hours table, and a photo of the actual office door. A private-flat address or a virtual office is a trust problem for this audience specifically, since a walk-in option is highly valued. **OPEN QUESTION for the client.**

**9. Real reviews, in Arabic and German, with first names and city.**
Do not fabricate. If none exist yet, ship without a testimonials section and add it later — an empty or obviously fake testimonial block is net-negative. Recommend the client collects three real ones in the first month.

## 5.3 What kills trust here — the anti-patterns list

| Anti-pattern | Why it is fatal for this audience |
|---|---|
| **Stock photos of generic smiling business people** | Instantly recognised. Reads as a template site, which reads as a scam. Real photos or abstract/illustrative — never stock people. |
| **No prices, and no explanation of why there are no prices** | Reads as "it's expensive and they won't tell me." Fix: a one-line honest framing — *„Die Kosten hängen vom Anliegen ab. Die erste Anfrage ist kostenlos und unverbindlich — wir sagen Ihnen vorab, was auf Sie zukommt."* |
| **A cookie banner** | Another gate, in a language they may not read, before content. §1.3 removes it entirely. |
| **A long form with many required fields** | Every extra required field is a reason to close the tab. §2.8 minimises. |
| **"Enter your email to download our guide"** | Lead-magnet gating reads as data harvesting to someone worried about their status. Do not. |
| **Any countdown timer, "only 3 slots left", urgency pattern** | Predatory-adjacent. Instantly poisons a trust-driven sale. Also, in Germany, false scarcity is UWG-actionable. |
| **"Guaranteed" anything** | Legal exposure (§1.6) *and* a scam tell. |
| **Auto-playing video, aggressive exit-intent popups, chat widgets that open unprompted** | High-friction, third-party-script-laden, and consent-triggering. All out. |
| **A language toggle that dumps you on the homepage** | Guaranteed abandonment. **The switcher must preserve the current route** — `/de/leistungen/studium-visa` ⇄ `/ar/leistungen/studium-visa`. This is trivially achievable given our slug design in §3.1, and it is a large usability win. |
| **Legal-sounding disclaimers in dense small print** | Necessary content, but if the `<HedgeNotice>` reads like fine print it triggers suspicion. Style it as a **calm informational note** — sage-tinted panel, normal body size, an info icon — not 11px grey. Honesty presented confidently *builds* trust here. |
| **Requiring both email AND phone** | Some users have neither reliably; forcing both is a data-minimisation problem and a conversion problem. §2.8 requires one of the two. |

## 5.4 CTA architecture — how many, where, what

**One primary action, site-wide: "Anfrage senden" → the contact form.** One secondary: WhatsApp. Nothing else competes.

| Location | Primary | Secondary | Notes |
|---|---|---|---|
| Sticky header | `Kontakt` (gold pill button, `--gold` bg + `#172c27` text — 4.90:1, passes) | — | One button only. Header is not a CTA farm. |
| Hero | `Kostenlos anfragen` / «استفسر مجاناً» | `WhatsApp` (outline, WhatsApp glyph) | Two buttons max. Microcopy under: *„Unverbindlich · Antwort innerhalb von {24 Std.} · Deutsch & Arabisch"* |
| End of each of the 6 service cards | `Mehr erfahren →` (navigates to the service page) | — | Not a conversion CTA — a navigation affordance. Do not make it gold. |
| Bottom of each service page | `Anfrage zu {Leistung} senden` | `Per WhatsApp fragen` (pre-filled with the service name) | **Context-carrying:** clicking pre-selects the `service` field in the form. Removes a decision. |
| After the "Warum" section | `Situation schildern` | — | Softer verb than "Anfrage senden" — lower perceived commitment |
| Contact section | The form itself | Phone `tel:` + WhatsApp + e-mail, all as real links | On mobile the phone number **must** be a `tel:` link |
| Floating FAB | WhatsApp | — | Persistent, always available |

**Rules:** roughly **one CTA cluster per viewport-and-a-half** of scrolling on mobile — enough that the action is never far away, few enough that it does not feel like being chased. Buttons are **full-width below 640px** (the reference already does this — keep it). Minimum tap target 44×44 everywhere. Never disable the submit button.

## 5.5 The contact form — reducing first-contact anxiety, field by field

**Field order matters, and the standard order is wrong here.** Do not open with "Name". Opening with an identity request, to a user worried about their status, is the highest-friction possible first step.

**Recommended order:**

1. **`Worum geht es?`** / «ما هو موضوعك؟» — the service select, pre-filled from context. Six options + `Sonstiges`. Low commitment, and it immediately signals *"we handle this kind of thing"*.
2. **`Beschreiben Sie kurz Ihre Situation`** / «اشرح لنا وضعك باختصار» — the textarea. Placed second because it lets the user *tell their story*, which is what they came to do, before being asked to identify themselves. Placeholder shows a concrete example, not an instruction: *„Zum Beispiel: Ich möchte die Einbürgerung beantragen und weiß nicht, welche Unterlagen ich brauche."* — and its Arabic equivalent. This one placeholder does more to unblock a stuck user than any other element on the page.
3. **`Wie sollen wir Sie erreichen?`** / «كيف نتواصل معك؟` — radio group: `E-Mail` / `Telefon` / `WhatsApp`. Then reveal **only** the corresponding field. This is the minimisation requirement from §1.3 and it halves the perceived form length.
4. **`Ihr Name`** — last. By this point the user has invested and identity feels like completion, not interrogation.
5. Optional: `Bevorzugte Zeit für einen Rückruf`.
6. Honeypot (`hp`, visually hidden, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`).
7. Submit + the privacy microcopy + the reassurance microcopy.

**States we build (all four — this is the deliverable to the backend dev):** `idle` · `submitting` (button shows a spinner and the label changes to `Wird gesendet…`, form is `aria-busy`) · `success` (form replaced by a confirmation in `role="status"`, focus moved, message repeats what happens next and **offers WhatsApp as an immediate alternative**: *„Sie möchten schneller Antwort? Schreiben Sie uns direkt auf WhatsApp."*) · `error` (`role="alert"`, human-readable message, **and a WhatsApp fallback plus the phone number** — a failed form submission must never be a dead end, and this is the state most likely to be hit on a flaky mobile connection).

**The seam for the backend dev** — document exactly this in `HANDOFF.md`:

```ts
// src/features/contact/submit.ts
// ── BACKEND INTEGRATION POINT ──────────────────────────────────────────
// Replace the body of this function. Do not change the signature,
// the request shape, or the error contract. The UI depends on all three.
//
// Expected: POST {VITE_CONTACT_ENDPOINT} with Content-Type: application/json
// Body: ContactPayload (see ./schema.ts — re-validate with the SAME zod schema)
// 200 {"ok":true}                          → success state
// 400 {"ok":false,"code":"VALIDATION","fields":{...}} → field errors
// 429 {"ok":false,"code":"RATE_LIMIT"}     → "zu viele Anfragen" message
// 5xx / network                            → generic error + WhatsApp fallback
// Reject any request where `hp` is non-empty (honeypot) — return 200 {"ok":true}
// silently so bots get no signal.
// Reply to the user in payload.locale.
export async function submitContact(p: ContactPayload): Promise<SubmitResult> { … }
```

Ship it with a **mock implementation** behind `VITE_CONTACT_MOCK=true` that resolves after 900 ms and can be forced into each error state via a query param. This makes all four states demoable to the client *before* a backend exists — which is worth real money on a fixed-fee project, because it lets the developer get sign-off and close out the UI phase without waiting on anyone.

## 5.6 One more conversion idea worth its cost

A **"Welche Unterlagen brauche ich?" checklist** on the Behörden page — a static, printable list of the documents typically required for a naturalisation application, with checkboxes. No logic, no state persistence, no backend. Pure static content + `print` styles.

Why it earns its place: it is the exact thing the visitor came for, it is genuinely useful before any contact is made, it is highly shareable in WhatsApp groups (organic reach), it demonstrates competence better than any claim, and it naturally ends with *„Sie sind unsicher, was in Ihrem Fall gilt? Schildern Sie uns Ihre Situation."* Cost: a few hours, mostly content. **Content must be supplied or verified by the client** — and it must be framed as *"typischerweise erforderlich"*, never as a definitive legal list (§1.6).

---

# 6. PERFORMANCE BUDGET

## 6.1 Why it matters more than usual here

Test device assumption: **a 3–5-year-old mid-range Android** (Samsung A-series, Xiaomi Redmi) on a **German mobile network**, which — outside city centres and notoriously in regional trains and older buildings — still means real 3G/edge-of-4G conditions with high latency. This audience also frequently browses on prepaid data plans where every megabyte is a cost.

A 3 MB React SPA that a MacBook renders in 400 ms takes 8+ seconds on that device, and the JS parse/execute cost alone can exceed a second. **The bounce happens before the page ever appears.** No amount of good copy survives that.

## 6.2 Targets — enforced in CI, not aspirational

| Metric | Target | Hard fail |
|---|---|---|
| **LCP** (Moto G Power class, Slow 4G, p75) | ≤ **2.0 s** | > 2.5 s |
| **INP** | ≤ **150 ms** | > 200 ms |
| **CLS** | ≤ **0.03** | > 0.1 |
| **TTFB** | ≤ 0.5 s | > 0.8 s |
| **FCP** | ≤ 1.4 s | > 1.8 s |
| **Initial JS** (gzip, per route) | ≤ **80 KB** | > 110 KB |
| **CSS** (gzip) | ≤ **18 KB** | > 25 KB |
| **Fonts** (total, per locale) | ≤ **110 KB** | > 150 KB |
| **Hero image** (mobile 1×, AVIF) | ≤ **90 KB** | > 140 KB |
| **Total initial page weight** | ≤ **400 KB** | > 600 KB |
| **Third-party requests** | **0** | ≥ 1 |
| **Lighthouse Performance** (mobile) | ≥ 92 | < 85 |

Google's official "good" thresholds are LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 — mine are deliberately tighter because those are *thresholds*, not *budgets*, and a budget set at the threshold has no headroom. As of 2026 only about 56% of tracked origins pass all three; a static brochure site with zero third parties has no excuse to be among the failures.

## 6.3 How we hit them

**JS.** React 19 + react-dom ≈ 45 KB gz. Router ≈ 5 KB. `react-hook-form` + `zod` + resolver ≈ 13 KB. Own code ≈ 15 KB. That is ~78 KB — right at budget, with **no room for a UI kit, an animation library, or an icon package.**
- **No `framer-motion`** (~35 KB gz). CSS transitions and `@keyframes` cover everything this design needs, and they run off the main thread. If a genuine spring/gesture requirement appears, that is a scope conversation.
- **No icon library.** Inline the ~12 SVGs actually used as React components. `lucide-react` tree-shakes reasonably but the build-config risk is not worth it at this count.
- **No UI kit** (MUI, Chakra, shadcn's full surface). Tailwind + ~10 hand-written components.
- **Route-level code splitting** so the contact-form bundle (RHF + zod) loads only on routes that have a form. Consider deferring even that until the form scrolls into view.
- **The zod schema is shared with the backend** — keep it dependency-free and importable.

**CSS.** Tailwind v4 with the JIT; the six brand colours and the type scale as `@theme` tokens so they compile to custom properties. Content-scan config must include the content modules or the class names will be purged. Realistic output for a site this size: 12–16 KB gz.

**Fonts — the decision, given that Google Fonts CDN is banned (§1.3).**

Self-host via `@fontsource` npm packages, subset, `woff2` only, served from our own origin.

| Locale | Role | Family | Package | Budget |
|---|---|---|---|---|
| DE | Headings | **Fraunces Variable** (latin subset, weight axis only) | `@fontsource-variable/fraunces` | ~42 KB |
| DE | Body | **System UI stack** — `-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | — | **0 KB** |
| AR | Headings | **Noto Naskh Arabic 700** (arabic subset) — echoes the Latin serif's authority | `@fontsource/noto-naskh-arabic` | ~48 KB |
| AR | Body | **IBM Plex Sans Arabic 400/500** (arabic subset) | `@fontsource/ibm-plex-sans-arabic` | ~62 KB |

Rules: **Arabic faces load only on `/ar/*` routes; Latin display loads only on `/de/*`.** Never both. `font-display: swap`. `<link rel="preload" as="font" type="font/woff2" crossorigin>` for **only** the one face used in the `<h1>` — preloading more delays LCP rather than helping it. Set `size-adjust` / `ascent-override` on the fallback `@font-face` to match metrics and keep the swap from causing layout shift (this is the single biggest CLS source on font-swapping sites).

**Budget-relief option if the numbers get tight:** drop Fraunces and Noto Naskh, use `Georgia, 'Times New Roman', serif` for DE headings (the reference's choice — 0 KB, universally available) and IBM Plex Sans Arabic for both AR roles. Saves ~90 KB and one build step. **This is the honest $700 fallback**; the branded option above is the better product. State both to the client and let them decide whether brand typography is worth the extra half-day.

**Images.**
- AVIF with a WebP fallback via `<picture>`; **no JPEG fallback needed** in 2026 for the browsers this audience uses.
- Every `<img>` has explicit `width` and `height` attributes. **Non-negotiable** — this is the entire CLS budget.
- `loading="lazy"` + `decoding="async"` on everything **except** the hero image, which gets `fetchpriority="high"` and no lazy attribute.
- `srcset` at 400 / 800 / 1200 / 1600 w.
- The reference site leans heavily on large imagery. **Reduce the count.** Four to six real photographs, used large and well, beat fifteen mediocre ones — for performance, for trust (§5.3), and for the photo-sourcing budget.
- **The logo must be SVG**, inlined for the header (saves a request, and it is on the LCP path).
- OG images are the exception: JPEG/PNG, ≤ 300 KB (§3.4).

**Delivery.** Pre-rendered HTML (§0) means the browser has the LCP element in the first response. Content-hashed filenames with `Cache-Control: public, max-age=31536000, immutable` for hashed assets; `no-cache` for the HTML. Brotli. **EU hosting** — Hetzner/netcup/IONOS, or Vercel/Netlify pinned to `fra1`/`eu-central` — which is simultaneously a TTFB win and the §1.2 privacy-declaration simplification. Two wins, one decision.

**Enforcement.** `size-limit` (`npm i -D size-limit @size-limit/preset-app`) with the JS/CSS budgets above, plus **Lighthouse CI** on mobile emulation with the performance and a11y gates. Both run in the build. A budget that is not enforced by a failing build is a wish.

---

# 7. PRIORITIZED RISK REGISTER

Ordered by **exposure** = likelihood × impact. L/M/H.

## Tier 1 — Address before writing code

| # | Risk | Type | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| **R1** | **Site ships with a placeholder or missing Impressum** → § 3a UWG Abmahnung. Streitwert €1,500–€5,000; first-letter fees €300–€900; contractual penalty €2,500–€5,100 per repeat. **Exceeds the entire project fee.** | Legal | **M** (very common on fixed-fee freelance builds where client data arrives late) | **H** | The `«…»` placeholder sentinel in `impressum.de.ts` **fails the production build** (§1.1). Impressum data is a named client deliverable with a date. Written statement in the handoff doc that the site must not go live without it. |
| **R2** | **Client never supplies NAP / legal text / photos** → project stalls indefinitely on a fixed fee, developer's effective rate collapses | Client-dependency | **H** | **H** | Send a **single, numbered data-request form on day 1** (see §7.1). Contract clause: fixed fee covers delivery of the UI; if client data is outstanding **> 14 days** after the UI is complete, the developer delivers with placeholders, invoices, and any later integration is billed separately. Do not let the tail eat the margin. |
| **R3** | **Copy drifts into unhedged claims** ("wir beraten", "garantiert", "wir besorgen Ihr Visum") → RDG / § 34d GewO / § 34c GewO / UWG exposure for the client, and reputational exposure for the developer | Legal | **M** (near-certain if the constraint is only in a document) | **H** | Build-time content lint with the banned-lexicon regexes (§1.6), running in CI. `<HedgeNotice>` component on the three highest-risk pages. Approved-verb glossary in the handoff doc. **Written note to the client that a lawyer should review the final copy** — this is the client's obligation, not ours. |
| **R4** | **Any third-party asset sneaks in** (a Google Fonts `<link>` a designer pastes, a Maps iframe, reCAPTCHA) → DSGVO exposure, and the whole "no cookie banner" position collapses | Legal / Technical | **M** | **H** | Hard rule in the handoff doc (§1.3). **Automated check:** a build script that greps the built `dist/**/*.{html,css,js}` for any external origin and fails on a match. ~20 lines, catches it forever. Add a `Content-Security-Policy` meta with `default-src 'self'` — which also *enforces* it at runtime. |

## Tier 2 — Address during the build

| # | Risk | Type | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| **R5** | **Scope creep** — "can we add a booking calendar / a customer login / a blog / online payment / a third language" against a $700 fixed fee | Scope | **H** | **H** | The proposal contains an explicit **IN / OUT** table (§7.2), signed. Every OUT item has a **stated separate price**, so "yes, and it costs €X" is always available and never feels like a refusal. Note in writing that online booking or payment would likely bring the site into **BFSG scope** (§2.1) — a genuine, non-arbitrary reason the price changes. |
| **R6** | **DE/AR content asymmetry breaks the i18n model.** The brief is explicit: the Arabic PDF is not a 1:1 translation — AR omits the "Auch nach der Ankunft" block, merges section 4 into a flat list, has richer "Warum" copy, splits the cleaning list differently. A naive shared-key `t()` model **will** produce empty sections or duplicated German | Technical | **H** (this is not a risk, it is a certainty if unplanned) | **M** | **Per-locale content modules, not a shared key tree.** Each locale exports its own typed structure; the *component* renders whatever sections that locale actually has. Type it so a missing optional block is a `undefined` the component handles, not a missing key. Design the section components to accept `0..n` items. **This is an architecture decision that must be made before the first component is written.** |
| **R7** | **RTL layout bugs discovered late** — mirrored padding, arrows pointing the wrong way, `+49` phone numbers rendering as `49+`, the FAB on the wrong side, the gradient fading from the wrong edge | Technical | **H** | **M** | Logical properties everywhere from commit 1 (§2.10) — Tailwind `ms-/me-/ps-/pe-/start-/end-`. **Ban `left`/`right`/`ml-`/`mr-` via an ESLint/stylelint rule.** `dir="ltr"` on every Latin run inside Arabic copy. **Review every screen in both directions at every milestone, not at the end.** Retrofitting RTL is 3–4× the cost of building it in. |
| **R8** | **The contact form's backend seam is ambiguous** → the backend dev rewrites the form, breaking validation, a11y and states; or the two devs blame each other | Technical / handoff | **M** | **M** | `HANDOFF.md` with the exact request/response contract, the shared zod schema, the four states, the honeypot rule, and the env var (§5.5). Ship the mock implementation so the seam is demonstrably exercised before handoff. |
| **R9** | **Missing/poor photography** → the site looks like a template, which for this audience reads as untrustworthy (§5.3), undermining the whole conversion strategy | Client-dependency | **M** | **M** | Ask at kickoff. If no real photos exist: recommend the client spend **€0 and 90 minutes with a modern phone** on the office, the door, the desk, the cleaning team — genuinely better than stock here. Design a **fallback layout** that leans on typography, the logo motifs and generous whitespace rather than large photography, so the site still looks intentional with three photos instead of fifteen. **Absolutely no stock photos of people.** |
| **R10** | **Client's e-mail deliverability fails** — form mails land in spam, client concludes "the website doesn't work" | Technical (backend-owned) | **M** | **M** | **Out of our scope, but flag it in writing.** Note in `HANDOFF.md` that the backend must send via an authenticated transactional provider with **SPF + DKIM + DMARC** on the client's domain, never `mail()` from shared hosting with a spoofed From. This one paragraph prevents the most common post-launch "the site is broken" complaint from landing on the frontend developer. |

## Tier 3 — Monitor

| # | Risk | Type | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| **R11** | Client later adds analytics / Maps / a chat widget → the "no consent banner" position collapses, Datenschutzerklärung becomes wrong | Legal | **M** | **M** | Explicit written trigger in the handoff doc: *"Adding any third-party script requires a consent banner and a revised Datenschutzerklärung. This is a scope change."* Quote the banner as a named add-on so the price is already known. |
| **R12** | Client is licensed under § 34d / § 34c GewO but the Impressum omits the required register data (§ 5 Abs. 1 Nr. 3 & 5 DDG) | Legal | **L–M** | **M** | Explicitly asked in the day-1 data request (§7.1, items 8–10). The `ImpressumData` type has the fields; if the client answers "yes, licensed", they become required. |
| **R13** | Reference-site palette shipped unchanged → three text contrast failures (gold on cream at **2.65:1**, gold on green at **3.00:1**, footer grey on cream at **3.96:1**) | Accessibility | **H** if not caught at design time | **M** | The three-token gold split + single `--muted` (§2.7), specified **before** the design agent starts. `axe` + Lighthouse a11y gate in CI catches regressions. |
| **R14** | Performance budget blown by a late "just add framer-motion / an icon pack / a slider" | Technical | **M** | **M** | `size-limit` + Lighthouse CI as **build-failing** gates (§6.3). The budget is enforced or it is decoration. |
| **R15** | Client expects Google page-one rankings from the website alone | Expectation | **M** | **M** | Set expectations in writing **now**: verticals 1–5 are long-tail and trust-driven; the discovery engine is **Google Business Profile + reviews + WhatsApp sharing**, not organic. Vertical 6 (Reinigung) is the only one with real transactional volume. GBP setup is a **separate, named, priced deliverable** — do not let it become an unbilled expectation of "the website project". |
| **R16** | A third locale (English/Turkish) is requested after launch | Scope | **L–M** | **L** | The `ROUTES` table + per-locale content modules make adding a locale mechanical rather than architectural. Quote it as `€X per additional locale, content supplied by client` in the OUT table. The architecture already supports it; do not build it now. |
| **R17** | Legal pages behind a JS-only SPA shell → § 5 DDG "ständig verfügbar" argument, plus broken WhatsApp link previews | Legal / Technical | **L** if §0 is followed; **H** if a plain SPA is chosen | **H** | §0 — pre-rendered static HTML per route is a hard architectural requirement. |

## 7.1 The day-1 client data request — send this before writing code

Numbered, one message, one deadline. Everything here blocks either the build or the launch.

1. Exact legal name and legal form (Einzelunternehmen / GbR / UG / GmbH) — as registered
2. Full street address (no Postfach) + which city/region to name as the service area
3. Phone number (display format) + WhatsApp number, if different
4. **Destination e-mail address for form submissions**, and the public contact e-mail
5. Opening hours, per day
6. Handelsregister court + HRB number, if registered
7. USt-IdNr., if one exists (and confirmation whether Kleinunternehmer § 19 UStG)
8. Is there a **§ 34d GewO** insurance-mediation permit? If yes: IHK, Vermittlerregister number
9. Is there a **§ 34c / § 34i GewO** permit (real estate / loan brokerage)? If yes: authority + number
10. Is the cleaning arm registered with a **Handwerkskammer**? If yes: which, and the registration
11. Willingness to participate in Verbraucherschlichtung (§ 36 VSBG) — yes / no
12. Who provides the **Datenschutzerklärung** text? (Lawyer / eRecht24 / other) — **and by when**
13. Who is the hoster, and is an **AVV** in place? Is the hosting in the EU?
14. Photos: office, exterior, team, cleaning work. **And: may we publish a portrait of the owner with their name?**
15. Logo source files: SVG or transparent PNG at ≥ 1000px. Is there an Arabic-locale logo variant?
16. Social profile URLs (Facebook / Instagram / TikTok) for `sameAs`
17. Google Business Profile: does one exist? If yes, the link; if no, who creates it?
18. **What response time will you commit to?** (goes on the page — §5.2 item 4)
19. Domain: registered? Who deploys, and is deployment inside this fee?
20. Any real customer reviews we may quote, with permission?

## 7.2 IN / OUT — the scope table for the proposal

**IN ($700):** React + TS + Tailwind UI, pre-rendered static, 12 routes × 2 locales · full DE/AR with RTL · brand palette with accessibility-corrected tokens · responsive down to 320px · WCAG 2.2 AA build practices · contact form UI with validation, all four states, mock implementation and a documented typed backend seam · WhatsApp integration (FAB + pre-filled deep links) · Impressum + Datenschutzerklärung **page shells and rendering** · SEO head tags, hreflang, canonical, JSON-LD, sitemap, robots · 4 OG images · performance budget enforced in CI · `HANDOFF.md`.

**OUT — priced separately, named explicitly:** backend / form-sending implementation · e-mail deliverability setup (SPF/DKIM/DMARC) · **the legal texts themselves** · copywriting beyond adapting the client's supplied PDFs · translation of any new copy · photography or photo retouching · logo redesign · Google Business Profile creation and optimisation · analytics + cookie consent banner (a package deal — one implies the other) · a third locale · blog / CMS / content-editing capability · online booking or payment (**note: would likely bring the site into BFSG scope**) · hosting, domain, deployment and ongoing maintenance · external accessibility audit or a formal Barrierefreiheitserklärung · post-launch content updates.

---

## OPEN QUESTIONS — consolidated for the client

1. **Legal form and licences** — Einzelunternehmen or GmbH? Any § 34d GewO (insurance), § 34c/§ 34i GewO (real estate/loans), or Handwerkskammer registration? *Each adds mandatory Impressum fields and changes how far the copy can go.* (§1.5)
2. **Who supplies the Datenschutzerklärung, and by when?** We render it; we do not write it. (§1.2)
3. **Will the client publish a portrait and name?** This is the single highest-impact trust element on the site and its absence changes the design. (§5.2)
4. **What response time will the client commit to?** It goes on the page. (§5.2)
5. **Which city / service radius?** Every title, description and the entire local SEO strategy depends on it. (§3.3, §3.8)
6. **GBP: one listing or two** (services + cleaning as separate businesses)? Real upside, real suspension risk. (§4.1)
7. **Branded typography (~€ half-day, +90 KB) or system fonts (0 KB)?** Both are defensible at $700. (§6.3)
8. **Any analytics, ever?** If yes, the "no cookie banner" position ends and the privacy declaration must be rewritten. (§1.3)
9. **Block AI crawlers in robots.txt or not?** My recommendation is not to. One line either way. (§3.7)
10. **Is a third locale coming?** Architecture supports it; do not build it now. (§7.2)
11. **Does the $700 include deployment and domain setup?** Must be settled before work starts.

---

## Sources

- [§ 5 DDG – Allgemeine Informationspflichten (gesetze-im-internet.de)](https://www.gesetze-im-internet.de/ddg/__5.html)
- [Impressumspflicht: rechtssichere Pflichtangaben – eRecht24](https://www.e-recht24.de/artikel/datenschutz/209.html)
- [Impressumspflicht nach § 5 DDG – für Social Media & Websites](https://rehkatsch.com/media-law/impressum-law-germany/)
- [BMJV – Allgemeine Informationspflichten / Impressumspflicht](https://www.bmjv.de/SharedDocs/FAQ/DE/FAQ_Database/Onlineplattformen_Schutzregelungen/FAQ-Onlineplattformen_Schutzregelungen-008.html)
- [Streitwert bei Impressumsverstoß auf 2.500 Euro begrenzt (2026)](https://www.ratgeberrecht.eu/aktuell/streitwert-bei-impressumsverstoss-auf-2-500-euro-begrenzt/)
- [Abmahnung Kosten: Streitwerte und Anwaltskosten 2026](https://abmahn-shield.de/abmahnung-kosten)
- [TDDDG (TTDSG): Cookie-Einwilligung, § 25 & Bußgelder – Cortina Consult](https://cortina-consult.com/web-compliance/wissen/tdddg/)
- [Cookies & TDDDG 2026: rechtssicher tracken (§ 25-Guide)](https://next-levels.de/blog/cookies-consent-and-tdddg-rechtssicheres-tracking)
- [TDDDG Datenschutz – Usercentrics](https://usercentrics.com/de/knowledge-hub/tdddg-datenschutz/)
- [Google Fonts & DSGVO 2026: Aktuelle Urteile & sichere Lösung](https://online-effect.de/google-fonts-urteil-dsgvo-check/)
- [Datenschutz und Google Fonts – eRecht24](https://www.e-recht24.de/artikel/datenschutz/13052-datenschutz-und-google-fonts.html)
- [Kontaktformular DSGVO – Pflichtangaben und Einwilligung 2026](https://nevik.de/blog/posts/kontaktformular-dsgvo-pflichtangaben/)
- [DSGVO: Checkbox bei Kontaktformular notwendig? – Kramer und Partner](https://www.anwaltskanzlei-online.de/en/2018/07/12/dsgvo-checkbox-bei-kontaktformular-notwendig/)
- [Barrierefreiheitsstärkungsgesetz: Rechts-FAQ & Quick-Check – Kanzlei Plutte](https://www.ra-plutte.de/barrierefreiheitsstaerkungsgesetz/)
- [Bundesfachstelle Barrierefreiheit – Das BFSG](https://www.bundesfachstelle-barrierefreiheit.de/DE/Fachwissen/Produkte-und-Dienstleistungen/Barrierefreiheitsstaerkungsgesetz)
- [Diese drei Ausnahmen von der Barrierefreiheitspflicht – Händlerbund](https://ohn.haendlerbund.de/recht/rechtsfragen/diese-drei-ausnahmen-von-der-barrierefreiheitspflicht-sollten-unternehmen-kennen)
- [EN 301 549 Version 4.1.1: What Changes, and When It Applies](https://www.axall.digital/insights/en301549-version-4-1-1-what-changes-and-when-it-applies)
- [EN 301 549 – Deque](https://www.deque.com/en-301-549-compliance/)
- [§ 5 RDG – Rechtsdienstleistungen im Zusammenhang mit einer anderen Tätigkeit](https://www.gesetze-im-internet.de/rdg/__5.html)
- [Das Rechtsdienstleistungsgesetz – IHK Darmstadt](https://www.ihk.de/darmstadt/produktmarken/recht-und-fair-play/gewerberrecht/das-rechtsdienstleistungsgesetz-2537510)
- [Hreflang Canonical Setup Guide: Rules, Errors, Fixes in 2026](https://www.clickrank.ai/hreflang-canonical-setup-guide/)
- [Hreflang x-default best practice – Google Search Central Community](https://support.google.com/webmasters/thread/176302517/hreflang-x-default-best-practice?hl=en)
- [Core Web Vitals 2026: INP, LCP & CLS Thresholds](https://webhelpagency.com/blog/core-web-vitals-2026/)
- [Core Web Vitals Benchmarks 2026: What Good Looks Like](https://www.digitalapplied.com/blog/core-web-vitals-benchmarks-2026-pass-rate-reference)
- [Optimizing Google Business Profile for Multiple Languages](https://inboundrem.com/google-business-profile-languages/)
- [NAP Consistency for Local SEO – Complete Guide 2026](https://www.amigostudios.co/blog/nap-consistency-local-seo)

*All contrast ratios in §2.7 were computed by me from the WCAG 2.x relative-luminance formula against the brief's verbatim token values, not estimated. The two replacement gold tokens (`#8a6008`, `#e8b64a`) were chosen to pass 4.5:1 on their respective backgrounds and verified the same way.*