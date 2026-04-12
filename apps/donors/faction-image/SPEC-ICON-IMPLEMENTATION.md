# Icon Implementation Specification
**Last Updated:** 2026-03-10  
**Status:** DESIGN PHASE → IMPLEMENTATION READY  
**Scope:** Complete icon system for faction/god symbol generation

---

## 1. Overview & Architecture

### 1.1 System Purpose
Provide faction/god symbols by combining a curated 10K SVG icon library (game-icons.net) with:
- **Deterministic recoloring** (black SVG → domain-specific colors)
- **Keyword-driven discovery** (text search + domain auto-suggest)
- **State persistence** (remembers selections across sessions)
- **Export pipeline** (SVG → PNG/WebP + data URLs)

### 1.2 Core Components
```
┌─────────────────────────────────────────────────────────┐
│             Faction Symbol Generator                     │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Discovery UI   │  │ Recolor      │  │ Icon State  │  │
│  │ (Search +      │→ │ Engine       │→ │ & Metadata  │  │
│  │  Domain BTN)   │  │ (SVG Mutate) │  │ (JSON)      │  │
│  └────────────────┘  └──────────────┘  └─────────────┘  │
│         ↑                   ↓                    ↓         │
│  ┌──────────────────────┐  ┌─────────────────────┐       │
│  │ Keyword Dictionary   │  │ Export Pipeline     │       │
│  │ (search index)       │  │ (SVG→PNG→DataURL)   │       │
│  └──────────────────────┘  └─────────────────────┘       │
│         ↑                                                  │
│  ┌──────────────────────────────────────────────┐        │
│  │ Icon Asset Library                           │        │
│  │ /icons/000000/transparent/1x1/{artist}/*.svg│        │
│  └──────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### 1.3 Design Principles
1. **Determinism**: Same faction config → same symbol forever
2. **Zero Procedural Surprise**: Curated assets, not generated art
3. **Domain-Driven Discovery**: "What domain?" → 6-8 categories
4. **Minimal Configuration**: Name + Domain → color palette derived
5. **Accessibility**: Works in light/dark mode via CSS logic

---

## 2. Data Structures

### 2.1 Domain Color Palettes (`config/domains.json`)
```json
{
  "domains": {
    "arcane": {
      "label": "Arcane",
      "description": "Magic, spells, mystical forces",
      "colors": {
        "light": {
          "primary": "#6B4FC1",
          "secondary": "#9D7FD4",
          "accent": "#E8D4FF",
          "shadow": "#3D2B6B",
          "highlight": "#D4B8FF"
        },
        "dark": {
          "primary": "#A684D4",
          "secondary": "#C4A3E0",
          "accent": "#7854D4",
          "shadow": "#2B1D4D",
          "highlight": "#C4ACFF"
        }
      },
      "categoryAffinities": {
        "RUNE": 0.95,
        "STAFF": 0.90,
        "SCROLL": 0.88,
        "CRYSTAL": 0.85,
        "SWORD": 0.40,
        "SHIELD": 0.35
      }
    },
    "divine": {
      "label": "Divine",
      "description": "Holy, blessed, celestial",
      "colors": {
        "light": {
          "primary": "#FFD700",
          "secondary": "#FFF8DC",
          "accent": "#FFFFFF",
          "shadow": "#DAA520",
          "highlight": "#FFED4E"
        },
        "dark": {
          "primary": "#FFE135",
          "secondary": "#FFC700",
          "accent": "#FFD700",
          "shadow": "#CC8800",
          "highlight": "#FFEB99"
        }
      },
      "categoryAffinities": {
        "HOLY": 0.95,
        "SHIELD": 0.90,
        "SWORD": 0.85,
        "STAFF": 0.80,
        "CROWN": 0.75,
        "RUNE": 0.40
      }
    },
    "nature": {
      "label": "Nature",
      "description": "Wild, plants, beasts, forests",
      "colors": {
        "light": {
          "primary": "#228B22",
          "secondary": "#90EE90",
          "accent": "#F0FFF0",
          "shadow": "#1B5E20",
          "highlight": "#90FF90"
        },
        "dark": {
          "primary": "#5FAA5F",
          "secondary": "#7CCA7C",
          "accent": "#4CAF50",
          "shadow": "#2D5016",
          "highlight": "#A8D8A8"
        }
      },
      "categoryAffinities": {
        "CREATURE": 0.95,
        "PLANT": 0.90,
        "BOW": 0.85,
        "TRACK": 0.80,
        "SHIELD": 0.50
      }
    },
    "shadow": {
      "label": "Shadow",
      "description": "Darkness, stealth, deception",
      "colors": {
        "light": {
          "primary": "#2F2F2F",
          "secondary": "#696969",
          "accent": "#A9A9A9",
          "shadow": "#000000",
          "highlight": "#4F4F4F"
        },
        "dark": {
          "primary": "#595959",
          "secondary": "#808080",
          "accent": "#A9A9A9",
          "shadow": "#1A1A1A",
          "highlight": "#B0B0B0"
        }
      },
      "categoryAffinities": {
        "DAGGER": 0.95,
        "MASK": 0.90,
        "CLOAK": 0.85,
        "ROGUE": 0.80,
        "SWORD": 0.50
      }
    },
    "chaos": {
      "label": "Chaos",
      "description": "Destruction, unpredictability, mutation",
      "colors": {
        "light": {
          "primary": "#FF4500",
          "secondary": "#FF6347",
          "accent": "#FFB347",
          "shadow": "#8B2500",
          "highlight": "#FF7F50"
        },
        "dark": {
          "primary": "#FF6B35",
          "secondary": "#FF7A59",
          "accent": "#FF6B5B",
          "shadow": "#8B0000",
          "highlight": "#FF9966"
        }
      },
      "categoryAffinities": {
        "DEMON": 0.95,
        "FIRE": 0.90,
        "BOMB": 0.85,
        "AXE": 0.80,
        "SWORD": 0.75
      }
    },
    "order": {
      "label": "Order",
      "description": "Law, structure, justice",
      "colors": {
        "light": {
          "primary": "#1E90FF",
          "secondary": "#6495ED",
          "accent": "#E0FFFF",
          "shadow": "#00008B",
          "highlight": "#87CEEB"
        },
        "dark": {
          "primary": "#4169E1",
          "secondary": "#6A8FD0",
          "accent": "#1E90FF",
          "shadow": "#001080",
          "highlight": "#87CEEB"
        }
      },
      "categoryAffinities": {
        "SHIELD": 0.95,
        "SWORD": 0.90,
        "CROWN": 0.85,
        "GAVEL": 0.80,
        "CHAIN": 0.75
      }
    }
  }
}
```

### 2.2 Icon Metadata Dictionary (`config/keywords.json`)
```json
{
  "version": "1.0",
  "lastUpdated": "2026-03-10",
  "categories": {
    "SWORD": {
      "label": "Swords & Blades",
      "keywords": ["sword", "blade", "longsword", "shortsword", "katana", "scimitar", "rapier", "broadsword"],
      "icons": [
        {
          "id": "delapouite/ancient-sword",
          "filename": "ancient-sword.svg",
          "artist": "delapouite",
          "keywords": ["sword", "ancient", "rusty"],
          "domains": { "order": 0.7, "chaos": 0.5, "arcane": 0.6 }
        },
        {
          "id": "delapouite/broken-axe",
          "filename": "broken-axe.svg",
          "artist": "delapouite",
          "keywords": ["axe", "broken", "damage"],
          "domains": { "chaos": 0.8, "forge": 0.7 }
        }
      ],
      "dominantDomains": ["order", "divine", "chaos"]
    },
    "SHIELD": {
      "label": "Shields & Protection",
      "keywords": ["shield", "kite", "heater", "buckler", "protection"],
      "icons": [
        {
          "id": "delapouite/shield",
          "filename": "shield.svg",
          "artist": "delapouite",
          "keywords": ["shield", "basic"],
          "domains": { "order": 0.9, "divine": 0.8, "nature": 0.4 }
        }
      ],
      "dominantDomains": ["divine", "order"]
    },
    "RUNE": {
      "label": "Runes & Symbols",
      "keywords": ["rune", "glyph", "symbol", "mark"],
      "icons": [],
      "dominantDomains": ["arcane", "divine", "shadow"]
    },
    "STAFF": {
      "label": "Staffs & Wands",
      "keywords": ["staff", "wand", "rod", "pole"],
      "icons": [],
      "dominantDomains": ["arcane", "divine"]
    },
    "CROWN": {
      "label": "Crowns & Tiaras",
      "keywords": ["crown", "tiara", "corona", "helm"],
      "icons": [],
      "dominantDomains": ["order", "divine"]
    },
    "FIRE": {
      "label": "Fire & Flame",
      "keywords": ["fire", "flame", "burn", "torch"],
      "icons": [],
      "dominantDomains": ["chaos", "forge"]
    },
    "CREATURE": {
      "label": "Creatures & Beasts",
      "keywords": ["creature", "beast", "dragon", "demon", "angel"],
      "icons": [],
      "dominantDomains": ["nature", "chaos", "divine"]
    },
    "DAGGER": {
      "label": "Daggers & Small Blades",
      "keywords": ["dagger", "knife", "blade"],
      "icons": [],
      "dominantDomains": ["shadow", "order", "chaos"]
    },
    "BOW": {
      "label": "Bows & Ranged Weapons",
      "keywords": ["bow", "arrow", "crossbow"],
      "icons": [],
      "dominantDomains": ["nature", "order"]
    },
    "HOLY": {
      "label": "Holy Symbols",
      "keywords": ["holy", "blessed", "sacred", "cross"],
      "icons": [],
      "dominantDomains": ["divine", "order"]
    }
  },
  "searchIndex": {
    "sword": ["SWORD"],
    "blade": ["SWORD", "DAGGER"],
    "shield": ["SHIELD"],
    "fire": ["FIRE"],
    "creature": ["CREATURE"],
    "demon": ["CREATURE", "CHAOS"],
    "dragon": ["CREATURE", "NATURE"],
    "rune": ["RUNE"],
    "staff": ["STAFF"],
    "crown": ["CROWN"],
    "dagger": ["DAGGER"],
    "bow": ["BOW"],
    "holy": ["HOLY"]
  }
}
```

### 2.3 Icon State & Selection (`src/lib/faction/icon-state.ts`)
```typescript
export interface IconSelection {
  // Unique identifier
  id: string;
  
