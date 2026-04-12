# Icon Implementation Specification (RECALIBRATED)
**Status:** PRODUCTION-READY FOR PHASED ROLLOUT  
**Last Updated:** 2026-03-10  
**Timeline Reality:** 8 weeks minimum (from Spike Phase start)

---

## 0. SPIKE PHASE (Week 1) — BLOCKING & MANDATORY

**Purpose:** Validate critical technical assumptions before committing to full implementation.

### 0.1 Spike 1: SVG Recolor Validation
```
Goal: Determine if simple black→color replacement works acceptably
Time: 3 hours
Steps:
1. Download 50 random Delapouite SVGs (high quality baseline)
2. Implement basic recolor: replace fill="#000000" with target color
3. Render in 3 different colors (purple, gold, red) by hand
4. Score output quality: 1-5 (1=gibberish, 5=perfect)
Acceptance: ≥80% of icons score 4-5

Deliverable: spike-recolor-report.md with before/after screenshots
Risk: If <80% quality, need stroke-width compensation + opacity handling
```

### 0.2 Spike 2: Keyword Dictionary Feasibility
```
Goal: Understand effort to tag 10K icons
Time: 4 hours
Steps:
1. Manually tag 100 random Delapouite SVGs with categories + keywords
2. Identify which tags are obvious (filename-based) vs subjective
3. Estimate accuracy of regex-based auto-tagging (match keyword in filename)
4. Calculate manual review overhead
Acceptance: Can tag 100 icons in ≤4 hours (36 seconds per icon = realistic)

Deliverable: spike-keywords-report.md with tagging rules
Risk: If <2 minutes per icon, fully manual approach; if >4 minutes, need better automation
```

### 0.3 Spike 3: Search Algorithm Feel Test
```
Goal: Does keyword search feel good?
Time: 2 hours
Steps:
1. Build mock keywords.json with 200 tagged icons only
2. Implement discovery-service.searchByKeyword()
3. Run 30 test queries: "sword", "fire", "shield", "demon", "holy", "dagger", etc.
4. Score results: relevant? comprehensive? too verbose?
Acceptance: >80% of queries return relevant results in top 10

Deliverable: spike-search-report.md with test queries
Risk: If fuzzy matching fails often, replace Levenshtein with Fuse.js earlier
```

**Spike Exit Criteria:**
- ✓ All 3 reports complete AND
- ✓ No blocking technical issues discovered AND
- ✓ Revised Phase 1-4 timeline created

**If spike fails:** Timeline extends 2-4 weeks; escalate architectural decisions.

---

## 1. Phase 0: Keyword Dictionary (Weeks 2-3) — BLOCKING FOR PHASE 1

**Goal:** Build keywords.json to 90% completeness. Discovery system cannot function without it.

### 1.1 Auto-Tagging Pass (Day 1-2)
```typescript
// Script: scripts/auto-tag-icons.ts
const autoTag = (filename: string): string[] => {
  const keywords: string[] = [];
  
  // Extract semantic words from filename
  // Examples: 
  //   "ancient-sword.svg" → ["sword", "ancient"]
  //   "fire-demon.svg" → ["demon", "fire"]
  //   "holy-shield.svg" → ["shield", "holy"]
  
  return filename
    .replace(/\.svg$/, '')
    .split('-')
    .filter(word => word.length > 2)
    .map(word => word.toLowerCase());
};

// Run on all 10K icons, output to draft-keywords.json
```

**Output:** draft-keywords.json with ~80% coverage, ~20% needing manual review

### 1.2 Manual Review & Validation (Day 3-5)
```
Process:
1. Find all icons with <2 keywords (likely auto-tagging failed)
2. Manually review each icon image + filename
3. Add missing keywords (3-5 per icon target)
4. Flag problematic icons (gradients, complex strokes)
5. Build domain affinity scores per icon

Team approach:
- Assign 10-person team, 1000 icons each (if available)
- Or solo: 2000 icons/week at 3 min per icon = realistic rate
```

