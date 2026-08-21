# CONTENT MODEL & INFORMATION ARCHITECTURE — Zukunft Service

**Role:** content/information architect · **Phase:** planning only · **Budget frame:** $700 total UI; the content-side share of that is ~11 h (breakdown in §8).

Sources read: `BRIEF.md`, `ref.html`, `ref.css`. Note up front: `ref.html` contains **real-looking NAP data** (Ruhrallee 55, 44139 Dortmund · +49 177 3825632 · info@zukunftservice.de · Mon–Wed 10–16, Thu 10–15, Fri 10–13). That came from someone else's draft, not from our client. It is a **placeholder until the client confirms it in writing** — see §7 and the `verified` flag in the `ContactInfo` type.

---

## 1. Page & section IA — the routing decision

### Decision: **hybrid** — one rich marketing home page *plus* six real, prerendered service pages. No modals.

The reference site puts all six services behind a JS modal on a single URL. That is the wrong call, and the reason is economic, not aesthetic.

**Why hybrid wins on each of the four axes:**

| Axis | Verdict |
|---|---|
| **SEO across 6 verticals** | The six verticals do not share a SERP. "*syrische Urkunden Dortmund*", "*Studienvisum Unterlagen Hilfe*", "*Reinigungsfirma Dortmund Gewerbe*", "*Immobilien Dubai Deutschland Ansprechpartner*" are four unrelated query universes with different buyers. One URL can carry one `<title>`, one `<h1>`, one meta description. A modal carries none — it isn't a document, can't be linked, can't be shared into a WhatsApp group (which is how this audience actually distributes things), and can't be a Google Business Profile service link. Hybrid gives **12 indexable service URLs** (6 × 2 locales) instead of 2. |
| **Client's "showcase" ask** | A showcase is judged on *depth of proof*, not page count. The client's own PDFs contain **67 discrete service items**. A modal shows them as a wall of text you dismiss; a page shows them as a structured document that says "this business has actually thought about this." The home page still does the visual wow. |
| **$700 budget** | This is the crux, and the naive read is wrong. Multi-page cost is **O(1) in templates, O(6) in *data* — and the data already exists** in the client's PDFs. We build **one** `ServicePage` template driven by `services.de.ts` / `services.ar.ts`. Marginal build cost over the modal approach is ~2–3 h (routing, breadcrumbs, per-page SEO, sibling-links block). A modal with correct focus trapping, scroll lock, `aria-modal`, ESC handling and RTL is itself ~3 h and buys nothing. **Hybrid is roughly cost-neutral and strictly more valuable.** |
| **Bilingual routing** | Anchors make bilingual *worse*: `/#leistungen` has no locale in the URL, so the locale lives in `localStorage` or a class toggle (exactly what the reference does with `.rtl`) — unshareable, uncrawlable, no `hreflang`, and Google indexes only whichever locale rendered first. Prefixed routes give clean `hreflang` pairs and let the language switch land on the **equivalent page** instead of dumping you back at the top of home (a real bug in the reference). |

**Rejected:** pure SPA-with-anchors (SEO ≈ zero for 5 of 6 verticals); full multi-page with a separate `/ueber-uns` page (thin content — see below).

### Deliberate *reductions* (budget honesty)

- **No standalone About page.** The client's material yields ~5 bullets and two slogans. A 90-word About page is an SEO liability and a design problem. "Über uns" becomes `#ueber-uns` on home, and the nav anchors there.
- **No blog, no FAQ page, no testimonials section.** The `FaqItem[]` field exists in the model (optional, renders only when present) so it is a zero-cost future addition, but no FAQ ships unless the client writes the answers.
- **`/leistungen/` hub page is conditional.** It ships only if the client supplies ~150 words of unique overview copy. If they don't by content-freeze, `/de/leistungen/` becomes a redirect to `/de/#leistungen` and we lose one thin page, nothing else. This is written into the route table as a flag.

### Locale prefix strategy: **always-prefix**

`/de/…` and `/ar/…` both prefixed; bare `/` is a host-level 302 to `/de/` (documented as a `_redirects` / `vercel.json` rule in the handoff, not a React redirect). German is `x-default`. Reasons: no duplicate-content ambiguity between `/` and `/de/`, symmetric route table, and the backend dev inherits one rule instead of a special case.

### Arabic slugs: **Arabic script, with an ASCII escape hatch in the data**

`/ar/الخدمات/الدراسة-والتأشيرات` ships. Justification: this audience shares links through WhatsApp and Telegram, which render percent-encoded UTF-8 paths **decoded** in the preview — an Arabic slug is legible to the recipient, a transliterated one (`dirasa-taasheerat`) is legible to nobody. It is also a genuine (if small) Arabic-SERP signal.

Risk is contained by design: every `ServiceContent` carries **both** `slug` and `slugAscii`. If the tech lead's prerenderer or host mishandles non-ASCII output paths, **one field changes in one data file** and the entire site flips to ASCII slugs — no template, no component, no type touches it. That is the whole point of putting slugs in content rather than in the router.

### Final sitemap

| RouteId | German | Arabic | Notes |
|---|---|---|---|
| `home` | `/de/` | `/ar/` | full marketing page |
| `services` | `/de/leistungen/` | `/ar/الخدمات/` | conditional (see above) |
| `service` ×6 | `/de/leistungen/{slug}` | `/ar/الخدمات/{slug}` | one template, 6 data objects/locale |
| `contact` | `/de/kontakt/` | `/ar/اتصل-بنا/` | NAP + hours + map + form |
| `imprint` | `/de/impressum/` | `/ar/impressum/` | **AR path stays German** — §5 DDG mandates a recognisably-labelled Impressum |
| `privacy` | `/de/datenschutz/` | `/ar/datenschutz/` | same reasoning; AR *body* is translated, path/label keeps the German term in parentheses |
| `notFound` | `/de/404` | `/ar/404` | |
| — | `/` → 302 `/de/` | | host rule |

**Six DE service slugs:** `einbuergerung-behoerden-dokumente` · `ehe-uebersetzungen-dokumente` · `studium-universitaet-visa` · `finanzen-kredite-vorsorge` · `immobilien-investitionen` · `reinigungsservice`

**Six AR service slugs:** `الجنسية-والوثائق` · `الزواج-والترجمة` · `الدراسة-والتأشيرات` · `الأمور-المالية` · `العقارات-والاستثمار` · `خدمات-التنظيف`

