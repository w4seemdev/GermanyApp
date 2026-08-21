/**
 * ZUKUNFT SERVICE - the content model.
 *
 * Spec: docs/research/01-content-and-ia.md §3 · docs/research/03-frontend-architecture.md §5.1
 *
 * There is no i18n library. Content is typed TS data, which makes
 * `tsc --noEmit` the translation-completeness check: a missing Arabic key is a
 * build failure, not a `[missing key]` string in production.
 *
 * THE SPINE / BODY SPLIT is the central idea. The spine - service ids, slugs,
 * icons, ordering, every required key of `SiteContent` - is locale-invariant or
 * `Record<Locale, …>`, so TypeScript errors on any omission. The body -
 * `blocks[]`, `items[]` - may diverge freely between German and Arabic, because
 * the client's two source PDFs genuinely differ in structure, not just wording.
 */

import type { Direction, Locale } from '@/lib/locale';

export type { Direction, Locale };

/** Alias kept for the content-side vocabulary in the research reports. */
export type Dir = Direction;

/** A string that must exist in both locales. */
export type LocalizedString = Record<Locale, string>;

/**
 * Content that has not been signed off by the client must never ship.
 * Any Arabic we author for a gap in the client's PDFs describes regulated
 * activities and needs a named human to approve the wording.
 */
export type ContentStatus = 'final' | 'draft-needs-client-approval';

/* ════════════════════════════════════════════════════════════════════════════
   SERVICES - the six verticals
   ═══════════════════════════════════════════════════════════════════════════ */