**Output:** Complete keywords.json with structure:
```json
{
  "categories": {
    "SWORD": {
      "label": "Swords & Blades",
      "icons": [
        {
          "id": "delapouite/ancient-sword",
          "keywords": ["sword", "ancient", "rusty", "worn"],
          "domains": {
            "order": 0.9,
            "divine": 0.6,
            "chaos": 0.5,
            "shadow": 0.3,
            "nature": 0.2,
            "arcane": 0.1
          },
          "quality": {
            "recolorQuality": 5,        // 1-5: how well it recolors
            "strokeWidth": "normal",    // thin|normal|thick
            "hasGradients": false,
            "hasOpacity": false,
            "skipInDomains": []         // domains to exclude this icon
          }
        }
      ]
    }
  }
}
```

### 1.3 Affinity Tuning (Day 6-7)
```
For each category, manually adjust domain affinities:
- SWORD category: high in order/divine, medium in chaos
- STAFF category: high in arcane/divine, low in shadow
- CREATURE category: varies wildly (demon=chaos, angel=divine, dragon=all)

Build exclusion rules:
- Shadow domain NEVER applies to: angel, holy, light symbols
- Chaos domain NEVER applies to: peaceful creatures, sacred items
- Order domain NEVER applies to: chaotic creatures, dark items
```

**Deliverable:** Final keywords.json ready for Phase 1

**Effort:** 1-2 weeks solo; 2-3 days with team of 5

---

## 2. Phase 1: Core Engine (Week 4-5)

### 2.1 Icon Recolor Engine (`src/lib/icon/recolor-engine.ts`)

**Scope:** Simple recolor + quality detection (no stroke compensation yet)

