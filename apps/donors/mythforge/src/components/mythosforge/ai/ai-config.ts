import { AlertTriangle, Eye, Sparkles, MapPin, FileText, Shield, Link2 } from 'lucide-react';
import type { AIMode, ChatComponent } from '@/lib/types';

// ─── Mode emoji map ─────────────────────────────────────────────────────────
export const MODE_EMOJIS: Record<AIMode, string> = {
  architect: '🏗️',
  lorekeeper: '🪄',
  scholar: '📚',
  roleplayer: '🎭',
};

export const MODE_COLORS: Record<AIMode, string> = {
  architect: 'accent-arcane',
  lorekeeper: 'accent-gold',
  scholar: 'accent-indigo',
  roleplayer: 'accent-blood',
};

// ─── Quick-action buttons per mode ─────────────────────────────────────────
export interface QuickAction {
  label: string;
  icon: typeof Sparkles;
  prompt: string;
}

export const MODE_QUICK_ACTIONS: Record<AIMode, QuickAction[]> = {
  lorekeeper: [
    { label: 'Create Draft Card', icon: Sparkles, prompt: 'Generate one complete draft card that can be saved directly into the world database.' },
    { label: 'Draft NPC', icon: Sparkles, prompt: 'Generate a new NPC that would fit in my world.' },
    { label: 'Draft Location', icon: MapPin, prompt: 'Generate a new dark location for my world.' },
    { label: 'Draft Item', icon: FileText, prompt: 'Generate a mysterious artifact or magic item.' },
  ],
  scholar: [
    { label: 'Check Consistency', icon: Shield, prompt: 'Analyze my entire world database for any logical conflicts, timeline errors, or contradictions.' },
    { label: 'Find Connections', icon: Link2, prompt: 'What connections exist between the entities in my world?' },
  ],
  architect: [
    { label: 'Analyze Graph', icon: Link2, prompt: 'Analyze my world graph for orphaned entities and disconnected clusters.' },
    { label: 'Schema Audit', icon: FileText, prompt: 'Review category templates and suggest schema improvements.' },
    { label: 'Suggest Categories', icon: MapPin, prompt: 'Propose category grouping changes or new categories to improve organization.' },
  ],
  roleplayer: [],
};

// ─── Severity config ────────────────────────────────────────────────────────
export const SEVERITY_CONFIG: Record<string, { color: string; label: string; icon: typeof AlertTriangle }> = {
  critical: { color: 'text-accent-blood', label: 'Critical', icon: AlertTriangle },
  high: { color: 'text-red-400', label: 'High', icon: AlertTriangle },
  medium: { color: 'text-amber-400', label: 'Medium', icon: Eye },
  low: { color: 'text-blue-400', label: 'Low', icon: Eye },
  info: { color: 'text-ash-500', label: 'Info', icon: Eye },
};

// ─── Mock AI response generators ─────────────────────────────────────────────
export function generateMockResponse(
  mode: AIMode,
  userMessage: string,
  entityIds: string[],
  entityTitles: Record<string, string>,
): { content: string; components?: ChatComponent[] } {
  const firstEntityId = entityIds[0] || '';
  const firstTitle = entityTitles[firstEntityId] || 'your world';

  switch (mode) {
    case 'architect': {
      return {
        content: `I've analyzed the structure of **${firstTitle}** and your world database. Consider adding more relationships between your Campaign and its Adventures for better traversal.\n\n[RELATIONSHIP_SUGGESTIONS]\n${JSON.stringify({ suggestions: [{ source_title: firstTitle, target_title: 'Dr. Malachar Vex', type: 'created_by', reason: `${firstTitle} was established by this notorious figure` }] })}\n[/RELATIONSHIP_SUGGESTIONS]`,
        components: [
          {
            type: 'schema_confirmation' as const,
            data: {
              title: 'Add "allegiance" field to NPC template',
              description: 'This would add a text field tracking faction or individual loyalty.',
              field: 'allegiance',
              fieldType: 'string',
            },
          },
        ],
      };
    }

    case 'lorekeeper': {
      return {
        content: `Based on the dark atmosphere of your campaign, here's a new entity that could deepen the mystery...\n\n[DRAFT_ENTITY]\n${JSON.stringify({ title: 'The Phonograph Ghost', category: 'NPC', summary: 'The spectral remnant of Nurse Elara, bound to the antique phonograph in the west wing. Her haunting melodies carry fragments of forbidden knowledge.', markdown: '## Description\\nA translucent figure draped in nurse\'s whites from a bygone era, her form flickers in time with the crackling vinyl.', attributes: { hp: 0, ac: 16, level: 4, disposition: 'Chaotic Neutral' }, tags: ['ghost', 'npc', 'haunting'] })}\n[/DRAFT_ENTITY]\n\n[RELATIONSHIP_SUGGESTIONS]\n${JSON.stringify({ suggestions: [{ source_title: 'The Phonograph Ghost', target_title: 'The Whispering Wards', type: 'located_in', reason: 'The phonograph is in the west wing of the Sanatorium' }] })}\n[/RELATIONSHIP_SUGGESTIONS]`,
        components: [],
      };
    }

    case 'scholar': {
      return {
        content: `I've scanned your world database and found some potential issues...\n\n[CONSISTENCY_ISSUES]\n${JSON.stringify({ issues: [{ severity: 'medium', title: 'Isolated Entity: Dr. Malachar Vex', description: 'Dr. Vex is connected to the adventure but has no faction, location, or family relationships. Consider linking him to a Noble House or Religion.', entity_ids: [firstEntityId], entity_titles: [firstTitle] }, { severity: 'low', title: 'Missing Timeline Data', description: 'No entities have year_occurred or start_year attributes set. Adding dates would enable the Chronology Timeline view.' }] })}\n[/CONSISTENCY_ISSUES]`,
        components: [],
      };
    }

    case 'roleplayer': {
      return {
        content:
          '*The flickering gaslight casts long shadows across the admission desk as a hollow voice drifts from the phonograph in the corner*\n\n"You hear that, visitors? That scratching? That\'s not the patients... the patients left long ago. What remains in these walls... it remembers."',
        components: [],
      };
    }

    default:
      return { content: 'I am unsure how to respond in this mode.' };
  }
}

// ─── Timestamp formatter ────────────────────────────────────────────────────
export function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
