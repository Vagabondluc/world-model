# Faction & God Symbol Generation Specification

## Overview

Comprehensive procedural symbol generator for factions, gods, orders, and organizations across all domains. Creates consistent, reusable SVG-based heraldry without AI. Each entity gets a unique visual identity based on seed, domain, style, and optional composition layers. Supports deterministic generation, custom color schemes, and export in multiple formats.

## Objectives

- Generate visual identities for factions, gods, orders, and organizations using seeded randomness
- Support 12 thematic domains with environmental/cultural context (arcane, divine, nature, shadow, chaos, order, primal, death, life, forge, storm, trickery)
- Offer 12+ distinct symbol styles with customizable complexity levels (shield, circle, star, crown, rune, mandala, geometric, beast, heraldic cross, symmetrical seal, tribal totem, celestial)
- Create deterministic, reproducible symbols from seed values
- Enable variant selection, composition layering, and deep customization without manual design
- Support multiple export formats and integration with game engines and asset pipelines

## Core Features

### 1. Symbol Generation Engine (`src/lib/faction/generator.ts`)

**FactionSymbolGenerator class**
- Input: seed string, domain, style, complexity (1-5), optional dimensions (default 256x256), color overrides
- Output: SVG string + data URL + metadata (dimensions, layers, seed hash)
- Seeded deterministic random number generator with collision resistance
- Domain-aware color palettes with light/dark mode variants
- Complexity levels affect detail density, stroke weight, pattern intricacy

**Symbol Styles (12 Base + Variants):**

**Geometric/Heraldic:**
- **Shield**: Traditional heraldic shield with inner pattern (stripes, dots, cross, or concentric circles). Complexity affects border ornaments and internal divisions.
- **Heraldic Cross**: Cross/Plus pattern with 4 main arms, subdivisions based on complexity. Supports quartering and saltire variants.
- **Symmetrical Seal**: Perfect radial symmetry (N-fold, N=3-8 based on seed). Used for government/order entities.

**Celestial/Cosmic:**
- **Star**: Multi-pointed star (4-8 points, seeded). Complexity adds orbital rings, connecting lines, center motifs.
- **Celestial**: Constellation-like pattern with connected dots forming animal/symbol shapes.
- **Mandala**: N-ring mandala (3-6 rings based on complexity) with M petals per ring (8-24). Center motif varies per domain.

**Mystical/Arcane:**
- **Rune**: Angular mystical rune within decorative frame. Complexity adds secondary runes, connecting flows, and arcane geometries.
- **Totem**: Tribal totem pole of stacked animals/symbols (2-5 layers). Base, middle, apex with domain-appropriate forms.
- **Glyph**: Abstract flowing glyph with curves and angles. Complexity affects stroke thickness variation and internal detail.

**Organic/Natural:**
- **Beast**: Stylized creature head/body. Complexity adds skeletal structure, feather/scale detail, additional limbs/appendages.
- **Flora**: Heraldic plant (flower/tree/vine). Petals, leaves, and vines scale with complexity.
- **Heraldic Animal**: Rampant creature (lion/eagle/dragon) in classic heraldic pose. Complexity adds armor, burden, or distinctive markings.

**Compound:**
- **Quartered**: Four distinct symbols (one per quadrant, different seeds). Used for merged factions/alliances.
- **Composite**: 2-3 layered symbols with varying opacity. Primary symbol with supporting motif.

### 2. Complexity Levels

- **Level 1 (Minimal)**: Single shape, basic colors, minimal patterns. Fast render, clean look.
- **Level 2 (Simple)**: One pattern layer, basic secondary colors, minimal detail.
- **Level 3 (Standard)**: Multiple pattern options, full 3-color scheme, moderate detail (default).
- **Level 4 (Complex)**: Multiple layers, fine details, intricate patterns, thicker stroke work.
- **Level 5 (Ornate)**: Maximum detail, all color channels, decorative elements, fine line work, ornamental borders.

### 3. Domain Color Palettes

### 3. Domain Color Palettes

**Extended Palette System:**
Each domain includes separate palettes for light and dark mode rendering. Each palette has 5 color slots: primary, secondary, accent, shadow, highlight.

