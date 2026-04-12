// =============================================================================
// MythosForge - AI Calendar Event Generation API
// =============================================================================

import { NextResponse } from 'next/server';
import { getZAI, sleep, parseAIJSON } from '@/lib/ai';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GenerateEventsRequest {
  calendarData: {
    total_months: number;
    days_per_week: number;
    days_per_month: number;
    intercalary_days_count: number;
    month_names: string[];
    weekday_names: string[];
    epoch_event: string;
  };
  worldLore?: string;
  existingEvents?: Array<{ name: string; month: number; day: number; category: string }>;
  preferences: {
    count: number;
    categories: string[];
    customPrompt?: string;
    recurringOnly?: boolean;
    spreadAcrossMonths?: boolean;
  };
}

interface GeneratedEvent {
  name: string;
  description: string;
  month: number;   // 0-based
  day: number;     // 1-based
  year: number;    // 0 = recurring
  category: string;
}

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert fantasy worldbuilding event designer.
The user will provide a calendar structure and world lore. Your job is to generate creative, thematic calendar events (holidays, festivals, celestial events, military remembrances, harvest celebrations, religious observances, etc.) that fit the world.

RULES:
1. Return a JSON array of event objects. No markdown wrapping, no code blocks — raw JSON only.
2. Each event must have: name (string), description (string, 1-2 sentences), month (0-based integer), day (1-based integer), year (0 for recurring every-year events, or a specific year number for one-time events), category (one of: festival, religious, military, harvest, celestial, political, natural, personal).
3. Respect the calendar structure: month must be 0 to (total_months - 1), day must be 1 to days_per_month.
4. Events should feel organic to the world's lore and naming conventions.
5. Spread events across different months unless the user requests otherwise.
6. If the user provides existing events, do NOT duplicate them — generate fresh, distinct events.
7. Event names should be evocative and thematic (e.g., "The Ashen Vigil", "Moonfall Festival", "The Emperor's Procession").
8. Do NOT wrap the JSON in markdown code blocks. Output raw JSON only.

VALID CATEGORIES: festival, religious, military, harvest, celestial, political, natural, personal

EXPECTED JSON FORMAT:
[
  {
    "name": "string",
    "description": "string",
    "month": 0,
    "day": 1,
    "year": 0,
    "category": "festival"
  }
]`;

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body: GenerateEventsRequest = await request.json();
    const { calendarData, worldLore, existingEvents, preferences } = body;

    // Validate calendar data
    if (!calendarData || !calendarData.month_names || !calendarData.weekday_names) {
      return NextResponse.json(
        { error: 'calendarData with month_names and weekday_names is required' },
        { status: 400 },
      );
    }

    // Build the context message
    const calendarSummary = [
      `Calendar Structure:`,
      `- ${calendarData.total_months} months: ${calendarData.month_names.join(', ')}`,
      `- ${calendarData.days_per_week} weekdays: ${calendarData.weekday_names.join(', ')}`,
      `- ${calendarData.days_per_month} days per month`,
      calendarData.intercalary_days_count > 0 ? `- ${calendarData.intercalary_days_count} intercalary days` : '',
      calendarData.epoch_event ? `- Epoch: ${calendarData.epoch_event}` : '',
    ].filter(Boolean).join('\n');

    const existingText = existingEvents && existingEvents.length > 0
      ? `\nExisting events (DO NOT duplicate these):\n${existingEvents.map(e => `- "${e.name}" (${calendarData.month_names[e.month]}, Day ${e.day}, ${e.category})`).join('\n')}`
      : '';

    const loreText = worldLore?.trim()
      ? `\nWorld Lore:\n${worldLore.trim()}`
      : '';

    const categoriesText = preferences.categories.length > 0
      ? `\nPreferred categories: ${preferences.categories.join(', ')}`
      : '';
    const countText = `\nGenerate exactly ${preferences.count || 8} events.`;
    const recurringText = preferences.recurringOnly
      ? '\nAll events should be recurring (year: 0).'
      : '';
    const spreadText = preferences.spreadAcrossMonths
      ? '\nSpread events across different months — avoid clustering.'
      : '';
    const customPromptText = preferences.customPrompt?.trim()
      ? `\nAdditional instructions: ${preferences.customPrompt.trim()}`
      : '';

    const userMessage = [
      calendarSummary,
      loreText,
      existingText,
      categoriesText,
      countText,
      recurringText,
      spreadText,
      customPromptText,
      '\nGenerate the events now:',
    ].join('\n');

    // Call AI SDK with retry
    const zai = await getZAI();
    let completion;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        completion = await zai.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
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

    // Parse the AI response as JSON
    const parsed = parseAIJSON<GeneratedEvent[]>(rawContent);

    if (!parsed || !Array.isArray(parsed)) {
      return NextResponse.json(
        { error: 'AI returned invalid JSON. Event generation could not be parsed.' },
        { status: 502 },
      );
    }

    const events = parsed;

    // Validate and sanitize each event
    const validCategories = new Set(['festival', 'religious', 'military', 'harvest', 'celestial', 'political', 'natural', 'personal']);

    const sanitized = events.map((evt, index) => ({
      id: `evt-ai-${Date.now().toString(36)}-${index.toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: String(evt.name || `Event ${index + 1}`).trim(),
      description: String(evt.description || '').trim(),
      month: Math.max(0, Math.min(calendarData.total_months - 1, Number(evt.month) || 0)),
      day: Math.max(1, Math.min(calendarData.days_per_month, Number(evt.day) || 1)),
      year: preferences.recurringOnly ? 0 : (evt.year === 0 ? 0 : Math.max(1, Number(evt.year) || 0)),
      category: validCategories.has(evt.category) ? evt.category : 'festival',
    }));

    return NextResponse.json(sanitized);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json(
      { error: `Internal server error: ${msg}` },
      { status: 500 },
    );
  }
}