export const SERVICE_IDS = [
  'authorities', // 01 Einbürgerung, Behörden & Dokumente
  'marriage-translation', // 02 Ehe, Übersetzungen & int. Dokumente
  'study-visa', // 03 Studium, Universität & Visa
  'finance', // 04 Finanzen, Kredite & Vorsorge
  'real-estate', // 05 Immobilien & Investitionen
  'cleaning', // 06 Reinigungsservice
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

/** The contact form's "Worum geht es?" select - the six services plus an
 *  escape hatch, because the brand promise is "you don't know where to start". */
export type ServiceCategory = ServiceId | 'other';

/** The business has two arms and says so itself. This drives the §2 split. */
export type ServiceArm = 'office' | 'cleaning';

/**
 * Selects which scope-boundary notice a service page renders.
 * `high` = the copy is load-bearing for RDG / § 34c / § 34d GewO exposure.
 */
export type LegalSensitivity = 'low' | 'medium' | 'high';

/** lucide-react export name, narrowed so a typo or an upstream rename fails
 *  the build instead of rendering an empty box. */
export type IconName =
  | 'Stamp'
  | 'Languages'
  | 'GraduationCap'
  | 'Landmark'
  | 'Building2'
  | 'SprayCan'
  | 'HandHeart'
  | 'Layers'
  | 'MessagesSquare'
  | 'Network'
  | 'Route'
  | 'Check'
  | 'Phone'
  | 'Mail'
  | 'Clock'
  | 'MapPin'
  | 'Sparkles'
  | 'FileText'
  | 'ShieldCheck'
  | 'Info';

export interface ImageRef {
  src: string;
  width: number;
  height: number;
  /** `alt` is per-locale, so it lives in the content, never here. */
  focal?: 'center' | 'top' | 'start' | 'end';
}

/**
 * Locale-invariant service spine. Because the slug lives here and not in the
 * per-locale content, it is structurally impossible for the German and Arabic
 * sites to have different URLs, icons or service ordering - which is what makes
 * the language switch guaranteed to land on the equivalent page.
 */
export interface ServiceMeta {
  id: ServiceId;
  order: 1 | 2 | 3 | 4 | 5 | 6;
  /** German slug, used in BOTH locales. Percent-encoded Arabic looks broken
   *  when pasted into WhatsApp, which is this audience's sharing channel. */
  slug: string;
  icon: IconName;
  arm: ServiceArm;
  legalSensitivity: LegalSensitivity;
}

/* ════════════════════════════════════════════════════════════════════════════
   SERVICE BLOCKS
   The six services have genuinely different internal shapes. Do NOT model
   "flat list service" and "sub-block service" as two types - the same service
   is flat in Arabic and sub-blocked in German, which would make one service two
   types in two languages. Instead every service is ServiceBlock[]: a flat list
   is one untitled list block, sub-blocks are several titled ones.
   ═══════════════════════════════════════════════════════════════════════════ */

interface BlockBase {
  /** Stable across locales wherever the block is shared. */
  id: string;
}

export interface ListBlock extends BlockBase {
  kind: 'list';
  /** Absent ⇒ flat list with no sub-heading. */
  title?: string;
  intro?: string;
  items: readonly string[];
  layout?: 'checks' | 'two-column' | 'plain';
}

/** Visually distinct callout. The "Auch nach der Ankunft…" block is this. */
export interface HighlightBlock extends BlockBase {
  kind: 'highlight';
  title: string;
  intro: string;
  items: readonly string[];
  closing?: string;
}

/** Prose with no list. "Übersetzungsservice" is this. */
export interface ProseBlock extends BlockBase {
  kind: 'prose';
  title?: string;
  body: string;
}

/** Scope / legal boundary. `tone` drives styling and is never invented per page. */
export interface NoticeBlock extends BlockBase {
  kind: 'notice';
  tone: 'legal' | 'info';
  title?: string;
  body: string;
}

export type ServiceBlock = ListBlock | HighlightBlock | ProseBlock | NoticeBlock;

/** Renderers switch exhaustively on this; `never` in the default branch means
 *  adding a kind later is a compile error until every renderer handles it. */
export type ServiceBlockKind = ServiceBlock['kind'];

/* ════════════════════════════════════════════════════════════════════════════
   PER-LOCALE SERVICE CONTENT
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Seo {
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface ServiceContent {
  id: ServiceId;
  /** "Leistung 03" · "الخدمة 03" */
  eyebrow: string;
  /** <h1>. Plain domain name - the intro paragraph carries the benefit. */
  title: string;
  cardTitle: string;
  cardDescription: string;
  imageAlt: string;
  intro: string;
  /** Length may differ per locale: DE finance has 3 blocks, AR has 1. */
  blocks: readonly ServiceBlock[];
  closing?: string;
  /** Hedging text. Mandatory in practice wherever legalSensitivity is 'high'. */
  legalNote?: string;
  seo: Seo;
  faq?: readonly FaqItem[];
  status: ContentStatus;
}

/** Record<> forces all six services to exist in BOTH locales. */
export type ServiceContentMap = Record<Locale, Record<ServiceId, ServiceContent>>;

/* ════════════════════════════════════════════════════════════════════════════
   WHY POINTS
   ═══════════════════════════════════════════════════════════════════════════ */

export const WHY_IDS = [
  'personal',
  'one-hand',
  'multilingual',
  'network',
  'tailored',
] as const;

export type WhyId = (typeof WHY_IDS)[number];

