export interface ShadowCopyEntity {
  id: string;
  title?: string;
  category?: string;
  content?: string;
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return {};
  return match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const index = line.indexOf(':');
      if (index === -1) return acc;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
}

export function parseEntityFile(content: string): ShadowCopyEntity {
  const frontmatter = parseFrontmatter(content);
  const body = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '').trim();
  return {
    id: frontmatter.id ?? 'unknown',
    title: frontmatter.title ?? '',
    category: frontmatter.category ?? 'Lore Note',
    content: body,
  };
}

export function generateEntityFile(entity: ShadowCopyEntity): string {
  return `---\nid: ${entity.id}\ntitle: ${entity.title ?? ''}\ncategory: ${entity.category ?? 'Lore Note'}\n---\n${entity.content ?? ''}`;
}