Light Mode (default): Higher brightness, contrast tuned for white backgrounds.
Dark Mode: Adjusted saturation/brightness for dark backgrounds.

**Domain Definitions with Context:**

- **Arcane**: Purple/Lavender spectrum. Associated with magic, wizardry, research. Symbols often geometric, glowing, or rune-focused.
  - Light: Primary #6b5b95, Secondary #88669d, Accent #c9a0dc, Shadow #4a3a6a, Highlight #e0d4f0
  - Dark: Primary #8b7bba, Secondary #a89dcc, Accent #dcc8ff, Shadow #3a2a5a, Highlight #c9c3df

- **Divine**: Gold/Celestial spectrum. Associated with gods, celestials, holy powers. Symbols often radiant, crowned, or seal-like.
  - Light: Primary #ffd700, Secondary #ffed4e, Accent #fff700, Shadow #cc9900, Highlight #fffacd
  - Dark: Primary #ffea80, Secondary #fff9a5, Accent #ffff99, Shadow #b8860b, Highlight #ffffe0

- **Nature**: Green spectrum with earth tones. Associated with wilderness, druids, animals. Symbols often organic, plant-based, or bestial.
  - Light: Primary #2d5016, Secondary #3d7024, Accent #90ee90, Shadow #1a3a0a, Highlight #c8e6c9
  - Dark: Primary #558b2f, Secondary #7cb342, Accent #aed581, Shadow #1b5e20, Highlight #dcedc8

- **Shadow**: Dark blue/black spectrum. Associated with darkness, rogues, deception. Symbols often concealing, jagged, or void-like.
  - Light: Primary #1a1a2e, Secondary #16213e, Accent #0f3460, Shadow #0a0a1a, Highlight #344152
  - Dark: Primary #667bc6, Secondary #7889b8, Accent #9bb3dd, Shadow #3a4a6a, Highlight #b8bfd9

- **Chaos**: Red/Orange spectrum. Associated with destruction, wild magic, unpredictability. Symbols often jagged, flame-like, or explosive.
  - Light: Primary #ff1744, Secondary #ff6e40, Accent #ff9100, Shadow #cc0000, Highlight #ffab91
  - Dark: Primary #ff6b6b, Secondary #ff8a65, Accent #ffa726, Shadow #d32f2f, Highlight #ffccbc

- **Order**: Blue spectrum. Associated with law, structure, organization. Symbols often symmetric, grid-based, or precise.
  - Light: Primary #1976d2, Secondary #2196f3, Accent #64b5f6, Shadow #0d47a1, Highlight #bbdefb
  - Dark: Primary #42a5f5, Secondary #64b5f6, Accent #90caf9, Shadow #1565c0, Highlight #cfe8fc

- **Primal**: Brown/Earth spectrum. Associated with savagery, beasts, raw power. Symbols often bestial, scarred, or animalistic.
  - Light: Primary #8b4513, Secondary #a0522d, Accent #cd853f, Shadow #704214, Highlight #d2b48c
  - Dark: Primary #a0522d, Secondary #cd853f, Accent #daa520, Shadow #5c2e0f, Highlight #f5deb3

- **Death**: Gray/Black spectrum. Associated with undeath, necromancy, finality. Symbols often skeletal, decreasing, or fading.
  - Light: Primary #2a2a2a, Secondary #4a4a4a, Accent #6a6a6a, Shadow #1a1a1a, Highlight #8a8a8a
  - Dark: Primary #5a5a5a, Secondary #7a7a7a, Accent #9a9a9a, Shadow #2a2a2a, Highlight #ababab

- **Life**: Green spectrum (vibrant). Associated with healing, growth, vitality. Symbols often circular, expanding, or fertile.
  - Light: Primary #00b050, Secondary #00c65e, Accent #70ad47, Shadow #007c3a, Highlight #b8e6b8
  - Dark: Primary #4caf50, Secondary #66bb6a, Accent #81c784, Shadow #00796b, Highlight #c8e6c9