**Totals: 26 prerendered HTML documents, 7 templates.** Every route needs `<link rel="alternate" hreflang>` to its twin plus `x-default`, and `<html lang dir>` set per locale (`ar` → `dir="rtl"` on the document element, not a `.rtl` class on `<main>` as the reference does — that leaks LTR into portals, tooltips and the scrollbar side).

**Structured data (cheap, high ROI for a local business):** one `LocalBusiness` JSON-LD block on home + contact (derived from `ContactInfo`, zero manual authoring), `BreadcrumbList` on service pages, `Service` on each service page. ~1 h total, generated from data already in the model.

> **OPEN QUESTION (tech lead, not me):** prerendering mechanism. The IA requires 26 real HTML documents. `vite-react-ssg` (0.8.x, built on React Router 7) satisfies it on a Vite/React/TS stack; Next.js App Router with `output: 'export'` also satisfies it. I have no preference — I only require that **each route emits static HTML with its own `<title>`, meta description and `hreflang`.** If the chosen stack cannot do that, the hybrid IA loses most of its value and we should revisit.

---

## 2. Home page — section-by-section, with changes from the reference

Reference order was: header → hero → 2-card split → 6-card grid (modals) → cleaning panel → why → WhatsApp form → info strip → footer → FAB → modal.

**Our order:**

| # | Section | Purpose | Content |
|---|---|---|---|
| 0 | **Skip link + sticky header** | nav, locale | Logo · Start / Leistungen / Über uns / Kontakt · locale pill · **hamburger + drawer < 980px** |
| 1 | **Hero** (split, cream) | position in 3 seconds | Eyebrow `Dienstleistungen & Reinigung in Dortmund` · H1 **`Viele Anliegen. Ein Ansprechpartner.`** · lead = the client's positioning line · primary CTA `Anliegen schildern` + ghost CTA `Leistungen ansehen` · 3-item trust row · faded image |
| 2 | **Two arms** (Büroservice / Reinigungsservice) | the mental model of the business | 2 feature cards, `01`/`02`, each linking into the grid / cleaning page |
| 3 | **★ NEW — "So arbeiten wir" 3-step strip** | convert anxiety into clarity | `01 Anliegen schildern` → `02 Gemeinsam sortieren, welche Unterlagen nötig sind` → `03 Nächste Schritte – und, wo nötig, Vermittlung an eine geeignete Fachstelle` |
| 4 | **Leistungen grid — 6 cards** | the taxonomy | 6 cards, **each an `<a>` to a real page**. Cleaning is card `06`, in the grid, like everything else |
| 5 | **Cleaning highlight panel** (deep green) | second buyer persona | 10-item checklist, teaser → `/leistungen/reinigungsservice` |
| 6 | **Warum Zukunft Service** — **5** cards | trust | the client's five points, gold top-border, cream bg |
| 7 | **★ NEW — "Was wir tun – und was nicht"** | legal shield + trust | two calm columns: what we support with / *"Wir bieten keine Rechts-, Steuer- oder Versicherungsberatung. Wo Fachwissen erforderlich ist, vermitteln wir an geeignete Fachstellen und Partner."* |
| 8 | **Kontakt** (deep green) | **the one functional requirement** | white 2-col form card → **email**; WhatsApp/phone/email as secondary quick-contact strip |
| 9 | **Info strip** (white) | local SEO + practicality | hours (bilingual day labels), address, phone, email, Maps link |
| 10 | **Footer** (`#f4ecdf`) | legal + wayfinding | logo, slogan `Viele Lösungen. Ein Ansprechpartner.`, nav, **Impressum · Datenschutz**, © |
| 11 | **WhatsApp FAB** | this audience's default channel | RTL-mirrored, conditional on client confirming the number |

### What I changed and why

1. **Modal → real pages.** (§1.) Also removes a focus-management accessibility liability we'd otherwise have to build correctly.
2. **Added the 3-step process strip (§3).** This is my largest addition and I'd defend it hardest. The client's own final CTA is *"Sie haben ein Anliegen und wissen nicht, wo Sie anfangen sollen?"* — the product **is** the removal of that uncertainty. The reference never shows the process. It is also the **legally safest possible way to describe the business**: a process description makes no outcome promise. Cost: one row of three items.
3. **Added the scope-boundary band (§7).** The reference hides this as a single grey `.service-note` line under the grid. Promoting it does three jobs at once: RDG/StBerG/§34d protection, a genuine trust signal (stating your boundary reads as competence, not weakness), and lead filtration — it stops "can you represent me in court" enquiries from reaching the owner's inbox.
4. **Cleaning moved into the grid** as `06` *and* kept as a highlight panel. The reference excluded cleaning from the grid entirely, which contradicts the client's own PDF where cleaning is Section 6. Visual emphasis is a design decision; it must not become a **structural** special case, or the data model grows an exception.
5. **"Warum" restored from 4 → 5 cards.** The reference dropped *"Individuelle Unterstützung passend zu Ihrem Anliegen"* — which is precisely the point the Arabic PDF expands on most ("clear and simple steps; you know what's required and what comes next"). Dropping it would have made the DE/AR asymmetry worse, not better. 5 cards also breaks the reference's dead-even 4-across grid (3+2 or a 5-col row reads less like a template).
6. **Form target: WhatsApp → email.** Hard requirement from the client. WhatsApp is demoted to a secondary channel, not deleted — it is how this audience actually communicates.
7. **Form gains a DSGVO consent checkbox + honeypot field.** Non-negotiable for a German contact form that transmits personal data.
8. **Header gains a real mobile drawer.** Below 980px the reference does `nav { display: none }` with no replacement — the site is unnavigable on a phone, for an audience that is overwhelmingly mobile-first. Straight bug fix.
9. **Footer gains Impressum + Datenschutz.** Their absence is not a design flaw, it is a §5 DDG violation with a real *Abmahnung* risk.

### Service page template (one template, 6 data objects, 2 locales)

Breadcrumb → eyebrow `Leistung 03` → H1 → intro paragraph → image band → **`blocks[]` rendered by kind** → optional highlight block → per-service legal notice (tone driven by `legalSensitivity`) → closing line → CTA card ("Anliegen schildern") prefilled with this `serviceId` → 3 sibling service cards → optional FAQ.

---

## 3. The TypeScript content model

Path: `src/content/`. All content is **typed TS data files, not JSON** — TS gives compile-time key enforcement and exhaustiveness for free, which is the entire defence against the DE/AR asymmetry problem in §4.