  // Asset reference
  asset: {
    id: string;              // delapouite/ancient-sword
    filename: string;        // ancient-sword.svg
    artist: string;          // delapouite
    path: string;           // /icons/000000/transparent/1x1/delapouite/
  };
  
  // Color configuration
  colors: {
    domain: string;         // "arcane", "divine", "chaos"
    lightMode: boolean;     // true = light palette; false = dark
    primary: string;        // Hex color applied to SVG
    secondary?: string;     // Optional for multi-color effects
    opacity?: number;       // 1.0 = full opacity; 0.5 = 50%
  };
  
  // Visual effects
  effects: {
    brightness: number;     // 0.5 - 2.0 (50% - 200%)
    saturation: number;     // 0.5 - 2.0 (50% - 200%) 
    contrast: number;       // 0.5 - 2.0
  };
  
  // Metadata
  metadata: {
    createdAt: string;      // ISO timestamp
    modifiedAt: string;
    history: {
      timestamp: string;
      action: "created" | "edited" | "domain_changed";
      before?: IconSelection;
    }[];
  };
  
  // Export formats
  exports: {
    svg?: string;           // Raw SVG string
    dataUrl?: string;       // data:image/svg+xml;base64,...
    png?: Blob;            // Rasterized PNG
  };
}

export interface IconDiscoveryState {
  selectedDomain: string | null;     // Current domain filter
  searchQuery: string;               // Text search input
  searchResults: IconResult[];       // Filtered icons
  selectedCategory: string | null;   // Current category (SWORD, SHIELD, etc.)
  favorites: string[];              // Saved icon IDs
  history: {
    iconId: string;
    timestamp: string;
    domain: string;
  }[];
}

