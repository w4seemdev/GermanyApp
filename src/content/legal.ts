/**
 * Impressum and Datenschutz strings, both locales in one module because the two
 * pages share a rigid structure dictated by law rather than by design.
 *
 * WHAT IS STILL MISSING is deliberate and visible. § 5 DDG (which replaced
 * § 5 TMG in May 2024) requires the full legal name including legal form, the
 * representative, and register details where they exist. Those are still «…»
 * sentinels in NAP. A missing or defective Impressum is actionable under
 * § 3a UWG and the first warning letter typically costs more than this whole
 * project, so the gap renders as a visible banner rather than being quietly
 * omitted — and `hasUnresolvedPlaceholders()` exists to fail a release check.
 *
 * This is a structural shell, not legal advice. The client should have the
 * final wording reviewed before launch.
 */

import type { Locale } from '@/types/content';

export interface LegalStrings {
  imprintTitle: string;
  imprintLead: string;
  providerHeading: string;
  contactHeading: string;
  representativeHeading: string;
  registerHeading: string;
  vatHeading: string;
  disputeHeading: string;
  disputeBody: string;
  liabilityHeading: string;
  liabilityBody: string;
  pendingBanner: string;

  privacyTitle: string;
  privacyLead: string;
  controllerHeading: string;
  formDataHeading: string;
  formDataBody: string;
  legalBasisHeading: string;
  legalBasisBody: string;
  hostingHeading: string;
  hostingBody: string;
  retentionHeading: string;
  retentionBody: string;
  rightsHeading: string;
  rightsBody: string;
  rightsList: readonly string[];
  noTrackingHeading: string;
  noTrackingBody: string;
}