- **Forge**: Orange/Red spectrum. Associated with crafting, forging, industry. Symbols often angular, heat-like, or mechanical.
  - Light: Primary #d4471f, Secondary #ff6b35, Accent #ffa252, Shadow #a83415, Highlight #ffccbc
  - Dark: Primary #ff8a65, Secondary #ffab91, Accent #ffb74d, Shadow #e64a19, Highlight #ffe0b2

- **Storm**: Navy/Gray spectrum. Associated with weather, air, electricity. Symbols often dynamic, angular, or flowing.
  - Light: Primary #1e3a8a, Secondary #3b6fc3, Accent #60a5fa, Shadow #0f2857, Highlight #dbeafe
  - Dark: Primary #64b5f6, Secondary #81d4fa, Accent #b3e5fc, Shadow #01579b, Highlight #e1f5fe

- **Trickery**: Purple/Pink spectrum. Associated with deception, magic, chaos (playful). Symbols often unexpected, morphing, or illusory.
  - Light: Primary #a020f0, Secondary #d946ef, Accent #f0abfc, Shadow #6a0dad, Highlight #f3e5f5
  - Dark: Primary #d946ef, Secondary #f0abfc, Accent #f5c2ff, Shadow #7b1fa2, Highlight #f3e5f5

### 4. Extended Configuration System

**GenerationOptions Interface**
```typescript
{
  seed: string;                          // Deterministic seed string
  domain: FactionDomain;                 // Thematic domain
  style: SymbolStyle;                    // Base symbol style
  complexity?: number;                   // 1-5, default 3
  width?: number;                        // SVG width, default 256
  height?: number;                       // SVG height, default 256
  scale?: number;                        // Additional scale factor (0.5-2.0)
  colors?: ColorOverride;                // Custom color scheme
  darkMode?: boolean;                    // Use dark mode variant
  pattern?: PatternType;                 // Override automatic pattern selection
  strokeWeight?: 'thin' | 'normal' | 'bold';  // Line thickness
  composition?: CompositionLayer[];      // Layered symbol composition
  seed?: {                               // Fine-grained seed control
    colorSeed?: string;                  // Separate seed for color variation
    patternSeed?: string;                // Separate seed for pattern selection
    detailSeed?: string;                 // Separate seed for detail complexity
  };
  cache?: boolean;                       // Enable result caching
}
```

**FactionEntity Interface**
```typescript
{
  id: string;
  name: string;
  type: 'faction' | 'god' | 'order' | 'organization' | 'cult';
  domain: FactionDomain;
  dominantStyle?: SymbolStyle;           // Primary style preference
  seed: string;                          // Base seed unique to entity
  aliases?: string[];                    // Alternative names (for seed variation)
  generationConfig?: Partial<GenerationOptions>;
  tags?: string[];                       // Organization/category tags
  created?: number;                      // Timestamp
  modified?: number;                     // Last modification timestamp
}
```

**CompositionLayer Interface**
```typescript
{
  seed: string;                          // Layer-specific seed
  style: SymbolStyle;                    // Style for this layer
  opacity: number;                       // 0-1, blending opacity
  scale: number;                         // Layer-scale factor
  offsetX?: number;                      // X translation in pixels
  offsetY?: number;                      // Y translation in pixels
  blendMode?: CanvasBlendMode;           // 'multiply', 'screen', 'overlay', etc.
  filter?: {                             // SVG filters
    blur?: number;
    brightness?: number;                 // 0.5-2.0
    saturation?: number;                 // 0-2.0
    contrast?: number;                   // 0-2.0
  };
}
```

**ColorOverride Interface**
```typescript
{
  primary?: string;                      // Hex color override
  secondary?: string;
  accent?: string;
  shadow?: string;
  highlight?: string;
  base?: string;                         // Background color (vs domain default)
  useGradient?: boolean;                 // Enable gradient fills
  gradientAngle?: number;                // 0-360 degrees
  customPalette?: {                      // Full custom 5-color palette
    [key: string]: string;
  };
}
```

**PatternType Options**
```
'stripes' | 'dots' | 'cross' | 'concentric' | 'waves' | 'hexagon' | 'triangles' | 'random'
```