export interface IconResult {
  icon: {
    id: string;
    filename: string;
    artist: string;
  };
  category: string;
  matchType: "exact" | "fuzzy" | "domain_affinity";
  relevanceScore: number;  // 0.0 - 1.0
  dominantDomains: string[];
}
```

---

## 3. Core Modules

### 3.1 Icon Recolor Engine (`src/lib/icon/recolor-engine.ts`)
```typescript
export interface RecolorConfig {
  targetColor: string;           // Hex color (#RRGGBB)
  brightness?: number;          // 0.5 - 2.0
  saturation?: number;          // 0.5 - 2.0
  contrast?: number;            // 0.5 - 2.0
  opacity?: number;             // 0 - 1.0
}

export class IconRecolorEngine {
  /**
   * Load and recolor a single SVG asset
   * @param assetPath Absolute path to SVG file (/icons/000000/transparent/1x1/delapouite/sword.svg)
   * @param config Recolor configuration (target color, effects)
   * @returns SVG string with applied transformations
   */
  async loadAndRecolor(assetPath: string, config: RecolorConfig): Promise<string> {
    // 1. Read SVG file from asset library
    const svgContent = await readFile(assetPath, 'utf-8');
    
    // 2. Parse SVG
    const dom = new DOMParser().parseFromString(svgContent, 'text/xml');
    
    // 3. Replace black (#000000) with target color
    this.replaceColor(dom, '#000000', config.targetColor);
    
    // 4. Apply CSS filters for effects
    this.applyEffects(dom, config.brightness, config.saturation, config.contrast, config.opacity);
    
    // 5. Serialize back to string
    return new XMLSerializer().serializeToString(dom);
  }
  
  /**
   * Generate data URL from SVG string
   * Useful for <img src> and Canvas operations
   */
  svgToDataUrl(svgString: string): string {
    const encoded = encodeURIComponent(svgString);
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  }
  
  /**
   * Rasterize SVG to PNG blob at specified size
   * Used for export/download
   */
  async svgToPng(svgString: string, width: number = 256, height: number = 256): Promise<Blob> {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;
    
    // Create image from data URL
    const dataUrl = this.svgToDataUrl(svgString);
    const img = new Image();
    img.src = dataUrl;
    
    // Draw to canvas
    await img.decode();
    ctx.drawImage(img, 0, 0, width, height);
    
    // Return as blob
    return canvas.convertToBlob({ type: 'image/png' });
  }

  private replaceColor(dom: Document, from: string, to: string): void {
    // Replace fill attributes
    dom.querySelectorAll('[fill]').forEach(el => {
      if (el.getAttribute('fill')?.toLowerCase() === from) {
        el.setAttribute('fill', to);
      }
    });
    
    // Replace stroke attributes
    dom.querySelectorAll('[stroke]').forEach(el => {
      if (el.getAttribute('stroke')?.toLowerCase() === from) {
        el.setAttribute('stroke', to);
      }
    });
    
    // Replace in style attributes
    dom.querySelectorAll('[style]').forEach(el => {
      const style = el.getAttribute('style') || '';
      const updated = style.replace(new RegExp(from, 'gi'), to);
      el.setAttribute('style', updated);
    });
  }

  private applyEffects(dom: Document, brightness?: number, saturation?: number, contrast?: number, opacity?: number): void {
    // Build filter chain
    const svg = dom.documentElement;
    let filterString = '';
    
    if (brightness && brightness !== 1.0) {
      filterString += `brightness(${brightness})`;
    }
    if (saturation && saturation !== 1.0) {
      filterString += ` saturate(${saturation})`;
    }
    if (contrast && contrast !== 1.0) {
      filterString += ` contrast(${contrast})`;
    }
    
    // Apply as CSS filter
    if (filterString) {
      svg.style.filter = filterString.trim();
    }
    
    if (opacity !== undefined && opacity !== 1.0) {
      svg.style.opacity = String(opacity);
    }
  }
}

export const recolorEngine = new IconRecolorEngine();
```

### 3.2 Icon Discovery Service (`src/lib/icon/discovery-service.ts`)
```typescript
export class IconDiscoveryService {
  private keywords: any;
  private domains: any;
  
  constructor(keywordsPath: string, domainsPath: string) {
    // Load configuration on init
    this.keywords = require(keywordsPath);
    this.domains = require(domainsPath);
  }
  
  /**
   * Get category suggestions for a given domain
   * Returns top 6-8 categories sorted by affinity
   */
  getCategorySuggestionsForDomain(domain: string): Array<{category: string; label: string; affinity: number}> {
    const domainConfig = this.domains.domains[domain];
    if (!domainConfig) return [];
    
    return Object.entries(this.keywords.categories)
      .map(([categoryKey, categoryData]: any) => ({
        category: categoryKey,
        label: categoryData.label,
        affinity: domainConfig.categoryAffinities[categoryKey] || 0
      }))
      .filter(c => c.affinity > 0.3)
      .sort((a, b) => b.affinity - a.affinity)
      .slice(0, 8);
  }
  
