import { describe, expect, it } from "vitest";
import { nextSeedState, preserveSeedOnRename } from "./seedManager";
import type { SeedHistoryEntry } from "./types";

const h: SeedHistoryEntry[] = [
  { revision: 1, seed: "aaaa1111", reason: "initial", timestamp: "2026-01-01T00:00:00.000Z" },
];

describe("seedManager contract", () => {
  it("C9 first generate keeps current seed and writes initial", () => {
    const next = nextSeedState({
      currentSeed: "seed001",
      hasGenerated: false,
      locked: false,
      action: "generate",
      seedHistory: [],
    });
    expect(next.seed).toBe("seed001");
    expect(next.history[0].reason).toBe("initial");
  });

  it("C10 generate after existing rotates seed when unlocked", () => {
    const next = nextSeedState({
      currentSeed: "aaaa1111",
      hasGenerated: true,
      locked: false,
      action: "generate",
      seedHistory: h,
    });
    expect(next.seed).not.toBe("aaaa1111");
    expect(next.history[next.history.length - 1].reason).toBe("generate-next");
  });

  it("C11/C18 regenerate same and locked generate keep seed", () => {
    const regen = nextSeedState({
      currentSeed: "aaaa1111",
      hasGenerated: true,
      locked: false,
      action: "regenerate-same",
      seedHistory: h,
    });
    expect(regen.seed).toBe("aaaa1111");
    expect(regen.history[regen.history.length - 1].reason).toBe("regenerate-same");

    const locked = nextSeedState({
      currentSeed: "aaaa1111",
      hasGenerated: true,
      locked: true,
      action: "generate",
      seedHistory: h,
    });
    expect(locked.seed).toBe("aaaa1111");
    expect(locked.history[locked.history.length - 1].reason).toBe("regenerate-same");
  });

  it("C12 randomize always rotates seed", () => {
    const next = nextSeedState({
      currentSeed: "aaaa1111",
      hasGenerated: true,
      locked: true,
      action: "randomize",
      seedHistory: h,
    });
    expect(next.seed).not.toBe("aaaa1111");
    expect(next.history[next.history.length - 1].reason).toBe("randomize");
  });

  it("C17 rename does not mutate seed", () => {
    expect(preserveSeedOnRename("seed-abc")).toBe("seed-abc");
  });
});
