# Zukunft Service — Website

Bilingual German/Arabic marketing site for Zukunft Service, a Büroservice and
Reinigungsservice in Dortmund.

> **Downloaded this as a ZIP?** You have everything you need. Go to
> [Setup](#setup) — it is three commands.
>
> **Are you an AI assistant reading this?** Read this whole file before running
> anything. The [Rules that are not style preferences](#rules-that-are-not-style-preferences)
> section describes constraints that look like formatting choices and are not;
> breaking them causes legal or accessibility failures, not ugly pages.

---

## What this is

A **UI-only** site. It renders, it validates a contact form, and it stops there.

There is no database, no authentication, no session, no server-side data access,
and no email sending. Every page is prerendered static HTML. The one place the
app talks to a server is a single file, [`src/lib/contact-transport.ts`](./src/lib/contact-transport.ts),
which currently runs against a mock.

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 (no config file — theme lives in CSS) |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Pages | 26 prerendered static pages |
| Languages | German (`/de`) and Arabic (`/ar`, full RTL) |

---

## What you need to install

Two things. That is the whole list.

| Tool | Minimum | Get it |
|---|---|---|
| **Node.js** | 20.9 or newer — 22 LTS recommended | <https://nodejs.org> |
| **npm** | 10 or newer | ships with Node, nothing to install |

No database. No Docker. No Redis. No global npm packages. No accounts.

Check what you have:

```bash
node -v    # must print v20.9.0 or higher
npm -v     # must print 10.x or higher
```

If `node -v` prints nothing or an older version, install the LTS build from
nodejs.org and reopen your terminal.

---

## Setup

From the folder you unzipped:

```bash
npm ci
```

Use `npm ci`, not `npm install`. `ci` installs the exact versions recorded in
`package-lock.json`, so you get the same tree this was built and tested against.
It takes a minute or two the first time.

Then create your local environment file:

```bash
cp .env.example .env.local          # macOS / Linux
copy .env.example .env.local        # Windows CMD
Copy-Item .env.example .env.local   # Windows PowerShell
```

The defaults in `.env.example` work as-is. You do not have to edit anything to
run the site.

Start it:

```bash
npm run dev
```

Open **<http://localhost:3000>**. It redirects to `/de`. Switch to Arabic with
the globe button in the header, or go straight to <http://localhost:3000/ar>.

---

## What is deliberately missing from the ZIP

These are generated, never committed, and appear as soon as you run the commands
above. Their absence is correct:

| Missing | Created by | What it is |
|---|---|---|
| `node_modules/` | `npm ci` | dependencies |
| `.next/` | `npm run dev` or `npm run build` | build output |
| `.env.local` | you, from `.env.example` | your local config |
| `next-env.d.ts` | `next dev` | generated types |

A ZIP also has no git history. If you plan to work on this, prefer cloning the
repository over unzipping, so you can branch and pull updates.

---

## Verify your setup is correct

```bash
npm run verify
```

That runs three gates in sequence and takes about a minute:

1. `tsc --noEmit` — type checking
2. `node scripts/check-logical-props.mjs` — the RTL lint (see below)
3. `next build` — production build

A correct setup ends with **26 static pages generated** and no errors. If all
three pass, your environment is good and anything that breaks later is your
change, not your setup.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | dev server with hot reload on :3000 |
| `npm run build` | production build, prerenders all 26 pages |
| `npm start` | serve the production build (run `build` first) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint:rtl` | fails on physical CSS properties — see RTL rule below |
| `npm run verify` | all three gates; run before every commit |

---

## Where things live

```
src/
  app/[locale]/          routes. The root layout lives HERE, not at app/,
                         so <html lang dir> is server-rendered per language
    page.tsx             home
    leistungen/          services index + [slug] detail pages
    kontakt/             contact page + form
    impressum/           § 5 DDG imprint
    datenschutz/         DSGVO privacy notice
  components/
    layout/              Header, Footer, LanguageSwitcher, WhatsAppFab
    sections/            the eight home-page sections
    form/                ContactForm, Field
    ui/                  Button, Icon, SectionHeading, Reveal
    seo/                 LocalBusiness JSON-LD
  content/
    de/  ar/             all copy, per language, as typed TS
    shared/nap.ts        name / address / phone — ONE source of truth
    legal.ts             imprint + privacy strings
  lib/
    contact-transport.ts THE BACKEND SEAM — read HANDOFF.md
    locale.ts            swapLocalePath, the language-switch logic
    site-url.ts          safe origin resolution
  proxy.ts               redirects / to /de
```

**All text is in `src/content/`.** No copy is hard-coded in a component. To
change wording, edit the content file, not the JSX.

---

## Environment variables

Everything prefixed `NEXT_PUBLIC_` is compiled into the browser bundle and is
therefore **public**. Never put a secret behind that prefix.

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://zukunftservice.de` | canonical URLs, sitemap, Open Graph |
| `NEXT_PUBLIC_CONTACT_TRANSPORT` | `mock` | `mock` or `http` |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | empty | where the form POSTs when transport is `http` |
| `CONTACT_RECIPIENT_EMAIL` | — | server-side only; the inbox enquiries go to |

Phone, email and postal address are **not** environment variables. They live in
[`src/content/shared/nap.ts`](./src/content/shared/nap.ts), because the footer,
contact page, WhatsApp button and JSON-LD all render from that one object.
Splitting them across env is how a business ends up with two different phone
numbers on one website.

---

## For the backend developer

You change **one file**: [`src/lib/contact-transport.ts`](./src/lib/contact-transport.ts).

Read **[HANDOFF.md](./HANDOFF.md)** — it documents the request and response
contract, a worked JSON example, and four non-negotiables (re-validate server
side, use `Reply-To` not `From`, re-check the spam signals, rate-limit).

Until then the form runs on a mock: it reports success after 700 ms and logs the
payload in development, so the UI is fully demonstrable with no backend at all.

---

## Rules that are not style preferences

Three constraints look cosmetic and are not. `npm run verify` enforces the first
one automatically.

**1. Never use physical CSS directions.** Use `ms-`/`me-`, `ps-`/`pe-`,
`start-`/`end-`, `text-start`/`text-end`. Never `ml-`, `pr-`, `left-`, `right-`,
`text-left`. The Arabic site is RTL; a physical direction silently mirrors wrong
and `npm run lint:rtl` will fail the build. This already caught a bug where an
off-screen honeypot at `-left-[9999px]` gave the Arabic pages a horizontal
scrollbar.

**2. Gold `#c48a16` is a fill, never text.** It measures 2.96:1 on the page
background and fails WCAG AA outright. Gold text resolves to `#8a6013` on light
(`text-accent-text`) and `#e3bd52` on dark. Use the tokens; the palette has no
token that lets you set `#c48a16` as a text colour.

**3. The hedging in the copy is load-bearing.** Four of the six services
describe regulated activity — insurance brokerage needs § 34d GewO licensing,
property and loan brokerage § 34c/§ 34i, and debt counselling is regulated under
the RDG. The copy says *vorbereiten, zusammenstellen, organisieren, vermitteln
an*. It must never say *wir beraten*, never promise an outcome, and never claim
to broker anything. Do not "tighten" that wording into a benefit promise.

---

## Troubleshooting

**`TypeError: Invalid URL` when deploying**
Your host has `NEXT_PUBLIC_SITE_URL` defined but empty. Fixed in
`src/lib/site-url.ts` — an empty or malformed value now falls back instead of
crashing the build. If you see this, you are on an old build; pull latest.

**`npm ci` fails with `EBADENGINE` or a lockfile error**
Your Node is older than 20.9. Check `node -v` and install the LTS from
nodejs.org.

**Port 3000 already in use**
`npm run dev -- -p 3001`, then open <http://localhost:3001>.

**Arabic page renders left-to-right**
Confirm the URL starts with `/ar`. Direction comes from the `[locale]` segment
and is server-rendered; there is no client-side toggle. If it is still wrong,
some component used a physical direction — run `npm run lint:rtl`.

**Changed copy but nothing updated**
You edited a component. All text lives in `src/content/`.

---

## Status

**The UI is complete.** `npm run verify` passes: types clean, RTL lint clean,
build green with 26 static pages, and all 25 routes serve correctly from the
production build.

All six services carry the client's full PDF content in both languages. The
German is the client's own verbatim wording. The Arabic follows their Arabic
PDF's structure, which genuinely differs from the German, and every Arabic
service is marked `draft-needs-client-approval` — `unapprovedServices('ar')`
reports them so a release check can block on it.

### Still needed from the client before public launch

| Item | Blocks | Goes in |
|---|---|---|
| Legal name incl. legal form | Impressum (§ 5 DDG) | `src/content/shared/nap.ts` |
| Managing director / owner | Impressum (§ 5 DDG) | `src/content/shared/nap.ts` |
| Register court + number, USt-IdNr. | Impressum, if applicable | `src/content/shared/nap.ts` |
| Arabic sign-off by a named person | launch | `src/content/ar/services.ts` |
| Photography and logo source files | hero and cards | `public/` |

**Do not deploy this to a public URL yet.** The Impressum renders `«…»`
placeholders for the fields above. Those are mandatory under § 5 DDG, and a
defective Impressum on a live German commercial site is actionable under
§ 3a UWG. For a preview, use your host's password protection — on Vercel that is
Settings → Deployment Protection.

**Note for the client:** the confirmed opening hours (Mo–Fr 10:00–16:00) differ
from the hours their current live draft publishes (Thu 10–15, Fri 10–13). This
site uses the confirmed hours. Google surfaces these directly in Search and
Maps, so the other site should be corrected.

---

## Documentation

| File | What it covers |
|---|---|
| [HANDOFF.md](./HANDOFF.md) | backend contract — the one file to change |
| [docs/PLAN.md](./docs/PLAN.md) | the full plan and decision record |
| [docs/research/](./docs/research/) | six specialist reports with the underlying detail |