  /**
   * Search icons by text query
   * Handles exact match, fuzzy match, and domain affinity
   */
  searchByKeyword(query: string, domain?: string): IconResult[] {
    const results: IconResult[] = [];
    const queryLower = query.toLowerCase();
    
    // Step 1: Check search index for direct category matches
    const matchedCategories = Object.entries(this.keywords.searchIndex)
      .filter(([keyword]) => keyword.includes(queryLower) || queryLower.includes(keyword))
      .flatMap(([_, cats]: any) => cats);
    
    // Step 2: Iterate through categories and icons
    for (const [categoryKey, categoryData] of Object.entries(this.keywords.categories)) {
      for (const icon of (categoryData as any).icons) {
        let matchType: "exact" | "fuzzy" | "domain_affinity" = "fuzzy";
        let relevanceScore = 0;
        
        // Exact keyword match
        if ((icon.keywords as string[]).some(kw => kw === queryLower)) {
          matchType = "exact";
          relevanceScore = 1.0;
        }
        // Fuzzy keyword match
        else if ((icon.keywords as string[]).some(kw => kw.includes(queryLower) || queryLower.includes(kw))) {
          matchType = "fuzzy";
          relevanceScore = 0.8;
        }
        // Domain affinity match
        else if (domain && icon.domains[domain] && icon.domains[domain] > 0.5) {
          matchType = "domain_affinity";
          relevanceScore = icon.domains[domain];
        }
        
        if (relevanceScore > 0.3) {
          results.push({
            icon: {
              id: icon.id,
              filename: icon.filename,
              artist: icon.artist
            },
            category: categoryKey,
            matchType,
            relevanceScore,
            dominantDomains: Object.entries(icon.domains)
              .filter(([_, score]: any) => (score as number) > 0.5)
              .map(([d]) => d)
          });
        }
      }
    }
    
    // Sort by relevance
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 48);
  }
  
  /**
   * Get icons for a specific category
   */
  getIconsByCategory(category: string, domain?: string): IconResult[] {
    const categoryData = this.keywords.categories[category];
    if (!categoryData) return [];
    
    return categoryData.icons.map((icon: any) => ({
      icon: {
        id: icon.id,
        filename: icon.filename,
        artist: icon.artist
      },
      category,
      matchType: "exact" as const,
      relevanceScore: domain ? (icon.domains[domain] || 0.5) : 0.5,
      dominantDomains: Object.entries(icon.domains)
        .filter(([_, score]: any) => (score as number) > 0.5)
        .map(([d]) => d)
    }));
  }
  
  /**
   * Apply fuzzy matching for typos
   * "swrod" → "sword"
   */
  private fuzzyMatch(input: string, target: string): number {
    // Levenshtein distance implementation
    const maxDistance = Math.max(input.length, target.length) * 0.3;
    const distance = this.levenshteinDistance(input, target);
    return distance <= maxDistance ? 1 - (distance / maxDistance) : 0;
  }
  
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = a[j - 1] === b[i - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
      }
    }
    return matrix[b.length][a.length];
  }
}

export const discoveryService = new IconDiscoveryService(
  'config/keywords.json',
  'config/domains.json'
);
```

### 3.3 Icon State Manager (`src/lib/icon/icon-store.ts`)
```typescript
import { writable, derived } from 'svelte/store';

/**
 * Create a persisted icon selection store
 * Syncs to localStorage for session recovery
 */
export function createIconStore() {
  const defaultState: IconSelection = {
    id: crypto.randomUUID(),
    asset: {
      id: '',
      filename: '',
      artist: '',
      path: ''
    },
    colors: {
      domain: 'divine',
      lightMode: true,
      primary: '#FFD700',
      opacity: 1.0
    },
    effects: {
      brightness: 1.0,
      saturation: 1.0,
      contrast: 1.0
    },
    metadata: {
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      history: []
    },
    exports: {}
  };
  
  // Load from localStorage if available
  const stored = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('icon-selection')
    : null;
  const initial = stored ? JSON.parse(stored) : defaultState;
  
  const { subscribe, set, update } = writable<IconSelection>(initial);
  
  return {
    subscribe,
    
    /**
     * Select a new icon asset
     */
    selectAsset(asset: IconSelection['asset']) {
      update(state => {
        const newState = {
          ...state,
          asset,
          metadata: {
            ...state.metadata,
            modifiedAt: new Date().toISOString(),
            history: [...state.metadata.history, {
              timestamp: new Date().toISOString(),
              action: 'edited' as const,
              before: state
            }]
          }
        };
        this.persist(newState);
        return newState;
      });
    },
    
    /**
     * Change domain (updates color palette)
     */
    setDomain(domain: string, colorConfig: any) {
      update(state => {
        const newState = {
          ...state,
          colors: {
            ...state.colors,
            domain,
            primary: colorConfig.primary,
            secondary: colorConfig.secondary
          },
          metadata: {
            ...state.metadata,
            modifiedAt: new Date().toISOString(),
            history: [...state.metadata.history, {
              timestamp: new Date().toISOString(),
              action: 'domain_changed' as const
            }]
          }
        };
        this.persist(newState);
        return newState;
      });
    },
    
    /**
     * Update visual effects
     */
    setEffects(effects: Partial<IconSelection['effects']>) {
      update(state => {
        const newState = {
          ...state,
          effects: { ...state.effects, ...effects },
          metadata: {
            ...state.metadata,
            modifiedAt: new Date().toISOString()
          }
        };
        this.persist(newState);
        return newState;
      });
    },
    
    /**
     * Cache rendered SVG/data URL
     */
    setCachedExport(format: 'svg' | 'dataUrl', content: string | Blob) {
      update(state => ({
        ...state,
        exports: { ...state.exports, [format]: content }
      }));
    },
    
    /**
     * Persist to localStorage
     */
    persist(state: IconSelection) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('icon-selection', JSON.stringify(state));
      }
    },
    
    /**
     * Reset to default
     */
    reset() {
      set(defaultState);
      this.persist(defaultState);
    }
  };
}

