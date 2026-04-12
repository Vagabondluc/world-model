/** 12 thematic domains with 5-color palettes for light and dark modes. */

export type FactionDomain =
  | "arcane"
  | "divine"
  | "nature"
  | "shadow"
  | "chaos"
  | "order"
  | "primal"
  | "death"
  | "life"
  | "forge"
  | "storm"
  | "trickery";

export const FACTION_DOMAINS: FactionDomain[] = [
  "arcane", "divine", "nature", "shadow", "chaos", "order",
  "primal", "death", "life", "forge", "storm", "trickery",
];

export interface DomainPalette {
  primary: string;
  secondary: string;
  accent: string;
  shadow: string;
  highlight: string;
}

export interface DomainColorSet {
  light: DomainPalette;
  dark: DomainPalette;
  label: string;
  description: string;
}

export const DOMAIN_COLORS: Record<FactionDomain, DomainColorSet> = {
  arcane: {
    label: "Arcane",
    description: "Magic, wizardry, research",
    light: { primary: "#6b5b95", secondary: "#88669d", accent: "#c9a0dc", shadow: "#4a3a6a", highlight: "#e0d4f0" },
    dark:  { primary: "#8b7bba", secondary: "#a89dcc", accent: "#dcc8ff", shadow: "#3a2a5a", highlight: "#c9c3df" },
  },
  divine: {
    label: "Divine",
    description: "Gods, celestials, holy powers",
    light: { primary: "#ffd700", secondary: "#ffed4e", accent: "#fff700", shadow: "#cc9900", highlight: "#fffacd" },
    dark:  { primary: "#ffea80", secondary: "#fff9a5", accent: "#ffff99", shadow: "#b8860b", highlight: "#ffffe0" },
  },
  nature: {
    label: "Nature",
    description: "Wilderness, druids, animals",
    light: { primary: "#2d5016", secondary: "#3d7024", accent: "#90ee90", shadow: "#1a3a0a", highlight: "#c8e6c9" },
    dark:  { primary: "#558b2f", secondary: "#7cb342", accent: "#aed581", shadow: "#1b5e20", highlight: "#dcedc8" },
  },
  shadow: {
    label: "Shadow",
    description: "Darkness, rogues, deception",
    light: { primary: "#1a1a2e", secondary: "#16213e", accent: "#0f3460", shadow: "#0a0a1a", highlight: "#344152" },
    dark:  { primary: "#667bc6", secondary: "#7889b8", accent: "#9bb3dd", shadow: "#3a4a6a", highlight: "#b8bfd9" },
  },
  chaos: {
    label: "Chaos",
    description: "Destruction, wild magic",
    light: { primary: "#ff1744", secondary: "#ff6e40", accent: "#ff9100", shadow: "#cc0000", highlight: "#ffab91" },
    dark:  { primary: "#ff6b6b", secondary: "#ff8a65", accent: "#ffa726", shadow: "#d32f2f", highlight: "#ffccbc" },
  },
  order: {
    label: "Order",
    description: "Law, structure, organization",
    light: { primary: "#1976d2", secondary: "#2196f3", accent: "#64b5f6", shadow: "#0d47a1", highlight: "#bbdefb" },
    dark:  { primary: "#42a5f5", secondary: "#64b5f6", accent: "#90caf9", shadow: "#1565c0", highlight: "#cfe8fc" },
  },
  primal: {
    label: "Primal",
    description: "Savagery, beasts, raw power",
    light: { primary: "#8b4513", secondary: "#a0522d", accent: "#cd853f", shadow: "#704214", highlight: "#d2b48c" },
    dark:  { primary: "#a0522d", secondary: "#cd853f", accent: "#daa520", shadow: "#5c2e0f", highlight: "#f5deb3" },
  },
  death: {
    label: "Death",
    description: "Undeath, necromancy, finality",
    light: { primary: "#2a2a2a", secondary: "#4a4a4a", accent: "#6a6a6a", shadow: "#1a1a1a", highlight: "#8a8a8a" },
    dark:  { primary: "#5a5a5a", secondary: "#7a7a7a", accent: "#9a9a9a", shadow: "#2a2a2a", highlight: "#ababab" },
  },
  life: {
    label: "Life",
    description: "Healing, growth, vitality",
    light: { primary: "#00b050", secondary: "#00c65e", accent: "#70ad47", shadow: "#007c3a", highlight: "#b8e6b8" },
    dark:  { primary: "#4caf50", secondary: "#66bb6a", accent: "#81c784", shadow: "#00796b", highlight: "#c8e6c9" },
  },
  forge: {
    label: "Forge",
    description: "Crafting, industry, fire",
    light: { primary: "#d4471f", secondary: "#ff6b35", accent: "#ffa252", shadow: "#a83415", highlight: "#ffccbc" },
    dark:  { primary: "#ff8a65", secondary: "#ffab91", accent: "#ffb74d", shadow: "#e64a19", highlight: "#ffe0b2" },
  },
  storm: {
    label: "Storm",
    description: "Weather, air, electricity",
    light: { primary: "#1e3a8a", secondary: "#3b6fc3", accent: "#60a5fa", shadow: "#0f2857", highlight: "#dbeafe" },
    dark:  { primary: "#64b5f6", secondary: "#81d4fa", accent: "#b3e5fc", shadow: "#01579b", highlight: "#e1f5fe" },
  },
  trickery: {
    label: "Trickery",
    description: "Deception, illusion, playful chaos",
    light: { primary: "#a020f0", secondary: "#d946ef", accent: "#f0abfc", shadow: "#6a0dad", highlight: "#f3e5f5" },
    dark:  { primary: "#d946ef", secondary: "#f0abfc", accent: "#f5c2ff", shadow: "#7b1fa2", highlight: "#f3e5f5" },
  },
};

/** Get the palette for a domain, with optional dark mode. */
export function getDomainPalette(domain: FactionDomain, darkMode = false): DomainPalette {
  return darkMode ? DOMAIN_COLORS[domain].dark : DOMAIN_COLORS[domain].light;
}