```
src/content/
  types.ts          // everything below
  locales.ts        // Locale, dir, routes, segment tables
  services.meta.ts  // locale-invariant spine (icons, order, images)
  services.de.ts    // ServiceContent × 6
  services.ar.ts    // ServiceContent × 6
  why.ts            // both locales
  contact.ts        // NAP, locale-invariant
  nav.ts            // both locales
  ui.de.ts / ui.ar.ts   // microcopy: buttons, form labels, states
  gaps.ts           // CONTENT_GAPS registry + auditParity()
```

### 3.1 Primitives

```ts
export const LOCALES = ['de', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];
export type Dir = 'ltr' | 'rtl';
export const DIR: Record<Locale, Dir> = { de: 'ltr', ar: 'rtl' };

export const SERVICE_IDS = [
  'authorities',          // 01 Einbürgerung, Behörden & Dokumente
  'marriage-translation', // 02 Ehe, Übersetzungen & int. Dokumente
  'study-visa',           // 03 Studium, Universität & Visa
  'finance',              // 04 Finanzen, Kredite & Vorsorge
  'real-estate',          // 05 Immobilien & Investitionen
  'cleaning',             // 06 Reinigungsservice
] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

/** lucide-react icon name, narrowed so a typo fails the build. */
export type IconName =
  | 'Stamp' | 'Languages' | 'GraduationCap'
  | 'Landmark' | 'Building2' | 'SprayCan'
  | 'HandHeart' | 'Layers' | 'MessagesSquare' | 'Network' | 'Route';

export interface ImageRef {
  src: string; width: number; height: number;
  /** alt is per-locale, so it lives in content, not here. */
  focal?: 'center' | 'top' | 'start' | 'end';
}
```

### 3.2 The spine (locale-invariant — exists once, never translated)

```ts
export interface ServiceMeta {
  id: ServiceId;
  order: 1 | 2 | 3 | 4 | 5 | 6;
  icon: IconName;
  arm: 'office' | 'cleaning';        // drives the §2 two-arm split
  accent: 'green' | 'sage' | 'gold';
  image: ImageRef;
  /** selects which scope-boundary notice the page renders. */
  legalSensitivity: 'low' | 'medium' | 'high';
}
export const SERVICE_META: Record<ServiceId, ServiceMeta> = { /* … */ };
```

### 3.3 Blocks — the answer to "the six services have different internal shapes"

This is the central modelling move. Do **not** model "flat list service" and "sub-block service" as two different service types — that forces a union at the top level, two renderers, and a per-locale shape mismatch (AR §4 is flat where DE §4 has sub-blocks, which would make the *same service* two different types in two languages — unworkable).

Instead: **every service is `ServiceBlock[]`.** A flat list is *one* untitled `list` block. Sub-blocks are *several* titled `list` blocks. Same type, same renderer, and DE/AR are free to differ in block count without differing in type.

```ts
interface BlockBase { /** stable across locales where the block is shared */ id: string }

export interface ListBlock extends BlockBase {
  kind: 'list';
  title?: string;                       // absent ⇒ flat list, no sub-heading
  intro?: string;
  items: string[];
  layout?: 'checks' | 'two-column' | 'plain';
}

/** Visually distinct callout. "Auch nach der Ankunft…" is this. */
export interface HighlightBlock extends BlockBase {
  kind: 'highlight';
  title: string; intro: string; items: string[]; closing?: string;
}

/** Prose with no list. "Übersetzungsservice" is this. */
export interface ProseBlock extends BlockBase {
  kind: 'prose'; title?: string; body: string;
}

/** Scope/legal boundary. tone drives styling, never invented per page. */
export interface NoticeBlock extends BlockBase {
  kind: 'notice'; tone: 'legal' | 'info'; body: string;
}

export type ServiceBlock = ListBlock | HighlightBlock | ProseBlock | NoticeBlock;
```

Renderer is a five-case exhaustive switch; `never` in the default branch means adding a block kind later is a compile error until every renderer handles it.

### 3.4 Service content (per locale)

```ts
export interface Seo { title: string; description: string; }

export interface FaqItem { id: string; q: string; a: string; }

export interface ServiceContent {
  id: ServiceId;
  slug: string;          // ships in the URL
  slugAscii: string;     // redirect alias / analytics key / escape hatch
  eyebrow: string;       // "Leistung 03" · "الخدمة 03"
  title: string;         // <h1>
  cardTitle: string;     // grid card — copy-fit budget in §6
  cardDescription: string;
  imageAlt: string;
  intro: string;
  blocks: ServiceBlock[];
  closing?: string;
  seo: Seo;
  faq?: FaqItem[];
  /** gate: nothing marked draft may ship without client sign-off. */
  status: 'final' | 'draft-needs-client-approval';
}

/** Record<> forces all 6 services to exist in BOTH locales. */
export type ServiceContentMap = Record<Locale, Record<ServiceId, ServiceContent>>;
```

### 3.5 Why points, contact, navigation, form seam

```ts
export const WHY_IDS = ['personal', 'one-hand', 'multilingual', 'network', 'tailored'] as const;
export type WhyId = (typeof WHY_IDS)[number];

export interface WhyPoint { id: WhyId; icon: IconName; title: string; body: string }
export type WhyContent = Record<Locale, Record<WhyId, WhyPoint>>;
// AR bodies run ~2× the DE bodies. Type permits it; the design must (see §6 copy-fit).

export type DayKey = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun';
export interface OpeningHour { day: DayKey; open: string | null; close: string | null }

/** Locale-invariant NAP. One source for footer, info strip, contact page, JSON-LD, Impressum. */
export interface ContactInfo {
  legalName: string;            // Impressum-exact, incl. legal form
  tradeName: 'Zukunft Service';
  street: string; postalCode: string; city: string; country: 'DE';
  phoneE164: `+${string}`; phoneDisplay: string;
  whatsappE164?: `+${string}`;
  email: string;
  mapsUrl: string;
  hours: OpeningHour[];
  hoursNote?: LocalizedString;  // "Termine nach Vereinbarung."
  managingDirector: string;
  vatId?: string; registerCourt?: string; registerNumber?: string;
  /** false ⇒ placeholder data. Release checklist blocks on this. */
  verified: boolean;
}
export type LocalizedString = Record<Locale, string>;

export type RouteId = 'home'|'services'|'service'|'contact'|'imprint'|'privacy'|'notFound';

export const SEGMENTS: Record<Locale, Record<Exclude<RouteId,'home'|'service'|'notFound'>, string>> = {
  de: { services: 'leistungen', contact: 'kontakt', imprint: 'impressum', privacy: 'datenschutz' },
  ar: { services: 'الخدمات',    contact: 'اتصل-بنا', imprint: 'impressum', privacy: 'datenschutz' },
};

export type NavTarget =
  | { kind: 'route'; routeId: Exclude<RouteId, 'service'> }
  | { kind: 'service'; serviceId: ServiceId }
  | { kind: 'anchor'; hash: string }              // always on home
  | { kind: 'external'; href: string };

export interface NavItem { id: string; label: string; target: NavTarget }
export type NavContent = Record<Locale, { primary: NavItem[]; footer: NavItem[]; legal: NavItem[] }>;

/**
 * Language switch must land on the EQUIVALENT page, not home.
 * (The reference site's switch resets you to the top of the homepage.)
 */
export function alternatePath(
  to: Locale, routeId: RouteId, serviceId?: ServiceId,
): string {
  if (routeId === 'service' && serviceId) {
    return `/${to}/${SEGMENTS[to].services}/${SERVICES[to][serviceId].slug}`;
  }
  if (routeId === 'home' || routeId === 'notFound') return `/${to}/`;
  return `/${to}/${SEGMENTS[to][routeId]}/`;
}
```