```typescript
export interface RecolorConfig {
  targetColor: string;        // Hex color (#RRGGBB)
  brightness?: number;       // 0.5 - 2.0 (default: 1.0)
  saturation?: number;       // 0.5 - 2.0 (default: 1.0)
  opacity?: number;          // 0 - 1.0 (default: 1.0)
}

export interface RecolorResult {
  success: boolean;
  svg: string;                // Recolored SVG
  warnings: string[];         // ["gradient_detected", "opacity_layer", ...]
  quality: number;            // Estimated quality 1-5 (based on warnings)
}

export class IconRecolorEngine {
  /**
   * Load and recolor a single SVG asset
   * Detects quality issues but doesn't fail
   */
  async loadAndRecolor(
    assetPath: string,
    config: RecolorConfig
  ): Promise<RecolorResult> {
    try {
      const svgContent = await readFile(assetPath, 'utf-8');
      const dom = new DOMParser().parseFromString(svgContent, 'text/xml');
      
      // Check for quality issues BEFORE modifying
      const warnings = this.detectQualityIssues(dom);
      
      // Replace colors
      this.replaceColor(dom, '#000000', config.targetColor);
      this.replaceColor(dom, '#FFFFFF', config.targetColor);  // Some SVGs use white!
      
      // Apply effects
      if (config.brightness || config.saturation || config.opacity) {
        this.applyEffects(dom, config);
      }
      
      const svg = new XMLSerializer().serializeToString(dom);
      
      // Estimate quality based on warnings
      const quality = this.estimateQuality(warnings);
      
      return {
        success: true,
        svg,
        warnings,
        quality
      };
    } catch (error) {
      return {
        success: false,
        svg: '',
        warnings: [`parse_error: ${error.message}`],
        quality: 0
      };
    }
  }

  private detectQualityIssues(dom: Document): string[] {
    const warnings: string[] = [];
    const svg = dom.documentElement;
    
    // Check for gradients (can't be recolored well)
    if (dom.querySelector('linearGradient, radialGradient')) {
      warnings.push('gradient_detected');
    }
    
    // Check for patterns (same issue)
    if (dom.querySelector('pattern')) {
      warnings.push('pattern_detected');
    }
    
    // Check for opacity layers (lose detail when recolored)
    const elementsWithOpacity = Array.from(dom.querySelectorAll('[opacity]')).filter(
      el => parseFloat((el as any).getAttribute('opacity') ?? '1') < 1
    );
    if (elementsWithOpacity.length > 2) {
      warnings.push('heavy_opacity_layering');
    }
    
    // Check SVG complexity (>1000 elements = might be slow)
    if (dom.querySelectorAll('*').length > 1000) {
      warnings.push('high_complexity');
    }
    
    return warnings;
  }

  private estimateQuality(warnings: string[]): number {
    let quality = 5; // Start perfect
    
    for (const warning of warnings) {
      if (warning === 'gradient_detected') quality -= 2;    // Major issue
      if (warning === 'pattern_detected') quality -= 2;
      if (warning === 'heavy_opacity_layering') quality -= 1;
      if (warning === 'high_complexity') quality -= 0.5;
    }
    
    return Math.max(1, quality);
  }

  private replaceColor(dom: Document, from: string, to: string): void {
    const fromLower = from.toLowerCase();
    const toRgb = this.hexToRgb(to);
    
    // Replace fill attributes
    dom.querySelectorAll('[fill]').forEach(el => {
      const fill = (el.getAttribute('fill') ?? '').toLowerCase();
      if (fill === fromLower || fill.includes('none') === false) {
        // Only replace pure colors matching from, skip none/transparent
        if (fill === fromLower) {
          el.setAttribute('fill', to);
        }
      }
    });
    
    // Replace stroke attributes
    dom.querySelectorAll('[stroke]').forEach(el => {
      const stroke = (el.getAttribute('stroke') ?? '').toLowerCase();
      if (stroke === fromLower) {
        el.setAttribute('stroke', to);
      }
    });
    
    // Replace in style attributes
    dom.querySelectorAll('[style]').forEach(el => {
      let style = el.getAttribute('style') ?? '';
      style = style.replace(new RegExp(`fill\\s*:\\s*${from}`, 'gi'), `fill: ${to}`);
      style = style.replace(new RegExp(`stroke\\s*:\\s*${from}`, 'gi'), `stroke: ${to}`);
      el.setAttribute('style', style);
    });
  }

  private applyEffects(dom: Document, config: RecolorConfig): void {
    const svg = dom.documentElement;
    let filterString = '';
    
    if (config.brightness && config.brightness !== 1.0) {
      filterString += `brightness(${config.brightness}) `;
    }
    if (config.saturation && config.saturation !== 1.0) {
      filterString += `saturate(${config.saturation}) `;
    }
    
    if (filterString.trim()) {
      svg.style.filter = filterString.trim();
    }
    
    if (config.opacity !== undefined && config.opacity !== 1.0) {
      svg.style.opacity = String(config.opacity);
    }
  }

  svgToDataUrl(svgString: string): string {
    const encoded = encodeURIComponent(svgString);
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  }

  async svgToPng(svgString: string, width = 256, height = 256): Promise<Blob> {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;
    
    const dataUrl = this.svgToDataUrl(svgString);
    const img = new Image();
    img.src = dataUrl;
    
    await img.decode();
    ctx.drawImage(img, 0, 0, width, height);
    
    return canvas.convertToBlob({ type: 'image/png' });
  }

  private hexToRgb(hex: string): {r: number; g: number; b: number} {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}
```

### 2.2 Icon Discovery Service (`src/lib/icon/discovery-service.ts`)

**Scope:** Keyword search only (fuzzy matching deferred to Phase 3)

