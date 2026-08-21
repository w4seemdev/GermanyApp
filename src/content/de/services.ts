/**
 * GERMAN SERVICE CONTENT - the six verticals, in full.
 *
 * Source: the client's own German PDF, via docs/research/00-source-brief.md §3.
 * The wording here is the client's, lightly normalised for the web. It is NOT
 * authored marketing copy, which matters: four of these six services describe
 * regulated activity, and the client's own phrasing is what they have chosen to
 * stand behind.
 *
 * BLOCK SHAPES: every service is `ServiceBlock[]`. A service with a flat list is
 * one untitled list block; a service with sub-sections is several titled ones.
 * That is deliberate - the same service is flat in Arabic and sub-blocked in
 * German, so modelling "flat service" and "sub-block service" as separate types
 * would make one service two types in two languages.
 *
 * HEDGING IS LOAD-BEARING in `finance` and `real-estate`. Insurance brokerage
 * needs § 34d GewO licensing, property and loan brokerage § 34c / § 34i, and
 * debt counselling is regulated under the RDG. Every verb in those two services
 * is organisational: vorbereiten, zusammenstellen, organisieren, vermitteln an.
 * Never "wir beraten", never "wir vermitteln Kredite".
 */

import type { ServiceContent, ServiceId } from '@/types/content';