**Form seam** — note `serviceId` reuses the same union, so the backend dev can route/label emails off the taxonomy with zero extra agreement:

```ts
export interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  serviceId: ServiceId | 'other';
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  preferredTime?: string;
  consent: true;              // DSGVO — literal true, unchecked won't type-check
  locale: Locale;             // so the reply is written in the right language
  sourcePath: string;         // which service page produced the lead
  hp?: '';                    // honeypot, must be empty
}
```

### 3.6 Worked example — Service 03 in both locales

**German** (`services.de.ts`) — three blocks, including the post-arrival highlight:

```ts
'study-visa': {
  id: 'study-visa',
  slug: 'studium-universitaet-visa',
  slugAscii: 'studium-universitaet-visa',
  eyebrow: 'Leistung 03',
  title: 'Studium, Universität & Visa',
  cardTitle: 'Studium & Visa',
  cardDescription:
    'Studienplatzsuche, Bewerbung, Zulassung sowie Studien-, Schengen- und Besuchsvisa.',
  imageAlt: 'Studentin bereitet Bewerbungsunterlagen vor',
  intro:
    'Sie möchten in Deutschland oder Europa studieren oder benötigen Unterstützung bei der '
    + 'Vorbereitung eines Visumantrags? Wir helfen Ihnen bei den organisatorischen Schritten.',
  blocks: [
    {
      kind: 'list', id: 'studium', title: 'Studium & Universität', layout: 'checks',
      items: [
        'Suche nach passenden Studienmöglichkeiten',
        'Unterstützung bei Hochschulbewerbungen',
        'Vorbereitung und Zusammenstellung der Bewerbungsunterlagen',
        'Unterstützung bei Zulassungsverfahren',
        'Organisation erforderlicher Dokumente',
        'Vorbereitung von Unterlagen für ein Studienvisum',
      ],
    },
    {
      kind: 'list', id: 'visa', title: 'Visa', layout: 'checks',
      items: [
        'Studienvisa', 'Schengen-Visa', 'Touristenvisa', 'Besuchsvisa',
        'Vorbereitung und strukturierte Zusammenstellung der erforderlichen Unterlagen',
      ],
    },
    {
      kind: 'highlight', id: 'nach-der-ankunft',
      title: 'Auch nach der Ankunft sind wir für Sie da',
      intro:
        'Unsere Unterstützung endet nicht mit dem Visum oder der Einreise nach Deutschland. '
        + 'Gerade in der ersten Zeit begleiten wir Studierende bei den wichtigsten '
        + 'organisatorischen Schritten.',
      items: [
        'Suche nach einer geeigneten Unterkunft',
        'Unterstützung bei der Anmeldung beim Einwohnermeldeamt',
        'Orientierung und Begleitung bei wichtigen Behördengängen',
        'Vorbereitung notwendiger Unterlagen',
        'Organisatorische Unterstützung rund um Universität und Studienbeginn',
        'Orientierung bei den ersten Schritten im Alltag in Deutschland',
      ],
    },
    {
      kind: 'notice', id: 'scope', tone: 'legal',
      body:
        'Wir übernehmen die organisatorische Vorbereitung Ihrer Unterlagen. Über die Erteilung '
        + 'eines Visums entscheiden ausschließlich die zuständigen Behörden und Auslandsvertretungen.',
    },
  ],
  closing: 'Vom ersten Antrag bis zu den ersten Schritten in Deutschland – wir begleiten Sie auf Ihrem Weg.',
  seo: {
    title: 'Studium & Visa in Dortmund – Unterstützung bei Bewerbung und Unterlagen | Zukunft Service',
    description:
      'Unterstützung bei Studienplatzsuche, Hochschulbewerbung und der Vorbereitung von '
      + 'Unterlagen für Studien-, Schengen- und Besuchsvisa. Mehrsprachig, persönlich, in Dortmund.',
  },
  status: 'final',
}
```

**Arabic** (`services.ar.ts`) — **same `id`, same slot in `Record<ServiceId, …>`, but two blocks instead of three.** The type accepts this; the gap registry records it:

