import { NextResponse } from 'next/server';
import { getZAI, sleep } from '@/lib/ai';
import { buildAiChatSystemPrompt, extractAiChatComponents, stripAiChatStructuredOutput, type AiChatEntityContext, type AiChatWorldContext } from '@/lib/llm/ai-chat';
import type { ParsedComponent } from './parsers';

import { MODE_PROMPTS } from './prompts';

const VALID_MODES = new Set(Object.keys(MODE_PROMPTS));

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  mode: string;
  context?: AiChatEntityContext;
  worldContext?: AiChatWorldContext;
}

// Re-export for consumers
export type { ParsedComponent };

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, mode, context, worldContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required and must not be empty' },
        { status: 400 },
      );
    }
    if (!mode || !VALID_MODES.has(mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Must be one of: ${[...VALID_MODES].join(', ')}` },
        { status: 400 },
      );
    }

    const systemPrompt = await buildAiChatSystemPrompt(mode, context, worldContext, {
      localOllama: false,
      httpAi: true,
      openui: true,
      piMono: false,
    });
    // Build final messages array
    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
    ];

    // Call AI SDK with retry
    const zai = await getZAI();
    let completion;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        completion = await zai.chat.completions.create({
          messages: chatMessages,
          thinking: { type: 'disabled' },
        });
        lastError = null;
        break;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt === 0) await sleep(1000);
      }
    }

    if (lastError || !completion) {
      return NextResponse.json(
        { error: `AI SDK call failed: ${lastError?.message || 'unknown error'}` },
        { status: 500 },
      );
    }

    const rawContent = completion.choices?.[0]?.message?.content || '';

    // Parse structured output blocks
    const components: ParsedComponent[] = extractAiChatComponents(rawContent);
    const cleanedContent = stripAiChatStructuredOutput(rawContent);

    return NextResponse.json({ content: cleanedContent, suggestedComponents: components });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json(
      { error: `Internal server error: ${msg}` },
      { status: 500 },
    );
  }
}
