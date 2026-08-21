/**
 * ARABIC SERVICE CONTENT - the six verticals.
 *
 * Source: the client's Arabic PDF via docs/research/00-source-brief.md §3.
 *
 * THIS IS NOT A TRANSLATION OF THE GERMAN FILE, and the differences are the
 * client's, not ours. The brief records three structural divergences and this
 * file reproduces them rather than flattening them out:
 *
 *   1. `study-visa` OMITS the "Auch nach der Ankunft" post-arrival block. The
 *      German PDF has it; the Arabic one does not.
 *   2. `finance` merges Kredite + Insolvenz + Versicherungen into ONE flat list.
 *      German splits them into three titled sub-blocks.
 *   3. `cleaning` lists المنازل and الشقق as separate entries.
 *
 * This is exactly why ServiceContent models `blocks` as a free-form array while
 * keeping id, slug, icon and order on the locale-invariant spine: the two
 * languages genuinely differ in body, never in structure-critical metadata.
 *
 * STATUS: every entry is `draft-needs-client-approval`. The German copy is the
 * client's verbatim wording; the Arabic below is authored to their documented
 * Arabic structure and needs a named human to approve it before launch, because
 * it describes regulated activity. See docs/PLAN.md open question 4.
 */

import type { ServiceContent, ServiceId } from '@/types/content';

/** Repeated verbatim in the two high-sensitivity services. Defined once so the
 *  hedge cannot drift between them. */
const LEGAL_NOTE =
  'نقدم في هذا المجال دعمًا تنظيميًا فقط. نحن لا نقدم استشارات قانونية أو ضريبية أو '
  + 'استثمارية أو تأمينية، ولا نتوسط في منح القروض. أما الاستشارة نفسها فيتولاها '
  + 'مختصون مرخصون نحيلك إليهم عند الطلب.';