```ts
'study-visa': {
  id: 'study-visa',
  slug: 'الدراسة-والتأشيرات',
  slugAscii: 'dirasa-taasheerat',
  eyebrow: 'الخدمة 03',
  title: 'الدراسة، الجامعات والتأشيرات',
  cardTitle: 'الدراسة والتأشيرات',
  cardDescription: 'البحث عن الجامعات، التقديم، وتجهيز أوراق تأشيرات الدراسة وشنغن والزيارة.',
  imageAlt: 'طالبة تجهّز أوراق التقديم الجامعي',
  intro:
    'هل ترغب في الدراسة في ألمانيا أو أوروبا، أو تحتاج إلى مساعدة في تحضير طلب تأشيرة؟ '
    + 'نساعدك في الخطوات التنظيمية اللازمة.',
  blocks: [
    {
      kind: 'list', id: 'studium', title: 'الدراسة والجامعات', layout: 'checks',
      items: [
        'البحث عن فرص دراسية مناسبة',
        'المساعدة في التقديم إلى الجامعات',
        'تحضير وتنظيم أوراق التقديم',
        'المتابعة في إجراءات القبول',
        'تنظيم الوثائق المطلوبة',
        'تحضير الأوراق اللازمة لتأشيرة الدراسة',
      ],
    },
    {
      kind: 'list', id: 'visa', title: 'التأشيرات', layout: 'checks',
      items: [
        'تأشيرات الدراسة',
        'تأشيرات شنغن',
        'التأشيرات السياحية',
        'تأشيرات الزيارة',
        'تجهيز وترتيب المستندات المطلوبة بشكل منظم',
      ],
    },
    // NOTE: block 'nach-der-ankunft' is absent — the client's Arabic PDF omits it.
    // Registered in CONTENT_GAPS as decision:'translate', owner:'agency', pending approval.
    {
      kind: 'notice', id: 'scope', tone: 'legal',
      body:
        'نقوم بالتحضير التنظيمي لأوراقك. أما قرار منح التأشيرة فيعود حصراً إلى الجهات '
        + 'والسفارات المختصة.',
    },
  ],
  closing: 'من أول طلب وحتى خطواتك الأولى في ألمانيا — نرافقك في الطريق.',
  seo: {
    title: 'الدراسة والتأشيرات في ألمانيا – مساعدة في التقديم والأوراق | Zukunft Service',
    description:
      'مساعدة في البحث عن الجامعات، التقديم، وتحضير أوراق تأشيرات الدراسة وشنغن والزيارة. '
      + 'خدمة بالعربية والألمانية في دورتموند.',
  },
  status: 'draft-needs-client-approval',
}
```

The service page renderer needs **zero** locale-specific branching to handle this. It maps `blocks`.

---

## 4. The DE/AR asymmetry strategy — the highest-risk decision

### Recommendation: **(c) — "shared spine, per-locale body, explicit gap registry."** Not (a), not (b).

**Why not (a) forced symmetry.** Forcing symmetric keys means *we* write the missing Arabic. In this project that is not a translation task, it is **authoring regulated marketing copy in a language the client's customers read and the client's competitors read, about visa and insurance and insolvency.** If we invent Arabic for the post-arrival block and get a hedging verb wrong, the client carries the liability, not us. Forced symmetry also silently converts "content is missing" into "content is wrong" — the worst failure mode, because nothing is visibly broken.

**Why not (b) free-form per-locale trees.** Two independent trees means the language switch cannot guarantee a destination exists, `hreflang` pairs break, the nav can differ between locales, and every component needs defensive optional-chaining. It also makes the divergence *invisible* — nobody can answer "what's missing in Arabic?" without diffing two files by eye. At handoff, the backend dev inherits a landmine.

### The shape of (c)

Split the content into two zones with **different parity rules**, enforced by the types:

| Zone | Parity rule | Enforced by | Contents |
|---|---|---|---|
| **Spine** — structural | **Must be identical in both locales.** A missing key is a broken UI. | `Record<Locale, Record<Key, …>>` — TS errors on any missing service, why-point, nav item, form label, button label, or SEO field | 6 `ServiceId`s · 5 `WhyId`s · nav item ids · `RouteId`s · all of `ui.*.ts` · `title`/`cardTitle`/`cardDescription`/`intro`/`slug`/`seo` on every service |
| **Body** — editorial | **May diverge freely.** Block count, item count, wording, length. | `blocks: ServiceBlock[]` — an array, deliberately unconstrained | every `ServiceBlock`, every `items[]`, every `WhyPoint.body` |

The spine is what the *interface* depends on. The body is what the *reader* depends on. Only the first must be symmetric, and the type system draws the line exactly there.

```ts
export type ServiceContentMap = Record<Locale, Record<ServiceId, ServiceContent>>;
//                                     ^ spine: both locales, all six, mandatory
//                                                             ^ body inside is free
```

`ServiceContent` deliberately makes `blocks` the *only* free field — every other field is required in both locales. So Arabic can lack the post-arrival block, but Arabic can never lack an `<h1>`, a card description, or a meta description.

### Making divergence visible: the gap registry

Divergence that isn't written down becomes a bug. So it gets written down, in typed code, and it becomes the client sign-off artefact:

```ts
export interface ContentGap {
  scope: ServiceId | 'why' | 'global';
  blockId: string;
  presentIn: Locale[];
  missingIn: Locale[];
  decision: 'translate' | 'restructure' | 'intentional' | 'awaiting-client';
  owner: 'client' | 'agency';
  note: string;
}

export const CONTENT_GAPS: ContentGap[] = [
  {
    scope: 'study-visa', blockId: 'nach-der-ankunft',
    presentIn: ['de'], missingIn: ['ar'],
    decision: 'translate', owner: 'client',
    note: 'Post-arrival support is the single strongest differentiator in the whole deck. '
        + 'Its absence from the Arabic PDF is almost certainly an oversight, not a decision — '
        + 'the Arabic-speaking audience is exactly who needs it. We supply a draft AR '
        + 'translation; client must approve wording before launch. Until approved, the AR page '
        + 'renders two blocks and is complete-looking, not broken.',
  },
  {
    scope: 'finance', blockId: 'kredite|insolvenz|versicherungen',
    presentIn: ['de'], missingIn: [],
    decision: 'restructure', owner: 'agency',
    note: 'AR PDF merges 14 items into one flat list. We re-split into the same three named '
        + 'sub-blocks (القروض والتمويل / الصعوبات المالية والإفلاس / التأمين والادخار). This is '
        + 'presentation, not new content: no item is added, removed or reworded — a 14-item '
        + 'undifferentiated list is unreadable on mobile. Client confirms the three headings.',
  },
  {
    scope: 'why', blockId: 'multilingual|tailored',
    presentIn: ['de', 'ar'], missingIn: [],
    decision: 'intentional', owner: 'agency',
    note: 'AR bodies are ~2× the DE bodies and BETTER. Do not level German up (inventing German) '
        + 'or Arabic down (deleting the client\'s best copy). Design must absorb a 2× body-length '
        + 'delta inside one card — see the copy-fit budget. This asymmetry ships as-is.',
  },
  {
    scope: 'cleaning', blockId: 'raeume',
    presentIn: ['de', 'ar'], missingIn: [],
    decision: 'intentional', owner: 'agency',
    note: 'DE 10 items, AR 11 (المنازل and الشقق listed separately). Grid must not assume an '
        + 'even count or a fixed row length. No content change.',
  },
];

/** Dev-only. Fails CI if a locale drifts without a registered gap. */
export function auditParity(map: ServiceContentMap): ContentGap[] {
  const unregistered: ContentGap[] = [];
  for (const id of SERVICE_IDS) {
    const known = new Set(CONTENT_GAPS.filter(g => g.scope === id).map(g => g.blockId));
    const ids = (l: Locale) => new Set(map[l][id].blocks.map(b => b.id));
    const de = ids('de'), ar = ids('ar');
    for (const b of de) if (!ar.has(b) && !known.has(b))
      unregistered.push({ scope: id, blockId: b, presentIn: ['de'], missingIn: ['ar'],
                          decision: 'awaiting-client', owner: 'agency', note: 'UNREGISTERED DRIFT' });
    for (const b of ar) if (!de.has(b) && !known.has(b))
      unregistered.push({ scope: id, blockId: b, presentIn: ['ar'], missingIn: ['de'],
                          decision: 'awaiting-client', owner: 'agency', note: 'UNREGISTERED DRIFT' });
  }
  return unregistered;
}
```

