import type { SeedHistoryEntry, SeedHistoryReason } from "./types";

export type SeedAction = "generate" | "regenerate-same" | "randomize";

export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function normalizeSeedSource(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "");
}

export function preserveSeedOnRename(seed: string): string {
  return seed;
}

export function nextSeedState(args: {
  currentSeed?: string;
  hasGenerated: boolean;
  locked: boolean;
  action: SeedAction;
  seedHistory: SeedHistoryEntry[];
}): { seed: string; history: SeedHistoryEntry[] } {
  const now = new Date().toISOString();
  const currentSeed = args.currentSeed || randomSeed();
  let nextSeed = currentSeed;
  let reason: SeedHistoryReason = "regenerate-same";

  if (!args.hasGenerated) {
    nextSeed = currentSeed;
    reason = "initial";
  } else if (args.action === "randomize") {
    nextSeed = randomSeed();
    reason = "randomize";
  } else if (args.action === "generate" && !args.locked) {
    nextSeed = randomSeed();
    reason = "generate-next";
  } else {
    reason = "regenerate-same";
  }

  const revision = args.seedHistory.length ? args.seedHistory[args.seedHistory.length - 1].revision + 1 : 1;
  const entry: SeedHistoryEntry = { revision, seed: nextSeed, reason, timestamp: now };
  return { seed: nextSeed, history: [...args.seedHistory, entry] };
}
