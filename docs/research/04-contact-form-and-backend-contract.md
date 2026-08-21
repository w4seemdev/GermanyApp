# CONTACT FORM & BACKEND HANDOFF — DESIGN SPEC
### Zukunft Service · UI-only build · the single functional requirement

---

## 0. Position statement (read first)

The entire $700 buys a brochure site with **one** moving part. That part is this form. My budget allocation for this workstream is **~6 of ~35 billable hours** — roughly $120 of the $700 — and it is the highest-leverage $120 in the project, because everything else can be visually judged by the client but this is the only thing that can be *broken*.

Two architectural commitments that everything below depends on:

1. **`submitContactForm()` never throws.** Every failure is a value in a discriminated union. This makes the UI state machine total — there is no `catch` block anywhere in a component, and no unhandled state.
2. **The backend developer changes zero frontend files in the happy path.** He sets one environment variable and implements a documented HTTP contract. If his API shape differs from the contract, he edits exactly one ~40-line function (`parseApiResponse` in `http.ts`). That is the seam.

Everything in this document is scoped to survive "is this worth it at $700?" Where I spend, I say why. Where I refuse to spend, I say that too.

---

## 1. FIELD DESIGN

### 1.1 The field set, in order

| # | Field | Type | Required | `autocomplete` | Justification |
|---|---|---|---|---|---|
| 1 | `name` | `text` | **yes** | `name` | Cannot write a human reply without it. Single field, not first/last — splitting adds a field and Arabic naming conventions don't map cleanly to given/family. |
| 2 | `email` | `email` | **yes** | `email` | This is the `Reply-To`. The client's *entire stated requirement* is "an email reaches him" — an email he cannot reply to is a half-delivered feature. |
| 3 | `phone` | `tel` | conditional | `tel` | Optional by default; **becomes required if `whatsappOptIn` is checked.** This audience answers phones, not inboxes. Conditional-required costs one `superRefine` and zero conversion. |
| 4 | `whatsappOptIn` | `checkbox` | no | — | One tap. Tells the owner which channel to use, which is the difference between a lead answered in 10 minutes and one answered in 3 days. |
| 5 | `serviceCategory` | `select` | **yes** | `off` | Routing + triage. Also does silent SEO/analytics work: the client learns which of his six arms actually generates demand. |
| 6 | `message` | `textarea` | **yes** | `off` | The lead. Min 10 chars stops "hi" submissions. |
| 7 | `preferredContactTime` | `select` | no | `off` | Pre-filled with "Egal" → **zero friction**, non-zero value. A user who never touches it costs nothing. |
| 8 | `privacyConsent` | `checkbox` | **yes** | `off` | DSGVO. Non-negotiable. §2. |
| — | `website` | hidden honeypot | — | `off` | §5 |

**Eight controls, six of which need thought, two of which are single taps.** That is the floor given the legal requirement (consent) and the client's business model (six unrelated service arms that need routing).

### 1.2 Fields I deliberately REFUSED, and why

- **Subject line.** The category select already does this, better and machine-readably.
- **Company name.** Only relevant for the cleaning arm; the message field covers it. Adding a field that's irrelevant to 5 of 6 categories is a tax on the other 5.
- **Address / postcode.** Not needed to reply. DSGVO data minimisation (Art. 5(1)(c)) actively argues against it. If the client wants it for cleaning quotes → paid change request, and it should be conditional on `serviceCategory === 'reinigung'`.
- **File upload.** Hard **no** at $700. It requires virus scanning, size limits, storage, a retention policy, and it invites users to upload passport scans — Art. 9 special-category data — into an unencrypted email. Instead, microcopy under the message field explicitly tells them not to (§1.3, field 6 hint).
- **"How did you hear about us?"** Analytics dressed as a field. Costs conversion, produces garbage data.
- **Preferred reply language.** Derived free from the active locale. Shipping it as `locale` in the payload costs zero pixels and tells the owner whether to reply in German or Arabic — one of the highest value-per-byte items in the whole payload.

### 1.3 Exact bilingual copy

