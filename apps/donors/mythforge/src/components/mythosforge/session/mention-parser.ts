// =============================================================================
// MythosForge - @-Mention Parser for Session Notes
// =============================================================================

import type { Entity, Relationship } from '@/lib/types';

/** Regex to match @-mentions in markdown text. Supports quoted names. */
const MENTION_REGEX = /@(?:"([^"]+)"|(\S+))/g;

export interface ParsedMention {
  /** The raw @-mention text (e.g. "@Gorath the Wise") */
  raw: string;
  /** The entity name extracted from the mention */
  name: string;
  /** Start index in the source string */
  start: number;
  /** End index in the source string */
  end: number;
  /** The matched entity, if found */
  entity: Entity | undefined;
}

/**
 * Parse all @-mentions from a markdown string and match them against
 * existing entities by title (case-insensitive) or uuid_short.
 */
export function parseMentions(text: string, entities: Entity[]): ParsedMention[] {
  const mentions: ParsedMention[] = [];
  const entityMap = new Map(entities.map((e) => [e.title.toLowerCase(), e]));
  const shortMap = new Map(entities.map((e) => [e.uuid_short.toLowerCase(), e]));

  let match: RegExpExecArray | null;
  while ((match = MENTION_REGEX.exec(text)) !== null) {
    const name = (match[1] || match[2]).trim();
    const entity = entityMap.get(name.toLowerCase()) ?? shortMap.get(name.toLowerCase());
    mentions.push({
      raw: match[0],
      name,
      start: match.index,
      end: match.index + match[0].length,
      entity,
    });
  }
  return mentions;
}

/**
 * Given a list of parsed mentions, compute the relationships that should
 * exist. Returns relationship descriptors for all matched mentions.
 */
export function mentionRelationships(
  sessionNoteId: string,
  mentions: ParsedMention[],
): { childId: string; type: string }[] {
  return mentions
    .filter((m) => m.entity && m.entity.id !== sessionNoteId)
    .map((m) => ({
      childId: m.entity ? m.entity.id : '',
      type: 'mentioned_in',
    }));
}

/**
 * Diff existing relationships against desired mention relationships.
 * Returns relationships to add (not already present).
 */
export function diffMentionRelationships(
  sessionNoteId: string,
  existing: Relationship[],
  desired: { childId: string; type: string }[],
): { childId: string; type: string }[] {
  const existingSet = new Set(
    existing
      .filter((r) => r.parent_id === sessionNoteId && r.relationship_type === 'mentioned_in')
      .map((r) => r.child_id),
  );
  return desired.filter((d) => !existingSet.has(d.childId));
}

/**
 * Render markdown text with @-mentions converted to highlighted markdown links.
 * Matched mentions become [name](#entity-id) links; unmatched become bold text.
 */
export function renderMentionsAsMarkdown(text: string, entities: Entity[]): string {
  const mentions = parseMentions(text, entities);
  let result = '';
  let lastEnd = 0;

  for (const m of mentions) {
    result += text.slice(lastEnd, m.start);
    if (m.entity) {
      result += `**[@${m.name}](#entity-${m.entity.id})**`;
    } else {
      result += `**${m.raw}**`;
    }
    lastEnd = m.end;
  }
  result += text.slice(lastEnd);
  return result;
}

/**
 * Search entities by a query string for autocomplete.
 * Matches against title and uuid_short (case-insensitive).
 */
export function searchEntitiesForMention(
  query: string,
  entities: Entity[],
  limit = 8,
): Entity[] {
  if (!query) return entities.slice(0, limit);
  const q = query.toLowerCase();
  return entities
    .filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.uuid_short.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