export const iconStore = createIconStore();

// Derived store: current SVG preview
export const iconPreview = derived(iconStore, async $icon => {
  if (!$icon.asset.id) return '';
  
  const path = `/icons/000000/transparent/1x1/${$icon.asset.artist}/${$icon.asset.filename}`;
  const svg = await recolorEngine.loadAndRecolor(path, {
    targetColor: $icon.colors.primary,
    brightness: $icon.effects.brightness,
    saturation: $icon.effects.saturation,
    opacity: $icon.colors.opacity
  });
  return svg;
});
```

---

## 4. UI Components

### 4.1 Icon Discovery Component (`src/components/IconDiscovery.svelte`)
```svelte
<script>
  import { discoveryService } from '$lib/icon/discovery-service';
  import { iconStore } from '$lib/icon/icon-store';
  import { domains } from '$lib/data/domains.json';
  
  let selectedDomain = 'divine';
  let searchQuery = '';
  let searchResults = [];
  let suggestedCategories = [];
  let selectedCategory = null;
  
  // When domain changes
  $: if (selectedDomain) {
    suggestedCategories = discoveryService.getCategorySuggestionsForDomain(selectedDomain);
  }
  
  // When search query changes
  $: if (searchQuery) {
    searchResults = discoveryService.searchByKeyword(searchQuery, selectedDomain);
  }
  
  function selectIcon(result) {
    const assetPath = `/icons/000000/transparent/1x1/${result.icon.artist}/${result.icon.filename}`;
    iconStore.selectAsset({
      id: result.icon.id,
      filename: result.icon.filename,
      artist: result.icon.artist,
      path: assetPath
    });
    
    // Update domain if first selection
    if (result.dominantDomains.includes(selectedDomain)) {
      const domainColors = domains[selectedDomain];
      iconStore.setDomain(selectedDomain, domainColors.colors.light);
    }
  }
  
  function selectCategory(category) {
    selectedCategory = selectedCategory === category ? null : category;
    if (selectedCategory) {
      searchResults = discoveryService.getIconsByCategory(selectedCategory, selectedDomain);
    }
  }
</script>

