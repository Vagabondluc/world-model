// Faction and God symbol/image types

export type FactionDomain =
  | 'arcane'
  | 'divine'
  | 'nature'
  | 'shadow'
  | 'chaos'
  | 'order'
  | 'primal'
  | 'death'
  | 'life'
  | 'forge'
  | 'storm'
  | 'trickery';

export type SymbolStyle =
  | 'shield'
  | 'circle'
  | 'star'
  | 'crown'
  | 'rune'
  | 'mandala'
  | 'geometric'
  | 'beast';

export interface FactionConfig {
  name: string;
  domain: FactionDomain;
  style: SymbolStyle;
  seed: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface SymbolGeneratorOptions {
  width?: number;
  height?: number;
  seed: string;
  domain: FactionDomain;
  style: SymbolStyle;
}

export interface GeneratedSymbol {
  svg: string;
  dataUrl: string;
  seed: string;
  domain: FactionDomain;
  style: SymbolStyle;
}

// Domain-specific color palettes
export const DOMAIN_COLORS: Record<FactionDomain, { primary: string; secondary: string; accent: string }> = {
  arcane: { primary: '#6b5b95', secondary: '#88669d', accent: '#c9a0dc' },
  divine: { primary: '#ffd700', secondary: '#ffed4e', accent: '#fff700' },
  nature: { primary: '#2d5016', secondary: '#3d7024', accent: '#90ee90' },
  shadow: { primary: '#1a1a2e', secondary: '#16213e', accent: '#0f3460' },
  chaos: { primary: '#ff1744', secondary: '#ff6e40', accent: '#ff9100' },
  order: { primary: '#1976d2', secondary: '#2196f3', accent: '#64b5f6' },
  primal: { primary: '#8b4513', secondary: '#a0522d', secondary: '#cd853f' },
  death: { primary: '#2a2a2a', secondary: '#4a4a4a', accent: '#6a6a6a' },
  life: { primary: '#00b050', secondary: '#00c65e', accent: '#70ad47' },
  forge: { primary: '#d4471f', secondary: '#ff6b35', accent: '#ffa252' },
  storm: { primary: '#1e3a8a', secondary: '#3b6fc3', accent: '#60a5fa' },
  trickery: { primary: '#a020f0', secondary: '#d946ef', accent: '#f0abfc' },
};

// Symbol style templates
export const SYMBOL_STYLES: Record<SymbolStyle, string> = {
  shield: 'Traditional shield with layered design',
  circle: 'Circular seal with concentric rings',
  star: 'Multi-pointed star or burst pattern',
  crown: 'Crown or tiered apex design',
  rune: 'Runic or mystical character',
  mandala: 'Symmetrical mandala-like pattern',
  geometric: 'Abstract geometric composition',
  beast: 'Stylized creature silhouette',
};