export const LEGAL: Record<Locale, LegalStrings> = {
  de: {
    imprintTitle: 'Impressum',
    imprintLead: 'Angaben gemäß § 5 DDG.',
    providerHeading: 'Diensteanbieter',
    contactHeading: 'Kontakt',
    representativeHeading: 'Vertretungsberechtigte Person',
    registerHeading: 'Registereintrag',
    vatHeading: 'Umsatzsteuer-Identifikationsnummer',
    disputeHeading: 'Streitschlichtung',
    disputeBody:
      'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    liabilityHeading: 'Haftung für Inhalte und Links',
    liabilityBody:
      'Die Inhalte dieser Seiten wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität können wir jedoch keine Gewähr übernehmen. Für die Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich.',
    pendingBanner:
      'Hinweis an den Betreiber: Die mit «…» markierten Angaben sind gesetzlich vorgeschrieben und müssen vor der Veröffentlichung ergänzt werden.',

    privacyTitle: 'Datenschutzerklärung',
    privacyLead: 'Informationen zur Verarbeitung Ihrer personenbezogenen Daten nach Art. 13 DSGVO.',
    controllerHeading: 'Verantwortlicher',
    formDataHeading: 'Daten aus dem Kontaktformular',
    formDataBody:
      'Wenn Sie uns über das Kontaktformular schreiben, verarbeiten wir die von Ihnen angegebenen Daten — Anliegen, Nachricht, Name, E-Mail-Adresse sowie, sofern angegeben, Telefonnummer und bevorzugte Erreichbarkeit — ausschließlich, um Ihre Anfrage zu bearbeiten und zu beantworten.',
    legalBasisHeading: 'Rechtsgrundlage',
    legalBasisBody:
      'Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf den Abschluss eines Vertrags gerichtet ist, im Übrigen auf Grundlage unseres berechtigten Interesses an der Beantwortung von Anfragen nach Art. 6 Abs. 1 lit. f DSGVO.',
    hostingHeading: 'Hosting und Schriftarten',
    hostingBody:
      'Diese Website lädt keine Schriftarten von externen Servern. Alle Schriften werden von unserem eigenen Server ausgeliefert, sodass beim Aufruf der Seite keine Verbindung zu Google Fonts hergestellt wird. Es ist keine Karte eingebettet; der Link zu Google Maps wird erst durch Ihren Klick aufgerufen.',
    retentionHeading: 'Speicherdauer',
    retentionBody:
      'Wir speichern Ihre Anfrage so lange, wie es zur Bearbeitung erforderlich ist, und löschen sie anschließend, sofern keine gesetzlichen Aufbewahrungsfristen entgegenstehen.',
    rightsHeading: 'Ihre Rechte',
    rightsBody: 'Ihnen stehen uns gegenüber folgende Rechte zu:',
    rightsList: [
      'Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)',
      'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
      'Löschung (Art. 17 DSGVO)',
      'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
      'Datenübertragbarkeit (Art. 20 DSGVO)',
      'Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)',
      'Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)',
    ],
    noTrackingHeading: 'Keine Analyse- und Trackingdienste',
    noTrackingBody:
      'Diese Website verwendet keine Analyse-, Tracking- oder Werbedienste und setzt keine Cookies, die eine Einwilligung nach § 25 TDDDG erfordern würden.',
  },

  ar: {
    // "Impressum" is kept as the German legal term in both locales: it is the
    // label German case law expects, and a translated heading has been held
    // insufficient.
    imprintTitle: 'Impressum',
    imprintLead: 'بيانات مقدم الخدمة وفق المادة 5 من قانون الخدمات الرقمية (DDG).',
    providerHeading: 'مقدم الخدمة',
    contactHeading: 'التواصل',
    representativeHeading: 'الشخص المفوض بالتمثيل',
    registerHeading: 'القيد في السجل التجاري',
    vatHeading: 'الرقم الضريبي لضريبة القيمة المضافة',
    disputeHeading: 'تسوية النزاعات',
    disputeBody:
      'لسنا مستعدين للمشاركة في إجراءات تسوية النزاعات أمام هيئة تحكيم استهلاكية ولسنا ملزمين بذلك.',
    liabilityHeading: 'المسؤولية عن المحتوى والروابط',
    liabilityBody:
      'أعددنا محتوى هذه الصفحات بعناية، غير أننا لا نضمن دقته أو اكتماله أو تحديثه. أما محتوى الروابط الخارجية فيتحمل مسؤوليته مشغلوها وحدهم.',
    pendingBanner:
      'ملاحظة لمالك الموقع: البيانات المؤشر عليها بعلامة «…» إلزامية قانونًا ويجب استكمالها قبل النشر.',

    privacyTitle: 'سياسة حماية البيانات',
    privacyLead: 'معلومات عن معالجة بياناتك الشخصية وفق المادة 13 من اللائحة الأوروبية DSGVO.',
    controllerHeading: 'الجهة المسؤولة',
    formDataHeading: 'البيانات الواردة عبر نموذج التواصل',
    formDataBody:
      'عندما تراسلنا عبر نموذج التواصل، نعالج البيانات التي تدخلها — موضوع الطلب والرسالة والاسم والبريد الإلكتروني، وكذلك رقم الهاتف ووقت التواصل المفضل إن ذكرتهما — لغرض معالجة طلبك والرد عليه فقط.',
    legalBasisHeading: 'الأساس القانوني',
    legalBasisBody:
      'تتم المعالجة استنادًا إلى المادة 6 فقرة 1 (ب) من DSGVO متى كان طلبك متعلقًا بإبرام عقد، وفيما عدا ذلك استنادًا إلى مصلحتنا المشروعة في الرد على الاستفسارات وفق المادة 6 فقرة 1 (و).',
    hostingHeading: 'الاستضافة والخطوط',
    hostingBody:
      'لا يحمل هذا الموقع أي خطوط من خوادم خارجية، بل تقدم جميع الخطوط من خادمنا، فلا يجري أي اتصال بخدمة Google Fonts عند فتح الصفحة. كما لا توجد خريطة مضمنة، ولا يفتح رابط خرائط جوجل إلا بنقرة منك.',
    retentionHeading: 'مدة الحفظ',
    retentionBody:
      'نحتفظ بطلبك طوال المدة اللازمة لمعالجته، ثم نحذفه ما لم تكن هناك مدد حفظ إلزامية بموجب القانون.',
    rightsHeading: 'حقوقك',
    rightsBody: 'تتمتع تجاهنا بالحقوق التالية:',
    rightsList: [
      'الاطلاع على البيانات المحفوظة عنك (المادة 15)',
      'تصحيح البيانات غير الصحيحة (المادة 16)',
      'الحذف (المادة 17)',
      'تقييد المعالجة (المادة 18)',
      'نقل البيانات (المادة 20)',
      'الاعتراض على المعالجة (المادة 21)',
      'تقديم شكوى إلى هيئة رقابية (المادة 77)',
    ],
    noTrackingHeading: 'لا خدمات تحليل أو تتبع',
    noTrackingBody:
      'لا يستخدم هذا الموقع أي خدمات تحليل أو تتبع أو إعلانات، ولا يضع أي ملفات تعريف ارتباط تستوجب موافقتك وفق المادة 25 من قانون TDDDG.',
  },
};
