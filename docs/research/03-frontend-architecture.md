# FRONTEND ARCHITECTURE PLAN — Zukunft Service (UI-only, $700)

**Author role:** frontend architect · **Phase:** planning · **Target dir:** `c:\Users\Dell\Desktop\Ui`

---

## 1. Framework decision

### Honest comparison

| Criterion | Vite + React SPA | **Next.js 16 App Router** | Astro 5 + React islands |
|---|---|---|---|
| **Static HTML per URL** | ✗ One empty `<div id="root">`. Google renders JS, but **WhatsApp, Facebook, Telegram, LinkedIn, Signal link-preview scrapers do not**. This audience shares links in WhatsApp constantly — a link with no preview is a conversion loss. | ✓ 20 prerendered HTML files at build | ✓ Best-in-class |
| **hreflang / bilingual routing** | Manual `<link>` injection via `react-helmet-async` after hydration. Crawlers that read raw HTML see nothing. Error-prone. | ✓ `generateMetadata` → `alternates.languages` emits correct `<link rel="alternate" hreflang>` into static HTML in ~8 lines | ✓ Built-in i18n routing + `getRelativeLocaleUrl` |
| **`<html lang dir>` without FOUC** | ✗ Must be set by JS on mount → **visible LTR→RTL layout flash on every Arabic page load**. This is the reference site's actual bug (`.rtl` class toggle). | ✓ Rendered server-side in `[locale]/layout.tsx`. Zero flash. | ✓ Same |
| **Backend handoff** | Seam = a documented `fetch()` in `src/lib/`. Backend dev builds his endpoint anywhere. Simple. | Seam = `app/api/contact/route.ts`, one stub file, or the same env-var-pointed `fetch()`. **Both options available.** | Seam = an Astro endpoint (`.ts` in `pages/api`). Fine, but fewer devs know it. |
| **Handoff dev familiarity** | High | **Highest** | Low — he inherits `.astro` files, not React |
| **Hosting cost** | $0 anywhere | $0 on Vercel Hobby / Cloudflare Pages / Netlify | $0 anywhere |
| **Font + image pipeline** | Manual (`sharp` script, hand-written `@font-face`, manual Arabic subsetting) — ~4–6 hrs of the budget | `next/font` + `next/image` free, incl. Arabic subsetting and self-hosting | Good (`astro:assets`), fonts still manual-ish |
| **JS shipped** | ~150 KB gz (everything is client) | ~125 KB gz (only 4 client components) | ~60 KB gz (React only for the form island) |
| **Risk at $700** | Low build risk, **high SEO/product risk** | Medium build risk (RSC boundary discipline), low product risk | Low build risk, **medium handoff risk** |

### DECISION: **Next.js 16, App Router, fully static (every route prerendered).**

Reasoning, ranked:

1. **The whole point of this site is being found and shared.** German local SEO + WhatsApp link previews are the deliverable's actual value. A Vite SPA cannot produce them without bolting on `vite-react-ssg`, at which point you have rebuilt a worse Next.js.
2. **`<html lang dir>` correctness is free and server-rendered.** This single fact eliminates the hardest RTL bug class before it exists. In a SPA it costs real hours and still flashes.
3. **`next/font` self-hosts Google Fonts.** In Germany this is not a nicety: *LG München I, 3 O 17493/20 (Jan 2022)* held that hotlinking `fonts.gstatic.com` transmits the visitor IP to Google without consent and violates the DSGVO. `next/font` inlines the files into your own origin — the exposure disappears for free. Doing this by hand in Vite (download → subset → `@font-face` → preload) is ~3 hrs of a $700 budget.
4. **`next/font` also handles Arabic subsetting**, which is the single heaviest asset on this project (~80 KB).
5. The handoff dev is overwhelmingly likely to know Next.js.

**Astro is the honest runner-up** and I want that on record. It would ship less JS and is arguably the *better* tool for a pure brochure. I reject it only because (a) the brief hard-requires "React + TypeScript + Tailwind" as the artifact handed over, and Astro means the majority of files are `.astro`, and (b) the React form island drags `react` + `react-dom` back in anyway, shrinking the real saving to ~60 KB — not worth a handoff-familiarity risk at this budget. **Revisit Astro only if** the client confirms the backend dev is comfortable with it *and* no app-like features are ever coming.

**Vite SPA is rejected outright.** The link-preview and hreflang failures are product failures, not technical preferences.

### Exact scaffold command