export const arServices: Record<ServiceId, ServiceContent> = {
  authorities: {
    id: 'authorities',
    eyebrow: 'الخدمة 01',
    title: 'التجنيس والمعاملات الرسمية والوثائق',
    cardTitle: 'التجنيس والدوائر الرسمية والوثائق',
    cardDescription:
      'طلبات التجنيس والإقامة وشؤون التسجيل: نجهز لك الأوراق، ونعبئ الاستمارات معك، وننسق المواعيد.',
    imageAlt: 'أوراق ومعاملات مرتبة على مكتب.',
    intro:
      'قد تكون المعاملات الرسمية والوثائق معقدة وتستغرق وقتًا طويلًا. نساعدك في تجهيز أوراقك وفي الخطوات التنظيمية المتعلقة بمعاملتك.',
    blocks: [
      {
        kind: 'list',
        id: 'authorities-main',
        layout: 'checks',
        items: [
          'المساعدة في تجهيز طلبات التجنيس',
          'تجميع الأوراق المطلوبة والتأكد من اكتمالها',
          'المساعدة في تعبئة الاستمارات والطلبات',
          'المساعدة في المراسلات والتواصل مع الدوائر الرسمية',
          'تنظيم واستخراج الوثائق السورية',
          'تنظيم واستخراج الوثائق العراقية',
          'المساعدة في الأمور المتعلقة بجوازات السفر السورية والعراقية',
          'شهادات الميلاد وعقود الزواج ووثائق الأحوال المدنية',
          'إخراج القيد وبيانات الولادة',
          'تجهيز الأوراق اللازمة للتصديق وللمعاملات الرسمية الأخرى',
        ],
      },
    ],
    closing:
      'لا تعرف ما هي الأوراق التي تحتاجها؟ تواصل معنا ونساعدك في ترتيب الخطوات التالية بوضوح.',
    seo: {
      title: 'التجنيس والمعاملات الرسمية والوثائق في دورتموند',
      description:
        'مساعدة في طلبات التجنيس ومراسلات الدوائر الرسمية ووثائق الأحوال المدنية والوثائق السورية والعراقية. Zukunft Service في دورتموند، بالعربية والألمانية.',
    },
    status: 'draft-needs-client-approval',
  },

  'marriage-translation': {
    id: 'marriage-translation',
    eyebrow: 'الخدمة 02',
    title: 'الزواج والترجمة وتصديق الوثائق',
    cardTitle: 'الزواج والترجمات والوثائق الدولية',
    cardDescription:
      'عقود الزواج ولم شمل العائلة والوثائق الصادرة خارج ألمانيا. أما الترجمات المحلفة فننظمها لدى مترجمين محلفين معتمدين.',
    imageAlt: 'وثائق صادرة خارج ألمانيا مرفقة بترجمتها.',
    intro:
      'نساعدك في الوثائق الصادرة خارج ألمانيا وفي المسائل التنظيمية المتعلقة بالترجمة والتصديق وعقد الزواج.',
    blocks: [
      {
        kind: 'list',
        id: 'marriage-main',
        layout: 'checks',
        items: [
          'ترجمة الوثائق عبر مترجمين مناسبين',
          'تجهيز الأوراق اللازمة للتصديق',
          'تجهيز الوثائق الأجنبية لتقديمها إلى الدوائر الألمانية',
          'عقود الزواج والوثائق الأخرى المتعلقة بالزواج',
          'المساعدة في تسجيل الزواج والاعتراف به في ألمانيا',
          'استخراج وثائق الأحوال المدنية والحالة العائلية الناقصة',
        ],
      },
      {
        kind: 'prose',
        id: 'translation-service',
        title: 'خدمة الترجمة',
        body:
          'من خلال شبكة علاقاتنا نوصلك بمترجمين لمختلف الأغراض، كالدوائر الرسمية والوثائق والمواعيد والطلبات والأوراق الشخصية أو التجارية.',
      },
    ],
    seo: {
      title: 'الزواج والترجمة وتصديق الوثائق في دورتموند',
      description:
        'دعم تنظيمي في عقد الزواج والاعتراف بالوثائق الأجنبية والترجمات عبر مترجمين محلفين. Zukunft Service دورتموند.',
    },
    status: 'draft-needs-client-approval',
  },

  'study-visa': {
    id: 'study-visa',
    eyebrow: 'الخدمة 03',
    title: 'الدراسة والجامعات والتأشيرات',
    cardTitle: 'الدراسة والجامعة والتأشيرات',
    cardDescription:
      'التقديم والتسجيل والحساب المجمد وطلب التأشيرة: نجهز الأوراق ونتابع المواعيد النهائية معك.',
    imageAlt: 'طالبة تحمل أوراق التقديم أمام مبنى جامعي.',
    intro:
      'ترغب في الدراسة في ألمانيا أو أوروبا، أو تحتاج إلى مساعدة في تجهيز طلب تأشيرة؟ نساعدك في الخطوات التنظيمية.',
    // NOTE: the Arabic PDF has no post-arrival block. Do not add one here to
    // "match" the German file - the asymmetry is the client's own.
    blocks: [
      {
        kind: 'list',
        id: 'study',
        title: 'الدراسة والجامعة',
        layout: 'checks',
        items: [
          'البحث عن فرص دراسية مناسبة',
          'المساعدة في التقديم إلى الجامعات',
          'تجهيز أوراق التقديم وتجميعها',
          'المساعدة في إجراءات القبول',
          'تنظيم الوثائق المطلوبة',
          'تجهيز الأوراق اللازمة لتأشيرة الدراسة',
        ],
      },
      {
        kind: 'list',
        id: 'visa',
        title: 'التأشيرات',
        layout: 'two-column',
        items: [
          'تأشيرات الدراسة',
          'تأشيرات شنغن',
          'التأشيرات السياحية',
          'تأشيرات الزيارة',
          'تجهيز الأوراق المطلوبة وترتيبها بشكل منظم',
        ],
      },
    ],
    seo: {
      title: 'الدراسة والجامعات والتأشيرات في دورتموند',
      description:
        'مساعدة في التقديم الجامعي وإجراءات القبول وتأشيرة الدراسة وتأشيرة شنغن. Zukunft Service دورتموند.',
    },
    status: 'draft-needs-client-approval',
  },

  finance: {
    id: 'finance',
    eyebrow: 'الخدمة 04',
    title: 'الأمور المالية والقروض والتأمين',
    cardTitle: 'الشؤون المالية والقروض والادخار',
    cardDescription:
      'نساعدك في ترتيب الأوراق وفهم الاستمارات وتحضير المواعيد لدى البنوك وشركات التأمين، ونحيلك إلى المختصين المرخصين.',
    imageAlt: 'أوراق مالية مرتبة وآلة حاسبة على طاولة.',
    intro:
      'في المسائل المالية نقدم لك دعمًا تنظيميًا، ونحيلك عند الحاجة إلى شركاء أو جهات مختصة مناسبة.',
    // NOTE: one flat list here, against three titled sub-blocks in German. That
    // is how the client's Arabic PDF is organised.
    blocks: [
      {
        kind: 'list',
        id: 'finance-main',
        layout: 'checks',
        items: [
          'تجهيز طلبات القروض',
          'تجميع الأوراق والإثباتات المطلوبة',
          'المساعدة في طلبات التمويل',
          'الإحالة إلى شركاء تمويل مناسبين',
          'ترتيب وتجهيز الأوراق المالية',
          'التحضير التنظيمي لإجراء إفلاس شخصي محتمل',
          'التواصل مع جهات استشارية أو شركاء مختصين مناسبين',
          'التأمين على الحياة',
          'الادخار وتأمين المستقبل والتقاعد',
          'تأمين العائلة',
          'الادخار لتغطية مصاريف الوفاة والدفن',
        ],
      },
    ],
    legalNote: LEGAL_NOTE,
    seo: {
      title: 'الأمور المالية والقروض والتأمين: دعم تنظيمي في دورتموند',
      description:
        'تحضير تنظيمي لطلبات القروض والأوراق المالية، وإحالة إلى شركاء مناسبين في التأمين والادخار. من دون استشارة مالية.',
    },
    status: 'draft-needs-client-approval',
  },

  'real-estate': {
    id: 'real-estate',
    eyebrow: 'الخدمة 05',
    title: 'العقارات والاستثمار',
    cardTitle: 'العقارات والاستثمار',
    cardDescription:
      'مرافقة تنظيمية تتعلق بأوراق العقارات ومعاملات الدوائر الرسمية والمواعيد. أما الاستشارة نفسها فيتولاها وسطاء وجهات مرخصة.',
    imageAlt: 'مخطط عقاري وأوراق على طاولة اجتماعات.',
    intro:
      'ترغب في شراء عقار أو تهتم بفرص الاستثمار؟ نساعدك في التوجيه والتحضير والإحالة إلى الجهات المناسبة.',
    blocks: [
      {
        kind: 'list',
        id: 'property-de',
        title: 'العقارات في ألمانيا',
        layout: 'checks',
        items: [
          'التوجيه في كل ما يتعلق بشراء العقار',
          'التحضير لتمويل عقاري محتمل',
          'تجميع الأوراق المطلوبة',
          'التواصل مع شركاء مناسبين',
          'ترتيب الخطوات التالية لشراء العقار المزمع',
        ],
      },
      {
        kind: 'list',
        id: 'property-dubai',
        title: 'العقارات والاستثمار في دبي',
        layout: 'checks',
        items: [
          'معلومات عن المشاريع العقارية المتاحة',
          'عرض فرص عقارية في دبي',
          'التواصل مع المطورين والشركاء',
          'تنظيم اللقاءات والمواعيد',
          'مرافقة عملية التواصل حتى نهايتها',
        ],
      },
    ],
    closing: 'نقطة تواصل واحدة في ألمانيا لفرصك الاستثمارية في دبي.',
    legalNote: LEGAL_NOTE,
    seo: {
      title: 'العقارات والاستثمار في دورتموند ودبي',
      description:
        'توجيه ومرافقة تنظيمية لشراء العقارات في ألمانيا، وتواصل مع شركاء المشاريع في دبي. نقطة تواصل واحدة في دورتموند.',
    },
    status: 'draft-needs-client-approval',
  },

  cleaning: {
    id: 'cleaning',
    eyebrow: 'الخدمة 06',
    title: 'خدمات التنظيف',
    cardTitle: 'خدمة التنظيف',
    cardDescription:
      'تنظيف دوري وتنظيف شامل وتنظيف بعد الانتقال أو الترميم، للبيوت والمكاتب والعيادات في دورتموند وما حولها.',
    imageAlt: 'مكتب مضيء بعد التنظيف، مكاتبه مرتبة ونوافذه نظيفة.',
    intro:
      'إلى جانب خدماتنا المكتبية، نقدم خدمات تنظيف احترافية للأفراد والشركات والمؤسسات.',
    blocks: [
      {
        kind: 'list',
        id: 'cleaning-places',
        title: 'ننظف من بين ما ننظف',
        layout: 'two-column',
        // The Arabic PDF lists houses and apartments separately.
        items: [
          'المكاتب',
          'الشقق',
          'المنازل',
          'المدارس',
          'المطاعم',
          'المحال التجارية',
          'العيادات',
          'المرافق التجارية',
          'الأدراج',
          'المساحات المشتركة',
        ],
      },
    ],
    closing: 'سواء أكان تنظيفًا لمرة واحدة أم خدمة تنظيف دورية، نجد الحل المناسب لاحتياجك.',
    seo: {
      title: 'خدمات التنظيف في دورتموند للمكاتب والشقق والمرافق التجارية',
      description:
        'تنظيف احترافي للمكاتب والشقق والمنازل والعيادات والمدارس والمرافق التجارية في دورتموند، لمرة واحدة أو بشكل دوري.',
    },
    status: 'draft-needs-client-approval',
  },
};