<div class="discovery-container">
  <!-- Domain buttons -->
  <div class="domain-selector">
    <h3>Choose Domain</h3>
    <div class="button-grid">
      {#each Object.keys(domains) as domain}
        <button
          class:active={selectedDomain === domain}
          on:click={() => selectedDomain = domain}
        >
          {domains[domain].label}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Category suggestions -->
  {#if suggestedCategories.length > 0}
    <div class="category-suggestions">
      <h3>Suggested Categories</h3>
      <div class="category-buttons">
        {#each suggestedCategories as cat}
          <button
            class:selected={selectedCategory === cat.category}
            on:click={() => selectCategory(cat.category)}
            title={`${cat.label} (affinity: ${(cat.affinity * 100).toFixed(0)}%)`}
          >
            {cat.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Search field -->
  <div class="search-section">
    <h3>Search Icons</h3>
    <input
      type="text"
      placeholder="sword, shield, fire, demon..."
      bind:value={searchQuery}
      class="search-field"
    />
  </div>
  
  <!-- Results grid -->
  {#if searchResults.length > 0}
    <div class="results-grid">
      {#each searchResults as result (result.icon.id)}
        <button
          class="icon-preview"
          on:click={() => selectIcon(result)}
          title={`${result.icon.filename} (${result.matchType} match)`}
        >
          <IconThumbnail asset={result.icon} domain={selectedDomain} />
          <span class="label">{result.icon.filename}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .discovery-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
  }
  
  .button-grid, .category-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
  }
  
  .domain-selector button, .category-buttons button {
    padding: 0.75rem;
    border: 2px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  .domain-selector button.active {
    border-color: #000;
    background: #f0f0f0;
    font-weight: bold;
  }
  
  .search-field {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    gap: 1rem;
  }
  
  .icon-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ddd;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
    transition: border-color 0.2s;
  }
  
  .icon-preview:hover {
    border-color: #000;
  }
  
  .label {
    font-size: 0.75rem;
    text-align: center;
    word-break: break-word;
  }
</style>
```

### 4.2 Icon Preview Component (`src/components/IconPreview.svelte`)
```svelte
<script>
  import { iconStore, iconPreview } from '$lib/icon/icon-store';
  import { recolorEngine } from '$lib/icon/recolor-engine';
  
  let svgContent = '';
  let colorMode = 'light';
  
  // Subscribe to preview updates
  iconPreview.subscribe(svg => {
    svgContent = svg;
  });
</script>

<div class="preview-container">
  <!-- SVG display -->
  {#if svgContent}
    <div class="svg-canvas">
      {@html svgContent}
    </div>
  {:else}
    <div class="placeholder">Select an icon</div>
  {/if}
  
  <!-- Color controls -->
  <div class="color-controls">
    <label>
      Light/Dark Mode
      <select bind:value={colorMode}>
        <option value="light">Light Mode</option>
        <option value="dark">Dark Mode</option>
      </select>
    </label>
    
    <label>
      Primary Color
      <input type="color" value={$iconStore.colors.primary} />
    </label>
    
    <label>
      Opacity
      <input type="range" min="0" max="1" step="0.1" value={$iconStore.colors.opacity} />
    </label>
  </div>
  
  <!-- Effect sliders -->
  <div class="effect-sliders">
    <label>
      Brightness: {$iconStore.effects.brightness.toFixed(1)}x
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={$iconStore.effects.brightness}
        on:change={e => iconStore.setEffects({brightness: parseFloat(e.target.value)})}
      />
    </label>
    
    <label>
      Saturation: {$iconStore.effects.saturation.toFixed(1)}x
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={$iconStore.effects.saturation}
        on:change={e => iconStore.setEffects({saturation: parseFloat(e.target.value)})}
      />
    </label>
    
    <label>
      Contrast: {$iconStore.effects.contrast.toFixed(1)}x
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={$iconStore.effects.contrast}
        on:change={e => iconStore.setEffects({contrast: parseFloat(e.target.value)})}
      />
    </label>
  </div>
  
  <!-- Export buttons -->
  <div class="export-actions">
    <button on:click={downloadSvg}>Download SVG</button>
    <button on:click={downloadPng}>Download PNG</button>
    <button on:click={copyDataUrl}>Copy Data URL</button>
  </div>
</div>

<script>
  async function downloadSvg() {
    const svg = $iconPreview;
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${$iconStore.asset.filename}.svg`;
    a.click();
  }
  
  async function downloadPng() {
    const svg = $iconPreview;
    const png = await recolorEngine.svgToPng(svg, 256, 256);
    const url = URL.createObjectURL(png);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${$iconStore.asset.filename}.png`;
    a.click();
  }
  
  function copyDataUrl() {
    const dataUrl = recolorEngine.svgToDataUrl($iconPreview);
    navigator.clipboard.writeText(dataUrl);
  }
</script>

<style>
  .preview-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .svg-canvas {
    width: 100%;
    height: 256px;
    background: #f9f9f9;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }
  
  .placeholder {
    width: 100%;
    height: 256px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-style: italic;
  }
  
  .color-controls, .effect-sliders {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }
  
  input[type="color"] {
    width: 50px;
    height: 40px;
    cursor: pointer;
  }
  
  input[type="range"] {
    flex: 1;
  }
  
  .export-actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
  }
  
  button {
    padding: 0.75rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  button:hover {
    background: #0056b3;
  }
</style>
```

---

## 5. Integration Points

### 5.1 Faction Generator Integration (`src/lib/faction/generator.ts`)
```typescript
import { iconStore } from '$lib/icon/icon-store';
import { recolorEngine } from '$lib/icon/recolor-engine';
import type { IconSelection } from '$lib/faction/icon-state';

export interface FactionWithIcon {
  id: string;
  name: string;
  domain: string;
  symbol: IconSelection;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  metadata: {
    createdAt: string;
    modifiedAt: string;
  };
}

export class FactionGenerator {
  /**
   * Create a faction with custom icon selection
   */
  async createFaction(
    name: string,
    domain: string,
    iconId: string,
    iconArtist: string
  ): Promise<FactionWithIcon> {
    // Get current icon state
    const currentIcon = get(iconStore);
    
    // Retrieve color palette for domain
    const domainColors = await this.getDomainColors(domain);
    
    // Build faction object
    const faction: FactionWithIcon = {
      id: crypto.randomUUID(),
      name,
      domain,
      symbol: {
        ...currentIcon,
        asset: {
          id: iconId,
          filename: `${iconId.split('/')[1]}.svg`,
          artist: iconArtist,
          path: `/icons/000000/transparent/1x1/${iconArtist}/`
        },
        colors: {
          domain,
          lightMode: true,
          primary: domainColors.primary,
          secondary: domainColors.secondary
        }
      },
      colorScheme: domainColors,
      metadata: {
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      }
    };
    
    return faction;
  }
  
  /**
   * Render faction symbol and cache exports
   */
  async renderFactionSymbol(faction: FactionWithIcon): Promise<{
    svg: string;
    png: Blob;
    dataUrl: string;
  }> {
    const assetPath = `${faction.symbol.asset.path}${faction.symbol.asset.filename}`;
    
    const svg = await recolorEngine.loadAndRecolor(assetPath, {
      targetColor: faction.symbol.colors.primary,
      brightness: faction.symbol.effects.brightness,
      saturation: faction.symbol.effects.saturation,
      opacity: faction.symbol.colors.opacity
    });
    
    const png = await recolorEngine.svgToPng(svg, 256, 256);
    const dataUrl = recolorEngine.svgToDataUrl(svg);
    
    return { svg, png, dataUrl };
  }
  
  private async getDomainColors(domain: string) {
    // Import domain config
    const domainsConfig = await import('$lib/data/domains.json');
    return domainsConfig.domains[domain].colors.light;
  }
}

export const factionGenerator = new FactionGenerator();
```

### 5.2 Page Integration (`src/routes/faction/[id]/symbol/+page.svelte`)
```svelte
<script>
  import IconDiscovery from '$components/IconDiscovery.svelte';
  import IconPreview from '$components/IconPreview.svelte';
  import { factionGenerator } from '$lib/faction/generator';
  
  export let data;
  
  let isCreating = false;
  let newFactionName = '';
  
  async function saveFaction() {
    isCreating = true;
    try {
      const faction = await factionGenerator.createFaction(
        newFactionName,
        data.faction.domain,
        data.icon.asset.id,
        data.icon.asset.artist
      );
      
      // Save to database
      await fetch('/api/factions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faction)
      });
      
      // Redirect to faction page
      goto(`/faction/${faction.id}`);
    } finally {
      isCreating = false;
    }
  }
</script>

<div class="symbol-editor">
  <div class="left-panel">
    <IconDiscovery />
  </div>
  
  <div class="right-panel">
    <IconPreview />
    
    <div class="save-section">
      <input
        type="text"
        placeholder="Faction name..."
        bind:value={newFactionName}
      />
      <button on:click={saveFaction} disabled={!newFactionName || isCreating}>
        {isCreating ? 'Saving...' : 'Create Faction'}
      </button>
    </div>
  </div>
</div>

<style>
  .symbol-editor {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
    height: 100vh;
  }
  
  .left-panel, .right-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }
  
  .save-section {
    display: flex;
    gap: 0.5rem;
  }
  
  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>
```

---

## 6. File Structure
```
src/
├── lib/
│   ├── icon/
│   │   ├── recolor-engine.ts          # SVG recolor logic
│   │   ├── discovery-service.ts       # Search & category logic
│   │   └── icon-store.ts              # Svelte store for selections
│   ├── faction/
│   │   ├── generator.ts               # Create factions with icons
│   │   └── icon-state.ts              # TypeScript types
│   ├── data/
│   │   ├── domains.json               # Domain color palettes
│   │   └── keywords.json              # Icon search index
│   └── utils/
│       └── svg-utils.ts               # SVG parsing helpers
├── components/
│   ├── IconDiscovery.svelte           # Search + domain UI
│   ├── IconPreview.svelte             # Preview + effects editor
│   └── IconThumbnail.svelte           # Small icon renderer
├── routes/
│   └── faction/
│       └── [id]/
│           └── symbol/
│               └── +page.svelte       # Symbol editor page
└── tests/
    ├── recolor-engine.test.ts         # Recolor logic tests
    ├── discovery-service.test.ts      # Search algorithm tests
    └── icon-store.test.ts             # Store persistence tests

config/
├── domains.json                        # Domain definitions (12 domains)
└── keywords.json                       # Icon taxonomy (10K+ icons)

icons/
└── 000000/transparent/1x1/            # Game-icons.net asset library
    ├── delapouite/
    │   ├── ancient-sword.svg
    │   ├── broken-axe.svg
    │   └── ... (5000+)
    ├── lorc/
    ├── felbrigg/
    └── ... (35+ artists)
```

---

## 7. API Endpoints

### 7.1 Faction Management
```
POST   /api/factions                 # Create faction with icon
GET    /api/factions/:id             # Retrieve faction symbol
PUT    /api/factions/:id/symbol      # Update symbol selection
DELETE /api/factions/:id/symbol      # Clear symbol
```

### 7.2 Icon Discovery
```
GET    /api/icons/search?q=sword     # Search icons by keyword
GET    /api/icons/category/:cat      # Get icons in category
GET    /api/icons/domain/:domain     # Get domain suggestions
GET    /api/icons/:id/preview        # Get recolored SVG

Response:
{
  "results": [
    {
      "id": "delapouite/ancient-sword",
      "filename": "ancient-sword.svg",
      "artist": "delapouite",
      "category": "SWORD",
      "matchType": "exact",
      "relevanceScore": 1.0,
      "dominantDomains": ["order", "chaos"]
    }
  ]
}
```

### 7.3 Recolor Service
```
POST   /api/icons/:id/recolor
Content-Type: application/json

Request:
{
  "targetColor": "#FF4500",
  "brightness": 1.2,
  "saturation": 0.9,
  "opacity": 0.95,
  "format": "svg|png|dataurl"
}

Response:
{
  "svg": "<svg>...</svg>",
  "dataUrl": "data:image/svg+xml;...",
  "png": "blob:http://...",
  "timestamp": "2026-03-10T15:30:00Z"
}
```

---

## 8. Performance Considerations

### 8.1 SVG Caching
- Cache recolored SVGs in memory (LRU cache, max 100 entries)
- Persist exports to IndexedDB for offline access
- Hash SVG content + config → cache key

### 8.2 Search Optimization
- Pre-build search index as JSON at build time
- Use Lunr.js for fuzzy matching (optional)
- Lazy-load icon metadata (only visible thumbnails)

### 8.3 Asset Transport
- Serve SVGs with `cache-control: max-age=31536000` (1 year)
- GZIP compression for JSON configs
- Implement HTTP range requests for large icon packs

---

## 9. Testing Strategy

### 9.1 Unit Tests
```typescript
// tests/recolor-engine.test.ts
test('replaces black color with target', async () => {
  const svg = '<svg fill="#000000">...</svg>';
  const recolored = await recolorEngine.loadAndRecolor('test.svg', {
    targetColor: '#FF0000'
  });
  expect(recolored).toContain('fill="#FF0000"');
});

test('applies brightness filter', async () => {
  const recolored = await recolorEngine.loadAndRecolor('test.svg', {
    targetColor: '#000000',
    brightness: 1.5
  });
  expect(recolored).toContain('filter=');
});

// tests/discovery-service.test.ts
test('searches icons by keyword', () => {
  const results = discoveryService.searchByKeyword('sword');
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].matchType).toBe('exact');
});

test('handles fuzzy matching', () => {
  const results = discoveryService.searchByKeyword('swrod');
  expect(results.some(r => r.icon.id.includes('sword'))).toBe(true);
});

test('ranks domain affinity', () => {
  const arcaneResults = discoveryService.searchByKeyword('spell', 'arcane');
  const orderResults = discoveryService.searchByKeyword('spell', 'order');
  expect(arcaneResults[0].relevanceScore)
    .toBeGreaterThan(orderResults[0].relevanceScore);
});
```

### 9.2 Integration Tests
```typescript
// tests/icon-store.test.ts
test('persists to localStorage', () => {
  const store = createIconStore();
  store.selectAsset({id: 'test', filename: 'test.svg', artist: 'test', path: '/'});
  
  expect(localStorage.getItem('icon-selection')).toBeDefined();
  const persisted = JSON.parse(localStorage.getItem('icon-selection')!);
  expect(persisted.asset.id).toBe('test');
});

// tests/faction-integration.test.ts
test('creates faction with recolored symbol', async () => {
  const faction = await factionGenerator.createFaction(
    'Shadow Guild',
    'shadow',
    'delapouite/dagger',
    'delapouite'
  );
  
  expect(faction.symbol.colors.domain).toBe('shadow');
  expect(faction.symbol.colors.primary).toBe('#2F2F2F');
});
```

### 9.3 E2E Tests
```typescript
// tests/e2e/symbol-editor.spec.ts
test('complete symbol creation workflow', async ({ page }) => {
  await page.goto('/faction/new/symbol');
  
  // 1. Select domain
  await page.click('button:has-text("Divine")');
  
  // 2. Search icon
  await page.fill('input[placeholder*="sword"]', 'sword');
  await page.click('button:has-text("ancient-sword.svg")');
  
  // 3. Adjust effects
  await page.click('input[type="range"]'); // brightness slider
  
  // 4. Save faction
  await page.fill('input[placeholder*="Faction name"]', 'Holy Knights');
  await page.click('button:has-text("Create Faction")');
  
  // Verify redirect
  await expect(page).toHaveURL(/\/faction\/[\w-]+/);
});
```

---

## 10. Accessibility & Localization

### 10.1 Accessibility (a11y)
- All buttons/inputs have `aria-label` attributes
- Icon preview has text alternative (filename + domain)
- Color adjustments respect `prefers-reduced-motion`
- Search results support keyboard navigation (arrow keys)

### 10.2 Dark Mode Support
- Domain color palettes include light/dark variants
- CSS variables for dynamic theme switching
- SVG filters adapt to system preference via `prefers-color-scheme`

### 10.3 Internationalization (i18n)
```json
// locales/en.json
{
  "discovery.selectDomain": "Choose Domain",
  "discovery.suggestedCategories": "Suggested Categories",
  "preview.lightMode": "Light Mode",
  "preview.brightness": "Brightness",
  "export.downloadSvg": "Download SVG"
}
```

---

## 11. Deployment & Configuration

### 11.1 Environment Variables
```bash
# .env.production
VITE_ICON_LIBRARY_PATH=/icons/000000/transparent/1x1/
VITE_ICON_CACHE_SIZE=100
VITE_ENABLE_OFFLINE_MODE=true
VITE_FUZZY_MATCH_THRESHOLD=0.7
```

### 11.2 Build Optimization
```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'icon-engine': ['src/lib/icon/recolor-engine.ts'],
          'discovery': ['src/lib/icon/discovery-service.ts']
        }
      }
    }
  }
};
```

### 11.3 Asset Licensing Attribution
Generate `ICON_CREDITS.md` automatically from `keywords.json`:
```markdown
# Icon Assets Attribution