```powershell
cd C:\Users\Dell\Desktop\Ui
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Answer the interactive prompts: **Turbopack → Yes** (default in 16), **customize import alias → already passed**. This produces Next 16 + React 19 + Tailwind v4 + TS 5.9 + ESLint 9 flat config.

### Deployment posture (host-agnostic by design)

- Default target: **Vercel** (`vercel --prod`, $0 Hobby). Note for the client: Vercel's Hobby tier is non-commercial; a business site should sit on **Vercel Pro ($20/mo)** or move to **Cloudflare Pages / Netlify** (commercial use permitted free).
- Everything except `middleware.ts` is static. If the backend dev wants a pure static host, flipping `output: 'export'` in `next.config.ts` works — the only losses are `app/api/contact/route.ts` (he points `NEXT_PUBLIC_CONTACT_ENDPOINT` at his own service instead) and the `/` redirect (replaced by a host redirect rule). **Document both paths in `HANDOFF.md`.**

**OPEN QUESTION — client must decide:** who owns the hosting account and the domain, and does the $700 include deployment? The architecture works on any of the three hosts; the *account* is a business decision.

---

## 2. Dependency list

Versions are the 2026 majors that matter; pin exact patches at scaffold time with `npm view <pkg> version`.

### Runtime dependencies (9 total)

| Package | Version | Purpose | Why it beats the alternative |
|---|---|---|---|
| `next` | `^16.2` | Framework | See §1 |
| `react` / `react-dom` | `^19.2` | — | Bundled with Next |
| `react-hook-form` | `^7.66` | Contact form state, validation wiring, touched/dirty/error tracking, focus-first-error | ~9 KB gz. Uncontrolled inputs → no re-render per keystroke. Beats **Formik** (2× size, effectively unmaintained, controlled = janky on low-end Android). Beats **hand-rolled `useState`** — by the time you've written touched-state, error announcement, and `setFocus()` on the first invalid field, you've spent 4 hrs and written buggier code than 9 KB of library. |
| `zod` | `^4.1` | Form schema + **the UI↔API contract** | This is the highest-leverage dependency in the project. One file, `contact-schema.ts`, is imported by the React form *and* by the backend dev's handler. He gets runtime validation and TS types for free and cannot drift from the frontend. Beats **yup** (weaker inference), **valibot** (smaller but the backend dev won't know it). Use standard `zod`, **not `zod/mini`** — the handoff clarity is worth the 4 KB. |
| `@hookform/resolvers` | `^5.2` | Glue: zod → RHF | ~1 KB. No alternative worth discussing. |
| `clsx` | `^2.1.1` | Conditional classNames | 239 bytes. |
| `lucide-react` | `^0.5xx` | ~20 icons (document, broom, shield, phone, mail, clock, map-pin, arrow, chevron, check, menu, x, globe) | Per-icon named imports, tree-shaken automatically by Next's `optimizePackageImports` → ~0.5 KB each. Beats **react-icons** (barrel imports, historically poor tree-shaking). Beats hand-authored SVGs (~2 hrs of budget for zero gain). Ships `ArrowRight`/`ArrowLeft` and `ChevronRight`/`ChevronLeft` as separate components, which is exactly what clean RTL mirroring needs. |

**Total added runtime weight: ≈ 25 KB gzipped.** That is the entire third-party client cost of the site.

### Dev dependencies (10)

| Package | Version | Purpose |
|---|---|---|
| `typescript` | `^5.9` | — |
| `@types/react`, `@types/react-dom`, `@types/node` | latest | — |
| `tailwindcss` + `@tailwindcss/postcss` | `^4.2` | Matches the reference site's own Tailwind version |
| `eslint` | `^9.x` | flat config |
| `eslint-config-next` | `^16.2` | core-web-vitals + TS rules |
| `eslint-plugin-jsx-a11y` | `^6.10` | Full `recommended` set. Next ships only a subset; a11y is one of our stated upgrades over the reference. |
| `eslint-config-prettier` | `^10.x` | Last in the config array; kills stylistic conflicts |
| `prettier` | `^3.6` | — |
| `prettier-plugin-tailwindcss` | `^0.6` | Canonical class ordering. Prevents diff churn and makes RTL-audit greps reliable. |
| `vitest` | `^3.2` | Node-env only, 3 test files (see §8) |
| `@next/bundle-analyzer` | `^16.2` | Run once before handoff to verify the budget in §7 |

### EXPLICITLY REJECTED

| Rejected | Why |
|---|---|
| **`framer-motion` / `motion`** | ~34 KB gz to do what `@keyframes` + a 25-line `useInView` hook does here. We have reveal-on-scroll and hover lifts — that is it. Also: CSS respects `prefers-reduced-motion` with one media query; JS animation needs explicit guarding. **Saves ~34 KB and reduces a11y risk.** |
| **`gsap`, `lenis`, `aos`, `react-spring`** | Same reason. `lenis` additionally hijacks native scrolling, which breaks keyboard/AT scroll and RTL scroll direction. We already have `scroll-behavior: smooth`. |
| **`next-intl` / `react-i18next` / `i18next` / `paraglide` / `lingui`** | See §5. Two locales, ~300 strings, **and the brief explicitly states the Arabic content is not a 1:1 translation.** Message-catalog libraries assume key symmetry; ours is asymmetric by design. A typed TS content module gives compile-time parity enforcement that no JSON-catalog library can. `next-intl` alone is ~15 KB + middleware + config for routing we can write in 25 lines. |
| **`@radix-ui/*` / `shadcn/ui` / `headlessui`** | Our only overlay is the mobile nav sheet. The native `<dialog>` element (`showModal()`) gives focus trap, ESC-to-close, background `inert`, focus-return-to-invoker, and `::backdrop` — **for 0 KB**, with full 2026 browser support. Radix Dialog is ~12 KB for the same thing. |
| **`tailwind-merge` / `cva`** | ~7 KB. Our primitives use plain `Record<Variant, string>` lookup maps and do **not** accept colour-overriding `className`. Discipline replaces the library. |
| **`zustand` / `jotai` / `redux`** | See §6. There is no cross-cutting client state. |
| **`@tanstack/react-query`** | There is no server data to cache. One `POST`, fire-and-forget. |
| **`embla-carousel` / `swiper`** | The service-page gallery uses CSS `scroll-snap-type: x mandatory` + `overflow-x: auto`. 0 KB, keyboard-scrollable, and **RTL-correct with no configuration** (a carousel library needs an explicit `direction: 'rtl'` option and JS `scrollLeft` maths that is negative-signed in RTL — a classic bug source). |
| **`react-helmet-async`** | Next's Metadata API replaces it. |
| **`next-sitemap`** | Next 16 has native `app/sitemap.ts` and `app/robots.ts`. |
| **`plaiceholder` / blur placeholders** | We use a `#edf2ed` solid background behind every image frame (the reference's own placeholder colour). Identical perceived effect, zero build step. |
| **`react-google-recaptcha` / `hcaptcha`** | DSGVO exposure (Google), UX cost, and it's the *backend's* problem. We ship a honeypot field + a submit-timestamp; anything stronger (Cloudflare Turnstile) is a documented backend option. |
| **`husky` / `lint-staged`** | Solo freelancer, one branch. One `npm run verify` before handoff is sufficient. |
| **`@testing-library/react` / `jsdom` / `playwright`** | See §8. |

---

## 3. Folder / file structure

```
C:\Users\Dell\Desktop\Ui\
├── public/
│   ├── logo/
│   │   ├── zukunft-service.svg            # full lockup, used in <Logo variant="full">
│   │   └── zukunft-service-mark.svg       # mark only, for favicon / mobile header
│   ├── images/
│   │   ├── hero.jpg                       # 2400×1600 master; next/image derives the rest
│   │   ├── pillar-bueroservice.jpg
│   │   ├── pillar-reinigung.jpg
│   │   └── services/<serviceId>/{hero,g1,g2}.jpg
│   ├── og/{og-de.jpg,og-ar.jpg}           # 1200×630 social cards, one per locale
│   └── documents/                         # (empty; reserved for client PDFs)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # PASSTHROUGH root layout: `return children`. Owns nothing.
│   │   ├── globals.css                    # @import "tailwindcss" + @theme tokens + base layer + @utility
│   │   ├── icon.svg                       # favicon (Next auto-wires)
│   │   ├── apple-icon.png                 # 180×180
│   │   ├── sitemap.ts                     # all 20 URLs + hreflang alternates
│   │   ├── robots.ts                      # allow all + sitemap pointer
│   │   ├── api/
│   │   │   └── contact/route.ts           # ★ THE SEAM. Validates w/ zod, returns 501 + TODO block.
│   │   └── [locale]/
│   │       ├── layout.tsx                 # ★ Renders <html lang dir>, fonts, header, footer, JSON-LD
│   │       ├── page.tsx                   # Home — composes all sections
│   │       ├── not-found.tsx              # localized 404
│   │       ├── leistungen/
│   │       │   └── [slug]/page.tsx        # 6 static service pages ×2 locales (SEO + shareable)
│   │       ├── kontakt/page.tsx           # dedicated contact page (local-SEO landing)
│   │       ├── impressum/page.tsx         # legally mandatory, §5 DDG
│   │       └── datenschutz/page.tsx       # legally mandatory, DSGVO Art. 13
│   │
│   ├── middleware.ts                      # ONLY matches "/" → 307 to /de or /ar. Nothing else.
│   │
│   ├── components/
│   │   ├── ui/                            # locale-agnostic, content-agnostic primitives
│   │   │   ├── Container.tsx              # max-width + responsive inline padding
│   │   │   ├── Section.tsx                # vertical rhythm + background tone + id anchor
│   │   │   ├── SplitSection.tsx           # ★ the "split app concept" primitive (see §9)
│   │   │   ├── SectionHeading.tsx         # eyebrow + h2 + lead, align start|center
│   │   │   ├── Eyebrow.tsx                # 12px/900/.16em uppercase gold-ink label
│   │   │   ├── Button.tsx                 # renders <button> or next/link <a>; 4 variants
│   │   │   ├── Card.tsx                   # bordered/elevated surface, optional hover lift
│   │   │   ├── CheckList.tsx              # the ubiquitous service bullet list; 3 layouts
│   │   │   ├── MediaFrame.tsx             # aspect-locked next/image + RTL-aware edge fade
│   │   │   ├── Reveal.tsx                 # IntersectionObserver fade/rise, reduced-motion safe
│   │   │   ├── DirectionalIcon.tsx        # ★ swaps arrow/chevron by dir; never flips logos
│   │   │   ├── NoticeCallout.tsx          # ★ the legal-hedging disclaimer block
│   │   │   ├── Modal.tsx                  # native <dialog> wrapper (mobile nav only)
│   │   │   └── Logo.tsx                   # inline SVG, currentColor-aware, 2 variants
│   │   │
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx             # sticky, blurred, scroll-spy, scroll-shrink [client]
│   │   │   ├── MobileNav.tsx              # <dialog> sheet — FIXES the reference's missing mobile nav [client]
│   │   │   ├── LocaleSwitch.tsx           # <Link>, sets NEXT_LOCALE cookie on click [client]
│   │   │   ├── SiteFooter.tsx             # logo, nav, Impressum/Datenschutz, slogan, ©
│   │   │   ├── SkipLink.tsx               # "Zum Inhalt springen" / "تخطَّ إلى المحتوى"
│   │   │   ├── WhatsAppFab.tsx            # fixed bottom inline-end (auto-mirrors)
│   │   │   ├── LocaleProvider.tsx         # context carrying ONLY {locale, dir} [client]
│   │   │   └── JsonLd.tsx                 # <script type="application/ld+json">
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.tsx                   # SplitSection: copy + MediaFrame + trust list
│   │   │   ├── PillarSplit.tsx            # the 2 big cards: Büroservice / Reinigungsservice
│   │   │   ├── PillarCard.tsx             # one pillar (image + copy + link)
│   │   │   ├── ServiceGrid.tsx            # 6 ServiceCards, 3-col → 2 → 1
│   │   │   ├── ServiceCard.tsx            # links to /leistungen/[slug] — no modal, real page
│   │   │   ├── ServiceDetail.tsx          # the service page body: intro + blocks + gallery + CTA
│   │   │   ├── CleaningPanel.tsx          # green panel, 2-col checklist
│   │   │   ├── WhyUs.tsx                  # 4 cards, gold top rule
│   │   │   ├── ProcessSteps.tsx           # 3–4 step "how it works" (new; not in reference)
│   │   │   ├── ContactSection.tsx         # deep-green split: copy + ContactForm
│   │   │   ├── InfoStrip.tsx              # NAP: hours, address, phone, email, maps link
│   │   │   └── FinalCta.tsx               # the closing "Sie haben ein Anliegen…" band
│   │   │
│   │   └── forms/
│   │       ├── ContactForm.tsx            # ★ RHF + zod; all 4 states [client]
│   │       ├── FormField.tsx              # label + control slot + error + aria wiring
│   │       ├── TextInput.tsx
│   │       ├── TextArea.tsx
│   │       ├── SelectInput.tsx            # native <select>; service type + preferred time
│   │       ├── ConsentCheckbox.tsx        # DSGVO consent + link to /datenschutz
│   │       ├── HoneypotField.tsx          # visually hidden, aria-hidden, tabIndex -1
│   │       └── FormStatus.tsx             # role="status" success / role="alert" error
│   │
│   ├── content/
│   │   ├── index.ts                       # getContent(locale) + getService(locale, id)
│   │   ├── de/
│   │   │   ├── site.ts                    # nav, hero, why, contact, info, footer, a11y, form strings
│   │   │   ├── services.ts                # the 6 ServiceContent objects (German)
│   │   │   └── legal.ts                   # Impressum + Datenschutz page bodies
│   │   ├── ar/
│   │   │   ├── site.ts                    # Arabic — structurally allowed to differ
│   │   │   ├── services.ts                # e.g. §4 as ONE block where DE has THREE
│   │   │   └── legal.ts
│   │   └── shared/
│   │       ├── services.meta.ts           # ★ locale-INVARIANT: id, slug, icon, images, order
│   │       ├── nap.ts                     # ★ phone/email/address/hours/geo — single source of truth
│   │       └── nav.ts                     # nav item ids + hrefs (labels come from locale content)
│   │
│   ├── hooks/
│   │   ├── useInView.ts                   # IntersectionObserver, once-only, rootMargin option
│   │   ├── useScrollSpy.ts                # active section id for header nav
│   │   ├── useLockBodyScroll.ts           # scrollbar-gutter-safe body lock for the nav sheet
│   │   └── useMediaQuery.ts               # SSR-safe matchMedia (used for reduced-motion)
│   │
│   ├── lib/
│   │   ├── contact-schema.ts              # ★★ THE CONTRACT: zod schema + request/response types
│   │   ├── submit-contact.ts              # ★★ the single fetch(); reads NEXT_PUBLIC_CONTACT_ENDPOINT
│   │   ├── locale.ts                      # LOCALES, isLocale(), dirFor(), swapLocalePath()
│   │   ├── routes.ts                      # typed URL builders: home(), service(), kontakt()…
│   │   ├── format.ts                      # ★ phone/hours/date formatters with bidi isolation
│   │   ├── seo.ts                         # buildMetadata(locale, page) → Next Metadata + hreflang
│   │   ├── schema-org.ts                  # LocalBusiness / Service / BreadcrumbList JSON-LD
│   │   └── cn.ts                          # clsx re-export
│   │
│   ├── types/
│   │   ├── locale.ts                      # Locale, Direction
│   │   └── content.ts                     # SiteContent, ServiceContent, ServiceMeta, MediaRef…
│   │
│   └── styles/
│       └── fonts.ts                       # next/font declarations, exported as CSS variables
│
├── scripts/
│   └── check-logical-props.mjs            # ★ fails the build on pl-/pr-/ml-/mr-/text-left/left-N
├── HANDOFF.md                             # ★ backend-dev contract: endpoint, payload, states, env
├── next.config.ts
├── eslint.config.mjs
├── .prettierrc
├── vitest.config.ts
├── .env.example                           # NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_CONTACT_ENDPOINT, NEXT_PUBLIC_WHATSAPP
└── tsconfig.json
```

**Note on the passthrough root layout:** `app/layout.tsx` returns `children` with no `<html>`; `app/[locale]/layout.tsx` renders `<html lang dir>`. This is the standard App Router locale pattern (it is what `next-intl` itself documents) and is required so `dir` can be locale-dependent and still server-rendered. The consequence is that **`/` cannot be a page** — it is handled by `middleware.ts`.

---

## 4. Component inventory

Legend: **P** = presentational (Server Component, zero JS) · **S** = stateful (`'use client'`)

### 4.1 UI primitives — `src/components/ui/`

```ts
// Container.tsx — P
interface ContainerProps {
  children: React.ReactNode;
  size?: 'narrow' | 'default' | 'wide' | 'full'; // 760 | 1240 | 1440 | none
  className?: string;
}

// Section.tsx — P
interface SectionProps {
  id?: string;                                   // anchor target for nav + scroll spy
  tone?: 'page' | 'cream' | 'mist' | 'mint' | 'deep' | 'white';
  //      #fffdf9 | #f7f0e5 | #f5f7f3 | #e8f0e9 | #043b32 | #ffffff
  spacing?: 'default' | 'tight' | 'none';        // 110px clamp | 72px | 0
  as?: 'section' | 'div' | 'footer';
  children: React.ReactNode;
  className?: string;
}

// SplitSection.tsx — P   ★ the signature primitive
interface SplitSectionProps {
  ratio?: '1:1' | '1.03:0.97' | '0.9:1.1' | '0.8:1.2' | '0.82:1.18';
  gap?: 'none' | 'sm' | 'md' | 'lg';             // 0 | 24 | 50 | 80 px
  /** Which slot renders first in the DOM (and therefore first in the a11y/reading order). */
  leadWith?: 'content' | 'media';
  /** Below 980px, which slot appears on top. Defaults to 'media' (matches reference). */
  stackOrder?: 'content' | 'media';
  align?: 'start' | 'center' | 'stretch';
  media: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}