**GeneratedSymbol Interface**
```typescript
{
  svg: string;                           // Raw SVG markup
  dataUrl: string;                       // data:image/svg+xml URL
  seed: string;                          // Original seed
  domain: FactionDomain;
  style: SymbolStyle;
  complexity: number;                    // Rendered complexity
  dimensions: { width: number; height: number };
  metadata: {
    renderTime: number;                  // ms to generate
    seedHash: string;                    // Hash of seed for quick comparison
    layers: number;                      // Number of composition layers
    colors: ColorOverride;               // Applied colors
  };
}
```

### 5. Variant Generation & Selection

**generateSymbolVariants(name, domain, count?, options?)**
- Generates up to 12 symbol variants (one per style)
- All share same seed/domain but differ in visual style
- Allows user to preview and select preferred aesthetic
- Options: `{ complexity?: 1-5, colors?: ColorOverride, darkMode?: boolean }`
- Returns: `GeneratedSymbol[]`

## Implementation Details

### Seeded Random Number Generator
- Converts seed string to integer hash via charCodeAt() sum with polynomial rolling hash
- Uses linear congruential generator (LCG) with parameters (a=9301, c=49297, m=233280) for deterministic sequences
- Collision-resistant for different paths through seed space
- Methods: 
  - `next()` returns [0-1] float
  - `nextInt(max)` returns [0, max)
  - `nextInRange(min, max)` returns [min, max)
  - `choice(array)` selects random array element
  - `nextBool(probability)` returns boolean based on probability [0-1]
  - `nextGaussian()` returns normally distributed value

### SVG Generation Pipeline
1. Initialize canvas dimensions and seeded RNG with seed+domain+style
2. Generate background base shape with primary color
3. Add mid-layer patterns based on complexity and patternSeed
4. Apply domain-specific overlays and details using accentSeed
5. Add optional borders, frames, or ornamental elements
6. Encode to XML and wrap in SVG element with viewBox
7. Create data URL via encodeURIComponent()
8. Store metadata (renderTime, seedHash, etc.)

### Pattern Generation Library
**Reusable pattern functions** for use across all styles:
- `generateStripes(cx, cy, width, height, angle, spacing, color)`: Diagonal/vertical/horizontal stripes
- `generateDots(cx, cy, radius, density, color)`: Dot grid or scatter
- `generateCross(cx, cy, size, thickness, color)`: Simple or ornate cross
- `generateConcentricCircles(cx, cy, count, spacing, colors)`: Ring patterns
- `generateWaves(cx, cy, width, height, frequency, amplitude, color)`: Wavy lines
- `generateHexagon(cx, cy, size, color, filled)`: Hexagon grid or single
- `generateTriangles(cx, cy, size, color, pattern)`: Triangle tessellation
- `generateMask(shape, cx, cy, size)`: Masking shapes for complex overlays

### Color Processing
- Convert hex #RGB -> linear RGB for brightness calculations
- Support color gradients: `generateGradient(color1, color2, angle, steps)`
- Maintain contrast ratios >4.5:1 for accessibility (WCAG AA)
- Light/Dark mode auto-detection and palette switching
- Saturation adjustment per complexity level
- Gradient fills with optional SVG gradient elements

### Composition & Layering
- Render base layer first (primary symbol)
- Apply composition layers in order with blending
- Support SVG filter chains (blur, saturation, brightness, contrast)
- Canvas blending modes: multiply, screen, overlay, color-dodge, color-burn
- Z-order management via SVG element ordering
- Opacity compositing with feComposite filters

## Export Formats & Storage

**SVG Export**
- Direct SVG file download
- Inline data URL (for immediate use)
- Minified SVG for size optimization
- Namespace preservation for compatibility

**PNG Export** (via canvas/image conversion)
- Supported via html2canvas or native Canvas.toDataURL()
- Configurable resolution (1x, 2x, 4x scaling)
- Transparent background or colored background
- Optional metadata embedding (seed, domain, style)