```typescript
export class IconDiscoveryService {
  private keywords: any;
  private domains: any;
  
  constructor(keywordsPath: string, domainsPath: string) {
    this.keywords = require(keywordsPath);
    this.domains = require(domainsPath);
  }
  
  /**
   * Get top 8 category suggestions for a domain
   */
  getCategorySuggestionsForDomain(domain: string): Array<{
    category: string;
    label: string;
    affinity: number;
  }> {
    const domainConfig = this.domains.domains[domain];
    if (!domainConfig) return [];
    
    return Object.entries(this.keywords.categories)
      .map(([categoryKey, categoryData]: any) => ({
        category: categoryKey,
        label: categoryData.label,
        affinity: domainConfig.categoryAffinities[categoryKey] ?? 0
      }))
      .filter(c => c.affinity > 0.3)
      .sort((a, b) => b.affinity - a.affinity)
      .slice(0, 8);
  }
  
  /**
   * Search icons by simple keyword matching
   */
  searchByKeyword(query: string, domain?: string): IconResult[] {
    const queryLower = query.toLowerCase().trim();
    const results: Map<string, IconResult> = new Map();
    
    // Iterate through all categories
    for (const [categoryKey, categoryData] of Object.entries(this.keywords.categories)) {
      const cat = categoryData as any;
      
      for (const icon of cat.icons) {
        let relevanceScore = 0;
        
        // Rule 1: Exact keyword match
        if ((icon.keywords as string[]).includes(queryLower)) {
          relevanceScore = 1.0;
        }
        // Rule 2: Keyword contains query
        else if ((icon.keywords as string[]).some(kw => kw.includes(queryLower))) {
          relevanceScore = 0.9;
        }
        // Rule 3: Query contains keyword (broader match)
        else if ((icon.keywords as string[]).some(kw => queryLower.includes(kw))) {
          relevanceScore = 0.7;
        }
        // Rule 4: Category name matches
        else if (categoryKey.toLowerCase().includes(queryLower)) {
          relevanceScore = 0.6;
        }
        
        // Domain affinity boost
        if (domain && icon.domains[domain]) {
          relevanceScore *= (0.5 + 0.5 * icon.domains[domain]); // Up to 50% boost
        }
        
        if (relevanceScore > 0.3) {
          const key = icon.id;
          if (!results.has(key) || results.get(key)!.relevanceScore < relevanceScore) {
            results.set(key, {
              icon: {
                id: icon.id,
                filename: icon.filename,
                artist: icon.artist
              },
              category: categoryKey,
              relevanceScore,
              dominantDomains: Object.entries(icon.domains as Record<string, number>)
                .filter(([_, score]) => score > 0.5)
                .map(([d]) => d)
            });
          }
        }
      }
    }
    
    // Sort by relevance and return top 48
    return Array.from(results.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 48);
  }
  
  /**
   * Get icons for a specific category
   */
  getIconsByCategory(category: string, domain?: string): IconResult[] {
    const categoryData = this.keywords.categories[category];
    if (!categoryData) return [];
    
    return (categoryData as any).icons.map((icon: any) => ({
      icon: {
        id: icon.id,
        filename: icon.filename,
        artist: icon.artist
      },
      category,
      relevanceScore: domain ? (icon.domains[domain] ?? 0.5) : 0.5,
      dominantDomains: Object.entries(icon.domains as Record<string, number>)
        .filter(([_, score]) => score > 0.5)
        .map(([d]) => d)
    }));
  }
}
```

### 2.3 Unit Tests

```typescript
// tests/recolor-engine.test.ts
test('replaces black with target color', async () => {
  const result = await engine.loadAndRecolor('test.svg', {
    targetColor: '#FF0000'
  });
  expect(result.success).toBe(true);
  expect(result.svg).toContain('FF0000');
});

test('detects gradients as quality warning', async () => {
  const result = await engine.loadAndRecolor('gradient-icon.svg', {
    targetColor: '#FF0000'
  });
  expect(result.warnings).toContain('gradient_detected');
  expect(result.quality).toBeLessThan(4);
});

// tests/discovery-service.test.ts
test('finds icons by exact keyword', () => {
  const results = service.searchByKeyword('sword');
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].relevanceScore).toBe(1.0);
});

test('ranks domain affinity', () => {
  const arcane = service.searchByKeyword('staff', 'arcane');
  const shadow = service.searchByKeyword('staff', 'shadow');
  expect(arcane[0].relevanceScore).toBeGreaterThan(shadow[0].relevanceScore);
});
```

**Deliverable:** Recolor engine + discovery service, tested, ready for UI

---

## 3. Phase 2: UI Components (Week 6)

### 3.1 IconDiscovery Component (`src/components/IconDiscovery.svelte`)

