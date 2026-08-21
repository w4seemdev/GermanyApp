/**
 * Icon registry.
 *
 * The map is typed `Record<IconName, LucideIcon>`, so a typo or an upstream
 * rename in lucide-react fails the build instead of rendering an empty box.
 *
 * Icons here are always decorative: they sit next to a real text label, so they
 * are `aria-hidden` and contribute nothing to the accessibility tree.
 */

import {
  Building2,
  Check,
  Clock,
  FileText,
  GraduationCap,
  HandHeart,
  Info,
  Landmark,
  Languages,
  Layers,
  Mail,
  MapPin,
  MessagesSquare,
  Network,
  Phone,
  Route,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Stamp,
  type LucideIcon,
} from 'lucide-react';

import type { IconName } from '@/types/content';
import { cn } from '@/lib/cn';

const ICONS: Record<IconName, LucideIcon> = {
  Stamp,
  Languages,
  GraduationCap,
  Landmark,
  Building2,
  SprayCan,
  HandHeart,
  Layers,
  MessagesSquare,
  Network,
  Route,
  Check,
  Phone,
  Mail,
  Clock,
  MapPin,
  Sparkles,
  FileText,
  ShieldCheck,
  Info,
};

export interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 24 }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
    />
  );
}
