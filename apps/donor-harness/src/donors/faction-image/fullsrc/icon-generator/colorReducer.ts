import type { ColorChannel, ColorOwner, ColorPresetKey, IconConfig, OwnerByChannel } from "./types";
import type { DomainPalette } from "./domainPalettes";

export type ColorPalette = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
};

export type ColorAction =
  | { type: "select-domain"; palette: ColorPalette }
  | { type: "select-preset"; preset: ColorPresetKey; palette: ColorPalette; applyToAll: boolean }
  | { type: "manual-edit"; channel: ColorChannel; value: string }
  | { type: "reset-domain"; palette: ColorPalette }
  | { type: "reset-preset"; preset: ColorPresetKey; palette: ColorPalette };

export const DEFAULT_OWNER_BY_CHANNEL: OwnerByChannel = {
  primaryColor: "domain",
  secondaryColor: "domain",
  accentColor: "domain",
  backgroundColor: "domain",
};

export const PRESET_PALETTES: Record<Exclude<ColorPresetKey, "domain">, ColorPalette> = {
  "default": { primaryColor: "#1a1a2e", secondaryColor: "#16213e", accentColor: "#e94560", backgroundColor: "#0f3460" },
  "high-contrast": { primaryColor: "#000000", secondaryColor: "#ffffff", accentColor: "#ffcc00", backgroundColor: "#111111" },
  "muted": { primaryColor: "#46505a", secondaryColor: "#6b7280", accentColor: "#9ca3af", backgroundColor: "#2b3138" },
  "vivid": { primaryColor: "#0ea5e9", secondaryColor: "#8b5cf6", accentColor: "#f43f5e", backgroundColor: "#1e1b4b" },
  "monochrome": { primaryColor: "#202020", secondaryColor: "#7a7a7a", accentColor: "#d4d4d4", backgroundColor: "#101010" },
};

export function domainPaletteToColorPalette(palette: DomainPalette): ColorPalette {
  return {
    primaryColor: palette.primary,
    secondaryColor: palette.secondary,
    accentColor: palette.accent,
    backgroundColor: palette.shadow,
  };
}

function ownerByChannel(config: IconConfig): OwnerByChannel {
  return config.ownerByChannel || DEFAULT_OWNER_BY_CHANNEL;
}

function applyByOwner(config: IconConfig, owners: OwnerByChannel, targetOwner: ColorOwner, palette: ColorPalette): IconConfig {
  const next = { ...config };
  (Object.keys(owners) as ColorChannel[]).forEach((channel) => {
    if (owners[channel] === targetOwner) {
      next[channel] = palette[channel];
    }
  });
  return next;
}

export function applyColorAction(config: IconConfig, action: ColorAction): IconConfig {
  const owners = { ...ownerByChannel(config) };

  if (action.type === "manual-edit") {
    return {
      ...config,
      [action.channel]: action.value,
      ownerByChannel: { ...owners, [action.channel]: "manual" },
      manualColorDirtyByChannel: { ...(config.manualColorDirtyByChannel || {}), [action.channel]: true },
    };
  }

  if (action.type === "select-domain") {
    const next = applyByOwner(config, owners, "domain", action.palette);
    return {
      ...next,
      ownerByChannel: owners,
      colorPresetKey: config.colorPresetKey === "domain" ? "domain" : config.colorPresetKey,
    };
  }

  if (action.type === "select-preset") {
    const nextOwners = { ...owners };
    (Object.keys(nextOwners) as ColorChannel[]).forEach((channel) => {
      if (action.applyToAll || nextOwners[channel] !== "manual") {
        nextOwners[channel] = "preset";
      }
    });
    const next = { ...config };
    (Object.keys(nextOwners) as ColorChannel[]).forEach((channel) => {
      if (nextOwners[channel] === "preset") {
        next[channel] = action.palette[channel];
      }
    });
    return {
      ...next,
      ownerByChannel: nextOwners,
      colorPresetKey: action.preset,
    };
  }

  if (action.type === "reset-domain") {
    return {
      ...config,
      ...action.palette,
      ownerByChannel: { ...DEFAULT_OWNER_BY_CHANNEL },
      colorPresetKey: "domain",
      manualColorDirtyByChannel: {},
    };
  }

  return {
    ...config,
    ...action.palette,
    ownerByChannel: {
      primaryColor: "preset",
      secondaryColor: "preset",
      accentColor: "preset",
      backgroundColor: "preset",
    },
    colorPresetKey: action.preset,
    manualColorDirtyByChannel: {},
  };
}

