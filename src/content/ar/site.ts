/**
 * ARABIC SITE CONTENT - chrome + home page + form + a11y strings.
 *
 * This is NOT a translation of the German file. It is the Arabic body on the
 * shared spine: the same required keys (TypeScript enforces that via
 * `: SiteContent`), but wording written for an Arabic-speaking reader living in
 * Germany rather than transliterated German.
 *
 * FORBIDDEN COPY - the hedging is load-bearing, exactly as in the German file.
 * Never promise an outcome (نضمن / مضمون / نحصل لك على), never claim regulated
 * advice (استشارة قانونية / ضريبية / تأمينية). Always: نرافقك · نساعدك في ·
 * نجهز · ننظم · نشرح. The authorities decide; we prepare.
 *
 * TYPOGRAPHY: never letter-space Arabic and never uppercase it - both break
 * cursive joining. The `ar` variant in globals.css already forces this off.
 *
 * LATIN RUNS: the brand name Zukunft Service, the address and the phone number
 * stay Latin and must be bidi-isolated by the component that renders them.
 */

import type { SiteContent } from '@/types/content';

/** Defined once so the hedge can never drift between the scope section and the
 *  contact form - the two places a regulator would actually look. */
const HEDGE_NOTICE =
  'نقدم دعمًا تنظيميًا ولغويًا. نحن لا نقدم استشارات قانونية أو ضريبية أو تأمينية. '
  + 'وعندما تتطلب حالتك استشارة متخصصة، نحيلك إلى الجهات والمكاتب المختصة.';