~25 lines, one afternoon hour. It converts the project's biggest invisible risk into a list the client initials.

### Three hard rules that come with this

1. **Never machine-translate hedged legal copy.** Any AR string we author carries `status: 'draft-needs-client-approval'` and does not go live without the client's written OK. The hedging in §4 (finance) and §3 (visa) is load-bearing and does not survive round-tripping.
2. **Block `id`s are shared vocabulary, not display strings.** `'nach-der-ankunft'` stays that ASCII id in the Arabic file too. Ids are the join key that makes `auditParity` possible.
3. **A missing block must never look like a rendering failure.** Because the body zone is an array, a two-block Arabic page is simply a two-block page — no gaps, no empty headings, no "undefined". This is what makes divergence *safe* rather than merely *permitted*.

---

## 5. Service card taxonomy — the six verticals

Following the **client's own PDF taxonomy** (cleaning is Section 6, a peer service — not the reference site's split where cleaning was excluded from the grid).

| # | `ServiceId` | DE slug / AR slug | DE card title / AR card title | DE one-liner / AR one-liner | Icon concept (`lucide-react`) | Detail items |
|---|---|---|---|---|---|---|
| 01 | `authorities` | `einbuergerung-behoerden-dokumente` / `الجنسية-والوثائق` | **Einbürgerung & Behörden** / **الجنسية والوثائق** | Anträge, Formulare, Behördenpost und die Beschaffung syrischer und irakischer Dokumente. / تحضير المعاملات الرسمية واستخراج الوثائق السورية والعراقية. | `Stamp` — stamped document; the single most recognisable object in this world | **10** (1 flat list) |
| 02 | `marriage-translation` | `ehe-uebersetzungen-dokumente` / `الزواج-والترجمة` | **Ehe & Übersetzungen** / **الزواج والترجمة** | Übersetzung, Beglaubigung und Unterlagen rund um Eheschließung und Personenstand. / ترجمة وتصديق الوثائق وتجهيز أوراق الزواج للاعتراف بها في ألمانيا. | `Languages` — two scripts, mirrors the whole site's bilingual premise | **6** + 1 prose block (Übersetzungsservice) |
| 03 | `study-visa` | `studium-universitaet-visa` / `الدراسة-والتأشيرات` | **Studium & Visa** / **الدراسة والتأشيرات** | Studienplatzsuche, Bewerbung, Zulassung sowie Studien-, Schengen- und Besuchsvisa. / البحث عن الجامعات، التقديم، وتجهيز أوراق تأشيرات الدراسة وشنغن والزيارة. | `GraduationCap` | **17** DE (3 blocks) / **11** AR (2 blocks) |
| 04 | `finance` | `finanzen-kredite-vorsorge` / `الأمور-المالية` | **Finanzen & Vorsorge** / **الأمور المالية والتأمين** | Unterlagen für Kredite und Finanzierungen, Vorbereitung bei Insolvenz, Vorsorgethemen. / ترتيب الأوراق المالية والتواصل مع جهات مختصة للقروض والتأمين. | `Landmark` — institution, *not* a coin/money-bag; deliberately avoids implying we handle money | **14** (3 blocks) · `legalSensitivity: 'high'` |
| 05 | `real-estate` | `immobilien-investitionen` / `العقارات-والاستثمار` | **Immobilien & Investitionen** / **العقارات والاستثمار** | Orientierung beim Immobilienkauf in Deutschland und bei Projekten in Dubai. / التوجيه عند شراء عقار في ألمانيا وفرص الاستثمار في دبي. | `Building2` | **10** (2 blocks: Deutschland / Dubai) · `legalSensitivity: 'high'` |
| 06 | `cleaning` | `reinigungsservice` / `خدمات-التنظيف` | **Reinigungsservice** / **خدمات التنظيف** | Professionelle Reinigung für Büros, Wohnungen, Praxen, Schulen und Gewerbeflächen. / تنظيف احترافي للمكاتب والمنازل والمدارس والمحلات والعيادات. | `SprayCan` | **10** DE / **11** AR (1 list, `two-column`) · `legalSensitivity: 'low'` |

**Total: 67 DE detail items across 12 blocks.** That number is the "showcase" argument in a single figure, and it is why these belong on pages rather than in a modal.

**Icon set decision:** `lucide-react` (0.x — **pin the exact version at install**; lucide renames icons within 0.x minors). Rendered at `strokeWidth={1.5}`, 28px, `--sage` stroke with a `--gold` accent dot behind, so the set reads as brand-specific rather than off-the-shelf. Custom-drawn icons are not defensible at $700. The `IconName` union above means a renamed lucide export fails the build rather than rendering an empty box.

**Why-point icons:** `HandHeart` (personal) · `Layers` (one-hand) · `MessagesSquare` (multilingual) · `Network` (partners) · `Route` (tailored/clear steps).

---

## 6. Copy strategy

### Voice — German

Formal **Sie**, always. Verb-led, not *Nominalstil*. Sentences ≤ 22 words. No exclamation marks anywhere on the site. The core noun is the client's own: **"Anliegen"** — never "Fall", never "Problem", never "Kunde" in body copy. The core verbs are the hedges: **unterstützen bei · begleiten · vorbereiten · zusammenstellen · organisieren · strukturieren · vermitteln an**. Every service item in the PDFs already uses one; keep them verbatim wherever possible — the client (or their advisor) chose that wording carefully and rewriting it for "punchiness" is the single easiest way to create liability.

### Voice — Arabic

Warm second person, **simple MSA with colloquial warmth** — not full ʿāmmiyya (it dates badly and reads unprofessional in a business context), not stiff bureaucratic MSA (it reads like the very institutions the customer is intimidated by). Verbs like **نساعدك · نرافقك · نجهّز لك · ننظّم · نوجّهك**. The client's own AR line *"نساعدك على…"* sets the register — match it.