```svelte
<script>
  import { discoveryService } from '$lib/icon/discovery-service';
  
  let selectedDomain = 'divine';
  let searchQuery = '';
  let searchResults = [];
  let suggestedCategories = [];
  
  $: if (selectedDomain) {
    suggestedCategories = discoveryService.getCategorySuggestionsForDomain(selectedDomain);
  }
  
  $: if (searchQuery) {
    searchResults = discoveryService.searchByKeyword(searchQuery, selectedDomain);
  }
  
  function selectIcon(result) {
    dispatch('select', {
      assetId: result.icon.id,
      artist: result.icon.artist,
      filename: result.icon.filename
    });
  }
</script>

<div class="discovery">
  <!-- Domain selector -->
  <div class="domain-buttons">
    {#each ['arcane', 'divine', 'nature', 'shadow', 'chaos', 'order'] as domain}
      <button
        class:active={selectedDomain === domain}
        on:click={() => selectedDomain = domain}
      >
        {domain.charAt(0).toUpperCase() + domain.slice(1)}
      </button>
    {/each}
  </div>
  
  <!-- Category suggestions -->
  <div class="categories">
    {#each suggestedCategories as cat}
      <button
        on:click={() => searchQuery = cat.category.toLowerCase()}
        title={cat.label}
      >
        {cat.label}
      </button>
    {/each}
  </div>
  
  <!-- Search -->
  <input
    type="text"
    placeholder="sword, shield, fire..."
    bind:value={searchQuery}
    class="search"
  />
  
  <!-- Results grid -->
  <div class="results">
    {#each searchResults as result (result.icon.id)}
      <button
        class="icon-result"
        on:click={() => selectIcon(result)}
        title={result.icon.filename}
      >
        <IconThumbnail 
          assetId={result.icon.id} 
          domain={selectedDomain}
        />
      </button>
    {/each}
  </div>
</div>

<style>
  .discovery { display: flex; flex-direction: column; gap: 1rem; }
  .domain-buttons, .categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; }
  .search { padding: 0.75rem; font-size: 1rem; }
  .results { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 1rem; }
  .icon-result { padding: 0.5rem; border: 1px solid #ddd; cursor: pointer; }
</style>
```

### 3.2 IconPreview Component (`src/components/IconPreview.svelte`)

```svelte
<script>
  import { iconStore } from '$lib/icon/icon-store';
  
  let svgContent = '';
  
  iconStore.subscribe(state => {
    if (state.svgContent) svgContent = state.svgContent;
  });
</script>

<div class="preview">
  <!-- SVG display -->
  <div class="canvas">
    {#if svgContent}
      {@html svgContent}
    {:else}
      <p>Select an icon</p>
    {/if}
  </div>
  
  <!-- Simple controls -->
  <label>
    Brightness
    <input type="range" min="0.5" max="2" step="0.1" value={$iconStore.brightness} />
  </label>
  
  <label>
    Opacity
    <input type="range" min="0" max="1" step="0.1" value={$iconStore.opacity} />
  </label>
  
  <!-- Export -->
  <div class="export">
    <button on:click={downloadSvg}>Download SVG</button>
    <button on:click={downloadPng}>Download PNG</button>
  </div>
</div>

<style>
  .preview { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; border: 1px solid #ddd; }
  .canvas { height: 256px; background: #f9f9f9; display: flex; align-items: center; justify-content: center; }
  label { display: flex; align-items: center; gap: 0.5rem; }
  input[type="range"] { flex: 1; }
  .export { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
</style>
```

### 3.3 Icon Store (`src/lib/icon/icon-store.ts`)

```typescript
import { writable } from 'svelte/store';

export interface IconState {
  assetId: string;
  artist: string;
  filename: string;
  domain: string;
  color: string;
  brightness: number;
  opacity: number;
  svgContent: string;
}

export function createIconStore() {
  const initial: IconState = {
    assetId: '',
    artist: '',
    filename: '',
    domain: 'divine',
    color: '#FFD700',
    brightness: 1.0,
    opacity: 1.0,
    svgContent: ''
  };
  
  const { subscribe, set, update } = writable(initial);
  
  return {
    subscribe,
    selectAsset(assetId: string, artist: string, filename: string, domain: string, color: string) {
      update(state => ({ ...state, assetId, artist, filename, domain, color }));
    },
    setEffects(brightness: number, opacity: number) {
      update(state => ({ ...state, brightness, opacity }));
    },
    setSvgContent(svgContent: string) {
      update(state => ({ ...state, svgContent }));
    }
  };
}

export const iconStore = createIconStore();
```

