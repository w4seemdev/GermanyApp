/**
 * Arabic service-card copy for the home-page grid and the /leistungen index.
 *
 * Same hedging discipline as the German file: cards 04 and 05 describe
 * paperwork and appointments, never brokerage or advice.
 */

import type { ServiceId } from '@/types/content';
import type { ServiceCard } from '../de/services.cards';

export const arServiceCards: Record<ServiceId, ServiceCard> = {
  authorities: {
    title: 'التجنيس والدوائر الرسمية والوثائق',
    description:
      'طلبات التجنيس والإقامة وشؤون التسجيل: نجهز لك الأوراق، ونعبئ الاستمارات معك، وننسق المواعيد.',
  },
  'marriage-translation': {
    title: 'الزواج والترجمات والوثائق الدولية',
    description:
      'عقود الزواج ولم شمل العائلة والوثائق الصادرة خارج ألمانيا. أما الترجمات المحلفة فننظمها لدى مترجمين محلفين معتمدين.',
  },
  'study-visa': {
    title: 'الدراسة والجامعة والتأشيرات',
    description:
      'التقديم والتسجيل والحساب المجمد وطلب التأشيرة: نجهز الأوراق ونتابع المواعيد النهائية معك.',
  },
  finance: {
    title: 'الشؤون المالية والقروض والادخار',
    description:
      'نساعدك في ترتيب الأوراق وفهم الاستمارات وتحضير المواعيد لدى البنوك وشركات التأمين — ونحيلك إلى المختصين المرخصين.',
  },
  'real-estate': {
    title: 'العقارات والاستثمار',
    description:
      'مرافقة تنظيمية تتعلق بأوراق العقارات ومعاملات الدوائر الرسمية والمواعيد. أما الاستشارة نفسها فيتولاها وسطاء وجهات مرخصة.',
  },
  cleaning: {
    title: 'خدمة التنظيف',
    description:
      'تنظيف دوري وتنظيف شامل وتنظيف بعد الانتقال أو الترميم — للبيوت والمكاتب والعيادات في دورتموند وما حولها.',
  },
};
