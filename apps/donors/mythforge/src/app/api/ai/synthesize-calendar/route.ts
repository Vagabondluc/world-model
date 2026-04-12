import { NextResponse } from 'next/server';
import { getZAI, sleep, parseAIJSON } from '@/lib/ai';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SynthesizeRequest {
  notes: {
    cosmology_solar?: string;
    cosmology_moons?: string;
    structure_grid?: string;
    structure_intercalary?: string;
    lore_epoch?: string;
    lore_naming?: string;
  };
}

interface CalendarStructuredData {
  total_months: number;
  days_per_week: number;
  days_per_month: number;
  intercalary_days_count: number;
  month_names: string[];
  weekday_names: string[];
  epoch_event: string;
}

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert worldbuilding data-extraction engine.
The user will provide rough, brainstorming notes for a fantasy calendar.
Your job is to read these notes, extract the mathematical constraints, and invent any missing nomenclature based on the user's chosen themes.

RULES:
1. You MUST return valid JSON matching the exact schema provided. No markdown wrapping, no code blocks, no explanatory text — raw JSON only.
2. If the user specifies a number of months (e.g. "10 months") and a naming theme (e.g. "Dead Emperors"), you must generate an array of that many distinct, thematic month names.
3. If the user provides the total days in a year and the number of months, calculate days_per_month mathematically (e.g., 360 days / 12 months = 30). If the user says "365-day year with 12 months and 5 intercalary days", then days_per_month = (365 - 5) / 12 = 30.
4. Weekday names must match the specified days_per_week count.
5. Month names must match the specified total_months count.
6. The epoch_event should be a concise description (1-2 sentences) of the event that marks Year 1, synthesized from the user's notes.
7. If the user hasn't specified something, make a reasonable creative default:
   - Default to 12 months if no count is given
   - Default to 7-day weeks if no count is given
   - Default to "The Founding" as epoch if none is specified
   - Generate appropriate themed names based on whatever themes are mentioned in the notes
8. Do NOT wrap the JSON in markdown code blocks (no \`\`\`json). Output raw JSON only.

EXPECTED JSON SCHEMA:
{
  "total_months": integer (e.g. 12),
  "days_per_week": integer (e.g. 7),
  "days_per_month": integer (e.g. 30),
  "intercalary_days_count": integer (e.g. 5),
  "month_names": ["string", "string", ...] (length must equal total_months),
  "weekday_names": ["string", "string", ...] (length must equal days_per_week),
  "epoch_event": "string"
}`;

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body: SynthesizeRequest = await request.json();
    const { notes } = body;

    if (!notes || typeof notes !== 'object') {
      return NextResponse.json({ error: 'notes object is required' }, { status: 400 });
    }

    const notesText = Object.entries(notes)
      .filter(([, v]) => typeof v === 'string' && v.trim().length > 0)
      .map(([k, v]) => `[${k.replace(/_/g, ' ')}]: ${v.trim()}`)
      .join('\n\n');

    if (!notesText.trim()) {
      return NextResponse.json({ error: 'At least one brainstorming field must have content' }, { status: 400 });
    }

    const userMessage = `Here are my calendar brainstorming notes. Please synthesize the structured calendar data:\n\n${notesText}`;

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
    const parsed = parseAIJSON<CalendarStructuredData>(rawContent);

    if (!parsed) {
      return NextResponse.json(
        { error: 'AI returned invalid JSON. The synthesis could not be parsed.' },
        { status: 502 },
      );
    }

    // Validate required fields
    const requiredKeys: (keyof CalendarStructuredData)[] = [
      'total_months', 'days_per_week', 'days_per_month',
      'intercalary_days_count', 'month_names', 'weekday_names', 'epoch_event',
    ];

    for (const key of requiredKeys) {
      if (parsed[key] === undefined || parsed[key] === null) {
        return NextResponse.json({ error: `AI response missing required field: ${key}` }, { status: 502 });
      }
    }

    // Coerce types
    parsed.total_months = Number(parsed.total_months);
    parsed.days_per_week = Number(parsed.days_per_week);
    parsed.days_per_month = Number(parsed.days_per_month);
    parsed.intercalary_days_count = Number(parsed.intercalary_days_count);

    if (!Array.isArray(parsed.month_names)) parsed.month_names = [];
    if (!Array.isArray(parsed.weekday_names)) parsed.weekday_names = [];

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json({ error: `Internal server error: ${msg}` }, { status: 500 });
  }
}