**Deliverable:** Discovery + Preview components, basic E2E test

---

## 4. Phase 3: Integration (Week 7)

### 4.1 Faction Generator Integration

```typescript
export class FactionWithSymbol {
  id: string;
  name: string;
  domain: string;
  symbol: {
    assetId: string;
    color: string;
    brightness: number;
    opacity: number;
    svgExport: string;
    pngExport?: Blob;
  };
  createdAt: string;
}
```

### 4.2 API Endpoints

```
GET    /api/icons/search?q=sword&domain=divine
GET    /api/icons/domain/divine/categories
POST   /api/factions
  { name, domain, assetId, artist, color, brightness }
GET    /api/factions/:id
```

### 4.3 Database Schema (Prisma)

```prisma
model Faction {
  id        String   @id @default(cuid())
  name      String
  domain    String
  
  symbolId  String   @unique
  symbol    IconSelection @relation(fields: [symbolId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model IconSelection {
  id        String   @id @default(cuid())
  
  assetId   String   // delapouite/ancient-sword
  artist    String   // delapouite
  filename  String   // ancient-sword.svg
  
  domain    String
  color     String   // Hex color
  brightness Float
  opacity   Float
  
  svgExport String   // Raw SVG blob
  pngExport Bytes?   // Optional PNG blob (may be null to save space)
  
  createdAt DateTime @default(now())
  
  faction   Faction?
}
```

**Deliverable:** Working `/faction/new/symbol` page that creates factions with icons

---

## 5. Phase 4: Stabilization & Testing (Week 8)

### 5.1 Core Testing
- [ ] Recolor quality on 100 random Delapouite SVGs (⠕>4 quality score)
- [ ] Search algorithm on 50 test queries
- [ ] Icon preview + export in 3 browsers (Chrome, Firefox, Safari)
- [ ] Create 10 test factions, verify symbols persist

### 5.2 Bug Fixes
- [ ] SVG parsing errors gracefully
- [ ] Network failures handled
- [ ] PNG export timeout protection
- [ ] Search returns empty results messaging

### 5.3 Performance
- [ ] Icon thumbnails load in <100ms
- [ ] Search responds in <200ms
- [ ] PNG export in <2s
- [ ] Memory usage <50MB on low-end devices

**Deliverable:** Stable, tested MVP ready for production

---

## 6. Phase 5+: Polish (Post-MVP, if time)

- [ ] Dark mode support
- [ ] Fuzzy matching (Fuse.js)
- [ ] Favorites list
- [ ] Accessibility audit
- [ ] i18n support
- [ ] Offline mode

**Note:** Only pursue if Phase 1-4 complete 2+ weeks early.

---

## 7. Architecture (Simplified)

```
src/
├── lib/
│   ├── icon/
│   │   ├── recolor-engine.ts        (200 lines)
│   │   ├── discovery-service.ts     (150 lines)
│   │   └── icon-store.ts            (60 lines)
│   ├── faction/
│   │   └── generator.ts             (80 lines)
│   └── data/
│       └── domains.json             (config)
├── components/
│   ├── IconDiscovery.svelte         (100 lines)
│   ├── IconPreview.svelte           (120 lines)
│   └── IconThumbnail.svelte         (40 lines)
└── routes/
    └── faction/
        └── [id]/
            └── symbol/
                └── +page.svelte     (100 lines)

config/
├── domains.json                      (6 domains × 5 colors each)
└── keywords.json                     (10K icons, categories, keywords)
```

---

## 8. Timeline Breakdown