export const deServices: Record<ServiceId, ServiceContent> = {
  authorities: {
    id: 'authorities',
    eyebrow: 'Leistung 01',
    title: 'Einbürgerung, Behörden & Dokumente',
    cardTitle: 'Einbürgerung, Behörden & Dokumente',
    cardDescription:
      'Anträge auf Einbürgerung, Aufenthalt und Meldeangelegenheiten: Wir stellen die Unterlagen zusammen, füllen Formulare mit Ihnen aus und koordinieren die Termine.',
    imageAlt: 'Sortierte Antragsunterlagen und Formulare auf einem Schreibtisch.',
    intro:
      'Behördliche Verfahren und Dokumente können kompliziert und zeitaufwendig sein. Wir unterstützen Sie bei der Vorbereitung Ihrer Unterlagen und bei den organisatorischen Schritten rund um Ihr Anliegen.',
    blocks: [
      {
        kind: 'list',
        id: 'authorities-main',
        layout: 'checks',
        items: [
          'Unterstützung bei der Vorbereitung von Einbürgerungsanträgen',
          'Zusammenstellung und Prüfung der erforderlichen Unterlagen',
          'Hilfe beim Ausfüllen von Formularen und Anträgen',
          'Unterstützung bei Schriftverkehr und Kommunikation mit Behörden',
          'Organisation und Beschaffung syrischer Dokumente',
          'Organisation und Beschaffung irakischer Dokumente',
          'Unterstützung bei Angelegenheiten rund um syrische und irakische Reisepässe',
          'Geburtsurkunden, Heiratsurkunden und Personenstandsdokumente',
          'Register- und Personenstandsauszüge',
          'Vorbereitung von Unterlagen für Beglaubigungen und weitere amtliche Verfahren',
        ],
      },
    ],
    closing:
      'Sie wissen nicht, welche Unterlagen Sie benötigen? Sprechen Sie uns an, wir helfen Ihnen, die nächsten Schritte übersichtlich zu strukturieren.',
    seo: {
      title: 'Einbürgerung, Behörden & Dokumente in Dortmund',
      description:
        'Unterstützung bei Einbürgerungsanträgen, Behördenpost, Personenstandsdokumenten sowie syrischen und irakischen Urkunden. Zukunft Service in Dortmund, auf Deutsch und Arabisch.',
    },
    status: 'final',
  },

  'marriage-translation': {
    id: 'marriage-translation',
    eyebrow: 'Leistung 02',
    title: 'Ehe, Übersetzungen & internationale Dokumente',
    cardTitle: 'Ehe, Übersetzungen & internationale Dokumente',
    cardDescription:
      'Eheschließung, Familiennachzug und Urkunden aus dem Ausland. Beglaubigte Übersetzungen organisieren wir über vereidigte Übersetzerinnen und Übersetzer.',
    imageAlt: 'Ausländische Urkunden mit beigefügter Übersetzung.',
    intro:
      'Wir unterstützen Sie bei ausländischen Dokumenten und organisatorischen Fragen rund um Übersetzung, Beglaubigung und Eheschließung.',
    blocks: [
      {
        kind: 'list',
        id: 'marriage-main',
        layout: 'checks',
        items: [
          'Übersetzung von Dokumenten über geeignete Übersetzer',
          'Vorbereitung von Unterlagen für Beglaubigungen',
          'Vorbereitung ausländischer Urkunden für deutsche Behörden',
          'Heiratsurkunden und weitere Dokumente zur Eheschließung',
          'Unterstützung bei der Registrierung und Anerkennung von Eheschließungen in Deutschland',
          'Beschaffung fehlender Personenstands- und Familienstandsdokumente',
        ],
      },
      {
        kind: 'prose',
        id: 'translation-service',
        title: 'Übersetzungsservice',
        body:
          'Über unser Netzwerk vermitteln wir Übersetzer für unterschiedliche Anliegen, zum Beispiel für Behörden, Dokumente, Termine, Anträge sowie persönliche oder geschäftliche Unterlagen.',
      },
    ],
    seo: {
      title: 'Ehe, Übersetzungen & internationale Dokumente in Dortmund',
      description:
        'Organisatorische Unterstützung bei Eheschließung, Anerkennung ausländischer Urkunden und Übersetzungen über vereidigte Übersetzer. Zukunft Service Dortmund.',
    },
    status: 'final',
  },

  'study-visa': {
    id: 'study-visa',
    eyebrow: 'Leistung 03',
    title: 'Studium, Universität & Visa',
    cardTitle: 'Studium, Universität & Visa',
    cardDescription:
      'Bewerbung, Immatrikulation, Sperrkonto und Visumsantrag: Wir bereiten die Unterlagen vor und behalten die Fristen im Blick.',
    imageAlt: 'Studentin mit Bewerbungsunterlagen vor einem Universitätsgebäude.',
    intro:
      'Sie möchten in Deutschland oder Europa studieren oder benötigen Unterstützung bei der Vorbereitung eines Visumantrags? Wir helfen Ihnen bei den organisatorischen Schritten.',
    blocks: [
      {
        kind: 'list',
        id: 'study',
        title: 'Studium & Universität',
        layout: 'checks',
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
        kind: 'list',
        id: 'visa',
        title: 'Visa',
        layout: 'two-column',
        items: [
          'Studienvisa',
          'Schengen-Visa',
          'Touristenvisa',
          'Besuchsvisa',
          'Vorbereitung und strukturierte Zusammenstellung der erforderlichen Unterlagen',
        ],
      },
      {
        // The strongest differentiator in the whole PDF: support does not stop
        // at the visa. Given its own highlight block rather than a bullet.
        kind: 'highlight',
        id: 'after-arrival',
        title: 'Auch nach der Ankunft sind wir für Sie da',
        intro:
          'Unsere Unterstützung endet nicht mit dem Visum oder der Einreise nach Deutschland. Gerade in der ersten Zeit begleiten wir Studierende bei den wichtigsten organisatorischen Schritten und helfen dabei, den Start in Deutschland so einfach wie möglich zu gestalten.',
        items: [
          'Suche nach einer geeigneten Unterkunft',
          'Unterstützung bei der Anmeldung beim Einwohnermeldeamt',
          'Orientierung und Begleitung bei wichtigen Behördengängen',
          'Vorbereitung notwendiger Unterlagen',
          'Organisatorische Unterstützung rund um Universität und Studienbeginn',
          'Orientierung bei den ersten Schritten im Alltag in Deutschland',
        ],
        closing:
          'Vom ersten Antrag bis zu den ersten Schritten in Deutschland begleiten wir Sie auf Ihrem Weg.',
      },
    ],
    seo: {
      title: 'Studium, Universität & Visa in Dortmund',
      description:
        'Unterstützung bei Hochschulbewerbung, Zulassung, Studienvisum und Schengen-Visum, und auch nach der Ankunft in Deutschland. Zukunft Service Dortmund.',
    },
    status: 'final',
  },

  finance: {
    id: 'finance',
    eyebrow: 'Leistung 04',
    title: 'Finanzen, Kredite & Vorsorge',
    cardTitle: 'Finanzen, Kredite & Vorsorge',
    cardDescription:
      'Wir helfen Ihnen, Unterlagen zu sortieren, Formulare zu verstehen und Termine bei Banken und Versicherungen vorzubereiten, und vermitteln an zugelassene Fachleute.',
    imageAlt: 'Geordnete Finanzunterlagen und ein Taschenrechner auf einem Tisch.',
    intro:
      'Bei finanziellen Themen unterstützen wir Sie organisatorisch und vermitteln bei Bedarf an geeignete Partner oder Fachstellen.',
    blocks: [
      {
        kind: 'list',
        id: 'credit',
        title: 'Kredite & Finanzierung',
        layout: 'checks',
        items: [
          'Vorbereitung von Kreditanfragen',
          'Zusammenstellung erforderlicher Unterlagen und Nachweise',
          'Unterstützung bei Finanzierungsanfragen',
          'Vermittlung an geeignete Finanzierungspartner',
          'Vorbereitung einer möglichen Immobilienfinanzierung',
        ],
      },
      {
        kind: 'list',
        id: 'insolvency',
        title: 'Finanzielle Schwierigkeiten & Insolvenz',
        layout: 'checks',
        items: [
          'Sortierung und Vorbereitung finanzieller Unterlagen',
          'Organisatorische Vorbereitung einer möglichen Privatinsolvenz',
          'Kontaktaufnahme mit geeigneten Beratungsstellen oder Fachpartnern',
          'Zusammenstellung erforderlicher Dokumente',
        ],
      },
      {
        kind: 'list',
        id: 'insurance',
        title: 'Versicherungen & Vorsorge',
        intro: 'Über geeignete Partner vermitteln wir Unterstützung zu Themen wie:',
        layout: 'checks',
        items: [
          'Lebensversicherung',
          'Alters- und Zukunftsvorsorge',
          'Absicherung der Familie',
          'Sterbegeld- und Bestattungsvorsorge',
          'Weitere Versicherungsangebote je nach Bedarf',
        ],
      },
    ],
    legalNote:
      'Wir erbringen in diesem Bereich ausschließlich organisatorische Unterstützung. Wir leisten keine Rechts-, Steuer-, Anlage-, Schuldner- oder Versicherungsberatung und vermitteln keine Kredite. Die Beratung selbst übernehmen zugelassene Fachleute, an die wir Sie auf Wunsch vermitteln.',
    seo: {
      title: 'Finanzen, Kredite & Vorsorge: organisatorische Unterstützung in Dortmund',
      description:
        'Organisatorische Vorbereitung von Kreditanfragen, Unterlagen bei finanziellen Schwierigkeiten und Vermittlung an geeignete Partner für Versicherung und Vorsorge. Keine Finanzberatung.',
    },
    status: 'final',
  },

  'real-estate': {
    id: 'real-estate',
    eyebrow: 'Leistung 05',
    title: 'Immobilien & Investitionen',
    cardTitle: 'Immobilien & Investitionen',
    cardDescription:
      'Organisatorische Begleitung rund um Immobilienunterlagen, Behördengänge und Termine. Die Beratung selbst übernehmen zugelassene Maklerinnen und Fachstellen.',
    imageAlt: 'Grundriss und Immobilienunterlagen auf einem Besprechungstisch.',
    intro:
      'Sie möchten eine Immobilie kaufen oder interessieren sich für Investitionsmöglichkeiten? Wir unterstützen Sie bei der Orientierung, Vorbereitung und Vermittlung an passende Ansprechpartner.',
    blocks: [
      {
        kind: 'list',
        id: 'property-de',
        title: 'Immobilien in Deutschland',
        layout: 'checks',
        items: [
          'Orientierung rund um den Immobilienkauf',
          'Vorbereitung einer möglichen Immobilienfinanzierung',
          'Zusammenstellung benötigter Unterlagen',
          'Kontakt zu geeigneten Partnern',
          'Strukturierung der nächsten Schritte beim geplanten Immobilienkauf',
        ],
      },
      {
        kind: 'list',
        id: 'property-dubai',
        title: 'Immobilien & Investitionen in Dubai',
        layout: 'checks',
        items: [
          'Informationen zu verfügbaren Immobilienprojekten',
          'Vermittlung von Immobilienangeboten in Dubai',
          'Kontakt zu Projektentwicklern und Partnern',
          'Organisation von Gesprächen und Terminen',
          'Begleitung des Vermittlungsprozesses',
        ],
      },
    ],
    closing: 'Ein Ansprechpartner in Deutschland, für Ihre Möglichkeiten in Dubai.',
    legalNote:
      'Wir erbringen organisatorische Unterstützung und stellen Kontakte her. Eine Anlage-, Rechts- oder Steuerberatung ist damit nicht verbunden, und wir treffen keine Aussage über die Werthaltigkeit oder Rendite eines Objekts. Prüfen Sie jedes Angebot mit fachlicher Begleitung.',
    seo: {
      title: 'Immobilien & Investitionen in Dortmund und Dubai',
      description:
        'Orientierung und organisatorische Begleitung beim Immobilienkauf in Deutschland sowie Kontakt zu Projektpartnern in Dubai. Ein Ansprechpartner in Dortmund.',
    },
    status: 'final',
  },

  cleaning: {
    id: 'cleaning',
    eyebrow: 'Leistung 06',
    title: 'Reinigungsservice',
    cardTitle: 'Reinigungsservice',
    cardDescription:
      'Unterhaltsreinigung, Grundreinigung und Reinigung nach Umzug oder Renovierung, für Privathaushalte, Büros und Praxen in Dortmund und Umgebung.',
    imageAlt: 'Gereinigtes, helles Büro mit aufgeräumten Schreibtischen.',
    intro:
      'Neben unseren Büro- und Servicedienstleistungen bieten wir professionelle Reinigung für Privatkunden, Unternehmen und Einrichtungen.',
    blocks: [
      {
        kind: 'list',
        id: 'cleaning-places',
        title: 'Wir reinigen unter anderem',
        layout: 'two-column',
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
      },
    ],
    closing:
      'Ob einmalige Reinigung oder regelmäßiger Reinigungsservice, wir finden eine passende Lösung für Ihren Bedarf.',
    seo: {
      title: 'Reinigungsservice in Dortmund für Büro, Wohnung und Gewerbe',
      description:
        'Professionelle Reinigung für Büros, Wohnungen, Häuser, Praxen, Schulen und Gewerberäume in Dortmund. Einmalig oder regelmäßig.',
    },
    status: 'final',
  },
};