export interface WhyPoint {
  id: WhyId;
  icon: IconName;
  title: string;
  /** Arabic bodies run roughly 2× the German. The design must absorb it. */
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════ */

export type RouteId =
  | 'home'
  | 'services'
  | 'service'
  | 'contact'
  | 'imprint'
  | 'privacy'
  | 'notFound';

export type NavTarget =
  | { kind: 'route'; routeId: Exclude<RouteId, 'service' | 'notFound'> }
  | { kind: 'service'; serviceId: ServiceId }
  /** Always on the home page, e.g. '#ueber-uns'. */
  | { kind: 'anchor'; hash: string }
  | { kind: 'external'; href: string };

export interface NavItem {
  id: string;
  label: string;
  target: NavTarget;
}

export interface NavContent {
  primary: readonly NavItem[];
  footer: readonly NavItem[];
  /** Impressum · Datenschutz. The Impressum label stays the German word in
   *  both locales - case law has rejected "Kontakt", "Legal" and "Info". */
  legal: readonly NavItem[];
}

/* ════════════════════════════════════════════════════════════════════════════
   NAP - name, address, phone. Locale-invariant.
   One shape serves the footer, the info strip, the contact page, the
   LocalBusiness JSON-LD and the Impressum shell.
   ═══════════════════════════════════════════════════════════════════════════ */

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

/** Index 0 = Monday, matching `DAY_KEYS` and `formatWeekday`. */
export type DayKey = (typeof DAY_KEYS)[number];

export interface OpeningHour {
  day: DayKey;
  /** 'HH:MM' in 24-hour Latin digits, or null when closed. */
  open: string | null;
  close: string | null;
}

/** Every confirmed field is flagged. The release checklist blocks on a false. */
export interface NapVerification {
  address: boolean;
  phone: boolean;
  email: boolean;
  hours: boolean;
}

export interface NapData {
  /** Impressum-exact, including legal form. Carries a «…» sentinel until the
   *  client confirms it; the sentinel fails a production build. */
  legalName: string;
  /** Never translated, never transliterated - Latin in Arabic copy too. */
  tradeName: 'Zukunft Service';
  legalForm: string;
  managingDirector: string;

  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: 'DE';

  /** '+491773825632' - for tel: hrefs and JSON-LD. */
  phoneE164: `+${string}`;
  /** '+49 177 3825632' - for display. ALWAYS inside <bdi dir="ltr">. */
  phoneDisplay: string;
  /** '491773825632' - digits only, for wa.me. */
  phoneDigits: string;
  whatsappE164: `+${string}`;
  email: string;
  /** Link out only. An embedded Maps iframe transmits the visitor's IP to
   *  Google on load, which would require a consent banner. */
  mapsUrl: string;

  hours: readonly OpeningHour[];

  vatId: string | null;
  registerCourt: string | null;
  registerNumber: string | null;

  availableLanguages: readonly Locale[];
  verified: NapVerification;
}

/* ════════════════════════════════════════════════════════════════════════════
   SITE CONTENT - everything on the home page and in the chrome, per locale
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Cta {
  label: string;
  /** "Unverbindlich und kostenlos anfragen" - microcopy under the CTA, never
   *  relegated to a footnote. */
  hint?: string;
}

export interface SectionHeading {
  eyebrow: string;
  title: string;
  lead?: string;
}

export interface TrustItem {
  id: string;
  icon: IconName;
  label: string;
}

export interface MetaContent {
  siteName: string;
  slogan: string;
  homeTitle: string;
  homeDescription: string;
  /** This locale's own name in its own script: 'Deutsch' / 'العربية'. */
  localeLabel: string;
  /** The OTHER locale's name in ITS own script. A user who reads only Arabic
   *  must be able to find their language. Never "Arabisch", never a flag. */
  switchLabel: string;
  /** Bilingual, e.g. "Zur arabischen Version wechseln – التبديل إلى النسخة العربية". */
  switchAriaLabel: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  lead: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  /** Includes "نتحدث العربية" in Arabic script even on the German page. */
  trust: readonly TrustItem[];
  imageAlt: string;
}

/** The two arms of the business: Büroservice / Reinigungsservice. */
export interface PillarContent {
  id: ServiceArm;
  /** '01' / '02' - rendered as a numeral, never mirrored. */
  index: string;
  icon: IconName;
  title: string;
  body: string;
  linkLabel: string;
}

export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  body: string;
}

/** The 3-step strip. A process description makes no outcome promise, which
 *  makes it both the best anxiety-reducer and the legally safest section. */
export interface ProcessContent {
  heading: SectionHeading;
  steps: readonly ProcessStep[];
}

export interface ServicesGridContent {
  heading: SectionHeading;
  /** "Mehr zu dieser Leistung →" - the arrow flips per locale, so it is
   *  content, not decoration, and lives here rather than in CSS. */
  detailLabel: string;
  note?: string;
}