**JSON Export**
```json
{
  "id": "faction-uuid",
  "name": "Faction Name",
  "domain": "arcane",
  "seed": "faction-name-arcane-v1",
  "symbols": [
    {
      "style": "shield",
      "complexity": 3,
      "svg": "...",
      "dataUrl": "data:image/svg+xml...",
      "filename": "faction-name-shield.svg"
    }
  ],
  "metadata": {
    "generated": "2026-03-10T12:00:00Z",
    "generatorVersion": "1.0.0"
  }
}
```

**Asset Library Format**
- CSV index: id, name, domain, seed, style, complexity, filepath
- Organized in folders: `/symbols/{domain}/{style}/`
- Batch export: zip all symbols for a faction or domain

## Caching & Performance

**Caching Strategy**
- In-memory LRU cache (default 100 entries)
- Key: `${seed}:${domain}:${style}:${complexity}:${JSON.stringify(colors)}`
- Hit rate optimization: pre-generate common variants on startup
- Cache invalidation: manual clear or TTL (default 1 hour)

**Render Performance Targets**
- Single symbol: <1ms (with cache hit)
- Single symbol from scratch: <50ms
- 6 variants (full grid): <300ms
- 12 variants (all styles): <600ms

**Optimizations**
- Avoid DOM manipulation for generation (pure SVG string)
- Reuse RNG instances per batch
- Lazy-load pattern libraries
- Memoize color palette lookups
- Batch process layers via SVG grouping

## Advanced Features

### Symbol Composition
- **Quartering**: 4 symbols in quadrants (heraldic shield tradition)
  - Seed variation: `${baseSeed}-q{1-4}`
  - Each quadrant independent domain/style selection
  - Optional divisions and borders

- **Impalement**: Two symbols side-by-side (marriage/alliance of factions)
  - Left/right symbol with dividing line
  - Scale factors for emphasis

- **Ensnares**: Symbol surrounded by frame/border
  - Border style: solid, ornate, jagged, ethereal
  - Multiple layers with inset positioning

### Randomization Controls
- **Pure Random**: All aspects randomized per style
- **Fixed Style**: Same style, colors randomized per complexity/domain
- **Fixed Palette**: Domain colors locked, style and patterns randomized
- **Template**: Pre-defined layout with randomized fill elements

### Domain-Aware Customization
- **Arcane-only**: Add mystical glyphs, ley lines, magical auras
- **Divine-only**: Add halos, light rays, celestial motifs
- **Nature-only**: Add leaf/vine elements, animal companions
- **Beast-only**: Add scarring, armor, distinguishing features
- **Order-only**: Add grids, symmetry enforcement, geometric precision

### Thematic Variation Modes
- **Heraldic**: Formal shield-based designs with traditional rules
- **Tribal**: Organic, hand-drawn style with cultural symbols
- **Arcane**: Mystical with flowing lines and glowing elements
- **Cosmic**: Stars and celestial bodies with connections
- **Industrial**: Geometric, mechanical, gear-based
- **Wild**: Organic shapes, natural asymmetry, creature-focused

## Data Storage & Serialization

**Database Schema (if persisting)**

```sql
CREATE TABLE symbols (
  id UUID PRIMARY KEY,
  faction_id UUID NOT NULL,
  name VARCHAR(255),
  domain VARCHAR(50),
  style VARCHAR(50),
  complexity INT,
  seed VARCHAR(255),
  svg_content TEXT,
  dimensions JSON,
  colors JSON,
  created_at TIMESTAMP,
  modified_at TIMESTAMP,
  UNIQUE(faction_id, style)
);

CREATE TABLE faction_entities (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  domain VARCHAR(50),
  base_seed VARCHAR(255),
  configuration JSON,
  created_at TIMESTAMP,
  modified_at TIMESTAMP
);
```

**State Management (React/Frontend)**
- Redux store with entity slices
- Symbol generation reducers
- Caching middleware
- Undo/redo support for generation history

## UX Flow & Integration

### Primary Workflow (Symbol Selection)
1. User enters entity name (faction, god, order, etc.)
2. Select or auto-match domain (arcane, divine, nature, etc.)
3. **Preview Grid**: Display 6 symbol variants (default styles)
   - Hover for style name and complexity preview
   - Click to full-screen preview
