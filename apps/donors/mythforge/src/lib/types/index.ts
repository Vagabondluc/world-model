// =============================================================================
// MythosForge - Core Definitions
// =============================================================================

// Re-export template constants so existing imports continue to work
export { CATEGORY_GROUPS, CATEGORY_ICONS, CATEGORY_TEMPLATES, RELATIONSHIP_TYPES } from './templates';

// Exhaustive Worldbuilding Taxonomy
export type EntityCategory =
  // Macro / Cosmos
  | 'Cosmos' | 'Plane' | 'Deity' | 'Myth'
  // Geography
  | 'Region' | 'Biome' | 'Settlement' | 'City' | 'Landmark' | 'Dungeon' | 'Structure'
  // Society & History
  | 'Faction' | 'Guild' | 'Religion' | 'Noble House' | 'Historical Event' | 'Era' | 'Culture'
  // Biology & Entities
  | 'Species' | 'Race' | 'Creature' | 'Fauna' | 'NPC' | 'Character' | 'Historical Figure'
  // Items & Mechanics
  | 'Artifact' | 'Item' | 'Resource' | 'Material' | 'Technology' | 'Magic System' | 'Spell' | 'Rule' | 'Calendar'
  // Meta Containers (Narrative)
  | 'Campaign' | 'Adventure' | 'Quest' | 'Encounter' | 'Scene' | 'Session Note' | 'Lore Note';

// The Universal Data Wrapper
export interface Entity {
  id: string; // UUID v4
  uuid_short: string; // 8-char display ID (for example, "E-88A2")
  title: string;
  category: string; // EntityCategory or custom category name
  markdown_content: string; // The narrative lore
  json_attributes: Record<string, unknown>; // Dynamic stats ("Magic Folder")
  tags: string[];
  isPinned: boolean; // For the Tab DM Screen
  created_at: number;
  updated_at: number;
}

// Custom category definition
export interface CustomAttributeDef {
  type: 'string' | 'number' | 'boolean';
  default: string | number | boolean;
}

export interface CustomCategoryDef {
  id: string; // UUID
  name: string; // Display name, such as "Mecha"
  group: string; // ExplorerTree group name, such as "Custom"
  icon: string; // Lucide icon name
  baseCategory?: string; // Optional built-in or custom category to extend
  attributes: Record<string, CustomAttributeDef>;
}

// The Graph Junction Table
export interface Relationship {
  id: string; // UUID v4
  parent_id: string; // UUID of the parent Entity
  child_id: string; // UUID of the child Entity
  relationship_type: string;
}

// AI Chat Modes
export type AIMode = 'architect' | 'lorekeeper' | 'scholar' | 'roleplayer';

export interface AIModeConfig {
  id: AIMode;
  label: string;
  icon: string;
  description: string;
  systemPrompt: string;
}

export const AI_MODES: AIModeConfig[] = [
  {
    id: 'architect',
    label: 'The Architect',
    icon: 'Hammer',
    description: 'Database & Rules Management',
    systemPrompt: 'You are The Architect, an AI assistant specialized in structuring TTRPG world databases and game rules. Help the user organize their world, suggest structural improvements, and manage entity relationships.',
  },
  {
    id: 'lorekeeper',
    label: 'The Lorekeeper',
    icon: 'Wand2',
    description: 'Content Generation',
    systemPrompt: 'You are The Lorekeeper, an AI assistant specialized in generating rich, immersive worldbuilding content. Create characters, locations, histories, and narrative elements. Present suggestions as Draft Cards that can be saved to the database.',
  },
  {
    id: 'scholar',
    label: 'The Scholar',
    icon: 'BookOpen',
    description: 'Lore Search & RAG',
    systemPrompt: 'You are The Scholar, an AI assistant specialized in searching and retrieving world lore. Help find connections between entities, answer questions about the world, and reference existing lore with clickable links.',
  },
  {
    id: 'roleplayer',
    label: 'The Roleplayer',
    icon: 'Drama',
    description: 'NPC Simulator',
    systemPrompt: 'You are The Roleplayer, an AI assistant that simulates NPC conversations. Stay in character, respond naturally, and bring the world to life through dialogue.',
  },
];

// Chat message types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  mode: AIMode;
  timestamp: number;
  // For rendering interactive components
  components?: ChatComponent[];
}

export interface ChatComponent {
  type:
    | 'draft_card'
    | 'schema_confirmation'
    | 'entity_reference'
    | 'pin_button'
    | 'consistency_issue'
    | 'relationship_suggestion'
    | 'category_suggestion'
    | 'graph_analysis';
  data: Record<string, unknown>;
}

// DM Screen — saved collection of pinned entities for quick reference
export interface DmScreen {
  id: string; // UUID
  name: string; // for example, "Battle Screen" or "NPC Reference"
  pinnedEntityIds: string[]; // entity IDs shown on this screen
  created_at: number;
  updated_at: number;
}

// Workspace view modes
export type ViewMode = 'grid' | 'graph' | 'timeline' | 'session' | 'forge';

// Attribute default helper
export function getCustomAttrDefault(attr: CustomAttributeDef): string | number | boolean {
  switch (attr.type) {
    case 'boolean': return attr.default;
    case 'number': return Number(attr.default) || 0;
    case 'string':
    default: return String(attr.default ?? '');
  }
}

// Build default json_attributes from a CustomCategoryDef
export function buildCustomTemplate(
  def: CustomCategoryDef,
  baseTemplate: Record<string, unknown> = {},
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...baseTemplate };
  for (const [key, attrDef] of Object.entries(def.attributes)) {
    attrs[key] = getCustomAttrDefault(attrDef);
  }
  return attrs;
}

// Helper to generate a short UUID for display
export function generateUuidShort(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `E-${result}`;
}