export interface CleaningContent {
  heading: SectionHeading;
  items: readonly string[];
  cta: Cta;
  imageAlt: string;
}

export interface WhySectionContent {
  heading: SectionHeading;
  points: readonly WhyPoint[];
}

/** "Was wir tun – und was nicht." The legal shield and a trust signal at once. */
export interface ScopeContent {
  heading: SectionHeading;
  doTitle: string;
  doItems: readonly string[];
  dontTitle: string;
  dontItems: readonly string[];
  /** "Wir bieten keine Rechts-, Steuer- oder Versicherungsberatung…" */
  notice: string;
}

export interface QuickContactStrings {
  whatsapp: string;
  call: string;
  email: string;
}

export interface ContactContent {
  heading: SectionHeading;
  quickContact: QuickContactStrings;
  /** "Außerhalb der Öffnungszeiten: schreiben Sie uns - wir melden uns am
   *  nächsten Werktag." Turns a closed office into a captured lead. */
  responseNote: string;
}

export interface InfoStripContent {
  hoursTitle: string;
  addressTitle: string;
  contactTitle: string;
  mapsLabel: string;
  closedLabel: string;
  hoursNote: string;
}

export interface FooterContent {
  slogan: string;
  navTitle: string;
  legalTitle: string;
  /** Contains the literal token `{year}`, replaced at render time. */
  copyright: string;
}

/* ── Contact form strings ─────────────────────────────────────────────────── */

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldStrings {
  label: string;
  /** Decoration only. A placeholder is NEVER the label. */
  placeholder?: string;
  hint?: string;
}

export interface SelectFieldStrings extends FieldStrings {
  options: readonly SelectOption[];
}

export interface FormValidationStrings {
  required: string;
  nameTooShort: string;
  emailInvalid: string;
  messageTooShort: string;
  messageTooLong: string;
  phoneInvalid: string;
  phoneRequiredForWhatsapp: string;
}

export interface ContactFormStrings {
  title: string;
  lead: string;
  /** Field 1, deliberately not "Name" - asking a user worried about their
   *  residency status to identify themselves first is the highest-friction
   *  possible opening. Includes a 7th "Sonstiges / not sure" option. */
  service: SelectFieldStrings;
  message: FieldStrings;
  name: FieldStrings;
  email: FieldStrings;
  phone: FieldStrings;
  whatsappOptIn: FieldStrings;
  /** Vormittags (10–13 Uhr) / Nachmittags (13–16 Uhr) / Egal. Never an
   *  evening slot the business cannot honour. */
  preferredTime: SelectFieldStrings;
  /** Visually hidden honeypot. Its label still exists for screen readers. */
  honeypot: FieldStrings;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
  errorSummaryTitle: string;
  requiredLabel: string;
  optionalLabel: string;
  /** Always-visible notice beside submit. Art. 6(1)(b)/(f), not consent. */
  privacyNotice: string;
  privacyLinkLabel: string;
  hedgeNotice: string;
  validation: FormValidationStrings;
}

export interface A11yStrings {
  skipToContent: string;
  openMenu: string;
  closeMenu: string;
  menuLabel: string;
  languageGroupLabel: string;
  breadcrumbLabel: string;
  whatsappFab: string;
  currentPage: string;
  loading: string;
  externalLinkHint: string;
}

/**
 * Everything the chrome and the home page need, in one locale.
 * Every key is required: this is the spine, and `satisfies SiteContent` on the
 * Arabic module turns a missing translation into a compile error.
 */
export interface SiteContent {
  meta: MetaContent;
  nav: NavContent;
  hero: HeroContent;
  pillars: readonly PillarContent[];
  process: ProcessContent;
  services: ServicesGridContent;
  why: WhySectionContent;
  cleaning: CleaningContent;
  scope: ScopeContent;
  contact: ContactContent;
  info: InfoStripContent;
  footer: FooterContent;
  form: ContactFormStrings;
  a11y: A11yStrings;
}

export type SiteContentMap = Record<Locale, SiteContent>;
