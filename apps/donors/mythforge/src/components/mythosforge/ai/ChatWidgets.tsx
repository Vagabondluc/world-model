'use client';

import { CheckCircle2, MapPin, ExternalLink, Bot, User, Layers3, GitGraph } from 'lucide-react';
import { useWorldStore } from '@/store/useWorldStore';
import { AI_MODES, type ChatMessage, type ChatComponent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { formatTime } from './ai-config';
import { DraftCardComponent } from './DraftCard';
import { ConsistencyIssueComponent, RelationshipSuggestionComponent } from './ChatCards';

type DraftCardData = Parameters<typeof DraftCardComponent>[0]['data'];
type ConsistencyIssueData = Parameters<typeof ConsistencyIssueComponent>[0]['data'];
type RelationshipSuggestionData = Parameters<typeof RelationshipSuggestionComponent>[0]['data'];
type SchemaConfirmationData = Parameters<typeof SchemaConfirmationComponent>[0]['data'];
type CategorySuggestionData = Parameters<typeof CategorySuggestionComponent>[0]['data'];
type GraphAnalysisData = Parameters<typeof GraphAnalysisComponent>[0]['data'];
type EntityReferenceData = Parameters<typeof EntityReferenceComponent>[0]['data'];

// ─── Schema Confirmation ───────────────────────────────────────────────────
function SchemaConfirmationComponent({
  data,
}: {
  data: { title: string; description: string; field?: string; fieldType?: string };
}) {
  return (
    <div className="mt-2 rounded-lg border border-accent-arcane/20 bg-surface-700/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-accent-arcane font-semibold flex items-center gap-1.5">
        <CheckCircle2 className="size-3" />
        System Confirmation
      </p>
      <p className="mt-1.5 text-sm font-medium text-bone-300">{data.title}</p>
      <p className="mt-1 text-xs text-bone-400 leading-relaxed">{data.description}</p>
      {data.field && (
        <div className="mt-2 flex items-center gap-2 text-[10px] text-ash-500">
          <code className="bg-void-900 rounded px-1.5 py-0.5 text-accent-arcane">{data.field}</code>
          <span>•</span>
          <span>{data.fieldType}</span>
        </div>
      )}
    </div>
  );
}

function CategorySuggestionComponent({
  data,
}: {
  data: {
    suggestions?: Array<{
      category?: string;
      group?: string;
      reason?: string;
      fields?: Array<{ name?: string; type?: string; defaultValue?: unknown }>;
    }>;
  } | Record<string, unknown>;
}) {
  const suggestions = Array.isArray((data as { suggestions?: unknown[] }).suggestions)
    ? ((data as { suggestions?: Array<{ category?: string; group?: string; reason?: string; fields?: Array<{ name?: string; type?: string; defaultValue?: unknown }> }> }).suggestions ?? [])
    : [];

  return (
    <div className="mt-2 rounded-lg border border-white/[0.06] bg-surface-700/40 overflow-hidden">
      <div className="px-3 py-1.5 flex items-center gap-1.5 bg-emerald-500/10 border-b border-emerald-500/20">
        <Layers3 className="size-3 text-emerald-400" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
          Category Suggestions
        </span>
      </div>
      <div className="px-3 py-2.5 space-y-2">
        {suggestions.length === 0 ? (
          <p className="text-xs text-ash-500">No category suggestions were returned.</p>
        ) : (
          suggestions.map((suggestion, idx) => (
            <div key={`${suggestion.category ?? 'category'}-${idx}`} className="rounded-md border border-white/[0.04] bg-surface-600/50 p-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-bone-300">{suggestion.category ?? 'Unnamed category'}</p>
                {suggestion.group && (
                  <span className="text-[10px] text-ash-500">{suggestion.group}</span>
                )}
              </div>
              {suggestion.reason && <p className="mt-1 text-[11px] text-ash-500 leading-relaxed">{suggestion.reason}</p>}
              {Array.isArray(suggestion.fields) && suggestion.fields.length > 0 && (
                <div className="mt-2 text-[10px] text-ash-600 space-y-0.5">
                  {suggestion.fields.map((field) => (
                    <div key={`${suggestion.category ?? 'field'}-${field.name ?? field.type ?? 'unknown'}`}>
                      {field.name ?? 'field'}: {field.type ?? 'unknown'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function GraphAnalysisComponent({
  data,
}: {
  data: Record<string, unknown>;
}) {
  const orphanTitles = Array.isArray(data.orphanTitles) ? data.orphanTitles.filter((item): item is string => typeof item === 'string') : [];
  const clusterTitles = Array.isArray(data.clusterTitles) ? data.clusterTitles.filter((item): item is string => typeof item === 'string') : [];

  return (
    <div className="mt-2 rounded-lg border border-white/[0.06] bg-surface-700/40 overflow-hidden">
      <div className="px-3 py-1.5 flex items-center gap-1.5 bg-sky-500/10 border-b border-sky-500/20">
        <GitGraph className="size-3 text-sky-400" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-sky-400">
          Graph Analysis
        </span>
      </div>
      <div className="px-3 py-2.5 space-y-2">
        {typeof data.summary === 'string' && (
          <p className="text-xs text-bone-300 leading-relaxed">{data.summary}</p>
        )}
        {orphanTitles.length > 0 && (
          <div className="text-[10px] text-ash-500">
            <span className="font-semibold text-ash-400">Orphans:</span> {orphanTitles.join(', ')}
          </div>
        )}
        {clusterTitles.length > 0 && (
          <div className="text-[10px] text-ash-500">
            <span className="font-semibold text-ash-400">Clusters:</span> {clusterTitles.join(', ')}
          </div>
        )}
        {typeof data.orphanCount === 'number' && (
          <div className="text-[10px] text-ash-500">Orphan count: {data.orphanCount}</div>
        )}
      </div>
    </div>
  );
}

// ─── Entity Reference ──────────────────────────────────────────────────────
function EntityReferenceComponent({
  data,
}: {
  data: { entityId: string; title: string; excerpt: string };
}) {
  const setActiveEntity = useWorldStore((s) => s.setActiveEntity);
  const togglePinEntity = useWorldStore((s) => s.togglePinEntity);

  return (
    <button
      onClick={() => setActiveEntity(data.entityId)}
      className="mt-1.5 w-full text-left rounded-lg border border-white/[0.06] bg-surface-600/40 p-2.5 hover:bg-surface-600 transition-colors group"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <ExternalLink className="size-3 text-accent-indigo flex-shrink-0" />
          <span className="text-xs font-medium text-accent-indigo truncate group-hover:underline">
            {data.title}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); togglePinEntity(data.entityId); }}
          className="flex-shrink-0 text-[10px] text-ash-500 hover:text-accent-gold transition-colors flex items-center gap-0.5"
          title="Pin to DM Screen"
        >
          <MapPin className="size-3" />
          Pin
        </button>
      </div>
      <p className="mt-1 text-[11px] text-ash-600 leading-relaxed line-clamp-2">{data.excerpt}</p>
    </button>
  );
}

// ─── Pin Button ────────────────────────────────────────────────────────────
function PinButtonComponent() {
  const activeEntityId = useWorldStore((s) => s.activeEntityId);
  const togglePinEntity = useWorldStore((s) => s.togglePinEntity);
  if (!activeEntityId) return null;
  return (
    <Button
      size="sm" variant="ghost"
      className="mt-2 h-7 text-xs text-ash-500 hover:text-accent-gold hover:bg-accent-gold/10"
      onClick={() => togglePinEntity(activeEntityId)}
    >
      📌 Pin to DM Screen
    </Button>
  );
}

// ─── Component Renderer ────────────────────────────────────────────────────
// In roleplayer mode, suppress structured data-action components.
// Only entity_reference (clickable links) and pin_button are shown.
function ChatComponentRenderer({ component, mode }: { component: ChatComponent; mode?: string }) {
  const isRoleplay = mode === 'roleplayer';
  // Components that should be suppressed in roleplay mode
  if (isRoleplay && ['draft_card', 'relationship_suggestion', 'schema_confirmation', 'consistency_issue', 'category_suggestion', 'graph_analysis'].includes(component.type)) {
    return null;
  }
  switch (component.type) {
    case 'draft_card':
      return <DraftCardComponent data={component.data as DraftCardData} />;
    case 'consistency_issue':
      return <ConsistencyIssueComponent data={component.data as ConsistencyIssueData} />;
    case 'relationship_suggestion':
      return <RelationshipSuggestionComponent data={component.data as RelationshipSuggestionData} />;
    case 'schema_confirmation':
      return <SchemaConfirmationComponent data={component.data as SchemaConfirmationData} />;
    case 'category_suggestion':
      return <CategorySuggestionComponent data={component.data as CategorySuggestionData} />;
    case 'graph_analysis':
      return <GraphAnalysisComponent data={component.data as GraphAnalysisData} />;
    case 'entity_reference':
      return <EntityReferenceComponent data={component.data as EntityReferenceData} />;
    case 'pin_button':
      return <PinButtonComponent />;
    default:
      return null;
  }
}

// ─── Message content renderer (markdown bold/italic) ──────────────────────
function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} className="font-semibold text-bone-100">{part.slice(2, -2)}</span>;
        }
        const italicParts = part.split(/(\*[^*]+\*)/g);
        return (
          <span key={i}>
            {italicParts.map((ip, j) => {
              if (ip.startsWith('*') && ip.endsWith('*') && !ip.startsWith('**')) {
                return <em key={j} className="text-bone-400">{ip.slice(1, -1)}</em>;
              }
              return <span key={j}>{ip}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}

// ─── Chat Message Bubble ───────────────────────────────────────────────────
export function ChatMessageBubble({ msg, modeColor }: { msg: ChatMessage; modeColor: string }) {
  const isUser = msg.role === 'user';
  const isRoleplay = msg.mode === 'roleplayer';

  // Roleplay mode: messaging-app style with NPC name as label
  if (isRoleplay && !isUser) {
    const modeConfig = AI_MODES.find((m) => m.id === 'roleplayer');
    return (
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-accent-blood">
            <Bot className="size-3" />
            {modeConfig?.label || 'NPC'}
          </span>
          <span className="text-[10px] text-ash-600">{formatTime(msg.timestamp)}</span>
        </div>
        <div className="max-w-[92%] px-3.5 py-2.5 text-sm leading-relaxed bg-void-900/60 border border-accent-blood/10 rounded-xl rounded-bl-sm text-bone-200 lore-serif">
          <MessageContent content={msg.content} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-center gap-1.5 mb-1 ${isUser ? 'flex-row-reverse' : ''}`}>
        <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider ${
          isUser ? 'text-ash-600' : `text-${modeColor}`
        }`}>
          {isUser ? (
            <><User className="size-3" /> You</>
          ) : (
            <><Bot className="size-3" /> {AI_MODES.find((m) => m.id === msg.mode)?.label || 'AI'}</>
          )}
        </span>
        <span className="text-[10px] text-ash-600">{formatTime(msg.timestamp)}</span>
      </div>
      <div className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
        isUser
          ? 'chat-bubble-user text-bone-300'
          : 'chat-bubble-ai bg-surface-700 border border-white/[0.06] rounded-lg rounded-bl-sm text-bone-300'
      } ${!isUser ? 'lore-serif' : ''}`}>
        <MessageContent content={msg.content} />
      </div>
      {msg.components && msg.components.length > 0 && (
        <div className="w-full max-w-[85%]">
          {msg.components.map((comp, idx) => (
            <ChatComponentRenderer key={`${msg.id}-comp-${idx}`} component={comp} mode={msg.mode} />
          ))}
        </div>
      )}
    </div>
  );
}