Two Arabic-specific rules that matter more than tone:

1. **Keep German institution names in German, glossed in Arabic**: `دائرة تسجيل السكان (Einwohnermeldeamt)`, `دائرة الأحوال المدنية (Standesamt)`, `الإفلاس الشخصي (Privatinsolvenz)`. The user will be handed a German letter with that exact word on it. A pure Arabic translation is prettier and less useful.
2. **The brand name is never translated or transliterated.** Always Latin `Zukunft Service`, even mid-Arabic-sentence. Also applies to the tagline `Alles aus einer Hand`, which is a logo asset.

> **OPEN QUESTION — Arabic grammatical gender.** Arabic second person is gendered (`نساعدك` masc. / `نساعدكِ` fem.). I recommend **masculine singular as the unmarked default** — standard practice for Arabic-language service marketing and what the client's own PDF appears to use — combined with preferring **impersonal constructions** wherever they read naturally (`المساعدة في التقديم` rather than `نساعدك في التقديم`) to reduce gendering without dual-form clutter. This is a cultural call the client should make explicitly, not one I should make for them.

### Headline formulas

| Slot | DE | AR |
|---|---|---|
| Home H1 | `Viele Anliegen. Ein Ansprechpartner.` — the client's own slogan, and better than the reference's invented "Viele Leistungen. Eine Anlaufstelle." because *Anliegen* is the customer's word, *Leistungen* is the vendor's | `خدمات متعددة... وجهة واحدة` |
| Section H2 | question form: `Wie können wir Ihnen helfen?` · `Warum Zukunft Service?` · `Was wir tun – und was nicht` | `كيف يمكننا مساعدتك؟` · `لماذا Zukunft Service؟` · `ماذا نقدّم وماذا لا نقدّم` |
| Service page H1 | `{Domain}` plain, e.g. `Studium, Universität & Visa` — do **not** append a benefit clause; the intro paragraph carries it | `{Domain}` plain |
| Eyebrow | `Leistung 0X` (uppercase, `.16em` tracking, gold) | `الخدمة 0X` — **tracking reset to 0**, Arabic letterforms connect and tracking breaks them |
| Meta title | `{Card title} in Dortmund – {benefit} \| Zukunft Service` ≤ 60 chars | `{Card title} في ألمانيا – {benefit} \| Zukunft Service` |
| Meta description | 140–155 chars, must contain a hedge verb and the city | same, plus "بالعربية والألمانية" |

### CTA microcopy (`ui.de.ts` / `ui.ar.ts`)

| Key | DE | AR |
|---|---|---|
| `cta.primary` | Anliegen schildern | اشرح لنا موضوعك |
| `cta.secondary` | Leistungen ansehen | تعرّف على خدماتنا |
| `cta.serviceDetail` | Mehr zu dieser Leistung → | تفاصيل هذه الخدمة ← |
| `cta.whatsapp` | Per WhatsApp schreiben | راسلنا على واتساب |
| `cta.call` | Anrufen | اتصل بنا |
| `form.submit` | Anfrage senden | إرسال الطلب |
| `form.submitting` | Wird gesendet … | جارٍ الإرسال … |
| `form.success` | Vielen Dank. Wir melden uns in der Regel innerhalb eines Werktages. | شكراً لك. سنتواصل معك عادةً خلال يوم عمل واحد. |
| `form.error` | Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns per WhatsApp. | تعذّر إرسال رسالتك. حاول مرة أخرى أو راسلنا على واتساب. |
| `form.consent` | Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden. Hinweise: Datenschutzerklärung. | أوافق على حفظ بياناتي لغرض معالجة طلبي. راجع سياسة الخصوصية. |
| `form.required` | Pflichtfeld | حقل مطلوب |
| `lang.switch` | العربية | Deutsch |

Note the arrow direction flips (`→` / `←`) — it is content, not decoration, so it lives in the microcopy file, not in CSS.

### Copy-fit budget (hand this to the design agent)

German compounds are long (`Personenstandsdokumente` = 23 chars, unbreakable); Arabic is ~20 % shorter in characters but needs **~1.7× line-height** and taller ascender/descender clearance.

| Field | DE max | AR max |
|---|---|---|
| `cardTitle` | 34 chars (2 lines @ 23px Georgia) | 30 chars |
| `cardDescription` | 95 chars | 85 chars |
| `eyebrow` | 28 chars | 24 chars |
| `WhyPoint.title` | 26 chars | 24 chars |
| `WhyPoint.body` | 110 chars | **220 chars** — the AR copy is genuinely richer; the card must not clip |
| list `item` | 78 chars | 70 chars |
| `seo.title` | 60 | 60 |

### Forbidden phrasings — legal-exposure checklist

Ship this as a comment block at the top of `services.de.ts` / `services.ar.ts` so future editors see it.

**German — never write:**

- `Rechtsberatung`, `wir beraten Sie rechtlich`, `rechtliche Beratung`, `Anwalt`, `anwaltlich` → **RDG** violation
- `Steuerberatung`, `steuerliche Beratung` → **StBerG**
- `Schuldnerberatung`, `Insolvenzberatung`, `Versicherungsberatung` → all three are **regulated terms**; use `organisatorische Vorbereitung` / `Kontaktaufnahme mit geeigneten Beratungsstellen`
- `wir erledigen Ihre Einbürgerung`, `wir besorgen Ihnen ein Visum`, `wir holen Ihre Papiere`, `wir versichern Sie`, `wir vermitteln Ihnen einen Kredit` (bare — §34c/§34d GewO territory)
- `beglaubigte Übersetzung` presented as our own service → only sworn translators may certify. Correct: `Übersetzung über geeignete, vereidigte Übersetzer`
- `garantiert`, `100 %`, `sicherer Erfolg`, `schnellste`, `beste`, `Nr. 1`, `amtlich anerkannt`, `offizieller Partner der Botschaft`, `zugelassen von` → **UWG §5** (irreführende Werbung)
- Any invented social proof: fake testimonials, `über 500 zufriedene Kunden`, star ratings, logo walls of "partners" who haven't agreed
- Any implied outcome for a third-party decision: authorities decide, we prepare

**Arabic — never write:**

