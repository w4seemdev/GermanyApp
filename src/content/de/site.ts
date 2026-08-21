/**
 * GERMAN SITE CONTENT - chrome + home page + form + a11y strings.
 *
 * Source: docs/research/00-source-brief.md §2/§3 (the client's PDFs) and
 * docs/research/01-content-and-ia.md §2/§6. Everything here is either the
 * client's own wording or a process description built from it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FORBIDDEN COPY - do not "improve" these strings. The hedging is load-bearing.
 * Never write: „wir beraten", „rechtliche Beratung", „Steuerberatung",
 * „Schuldnerberatung", „garantiert", „100 %", „wir besorgen Ihnen ein Visum",
 * „wir erledigen Ihre Einbürgerung", „beglaubigte Übersetzung" as our own
 * service, „amtlich anerkannt", „offizieller Partner", invented social proof.
 * Always: unterstützen bei · begleiten · vorbereiten · zusammenstellen ·
 * organisieren · strukturieren · vermitteln an. Behörden entscheiden, wir
 * bereiten vor.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { SiteContent } from '@/types/content';

/**
 * The standing scope boundary. Appears on the home page, on the three
 * high-sensitivity service pages and under the contact form. One wording, used
 * everywhere, so it can never drift into a claim in one place and a hedge in
 * another.
 */
const HEDGE_NOTICE =
  'Wir bieten organisatorische und sprachliche Unterstützung. Wir erbringen keine Rechts-, '
  + 'Steuer- oder Versicherungsberatung. Wo eine fachliche Beratung erforderlich ist, '
  + 'vermitteln wir an geeignete Fachstellen und Partner.';