| Phase | Task | Week | Effort | Risk |
|-------|------|------|--------|------|
| Spike | SVG testing, keyword audit, search feel | 1 | 9h | HIGH |
| 0 | Build keywords.json to 90% | 2-3 | 40h | MEDIUM |
| 1 | Recolor engine + discovery service | 4-5 | 30h | LOW |
| 2 | UI components | 6 | 20h | LOW |
| 3 | Integration + API | 7 | 25h | LOW |
| 4 | Testing + stabilization | 8 | 20h | LOW |
| **TOTAL** | | | **144h** | |

**Total: 8 weeks (1 developer), 6 weeks (2 developers)**

---

## 9. Critical Success Factors

1. ✅ **keywords.json exists & is complete** (no keywords = no discovery)
2. ✅ **SVG recolor quality ≥4/5** (tested in Spike phase)
3. ✅ **Domain affinities are realistic** (manually validated)
4. ✅ **Search feels responsive** (<200ms queries)
5. ✅ **Icon library legally compliant** (CC-BY attribution working)

---

## 10. What's Cut from Original Spec

- ❌ Offline mode (Phase 5+)
- ❌ IndexedDB caching (not needed for MVP)
- ❌ Dark mode (Phase 5+)
- ❌ i18n (Phase 5+)
- ❌ Comprehensive accessibility audit (Phase 5+)
- ❌ Fuzzy matching (use simple matching in Phase 1, upgrade Phase 5)
- ❌ Confidence scoring UI (too complex)

---

## 11. Known Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| keywords.json incomplete | CRITICAL | Start Phase 0 immediately, allocate 2 people |
| SVG recolor looks bad | HIGH | Spike phase validates; fallback to Delapouite only |
| Search algorithm feels slow | MEDIUM | Phase 1 uses simple matching; upgrade in Phase 3 if needed |
| Domain affinities are subjective | MEDIUM | Manual validation in Phase 0; user feedback in Phase 5 |
| PNG export is memory hog | MEDIUM | Use OffscreenCanvas; warn if >500MB |
| Icons load slowly | LOW | Lazy-load thumbnails; cache SVG files |

---

## 12. Exit Criteria by Phase

**Spike Phase:**
- [ ] 3 reports complete with actionable findings
- [ ] No architectural blockers identified
- [ ] Timeline revised based on learnings

**Phase 0 (Keywords):**
- [ ] keywords.json ≥90% complete
- [ ] All icons have 3-5 keywords
- [ ] Domain affinities validated manually
- [ ] Exclusion rules documented

**Phase 1 (Engine):**
- [ ] Recolor engine ≥80% quality on Delapouite SVGs
- [ ] Discovery service returns relevant results
- [ ] Unit tests passing
- [ ] No critical bugs in parser

**Phase 2 (UI):**
- [ ] Discovery component: search + domain buttons working
- [ ] Preview component: display + effect sliders
- [ ] E2E workflow: select → preview → export tested

**Phase 3 (Integration):**
- [ ] Faction table in database
- [ ] Create faction API working
- [ ] Symbol persists across page reloads

**Phase 4 (Stabilization):**
- [ ] 100 manual tests passed
- [ ] No unhandled errors in logs
- [ ] Performance benchmarks met
- [ ] Ready for production deployment

---

## 13. Success Metrics (MVP)

- Users can find icons in <30 seconds (domain button + 2 keywords)
- SVG export works 100% of time
- PNG export works 95% of time (fails gracefully on edge cases)
- Icon symbols persist across sessions
- No crashes on 10K icon searches
- Attribution working (CC-BY compliant)

---

## Summary

**This recalibrated spec:**
- ✅ Is realistic (8 weeks, not 4)
- ✅ Has mandatory Spike phase (de-risk early)
- ✅ Blocks Phase 1 on Phase 0 (keywords matter)
- ✅ Cuts scope ruthlessly (Phase 5+ deferred)
- ✅ Includes error handling
- ✅ Has explicit exit criteria
- ✅ Shows actual effort estimates (144 hours)

**To succeed:**
1. Start Spike immediately (9 hours)
2. Commit 2 people to Phase 0 keywords (40 hours)
3. Follow phases in order (no skipping)
4. Weekly status check against timeline
5. De-risk recolor engine in Phase 1 (highest risk component)
