import { describe, expect, it } from "vitest";
import { applyColorAction, DEFAULT_OWNER_BY_CHANNEL, PRESET_PALETTES } from "./colorReducer";
import type { IconConfig } from "./types";

function baseConfig(): IconConfig {
  return {
    primaryColor: "#111111",
    secondaryColor: "#222222",
    accentColor: "#333333",
    backgroundColor: "#444444",
    ownerByChannel: { ...DEFAULT_OWNER_BY_CHANNEL },
    colorPresetKey: "domain",
  };
}

describe("colorReducer contract", () => {
  it("C1 updates domain-owned channels on domain select", () => {
    const next = applyColorAction(baseConfig(), {
      type: "select-domain",
      palette: {
        primaryColor: "#aaaaaa",
        secondaryColor: "#bbbbbb",
        accentColor: "#cccccc",
        backgroundColor: "#dddddd",
      },
    });
    expect(next.primaryColor).toBe("#aaaaaa");
    expect(next.ownerByChannel?.primaryColor).toBe("domain");
  });

  it("C2 manual-owned channels remain unchanged on domain select", () => {
    const cfg = applyColorAction(baseConfig(), { type: "manual-edit", channel: "primaryColor", value: "#ff00ff" });
    const next = applyColorAction(cfg, {
      type: "select-domain",
      palette: {
        primaryColor: "#aaaaaa",
        secondaryColor: "#bbbbbb",
        accentColor: "#cccccc",
        backgroundColor: "#dddddd",
      },
    });
    expect(next.primaryColor).toBe("#ff00ff");
    expect(next.ownerByChannel?.primaryColor).toBe("manual");
  });

  it("C4+C5+C6 preset apply respects applyToAll", () => {
    const withManual = applyColorAction(baseConfig(), { type: "manual-edit", channel: "accentColor", value: "#123456" });
    const unlocked = applyColorAction(withManual, {
      type: "select-preset",
      preset: "vivid",
      palette: PRESET_PALETTES.vivid,
      applyToAll: false,
    });
    expect(unlocked.accentColor).toBe("#123456");
    expect(unlocked.ownerByChannel?.accentColor).toBe("manual");

    const all = applyColorAction(withManual, {
      type: "select-preset",
      preset: "vivid",
      palette: PRESET_PALETTES.vivid,
      applyToAll: true,
    });
    expect(all.accentColor).toBe(PRESET_PALETTES.vivid.accentColor);
    expect(all.ownerByChannel?.accentColor).toBe("preset");
  });

  it("C7+C8 reset actions normalize owners", () => {
    const withManual = applyColorAction(baseConfig(), { type: "manual-edit", channel: "secondaryColor", value: "#abcdef" });
    const rDomain = applyColorAction(withManual, {
      type: "reset-domain",
      palette: {
        primaryColor: "#111aaa",
        secondaryColor: "#222bbb",
        accentColor: "#333ccc",
        backgroundColor: "#444ddd",
      },
    });
    expect(rDomain.ownerByChannel).toEqual(DEFAULT_OWNER_BY_CHANNEL);

    const rPreset = applyColorAction(withManual, {
      type: "reset-preset",
      preset: "muted",
      palette: PRESET_PALETTES.muted,
    });
    expect(rPreset.ownerByChannel).toEqual({
      primaryColor: "preset",
      secondaryColor: "preset",
      accentColor: "preset",
      backgroundColor: "preset",
    });
  });
});

