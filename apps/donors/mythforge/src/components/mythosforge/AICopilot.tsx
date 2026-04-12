'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { useWorldStore } from '@/store/useWorldStore';
import { AI_MODES, type AIMode, type ChatComponent, type ChatMessage } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MODE_EMOJIS, MODE_COLORS, MODE_QUICK_ACTIONS, generateMockResponse } from './ai/ai-config';
import { ChatMessageBubble } from './ai/ChatWidgets';
import {
  discoverOllamaModels,
  loadOllamaSettings,
  resolveOllamaModel,
} from '@/lib/llm/ollama-settings';
import {
  type AiChatEntityContext,
  type AiChatWorldContext,
} from '@/lib/llm/ai-chat';

export function AICopilot() {
  const {
    aiMode, setAiMode, chatMessages, addChatMessage,
    chatInput, setChatInput, activeEntityId, entities, customCategories,
  } = useWorldStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = useCallback(async (overridePrompt?: string) => {
    const trimmed = overridePrompt || chatInput.trim();
    if (!trimmed) return;
    const currentStore = useWorldStore.getState();
    const conversationMessages = [...currentStore.chatMessages.slice(-9), { role: 'user' as const, content: trimmed, mode: aiMode }];
    addChatMessage({ role: 'user', content: trimmed, mode: aiMode });
    setChatInput('');

    const entityTitles: Record<string, string> = {};
    const entityIds = currentStore.entities.map((e) => { entityTitles[e.id] = e.title; return e.id; });
    const activeEntityData = activeEntityId ? currentStore.entities.find((e) => e.id === activeEntityId) : undefined;
    setIsLoading(true);

    try {
      // Try Tauri Ollama bridge first (desktop); fall back to server API when unavailable.
      let usedTauri = false;
      try {
        const settings = await loadOllamaSettings();
        const discoveredModels = settings.discoveredModels.length > 0
          ? settings.discoveredModels
          : await discoverOllamaModels();
        const modelName = resolveOllamaModel(settings, discoveredModels);

        if (modelName) {
          const { generateLocalOllamaResponse } = await import('@/lib/llm/local-ollama');
          const context: AiChatEntityContext | undefined = activeEntityData ? {
            entityId: activeEntityData.id,
            entityTitle: activeEntityData.title,
            entityCategory: activeEntityData.category,
            entityMarkdown: activeEntityData.markdown_content,
            entityAttributes: activeEntityData.json_attributes,
          } : undefined;
          const worldContext: AiChatWorldContext = {
            entities: currentStore.entities.map((e) => ({
              id: e.id,
              title: e.title,
              category: e.category,
              uuid_short: e.uuid_short,
              markdown_content: e.markdown_content,
              json_attributes: e.json_attributes,
              tags: e.tags,
            })),
            relationships: currentStore.relationships.map((r) => ({
              id: r.id,
              parent_id: r.parent_id,
              child_id: r.child_id,
              relationship_type: r.relationship_type,
            })),
            customCategories: currentStore.customCategories,
          };
          const { content, components } = await generateLocalOllamaResponse(modelName, {
            messages: conversationMessages
              .filter((m): m is typeof m & { role: 'user' | 'assistant' } => m.role !== 'system')
              .map((m) => ({ role: m.role, content: m.content })),
            mode: aiMode,
            context,
            worldContext,
          });
          addChatMessage({ role: 'assistant', content, mode: aiMode, components: components as ChatComponent[] });
          usedTauri = true;
        }
      } catch {
        // Tauri not available or invocation failed — will fall back to HTTP below
      }

      if (!usedTauri) {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: conversationMessages.map((m) => ({ role: m.role, content: m.content })),
              mode: aiMode,
              context: activeEntityData
                ? { entityId: activeEntityData.id, entityTitle: activeEntityData.title, entityCategory: activeEntityData.category, entityMarkdown: activeEntityData.markdown_content, entityAttributes: activeEntityData.json_attributes }
                : undefined,
              worldContext: {
                entities: currentStore.entities.map((e) => ({ id: e.id, title: e.title, category: e.category, uuid_short: e.uuid_short, markdown_content: e.markdown_content, json_attributes: e.json_attributes, tags: e.tags })),
                relationships: currentStore.relationships.map((r) => ({ id: r.id, parent_id: r.parent_id, child_id: r.child_id, relationship_type: r.relationship_type })),
                customCategories,
              },
            }),
          });
        if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
        const data = await res.json();
        addChatMessage({ role: 'assistant', content: data.content, mode: aiMode, components: data.suggestedComponents });
      }
    } catch {
      const fallback = generateMockResponse(aiMode, trimmed, entityIds, entityTitles);
      addChatMessage({ role: 'assistant', content: fallback.content, mode: aiMode, components: fallback.components });
    } finally { setIsLoading(false); }
  }, [chatInput, aiMode, addChatMessage, setChatInput, activeEntityId, customCategories]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    }, [handleSend],
  );

  const activeEntity = entities.find((e) => e.id === activeEntityId);
  const quickActions = MODE_QUICK_ACTIONS[aiMode] || [];
  const modeColor = MODE_COLORS[aiMode];

  return (
    <div data-testid="ai-copilot" className="flex flex-col h-full bg-void-800">
      {/* Header */}
      <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-accent-gold" />
          <span className="text-sm font-semibold text-bone-300">AI Co-Pilot</span>
        </div>
        {activeEntity ? (
          <span className="text-[10px] rounded-full bg-surface-600 text-ash-500 px-2.5 py-0.5 truncate max-w-[160px]">
            Context: {activeEntity.title}
          </span>
        ) : (
          <span className="text-[10px] rounded-full bg-surface-600 text-ash-600 px-2.5 py-0.5">No context</span>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="flex-shrink-0 h-10 flex items-center px-4 border-b border-white/[0.06]">
        <Select value={aiMode} onValueChange={(val) => setAiMode(val as AIMode)}>
          <SelectTrigger size="sm" className="w-full h-8 text-xs bg-transparent border-white/[0.08] text-bone-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface-700 border-white/[0.08]">
            {AI_MODES.map((mode) => (
              <SelectItem key={mode.id} value={mode.id} className="text-xs text-bone-300 focus:bg-surface-600 focus:text-bone-100">
                <span className="mr-1.5">{MODE_EMOJIS[mode.id]}</span>
                {mode.label}
                <span className="ml-2 text-ash-600 text-[10px]">— {mode.description}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="flex-shrink-0 px-4 py-2 border-b border-white/[0.06] flex gap-1.5 overflow-x-auto">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.label} onClick={() => handleSend(action.prompt)} disabled={isLoading}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-ash-500 border border-white/[0.06] hover:border-accent-gold/20 hover:text-accent-gold hover:bg-accent-gold/5 transition-colors disabled:opacity-30 cursor-pointer">
                <Icon className="size-3" />{action.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Bot className="size-10 text-ash-600 mb-3" />
            <p className="text-sm text-ash-500 font-medium">No messages yet</p>
            <p className="text-xs text-ash-600 mt-1 max-w-[220px]">Select a mode and start chatting. Use quick action buttons for common tasks.</p>
          </div>
        )}
        {chatMessages.map((msg: ChatMessage) => (
          <ChatMessageBubble key={msg.id} msg={msg} modeColor={modeColor} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2">
          <Input data-testid="ai-input" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={`Message ${AI_MODES.find((m) => m.id === aiMode)?.label || 'AI'}...`}
            className="flex-1 h-9 text-sm bg-surface-700/50 border-white/[0.08] text-bone-300 placeholder:text-ash-600 focus-visible:border-accent-gold/40 focus-visible:ring-accent-gold/20" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button data-testid="ai-send" size="icon" variant="ghost" onClick={() => handleSend()} disabled={!chatInput.trim() || isLoading}
                className="h-9 w-9 text-ash-500 hover:text-accent-gold hover:bg-accent-gold/10 disabled:opacity-30">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-void-700 border-white/[0.08] text-bone-300 text-xs">Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