// RTL note: CSS Grid column order follows `dir` automatically — the split mirrors with zero extra code.

// SectionHeading.tsx — P
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'start' | 'center';                    // NEVER 'left'/'right'
  level?: 1 | 2 | 3;                             // renders h1/h2/h3
  tone?: 'dark' | 'light';                       // light = on deep-green
  id?: string;                                   // for aria-labelledby on the parent section
}

// Eyebrow.tsx — P
interface EyebrowProps { children: React.ReactNode; tone?: 'gold' | 'sage' | 'light'; as?: 'span' | 'p'; }

// Button.tsx — P (renders <button> OR next/link <a>)
type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'whatsapp';
interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  fullWidth?: boolean;                            // true at <640px per reference
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;                      // logical: renders after text in LTR, before in RTL
  children: React.ReactNode;
  className?: string;
}
type ButtonProps =
  | (ButtonBaseProps & { href: string; external?: boolean; type?: never })
  | (ButtonBaseProps & { href?: never; type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean; loading?: boolean });

// Card.tsx — P
interface CardProps {
  as?: 'article' | 'div' | 'li';
  surface?: 'white' | 'cream' | 'translucent' | 'mint' | 'deep';
  radius?: 'sm' | 'md' | 'lg' | 'xl';             // 14 | 18 | 20 | 22 px
  border?: 'none' | 'hairline' | 'gold-top';      // gold-top = the "Warum" 3px rule
  interactive?: boolean;                          // adds hover lift + focus-visible ring
  padding?: 'sm' | 'md' | 'lg';                   // 28 | 32 | 42 px
  children: React.ReactNode;
  className?: string;
}

// CheckList.tsx — P   (used ~14 times across the site — the highest-reuse component)
interface CheckListProps {
  items: readonly string[];
  columns?: 1 | 2;
  layout?: 'stacked' | 'inline';                  // inline = the hero trust row
  tone?: 'dark' | 'light';                        // light = inside the green panel
  divider?: boolean;                              // 1px #ffffff33 between rows (green panel)
  marker?: 'check' | 'dot' | 'none';
}

// MediaFrame.tsx — P
interface MediaFrameProps {
  src: string;
  alt: string;                                    // localized, from content
  width: number;
  height: number;
  priority?: boolean;                             // true ONLY for the hero image
  fit?: 'cover' | 'contain';
  /** RTL-aware gradient fade into the adjacent background. */
  edgeFade?: 'none' | 'cream' | 'mint';
  ratio?: '4/3' | '3/2' | '1/1' | 'fill';
  sizes?: string;
  caption?: string;
  className?: string;
}

// Reveal.tsx — S (tiny: IntersectionObserver only)
interface RevealProps {
  children: React.ReactNode;
  animation?: 'fade' | 'rise' | 'none';
  delay?: 0 | 80 | 160 | 240;                     // ms — staggering grids
  as?: 'div' | 'li' | 'article';
}
// Uses translateY only — NEVER translateX, which does not mirror under dir.
// Wrapped in @media (prefers-reduced-motion: reduce) { opacity: 1; transform: none }

// DirectionalIcon.tsx — P   ★ RTL correctness
interface DirectionalIconProps {
  name: 'arrow' | 'chevron' | 'arrow-narrow';
  dir: Direction;                                 // passed explicitly; no context lookup in RSC
  size?: 16 | 18 | 20 | 24;
  className?: string;
}
// Swaps the component (ArrowRight ⇄ ArrowLeft) rather than CSS-flipping — crisper stems/joins.
// All NON-directional icons (check, phone, mail, clock, map-pin, WhatsApp, logo) are used raw and NEVER flipped.

// NoticeCallout.tsx — P   ★ enforces the legal hedging
interface NoticeCalloutProps {
  children: React.ReactNode;
  tone?: 'neutral' | 'legal';
  icon?: boolean;
}
// Renders: background var(--color-cream); border-inline-start: 3px solid var(--color-gold);
// Used on every service page whose content carries a `legalNote`. The content test in §8 makes
// this MANDATORY for behoerden / finanzen / immobilien.

// Modal.tsx — S   (native <dialog>; only consumer is MobileNav)
interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  variant?: 'sheet-end' | 'sheet-bottom' | 'centered';
  children: React.ReactNode;
}
// showModal() gives focus trap + ESC + inert background + focus return, for 0 KB.
// We add only: backdrop-click close, and useLockBodyScroll.

// Logo.tsx — P
interface LogoProps {
  variant?: 'full' | 'mark';
  locale: Locale;                                 // alt text + optional AR lockup variant
  width?: number;
  height?: number;
  priority?: boolean;
}
```

### 4.2 Layout — `src/components/layout/`

```ts
// LocaleProvider.tsx — S  (carries TWO immutable values; no strings, ever)
interface LocaleContextValue { locale: Locale; dir: Direction; }
interface LocaleProviderProps { locale: Locale; children: React.ReactNode; }

// SiteHeader.tsx — S
interface SiteHeaderProps {
  locale: Locale;
  nav: readonly NavItem[];                        // { id, href, label } — already localized
  labels: HeaderLabels;                           // { openMenu, closeMenu, switchTo, skipToContent, brandAlt }
  ctaLabel: string;
  ctaHref: string;
  currentPath: string;                            // for LocaleSwitch target
}
// State: mobileNavOpen (useState), activeSectionId (useScrollSpy), isScrolled (useState+listener)

// MobileNav.tsx — S
interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  nav: readonly NavItem[];
  locale: Locale;
  currentPath: string;
  labels: HeaderLabels;
  ctaLabel: string;
  ctaHref: string;
}

// LocaleSwitch.tsx — S
interface LocaleSwitchProps {
  locale: Locale;
  currentPath: string;
  size?: 'sm' | 'md';
}
// Renders <Link href={swapLocalePath(currentPath, other)} hrefLang={other} lang={other}
//               aria-label={…}> {other === 'ar' ? 'العربية' : 'Deutsch'} </Link>
// onClick sets the NEXT_LOCALE cookie. Works with JS disabled. NEVER a flag icon.