**Form heading & intro** (matches the client's own final CTA copy, hedging preserved)

| | DE | AR |
|---|---|---|
| Eyebrow | `KONTAKT` | `تواصل معنا` |
| H2 | `Sie haben ein Anliegen und wissen nicht, wo Sie anfangen sollen?` | `لديك معاملة ولا تعرف من أين تبدأ؟` |
| Lead | `Schildern Sie uns kurz Ihre Situation. Wir prüfen gemeinsam, welche Unterstützung für Ihr Anliegen passend ist.` | `تواصل معنا واشرح لنا موضوعك باختصار. سنساعدك في معرفة الخطوات المناسبة والخدمات التي تحتاجها.` |
| Required legend | `Mit * markierte Felder sind Pflichtfelder.` | `الحقول المعلَّمة بـ * إلزامية.` |

**1 · Name** *(required)*

| | DE | AR |
|---|---|---|
| Label | `Name *` | `الاسم *` |
| Placeholder | `Vor- und Nachname` | `الاسم الأول واسم العائلة` |
| Hint | — | — |

`type="text"` · `autocomplete="name"` · `enterkeyhint="next"` · `maxlength="80"`

**2 · E-Mail** *(required)*

| | DE | AR |
|---|---|---|
| Label | `E-Mail-Adresse *` | `البريد الإلكتروني *` |
| Placeholder | `name@beispiel.de` | `name@example.com` |
| Hint | `Hierhin senden wir unsere Antwort.` | `سنرسل ردنا إلى هذا العنوان.` |

`type="email"` · `autocomplete="email"` · `inputmode="email"` · `spellcheck="false"` · `dir="ltr"` (see §4.14) · `maxlength="254"`

**3 · Telefon** *(optional → required with WhatsApp)*

| | DE | AR |
|---|---|---|
| Label (default) | `Telefon (optional)` | `رقم الهاتف (اختياري)` |
| Label (when WhatsApp checked) | `Telefon *` | `رقم الهاتف *` |
| Placeholder | `+49 170 1234567` | `+49 170 1234567` |
| Hint | `Am besten mit Ländervorwahl, z. B. +49 oder +963.` | `يُفضّل إدخال رمز الدولة، مثل ‎+49 أو ‎+963.` |

`type="tel"` · `autocomplete="tel"` · `inputmode="tel"` · `dir="ltr"` · `maxlength="32"`

The `+963`/`+964` hint is deliberate: this audience holds Syrian and Iraqi numbers and a form that implies "German numbers only" reads as exclusionary. The label swaps live when the WhatsApp box is ticked — no layout shift, because the `(optional)` suffix and the `*` occupy roughly equal width.

**4 · WhatsApp opt-in**

| | DE | AR |
|---|---|---|
| Checkbox label | `Bitte antworten Sie mir per WhatsApp.` | `يمكنكم الرد عليّ عبر واتساب.` |
| Hint (shown when checked) | `Dafür benötigen wir Ihre Telefonnummer. Es gelten die Datenschutzbestimmungen von WhatsApp.` | `لهذا نحتاج رقم هاتفك. تُطبَّق سياسة الخصوصية الخاصة بواتساب.` |

That second sentence is not decoration — WhatsApp is a Meta/US processor and the German market convention is to name it at the point of choice.

**5 · Anliegen / service category** *(required)*

| | DE | AR |
|---|---|---|
| Label | `Ihr Anliegen *` | `موضوع طلبك *` |
| Placeholder option | `Bitte wählen Sie ein Thema` | `اختر الموضوع` |

| value | DE option | AR option |
|---|---|---|
| `behoerden-dokumente` | `Einbürgerung, Behörden & Dokumente` | `الجنسية، المعاملات الرسمية والوثائق` |
| `ehe-uebersetzungen` | `Ehe, Übersetzungen & internationale Dokumente` | `الزواج، الترجمة وتصديق الوثائق` |
| `studium-visa` | `Studium, Universität & Visa` | `الدراسة، الجامعات والتأشيرات` |
| `finanzen-vorsorge` | `Finanzen, Kredite & Vorsorge` | `الأمور المالية، القروض والتأمين` |
| `immobilien-investitionen` | `Immobilien & Investitionen` | `العقارات والاستثمار` |
| `reinigung` | `Reinigungsservice` | `خدمات التنظيف` |
| `sonstiges` | `Sonstiges / Ich bin mir nicht sicher` | `موضوع آخر / لست متأكداً` |

**The 7th option is the most important one on the form.** The client's own closing CTA is literally *"Sie wissen nicht, wo Sie anfangen sollen?"* — a required select with no escape hatch would contradict the brand promise and force people to guess or bounce. It is also the option the owner should watch: high volume there means the six categories are badly named.

Deep-link behaviour: a service card's "Anfrage stellen" CTA scrolls to the form **and pre-selects that category** (`?anliegen=reinigung#kontakt`), announced via the polite live region: `Thema „Reinigungsservice" wurde vorausgewählt.`

**6 · Nachricht** *(required)*

| | DE | AR |
|---|---|---|
| Label | `Ihr Anliegen kurz beschrieben *` | `اشرح لنا موضوعك باختصار *` |
| Placeholder | `Zum Beispiel: welche Unterlagen Sie bereits haben und was Sie erreichen möchten.` | `مثلاً: ما هي الأوراق المتوفرة لديك وما الذي ترغب بالوصول إليه.` |
| Hint | `Bitte senden Sie hier keine sensiblen Daten wie Ausweis- oder Aktennummern, Gesundheits- oder Finanzdaten. Bei Bedarf melden wir uns und nennen Ihnen einen sicheren Weg.` | `يرجى عدم إرسال بيانات حساسة هنا مثل أرقام الهوية أو الملفات أو المعلومات الصحية أو المالية. عند الحاجة سنتواصل معك ونوضح لك طريقة آمنة.` |
| Counter | `{n} / 2.000 Zeichen` | `{n} / ٢٠٠٠ حرف` |

`rows="5"` · `maxlength="2000"` (hard cap in the DOM **and** in zod) · counter turns `--gold` at 1800 and `--error` at 2000.

That hint is a genuine DSGVO Art. 9 risk reducer for a business whose clientele will absolutely try to paste their Aufenthaltstitel number into a web form. It costs one line of copy.

**7 · Erreichbarkeit** *(optional, pre-filled)*

| | DE | AR |
|---|---|---|
| Label | `Wann erreichen wir Sie am besten?` | `ما هو أفضل وقت للتواصل معك؟` |

| value | DE | AR |
|---|---|---|
| `egal` *(default)* | `Egal / jederzeit` | `لا يهم / في أي وقت` |
| `vormittag` | `Vormittags (9–12 Uhr)` | `صباحاً (٩:٠٠–١٢:٠٠)` |
| `nachmittag` | `Nachmittags (12–17 Uhr)` | `بعد الظهر (١٢:٠٠–١٧:٠٠)` |
| `abend` | `Abends (17–20 Uhr)` | `مساءً (١٧:٠٠–٢٠:٠٠)` |

> **OPEN QUESTION — business hours.** These time windows are invented placeholders. The client must supply real Öffnungszeiten; they also feed the Info-Strip and the Impressum. Do not ship these values.

**8 · Consent** — see §2.

**Submit button**

| | DE | AR |
|---|---|---|
| Idle | `Anfrage senden` | `إرسال الطلب` |
| Submitting | `Wird gesendet …` | `جارٍ الإرسال …` |

**Legal-hedge notice, directly under the submit row** *(this is a copy requirement, not decoration — see the brief's RDG/StBerG constraint)*

| DE | AR |
|---|---|
| `Hinweis: Zukunft Service erbringt keine Rechts-, Steuer- oder Versicherungsberatung. Wir unterstützen Sie organisatorisch und vermitteln bei Bedarf an geeignete Partner und Fachstellen.` | `ملاحظة: لا تقدّم Zukunft Service استشارات قانونية أو ضريبية أو تأمينية. نحن ندعمك تنظيمياً وننسّق عند الحاجة مع شركاء وجهات مختصة مناسبة.` |

Placing this *at the point of submission* — not buried in a footer — is the strongest position for it, because it is the moment the user forms an expectation about what they are buying.

---

## 2. DSGVO / GDPR CONSENT

### 2.1 Mechanics — exact rules

1. **Never pre-checked.** `defaultValues.privacyConsent = false`. No `defaultChecked`, no `checked` prop. Consent must be an unambiguous affirmative act (Art. 4(11), Art. 7(2); *Planet49*, C-673/17).
2. **One checkbox, one purpose.** Do not bundle newsletter, terms, or WhatsApp consent into it. We have exactly one processing purpose (answering the enquiry), so exactly one box. The WhatsApp opt-in (§1.3 field 4) is a *channel preference*, not a second consent, and is worded as such.
3. **Submit is NOT disabled when unchecked.** A disabled button with no explanation is an accessibility failure and a conversion killer — the user cannot discover *why*. Instead: submit is always live, and an unchecked box produces a normal validation error with focus movement. This is a deliberate reversal of the common pattern and I will defend it.
4. **The link opens in a new tab.** `target="_blank" rel="noopener noreferrer"` plus a visually-hidden `(öffnet in neuem Tab)` / `(يُفتح في نافذة جديدة)`. Rationale: this is a SPA; a same-tab route to `/datenschutz` destroys the user's typed message. New tab is the accessible-with-warning option, and it is the correct trade here.
5. **Consent is versioned.** The payload carries `consentVersion: '2026-08-20'` (the publication date of the Datenschutzerklärung text) plus `meta.submittedAt`. Art. 7(1) requires the controller to be able to *demonstrate* consent — that means knowing **which text** was agreed to and **when**. Two string fields. Free.
6. **No cookie/localStorage for the draft.** We persist the in-progress form to **`sessionStorage`** (§4.16), which is strictly technically necessary for the requested function and dies with the tab. This avoids dragging the contact form into any cookie-banner conversation.
7. **Art. 13 information duty** is satisfied by a short static block under the form, not by the checkbox alone.

### 2.2 Consent checkbox copy — exact

**DE**
> `Ich habe die` **`Datenschutzerklärung`** `gelesen und willige ein, dass meine hier angegebenen Daten zur Bearbeitung meiner Anfrage gespeichert und verarbeitet werden. Diese Einwilligung kann ich jederzeit formlos per E-Mail widerrufen. *`

**AR**
> `لقد اطّلعت على` **`سياسة الخصوصية`** `وأوافق على تخزين ومعالجة البيانات التي أدخلتها هنا لغرض معالجة طلبي. يمكنني سحب هذه الموافقة في أي وقت عبر البريد الإلكتروني ودون أي شكليات. *`

### 2.3 Art. 13 information block (static, under the form)

**DE**
> `Verantwortlich für die Verarbeitung ist [Firma, Anschrift]. Wir verwenden Ihre Angaben ausschließlich, um Ihre Anfrage zu beantworten. Eine Weitergabe an Dritte erfolgt nur, wenn dies zur Bearbeitung Ihres Anliegens erforderlich ist und Sie zugestimmt haben. Ihre Daten werden nach Abschluss der Bearbeitung gelöscht, spätestens nach [X] Monaten. Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Beschwerde bei einer Aufsichtsbehörde. Rechtsgrundlage: Art. 6 Abs. 1 lit. a und b DSGVO.`

**AR**
> `الجهة المسؤولة عن المعالجة هي [اسم الشركة، العنوان]. نستخدم بياناتك حصراً للرد على طلبك. لا تتم مشاركتها مع أطراف ثالثة إلا إذا كان ذلك ضرورياً لمعالجة طلبك وبموافقتك. تُحذف بياناتك بعد الانتهاء من المعالجة، وبحد أقصى بعد [X] أشهر. لك الحق في الوصول إلى بياناتك وتصحيحها وحذفها وتقييد معالجتها ونقلها، وكذلك الحق في تقديم شكوى إلى الجهة الرقابية المختصة. الأساس القانوني: المادة ٦ فقرة ١ (أ) و(ب) من اللائحة العامة لحماية البيانات.`

### 2.4 Scope boundary — say this to the client explicitly

**Writing the Datenschutzerklärung and the Impressum is NOT in the $700.** We ship the two page shells, the routes, the footer links, and the placeholder structure. The legal text must come from the client's lawyer or a generator (eRecht24 / Dr. Schwenke, €0–€30). The Impressum is legally mandatory under §5 DDG and its absence is directly *abmahnfähig* — this is the single largest legal risk in the whole delivery and it is a content problem, not a code problem.

> **OPEN QUESTION — retention period.** `[X] Monate` must be a real number the client commits to (6 months is the common default for enquiries with no contract). It also determines what the backend dev must build if he stores submissions in a database rather than only emailing them.

---

## 3. VALIDATION

### 3.1 Stack — decided

```
react-hook-form   ^7.63.0
zod               ^4.1.0
@hookform/resolvers ^5.2.0
```

**Why react-hook-form and not a hand-rolled `useState` form:** at 8 fields with conditional requirement, focus management, per-field `aria-describedby` wiring, dirty-tracking for the draft, and server-error injection, hand-rolling is *more* code, not less, and worse. RHF is ~9 kB gzipped, uncontrolled by default (no re-render per keystroke — matters on cheap Android hardware, which is a real slice of this audience), and gives us `setError` for mapping server-side 422s back onto fields, which we need for the contract. This is the one dependency in the project that clearly pays for itself.

**Why zod and not yup/valibot:** zod's inferred output type *is* our `ContactFormPayload` shape, so the contract and the validation cannot drift. Valibot is smaller but the resolver ecosystem is thinner; at 8 fields the ~13 kB delta is not worth the risk. Yup has weaker TS inference.

> Fallback if the toolchain fights you: `zod@^3.25` + `@hookform/resolvers@^3.10` is API-identical below except `z.email()` → `z.string().email()`. Marked inline.

### 3.2 The schema — real code

```ts
// src/lib/contact/schema.ts
import { z } from 'zod';
import { SERVICE_CATEGORIES, CONTACT_TIMES } from './types';

export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,      // RFC 5321 max path length
  phoneMax: 32,
  phoneDigitsMin: 6,
  phoneDigitsMax: 15, // E.164 max
  messageMin: 10,
  messageMax: 2000,
} as const;

/**
 * Single-line fields must not contain CR/LF. This is not cosmetic:
 * a naive backend that interpolates `name` into a mail header is a
 * classic SMTP header-injection vector. We block it at the edge AND
 * require the backend to strip it again (see HANDOFF.md §Security).
 */
const SINGLE_LINE = /^[^\r\n]*$/;

/** Deliberately permissive. See §3.4 for why we do not use libphonenumber. */
const PHONE_SHAPE = /^[+0-9][0-9 ()./\-]{4,31}$/;

const digitsOf = (s: string) => s.replace(/\D/g, '');

/** Best-effort E.164. `raw` is always authoritative for a human reader. */
export function normalizePhone(raw: string): {
  raw: string;
  e164: string | null;
  assumedCountry: 'DE' | null;
} {
  const trimmed = raw.trim();
  const cleaned = trimmed.replace(/[\s().\-/]/g, '');
  if (cleaned.startsWith('+'))  return { raw: trimmed, e164: cleaned, assumedCountry: null };
  if (cleaned.startsWith('00')) return { raw: trimmed, e164: `+${cleaned.slice(2)}`, assumedCountry: null };
  // German national format. This IS a guess — a Syrian 09… would be mangled.
  // We therefore always ship `raw` alongside and label the guess in the email.
  if (cleaned.startsWith('0'))  return { raw: trimmed, e164: `+49${cleaned.slice(1)}`, assumedCountry: 'DE' };
  return { raw: trimmed, e164: null, assumedCountry: null };
}

/**
 * Messages are i18n KEYS, never literal strings.
 * Baking German into the schema means an Arabic user who switches
 * locale keeps seeing German errors. This is the whole reason.
 */
export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(LIMITS.nameMin, { message: 'name.tooShort' })
      .max(LIMITS.nameMax, { message: 'name.tooLong' })
      .regex(SINGLE_LINE, { message: 'name.invalidChars' }),

    // zod 3: z.string().trim().toLowerCase().email({ message: 'email.invalid' })
    email: z
      .email({ message: 'email.invalid' })
      .trim()
      .toLowerCase()
      .max(LIMITS.emailMax, { message: 'email.tooLong' }),

    phone: z
      .string()
      .trim()
      .max(LIMITS.phoneMax, { message: 'phone.tooLong' })
      .refine((v) => v === '' || PHONE_SHAPE.test(v), { message: 'phone.invalid' })
      .refine(
        (v) => {
          if (v === '') return true;
          const d = digitsOf(v).length;
          return d >= LIMITS.phoneDigitsMin && d <= LIMITS.phoneDigitsMax;
        },
        { message: 'phone.invalid' },
      ),

    whatsappOptIn: z.boolean(),

    serviceCategory: z.enum(SERVICE_CATEGORIES, { message: 'service.required' }),

    message: z
      .string()
      .trim()
      .min(LIMITS.messageMin, { message: 'message.tooShort' })
      .max(LIMITS.messageMax, { message: 'message.tooLong' }),

    preferredContactTime: z.enum(CONTACT_TIMES),

    // z.literal(true) produces a poor error path; refine is portable v3↔v4.
    privacyConsent: z
      .boolean()
      .refine((v) => v === true, { message: 'consent.required' }),
  })
  .superRefine((v, ctx) => {
    if (v.whatsappOptIn && v.phone.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'phone.requiredForWhatsapp',
      });
    }
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;
```

Note: the honeypot and the timing trap are **not** in the schema. They are not user data and must not be able to produce a user-visible field error. They live in the submit handler (§5).

### 3.3 Wiring it, with the typing gotcha spelled out

```ts
// zod transforms (.trim(), .toLowerCase()) mean input type ≠ output type.
// With @hookform/resolvers v5 you MUST pass three generics or TS lies to you.
const form = useForm<ContactFormInput, unknown, ContactFormValues>({
  resolver: zodResolver(contactFormSchema),
  mode: 'onTouched',
  reValidateMode: 'onChange',
  shouldFocusError: true,          // RHF default; keep it explicit, it is load-bearing
  defaultValues: {
    name: '', email: '', phone: '',
    whatsappOptIn: false,
    serviceCategory: '' as ServiceCategory | '',
    message: '',
    preferredContactTime: 'egal',
    privacyConsent: false,
    website: '',                   // honeypot
  },
});
```

And on the `<form>` element: **`noValidate`**. This is mandatory on a bilingual site. Without it, a browser set to English shows *"Please fill out this field"* in English on an Arabic page, in a tooltip we cannot style, positioned wrong in RTL. `noValidate` suppresses native constraint UI while keeping `type="email"` for the mobile keyboard.

### 3.4 German (and Syrian, and Iraqi) phone reality

Formats real users will type:

```
+49 170 1234567      0170 1234567       0049 170 1234567
+49 (0)170 1234567   030 12345678       030/1234-5678
+963 944 123 456     +964 770 123 4567  0963944123456
```

**Decision: no `libphonenumber-js`.** It costs 78–145 kB for the metadata on a *single optional field* of a brochure site. More importantly, strict parsing produces **false rejections**, and a false rejection on a phone field for an immigrant audience is a lost lead — strictly worse than accepting a slightly malformed number that a human will read out of an email anyway. Our rule is: **shape-permissive, digit-count-bounded (6–15), normalise best-effort, ship the raw string always.** The receiving human is the real validator.

**Decision: no `+49` enforcement.** The regex accepts any international prefix. Anything else would silently exclude the exact demographic the business serves.

### 3.5 Soft, non-blocking email-typo hint

The product's entire value is "the owner replies to this email". A typo'd address is total failure with a false success signal. 14 lines of code:

```ts
const TYPO_DOMAINS: Record<string, string> = {
  'gmial.com': 'gmail.com',  'gmai.com': 'gmail.com',   'gmail.co': 'gmail.com',
  'gnail.com': 'gmail.com',  'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com',
  'yahooo.com': 'yahoo.com', 'outlok.com': 'outlook.com',
  'gmx.de.com': 'gmx.de',    'web.de.com': 'web.de',
};

export function suggestEmail(email: string): string | null {
  const [local, domain] = email.toLowerCase().split('@');
  if (!local || !domain) return null;
  const fix = TYPO_DOMAINS[domain];
  return fix ? `${local}@${fix}` : null;
}
```

Rendered as a **hint, not an error** (`--gold` text, no `aria-invalid`), inside the field's `aria-describedby`, with a clickable "Ja, übernehmen" that calls `setValue('email', suggestion, { shouldValidate: true })`.

- DE: `Meinten Sie **{suggestion}**?` · button `Ja, übernehmen`
- AR: `هل تقصد **{suggestion}**؟` · button `نعم، استخدمه`

### 3.6 Validation timing — and why

| Trigger | Behaviour |
|---|---|
| Typing, field never blurred | **Silent.** No error. Never interrupt a user mid-thought. |
| Blur (first time) | Validate that field. `mode: 'onTouched'`. |
| Typing, field already in error | **Re-validate on every keystroke.** `reValidateMode: 'onChange'`. The error clears the instant it's fixed — this is the positive-feedback half of the loop and is what makes inline validation feel helpful rather than nagging. |
| Select / checkbox change | Validates immediately (change *is* the commit for these controls). |
| Submit | Full-schema validation, error summary, focus to summary. |
| After a server 422 | `setError` per field; those fields re-validate on change like any other. |

This is the GOV.UK / Baymard consensus pattern. The alternative — validating on every keystroke from the first character — reliably shows "email is invalid" to someone who has typed `w`, which trains users to ignore your error styling.

**Exception:** the character counter on `message` updates on every keystroke (it is feedback, not judgement) via a scoped `useWatch` so it does not re-render the whole form.

### 3.7 Error-message dictionary — DE + AR

| key | DE | AR |
|---|---|---|
| `name.tooShort` | `Bitte geben Sie Ihren Namen ein (mindestens 2 Zeichen).` | `يرجى إدخال اسمك (حرفان على الأقل).` |
| `name.tooLong` | `Der Name ist zu lang (maximal 80 Zeichen).` | `الاسم طويل جداً (٨٠ حرفاً كحد أقصى).` |
| `name.invalidChars` | `Bitte verwenden Sie keine Zeilenumbrüche.` | `يرجى عدم استخدام أسطر جديدة.` |
| `email.invalid` | `Diese E-Mail-Adresse scheint nicht zu stimmen. Beispiel: name@beispiel.de` | `يبدو أن البريد الإلكتروني غير صحيح. مثال: name@example.com` |
| `email.tooLong` | `Die E-Mail-Adresse ist zu lang.` | `عنوان البريد الإلكتروني طويل جداً.` |
| `phone.invalid` | `Bitte geben Sie eine gültige Telefonnummer ein, z. B. +49 170 1234567.` | `يرجى إدخال رقم هاتف صحيح، مثال: ‎+49 170 1234567` |
| `phone.tooLong` | `Die Telefonnummer ist zu lang.` | `رقم الهاتف طويل جداً.` |
| `phone.requiredForWhatsapp` | `Für eine Antwort per WhatsApp benötigen wir Ihre Telefonnummer.` | `لكي نرد عليك عبر واتساب نحتاج رقم هاتفك.` |
| `service.required` | `Bitte wählen Sie ein Thema aus.` | `يرجى اختيار الموضوع.` |
| `message.tooShort` | `Bitte beschreiben Sie Ihr Anliegen kurz (mindestens 10 Zeichen).` | `يرجى وصف طلبك باختصار (١٠ أحرف على الأقل).` |
| `message.tooLong` | `Ihre Nachricht ist zu lang (maximal 2.000 Zeichen).` | `رسالتك طويلة جداً (٢٠٠٠ حرف كحد أقصى).` |
| `consent.required` | `Bitte bestätigen Sie die Datenschutzerklärung, damit wir Ihre Anfrage bearbeiten dürfen.` | `يرجى الموافقة على سياسة الخصوصية حتى نتمكن من معالجة طلبك.` |
| `form.hasErrors.one` | `Bitte korrigieren Sie noch eine Angabe.` | `يرجى تصحيح حقل واحد.` |
| `form.hasErrors.other` | `Bitte korrigieren Sie noch {count} Angaben.` | `يرجى تصحيح {count} حقول.` |
| `error.network` | `Ihre Anfrage konnte nicht gesendet werden. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.` | `تعذّر إرسال طلبك. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.` |
| `error.offline` | `Sie sind offline. Ihre Angaben bleiben erhalten – bitte senden Sie erneut, sobald Sie wieder verbunden sind.` | `أنت غير متصل بالإنترنت. بياناتك محفوظة – أعد الإرسال عند عودة الاتصال.` |
| `error.timeout` | `Die Verbindung hat zu lange gedauert. Bitte versuchen Sie es erneut.` | `استغرق الاتصال وقتاً طويلاً. يرجى المحاولة مرة أخرى.` |
| `error.rateLimited` | `Sie haben gerade erst eine Anfrage gesendet. Bitte versuchen Sie es in {seconds} Sekunden erneut.` | `لقد أرسلت طلباً للتو. يرجى المحاولة مجدداً بعد {seconds} ثانية.` |
| `error.server` | `Es gab ein technisches Problem auf unserer Seite. Ihre Angaben sind noch da – bitte versuchen Sie es in wenigen Minuten erneut.` | `حدثت مشكلة تقنية لدينا. بياناتك ما زالت محفوظة – يرجى المحاولة بعد بضع دقائق.` |
| `error.validation` | `Einige Angaben konnten nicht verarbeitet werden. Bitte prüfen Sie die markierten Felder.` | `تعذّرت معالجة بعض البيانات. يرجى مراجعة الحقول المحددة.` |
| `error.rejected` | `Ihre Anfrage konnte nicht verarbeitet werden. Bitte kontaktieren Sie uns direkt per E-Mail oder WhatsApp.` | `تعذّرت معالجة طلبك. يرجى التواصل معنا مباشرة عبر البريد الإلكتروني أو واتساب.` |
| `error.misconfigured` | *(dev only — production falls back to `error.server`)* `Kontaktformular ist nicht konfiguriert (VITE_CONTACT_ENDPOINT fehlt).` | — |
| `status.submitting` | `Ihre Anfrage wird gesendet …` | `جارٍ إرسال طلبك …` |
| `status.success` | `Vielen Dank! Ihre Anfrage ist bei uns eingegangen.` | `شكراً لك! تم استلام طلبك.` |

Arabic numerals in error strings: I use Eastern Arabic-Indic digits (٢, ٨٠, ٢٠٠٠) in *prose*, and Western digits in *inputs and phone numbers*. See §4.14 and the open question at the end.

---

## 4. EVERY UI STATE

Design tokens used below come from the reference system, plus two I am adding because the reference has no error or success colour at all:

```css
:root{
  --green:#075344; --deep:#043b32; --sage:#769b7e;
  --gold:#c48a16;  --cream:#f7f0e5; --ink:#19312c;

  /* form-specific, extracted from the reference */
  --field-bg:#fbfcfa;  --field-border:#cdd9d5;  --field-radius:7px;
  --hint:#6c7a76;

  /* NEW — the reference has neither */
  --error:#a4271c;        /* 7.29:1 on white — AA + AAA for body text */
  --error-tint:#fbeceb;
  --success:var(--green); /* 9.01:1 on white — no new token needed */
}
```

**Accessibility fix I am making to the reference system, deliberately:** the reference uses `outline: 3px solid #c48a1666` (gold @ 40%) for focus. Solid `--gold` `#c48a16` against white is **2.99:1** — it fails WCAG 2.2 SC 1.4.11 (3:1 for non-text) *before* you drop it to 40% opacity. At 40% it is effectively invisible.

**Our focus ring:** `outline: 3px solid var(--green); outline-offset: 2px;` (9.01:1) **plus** `border-color: var(--gold)` on the field so it still reads as brand-gold. Both signals, one of them actually visible.

```css
.zs-field:focus-visible{
  border-color:var(--gold);
  outline:3px solid var(--green);
  outline-offset:2px;
}
/* On the deep-green contact section, any control not inside the white card
   gets a light ring instead so it stays visible against #043b32. */
.zs-on-deep :focus-visible{ outline-color:#f7f0e5; }
```

### 4.1 Idle

Input: `background:#fbfcfa` · `border:1px solid #cdd9d5` · `border-radius:7px` · `padding:13px` · `font:16px` (**never below 16px** — iOS Safari zooms the viewport on focus below 16px, which on an RTL page is genuinely disorienting). Label above: `13px / font-weight:800 / --ink`. Hint below: `13px / --hint / line-height:1.5`. `min-height:48px` on every control (touch target, WCAG 2.5.8).

Layout follows the reference: 2-column grid inside a white `18px`-radius card on the `--deep` section, `gap:18px`, `padding:34px`. Full-width (`grid-column:1/-1`) for message, both checkboxes, notice, and submit. Collapses to 1 column at 640px.

### 4.2 Hover

`border-color:#b9c8c3`, `cursor:text`. 120ms transition. The reference has no hover state on fields; this is cheap polish.

### 4.3 Focused

As above. `aria-describedby` already points at the hint id so the hint is read *on focus*, before the user types — which is where hints are actually useful.

```html
<input id="zs-email" aria-describedby="zs-email-hint" ... >
<p id="zs-email-hint" class="zs-hint">Hierhin senden wir unsere Antwort.</p>
```

### 4.4 Invalid field

**Visual:** `border:1.5px solid var(--error)` · label unchanged (do not colour the label red — it hurts scanning) · error message below the field: `13px`, `--error`, `font-weight:700`, preceded by a `12px` warning glyph with `aria-hidden="true"`. Never colour-only (SC 1.4.1): there is always a glyph *and* text.

**ARIA:**
```html
<input
  id="zs-email"
  type="email"
  aria-invalid="true"
  aria-describedby="zs-email-error zs-email-hint"
  autocomplete="email"
/>
<p id="zs-email-error" class="zs-error">
  <span aria-hidden="true">⚠</span> Diese E-Mail-Adresse scheint nicht zu stimmen…
</p>
```

Order matters: **error id first** in `aria-describedby`, so a screen reader user hears the problem before the generic hint.

**Announcement:** the error node is *not* a live region. It is announced when focus lands on the field (via `aria-describedby`) and via the summary on submit. Making every field error a live region produces a machine-gun of announcements while tabbing — a common and unpleasant mistake.

### 4.5 Form-level error summary (on failed submit)

Rendered at the **top of the form card**, above the first field.

```html
<div id="zs-error-summary" tabindex="-1" class="zs-summary">
  <h3>Bitte korrigieren Sie noch 3 Angaben.</h3>
  <ul>
    <li><a href="#zs-email">Diese E-Mail-Adresse scheint nicht zu stimmen.</a></li>
    <li><a href="#zs-message">Bitte beschreiben Sie Ihr Anliegen kurz…</a></li>
    <li><a href="#zs-consent">Bitte bestätigen Sie die Datenschutzerklärung…</a></li>
  </ul>
</div>
```

Styling: `background:var(--error-tint)` · `border-inline-start:3px solid var(--error)` · `border-radius:7px` · `padding:16px 18px` — deliberately echoing the reference's `.detail-notice` pattern (`border-inline-start` + tinted background), so it looks native to the design system. `border-inline-start` is logical and flips correctly in RTL for free.

**Focus & announcement — the precise mechanics:**

```ts
const summaryRef = useRef<HTMLDivElement>(null);

const onInvalid = () => {
  // Defer past RHF's own shouldFocusError so the summary wins the focus.
  requestAnimationFrame(() => summaryRef.current?.focus());
};

<form onSubmit={handleSubmit(onValid, onInvalid)} noValidate>
```

**No `role="alert"` on the summary.** Moving focus to a `tabindex="-1"` container already causes the AT to announce its heading and content. Adding `role="alert"` on top produces a *double* announcement — the live-region read plus the focus read. Focus movement alone is the correct, quieter pattern (and is what GOV.UK converged on). This distinction matters and is routinely got wrong.

Clicking a summary link focuses the field (native fragment behaviour on an `id`). Each list item's text is the same string as the inline field error — never a second, different wording.

`shouldFocusError` stays `true` as a belt-and-braces fallback in case the summary ref is somehow unmounted, but the rAF-deferred summary focus overrides it in practice.

### 4.6 Submitting

- Submit button: `disabled`, `aria-disabled="true"`, label → `Wird gesendet …`, a 16px spinner before the label (`aria-hidden`). A disabled button is acceptable *here* and only here, because the reason is stated in the button's own label.
- **Inputs stay enabled.** Do not `disabled` the fieldset — it yanks focus out of the DOM and, if the request fails, the user's focus is nowhere.
- `<form aria-busy="true">`.
- Polite live region announces `Ihre Anfrage wird gesendet …`.
- **Minimum visible duration 400 ms.** If the request resolves in 90 ms the spinner flashes and reads as a glitch; a floor makes fast success feel deliberate.
- Overall timeout **15 s** → `timeout` error (§4.9).
- `prefers-reduced-motion: reduce` → the spinner becomes a static pulsing dot (opacity only), no rotation.

### 4.7 Success

**The form is replaced, not garnished.** A toast is missed by roughly everyone; on mobile it appears off-screen from where the submit button was.

```
┌─────────────────────────────────────────┐
│  ✓  (48px, --success, circle on         │
│      --cream)                           │
│                                         │
│  Vielen Dank für Ihre Anfrage.          │  Georgia 32px, --deep
│                                         │
│  Wir haben Ihre Nachricht erhalten und  │  16px/1.65, #566864
│  melden uns so bald wie möglich bei     │
│  Ihnen – in der Regel innerhalb von     │
│  [X] Werktagen.                         │
│                                         │
│  Ihre Referenznummer: ZS-2026-0042      │  13px mono, --hint
│                                         │
│  [ Über WhatsApp schreiben ]  [ Neue    │
│                                Anfrage ]│
└─────────────────────────────────────────┘
```

**AR:**
> `شكراً لتواصلك معنا.`
> `لقد استلمنا رسالتك وسنتواصل معك في أقرب وقت ممكن – عادةً خلال [X] أيام عمل.`
> `رقم المرجع الخاص بك: ZS-2026-0042`

**Mechanics:**
```ts
successRef.current?.focus();                       // <div tabindex="-1">, heading inside
successRef.current?.scrollIntoView({
  block: 'center',
  behavior: prefersReducedMotion ? 'auto' : 'smooth',
});
sessionStorage.removeItem(DRAFT_KEY);              // draft is dead
setLiveMessage(t('status.success'));               // role="status", polite
// analytics hook point for the backend dev: window.dataLayer?.push(...)
```

"Neue Anfrage" resets the form to `defaultValues`, regenerates the idempotency key and the `formLoadedAt` timestamp, and focuses the name field.

> **OPEN QUESTION — response-time promise.** `[X] Werktage` is a commitment the client makes to every visitor. It must be his number, and it should be conservative (2 Werktage is safer than "24 Stunden").

### 4.8 Network failure (fetch rejected)

Form **stays fully populated**. Error block rendered directly above the submit row, same visual treatment as the summary, `tabindex="-1"` + focus.

```
⚠  Ihre Anfrage konnte nicht gesendet werden.
   Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.

   [ Erneut senden ]

   Oder erreichen Sie uns direkt:
   info@zukunft-service.de  ·  +49 …  ·  WhatsApp
```

**The escape hatch is the most valuable three lines in this entire document.** A form that fails and offers nothing else has converted a warm lead into a bounce. `navigator.onLine === false` swaps the copy to `error.offline`.

We also register a one-shot `window.addEventListener('online', …)` that clears the error block and announces `Verbindung wiederhergestellt. Sie können Ihre Anfrage jetzt senden.` / `تمت استعادة الاتصال. يمكنك الآن إرسال طلبك.`

### 4.9 Timeout (>15 s)

Same block, `error.timeout` copy, retry enabled immediately. Distinguished from network failure because the user's action differs: "your connection is broken" vs "try again, it was just slow".

### 4.10 Rate limited (429)

Copy: `Sie haben gerade erst eine Anfrage gesendet. Bitte versuchen Sie es in {seconds} Sekunden erneut.`

- `retryAfterSeconds` from the `Retry-After` header, falling back to the JSON body, falling back to 60.
- Submit button `disabled` **with a visible countdown in its label**: `Erneut senden in 0:47` / `إعادة الإرسال خلال ٠:٤٧`. Never a mystery-disabled button.
- Countdown ticks the *label* every second (visual), but the **live region only re-announces at 60/30/10/0 s**. A polite region firing once per second is an accessibility denial-of-service.
- At 0 the button re-enables and announces `Sie können Ihre Anfrage jetzt erneut senden.`
- Escape hatch shown, as always.

### 4.11 Server 500

Copy: `Es gab ein technisches Problem auf unserer Seite. Ihre Angaben sind noch da – bitte versuchen Sie es in wenigen Minuten erneut.`

Plus a **mailto fallback** — the strongest possible recovery, and it costs one function:

```ts
function buildMailtoFallback(v: ContactFormValues, locale: Locale): string {
  const subject = locale === 'de'
    ? `Anfrage über die Website – ${categoryLabel(v.serviceCategory, 'de')}`
    : `طلب عبر الموقع الإلكتروني – ${categoryLabel(v.serviceCategory, 'ar')}`;
  const body = [
    `Name: ${v.name}`,
    `E-Mail: ${v.email}`,
    v.phone ? `Telefon: ${v.phone}` : null,
    '',
    v.message,
  ].filter(Boolean).join('\n');
  return `mailto:${CONTACT_CONFIG.email}`
    + `?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(body.slice(0, 1500))}`;
}
```

Button: `Anfrage per E-Mail-Programm senden` / `إرسال الطلب عبر برنامج البريد`. The user's carefully typed message survives even a total backend outage.

If the response carries a `requestId`, render it small and grey — it is what the backend dev will ask for.

### 4.12 Server 422 (backend rejected our validation)

```ts
if (result.error.kind === 'validation') {
  for (const [field, msgKey] of Object.entries(result.error.fieldErrors)) {
    form.setError(field as ContactFormFieldName, {
      type: 'server',
      message: msgKey,           // still a key; unknown keys fall back to error.validation
    });
  }
  showFormError('error.validation');
  requestAnimationFrame(() => summaryRef.current?.focus());
}
```

Server field errors render identically to client ones and clear on change. Unknown keys degrade gracefully to the generic string rather than printing a raw key at the user.

### 4.13 Double submit

Four layers, cheapest first:

1. `formState.isSubmitting` → button `disabled`. Handles the ordinary double-tap.
2. A `useRef<boolean>` guard at the top of `onValid` — closes the window between click and React re-render, which is real on a slow phone.
3. `handleSubmit` from RHF ignores concurrent invocations by design.
4. **`Idempotency-Key` header**, one `crypto.randomUUID()` per form fill, regenerated only on success-reset. This is the only layer that survives a user who submits, loses connectivity, and retries — the backend can dedupe and the owner gets one email, not two.

If the user navigates away mid-submit, an `AbortController` in a `useEffect` cleanup cancels the fetch; the abort is swallowed (no error state on an unmounted component).

### 4.14 RTL

- `<html lang="ar" dir="rtl">`; the form inherits.
- All spacing uses logical properties (`padding-inline`, `margin-inline-start`, `border-inline-start`). The reference already does this in places (`.detail-notice`, `.site-header nav`) — follow it everywhere.
- **`email` and `phone` inputs get `dir="ltr"` explicitly**, with `text-align: right` in RTL context, so `+49 170 …` renders in the correct visual order while sitting flush against the RTL flow. `dir="auto"` is *not* sufficient for phone numbers: `+` and digits are weak-directional characters, so the field inherits RTL and the number renders backwards. This is the single most common bilingual-form bug and it is worth naming explicitly in the build.
- The `⚠` glyph and the checkbox both sit on the inline-start side automatically.
- Arabic body copy needs looser leading: `.rtl .zs-field, .rtl .zs-hint { line-height: 1.75; letter-spacing: 0; }` — mirroring the reference's own `.rtl .hero h1 { letter-spacing:0; line-height:1.16 }` insight.
- Error/success panels use `border-inline-start`, so they flip for free.

### 4.15 No-JS

```html
<noscript>
  <div class="zs-noscript">
    <p>Für das Kontaktformular wird JavaScript benötigt.
       Sie erreichen uns auch direkt:</p>
    <p><a href="mailto:…">info@…</a> · <a href="tel:…">+49 …</a> ·
       <a href="https://wa.me/…">WhatsApp</a></p>
  </div>
</noscript>
```

Ten lines. A brochure site whose only conversion path is invisible to a locked-down browser is a broken brochure site.

### 4.16 Draft persistence (the bilingual trap)

A user types 400 words in German, realises they'd rather read Arabic, hits the language pill — and on a naive implementation the form is empty. That is a catastrophic, entirely self-inflicted abandonment.

```ts
const DRAFT_KEY = 'zs.contact.draft.v1';
// debounce 500ms; never persist privacyConsent (consent must be re-affirmed)
// restore on mount; clear on success; expire after 24h
```

`sessionStorage`, not `localStorage`: it dies with the tab, so it is unambiguously "technically necessary" and stays out of any cookie-consent discussion. `privacyConsent` is explicitly excluded from the draft — a restored pre-checked consent box is exactly the pre-ticking Art. 4(11) forbids.

### 4.17 Chrome autofill

Chrome paints autofilled inputs `#e8f0fe`, which shatters the cream palette:

```css
.zs-field:-webkit-autofill,
.zs-field:-webkit-autofill:focus{
  -webkit-box-shadow:0 0 0 1000px var(--field-bg) inset;
  -webkit-text-fill-color:var(--ink);
  transition:background-color 9999s ease-out;
}
```

### 4.18 State summary table

| State | Visual | Announced | Focus moves to |
|---|---|---|---|
| idle | `#fbfcfa` / `#cdd9d5` border | — | — |
| hover | border `#b9c8c3` | — | — |
| focus | gold border + green 3px ring | hint via `describedby` | — |
| field invalid | `--error` border + ⚠ + text | on field focus | — |
| submit blocked | summary panel at form top | heading + list, via focus | summary `tabindex=-1` |
| submitting | spinner, button disabled, `aria-busy` | `status.submitting` (polite) | — |
| success | form replaced by panel | `status.success` (polite) | success heading |
| network fail | inline block + retry + escape hatch | via focus | error block |
| offline | inline block, offline copy | via focus | error block |
| timeout | inline block, timeout copy | via focus | error block |
| 429 | inline block + countdown in button | at 60/30/10/0 s only | error block |
| 500 | inline block + mailto fallback | via focus | error block |
| 422 | field errors + summary | via focus | summary |
| double submit | button disabled + idempotency key | — | — |

---

## 5. SPAM MITIGATION

### 5.1 Ours (frontend) — three things, ~40 lines total

**a. Honeypot.** One field, `name="website"`.

```tsx
<div aria-hidden="true" className="zs-hp">
  <label htmlFor="zs-website">Website</label>
  <input
    id="zs-website" type="text" {...register('website')}
    tabIndex={-1} autoComplete="off"
  />
</div>
```
```css
/* NOT display:none — many bots skip display:none inputs.
   Off-screen keeps it in the layout tree so naive bots fill it. */
.zs-hp{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;}
```
`aria-hidden` + `tabindex="-1"` keeps it out of the AT tree and the tab order. Field name `website` is chosen as maximum bot bait; `autocomplete="off"` guards against a browser profile filling it.

**b. Time-to-submit trap.** `formLoadedAt = Date.now()` captured on mount.

```ts
const elapsedMs = Date.now() - formLoadedAt.current;
if (elapsedMs < 3000) return silentSuccess();   // bot
if (elapsedMs > 12 * 3_600_000) formLoadedAt.current = Date.now(); // stale tab, re-arm
```

3 s is safe: this form has a required 10-character textarea. No human types a genuine enquiry in under three seconds, and password-manager autofill cannot fill a free-text message.

**c. Silent-success on trigger.** If either trap fires, we show the normal success panel and **never issue the request**. The bot logs a success and moves on; no signal is fed back that would let a spammer tune around the trap.

```ts
// dev-only visibility
if (import.meta.env.DEV) console.warn('[contact] honeypot/timing trap fired', { elapsedMs });
```

**Accepted risk, stated plainly:** silent-success means a false positive silently loses a real lead. I judge this correct — a visible "you look like a bot" message on a false positive is worse (insulting and unactionable), and the true-positive rate of an off-screen honeypot is very high. The escape hatch (email/phone/WhatsApp always visible next to the form) is the safety net.

**d. Free structural protection.** We POST `Content-Type: application/json`, which forces a CORS preflight for cross-origin requests. Naive form-spam bots POST `application/x-www-form-urlencoded` from arbitrary origins. **The backend must reject any content type other than `application/json`** — that single line eliminates a large class of drive-by spam at zero cost. This belongs in the handoff doc as a requirement, not a suggestion.

**e. Scoring signal, not a block.** We ship `meta.linkCount` (count of `https?://` in the message) so the backend can score. We do **not** block on it client-side: a user pasting a Behörden portal URL is legitimate and blocking them is a lost lead.

### 5.2 Theirs (backend) — non-negotiable, goes in HANDOFF.md

| # | Requirement | Why |
|---|---|---|
| 1 | **Re-validate the entire payload server-side** against the same rules (lengths, enum membership, email shape). Reject with 422. | The client-side schema is a UX affordance, not a security control. Anyone can `curl` the endpoint. |
| 2 | **Strip `\r` and `\n` from `name`, `email`, and any value interpolated into a mail header.** | SMTP header injection — the classic contact-form vulnerability. We block it at the edge too, but the edge is bypassable. |
| 3 | **Rate limit:** 5/hour and 20/day per IP; 3/hour per email address. Return `429` + `Retry-After`. | Our UI already renders `Retry-After` as a countdown. |
| 4 | **Re-check `meta.elapsedMs < 1500` → reject 403.** | We ship it; use it. |
| 5 | **Reject non-`application/json` content types.** | §5.1d. |
| 6 | **Max body size 32 KB.** | The largest legitimate payload is ~3 KB. |
| 7 | **CORS allowlist to the production origin only** (plus `http://localhost:5173` in dev). Allowed headers: `content-type, idempotency-key, x-client-version`. | Prevents the endpoint being used as a free mailer from other sites. |
| 8 | **Honour `Idempotency-Key`** — cache the result for 24 h and return the original response on replay. | Prevents duplicate emails from retries. |
| 9 | **`From:` must be the site's own domain, never the submitter's address.** Use `Reply-To:` for the submitter. | Setting `From: user@gmail.com` fails Gmail's DMARC and the owner's notification lands in spam or is rejected outright. **This is the single most common mistake on contact forms and it silently destroys the entire feature.** |
| 10 | **SPF, DKIM, and DMARC configured on the sending domain.** | Same reason. Without it, notifications quietly disappear. |
| 11 | **Never log the full message body in plaintext application logs.** Log `requestId`, category, locale, timestamp. | DSGVO minimisation + the message may contain Art. 9 data despite our warning. |
| 12 | **Retention policy** if submissions are stored: auto-delete after the agreed period. | Art. 5(1)(e). |

### 5.3 CAPTCHA — deliberately deferred, with the reasoning

**Do not ship Turnstile or hCaptcha in v1.**

- Honeypot + timing + server rate limiting stops the overwhelming majority of contact-form spam on a site with this traffic profile.
- Cloudflare Turnstile is a **US processor** loaded on page render. For a German site that means: a Datenschutzerklärung entry, an AV-Vertrag, an argument about whether the script may load before consent, and — if you take the strict reading — a consent gate in front of your own contact form. That is real cost and real friction for a problem you do not yet have.
- CAPTCHAs measurably reduce completion, and this audience (older users, non-native readers, mobile) is exactly the cohort they hurt most.

**Trigger to revisit:** more than ~5 spam submissions per week. At that point add **Friendly Captcha** (German company, EU-hosted, proof-of-work, no user interaction, DSGVO-clean) — it is the right choice for this specific client precisely because it avoids the US-transfer conversation entirely. The integration point is already open: one extra header on the request in `http.ts`, one verification call on the backend. Budget it as a small paid change request, not as v1 scope.

---

## 6. THE CONTRACT

Five files. `submitContactForm` is the only thing components import.

```
src/lib/contact/
  types.ts        ← the contract (backend dev reads this first)
  config.ts       ← env var access
  http.ts         ← the ONE file to edit if the API shape differs
  mock.ts         ← ships enabled by default; makes the UI demoable with no backend
  submit.ts       ← transport selection + traps. Components import only this.
```

### 6.1 `src/lib/contact/types.ts`

```ts
/**
 * ============================================================================
 *  ZUKUNFT SERVICE — CONTACT FORM CONTRACT
 * ============================================================================
 *  This file is the interface between the frontend (delivered) and the
 *  backend (to be implemented). It is the source of truth.
 *
 *  If you are the backend developer: read this file, then HANDOFF.md §3.
 *  You should not need to change anything here.
 * ============================================================================
 */

export type Locale = 'de' | 'ar';

/** Wire values. NEVER localise these — the UI maps them to DE/AR labels. */
export const SERVICE_CATEGORIES = [
  'behoerden-dokumente',
  'ehe-uebersetzungen',
  'studium-visa',
  'finanzen-vorsorge',
  'immobilien-investitionen',
  'reinigung',
  'sonstiges',
] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const CONTACT_TIMES = ['vormittag', 'nachmittag', 'abend', 'egal'] as const;
export type ContactTime = (typeof CONTACT_TIMES)[number];

export type ContactFormFieldName =
  | 'name' | 'email' | 'phone' | 'whatsappOptIn'
  | 'serviceCategory' | 'message' | 'preferredContactTime' | 'privacyConsent';

/**
 * Version identifier of the Datenschutzerklärung text the user agreed to.
 * Bump this (to the new publication date) whenever the privacy text changes.
 * Required to demonstrate consent under GDPR Art. 7(1).
 */
export const CONSENT_VERSION = '2026-08-20';

/** Best-effort phone normalisation. `raw` is ALWAYS authoritative for humans. */
export interface PhoneValue {
  /** Exactly what the user typed, trimmed. Display THIS in the email. */
  raw: string;
  /**
   * E.164 for `tel:` links, or null when we could not determine a country.
   * When `assumedCountry === 'DE'` this was inferred from a leading `0`
   * and may be wrong for a foreign national-format number. Label it as an
   * assumption wherever you display it.
   */
  e164: string | null;
  assumedCountry: 'DE' | null;
}

export interface ContactFormMeta {
  /** ISO 8601, UTC, e.g. "2026-08-20T13:04:11.482Z" */
  submittedAt: string;
  /** ms between form mount and submit. Reject < 1500 server-side. */
  elapsedMs: number;
  /** Count of http(s) URLs in `message`. A spam-scoring signal, not a verdict. */
  linkCount: number;
  /** Path the form was submitted from, e.g. "/de/#kontakt" */
  pagePath: string;
  /** IANA zone from the browser, e.g. "Europe/Berlin". Diagnostic only. */
  timezone: string;
  /** Frontend build id, for correlating bug reports. */
  clientVersion: string;
}

/**
 * The exact JSON body POSTed to VITE_CONTACT_ENDPOINT.
 * All strings are already trimmed; `email` is already lowercased.
 * Single-line fields contain no CR/LF — but strip them again server-side
 * before composing mail headers. See HANDOFF.md §5.
 */
export interface ContactFormPayload {
  /** 2–80 chars, no CR/LF. */
  name: string;
  /** 5–254 chars, lowercased, trimmed. Use as Reply-To. NEVER as From. */
  email: string;
  /** null when the (optional) field was left empty. */
  phone: PhoneValue | null;
  /** true ⇒ `phone` is guaranteed non-null. */
  whatsappOptIn: boolean;
  serviceCategory: ServiceCategory;
  /** 10–2000 chars. May contain newlines. Treat as untrusted text: escape
   *  before putting into HTML email. */
  message: string;
  preferredContactTime: ContactTime;
  /** Always `true` — the request is not sent otherwise. Log it with the timestamp. */
  privacyConsent: true;
  /** @see CONSENT_VERSION */
  consentVersion: string;
  /** Language the user was browsing in. REPLY IN THIS LANGUAGE. */
  locale: Locale;
  meta: ContactFormMeta;
}

/* ------------------------------- RESULT ---------------------------------- */

export type ContactFormError =
  | { kind: 'validation'; messageKey: 'error.validation';
      fieldErrors: Partial<Record<ContactFormFieldName, string>> }
  | { kind: 'rateLimited'; messageKey: 'error.rateLimited'; retryAfterSeconds: number }
  | { kind: 'network'; messageKey: 'error.network' | 'error.offline'; cause?: unknown }
  | { kind: 'timeout'; messageKey: 'error.timeout' }
  | { kind: 'server'; messageKey: 'error.server'; status: number; requestId: string | null }
  | { kind: 'rejected'; messageKey: 'error.rejected' }
  | { kind: 'misconfigured'; messageKey: 'error.misconfigured' };

export type ContactFormResult =
  | { ok: true; referenceId: string | null }
  | { ok: false; error: ContactFormError };

export interface SubmitOptions {
  /** Abort on unmount / navigation. */
  signal?: AbortSignal;
  /** One UUID per form fill. Sent as the `Idempotency-Key` header. */
  idempotencyKey: string;
}

/**
 * CONTRACT INVARIANT: this function NEVER rejects and NEVER throws.
 * Every failure is a value. The UI has no try/catch anywhere.
 */
export type SubmitContactForm = (
  payload: ContactFormPayload,
  options: SubmitOptions,
) => Promise<ContactFormResult>;
```

### 6.2 `src/lib/contact/config.ts`

```ts
export type ContactTransport = 'http' | 'mock';

export const CONTACT_CONFIG = {
  /** REQUIRED in production. Absolute https URL of the backend endpoint. */
  endpoint: (import.meta.env.VITE_CONTACT_ENDPOINT ?? '').trim(),

  /** 'mock' ships as the default so the UI is demoable with no backend. */
  transport: ((import.meta.env.VITE_CONTACT_TRANSPORT ?? 'mock') as ContactTransport),

  /** Owner's WhatsApp number, E.164 digits only, no `+`. e.g. "4915112345678" */
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').trim(),

  /** Public contact address, used for the noscript + mailto fallbacks. */
  email: (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim(),

  clientVersion: import.meta.env.VITE_APP_VERSION ?? 'dev',

  requestTimeoutMs: 15_000,
} as const;

/** Fail loudly at build/boot, not silently at the user's first submit. */
export function assertContactConfig(): void {
  if (import.meta.env.PROD && CONTACT_CONFIG.transport === 'http'
      && !CONTACT_CONFIG.endpoint) {
    // eslint-disable-next-line no-console
    console.error(
      '[contact] VITE_CONTACT_ENDPOINT is not set. ' +
      'The contact form will show a server error to every visitor. ' +
      'See HANDOFF.md §2.',
    );
  }
}
```

**`.env.example`** (committed):

```dotenv
# --- Contact form -----------------------------------------------------------
# 'mock' = no network, fully demoable UI (default).
# 'http' = POST to VITE_CONTACT_ENDPOINT.
VITE_CONTACT_TRANSPORT=mock

# Absolute https URL. Required when VITE_CONTACT_TRANSPORT=http.
VITE_CONTACT_ENDPOINT=

# Owner's WhatsApp number, digits only, no "+", no spaces.
VITE_WHATSAPP_NUMBER=

# Public address for the mailto/noscript fallbacks.
VITE_CONTACT_EMAIL=

# Build identifier (CI sets this).
VITE_APP_VERSION=dev
```

### 6.3 `src/lib/contact/http.ts` — **the one file to change**

```ts
import { CONTACT_CONFIG } from './config';
import type {
  ContactFormPayload, ContactFormResult, ContactFormFieldName, SubmitOptions,
} from './types';

/** Response envelope the backend must return. See HANDOFF.md §3. */
type ApiResponse =
  | { ok: true; referenceId?: string | null }
  | {
      ok: false;
      error: {
        kind: 'validation' | 'rateLimited' | 'rejected' | 'server';
        fieldErrors?: Partial<Record<ContactFormFieldName, string>>;
        retryAfterSeconds?: number;
        requestId?: string | null;
      };
    };

function combineSignals(a: AbortSignal, b?: AbortSignal): AbortSignal {
  // AbortSignal.any: Chrome 116+, Safari 17.4+, Firefox 124+.
  if (!b) return a;
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([a, b]);
  const ctrl = new AbortController();
  const abort = () => ctrl.abort();
  a.addEventListener('abort', abort, { once: true });
  b.addEventListener('abort', abort, { once: true });
  return ctrl.signal;
}

export async function submitViaHttp(
  payload: ContactFormPayload,
  options: SubmitOptions,
): Promise<ContactFormResult> {
  const endpoint = CONTACT_CONFIG.endpoint;
  if (!endpoint) {
    return { ok: false, error: import.meta.env.DEV
      ? { kind: 'misconfigured', messageKey: 'error.misconfigured' }
      : { kind: 'server', messageKey: 'error.server', status: 0, requestId: null } };
  }

  const timeoutSignal = AbortSignal.timeout(CONTACT_CONFIG.requestTimeoutMs);
  const signal = combineSignals(timeoutSignal, options.signal);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'error',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Idempotency-Key': options.idempotencyKey,
        'X-Client-Version': CONTACT_CONFIG.clientVersion,
      },
      body: JSON.stringify(payload),
    });
  } catch (cause) {
    if (timeoutSignal.aborted) {
      return { ok: false, error: { kind: 'timeout', messageKey: 'error.timeout' } };
    }
    return {
      ok: false,
      error: {
        kind: 'network',
        messageKey: navigator.onLine ? 'error.network' : 'error.offline',
        cause,
      },
    };
  }

  return parseApiResponse(response);
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BACKEND DEVELOPER: THIS IS THE ONLY FUNCTION YOU MAY NEED TO CHANGE.
 *  If your API cannot return the documented envelope, adapt it here.
 *  Nothing else in the frontend touches HTTP.
 * ─────────────────────────────────────────────────────────────────────────────
 */
async function parseApiResponse(response: Response): Promise<ContactFormResult> {
  const body = (await response.json().catch(() => null)) as ApiResponse | null;

  if (response.ok && body?.ok === true) {
    return { ok: true, referenceId: body.referenceId ?? null };
  }

  if (response.status === 429) {
    const header = Number(response.headers.get('Retry-After'));
    const fromBody = body && body.ok === false ? body.error.retryAfterSeconds : undefined;
    const retryAfterSeconds =
      Number.isFinite(header) && header > 0 ? header : (fromBody ?? 60);
    return { ok: false, error: { kind: 'rateLimited', messageKey: 'error.rateLimited', retryAfterSeconds } };
  }

  if (response.status === 400 || response.status === 422) {
    const fieldErrors = body && body.ok === false ? (body.error.fieldErrors ?? {}) : {};
    return { ok: false, error: { kind: 'validation', messageKey: 'error.validation', fieldErrors } };
  }

  if (response.status === 403) {
    return { ok: false, error: { kind: 'rejected', messageKey: 'error.rejected' } };
  }

  const requestId =
    (body && body.ok === false ? body.error.requestId : null) ??
    response.headers.get('X-Request-Id');

  return {
    ok: false,
    error: { kind: 'server', messageKey: 'error.server', status: response.status, requestId },
  };
}
```

### 6.4 `src/lib/contact/mock.ts`

```ts
import type { ContactFormPayload, ContactFormResult, SubmitOptions } from './types';

const MOCK_LATENCY_MS = 900;

/**
 * Magic addresses for demoing every UI state to the client with no backend
 * and no env changes. Remove nothing — QA and the client demo depend on these.
 *
 *   ok@test.de      → success
 *   422@test.de     → server-side validation failure (email + message)
 *   429@test.de     → rate limited, 45s
 *   500@test.de     → server error
 *   offline@test.de → network failure
 *   slow@test.de    → 18s, trips the 15s client timeout
 *   spam@test.de    → 403 rejected
 */
export async function submitViaMock(
  payload: ContactFormPayload,
  options: SubmitOptions,
): Promise<ContactFormResult> {
  const scenario =
    payload.email.split('@')[0] ??
    (import.meta.env.VITE_CONTACT_MOCK_SCENARIO ?? 'ok');

  const delay = scenario === 'slow' ? 18_000 : MOCK_LATENCY_MS;
  await sleep(delay, options.signal);

  // eslint-disable-next-line no-console
  console.info(
    '%c[contact:mock] The backend must send this email:%c\n' + renderEmailPreview(payload),
    'color:#075344;font-weight:bold', 'color:inherit',
  );

  switch (scenario) {
    case '422':
      return { ok: false, error: { kind: 'validation', messageKey: 'error.validation',
        fieldErrors: { email: 'email.invalid', message: 'message.tooShort' } } };
    case '429':
      return { ok: false, error: { kind: 'rateLimited', messageKey: 'error.rateLimited', retryAfterSeconds: 45 } };
    case '500':
      return { ok: false, error: { kind: 'server', messageKey: 'error.server', status: 500, requestId: 'mock-req-0001' } };
    case 'offline':
      return { ok: false, error: { kind: 'network', messageKey: 'error.network' } };
    case 'spam':
      return { ok: false, error: { kind: 'rejected', messageKey: 'error.rejected' } };
    default:
      return { ok: true, referenceId: `ZS-MOCK-${options.idempotencyKey.slice(0, 4).toUpperCase()}` };
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(id); reject(signal.reason); }, { once: true });
  });
}

/** Renders the exact plaintext email body the backend should produce. */
export function renderEmailPreview(p: ContactFormPayload): string {
  return [
    `Betreff: Anfrage ${p.locale.toUpperCase()} · ${p.serviceCategory} · ${p.name}`,
    `Reply-To: ${p.name} <${p.email}>`,
    '',
    `Antwortsprache: ${p.locale === 'de' ? 'Deutsch' : 'Arabisch'}`,
    `Thema:          ${p.serviceCategory}`,
    `Name:           ${p.name}`,
    `E-Mail:         ${p.email}`,
    `Telefon:        ${p.phone ? p.phone.raw : '—'}`
      + (p.phone?.e164 ? `  (${p.phone.e164}${p.phone.assumedCountry ? ', angenommen: DE' : ''})` : ''),
    `WhatsApp:       ${p.whatsappOptIn ? 'JA – bevorzugt' : 'nein'}`,
    `Erreichbarkeit: ${p.preferredContactTime}`,
    '',
    'Nachricht:',
    p.message,
    '',
    `— eingegangen ${p.meta.submittedAt} · Einwilligung ${p.consentVersion}`,
  ].join('\n');
}
```

That `console.info` is a small piece of leverage: the backend developer opens the site, submits the form, and the console tells him exactly what to build.

### 6.5 `src/lib/contact/submit.ts` — the only import for components

```ts
import { CONTACT_CONFIG } from './config';
import { submitViaHttp } from './http';
import { submitViaMock } from './mock';
import type { SubmitContactForm } from './types';

export const submitContactForm: SubmitContactForm = (payload, options) =>
  CONTACT_CONFIG.transport === 'http'
    ? submitViaHttp(payload, options)
    : submitViaMock(payload, options);

export * from './types';
```

### 6.6 The HTTP contract, stated for the backend developer

**Request**

```http
POST /v1/contact HTTP/1.1
Host: <VITE_CONTACT_ENDPOINT host>
Content-Type: application/json
Accept: application/json
Idempotency-Key: 3f0c1e2a-9b47-4d1e-8a55-6c2f0b7d9e31
X-Client-Version: 1.0.3
```
```json
{
  "name": "Ahmad Hassan",
  "email": "ahmad.hassan@example.com",
  "phone": { "raw": "0170 1234567", "e164": "+491701234567", "assumedCountry": "DE" },
  "whatsappOptIn": true,
  "serviceCategory": "immobilien-investitionen",
  "message": "Guten Tag,\nich interessiere mich für eine Immobilienfinanzierung …",
  "preferredContactTime": "abend",
  "privacyConsent": true,
  "consentVersion": "2026-08-20",
  "locale": "ar",
  "meta": {
    "submittedAt": "2026-08-20T13:04:11.482Z",
    "elapsedMs": 74213,
    "linkCount": 0,
    "pagePath": "/ar/#kontakt",
    "timezone": "Europe/Berlin",
    "clientVersion": "1.0.3"
  }
}
```

**Responses**

| Status | Body | UI result |
|---|---|---|
| `200` / `201` | `{"ok":true,"referenceId":"ZS-2026-0042"}` | Success panel. `referenceId` may be `null`/omitted. |
| `400` / `422` | `{"ok":false,"error":{"kind":"validation","fieldErrors":{"email":"email.invalid"}}}` | Field errors + summary. `fieldErrors` values should be keys from §3.7; unknown keys degrade to the generic message. |
| `403` | `{"ok":false,"error":{"kind":"rejected"}}` | Rejected message + escape hatch. |
| `429` + `Retry-After: 120` | `{"ok":false,"error":{"kind":"rateLimited","retryAfterSeconds":120}}` | Countdown in the button. |
| `500`–`599` | `{"ok":false,"error":{"kind":"server","requestId":"req_abc123"}}` | Server error + mailto fallback. |

**CORS preflight** must answer `OPTIONS` with:
```
Access-Control-Allow-Origin: https://zukunft-service.de
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: content-type, idempotency-key, x-client-version
Access-Control-Max-Age: 86400
```
Do **not** use `*` in production. Add `http://localhost:5173` for local dev only.

**Absolute rules:** always return JSON, even on 500 (an HTML error page breaks `parseApiResponse` into a generic server error and you lose your `requestId`). Never redirect (`redirect: 'error'` is set). Never require cookies (`credentials: 'omit'`).

---

## 7. HANDOFF DOCUMENT — outline

`HANDOFF.md`, at the repo root. Target: a backend developer who has never seen this codebase gets a working email in **under 30 minutes**.

```
HANDOFF.md
├── 1. TL;DR — what you have to do
│      Three bullets:
│      1. Build an endpoint that accepts the JSON in §3 and sends the email in §6.
│      2. Set VITE_CONTACT_ENDPOINT and VITE_CONTACT_TRANSPORT=http.
│      3. Nothing else in this repo needs to change.
│      Estimated effort: 2–4 hours including DNS.
│
├── 2. What was built / what was NOT
│      IN:  full bilingual UI, RTL, validation, all 14 states, spam traps,
│           typed client, mock transport, a11y.
│      OUT: sending email, storage, rate limiting, CAPTCHA, CRM,
│           Impressum/Datenschutz legal text, analytics.
│
├── 3. The seam  ────────────────────── the important section
│      • src/lib/contact/types.ts  — read this first, it is the contract
│      • The HTTP request/response table (verbatim from §6.6)
│      • "The one file you might edit": src/lib/contact/http.ts → parseApiResponse()
│      • The env var table + .env.example
│
├── 4. Run it locally
│      npm ci && npm run dev            → mock mode, no backend needed
│      Demo every UI state without a backend, using the magic addresses:
│        ok@test.de / 422@test.de / 429@test.de / 500@test.de /
│        offline@test.de / slow@test.de / spam@test.de
│      Submit once in mock mode and read the console: it prints the exact
│      email you need to send.
│      Switch to your backend:
│        VITE_CONTACT_TRANSPORT=http
│        VITE_CONTACT_ENDPOINT=http://localhost:3000/v1/contact
│      Verify with the curl snippet (copy-paste, includes a full payload).
│
├── 5. Security requirements (NOT optional)
│      The 12-row table from §5.2, with #2 (CR/LF stripping) and
│      #9 (From: must be your own domain) called out in bold.
│
├── 6. The email to send  ───────────── copy-paste ready
│      6.1 Owner notification — headers, plaintext body, HTML body
│      6.2 Auto-reply to the submitter — DE and AR (optional, recommended)
│      6.3 Field → label mapping table (wire value → DE label → AR label)
│
├── 7. Backend options + recommendation (§8), with the "live today" path
│
├── 8. Deployment notes
│      Static build output, SPA rewrite rule, required security headers,
│      where the env vars are set (build-time, not runtime — Vite inlines them:
│      changing VITE_* requires a rebuild, NOT just a restart).
│
└── 9. Open questions still blocking go-live (the §10 list)
```

### 7.1 Owner notification email — exact content

**Headers**
```
From:      Zukunft Service Website <no-reply@zukunft-service.de>
To:        <OWNER_EMAIL>
Reply-To:  "Ahmad Hassan" <ahmad.hassan@example.com>     ← sanitised: no CR/LF
Subject:   Anfrage AR · Immobilien & Investitionen · Ahmad Hassan
X-ZS-Reference: ZS-2026-0042
X-ZS-Locale:    ar
```

The subject is built as `Anfrage {LOCALE} · {categoryLabelDE} · {name}`. The locale marker sits second because it is the first decision the owner makes when he opens it: *which language do I reply in?*

**Plaintext body**
```
NEUE ANFRAGE ÜBER ZUKUNFT-SERVICE.DE
────────────────────────────────────────────────
⚠ Antwortsprache: ARABISCH

Thema:            Immobilien & Investitionen
Name:             Ahmad Hassan
E-Mail:           ahmad.hassan@example.com
Telefon:          0170 1234567   (+491701234567 – angenommen: Deutschland)
WhatsApp:         JA – Kunde bevorzugt WhatsApp
Erreichbarkeit:   Abends (17–20 Uhr)

NACHRICHT
────────────────────────────────────────────────
Guten Tag,
ich interessiere mich für eine Immobilienfinanzierung …

────────────────────────────────────────────────
Direkt antworten:  Auf diese E-Mail antworten
Direkt anrufen:    tel:+491701234567
Direkt WhatsApp:   https://wa.me/491701234567

Eingegangen:      20.08.2026, 15:04 (Europe/Berlin)
Referenz:         ZS-2026-0042
Einwilligung:     erteilt am 20.08.2026, 15:04 – Fassung 2026-08-20
```

Three notes on that layout, each of which is worth the ten minutes it takes:

- **`⚠ Antwortsprache: ARABISCH`** on line 3 is the single most useful thing in the email for this specific business.
- The phone appears **twice** — as typed, and as normalised with the assumption labelled — so the owner is never misled by a bad `+49` guess on a Syrian number.
- The three "Direkt …" links turn the email into an action surface. `wa.me` only rendered when `whatsappOptIn && phone.e164`.

**HTML body:** same content, `--deep` header bar, `--cream` background, table layout, inline styles only. **Escape `message` before interpolation** — a submitted `<script>` or `<img onerror>` must not execute in the owner's webmail. Always send `multipart/alternative` with both parts.

### 7.2 Auto-reply to the submitter (recommended)

**DE**
```
Betreff: Ihre Anfrage bei Zukunft Service (ZS-2026-0042)

Guten Tag {name},

vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage zum Thema
„{Kategorie}" erhalten und melden uns so bald wie möglich bei Ihnen –
in der Regel innerhalb von {X} Werktagen.

Ihre Referenznummer: ZS-2026-0042

Hinweis: Zukunft Service erbringt keine Rechts-, Steuer- oder
Versicherungsberatung. Wir unterstützen Sie organisatorisch und
vermitteln bei Bedarf an geeignete Partner und Fachstellen.

Viele Lösungen. Ein Ansprechpartner.
Zukunft Service — Dienstleistungen & Reinigung
{Anschrift} · {Telefon} · {Web}
```

**AR** (send with `dir="rtl"` in the HTML part)
```
الموضوع: طلبك لدى Zukunft Service (ZS-2026-0042)

مرحباً {name}،

شكراً لرسالتك. لقد استلمنا طلبك بخصوص «{الفئة}» وسنتواصل معك في أقرب
وقت ممكن – عادةً خلال {X} أيام عمل.

رقم المرجع الخاص بك: ZS-2026-0042

ملاحظة: لا تقدّم Zukunft Service استشارات قانونية أو ضريبية أو تأمينية.
نحن ندعمك تنظيمياً وننسّق عند الحاجة مع شركاء وجهات مختصة مناسبة.

خدمات متعددة... وجهة واحدة
Zukunft Service — خدمات وتنظيف
{العنوان} · {الهاتف} · {الموقع}
```

**Auto-reply warning for the handoff doc:** an auto-responder is a spam-amplification vector (an attacker submits with a forged victim address and you mail the victim). Rate-limit auto-replies per address, send at most one per address per hour, and never include the submitted message body back in the auto-reply.

---

## 8. BACKEND OPTIONS

| Option | Cost | Effort | DSGVO | Live today? | Verdict |
|---|---|---|---|---|---|
| **Serverless fn (Vercel/Netlify) + Brevo API** | €0 (Brevo free 300/day; Vercel/Netlify Hobby free) | ~2 h | **Best.** Brevo is French, EU-hosted, DPA standard, no third-country transfer to explain. | No (needs DNS) | ✅ **RECOMMENDED** |
| Serverless fn + Resend | €0 (3 000/mo free), $20/mo Pro | ~1.5 h | US processor → DPA + DPF reliance, one paragraph in the Datenschutzerklärung | No | Best DX; pick if the client is relaxed about US processors |
| Serverless fn + Postmark | ~$15/mo | ~2 h | US | No | Best-in-class deliverability; overkill at this volume |
| Serverless fn + SendGrid | ~$20/mo | ~2.5 h | US | No | No advantage here |
| Nodemailer + the client's existing IONOS/All-Inkl/Hetzner mailbox | €0 (already paid for) | ~2 h | EU, no new processor at all | No | **Strong DSGVO runner-up.** Same-domain From ⇒ SPF/DKIM already correct. Weak point: SMTP creds in env, and shared-host SMTP throttling. |
| **Web3Forms** (no backend at all) | Free 250/mo | **~15 min** | Third-country; needs checking + a DPA | ✅ **YES** | The day-0 insurance policy |
| Formspree | Free 50/mo, $10/mo | ~15 min | US-hosted | ✅ YES | Fine, but 50/mo free is thin |
| FormSubmit.co | Free | ~10 min | **No DPA available** | ✅ YES | ❌ Do not use on a German commercial site |

### 8.1 Recommendation

**Primary: a serverless function (Vercel or Netlify, whichever hosts the site) calling Brevo's transactional API.** ~35 lines of backend code, €0/month at this volume, EU-hosted so the Datenschutzerklärung stays short, and it satisfies every requirement in §5.2 with standard middleware. If the client already has hosting with an SMTP mailbox, Nodemailer against that mailbox is an equally good and even simpler answer.

### 8.2 The "go live today" risk mitigation

If the backend developer is slow, unavailable, or drops out, **Web3Forms gets the client a working contact form in fifteen minutes with no server at all**, because our seam already anticipates it:

```dotenv
VITE_CONTACT_TRANSPORT=http
VITE_CONTACT_ENDPOINT=https://api.web3forms.com/submit
```

Web3Forms takes a JSON POST with an `access_key` and returns `{"success": true}`. Two edits inside `http.ts`, both inside `parseApiResponse` and the fetch body — under 15 lines:

```ts
// TEMPORARY BRIDGE — remove once the real backend exists.
body: JSON.stringify({ access_key: import.meta.env.VITE_WEB3FORMS_KEY, ...payload }),
// and in parseApiResponse:
if (response.ok && (body as any)?.success === true) return { ok: true, referenceId: null };
```

**This is exactly why the transport is isolated behind one function.** It is worth saying to the client explicitly, because "if your backend guy disappears you are still live by Friday" is a sentence that buys goodwill disproportionate to the effort. Caveats to state alongside it: no auto-reply, a third-party DPA to sign, and a Datenschutzerklärung entry.

> **OPEN QUESTION — DSGVO posture.** Whether the client accepts a US processor (Resend, Web3Forms, Formspree) or insists on EU-only (Brevo, Mailjet, own SMTP) is a *client decision*, not a technical one. It changes the Datenschutzerklärung and requires an AV-Vertrag either way. Ask before the backend dev picks.

---

## 9. WHATSAPP

### 9.1 Recommendation: yes — alongside, never instead

The reference site submits its form **to WhatsApp instead of email**. Do not copy that. The client's one stated requirement is an email, and a WhatsApp-only funnel leaves no searchable record, no reply-to, and nothing on the desktop where he does his actual paperwork.

But **the audience lives on WhatsApp**, and a contact page that ignores that is leaving conversions on the table. So: **email form is the primary path; WhatsApp is a first-class parallel path.** Cost: about 60 lines, no dependency, no backend.

### 9.2 Four placements

| Placement | Prefill | Purpose |
|---|---|---|
| **Floating FAB**, `#25d366`, 55px circle, `bottom:22px` (`right` LTR / `left` RTL — matches the reference) | greeting only | Always-available channel |
| **Secondary button next to Submit**: `Lieber über WhatsApp?` / `تفضّل واتساب؟` | **carries the already-typed draft** | Rescues form-abandoners |
| **In every error state** (network / timeout / 429 / 500) | carries the draft | The escape hatch |
| **On the success panel** | greeting + reference number | For urgent follow-ups |

The second one is the interesting one. A user who has typed 300 words and hesitates at the consent checkbox can move the whole thing to WhatsApp in one tap without retyping. That is a real conversion recovery, and nothing else in this document is cheaper per point of conversion.

### 9.3 URL construction

```ts
import { CONTACT_CONFIG } from './config';
import type { Locale, ServiceCategory } from './types';

const WA_TEXT_MAX = 900; // wa.me truncates well before this on some clients

export function buildWhatsAppUrl(input: {
  locale: Locale;
  draft?: Partial<{ name: string; serviceCategory: ServiceCategory; message: string }>;
  referenceId?: string | null;
}): string | null {
  const digits = CONTACT_CONFIG.whatsappNumber.replace(/\D/g, '');
  if (!digits) return null;               // never render a broken WhatsApp button

  const { locale, draft, referenceId } = input;
  const L = locale === 'de'
    ? { hello: 'Guten Tag, ich habe eine Anfrage über Ihre Website.',
        topic: 'Thema', name: 'Name', body: 'Mein Anliegen', ref: 'Referenz' }
    : { hello: 'مرحباً، لدي استفسار عبر موقعكم الإلكتروني.',
        topic: 'الموضوع', name: 'الاسم', body: 'طلبي', ref: 'رقم المرجع' };

  const lines = [
    L.hello,
    draft?.serviceCategory ? `${L.topic}: ${categoryLabel(draft.serviceCategory, locale)}` : null,
    draft?.name ? `${L.name}: ${draft.name}` : null,
    referenceId ? `${L.ref}: ${referenceId}` : null,
    draft?.message ? `\n${L.body}:\n${draft.message}` : null,
  ].filter(Boolean) as string[];

  const text = lines.join('\n').slice(0, WA_TEXT_MAX);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
```

`wa.me` is the official short form: on mobile it opens the app, on desktop it redirects to WhatsApp Web. All links: `target="_blank" rel="noopener noreferrer"`.

### 9.4 Details that get missed

- **Accessible name on the FAB.** The reference ships a bare glyph. Ours: `aria-label="Über WhatsApp Kontakt aufnehmen"` / `"تواصل معنا عبر واتساب"`, with the icon `aria-hidden`.
- **Contrast.** `#25d366` on white is 1.8:1 — fine for a *brand* fill, but the glyph inside must be white on that green (2.4:1, still low). Add a `1px solid #1da851` rim and a `0 10px 25px #00000038` shadow (the reference's own value) so the button has a visible boundary against the cream page.
- **Collision.** The FAB must not sit under a cookie banner or the sticky footer. `z-index: 40` (below the modal's `100`, above content), and it shifts up by the banner height when a banner is present.
- **RTL mirroring** is already in the reference CSS: `.rtl .floating-whatsapp { left:22px; right:auto; }`. Keep it.
- **Reduced motion:** no pulse/bounce animation on the FAB under `prefers-reduced-motion: reduce`. (And frankly, no pulse animation at all — it reads as an ad.)
- **Privacy line** under any WhatsApp button that appears inside the contact section: `Es gelten die Datenschutzbestimmungen von WhatsApp.` / `تُطبَّق سياسة الخصوصية الخاصة بواتساب.` Standard German practice, one line.
- **Hide the FAB entirely if `VITE_WHATSAPP_NUMBER` is unset** rather than rendering `https://wa.me/` — a dead WhatsApp button is worse than none.

> **OPEN QUESTION — which number?** WhatsApp Business or the owner's personal number? If personal, it appears in the page source and will be scraped. Recommend a WhatsApp Business account on a dedicated number, with away-message hours configured.

---

## 10. OPEN QUESTIONS — client must answer before go-live

Blocking:

1. **Destination email address** for form notifications. One recipient or several? Should the owner get a BCC archive address?
2. **WhatsApp number in E.164** (and: Business account or personal?).
3. **Response-time promise** — the `[X] Werktage` in the success panel and the auto-reply. This is a public commitment.
4. **Real business hours** for the `preferredContactTime` options (also feeds Impressum + Info-Strip).
5. **Retention period** for enquiry data (`[X] Monate` in the Art. 13 block). Default proposal: 6 months.
6. **Who writes the Datenschutzerklärung and Impressum?** Not us at $700. Without them the site cannot legally launch in Germany (§5 DDG).
7. **US processors: acceptable or not?** Determines Brevo vs Resend, and whether Web3Forms is available as the day-0 fallback.

Non-blocking but decide early:

8. **Auto-reply to the submitter: yes or no?** Recommended yes; needs the client's sign-off on the copy and adds ~30 min of backend work.
9. **Turnstile / Friendly Captcha now or later?** Recommendation: later, with Friendly Captcha as the choice when the time comes.
10. **File attachments?** My answer is a firm no; if the client insists it is a paid change request with real DSGVO consequences.
11. **Arabic numerals:** Eastern Arabic-Indic (٠١٢٣) in prose, Western (0123) in inputs and phone numbers is my default. Some Gulf-influenced audiences prefer Western throughout. Client preference?
12. **Third locale later (English/Turkish)?** The error dictionary is already key-based so a third locale is a data file, not a refactor — but confirm now so nobody bakes DE/AR into the component tree.

---

## 11. Scope boundary for this workstream

**IN the $700:** every field, both languages, full RTL, the zod schema, all 14 UI states, focus and ARIA management, honeypot + timing traps, draft persistence, the complete typed contract, the mock transport with seven demo scenarios, the WhatsApp path, `HANDOFF.md`, and the email templates written out for the backend dev to paste.

**NOT in the $700, and say so in writing:** sending the email, any server, storage or database, rate limiting, CAPTCHA, CRM or spreadsheet integration, analytics, the legal text of the Impressum and Datenschutzerklärung, and DNS/SPF/DKIM configuration.

The honest framing for the client: *the form is finished and demonstrable on day one — you can click through every success and failure state before a backend exists. Connecting it to a real mailbox is two to four hours of a backend developer's time, and everything he needs is written down.*