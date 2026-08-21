# Handoff — for the backend developer

The UI is complete. Everything you need to change lives in **one file**:
[`src/lib/contact-transport.ts`](./src/lib/contact-transport.ts).

Nothing else in the app knows how a message is sent, so you can implement the
backend without touching a single component.

---

## 1. Go live in two environment variables

```bash
NEXT_PUBLIC_CONTACT_TRANSPORT=http
NEXT_PUBLIC_CONTACT_ENDPOINT=https://api.example.com/contact
```

While `NEXT_PUBLIC_CONTACT_TRANSPORT` is `mock` (the default), the form simulates
a successful send after 700 ms and logs the payload in development. That is what
makes the UI demonstrable to the client before any backend exists.

---

## 2. What you receive

`POST <NEXT_PUBLIC_CONTACT_ENDPOINT>` · `Content-Type: application/json`

| Field | Type | Notes |
|---|---|---|
| `service` | enum | `authorities`, `marriage-translation`, `study-visa`, `finance`, `real-estate`, `cleaning`, `other` |
| `message` | string | 10–4000 chars, already trimmed |
| `name` | string | >= 2 chars |
| `email` | string | syntactically valid |
| `phone` | string | may be `""`; required only when `whatsappOptIn` is true |
| `whatsappOptIn` | boolean | user consents to a WhatsApp reply |
| `preferredTime` | enum | `morning`, `afternoon`, `any` |
| `locale` | enum | `de` or `ar` — **reply in this language** |
| `company` | string | **honeypot**, must be `""` |
| `elapsedMs` | number | ms the form was open |

Example:

```json
{
  "service": "cleaning",
  "message": "Wir brauchen eine Buroreinigung, zweimal pro Woche.",
  "name": "Max Muster",
  "email": "max@example.de",
  "phone": "",
  "whatsappOptIn": false,
  "preferredTime": "any",
  "locale": "de",
  "company": "",
  "elapsedMs": 18420
}
```

## 3. What you must return

| Status | Body | UI result |
|---|---|---|
| `200` | `{"status":"ok"}` | success panel, form resets |
| `422` | `{"status":"validation","fieldErrors":{"email":"..."}}` | field-level errors |
| anything else | — | error panel offering WhatsApp and email |

---

## 4. Non-negotiables

**Re-validate every field server-side.** The client-side zod schema is a
convenience for the user, never a security control. Treat the endpoint as fully
public.

**Reply-To, not From.** Send to `CONTACT_RECIPIENT_EMAIL` with the visitor's
address in `Reply-To`. Putting it in `From` breaks SPF/DKIM and the mail lands in
spam — which silently loses the client every enquiry.

**Re-check the two spam signals.** `company` must be empty and `elapsedMs` should
be >= 3000. Both are advisory hints from the client and trivially forged.

**Rate-limit by IP.**

**DSGVO.** The enquiry is Art. 6(1)(b)/(f) processing, lawful without consent, but
it still needs a defined retention period. The privacy page already states that
data is kept only as long as needed to handle the enquiry — make that true.

---

## 5. Things worth knowing about the frontend

- **No cookies, no tracking, no analytics.** The site sets nothing that would
  require a § 25 TDDDG consent banner. Adding any analytics changes that, and the
  Datenschutz page then needs updating.
- **Fonts are self-hosted** through `next/font`. Do not switch to a Google Fonts
  `<link>` — that transmits visitor IPs to Google and is the exposure behind
  *LG München I, 3 O 17493/20*.
- **No embedded map.** Google Maps is a link, not an iframe, for the same reason.
- **Every page is static.** `next build` prerenders 24 pages; there is no server
  rendering at request time except the locale redirect in `src/proxy.ts`.