// SiteFooter.tsx — P
interface SiteFooterProps {
  locale: Locale;
  content: FooterContent;                         // { slogan, columns, legalLinks, copyright }
  nap: NapData;
}

// SkipLink.tsx — P
interface SkipLinkProps { label: string; targetId?: string; }   // default 'main-content'

// WhatsAppFab.tsx — P
interface WhatsAppFabProps { phoneE164: string; label: string; prefilledMessage?: string; }
// className: "fixed bottom-6 end-6" — mirrors automatically. No .rtl override needed.

// JsonLd.tsx — P
interface JsonLdProps { data: Record<string, unknown> | Record<string, unknown>[]; }
```

### 4.3 Sections — `src/components/sections/`

```ts
// Hero.tsx — P
interface HeroProps { locale: Locale; content: HeroContent; }
interface HeroContent {
  eyebrow: string; headline: string; lead: string;
  primaryCta: CtaRef; secondaryCta: CtaRef;
  trustPoints: readonly string[];
  image: MediaRef;
}

// PillarSplit.tsx — P
interface PillarSplitProps { locale: Locale; heading: SectionHeadingContent; pillars: readonly PillarContent[]; }

// PillarCard.tsx — P
interface PillarCardProps {
  locale: Locale;
  eyebrow: string; title: string; body: string;
  linkLabel: string; href: string;
  image: MediaRef;
  surface: 'cream' | 'mint';
  imageFit?: 'cover' | 'contain';
}

// ServiceGrid.tsx — P
interface ServiceGridProps {
  locale: Locale;
  heading: SectionHeadingContent;
  services: readonly ServiceCardData[];
  note?: string;                                  // the small centred hedging footnote
}

// ServiceCard.tsx — P   (a real <Link> to a real page — no modal, no JS)
interface ServiceCardData { id: ServiceId; eyebrow: string; title: string; teaser: string; href: string; icon: IconName; }
interface ServiceCardProps extends ServiceCardData { locale: Locale; detailLabel: string; index: number; }

// ServiceDetail.tsx — P   (body of /[locale]/leistungen/[slug])
interface ServiceDetailProps {
  locale: Locale;
  service: ServiceContent;
  meta: ServiceMeta;
  labels: { backToServices: string; ctaHeading: string; ctaButton: string; whatsappButton: string };
}

// CleaningPanel.tsx — P
interface CleaningPanelProps { title: string; intro?: string; items: readonly string[]; closing?: string; cta?: CtaRef; }

// WhyUs.tsx — P
interface WhyCardContent { icon: IconName; title: string; body: string; }
interface WhyUsProps { heading: SectionHeadingContent; cards: readonly WhyCardContent[]; }

// ProcessSteps.tsx — P   (new; addresses the AR copy's "clear and simple steps" promise)
interface ProcessStep { number: number; title: string; body: string; }
interface ProcessStepsProps { heading: SectionHeadingContent; steps: readonly ProcessStep[]; }
// Numbers rendered via formatOrdinal(locale) with numberingSystem 'latn'.

// ContactSection.tsx — P (wraps the client ContactForm)
interface ContactSectionProps {
  locale: Locale;
  content: ContactContent;                        // heading, lead, quickContactItems
  formStrings: ContactFormStrings;
  serviceOptions: readonly { value: ServiceId | 'sonstiges'; label: string }[];
  nap: NapData;
}

// InfoStrip.tsx — P
interface InfoStripProps { locale: Locale; content: InfoStripContent; nap: NapData; }

// FinalCta.tsx — P
interface FinalCtaProps { title: string; body: string; primary: CtaRef; secondary?: CtaRef; }
```

### 4.4 Forms — `src/components/forms/`

```ts
// ContactForm.tsx — S   ★ the only genuinely stateful component in the project
interface ContactFormProps {
  locale: Locale;
  strings: ContactFormStrings;
  serviceOptions: readonly { value: string; label: string }[];
  contactTimeOptions: readonly { value: ContactTime; label: string }[];
  privacyHref: string;
  /** Defaults to process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '/api/contact' */
  endpoint?: string;
}
interface ContactFormStrings {
  heading: string; lead: string;
  labels: Record<keyof ContactFormValues, string>;
  placeholders: Partial<Record<keyof ContactFormValues, string>>;
  errors: Record<ContactErrorKey, string>;        // localized zod messages
  consentLabel: string; consentLinkText: string;
  submit: string; submitting: string;
  successTitle: string; successBody: string;
  errorTitle: string; errorBody: string; retry: string;
  requiredHint: string;                           // "Pflichtfeld" / "حقل إلزامي"
}
// State: RHF formState + `status: 'idle' | 'submitting' | 'success' | 'error'`
// Validation: onBlur first, then onChange once touched (least-annoying pattern)
// On invalid submit: setFocus() to first error + FormStatus announces via role="alert"

// FormField.tsx — P
interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  span?: 'half' | 'full';                         // grid-column: 1/-1 for 'full'
  children: (a11y: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;
}

// TextInput.tsx / TextArea.tsx — P (forwardRef, RHF-register-spreadable)
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Forces dir="ltr" + inputMode for phone/email so bidi never mangles the value. */
  latinValue?: boolean;
}

// SelectInput.tsx — P (native <select>: free mobile UX, free a11y, free RTL, 0 KB)
interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  invalid?: boolean;
}

// ConsentCheckbox.tsx — P
interface ConsentCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; linkText: string; href: string; invalid?: boolean;
}

// HoneypotField.tsx — P
interface HoneypotFieldProps { name?: string; }   // default 'website'

// FormStatus.tsx — P
interface FormStatusProps {
  status: 'idle' | 'submitting' | 'success' | 'error';
  successTitle: string; successBody: string;
  errorTitle: string; errorBody: string;
  onRetry?: () => void;
}
// success → role="status" aria-live="polite" · error → role="alert"
```

**Reuse audit:** `CheckList` appears ~14×, `Card` ~16×, `SplitSection` 6×, `Section` 9×, `Button` ~14×, `MediaFrame` ~11×, `SectionHeading` 8×. Only `Hero`, `CleaningPanel`, `InfoStrip` and `SiteFooter` are genuinely one-off — everything else composes.

---

## 5. i18n + RTL architecture

### 5.1 Library decision: **none.** Typed TS content modules.

The deciding argument is in the brief itself: *"The Arabic PDF is **not** a 1:1 translation… Do **not** assume symmetric translation keys will just work."*

Every catalog-based i18n library (`next-intl`, `react-i18next`, `lingui`) models translation as *the same key tree in N languages*. Our content is **structurally divergent**: AR §3 drops the entire post-arrival block; AR §4 flattens three sub-blocks into one; AR "Warum" is longer and more explanatory. Modelling that in a message catalog means either fake empty keys or per-locale conditional rendering — both worse than the alternative.

The alternative:

```ts
// src/types/content.ts
export interface SiteContent {
  meta: MetaContent;
  hero: HeroContent;
  pillars: readonly PillarContent[];
  why: WhyContent;
  cleaning: CleaningContent;
  contact: ContactContent;
  info: InfoStripContent;
  footer: FooterContent;
  form: ContactFormStrings;
  a11y: A11yStrings;
  /** OPTIONAL by design: German has it, Arabic does not. The type encodes the asymmetry. */
  process?: ProcessContent;
}

export interface ServiceContent {
  id: ServiceId;
  eyebrow: string; title: string; teaser: string; intro: string;
  /** Array length may differ per locale — DE finanzen has 3 blocks, AR has 1. */
  blocks: readonly ServiceBlock[];
  closingCta?: string;
  legalNote?: string;
  metaTitle: string; metaDescription: string;
  imageAlt: string;                    // localized alt for the shared image
}
```

```ts
// src/content/de/site.ts
import type { SiteContent } from '@/types/content';
export const de = { /* … */ } satisfies SiteContent;

// src/content/ar/site.ts
export const ar = { /* … */ } satisfies SiteContent;   // TS ERRORS if any required key is missing
```

```ts
// src/content/index.ts
const CONTENT: Record<Locale, SiteContent> = { de, ar };
export const getContent = (locale: Locale): SiteContent => CONTENT[locale];
export const getService = (locale: Locale, id: ServiceId): ServiceContent => SERVICES[locale][id];
```

**What this buys that no library gives:** `tsc --noEmit` becomes the translation-completeness check. Missing a required Arabic key is a *build failure*, not a runtime `[missing key]` string in production. Optional keys explicitly whitelist allowed divergence. Cost: 0 KB, 0 config, ~20 lines of plumbing.

**The locale-invariant / locale-variant split is the second key move.** `src/content/shared/services.meta.ts` holds `{ id, slug, icon, images, order, accent }` — data that must be identical across locales. `src/content/{de,ar}/services.ts` holds only prose. This makes it structurally impossible for the German and Arabic sites to have different URLs, icons, or service ordering.

**OPEN QUESTION:** if English or Turkish is ever coming (brief §6), revisit at 3 locales. At 3+ with symmetric content, `next-intl` starts winning on translator tooling (`.json` files a non-developer can edit). At 2 asymmetric locales it loses clearly. **The client should answer this before build starts**, because retrofitting is ~6 hrs.

### 5.2 URL strategy

**Prefix-always: `/de/…` and `/ar/…`. `/` 307-redirects.**

```
/                                 → 307 → /de  (or /ar via cookie / Accept-Language)
/de                               /ar
/de/leistungen/einbuergerung-behoerden        /ar/leistungen/einbuergerung-behoerden
/de/leistungen/ehe-uebersetzungen             /ar/leistungen/ehe-uebersetzungen
/de/leistungen/studium-visa                   /ar/leistungen/studium-visa
/de/leistungen/finanzen-vorsorge              /ar/leistungen/finanzen-vorsorge
/de/leistungen/immobilien-investitionen       /ar/leistungen/immobilien-investitionen
/de/leistungen/reinigungsservice              /ar/leistungen/reinigungsservice
/de/kontakt                       /ar/kontakt
/de/impressum                     /ar/impressum
/de/datenschutz                   /ar/datenschutz
```

20 prerendered pages. Slugs are **German for both locales** and defined once in `services.meta.ts`.

*Honest tradeoff:* localized Arabic slugs would be marginally better for Arabic-query SEO, but percent-encoded Arabic URLs (`/ar/%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/…`) look broken when pasted into WhatsApp — the primary sharing channel for this audience. Latin slugs win. *Also honest:* prefixing German (`/de/…`) rather than serving it at the root costs a little URL elegance, but makes hreflang unambiguous and the routing code half the size. At $700 that is the right trade.

```ts
// src/lib/locale.ts
export const LOCALES = ['de', 'ar'] as const;
export const DEFAULT_LOCALE: Locale = 'de';
export type Locale = (typeof LOCALES)[number];
export type Direction = 'ltr' | 'rtl';

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);
export const dirFor = (l: Locale): Direction => (l === 'ar' ? 'rtl' : 'ltr');
export const otherLocale = (l: Locale): Locale => (l === 'de' ? 'ar' : 'de');

