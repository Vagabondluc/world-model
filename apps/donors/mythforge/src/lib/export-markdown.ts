// =============================================================================
// MythosForge - Export World as Markdown ZIP
// =============================================================================

import JSZip from 'jszip';
import type { Entity, Relationship } from '@/lib/types';

interface WorldData {
  entities: Entity[];
  relationships: Relationship[];
}

/**
 * Generate a markdown string for a single entity.
 */
function entityToMarkdown(entity: Entity, _entityIndex: Record<string, Entity>): string {
  const lines: string[] = [];
  lines.push(`# ${entity.title}`);
  lines.push('');
  lines.push(`> **Category:** ${entity.category}  `);
  lines.push(`> **ID:** \`${entity.uuid_short}\`  `);
  lines.push(`> **Created:** ${new Date(entity.created_at).toISOString().slice(0, 10)}  `);
  lines.push(`> **Updated:** ${new Date(entity.updated_at).toISOString().slice(0, 10)}`);
  if (entity.tags.length > 0) {
    lines.push(`> **Tags:** ${entity.tags.join(', ')}`);
  }
  lines.push('');
  // JSON Attributes
  const attrs = entity.json_attributes;
  if (attrs && Object.keys(attrs).length > 0) {
    lines.push('## Attributes');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(attrs, null, 2));
    lines.push('```');
    lines.push('');
  }
  lines.push('## Lore');
  lines.push('');
  lines.push(entity.markdown_content || '*No lore written yet.*');
  lines.push('');
  // Footer
  lines.push('---');
  lines.push(`*Exported from MythosForge — ${entity.uuid_short}*`);

  return lines.join('\n');
}

/**
 * Generate an index markdown listing all entities.
 */
function generateIndex(entities: Entity[]): string {
  const lines: string[] = [];
  lines.push('# MythosForge World Export');
  lines.push('');
  lines.push(`> Exported on ${new Date().toISOString()}  `);
  lines.push(`> Total entities: ${entities.length}`);
  lines.push('');

  const groups: Record<string, Entity[]> = {};
  for (const entity of entities) {
    (groups[entity.category] ??= []).push(entity);
  }

  for (const [category, ents] of Object.entries(groups).sort()) {
    lines.push(`## ${category}`);
    lines.push('');
    for (const ent of ents.sort((a, b) => a.title.localeCompare(b.title))) {
      const attrs = ent.json_attributes;
      const sessionNum = attrs?.session_number != null ? ` (Session #${attrs.session_number})` : '';
      lines.push(`- [${ent.title}](${slugify(ent.title)}.md) — \`${ent.uuid_short}\`${sessionNum}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate a relationships markdown document.
 */
function generateRelationshipsDoc(
  relationships: Relationship[],
  entityIndex: Record<string, Entity>,
): string {
  const lines: string[] = [];
  lines.push('# Relationships');
  lines.push('');
  lines.push(`> Total relationships: ${relationships.length}`);
  lines.push('');

  if (relationships.length === 0) {
    lines.push('*No relationships defined.*');
    return lines.join('\n');
  }

  const byType: Record<string, Relationship[]> = {};
  for (const rel of relationships) {
    (byType[rel.relationship_type] ??= []).push(rel);
  }

  for (const [type, rels] of Object.entries(byType).sort()) {
    lines.push(`## ${type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`);
    lines.push('');
    for (const rel of rels) {
      const parent = entityIndex[rel.parent_id];
      const child = entityIndex[rel.child_id];
      const pName = parent?.title ?? rel.parent_id.slice(0, 8);
      const cName = child?.title ?? rel.child_id.slice(0, 8);
      lines.push(`- **${pName}** → **${cName}**`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate a session notes compilation document.
 */
function generateSessionNotes(entities: Entity[]): string {
  const sessions = entities
    .filter((e) => e.category === 'Session Note')
    .sort((a, b) => ((a.json_attributes?.session_number as number) ?? 0) - ((b.json_attributes?.session_number as number) ?? 0));

  if (sessions.length === 0) return '';

  const lines: string[] = [];
  lines.push('# Session Notes');
  lines.push('');
  lines.push(`> ${sessions.length} session(s) recorded`);
  lines.push('');

  for (const session of sessions) {
    const num = (session.json_attributes?.session_number as number) ?? '?';
    const date = (session.json_attributes?.date_played as string) || 'Unknown';
    lines.push(`---`);
    lines.push(`## Session ${num} — ${date}`);
    lines.push('');
    lines.push(session.markdown_content || '*No notes.*');
    lines.push('');
  }

  return lines.join('\n');
}

/** Convert a title to a URL-safe slug. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/**
 * Export the entire world as a ZIP of Markdown files.
 * Downloads the zip in the browser.
 */
export async function exportWorldAsMarkdown(data: WorldData): Promise<void> {
  const { entities, relationships } = data;
  const zip = new JSZip();
  const entityIndex = Object.fromEntries(entities.map((e) => [e.id, e]));

  // index.md
  zip.file('index.md', generateIndex(entities));

  // relationships.md
  zip.file('relationships.md', generateRelationshipsDoc(relationships, entityIndex));

  // entities/ folder — one .md per entity (deduplicate filenames)
  const entitiesFolder = zip.folder('entities');
  if (!entitiesFolder) return;
  const usedNames = new Map<string, number>();
  for (const entity of entities) {
    const base = slugify(entity.title) || 'untitled';
    const count = usedNames.get(base) || 0;
    usedNames.set(base, count + 1);
    const filename = count > 0 ? `${base}-${count}.md` : `${base}.md`;
    entitiesFolder.file(filename, entityToMarkdown(entity, entityIndex));
  }

  // session-notes.md — compiled session log
  const sessionNotes = generateSessionNotes(entities);
  if (sessionNotes) {
    zip.file('session-notes.md', sessionNotes);
  }

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mythosforge-export-${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
