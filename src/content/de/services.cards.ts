/**
 * German service-card copy for the home-page grid and the /leistungen index.
 *
 * HEDGING IS LOAD-BEARING in cards 04 and 05. "Finanzen" and "Immobilien" are
 * § 34c / § 34d GewO territory: the copy describes accompanying paperwork and
 * appointments, never brokerage, recommendation or advice. Do not "tighten"
 * these into a benefit promise.
 */

import type { ServiceId } from '@/types/content';

export interface ServiceCard {
  title: string;
  description: string;
}

export const deServiceCards: Record<ServiceId, ServiceCard> = {
  authorities: {
    title: 'Einbürgerung, Behörden & Dokumente',
    description:
      'Anträge auf Einbürgerung, Aufenthalt und Meldeangelegenheiten: Wir stellen die Unterlagen zusammen, füllen Formulare mit Ihnen aus und koordinieren die Termine.',
  },
  'marriage-translation': {
    title: 'Ehe, Übersetzungen & internationale Dokumente',
    description:
      'Eheschließung, Familiennachzug und Urkunden aus dem Ausland. Beglaubigte Übersetzungen organisieren wir über vereidigte Übersetzerinnen und Übersetzer.',
  },
  'study-visa': {
    title: 'Studium, Universität & Visa',
    description:
      'Bewerbung, Immatrikulation, Sperrkonto und Visumsantrag: Wir bereiten die Unterlagen vor und behalten die Fristen im Blick.',
  },
  finance: {
    title: 'Finanzen, Kredite & Vorsorge',
    description:
      'Wir helfen Ihnen, Unterlagen zu sortieren, Formulare zu verstehen und Termine bei Banken und Versicherungen vorzubereiten — und vermitteln an zugelassene Fachleute.',
  },
  'real-estate': {
    title: 'Immobilien & Investitionen',
    description:
      'Organisatorische Begleitung rund um Immobilienunterlagen, Behördengänge und Termine. Die Beratung selbst übernehmen zugelassene Maklerinnen und Fachstellen.',
  },
  cleaning: {
    title: 'Reinigungsservice',
    description:
      'Unterhaltsreinigung, Grundreinigung und Reinigung nach Umzug oder Renovierung — für Privathaushalte, Büros und Praxen in Dortmund und Umgebung.',
  },
};