/** Rewrites only the locale segment; preserves the rest of the path, query and hash. */
export function swapLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split('/');
  if (isLocale(segments[1])) { segments[1] = next; return segments.join('/') || '/'; }
  return `/${next}${pathname === '/' ? '' : pathname}`;
}
```

### 5.3 Locale detection & persistence

```ts
// src/middleware.ts — matches ONLY "/". Never runs on a locale URL.
export function middleware(req: NextRequest) {
  const cookie = req.cookies.get('NEXT_LOCALE')?.value;
  const fromCookie = isLocale(cookie) ? cookie : null;
  const fromHeader = /(^|[,\s])ar\b/i.test(req.headers.get('accept-language') ?? '') ? 'ar' : 'de';
  const locale = fromCookie ?? fromHeader;
  return NextResponse.redirect(new URL(`/${locale}`, req.url), 307);
}
export const config = { matcher: '/' };
```

Three deliberate rules:

1. **Matcher is `/` only.** Detection never runs on `/de/…` or `/ar/…`. A crawler or a shared WhatsApp link always lands exactly where it points — no locale ping-pong, no soft-404s, no duplicate-content signal.
2. **307, not 301.** A permanently-cached redirect on `/` would freeze the first visitor's language into every subsequent browser cache.
3. **Cookie is written only by an explicit user action** (`LocaleSwitch`), never by the middleware. Explicit choice always beats header sniffing on the next visit.

Static-host fallback (if `output: 'export'` is used): replace with a host rule.
```
# Netlify / Cloudflare Pages _redirects
/    /de    307
```

### 5.4 `<html lang dir>` — server-rendered, zero flash

```tsx
// src/app/[locale]/layout.tsx
export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dir = dirFor(locale);
  const fontVars = locale === 'ar'
    ? plexArabic.variable
    : `${sourceSerif.variable} ${inter.variable}`;

  return (
    <html lang={locale} dir={dir} className={fontVars} suppressHydrationWarning={false}>
      <body className="bg-page text-ink font-body antialiased">
        <SkipLink label={getContent(locale).a11y.skipToContent} />
        <LocaleProvider locale={locale}>
          <SiteHeader … />
          <main id="main-content">{children}</main>
          <SiteFooter … />
          <WhatsAppFab … />
        </LocaleProvider>
        <JsonLd data={localBusinessSchema(locale)} />
      </body>
    </html>
  );
}
```

This is the single biggest correctness win over the reference site, which toggles a `.rtl` class from JavaScript and therefore renders one LTR frame before flipping.

### 5.5 RTL implementation — three layers, in priority order

**Layer 1 (≈95% of cases): CSS logical properties via Tailwind v4 utilities.**

Tailwind v4 ships `ps-*` `pe-*` `ms-*` `me-*` `start-*` `end-*` `text-start` `text-end` `border-s-*` `border-e-*` `rounded-s-*` `rounded-e-*` `scroll-ps-*`. These resolve against `dir` at the CSS level — no JS, no variant, no duplication.

> **Codebase law: `pl-` `pr-` `ml-` `mr-` `left-` `right-` `text-left` `text-right` `border-l-` `border-r-` `rounded-l-` `rounded-r-` are BANNED.**

Enforced mechanically, because a code-review convention will not survive a deadline:

```js
// scripts/check-logical-props.mjs   (run in `npm run verify` and in CI)
const BANNED = /\b(?:-)?(?:p|m)[lr]-|\btext-(?:left|right)\b|\b(?:-)?(?:left|right)-(?:\d|auto|\[)|\bborder-[lr]-|\brounded-[lr]/;
// walks src/**/*.{tsx,ts,css}, skips lines with `/* rtl-ok */`, exits 1 on any hit
```
~25 lines, $0, catches the entire bug class.

**Layer 2 (≈4%): Tailwind's built-in `rtl:` / `ltr:` variants**, used only where no logical property exists:

| Case | Solution |
|---|---|
| Hover `translate-x` | **Eliminated by design constraint** — all hover motion is `translate-y` only (matching the reference's `translateY(-4px)`). No `rtl:` needed. |
| `background-position` on decorative art | `bg-left rtl:bg-right` |
| Composite icon glyphs that must mirror | `rtl:-scale-x-100` |
| Decorative quote marks / numeric badges | `rtl:-scale-x-100` on the wrapper, `rtl:-scale-x-100` again on the inner text to un-mirror it |

**Layer 3 (≈1%): custom `@utility` definitions with a `[dir="rtl"]` override**, for gradients — the one thing CSS has no logical syntax for.

```css
/* src/app/globals.css */
@utility edge-fade-cream {
  background-image: linear-gradient(90deg, var(--color-cream), transparent 22%);
}
[dir="rtl"] .edge-fade-cream {
  background-image: linear-gradient(-90deg, var(--color-cream), transparent 22%);
}
@media (max-width: 980px) {
  .edge-fade-cream { background-image: linear-gradient(0deg, var(--color-cream), transparent 30%); }
}
```

**Shadows: mirroring is eliminated, not solved.** Design constraint: **every box-shadow in this system has an x-offset of `0`.** The reference already satisfies this (`0 15px 35px`, `0 10px 25px`, `0 30px 90px`). Codify it in `@theme` as named shadow tokens so no one can hand-roll an offset one:

```css
@theme {
  --shadow-card-hover: 0 15px 35px #07534417;
  --shadow-fab:        0 10px 25px #00000038;
  --shadow-overlay:    0 30px 90px #00000052;
  --shadow-float:      0 4px 16px  #00000026;
}
```

**Grid & flex mirror for free.** `grid-template-columns: 1.03fr .97fr` reverses under `dir="rtl"` with zero code; so does `flex-direction: row`. The entire "split" motif therefore mirrors automatically — which is a real argument for building on Grid rather than absolute positioning.

**Icons — the explicit mirror policy:**

| Mirror | Never mirror |
|---|---|
| `ArrowRight`↔`ArrowLeft`, `ChevronRight`↔`ChevronLeft`, `ArrowUpRight`↔`ArrowUpLeft`, `Send` (`rtl:-scale-x-100`), progress/step connectors | Logo, `Check`, `Phone`, `Mail`, `Clock`, `MapPin`, `Building2`, `Sparkles`, WhatsApp glyph, photographs, the checkmark-document brand mark, any numeral |

Implemented in `DirectionalIcon` by **swapping the component**, not CSS-scaling — scaled strokes shift optical weight on asymmetric glyphs.

### 5.6 Typography flip — one rule flips the entire site

```css
@theme {
  --font-heading: var(--font-source-serif), Georgia, "Times New Roman", serif;
  --font-body:    var(--font-inter), Arial, Helvetica, sans-serif;
}

[dir="rtl"] {
  --font-heading: var(--font-plex-arabic), "Segoe UI", Tahoma, "Geeza Pro", "Noto Sans Arabic", sans-serif;
  --font-body:    var(--font-plex-arabic), "Segoe UI", Tahoma, "Geeza Pro", "Noto Sans Arabic", sans-serif;
}

@layer base {
  /* Arabic must never carry Latin display tracking, and needs looser leading. */
  [dir="rtl"] :is(h1, h2, h3, h4) { letter-spacing: 0; }
  [dir="rtl"] h1 { line-height: 1.16; }   /* vs .96 in LTR */
  [dir="rtl"] h2 { line-height: 1.28; }   /* vs 1.08 */
  [dir="rtl"] h3 { line-height: 1.4; }
  [dir="rtl"] p, [dir="rtl"] li { line-height: 1.85; }  /* vs 1.65 — Arabic ascenders/descenders */
  [dir="rtl"] .eyebrow { letter-spacing: 0; }           /* .16em tracking destroys Arabic joining */
}
```

Every component uses `font-heading` / `font-body`. **No component ever names a font.** The Arabic serif problem is sidestepped: Arabic has no serif/sans dichotomy, so both roles resolve to IBM Plex Sans Arabic and are differentiated by weight (700 headings / 400 body) and size.

`letter-spacing: 0` on Arabic is not cosmetic — positive or negative tracking **breaks the cursive joins** between Arabic letterforms. This is the most common Arabic-web defect and the reference site already patched it (`.rtl .hero h1 { letter-spacing: 0 }`); we generalise it to all headings and the eyebrow.

### 5.7 Number, phone and date formatting

```ts
// src/lib/format.ts

/** Arabic-speaking users in Germany read Latin digits for phones, addresses and prices.
 *  Force numberingSystem 'latn' — otherwise some runtimes emit Eastern Arabic-Indic ٠١٢٣. */
const NUM_LOCALE: Record<Locale, string> = { de: 'de-DE', ar: 'ar-u-nu-latn' };

/** Gregorian is forced: bare 'ar' can resolve to islamic-umalqura in some ICU builds. */
const DATE_LOCALE: Record<Locale, string> = { de: 'de-DE', ar: 'ar-u-nu-latn-ca-gregory' };

export const formatNumber = (n: number, l: Locale) =>
  new Intl.NumberFormat(NUM_LOCALE[l]).format(n);

export const formatWeekday = (dayIndex: number, l: Locale) =>
  new Intl.DateTimeFormat(DATE_LOCALE[l], { weekday: 'long' })
    .format(new Date(Date.UTC(2024, 0, 1 + dayIndex)));   // 2024-01-01 was a Monday
```

**Phone numbers are never run through `Intl` and are always bidi-isolated.** In an RTL paragraph, `+49 30 1234567` renders as `1234567 30 49+` without isolation — the single most damaging Arabic-web bug because the user cannot dial the number.

```tsx
// Always:
<a href={`tel:${nap.phoneE164}`} dir="ltr" className="inline-block whitespace-nowrap">
  {nap.phoneDisplay}
</a>

// And for any Latin string embedded in Arabic prose (email, URL, street number, "Zukunft Service"):
<bdi>{value}</bdi>
```
`TextInput` exposes `latinValue?: boolean`, which sets `dir="ltr"` + `inputMode="tel"` / `"email"` — so the user *types* the phone number in the correct direction too.

Opening hours are stored structurally in `nap.ts` (`{ day: 0..6, from: '09:00', to: '18:00' }`) and formatted by `formatWeekday`. One data shape serves the German page, the Arabic page, and the schema.org `openingHoursSpecification`.

### 5.8 Language-switcher UX

- **A `<Link>`, not a `<button>`.** Crawlable, middle-clickable, works with JS off. `hrefLang` + `lang` on the anchor.
- **Labelled in the target language, in that language's script**: on `/de` it reads `العربية`; on `/ar` it reads `Deutsch`. Never a translated word ("Arabisch"), never a flag — Arabic has no country.
- **Stays on the equivalent page**, preserving path + hash: `/de/leistungen/finanzen-vorsorge#kontakt` → `/ar/leistungen/finanzen-vorsorge#kontakt`.
- `onClick` writes `NEXT_LOCALE=<target>; path=/; max-age=31536000; samesite=lax` — progressive enhancement only; navigation happens via the href regardless.
- `aria-label` is bilingual so a German screen reader on `/de` announces something meaningful: `aria-label="Zur arabischen Version wechseln – التبديل إلى النسخة العربية"`.
- Visual: gold-ringed pill (`rounded-full border border-green/25 bg-white px-4 py-2.5 font-extrabold text-green`), matching the reference, plus a `Globe` icon at ≥640px. On mobile it sits before the hamburger.
- **In `MobileNav` it is rendered again, full-width, at the top of the sheet** — the reference hides the nav entirely below 980px, so mobile Arabic users currently have no way to switch. That is a bug we fix.

### 5.9 hreflang & metadata

```ts
// src/lib/seo.ts
export function buildAlternates(path: string) {         // path WITHOUT locale prefix, e.g. '/leistungen/studium-visa'
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    canonical: `${base}/de${path}`,                     // set per-locale by the caller
    languages: {
      'de-DE':    `${base}/de${path}`,
      'ar':       `${base}/ar${path}`,
      'x-default':`${base}/de${path}`,
    },
  };
}
```
Emitted into static HTML by `generateMetadata` on every one of the 20 pages. `x-default` → German, matching the middleware's default and the business's primary market.

---

## 6. State management

### What state actually exists

| State | Type | Lives in | Rationale |
|---|---|---|---|
| **Locale** | `'de' \| 'ar'` | **The URL** (`[locale]` route param), mirrored to a `NEXT_LOCALE` cookie for `/` detection only | The URL is the only correct home for locale: shareable, bookmarkable, crawlable, cacheable, statically generable. It is *routing*, not state. |
| **Direction** | `'ltr' \| 'rtl'` | Derived, never stored. Written once to `<html dir>` server-side. | Pure function of locale. |
| **Content strings** | `SiteContent` | Build-time module import inside Server Components | Never enters the client bundle. This is why a "translation store" would be pure waste. |
| **`{locale, dir}` for client leaves** | 2 immutable values | `LocaleProvider` context | Not state — it never changes during a page's life. Context here is dependency injection, not state management. Strings are **never** put in it (they'd be serialized into the RSC payload). |
| **Mobile nav open** | `boolean` | `useState` in `SiteHeader`, passed to `MobileNav` | One owner, one consumer. |
| **Header scrolled** | `boolean` | `useState` + passive scroll listener in `SiteHeader` | Local visual state. |
| **Active nav section** | `string \| null` | `useScrollSpy()` inside `SiteHeader` | IntersectionObserver over `section[id]`. |
| **Service detail open** | **DOES NOT EXIST** | — | **Deliberately eliminated.** The reference uses a modal; we use real pages at `/leistungen/[slug]`. This removes a whole state machine, a focus-management a11y risk, and simultaneously fixes the "no per-service pages for SEO" weakness. Strictly better *and* cheaper. |
| **Form values / touched / errors** | RHF `useForm` | `ContactForm` | RHF keeps values in refs — they never become React state at all. |
| **Submission status** | `'idle'\|'submitting'\|'success'\|'error'` | `useState` in `ContactForm` | 4 values, one component. |
| **Reveal-on-scroll visibility** | `boolean` per element | `useInView()` inside each `Reveal` | Self-contained, unmounts its observer. |
| **Reduced-motion preference** | media query | **CSS only** — never read into JS | |