This project includes icons from [game-icons.net](https://game-icons.net)
Licensed under [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/)

## Artist Credits
- **delapouite** (5000+ icons) - [Profile](https://game-icons.net/delapouite.html)
- **lorc** (1200+ icons) - [Profile](https://game-icons.net/lorc.html)
...
```

---

## 12. Implementation Roadmap

### Phase 1: Core Engine (Week 1)
- [ ] Implement `IconRecolorEngine` class
- [ ] Build `IconDiscoveryService` with keyword matching
- [ ] Create domain/keywords JSON configs
- [ ] Unit tests for both services

### Phase 2: UI Components (Week 2)
- [ ] Build `IconDiscovery.svelte` component
- [ ] Build `IconPreview.svelte` with controls
- [ ] Implement `icon-store.ts` (Svelte store)
- [ ] E2E test symbol selection workflow

### Phase 3: Integration (Week 3)
- [ ] Connect to faction generator
- [ ] Create `/faction/[id]/symbol/` page
- [ ] Build API endpoints (search, recolor, save)
- [ ] Integration tests for faction creation

### Phase 4: Polish & Optimization (Week 4)
- [ ] Performance profiling & caching
- [ ] Accessibility audit
- [ ] Dark mode testing
- [ ] Attribution & licensing
- [ ] Production deployment

---

## 13. Known Limitations & Future Enhancements

### Current Limitations
1. **Single Color Replacement**: Only replaces black (#000000); multi-color icons not supported
2. **No Multi-Icon Combinations**: Can't layer multiple icons
3. **Limited Export Formats**: Only SVG, PNG, data URL (no GIF/WebP yet)
4. **Manual Keyword Tagging**: Icon categorization requires manual review

### Future Enhancements
1. **AI-Assisted Tagging**: Use image recognition to auto-tag icons
2. **Icon Composition**: Layer multiple icons with blending modes
3. **Animation Support**: Add sprite animation for faction symbols
4. **Version Control**: Track symbol design changes over time
5. **Community Contributions**: User-submitted custom SVG icons
6. **Real-time Collaboration**: Live symbol editing with teammates

---

## 14. Summary

This spec provides a complete, production-ready implementation path for integrating the game-icons.net library into the faction symbol generator. The architecture separates concerns cleanly:

- **Recolor Engine**: Pure SVG transformation logic
- **Discovery Service**: Search indexing and ranking
- **Icon Store**: State management and persistence
- **UI Components**: Svelte components for discovery and preview
- **Integration**: Faction generator and API endpoints

All components are designed for testability, performance, and accessibility. The keyword dictionary and domain palettes provide the semantic layer that makes a 10K icon library feel like a curated, domain-driven system.