4. **Select Preferred Style**: Confirm choice or regenerate
5. **Fine-tune Panel** (optional):
   - Complexity slider (1-5)
   - Color customization (use domain/custom)
   - Pattern selection
   - Dark mode toggle
6. **Export**: Download SVG, PNG, or save to library
7. **Save Entity**: Store configuration for future regeneration

### Advanced Workflow (Composition)
1. Start with selected symbol
2. **Add Layer**: +Composition Layer button
3. Configure layer: style, opacity, position, filters
4. Preview combined result
5. Adjust blending, opacity, positioning in UI
6. Export composite symbol

### Integration Points
- **Game Engine Integration**: Export symbols to asset manager, use as NPC emblems, faction banners, sigils
- **Content Generators**: Link symbol generation to faction name generators, randomized encounters
- **Dungeon Generator**: Embed faction symbols in room/encounter descriptions
- **Campaign Tools**: Symbol library for quick NPC/faction creation
- **Asset Pipeline**: Batch export symbols for game builds

## Testing Strategy

### Unit Tests
- **RNG Tests**: Verify deterministic output with known seeds
- **Color Palette Tests**: Validate hex colors, contrast ratios, mode switching
- **Pattern Tests**: Verify pattern generation correctness per type
- **Serialization Tests**: SVG string validity, data URL encoding

### Integration Tests
- **Full Generation Pipeline**: seed → symbol for 12×12 matrix (144 combinations)
- **Composition Tests**: Multi-layer rendering and blending
- **Export Tests**: SVG validity, PNG rasterization, JSON serialization
- **Caching Tests**: Cache hits/misses, invalidation behavior
- **Performance Tests**: Render times <1ms for cache, <50ms from scratch

### Visual Regression Tests
- Screenshot comparison for each style × complexity × mode combination
- Compare against baseline image sets
- Flag color variations, pattern changes, layout shifts

### Accessibility Tests
- **WCAG AA Compliance**: Color contrast ratios >4.5:1
- **Lightness Differential**: Ensure symbols visible on both light and dark backgrounds
- **SVG Semantics**: Title/desc attributes for accessibility

### Load Testing
- Batch generate 100+ symbols concurrently
- Verify cache behavior under load
- Monitor memory usage and garbage collection

## Security & Validation

**Input Validation**
- Seed string length: 1-500 characters
- Domain must be in valid enum
- Style must be in valid enum
- Complexity: 1-5 integer
- Colors: Valid hex format or none
- Dimensions: 64-2048 pixels

**SVG Injection Prevention**
- Sanitize any user-provided strings in SVG content
- Validate all SVG elements belong to whitelisted set
- Use textContent, not innerHTML for any dynamic content
- Encode entities properly in data URLs

**Rate Limiting**
- Limit variant generation to 12 per entity per minute
- Batch operations limited to 100 symbols
- Cache prevents re-rendering same configuration

## Documentation Requirements

### API Documentation
- TypeScript interfaces with JSDoc comments
- Function signatures and parameter descriptions
- Return types and error handling
- Example usage for each major function

### User Guide
- Symbol style gallery with descriptions
- Domain explanations and thematic context
- Complexity level visual examples
- Export format recommendations

### Developer Guide
- Architecture overview (RNG, pattern library, rendering pipeline)
- Adding new symbol styles (template, required functions)
- Custom domain creation
- Extending color palettes
- Performance optimization tips

## Roadmap & Future Enhancements

### Phase 2 (Medium-term)
- **Animation Support**: SVG animations (rotate, pulse, dissolve)
  - CSS-based and SVG-native approaches
  - Controlled playback (loop, reverse, one-shot)
  - Performance optimization via GPU acceleration

- **Texture & Effects**:
  - SVG noise filters (perlin noise simulation)
  - Grain, canvas texture overlays
  - Weathering and aging effects
  - Metallicness and shine effects

- **Procedural Heraldic Rules**:
  - Enforce heraldic tincture rules (color on color restrictions)
  - Charge and field combinations
  - Medieval heraldic terminology integration

- **Faction Lineage**:
  - Symbol evolution over time
  - Parent-child symbol derivation
  - Dynasty/generational symbol chains