export const deSite: SiteContent = {
  meta: {
    siteName: 'Zukunft Service',
    slogan: 'Viele Anliegen. Ein Ansprechpartner.',
    homeTitle: 'Zukunft Service | Dienstleistungen & Reinigung in Dortmund',
    homeDescription:
      'Büroservice, Dokumentenhilfe und professioneller Reinigungsservice in Dortmund – '
      + 'persönlich, mehrsprachig und Schritt für Schritt.',
    localeLabel: 'Deutsch',
    // The other locale's name in its own script. A user who reads only Arabic
    // must be able to find their language without reading German.
    switchLabel: 'العربية',
    switchAriaLabel: 'Zur arabischen Version wechseln – التبديل إلى النسخة العربية',
  },

  nav: {
    primary: [
      // Every target below points at a section id that actually exists. The
      // previous '#ueber-uns' anchor had no matching section and scrolled
      // nowhere. Structure is kept identical to the Arabic nav so the language
      // switch does not change the menu under the reader.
      { id: 'services', label: 'Leistungen', target: { kind: 'route', routeId: 'services' } },
      { id: 'why', label: 'Warum wir', target: { kind: 'anchor', hash: '#warum-wir' } },
      { id: 'cleaning', label: 'Reinigung', target: { kind: 'anchor', hash: '#reinigungsservice' } },
      { id: 'contact', label: 'Kontakt', target: { kind: 'route', routeId: 'contact' } },
    ],
    footer: [
      {
        id: 'authorities',
        label: 'Einbürgerung & Behörden',
        target: { kind: 'service', serviceId: 'authorities' },
      },
      {
        id: 'marriage-translation',
        label: 'Ehe & Übersetzungen',
        target: { kind: 'service', serviceId: 'marriage-translation' },
      },
      {
        id: 'study-visa',
        label: 'Studium & Visa',
        target: { kind: 'service', serviceId: 'study-visa' },
      },
      {
        id: 'finance',
        label: 'Finanzen & Vorsorge',
        target: { kind: 'service', serviceId: 'finance' },
      },
      {
        id: 'real-estate',
        label: 'Immobilien & Investitionen',
        target: { kind: 'service', serviceId: 'real-estate' },
      },
      {
        id: 'cleaning',
        label: 'Reinigungsservice',
        target: { kind: 'service', serviceId: 'cleaning' },
      },
    ],
    // The Impressum label stays the German word in both locales - case law has
    // rejected "Kontakt", "Legal" and "Info" as substitutes.
    legal: [
      { id: 'imprint', label: 'Impressum', target: { kind: 'route', routeId: 'imprint' } },
      { id: 'privacy', label: 'Datenschutz', target: { kind: 'route', routeId: 'privacy' } },
    ],
  },

  hero: {
    eyebrow: 'Dienstleistungen & Reinigung in Dortmund',
    headline: 'Viele Anliegen. Ein Ansprechpartner.',
    lead:
      'Ob Behörden, Dokumente, Studium, Visa, Finanzen, Immobilien oder Reinigung: '
      + 'Zukunft Service unterstützt Sie bei organisatorischen und alltäglichen Anliegen – '
      + 'persönlich, verständlich und Schritt für Schritt.',
    primaryCta: {
      label: 'Anliegen schildern',
      hint: 'Unverbindlich und kostenlos anfragen',
    },
    secondaryCta: { label: 'Leistungen ansehen' },
    trust: [
      { id: 'personal', icon: 'HandHeart', label: 'Persönliche Begleitung' },
      // In Arabic script on the GERMAN page, deliberately: a large share of this
      // audience lands on /de/ from Google and must see it in one second.
      { id: 'languages', icon: 'MessagesSquare', label: 'Wir sprechen Arabisch · نتحدث العربية' },
      { id: 'steps', icon: 'Route', label: 'Klare nächste Schritte' },
    ],
    imageAlt:
      'Zwei Personen sichten gemeinsam Unterlagen an einem hellen Holztisch im Büro von '
      + 'Zukunft Service.',
  },

  pillars: [
    {
      id: 'office',
      index: '01',
      icon: 'FileText',
      title: 'Büroservice',
      body:
        'Behörden, Dokumente, Studium und Visa, Finanzen und Immobilien: Wir bereiten Ihre '
        + 'Unterlagen vor, ordnen die notwendigen Schritte und vermitteln bei Bedarf an '
        + 'geeignete Fachstellen.',
      linkLabel: 'Büroservice ansehen',
    },
    {
      id: 'cleaning',
      index: '02',
      icon: 'SprayCan',
      title: 'Reinigungsservice',
      body:
        'Professionelle Reinigung für Privatkunden, Unternehmen und Einrichtungen – '
        + 'einmalig oder regelmäßig, passend zu Ihrem Bedarf.',
      linkLabel: 'Reinigungsservice ansehen',
    },
  ],

  process: {
    heading: {
      eyebrow: 'So arbeiten wir',
      title: 'In drei Schritten zur Klarheit',
      lead:
        'Sie müssen nicht wissen, welches Formular Sie brauchen. Sie müssen uns nur erzählen, '
        + 'worum es geht.',
    },
    steps: [
      {
        id: 'schildern',
        index: '01',
        title: 'Anliegen schildern',
        body:
          'Sie beschreiben uns kurz Ihre Situation – auf Deutsch oder Arabisch, über das '
          + 'Formular, per WhatsApp oder am Telefon.',
      },
      {
        id: 'sortieren',
        index: '02',
        title: 'Gemeinsam sortieren',
        body:
          'Wir gehen durch, welche Unterlagen nötig sind, was bereits vorliegt und was noch '
          + 'fehlt.',
      },
      {
        id: 'schritte',
        index: '03',
        title: 'Nächste Schritte',
        body:
          'Sie erhalten eine klare Reihenfolge. Wo Fachwissen erforderlich ist, vermitteln wir '
          + 'an eine geeignete Fachstelle.',
      },
    ],
  },

  services: {
    heading: {
      eyebrow: 'Leistungen',
      title: 'Wie können wir Ihnen helfen?',
      lead:
        'Wir ordnen Ihr Anliegen und helfen Ihnen, die passenden nächsten Schritte zu finden.',
    },
    detailLabel: 'Mehr zu dieser Leistung →',
    note:
      'Wir bieten organisatorische und sprachliche Unterstützung und vermitteln bei Bedarf an '
      + 'geeignete Fachstellen.',
  },

  why: {
    heading: {
      eyebrow: 'Über uns',
      title: 'Warum Zukunft Service?',
      lead:
        'Wir sind kein Amt und keine Kanzlei. Wir sind der Ansprechpartner, der Ihnen hilft, '
        + 'den Überblick zu behalten.',
    },
    points: [
      {
        id: 'personal',
        icon: 'HandHeart',
        title: 'Persönliche Betreuung',
        body:
          'Sie haben einen direkten Ansprechpartner, der Ihr Anliegen kennt – keine wechselnden '
          + 'Zuständigkeiten.',
      },
      {
        id: 'one-hand',
        icon: 'Layers',
        title: 'Alles aus einer Hand',
        body:
          'Behörden, Dokumente, Studium, Finanzen, Immobilien und Reinigung: viele Leistungen an '
          + 'einer Stelle.',
      },
      {
        id: 'multilingual',
        icon: 'MessagesSquare',
        title: 'Mehrsprachige Unterstützung',
        body:
          'Wir sprechen Deutsch und Arabisch. Die Sprache soll nicht der Grund sein, warum ein '
          + 'Antrag liegen bleibt.',
      },
      {
        id: 'network',
        icon: 'Network',
        title: 'Gut vernetzt',
        body:
          'Wir arbeiten mit geeigneten Partnern und Fachstellen zusammen – Übersetzer, '
          + 'Finanzierungspartner, Beratungsstellen.',
      },
      {
        id: 'tailored',
        icon: 'Route',
        title: 'Individuelle Unterstützung',
        body:
          'Klare und einfache Schritte: Sie wissen, was von Ihnen verlangt wird und was der '
          + 'nächste Schritt ist.',
      },
    ],
  },

  cleaning: {
    heading: {
      eyebrow: 'Reinigungsservice',
      title: 'Sauberkeit, auf die Sie sich verlassen können',
      lead:
        'Neben unseren Büro- und Servicedienstleistungen bieten wir professionelle Reinigung '
        + 'für Privatkunden, Unternehmen und Einrichtungen.',
    },
    items: [
      'Büros',
      'Wohnungen',
      'Häuser',
      'Schulen',
      'Restaurants',
      'Geschäfte',
      'Praxen',
      'Gewerberäume',
      'Treppenhäuser',
      'Gemeinschaftsflächen',
    ],
    cta: {
      label: 'Reinigung anfragen',
      hint: 'Ob einmalig oder regelmäßig – wir finden eine passende Lösung für Ihren Bedarf.',
    },
    imageAlt:
      'Reinigungskraft in dunkelgrüner Arbeitskleidung reinigt einen Schreibtisch in einem '
      + 'hellen Büro.',
  },

  scope: {
    heading: {
      eyebrow: 'Klarheit',
      title: 'Was wir tun – und was nicht',
      lead:
        'Eine klare Grenze schützt Sie und uns. Deshalb steht sie hier und nicht im '
        + 'Kleingedruckten.',
    },
    doTitle: 'Das übernehmen wir',
    doItems: [
      'Unterlagen zusammenstellen, prüfen und vorbereiten',
      'Formulare und Anträge gemeinsam ausfüllen',
      'Schriftverkehr und Kommunikation mit Behörden organisieren',
      'Dokumente aus Syrien und dem Irak organisieren und beschaffen',
      'Termine, Fristen und nächste Schritte strukturieren',
      'Übersetzungen über geeignete, vereidigte Übersetzer vermitteln',
    ],
    dontTitle: 'Das übernehmen wir nicht',
    dontItems: [
      'Keine Rechts-, Steuer- oder Versicherungsberatung',
      'Keine Vertretung vor Gericht oder gegenüber Behörden',
      'Keine beglaubigten Übersetzungen im eigenen Namen',
      'Keine Zusage über den Ausgang eines Verfahrens – darüber entscheiden allein die '
        + 'zuständigen Stellen',
    ],
    notice: HEDGE_NOTICE,
  },

  contact: {
    heading: {
      eyebrow: 'Kontakt',
      title: 'Schildern Sie uns kurz Ihr Anliegen',
      lead:
        'Sie haben ein Anliegen und wissen nicht, wo Sie anfangen sollen? Schreiben Sie uns '
        + 'kurz Ihre Situation. Wir prüfen gemeinsam, welche Unterstützung für Ihr Anliegen '
        + 'passend ist.',
    },
    quickContact: {
      whatsapp: 'Per WhatsApp schreiben',
      call: 'Anrufen',
      email: 'E-Mail schreiben',
    },
    responseNote:
      'Außerhalb der Öffnungszeiten erreichen Sie uns jederzeit über das Formular oder per '
      + 'WhatsApp – wir melden uns in der Regel am nächsten Werktag.',
  },

  info: {
    hoursTitle: 'Öffnungszeiten',
    addressTitle: 'Adresse',
    contactTitle: 'Kontakt',
    mapsLabel: 'In Google Maps öffnen',
    closedLabel: 'Geschlossen',
    hoursNote: 'Termine außerhalb der Öffnungszeiten nach Vereinbarung.',
  },

  footer: {
    slogan: 'Viele Lösungen. Ein Ansprechpartner.',
    navTitle: 'Leistungen',
    legalTitle: 'Rechtliches',
    copyright: '© {year} Zukunft Service. Alle Rechte vorbehalten.',
  },

  form: {
    title: 'Ihr Anliegen',
    lead:
      'Felder mit Sternchen sind Pflichtfelder. Wir antworten in der Sprache, in der Sie uns '
      + 'schreiben.',
    service: {
      label: 'Worum geht es?',
      hint: 'Sie sind sich nicht sicher? Wählen Sie „Sonstiges" – das ist völlig in Ordnung.',
      options: [
        { value: 'authorities', label: 'Einbürgerung, Behörden & Dokumente' },
        { value: 'marriage-translation', label: 'Ehe, Übersetzungen & Dokumente' },
        { value: 'study-visa', label: 'Studium, Universität & Visa' },
        { value: 'finance', label: 'Finanzen, Kredite & Vorsorge' },
        { value: 'real-estate', label: 'Immobilien & Investitionen' },
        { value: 'cleaning', label: 'Reinigungsservice' },
        { value: 'other', label: 'Sonstiges / Ich bin mir nicht sicher' },
      ],
    },
    message: {
      label: 'Beschreiben Sie kurz Ihre Situation',
      hint:
        'Bitte senden Sie hier keine Ausweis-, Akten- oder Vorgangsnummern. Solche Angaben '
        + 'besprechen wir persönlich.',
    },
    name: { label: 'Name' },
    email: {
      label: 'E-Mail-Adresse',
      hint: 'Hierüber antworten wir Ihnen.',
    },
    phone: {
      label: 'Telefonnummer',
      hint: 'Mit Ländervorwahl, zum Beispiel 0049 für Deutschland oder 00963 für Syrien.',
    },
    whatsappOptIn: {
      label: 'Sie dürfen mir per WhatsApp antworten',
      hint: 'Dafür benötigen wir Ihre Telefonnummer.',
    },
    preferredTime: {
      label: 'Bevorzugte Kontaktzeit',
      options: [
        { value: 'morning', label: 'Vormittags (10–13 Uhr)' },
        { value: 'afternoon', label: 'Nachmittags (13–16 Uhr)' },
        { value: 'any', label: 'Egal' },
      ],
    },
    honeypot: { label: 'Dieses Feld bitte frei lassen' },
    submit: 'Anfrage senden',
    submitting: 'Wird gesendet …',
    successTitle: 'Vielen Dank.',
    successBody:
      'Ihre Anfrage ist bei uns eingegangen. Wir melden uns in der Regel innerhalb eines '
      + 'Werktages.',
    errorTitle: 'Die Nachricht konnte nicht gesendet werden.',
    errorBody: 'Bitte versuchen Sie es erneut oder schreiben Sie uns per WhatsApp.',
    errorSummaryTitle: 'Bitte prüfen Sie diese Angaben:',
    requiredLabel: 'Pflichtfeld',
    optionalLabel: 'Optional',
    privacyNotice:
      'Ihre Angaben verwenden wir ausschließlich, um Ihre Anfrage zu bearbeiten. Weitere '
      + 'Hinweise finden Sie in der',
    privacyLinkLabel: 'Datenschutzerklärung',
    hedgeNotice: HEDGE_NOTICE,
    validation: {
      required: 'Dieses Feld wird benötigt.',
      nameTooShort: 'Bitte geben Sie mindestens zwei Zeichen ein.',
      emailInvalid: 'Bitte prüfen Sie die E-Mail-Adresse.',
      messageTooShort: 'Bitte beschreiben Sie Ihr Anliegen in mindestens zehn Zeichen.',
      messageTooLong: 'Bitte fassen Sie sich etwas kürzer – höchstens 2.000 Zeichen.',
      phoneInvalid: 'Bitte prüfen Sie die Telefonnummer.',
      phoneRequiredForWhatsapp:
        'Für eine Antwort per WhatsApp benötigen wir Ihre Telefonnummer.',
    },
  },

  a11y: {
    skipToContent: 'Zum Inhalt springen',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    menuLabel: 'Hauptnavigation',
    languageGroupLabel: 'Sprache',
    breadcrumbLabel: 'Sie sind hier',
    whatsappFab: 'Per WhatsApp schreiben',
    currentPage: 'Aktuelle Seite',
    loading: 'Wird geladen …',
    externalLinkHint: 'Öffnet in einem neuen Tab',
  },
};
