// =============================================================================
// MythosForge - Shared AI SDK Utilities
// =============================================================================

import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

export async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Strip markdown code blocks and parse JSON from AI response.
 */
export function parseAIJSON<T>(rawContent: string): T | null {
  const cleanJson = rawContent
    .replace(/^```json?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleanJson) as T;
  } catch {
    return null;
  }
}
