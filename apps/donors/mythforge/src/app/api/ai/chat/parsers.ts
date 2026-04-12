// =============================================================================
// MythosForge - AI Chat Structured Output Parsers
// =============================================================================

export interface ParsedComponent {
  type: string;
  data: Record<string, unknown>;
}

export function extractBlock(text: string, tag: string): string | null {
  const open = `[${tag}]`;
  const close = `[/${tag}]`;
  const startIdx = text.indexOf(open);
  if (startIdx === -1) return null;
  const endIdx = text.indexOf(close, startIdx + open.length);
  if (endIdx === -1) return null;
  return text.slice(startIdx + open.length, endIdx).trim();
}

export function tryParseJSON(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function hasStringKey(obj: Record<string, unknown>, key: string): obj is Record<string, unknown> & Record<string, string> {
  return typeof obj[key] === 'string' && obj[key] !== '';
}

export function extractAllBlocks(text: string, tag: string): string[] {
  const open = `[${tag}]`;
  const close = `[/${tag}]`;
  const results: string[] = [];
  let searchFrom = 0;
  while (searchFrom < text.length) {
    const startIdx = text.indexOf(open, searchFrom);
    if (startIdx === -1) break;
    const endIdx = text.indexOf(close, startIdx + open.length);
    if (endIdx === -1) break;
    results.push(text.slice(startIdx + open.length, endIdx).trim());
    searchFrom = endIdx + close.length;
  }
  return results;
}

export function parseDraftEntities(content: string): ParsedComponent[] {
  const rawBlocks = extractAllBlocks(content, 'DRAFT_ENTITY');
  const entityBlocks = rawBlocks.length > 0 ? rawBlocks : extractAllBlocks(content, 'ENTITY');
  if (entityBlocks.length === 0) return [];

  const results: ParsedComponent[] = [];
  for (const raw of entityBlocks) {
    const parsed = tryParseJSON(raw);
    if (!isRecord(parsed) || !hasStringKey(parsed, 'title') || !hasStringKey(parsed, 'category')) continue;

    const attributes = parsed.json_attributes && typeof parsed.json_attributes === 'object'
      ? { ...asRecord(parsed.json_attributes) }
      : (parsed.attributes && typeof parsed.attributes === 'object' ? { ...asRecord(parsed.attributes) } : {});

    results.push({
      type: 'draft_card',
      data: {
        title: parsed.title,
        category: parsed.category,
        summary: typeof parsed.summary === 'string' ? parsed.summary : '',
        markdownPreview: typeof parsed.markdown_content === 'string' ? parsed.markdown_content
          : typeof parsed.markdown === 'string' ? parsed.markdown : '',
        attributes,
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      },
    });
  }
  return results;
}

interface RawIssue {
  severity?: string;
  title?: string;
  description?: string;
  entity_ids?: string[];
  entity_titles?: string[];
}

export function parseConsistencyIssues(content: string): ParsedComponent[] {
  const raw = extractBlock(content, 'CONSISTENCY_ISSUES');
  if (!raw) return [];
  const parsed = tryParseJSON(raw);
  if (!isRecord(parsed) || !Array.isArray(parsed.issues)) return [];
  return parsed.issues.map((issue: unknown) => {
    const i = issue as RawIssue;
    return {
      type: 'consistency_issue' as const,
      data: {
        severity: typeof i.severity === 'string' ? i.severity : 'medium',
        title: typeof i.title === 'string' ? i.title : 'Issue Found',
        description: typeof i.description === 'string' ? i.description : 'An inconsistency was detected.',
        entityIds: Array.isArray(i.entity_ids) ? i.entity_ids : [],
        entityTitles: Array.isArray(i.entity_titles) ? i.entity_titles : [],
      },
    };
  });
}

interface RawSuggestion {
  source_title?: string;
  target_title?: string;
  type?: string;
  reason?: string;
}

export function parseRelationshipSuggestions(content: string): ParsedComponent[] {
  const raw = extractBlock(content, 'RELATIONSHIP_SUGGESTIONS');
  if (!raw) return [];
  const parsed = tryParseJSON(raw);
  if (!isRecord(parsed) || !Array.isArray(parsed.suggestions)) return [];
  return parsed.suggestions
    .filter((s: unknown) => {
      const rec = s as RawSuggestion;
      return typeof rec.source_title === 'string' && rec.source_title && typeof rec.target_title === 'string' && rec.target_title;
    })
    .map((s: unknown) => {
      const rec = s as RawSuggestion;
      return {
        type: 'relationship_suggestion' as const,
        data: {
          sourceTitle: rec.source_title ?? '',
          targetTitle: rec.target_title ?? '',
          relationshipType: typeof rec.type === 'string' ? rec.type : 'related_to',
          reason: typeof rec.reason === 'string' ? rec.reason : '',
        },
      };
    });
}

export function parseSchemaConfirmation(content: string): ParsedComponent[] {
  const raw = extractBlock(content, 'SCHEMA_CONFIRMATION');
  if (!raw) return [];
  const parsed = tryParseJSON(raw);
  if (!isRecord(parsed) || !hasStringKey(parsed, 'title')) return [];
  return [{ type: 'schema_confirmation', data: parsed }];
}

// Parse CATEGORY_SUGGESTION blocks
export function parseCategorySuggestions(content: string): ParsedComponent[] {
  const raw = extractBlock(content, 'CATEGORY_SUGGESTION');
  if (!raw) return [];
  const parsed = tryParseJSON(raw);
  if (!isRecord(parsed) || !Array.isArray(parsed.suggestions)) return [];
  return parsed.suggestions
    .filter(isRecord)
    .map((suggestion) => ({ type: 'category_suggestion', data: suggestion }));
}

// Parse GRAPH_ANALYSIS blocks
export function parseGraphAnalysis(content: string): ParsedComponent[] {
  const raw = extractBlock(content, 'GRAPH_ANALYSIS');
  if (!raw) return [];
  const parsed = tryParseJSON(raw);
  if (!isRecord(parsed)) return [];
  return [{ type: 'graph_analysis', data: parsed as Record<string, unknown> }];
}
