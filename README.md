# Zukunft Service — Website

Bilingual (German / Arabic) marketing website for **Zukunft Service**, a service agency in
Dortmund that supports mostly Arabic-speaking residents with German bureaucracy —
naturalisation, documents, marriage and translation, study and visas, finance and real
estate — plus a commercial cleaning arm.

**This repository is the UI only.** It is handed to a backend developer who implements one
thing: sending the contact-form submission as an email. See [`HANDOFF.md`](./HANDOFF.md).

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), every route prerendered |
| UI | React 19, TypeScript 5+ (`strict`, `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Fonts | IBM Plex Sans / Serif / Sans Arabic, self-hosted via `next/font` |

No UI kit, no animation library, no i18n library, no state library — see
[`docs/PLAN.md`](./docs/PLAN.md) §8 for why each was rejected.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000  → redirects to /de
```

The contact form works out of the box against a **mock transport** — no backend required.
Use these email addresses to exercise each UI state:

| Email | Result |
|---|---|
| `ok@test.de` | success |
| `422@test.de` | server-side validation failure |
| `429@test.de` | rate limited, with countdown |
| `500@test.de` | server error |
| `offline@test.de` | network failure |
| `slow@test.de` | trips the client timeout |

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build (all routes prerendered)
npm run typecheck  # tsc --noEmit
npm run lint:rtl   # fails on physical-direction CSS classes (see below)
npm run verify     # typecheck + lint:rtl + build — run before handoff
```

## Routes

Both locales are always prefixed. `/` 307-redirects to `/de`.

```
/de/                                    /ar/
/de/leistungen/[slug]                   /ar/leistungen/[slug]     (6 services each)
/de/kontakt/                            /ar/kontakt/
/de/impressum/                          /ar/impressum/
/de/datenschutz/                        /ar/datenschutz/
```

## Working on this codebase — three rules that are not style preferences

**1. Logical properties only.** `pl-` `pr-` `ml-` `mr-` `left-` `right-` `text-left`
`text-right` are **banned**. Use `ps-` `pe-` `ms-` `me-` `start-` `end-` `text-start`.
`npm run lint:rtl` fails the build on violations. This is what makes the Arabic layout
mirror for free instead of needing a parallel stylesheet.

**2. Wrap Latin runs inside Arabic text in `<bdi dir="ltr">`.** Phone numbers, emails,
`+49`, the brand name. Without it `+49 177 3825632` renders as `3825632 177 49+` and the
user cannot dial it.

**3. Gold `#c48a16` is a fill colour, never text.** It is 2.96:1 on the page background and
fails WCAG. Gold text is `#8a6013` on light, `#e3bd52` on dark green. Focus rings are
`#a97612`.

## Documentation

| File | What it is |
|---|---|
| [`docs/PLAN.md`](./docs/PLAN.md) | The agreed plan — decisions, scope, design system, contract, risks |
| [`docs/research/`](./docs/research/) | Six specialist reports with the full underlying detail |
| [`HANDOFF.md`](./HANDOFF.md) | For the backend developer: the contract and the one function to change |

## Status

**Milestone 1 complete — the UI is done and the production build is green.**

Both locales render every route: home, services index, six service detail pages,
contact, Impressum and Datenschutz. `next build` prerenders 24 static pages.

Verification currently passing:

```
npx tsc --noEmit                    clean
node scripts/check-logical-props.mjs   41 files clean
npm run build                       24/24 static pages
```

### What the backend developer needs to do

Exactly one file: [`src/lib/contact-transport.ts`](./src/lib/contact-transport.ts).
It documents the request and response contract inline. Set
`NEXT_PUBLIC_CONTACT_TRANSPORT=http` and `NEXT_PUBLIC_CONTACT_ENDPOINT`, and the
form goes live. See [`HANDOFF.md`](./HANDOFF.md).

### Outstanding client data before launch

| Item | Blocks | Where it goes |
|---|---|---|
| Legal name incl. legal form | Impressum (§ 5 DDG) | `src/content/shared/nap.ts` |
| Managing director / owner | Impressum (§ 5 DDG) | `src/content/shared/nap.ts` |
| Register court + number, USt-IdNr. | Impressum, if applicable | `src/content/shared/nap.ts` |
| Arabic sign-off by a named person | Launch | `src/content/ar/services.ts` |
| Photography and logo source | Hero and cards | `public/` |

All six services now carry the client's full PDF content in both locales:
intros, sub-blocks, item lists and closings. The German is the client's own
verbatim wording. The Arabic follows their Arabic PDF's structure, which is
genuinely different from the German (no post-arrival block, finance as one flat
list), and every Arabic service is marked `draft-needs-client-approval` -
`unapprovedServices('ar')` reports them, so a release check can block on it.

The Impressum renders unknown fields as visible `«…»` placeholders by design, and
`hasUnresolvedPlaceholders()` exists so a release check can fail on them.

**Note for the client:** the confirmed opening hours (Mo–Fr 10:00–16:00) differ
from the hours their current live draft publishes (Thu 10–15, Fri 10–13). This
site uses the confirmed hours. Google surfaces these directly in search and Maps,
so the other site should be corrected.
