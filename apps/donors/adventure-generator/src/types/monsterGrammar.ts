


export type Axis = "Offense" | "Defense" | "Control" | "Mobility" | "Utility";
export type AlignTendency = "LG" | "NG" | "CG" | "LN" | "N" | "CN" | "LE" | "NE" | "CE";

export interface GrammarTag {
  id: string;
  name: string;
  // FIX: Added 'Physiology & Movement' and 'Environmental' to the category union type.
  category: 'Elemental' | 'Combat' | 'Magic' | 'Supernatural' | 'Other' | 'Class Archetype' | 'Planar & Allegiance' | 'Physiology & Movement' | 'Behavioral' | 'Condition & Control' | 'Environmental';
  description: string;
  damageTypes?: string[];
}

export interface DamagePayload {
  count: number;
  die: string;
  modifier: number;
  type: string;
}

export interface PowerAtom {
  id: string;                 // "frost-bolt"
  label: string;              // UI text
  axis: Axis;                 // contributes to this budget bucket
  cost: number;               // budget cost (scaled by CR)
  text: string;               // 5e-ready markdown snippet
  damage?: string;            // Optional dice string, e.g., "2d6 fire"
  tags: string[];             // "ranged","slow","cold"
  actionType?: "Action" | "Bonus Action" | "Reaction" | "Legendary" | "Trait";
  recharge?: string;          // "Recharge 5–6", "1/day", etc.
  scaling?: "mod" | "prof" | "cr"; // how numbers scale
}

export interface Rule {
  id: string;                 // "cold:basic-kit"
  weight: number;             // stochastic selection weight (pre-UI)
  when: {
    minCR?: number;
    maxCR?: number;
    roles?: string[];         // "Brute","Controller",...
    align?: AlignTendency[];  // any-of
    
    // Tag Grammar System (DEC-020)
    requireTags?: string[];    // OR logic: Match ANY of these tags
    requireTagsAll?: string[]; // AND logic: Match ALL of these tags (for combinations)
    forbidTags?: string[];     // Match NONE of these tags
    
    hasTagsAny?: string[];    // graph already has these tags
  };
  pattern?: string[];         // atoms/tags required in the current graph
  produce: (ctx: Context) => PowerAtom[]; // emits atoms (actions/traits)
  budgetUse: Partial<Record<Axis, number>>; // nominal cost per application
  oncePerMonster?: boolean;
  guards?: (ctx: Context) => boolean; // Programmatic check
}

export interface Context {
  cr: number;
  role: string;
  alignment: AlignTendency;
  tags: string[];           // Atomic tags for the grammar engine
  env: string;              // environment
  rng: () => number;        // seeded RNG, stable per UUID
  budget: Record<Axis, number>;
  graph: { atoms: PowerAtom[]; tags: Set<string>; };
}