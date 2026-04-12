'use client';

import {
  LayoutGrid,
  Hammer,
  Wand2,
  BookOpen,
  Drama,
  type LucideIcon,
} from 'lucide-react';
import type { AIMode } from '@/lib/types';

// Icon lookup for entities by category
export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Campaign: BookOpen,
  Adventure: LayoutGrid,
  NPC: Wand2,
  Cosmos: BookOpen,
  Plane: BookOpen,
  Deity: Hammer,
  Region: BookOpen,
  Biome: BookOpen,
  Settlement: BookOpen,
  City: BookOpen,
  Landmark: BookOpen,
  Dungeon: BookOpen,
  Structure: BookOpen,
  Faction: BookOpen,
  Guild: BookOpen,
  Religion: BookOpen,
  'Noble House': BookOpen,
  'Historical Event': BookOpen,
  Era: BookOpen,
  Culture: BookOpen,
  Species: BookOpen,
  Race: BookOpen,
  Creature: BookOpen,
  Fauna: BookOpen,
  Character: BookOpen,
  'Historical Figure': BookOpen,
  Artifact: BookOpen,
  Item: BookOpen,
  Resource: BookOpen,
  Material: BookOpen,
  Technology: BookOpen,
  'Magic System': BookOpen,
  Spell: BookOpen,
  Rule: BookOpen,
  Quest: BookOpen,
  Encounter: BookOpen,
  Scene: BookOpen,
  'Lore Note': BookOpen,
};

export const AI_MODE_ICONS: Record<AIMode, LucideIcon> = {
  architect: Hammer,
  lorekeeper: Wand2,
  scholar: BookOpen,
  roleplayer: Drama,
};
