import { MODE_PROMPTS } from '@/app/api/ai/chat/prompts';
import {
  buildAiContextPrompt,
  type AiChatEntityContext,
  type AiChatMessage,
  type AiChatWorldContext,
  type AiContextPackInput,
  type AiRuntimeCapabilities,
} from './ai-context';
import {
  parseCategorySuggestions,
  parseConsistencyIssues,
  parseDraftEntities,
  parseGraphAnalysis,
  parseRelationshipSuggestions,
  parseSchemaConfirmation,
  type ParsedComponent,
} from '@/app/api/ai/chat/parsers';

export type {
  AiChatEntityContext,
  AiChatMessage,
  AiChatWorldContext,
  AiContextPackInput,
  AiRuntimeCapabilities,
} from './ai-context';

export { buildAiContextPrompt } from './ai-context';

export interface AiChatPromptInput extends AiContextPackInput {
  messages: AiChatMessage[];
}

export async function buildAiChatSystemPrompt(
  mode: string,
  context?: AiChatEntityContext,
  worldContext?: AiChatWorldContext,
  runtime?: Partial<AiRuntimeCapabilities>,
): Promise<string> {
  const promptMode = (mode in MODE_PROMPTS ? mode : 'lorekeeper') as keyof typeof MODE_PROMPTS;
  const contextPack = buildAiContextPrompt({
    mode: promptMode as AiContextPackInput['mode'],
    context,
    worldContext,
    runtime,
  });

  return [
    MODE_PROMPTS[promptMode],
    'Use the context pack below as the authoritative world/schema/runtime slice for this request.',
    contextPack,
  ].join('\n\n---\n\n');
}

export async function buildAiChatPrompt(input: AiChatPromptInput): Promise<string> {
  const systemPrompt = await buildAiChatSystemPrompt(input.mode, input.context, input.worldContext, input.runtime);
  const transcript = input.messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n\n');

  return [
    'SYSTEM:',
    systemPrompt,
    transcript ? ['CONVERSATION:', transcript].join('\n') : '',
    'ASSISTANT:',
  ].filter(Boolean).join('\n\n');
}

export function stripAiChatStructuredOutput(rawContent: string): string {
  return rawContent
    .replace(/\[DRAFT_ENTITY\][\s\S]*?\[\/DRAFT_ENTITY\]/g, '')
    .replace(/\[ENTITY\][\s\S]*?\[\/ENTITY\]/g, '')
    .replace(/\[CONSISTENCY_ISSUES\][\s\S]*?\[\/CONSISTENCY_ISSUES\]/g, '')
    .replace(/\[RELATIONSHIP_SUGGESTIONS\][\s\S]*?\[\/RELATIONSHIP_SUGGESTIONS\]/g, '')
    .replace(/\[SCHEMA_CONFIRMATION\][\s\S]*?\[\/SCHEMA_CONFIRMATION\]/g, '')
    .replace(/\[CATEGORY_SUGGESTION\][\s\S]*?\[\/CATEGORY_SUGGESTION\]/g, '')
    .replace(/\[GRAPH_ANALYSIS\][\s\S]*?\[\/GRAPH_ANALYSIS\]/g, '')
    .trim();
}

export function extractAiChatComponents(rawContent: string): ParsedComponent[] {
  return [
    ...parseDraftEntities(rawContent),
    ...parseConsistencyIssues(rawContent),
    ...parseRelationshipSuggestions(rawContent),
    ...parseSchemaConfirmation(rawContent),
    ...parseCategorySuggestions(rawContent),
    ...parseGraphAnalysis(rawContent),
  ];
}