### Why no state library

Every entry above is either (a) in the URL, (b) in the DOM, or (c) owned by exactly one component with exactly one consumer. **There is not a single piece of state read by two unrelated subtrees.** Adding Zustand/Jotai/Redux would introduce a store, a provider, actions and an import graph to solve a coordination problem the architecture does not have — and would tempt a future maintainer to lift local state up "just in case."

There is also no server state: one fire-and-forget `POST`, no caching, no revalidation, no optimistic updates. React Query solves nothing here.

**Total client state code in the project: roughly 40 lines of `useState`.** That is the correct amount for a brochure site, and the honest answer at $700.

---

## 7. Performance plan

### Images

- `next/image` everywhere, via the `MediaFrame` primitive. `next.config.ts`:
  ```ts
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 980, 1080, 1200, 1920, 2048],
    imageSizes: [256, 384, 512],
  }
  ```
- **Masters:** hero 2400×1600, pillar 1600×1200, service hero 1600×1200, gallery 1200×900 — supplied as JPEG (photos) / PNG (flat art). Next derives AVIF + WebP + srcset. **Never commit pre-optimized WebP** — it defeats the pipeline.
- **The LCP element is deliberately the `<h1>`, not the hero image.** The hero is copy-first (text left/start, image on the opposite side) and the h1 is static HTML in the initial response with a preloaded font → LCP resolves at first paint. The hero image still gets `priority` + `sizes="(max-width: 980px) 100vw, 48vw"` so it does not become the LCP on narrow viewports where it stacks on top.
- Every other image: `loading="lazy"` (next/image default) with explicit `width`/`height`. **CLS from images: 0.**
- Placeholder: `background-color: #edf2ed` on the `MediaFrame` wrapper (the reference's own letterbox colour). No `plaiceholder`, no blur data URIs, no build step.
- **Logo is an inline React SVG component**, not an `<img>` — zero requests, recolours with `currentColor`, and cannot cause a header CLS.
- **OPEN QUESTION (blocking):** does the client have real photography of the office/team/cleaning work? The reference leans hard on large imagery. If not, budget for stock licensing (client-paid) or the design pivots to typographic/illustrative treatments. **This decision changes the visual design, not just the assets — it must be answered before design finalises.**

### Fonts

```ts
// src/styles/fonts.ts
import { Inter, Source_Serif_4, IBM_Plex_Sans_Arabic } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],            // German ä ö ü ß are all in 'latin'; latin-ext is NOT needed (~10 KB saved)
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,      // metric-matched Arial fallback → near-zero CLS on swap
});

export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],        // only two — the AR type scale differentiates by size, not weight
  variable: '--font-plex-arabic',
  display: 'swap',
  preload: false,                // see note
});
```

- **`next/font` self-hosts** — files are emitted to your own origin. No request to `fonts.gstatic.com`, therefore **no DSGVO transfer** (cf. *LG München I, 3 O 17493/20*). This is a legal deliverable, not just a perf one, and worth naming explicitly to the client.
- Font choice rationale: **Source Serif 4** replaces the reference's Georgia — same warm, credible serif register, but a real brand asset with a variable weight axis at display sizes. **Inter** for body: excellent German diacritics, tabular figures for phone numbers. **IBM Plex Sans Arabic** for all Arabic: purpose-built as a metric companion to Plex Sans, genuinely well-hinted at small sizes, and available on Google Fonts so `next/font` can subset it.
- **`preload: false` on Arabic, deliberately.** `next/font` calls are module-scope and cannot be conditional, so `preload: true` would emit a `<link rel="preload">` for the Arabic face on the German pages too (~80 KB wasted for every German visitor — the majority). With `preload: false`, Google's `unicode-range` means German pages never *download* it at all, and Arabic pages start the fetch at CSS-parse time (~30 ms later than a preload). The `Tahoma` / `Geeza Pro` / `Noto Sans Arabic` fallback stack keeps the FOUT visually mild. **Accepted tradeoff, documented.**
- **Optional paid upgrade (not in scope):** a dedicated Arabic display face (Rubik or Almarai) for AR headings, ~+45 KB and ~2 hrs. Currently AR headings use Plex Arabic 700.

**Font budget:** Inter latin variable ≈ 28 KB · Source Serif 4 latin variable ≈ 42 KB · **German total ≈ 70 KB.** IBM Plex Sans Arabic ×2 weights, arabic subset ≈ 80 KB · **Arabic total ≈ 80 KB** (Latin faces are not fetched on `/ar` because no Latin glyph is rendered outside `<bdi>` runs — where the fallback stack covers it).

### Code splitting

Server Components ship **zero JavaScript**. Only four client boundaries exist:

| Client boundary | Approx. chunk (gz) |
|---|---|
| `SiteHeader` + `MobileNav` + `useScrollSpy` + `useLockBodyScroll` + icons | ~5 KB |
| `LocaleSwitch` | ~1 KB |
| `Reveal` | ~1 KB |
| `ContactForm` (RHF + zod + resolvers + form primitives) | ~24 KB |

`ContactForm` is **not** lazy-loaded. It is the site's single conversion element; a 200 ms hydration delay when the user reaches it costs more than 24 KB of prefetched bytes. Deliberate call.

`lucide-react` is tree-shaken automatically — Next 15+ includes it in `optimizePackageImports` by default, so `import { Check } from 'lucide-react'` pulls ~0.4 KB, not the barrel.

### Bundle budget (gzipped)

| | Homepage `/de` | Service page `/de/leistungen/[slug]` |
|---|---|---|
| Next + React 19 runtime | ~102 KB | ~102 KB |
| Our client code | ~31 KB | ~7 KB |
| **First-load JS — BUDGET** | **≤ 145 KB** | **≤ 115 KB** |
| CSS (Tailwind v4 JIT) | ≤ 16 KB | ≤ 16 KB |
| HTML | ~15 KB | ~13 KB |
| Fonts (DE) | ~70 KB | ~70 KB |

**Gate:** the "First Load JS" column printed by `next build` must not exceed the budget. Run `@next/bundle-analyzer` once before handoff and record the result in `HANDOFF.md`. If the budget is exceeded, the first lever is lazy-loading `ContactForm`, the second is dropping `Source Serif 4` for `Georgia`.

### Lighthouse / Core Web Vitals targets

Measured on **both `/de` and `/ar`**, mobile emulation (Moto G Power, 4× CPU throttle, Slow 4G), production build:

| Metric | Target | Why it is achievable |
|---|---|---|
| Performance | **≥ 95** | Static HTML, ~145 KB JS, no third-party scripts |
| Accessibility | **100** | Skip link, semantic landmarks, native `<dialog>`, `jsx-a11y` recommended, contrast tokens below |
| Best Practices | **100** | No console errors, correct image aspect ratios, HTTPS, no deprecated APIs |
| SEO | **100** | Per-page metadata, canonical, hreflang, sitemap, robots, JSON-LD |
| **LCP** | **≤ 1.4 s** (limit 1.8 s) | LCP is the `<h1>`, rendered in the initial HTML with a preloaded metric-matched font |
| **CLS** | **≤ 0.02** (limit 0.1) | `adjustFontFallback` on Latin faces, explicit image dimensions, sticky header at a fixed 88/74 px, **no cookie banner** (none needed — see below) |
| **INP** | **≤ 100 ms** (limit 200 ms) | Essentially no main-thread work; nav is CSS transitions; form is uncontrolled |
| TBT | ≤ 150 ms | Follows from the JS budget |

**A11y contrast corrections baked into the token layer** (the reference fails here, and it is free to fix):

| Token | Hex | Contrast | Rule |
|---|---|---|---|
| `--color-gold` | `#c48a16` | 2.96:1 on `#fffdf9` | **Non-text only** — borders, rules, icon fills ≥32 px, and as a *button background* with `#172c27` text |
| `--color-gold-ink` **(new)** | `#8a610d` | **5.55:1** on `#fffdf9`, **4.98:1** on cream | **All gold-coloured text**: eyebrows, "Details" links, inline accents |
| `--color-sage` | `#769b7e` | 3.07:1 | **Decorative only** — never body text |
| `--color-green` on white | `#075344` | 9.02:1 | Safe for all text |
| gold on `--color-deep` | `#c48a16` / `#043b32` | 4.17:1 | Large text (≥24 px) and accents only |
| `#c7d6d2` on `--color-deep` | | 8.34:1 | Body text on the contact section |

`--color-gold-ink: #8a610d` is the one addition to the client's palette. It is the same hue, darker — visually indistinguishable in a brand sense, and it is the difference between a 100 and an ~88 accessibility score.

**No analytics ships by default**, therefore **no cookie-consent banner is required** (TTDSG §25 / DSGVO), which protects CLS, LCP and the visual design simultaneously. **OPEN QUESTION:** does the client want analytics? If yes, recommend **Plausible** (self-hostable, cookieless, EU-hosted, no consent banner required under the prevailing German reading) over Google Analytics 4, which mandates a consent banner and a US-transfer assessment. This is a client decision with legal and design consequences.

---

## 8. Tooling

### `tsconfig.json` — strictness

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,      // catches services[0] being possibly undefined
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,  // Windows dev → Linux CI: prevents the classic case bug
    "verbatimModuleSyntax": true,          // enforces `import type`, keeps runtime imports honest
    "target": "ES2022",
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**Deliberately NOT enabled: `exactOptionalPropertyTypes`.** It fights React's optional-prop conventions and `react-hook-form`'s generics, and would cost a couple of hours of `| undefined` unions for effectively zero defect prevention on a site this size. Honest omission, not an oversight.

**`noUncheckedIndexedAccess: true` IS enabled** because array indexing into content lists is exactly where this project would break. (`Record<Locale, T>` lookups are unaffected — the key is a closed union, so `CONTENT[locale]` stays non-optional.)

### Path aliases

**One alias only: `@/*` → `./src/*`.** Multiple aliases (`@components`, `@lib`) look tidy and reliably cause import-resolution confusion for a developer inheriting the codebase. One rule, no ambiguity.

### ESLint / Prettier

```js
// eslint.config.mjs  (flat)
import next from 'eslint-config-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default [
  ...next,                       // core-web-vitals + TypeScript
  jsxA11y.flatConfigs.recommended,
  prettier,                      // MUST be last
  { rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'jsx-a11y/anchor-is-valid': 'off',      // next/link false positives
      'no-restricted-imports': ['error', { paths: [
        { name: 'next/router', message: 'App Router: use next/navigation.' },
      ]}],
  }},
];
```

```jsonc
// .prettierrc
{ "semi": true, "singleQuote": true, "printWidth": 100, "plugins": ["prettier-plugin-tailwindcss"] }
```

### npm scripts

```jsonc
{
  "dev":       "next dev",
  "build":     "next build",
  "start":     "next start",
  "lint":      "next lint",
  "lint:rtl":  "node scripts/check-logical-props.mjs",
  "typecheck": "tsc --noEmit",
  "test":      "vitest run",
  "analyze":   "ANALYZE=true next build",
  "verify":    "npm run typecheck && npm run lint && npm run lint:rtl && npm run test && npm run build"
}
```
`npm run verify` is the single gate run before handoff. No husky, no lint-staged — one branch, one developer.

### Tests — the honest answer at $700

**No component tests. No jsdom. No `@testing-library/react`. No Playwright. No coverage threshold.**

At this budget, DOM-level component tests for a brochure site are the lowest-ROI work available: they take ~6 hrs, break on every design tweak (and the design *will* be tweaked by the client), and catch defects that a 10-minute manual pass across two locales catches better.

**But three test files earn their place**, because they guard things that fail *silently in production* and that a manual pass cannot see. Total: **~45 minutes, `vitest` in node environment, no jsdom.**

**1. `src/lib/contact-schema.test.ts` — ~12 assertions.**
This is the contract the backend developer inherits. It must be executable, not prose.
- required fields reject empty strings and whitespace-only strings
- `email` rejects `a@b`, accepts `a@b.de`
- `phone` accepts `+49 30 1234567`, `0049 30 1234567`, `030 1234567`; rejects letters
- `message` enforces min 20 / max 2000 characters
- `serviceId` rejects an unknown id
- `consent` must be literally `true`
- `honeypot` must be an empty string
- `contactTime` is optional and defaults to `'any'`

**2. `src/content/content.test.ts` — the parity + legal guard. This is the highest-value test in the project.**
- every `ServiceId` in `services.meta.ts` resolves in **both** `de` and `ar`
- every service in both locales has non-empty `title`, `teaser`, `intro` and at least one `block` with at least one item
- all `slug` values are unique and match `/^[a-z0-9-]+$/`
- **every service in `['behoerden', 'finanzen', 'immobilien']` has a non-empty `legalNote` in BOTH locales** — a mechanical enforcement of the RDG/StBerG/§34d GewO hedging requirement from brief §2. If someone deletes the disclaimer during a copy edit, the build fails.
- no service copy contains a banned absolute claim. A literal deny-list: `/\bgarantiert\b|\bRechtsberatung\b|\bwir beraten Sie rechtlich\b|\bSteuerberatung\b|100 ?%/i` for German, `/\bنضمن\b|\bاستشارة قانونية\b|\bضمان\b/` for Arabic.

That last assertion is worth calling out to the client: **it converts a legal-exposure requirement into a build gate.** It costs ~20 lines and it is the single cheapest risk mitigation in this plan.

**3. `src/lib/locale.test.ts` — 6 assertions.**
`swapLocalePath` correctness: `/de` → `/ar`; `/de/leistungen/x` → `/ar/leistungen/x`; `/de/kontakt#form` preserves the hash; an un-prefixed path gets prefixed; `/` → `/ar`; a path containing the literal string `de` elsewhere (`/de/leistungen/dokumente`) is not corrupted.

**Replacing the tests we are not writing:** a `HANDOFF.md` QA checklist — 18 manual checks run once on `/de` and once on `/ar` (mobile nav opens/traps focus/closes on ESC, form error announcement, phone number renders LTR inside Arabic paragraphs, hero split mirrors, FAB sits bottom-inline-end, skip link is first tab stop, all four Lighthouse scores, 320 px viewport has no horizontal scroll). Manual, documented, repeatable, and the honest use of the remaining budget.

---

## 9. The "split app concept" question

The phrase is genuinely ambiguous. **Both readings are good ideas, they are orthogonal, and both are cheap. Do both.**

### Reading (a) — split-screen as the signature visual motif

**Adopt it, but as an *asymmetric* system rather than a 50/50 gimmick.** A hard 50/50 split reads as a template; deliberately off-balance ratios read as design. The reference site already does this instinctively (`1.03fr .97fr` hero, `.8fr 1.2fr` contact, `.82fr 1.18fr` detail) — we formalise it into one primitive.

```tsx
<SplitSection
  ratio="1.03:0.97"
  leadWith="content"      // copy is first in DOM → correct reading order for screen readers
  stackOrder="media"      // below 980px the image goes on top (matches the reference's order:-1)
  align="center"
  content={<HeroCopy … />}
  media={<MediaFrame edgeFade="cream" priority … />}
/>
```

Used by **Hero**, both **PillarCards**, **CleaningPanel**, **ContactSection**, **ServiceDetail**, and **InfoStrip** — six sections, one primitive, one set of responsive rules to get right.

Three reasons this is the right call *architecturally*, not just visually:

1. **It mirrors for free.** CSS Grid column order follows `dir`, so the entire split motif inverts under Arabic with zero extra code. A split built with `float`, absolute positioning, or `flex-direction: row-reverse` would need per-section RTL patches. The visual concept and the RTL requirement are aligned rather than in tension — which is exactly why it is worth committing to.
2. **It collapses the component count.** Six bespoke section layouts become six *compositions*. At $700 that is real time.
3. **It gives the site an identity distinct from the reference.** The reference *has* splits; it does not have a *system* of them. Making the ratio a design token (`1:1` → `0.8:1.2`) and varying it deliberately down the page — tight at the hero, wide at contact — creates rhythm that a cloned layout cannot.

**One caveat to hand the designer:** `leadWith` (DOM order) and the visual column order must be reasoned about separately from `stackOrder` (mobile). Always put the **copy first in the DOM** so the screen-reader and no-CSS reading order is text-then-image, and let CSS place the media wherever the design wants. `SplitSection` enforces this by taking `content` and `media` as named slots rather than `children`.

### Reading (b) — split UI/API architecture

**Adopt it. This is the actual deliverable structure**, given the brief's "hand it to a separate backend developer" requirement. The seam is exactly **three files**, and the backend developer touches at most one of them.

```ts
// src/lib/contact-schema.ts  ── shared by BOTH sides. The single source of truth.
import { z } from 'zod';

export const CONTACT_SERVICE_IDS = [
  'behoerden','ehe-dokumente','studium-visa','finanzen','immobilien','reinigung','sonstiges',
] as const;
export const CONTACT_TIMES = ['any','morning','afternoon','evening'] as const;

export const contactFormSchema = z.object({
  name:        z.string().trim().min(2).max(80),
  email:       z.string().trim().email().max(120),
  phone:       z.string().trim().regex(/^[+0][\d\s()/-]{6,24}$/),
  serviceId:   z.enum(CONTACT_SERVICE_IDS),
  message:     z.string().trim().min(20).max(2000),
  contactTime: z.enum(CONTACT_TIMES).default('any'),
  consent:     z.literal(true),                 // DSGVO Art. 6(1)(a)
  honeypot:    z.literal('').optional(),        // bots fill it; humans cannot see it
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Exactly what the frontend POSTs. */
export interface ContactRequest extends ContactFormValues {
  locale: 'de' | 'ar';          // so the backend can send the reply/auto-ack in the right language
  pageUrl: string;              // which page converted
  submittedAt: string;          // ISO 8601 — a <3s delta from render is almost certainly a bot
}

/** Exactly what the frontend expects back. Nothing else is handled. */
export type ContactResponse =
  | { ok: true; id?: string }
  | { ok: false; error: 'validation' | 'rate_limit' | 'server';
      fields?: Partial<Record<keyof ContactFormValues, string>> };
```

```ts
// src/lib/submit-contact.ts  ── the ONE network call in the entire codebase.
export async function submitContact(payload: ContactRequest): Promise<ContactResponse> {
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '/api/contact';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.status === 429) return { ok: false, error: 'rate_limit' };
  if (!res.ok && res.status >= 500) return { ok: false, error: 'server' };
  return (await res.json()) as ContactResponse;
}
```

```ts
// src/app/api/contact/route.ts  ── the ONLY file the backend developer must write.
export async function POST(req: Request) {
  const parsed = contactFormSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ ok: false, error: 'validation' } satisfies ContactResponse, { status: 400 });
  }
  // ────────────────────────────────────────────────────────────────
  // BACKEND DEVELOPER: implement email delivery here.
  //   Recipient:  process.env.CONTACT_RECIPIENT_EMAIL
  //   Suggested:  Resend / Postmark / Brevo / SMTP via Nodemailer
  //   Also add:   rate limiting (429), and optionally Cloudflare Turnstile
  //   Return:     { ok: true } on success · { ok: false, error: 'server' } + 500 on failure
  //   Do NOT change the response shape — the UI only handles ContactResponse.
  // ────────────────────────────────────────────────────────────────
  return Response.json({ ok: false, error: 'server' } satisfies ContactResponse, { status: 501 });
}
```

The split is complete and enforced by the type system:

- The UI knows **one** endpoint URL, **one** payload shape, **one** response union. It renders four states (`idle`, `submitting`, `success`, `error`) and nothing else.
- The backend developer has **two** integration options and both are one step: (1) fill in `route.ts` and set `CONTACT_RECIPIENT_EMAIL`, or (2) set `NEXT_PUBLIC_CONTACT_ENDPOINT` to his own service and delete `route.ts` entirely. Either way he imports `contactFormSchema` and cannot drift from the frontend's validation.
- `.env.example` documents every variable: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_ENDPOINT`, `NEXT_PUBLIC_WHATSAPP_E164`, `CONTACT_RECIPIENT_EMAIL`.
- The UI ships with the form **fully functional against a mock** (a `?mock=1` query param short-circuits `submitContact` to a delayed success) so the client can review all four states before any backend exists.

### Recommendation to give the developer

> "Both — and they don't conflict. Use the asymmetric split as the site's visual signature (it also happens to be the layout technique that mirrors correctly into Arabic for free), and use the UI/API split as the delivery structure: one zod schema, one `fetch`, one stub route handler. The backend developer touches exactly one file."

---

## Architecture scope boundary

**IN** (covered by this architecture): 20 static bilingual pages, full RTL, sticky header + working mobile nav, 6 service detail pages, contact form UI with validation and all four states, Impressum/Datenschutz page shells, sitemap/robots/hreflang/JSON-LD, WhatsApp FAB, a11y-corrected token system, performance budget, the backend seam and `HANDOFF.md`.

**OUT / paid extra** (name these to the client now, not later): CMS or any client-editable content, blog, actual email sending, captcha/Turnstile, analytics integration and cookie-consent UI, a third locale, custom illustration or photography, stock image licensing, translation of copy (we lay out what the client supplies), Impressum/Datenschutz *legal drafting* (we build the pages — the text must come from the client or their lawyer), and ongoing maintenance.

## OPEN QUESTIONS (client/developer must answer — do not proceed past design without these)

1. **NAP data** — legal company name, full address, phone, WhatsApp number, **destination email**, opening hours, Handelsregister/USt-IdNr. **Blocks** `src/content/shared/nap.ts`, the Impressum (legally mandatory, §5 DDG), the footer, the info strip, and the `LocalBusiness` JSON-LD. This is the #1 blocker.
2. **Photography** — real photos or stock? **Changes the visual design**, not just the assets.
3. **Logo source files** — SVG with transparent background; and is there an Arabic-locale lockup variant?
4. **Hosting/domain ownership**, and whether $700 includes deployment.
5. **Third locale (EN/TR) ever coming?** Answer changes the i18n decision (§5.1) and is expensive to retrofit.
6. **Analytics?** If yes → cookie-consent banner obligation → affects CLS, LCP and the design. Recommend Plausible over GA4.
7. **WhatsApp click-to-chat in addition to email?** The reference has it, this audience expects it, and it is nearly free to add — but it is a client decision, not ours.
8. **Who writes the Impressum and Datenschutzerklärung text?** We build the pages; the legal text must come from the client. Given the RDG/StBerG/§34d GewO exposure flagged in the brief, this should be reviewed by a German lawyer — not drafted by us.