- `استشارة قانونية` (legal consultation), `محامي` / `مستشار قانوني`, `استشارة ضريبية`
- `نضمن` / `مضمون` / `بنسبة 100%` (guaranteed)
- `نحصل لك على التأشيرة` / `نجيب لك الفيزا` — replace with `نحضّر أوراق طلب التأشيرة`
- `الأسرع` / `الأفضل في ألمانيا` / `الأول`
- `معتمد من السفارة` / `شريك رسمي` unless there is documentation
- `ترجمة محلّفة` presented as ours → `ترجمة عبر مترجمين محلّفين معتمدين`

**Positive framing that always works (use these as the substitution table):**

| Instead of | Write |
|---|---|
| we do X | wir unterstützen Sie bei X / نساعدك في X |
| we get you X | wir bereiten die Unterlagen für X vor / نحضّر الأوراق اللازمة لـ X |
| we advise you | wir strukturieren die nächsten Schritte / ننظّم لك الخطوات التالية |
| we handle your case | wir begleiten Sie / نرافقك |
| we're the experts in X | wir vermitteln an geeignete Fachstellen / نوجّهك إلى الجهة المختصة |

One standing `NoticeBlock` (tone `'legal'`) appears on the home page, the finance page, the real-estate page, and the contact form footer. Its DE text: *"Wir bieten organisatorische und sprachliche Unterstützung. Wir erbringen keine Rechts-, Steuer- oder Versicherungsberatung. Wo eine fachliche Beratung erforderlich ist, vermitteln wir an geeignete Fachstellen und Partner."*

---

## 7. What the client must still supply

**BLOCKING — the site cannot legally launch without these:**

| # | Item | Why | Note |
|---|---|---|---|
| 1 | **Impressum data**: exact legal name incl. legal form, legal address, managing director, phone, email, USt-IdNr, Handelsregister court + number (if registered), and any §34c/§34d GewO licence numbers **or written confirmation that none are held** | **§5 DDG** — mandatory, `Abmahnung` risk | The licence question also determines how strongly the finance/real-estate pages must hedge. Ask directly. |
| 2 | **Datenschutzerklärung** covering the contact form's data processing | DSGVO Art. 13 | **We do not author this.** We ship a structured placeholder page. Client generates via eRecht24 / Dr. Schwenke, or gets a lawyer. Ours must not be the legal text. |
| 3 | **Confirmed NAP**: address, phone, WhatsApp number, **destination email for the form**, opening hours | Powers footer, info strip, contact page, JSON-LD, Impressum | ⚠️ `ref.html` contains `Ruhrallee 55, 44139 Dortmund` / `+49 177 3825632` / `info@zukunftservice.de` / Mon–Wed 10–16, Thu 10–15, Fri 10–13. **That is another freelancer's draft, not our client's confirmation.** It ships only as `verified: false` placeholder and the release checklist blocks on flipping that flag. |
| 4 | **Arabic sign-off** on every string marked `status: 'draft-needs-client-approval'` — chiefly the post-arrival block and the three finance sub-block headings | AR is regulated marketing copy in the customers' own language | One review pass, ~30 min of the client's time. |

**HIGH — quality of the deliverable depends on these:**

| # | Item |
|---|---|
| 5 | **Logo files**: SVG (or ≥ 1000 px transparent PNG), plus confirmation whether an Arabic-locale logo variant exists |
| 6 | **Photography**: office exterior/interior, the owner or team, cleaning work in progress. Reference site leans hard on imagery. If none exists → we specify a stock shortlist and the client buys licences (not in the $700) |
| 7 | **`/leistungen/` hub intro** — ~150 words of unique overview copy, or we drop the hub and redirect (§1) |
| 8 | **Which channels are real**: is the WhatsApp number a business line the owner monitors? Should the FAB ship at all? |
| 9 | **Confirmation of the finance restructure** — that re-splitting the merged Arabic finance list into three named sub-blocks reflects their intent |

**MEDIUM — nice, cheap if supplied, dropped if not:**

| # | Item |
|---|---|
| 10 | 4–6 FAQ pairs per locale (the `FaqItem[]` slot is already in the model; it renders only if populated) |
| 11 | Real trust facts if any exist and are true: years in operation, languages spoken, number of partner offices. **No invented numbers.** |
| 12 | Named partner network (translators, insurance brokers, Dubai developers) **with their written permission** to be named |

---

## 8. Content-side scope & effort, against the $700

| Work | Hours |
|---|---|
| DE content data files — 6 services, 67 items, intros, closings, notices, SEO | 4 |
| AR content data files — same, plus RTL proofing and the gap registry | 4 |
| Microcopy (`ui.de.ts` / `ui.ar.ts`), nav, contact, why | 2 |
| Legal page skeletons (Impressum/Datenschutz with placeholders) + JSON-LD wiring | 1 |
| **Total content share** | **~11 h** |

**IN scope (content):** 2 locales · 26 routes · 67 service items · per-route SEO titles/descriptions/`hreflang` · JSON-LD from existing data · full form microcopy incl. all states · legal notice bands · Impressum/Datenschutz **structure**.

**OUT of scope / paid extra:** certified or professional human translation · legal review by a Rechtsanwalt (client must arrange — item 2 above) · FAQ authoring · blog or ongoing content · a third locale · photography and stock licences · the Datenschutzerklärung's legal text · Google Business Profile setup.

---

## 9. OPEN QUESTIONS (do not resolve without the client)

1. **Arabic grammatical gender** — masculine-singular default, or dual-form? (§6. My recommendation stated, but it's their call.)
2. **The post-arrival block in Arabic** — was its omission from the AR PDF deliberate, or an oversight? Everything about the audience says oversight, but I will not assume. (§4, `CONTENT_GAPS[0]`.)
3. **Do they hold a §34c (Immobiliardarlehensvermittlung / Immobilienmakler) or §34d (Versicherungsvermittlung) licence?** This materially changes how the finance and real-estate pages may be worded — with a licence they may say considerably more; without one, the hedging must stay maximal.
4. **Is the reference site's NAP theirs?** (§7 item 3.) Do not assume.
5. **`/leistungen/` hub — keep or redirect?** Depends entirely on whether they'll write 150 words.
6. **Third locale (EN/TR) ever?** The `Locale` union and always-prefix routing already accommodate it at ~zero structural cost; a third locale is purely a content/translation cost. Worth confirming so nobody later assumes it was designed out.
7. **Any analytics or embedded Google Map?** Either triggers a DSGVO/TTDSG cookie-consent obligation. A static map image linking out to Google Maps avoids the banner entirely and is what I'd recommend at this budget — but the client should choose knowingly.
8. **Prerendering mechanism** — tech lead's decision, but the IA's SEO argument depends on it. (§1.)