export const arSite: SiteContent = {
  meta: {
    siteName: 'Zukunft Service',
    slogan: 'شريكك في معاملات الدوائر الرسمية والوثائق والحياة اليومية في ألمانيا',
    homeTitle: 'Zukunft Service دورتموند: معاملات ووثائق وخدمات تنظيف',
    homeDescription:
      'مكتب Zukunft Service في دورتموند يرافقك في معاملات التجنيس والدوائر الرسمية والترجمات والدراسة والتأشيرات، ويتولى خدمات التنظيف. نتحدث العربية والألمانية.',
    localeLabel: 'العربية',
    switchLabel: 'Deutsch',
    switchAriaLabel: 'التبديل إلى النسخة الألمانية – Zur deutschen Version wechseln',
  },

  nav: {
    primary: [
      { id: 'services', label: 'خدماتنا', target: { kind: 'route', routeId: 'services' } },
      { id: 'why', label: 'لماذا نحن', target: { kind: 'anchor', hash: '#warum-wir' } },
      {
        id: 'cleaning',
        label: 'التنظيف',
        target: { kind: 'anchor', hash: '#reinigungsservice' },
      },
      { id: 'contact', label: 'تواصل معنا', target: { kind: 'route', routeId: 'contact' } },
    ],
    // Mirrors the German footer: six service links, same order, same targets.
    footer: [
      {
        id: 'authorities',
        label: 'التجنيس والدوائر الرسمية',
        target: { kind: 'service', serviceId: 'authorities' },
      },
      {
        id: 'marriage-translation',
        label: 'الزواج والترجمات',
        target: { kind: 'service', serviceId: 'marriage-translation' },
      },
      {
        id: 'study-visa',
        label: 'الدراسة والتأشيرات',
        target: { kind: 'service', serviceId: 'study-visa' },
      },
      {
        id: 'finance',
        label: 'الشؤون المالية والادخار',
        target: { kind: 'service', serviceId: 'finance' },
      },
      {
        id: 'real-estate',
        label: 'العقارات والاستثمار',
        target: { kind: 'service', serviceId: 'real-estate' },
      },
      {
        id: 'cleaning',
        label: 'خدمة التنظيف',
        target: { kind: 'service', serviceId: 'cleaning' },
      },
    ],
    legal: [
      // "Impressum" stays the German word in both locales: case law has rejected
      // "Kontakt", "Legal" and "Info" as insufficiently clear labels.
      { id: 'imprint', label: 'Impressum', target: { kind: 'route', routeId: 'imprint' } },
      { id: 'privacy', label: 'حماية البيانات', target: { kind: 'route', routeId: 'privacy' } },
    ],
  },

  hero: {
    eyebrow: 'خدمات مكتبية وخدمات تنظيف في دورتموند',
    headline: 'لا تعرف من أين تبدأ؟ نحن نعرف.',
    lead:
      'التجنيس، ورسائل الدوائر الرسمية، والترجمات، والدراسة، والتأشيرات، إضافة إلى خدمة تنظيف بيتك أو مكتبك. في Zukunft Service تجد ذلك كله في مكان واحد، بالعربية والألمانية.',
    primaryCta: {
      label: 'اشرح لنا حالتك',
      hint: 'من دون التزام ومن دون رسوم. نرد عليك في أول يوم عمل.',
    },
    secondaryCta: { label: 'تصفح الخدمات' },
    trust: [
      { id: 'languages', icon: 'MessagesSquare', label: 'نتحدث العربية والألمانية' },
      { id: 'local', icon: 'MapPin', label: 'في دورتموند' },
      { id: 'one-hand', icon: 'Layers', label: 'كل شيء في مكان واحد' },
    ],
    imageAlt: 'موظفة في Zukunft Service تجلس مع أحد العملاء إلى الطاولة وتراجع معه الأوراق المطلوبة.',
  },

  pillars: [
    {
      id: 'office',
      index: '01',
      icon: 'FileText',
      title: 'الخدمات المكتبية',
      body:
        'الطلبات والاستمارات والمواعيد والمراسلات، من التجنيس إلى الترجمات وصولًا إلى الدراسة والتأشيرات. نرتب لك ما يجب أن يجتمع معًا، ونرافقك خطوة بخطوة.',
      linkLabel: 'تصفح الخدمات المكتبية',
    },
    {
      id: 'cleaning',
      index: '02',
      icon: 'SprayCan',
      title: 'خدمة التنظيف',
      body:
        'تنظيف دوري، وتنظيف شامل، وتنظيف بعد الانتقال أو بعد أعمال الترميم، للبيوت والمكاتب والعيادات في دورتموند وما حولها.',
      linkLabel: 'تصفح خدمة التنظيف',
    },
  ],

  process: {
    heading: {
      eyebrow: 'كيف نعمل',
      title: 'من السؤال إلى الحل في ثلاث خطوات',
      lead:
        'لست مضطرًا لمعرفة الدائرة المختصة ولا اسم الاستمارة. اشرح لنا وضعك فقط، ونحن نرتب الباقي.',
    },
    steps: [
      {
        id: 'talk',
        index: '01',
        title: 'تشرح لنا حالتك',
        body:
          'عبر النموذج أو واتساب أو الهاتف، بالعربية أو بالألمانية. لا تحتاج إلى مصطلحات رسمية ولا إلى أوراق جاهزة.',
      },
      {
        id: 'plan',
        index: '02',
        title: 'نرتب لك الأمور ونشرحها',
        body:
          'نوضح لك ما هو المطلوب، وأي جهة هي المختصة، وبأي ترتيب يفضل أن تسير الأمور، بلغة مفهومة بعيدًا عن تعقيد اللغة الرسمية.',
      },
      {
        id: 'do',
        index: '03',
        title: 'نرافقك حتى التنفيذ',
        body:
          'تعبئة الاستمارات، وتنسيق المواعيد، وتجهيز الأوراق، وتنظيم الترجمات. نبقى معك إلى أن تنجز المعاملة.',
      },
    ],
  },

  services: {
    heading: {
      eyebrow: 'الخدمات',
      title: 'ستة مجالات، وجهة واحدة',
      lead:
        'معظم المعاملات مترابطة: التجنيس يحتاج إلى ترجمات، والدراسة تحتاج إلى تأشيرة. لذلك تجد كل شيء هنا في مكان واحد.',
    },
    detailLabel: 'تفاصيل هذه الخدمة',
    note: 'لست متأكدًا إلى أي مجال تنتمي حالتك؟ اشرحها لنا ونحن نصنفها.',
  },

  why: {
    heading: {
      eyebrow: 'لماذا نحن',
      title: 'لماذا يقصد الناس Zukunft Service',
      lead:
        'لأن معاملات الدوائر الرسمية بلغة غير لغتك مرهقة، ولأن وجود من يصغي إليك يصنع فرقًا حقيقيًا.',
    },
    points: [
      {
        id: 'personal',
        icon: 'HandHeart',
        title: 'تعامل شخصي لا رقم في طابور',
        body: 'تتحدث إلى شخص يعرف ملفك، لا إلى انتظار على الهاتف ولا إلى موظف مختلف في كل مرة.',
      },
      {
        id: 'one-hand',
        icon: 'Layers',
        title: 'كل شيء في مكان واحد',
        body:
          'الدوائر الرسمية والترجمات والدراسة والتأشيرات والتنظيف في جهة واحدة. لن تضطر إلى إعادة رواية قصتك خمس مرات.',
      },
      {
        id: 'multilingual',
        icon: 'MessagesSquare',
        title: 'بالعربية والألمانية',
        body: 'نشرح لك بالعربية ما يقوله الخطاب بالألمانية، ونصوغ بالألمانية ما تقوله لنا بالعربية.',
      },
      {
        id: 'network',
        icon: 'Network',
        title: 'شبكة علاقات راسخة',
        body:
          'في المسائل التي تحتاج إلى مختصين، نعرف الجهات المناسبة: مترجمين ومكاتب محاماة وجهات استشارية، ونوصلك بها.',
      },
      {
        id: 'tailored',
        icon: 'Route',
        title: 'حلول تناسب وضعك أنت',
        body:
          'لا وجود لباقة جاهزة. ما تحتاجه يعتمد على وضعك، وعلى هذا الأساس نحدد ما نقوم به من أجلك.',
      },
    ],
  },

  cleaning: {
    heading: {
      eyebrow: 'خدمة التنظيف',
      title: 'تسليم نظيف وعناية منتظمة',
      lead: 'المجال الثاني في عملنا: التنظيف للبيوت والمكاتب والعيادات، بشكل دوري أو لمرة واحدة.',
    },
    items: [
      'تنظيف دوري للمكاتب والعيادات والمحال التجارية',
      'تنظيف شامل للشقق والبيوت',
      'التنظيف بعد الانتقال أو الترميم أو أعمال الصيانة',
      'تنظيف الأدراج والمساحات المشتركة',
      'تنظيف النوافذ والواجهات الزجاجية',
      'فريق ثابت ومواعيد يعتمد عليها',
    ],
    cta: {
      label: 'اطلب عرضًا للتنظيف',
      hint: 'نعاين المكان ونحدد لك السعر.',
    },
    imageAlt: 'مكتب مضيء بعد التنظيف، مكاتبه مرتبة ونوافذه نظيفة.',
  },

  scope: {
    heading: {
      eyebrow: 'وضوح',
      title: 'ما نقوم به وما لا نقوم به',
      lead: 'لتعرف منذ البداية أين تقف. هذا الحد يحميك كما يحمينا.',
    },
    doTitle: 'ما نتولاه',
    doItems: [
      'تعبئة الاستمارات والطلبات معك',
      'شرح رسائل الدوائر الرسمية وتوضيح المطلوب فيها',
      'تنسيق المواعيد لدى الدوائر والجهات المختصة',
      'تجهيز الأوراق والتأكد من اكتمالها',
      'تنظيم الترجمات المحلفة لدى مترجمين معتمدين',
      'مرافقتك إلى الموعد عند الطلب',
      'تخطيط أعمال التنظيف وتنفيذها',
    ],
    dontTitle: 'ما لا نتولاه',
    dontItems: [
      'لا نقدم استشارات قانونية ولا تمثيلًا أمام المحاكم',
      'لا نقدم استشارات ضريبية',
      'لا نقدم استشارات تأمينية أو استثمارية',
      'لا نتوسط في القروض أو التمويل',
      'لا نضمن قرارات الدوائر الرسمية ولا نتعهد بنتيجتها',
    ],
    notice: HEDGE_NOTICE,
  },

  contact: {
    heading: {
      eyebrow: 'تواصل معنا',
      title: 'احك لنا ما الموضوع',
      lead:
        'بضع جمل تكفي. لا تحتاج إلى تحضير شيء ولا إلى إرسال أوراق. نخبرك بالخطوة المناسبة التالية.',
    },
    quickContact: {
      whatsapp: 'راسلنا على واتساب',
      call: 'اتصل بنا الآن',
      email: 'أرسل بريدًا إلكترونيًا',
    },
    responseNote: 'خارج أوقات الدوام: راسلنا على أي حال، ونرد عليك في أول يوم عمل.',
  },

  info: {
    hoursTitle: 'أوقات الدوام',
    addressTitle: 'العنوان',
    contactTitle: 'التواصل',
    mapsLabel: 'افتح في خرائط جوجل',
    closedLabel: 'مغلق',
    hoursNote: 'مواعيد خارج أوقات الدوام بالاتفاق المسبق.',
  },

  footer: {
    slogan: 'خدمات مكتبية وخدمات تنظيف في دورتموند، بالعربية والألمانية.',
    navTitle: 'الصفحات',
    legalTitle: 'معلومات قانونية',
    copyright: '© {year} Zukunft Service. جميع الحقوق محفوظة.',
  },

  form: {
    title: 'اشرح لنا حالتك',
    lead: 'الحقول المؤشر عليها بنجمة إلزامية. وما عداها اختياري.',
    service: {
      label: 'ما موضوع طلبك؟',
      hint: 'إن لم تكن متأكدًا، اختر «لست متأكدًا».',
      options: [
        { value: 'authorities', label: 'التجنيس والدوائر الرسمية والوثائق' },
        { value: 'marriage-translation', label: 'الزواج والترجمات والوثائق الدولية' },
        { value: 'study-visa', label: 'الدراسة والجامعة والتأشيرات' },
        { value: 'finance', label: 'الشؤون المالية والقروض والادخار' },
        { value: 'real-estate', label: 'العقارات والاستثمار' },
        { value: 'cleaning', label: 'خدمة التنظيف' },
        { value: 'other', label: 'لست متأكدًا / موضوع آخر' },
      ],
    },
    message: {
      label: 'اشرح لنا طلبك',
      placeholder: 'صف وضعك باختصار. بضع جمل تكفي تمامًا.',
      hint: 'من فضلك لا ترسل نسخًا من الهوية أو الوثائق في هذه المرحلة.',
    },
    name: { label: 'الاسم', placeholder: 'الاسم الأول واسم العائلة' },
    email: {
      label: 'البريد الإلكتروني',
      placeholder: 'name@beispiel.de',
      hint: 'سنرسل ردنا إلى هذا العنوان.',
    },
    phone: {
      label: 'رقم الهاتف',
      placeholder: '+49 …',
      hint: 'اختياري، إلا إذا رغبت بالرد عبر واتساب.',
    },
    whatsappOptIn: {
      label: 'لا مانع لدي من الرد عبر واتساب',
      hint: 'نحتاج رقم هاتفك لذلك.',
    },
    preferredTime: {
      label: 'ما هو أنسب وقت للتواصل معك؟',
      options: [
        { value: 'morning', label: 'صباحًا (10–13)' },
        { value: 'afternoon', label: 'بعد الظهر (13–16)' },
        { value: 'any', label: 'لا فرق' },
      ],
    },
    honeypot: { label: 'يرجى ترك هذا الحقل فارغًا' },
    submit: 'إرسال الطلب',
    submitting: 'جار الإرسال …',
    successTitle: 'شكرًا لك، وصلنا طلبك.',
    successBody:
      'استلمنا رسالتك وسنتواصل معك في أول يوم عمل. وإذا كان الأمر عاجلًا، يمكنك الاتصال بنا أو مراسلتنا على واتساب.',
    errorTitle: 'تعذر إرسال الطلب.',
    errorBody:
      'لم نتمكن من إرسال طلبك. حاول مرة أخرى من فضلك، أو راسلنا مباشرة عبر واتساب أو البريد الإلكتروني.',
    errorSummaryTitle: 'يرجى مراجعة هذه البيانات:',
    requiredLabel: 'حقل إلزامي',
    optionalLabel: 'اختياري',
    privacyNotice: 'نستخدم بياناتك لمعالجة طلبك فقط. مزيد من التفاصيل في',
    privacyLinkLabel: 'سياسة حماية البيانات',
    hedgeNotice: HEDGE_NOTICE,
    validation: {
      required: 'يرجى تعبئة هذا الحقل.',
      nameTooShort: 'يرجى كتابة اسمك.',
      emailInvalid: 'يرجى التحقق من بريدك الإلكتروني.',
      messageTooShort: 'يرجى وصف طلبك بجملة واحدة على الأقل.',
      messageTooLong: 'رسالتك طويلة أكثر من اللازم. يرجى اختصارها قليلًا.',
      phoneInvalid: 'يرجى التحقق من رقم هاتفك.',
      phoneRequiredForWhatsapp: 'للرد عبر واتساب نحتاج إلى رقم هاتفك.',
    },
  },

  a11y: {
    skipToContent: 'انتقل إلى المحتوى',
    openMenu: 'افتح القائمة',
    closeMenu: 'أغلق القائمة',
    menuLabel: 'القائمة الرئيسية',
    languageGroupLabel: 'اختر اللغة',
    breadcrumbLabel: 'مسار التنقل',
    whatsappFab: 'راسلنا على واتساب',
    currentPage: 'الصفحة الحالية',
    loading: 'جار التحميل …',
    externalLinkHint: 'يفتح في تبويب جديد',
  },
};