### Phase 3 (Long-term)
- **3D Symbol Rendering**: Three.js integration for 3D badges/shields
- **Animation Sequences**: Multi-frame symbol animations for games
- **Neural Network Variant**: Optional ML-based style transfer (if AI ever needed)
- **Social Features**: Symbol marketplace, community gallery, voting
- **Game Engine Plugins**: Direct Godot, Unreal, Unity integration
- **Accessibility Themes**: High contrast, colorblind-friendly modes
- **Metadata Embedding**: XMP/EXIF data in PNG exports

## Constraints & Assumptions

**Performance Constraints**
- Single symbol generation must complete in <100ms on standard hardware
- Cache should not exceed 50MB memory for typical usage
- Batch generation of 100 symbols: <5 seconds
- No network calls required for generation (offline-first)

**Compatibility Constraints**
- SVG 1.1 compatible output (no SVG 2.0 features)
- JavaScript ES2020+ required
- Works on Node.js 16+ and modern browsers (Chrome, Firefox, Safari, Edge)

**Data Constraints**
- Seed strings limited to ASCII alphanumeric + hyphens/underscores
- SVG output size <100KB per symbol
- JSON export <1MB per faction with 20 variants

**Design Constraints**
- Symbols must remain recognizable at sizes 16px - 2048px
- Color palettes must maintain WCAG AA contrast on any background
- No photorealistic or AI-generated appearance (procedural only)
- Culturally neutral; avoid offensive symbolism

## Extensibility Points

**How to Add New Symbol Styles**
1. Add style name to `SymbolStyle` type union
2. Implement generator function: `generateStyleName(cx, cy, config, rng): string`
3. Add to switch statement in `FactionSymbolGenerator.createSVG()`
4. Configure domain-specific overrides if needed
5. Add to style documentation and gallery

**How to Add New Domains**
1. Add domain to `FactionDomain` type union
2. Add 10-color palette to `DOMAIN_COLORS` (light + dark, 5 each)
3. Add contextual description and associations
4. Test with all 12 symbol styles for visual coherence
5. Update documentation

**How to Add Custom Patterns**
1. Implement pattern function: `generatePattern(cx, cy, size, color, rng): string`
2. Register in `PATTERNS` registry
3. Add to pattern selection logic in style generator
4. Update pattern documentation

## API Examples

**Basic Generation**
```typescript
const generator = new FactionSymbolGenerator({
  seed: 'The Crimson Covenant',
  domain: 'chaos',
  style: 'shield',
  complexity: 3
});
const symbol = generator.generate();
console.log(symbol.dataUrl); // Ready for img src
```

**Batch Variant Generation**
```typescript
const variants = generateSymbolVariants(
  'Order of the Eternal Sun',
  'divine',
  6
);
variants.forEach(v => {
  console.log(`${v.style}: ${v.dataUrl}`);
});
```

**Custom Colors with Composition**
```typescript
const composite = new FactionSymbolGenerator({
  seed: 'Faction A + Faction B',
  domain: 'order',
  style: 'shield',
  complexity: 4,
  colors: { primary: '#ff0000', secondary: '#0000ff' },
  composition: [
    { seed: 'Faction A', style: 'star', opacity: 1.0, scale: 0.8 },
    { seed: 'Faction B', style: 'circle', opacity: 0.6, scale: 0.6, offsetX: 20 }
  ]
});
```

**Export to Multiple Formats**
```typescript
const symbol = generator.generate();
// SVG
fs.writeFileSync('symbol.svg', symbol.svg);
// JSON record
const record = { name: 'Faction', ...symbol, dataUrl: symbol.dataUrl };
fs.writeFileSync('symbol.json', JSON.stringify(record));
```

## Success Criteria

✅ **MVP Success** (Phase 1)
- All 12 base symbol styles fully implemented
- 12 domains with color schemes working
- Deterministic generation with seed control
- SVG export functional
- <100ms generation time
- Documentation complete

✅ **Release Success** (Phase 2+)
- Composition/layering working smoothly
- Animation support operational
- Community grows to 100+ unique faction symbols
- Integrate with main dungeon generator
- 99.9% uptime if cloud-hosted

