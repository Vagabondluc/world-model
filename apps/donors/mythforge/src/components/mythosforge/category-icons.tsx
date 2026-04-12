'use client';

import {
  Globe,
  Layers,
  Crown,
  BookOpen,
  Map,
  TreePine,
  Home,
  Building2,
  Mountain,
  Sword,
  Castle,
  Shield,
  Users,
  Church,
  Landmark,
  Scroll,
  Clock,
  Palette,
  Bug,
  User,
  Skull,
  Rabbit,
  UserCircle,
  Feather,
  Gem,
  Box,
  Diamond,
  Pickaxe,
  Cog,
  Sparkles,
  Wand2,
  Scale,
  BookOpenCheck,
  Compass,
  Target,
  Swords,
  Clapperboard,
  FileText,
  type LucideIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Icon mapping: CATEGORY_ICONS string → lucide-react component
// ---------------------------------------------------------------------------
export const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Layers,
  Crown,
  BookOpen,
  Map,
  TreePine,
  Home,
  Building2,
  Mountain,
  Dungeon: Sword, // Dungeon icon doesn't exist in lucide; fallback to Sword
  Castle,
  Shield,
  Users,
  Church,
  Landmark,
  Scroll,
  Clock,
  Palette,
  Bug,
  User,
  Skull,
  Rabbit,
  UserCircle,
  Sword,
  Feather,
  Gem,
  Box,
  Diamond,
  Pickaxe,
  Cog,
  Sparkles,
  Wand2,
  Scale,
  BookOpenCheck,
  Compass,
  Target,
  Swords,
  Clapperboard,
  FileText,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? FileText;
}

// Stable wrapper component so ESLint doesn't flag "component created during render"
export function CategoryIcon({
  icon: IconComponent,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return <IconComponent className={className} />;
}
