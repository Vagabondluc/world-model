# Symmetry Options Brainstorm: Sacred Sigil Generator

## Current State
The UI shows "Symmetry: none" with 2-3 options total.

For religious iconography and procedural sigils, symmetry is a **core aesthetic feature**—most sacred symbols use explicit symmetry. Expand this massively.

---

## Brainstorm: Comprehensive Symmetry Options

### Category 1: Mirror Symmetries (Bilateral)
```
none              No symmetry (random asymmetry)
vertical          Mirror along Y axis (left ↔ right)
horizontal        Mirror along X axis (top ↔ bottom)
both              Four-fold mirror (vertical + horizontal = 4 mirrored quadrants)
diagonal          Mirror along X=Y diagonal (top-left ↔ bottom-right)
diagonal-alt      Mirror along X=-Y diagonal (top-right ↔ bottom-left)
```

**Use case:** Cross patterns, shields, formal heraldry

---

### Category 2: Rotational Symmetries
```
rotate-90         4-fold rotational (90° = cardinal directions, very formal)
rotate-120        3-fold rotational (120°, triangular, alchemical feel)
rotate-180        2-fold rotational (180°, opposite pairs, yin-yang style)
rotate-60         6-fold rotational (60°, hexagonal, snowflake-like)
rotate-45         8-fold rotational (45°, octagon/star pattern)
```

**Use case:** Mandalas, astrological symbols, radial designs

---

### Category 3: Radial/Star Symmetries
```
radial-4          Full radial 4-way (like + sign, cardinal directions)
radial-6          Full radial 6-way (hexagon, natural/snowflake feel)
radial-8          Full radial 8-way (octagon, formal star, east/west/north/south + diagonals)
radial-12         Full radial 12-way (clock face, zodiac, very ornate)
radial-16         Full radial 16-way (compass rose, maximum symmetry)
```

**Use case:** Mandalas, astrological seals, cosmic symbols

---

### Category 4: Hybrid Symmetries (Mirror + Rotation)
```
quad-mirror       4-fold mirror (vertical + horizontal reflections, creates 4 identical quadrants)
            Same as "both" above, but name is clearer
            
hex-mirror        6-fold with 3 mirror lines (hexagonal symmetry, very sacred geometry)
            180° rotation + 3 reflection axes at 60° intervals
            Used in: Star of David, snowflakes, flowers
            
oct-mirror        8-fold with mirror lines (octagon + reflection, most formal)
            90° rotation + 4 reflection axes at 45° angles
            Used in: Celtic knots, mandala centers, chakra symbols
            
tri-mirror        3-fold with mirror lines (triangular, triquetra style)
            120° rotation + 3 reflection axes at 60° intervals
            Used in: Triquetra, nuclear symbols, Celtic knot variants
```

**Use case:** Complex compound symmetries, very formal/formal religious symbols

---

### Category 5: Domain-Specific Symmetries (Keywords)
```
mandala           Full radial 8-fold + 8 mirror lines (most ornate, very sacred)
                  Used in: Hindu/Buddhist mandalas, meditation symbols
                  
cross             Vertical + horizontal mirrors (Latin cross energy)
                  Used in: Religious crosses, plus signs, directional markers
                  
divine             6-fold rotational (hexagon, "perfect" natural number)
                  Used in: Star of David, flowers, sacred geometry
                  
chaos             Minimal symmetry (2-fold rotation, asymmetric accents)
                  Used in: Broken patterns, dynamic unstable feel
                  
nature            Radial 5-fold or irregular (pentagonal, natural/organic)
                  Used in: Starfish, flowers, living things
                  
shadow            Bilateral vertical only (dark/introspective, single mirror line)
                  Used in: Yin-yang, two halves, opposing forces
                  
order              4-fold mirror (rigid, square grid, organizational)
                  Used in: Heraldry, flags, formal designs
                  
celestial        Radial 12-fold (zodiac, constellations)
                  Used in: Astrology, horoscope wheels
```

**Use case:** Thematic alignment with domains (domain → auto-suggest symmetry, but user can override)

---

### Category 6: Asymmetric/Gestalt Options
```
near-vertical     Vertical mirror with 5-10% asymmetric distortion
                  Creates "almost symmetric" sacred symbols (human eye sees symmetry but with life)
                  
flowing           Rotational symmetry with gradient twist (spiral-like, energy direction)
                  
feathered         Radial but with alternating layer sizes (organic growth)
```

**Use case:** Naturalistic sacred symbols, less rigid than perfect symmetry

---

## Proposed UI Grouping

**Dropdown structure (hierarchical):**

```
Symmetry:
├─ None
│  └─ None (asymmetric)
│
├─ Mirror (Bilateral)
│  ├─ Vertical
│  ├─ Horizontal
│  ├─ Both (V + H)
│  ├─ Diagonal
│  └─ Diagonal (Alt)
│
├─ Rotation
│  ├─ 2-Fold (180°)
│  ├─ 3-Fold (120°)
│  ├─ 4-Fold (90°)
│  ├─ 6-Fold (60°)
│  └─ 8-Fold (45°)
│
├─ Radial Complete
│  ├─ 4-Way (Radial)
│  ├─ 6-Way (Radial)
│  ├─ 8-Way (Radial)
│  ├─ 12-Way (Radial)
│  └─ 16-Way (Radial)
│
├─ Hybrid (Mirror + Rotate)
│  ├─ Quad Mirror (4-way mirror)
│  ├─ Hex Mirror (6-fold + 3 mirrors)
│  ├─ Tri Mirror (3-fold + 3 mirrors)
│  └─ Oct Mirror (8-fold + 8 mirrors)
│
└─ Sacred Themes (Auto-Suggest per Domain)
   ├─ Divine → 6-fold (hex)
   ├─ Order → Quad Mirror (4-way)
   ├─ Chaos → Minimal (2-fold)
   ├─ Nature → Radial 5 (pentagonal)
   ├─ Shadow → Vertical only
   ├─ Celestial → 12-way radial
   ├─ Mandala → Full 8-fold + mirrors
   └─ Custom → User choice
```

---

## Implementation Strategy

### Phase 1: Core Symmetries (MVP)
```
- none
- vertical
- horizontal
- both (V+H)
- 4-fold (90° rotation)
- 8-fold (radial 8-way)
- mandala (8-fold + 8 mirrors, preset)
```

**Rationale:** Covers 80% of use cases, easy to render.

### Phase 2: Extended Symmetries
```
Add rotation-only symmetries:
- 2-fold (180°)
- 3-fold (120°)
- 6-fold (60°)
- radial-4, radial-6, radial-12
```

### Phase 3: Hybrid & Domain-Aware
```
- Quad/hex/tri/oct mirror variants
- Domain-based auto-suggest
- Near-vertical, flowing, feathered (gestalt)
```

---

## Design Considerations

### How Symmetry Interacts with Other Controls

1. **symmetry + base_shape interaction**
   - If base_shape = circle: all symmetries work
   - If base_shape = square: 4-fold, 8-fold, quad-mirror best
   - If base_shape = triangle: 3-fold, tri-mirror best
   → **Add compatibility matrix to spec**

2. **symmetry + layer_count interaction**
   - More layers + high fold symmetry = very ornate mandala
   - Fewer layers + minimal symmetry = cleaner sigil
   → **Auto-adjust complexity slider based on symmetry choice**

3. **symmetry + color_preset interaction**
   - Some presets assume symmetry (e.g., yin-yang needs 2-fold)
   - Some assume asymmetry (chaos domain)
   → **Color preset should suggest compatible symmetry**

4. **symmetry + description/name generation**
   - "Cross" symbol when vertical + horizontal
   - "Mandala" when 8-fold + dense layers
   - "Chaotic" when none or 2-fold irregular
   → **Update symbol description based on symmetry**

### Symmetry + Seed Determinism
- **IMPORTANT:** Same seed + same symmetry must yield same symbol
- Different symmetries of same seed = different outputs
- User can "Regenerate" with new symmetry, preserves seed history
- Export should include symmetry choice in metadata

```json
{
  "seed": "s3-Zva2",
  "symmetry": "8-fold",
  "compositionVersion": 1,
  "symmetryRevisionId": "8f-v1-2025-03-10"
}
```

---

## Visual Preview Suggestions

**In the UI, show symmetry VISUALLY:**

Instead of just saying "8-fold", show a small icon:
```
⊕ (8 points)
✻ (6 points, snowflake style)
✦ (4 points, square)
⬅→ (2 sides, vertical mirror)
◇ (4-way mirror + rotation, quad)
```

Or even better: Show a tiny grid of how the symbol will tile/mirror. Example:

```
For "quad mirror" (V+H):
┌────┬────┐
│ A  │ A' │
├────┼────┤
│ A" │ A'" │
└────┴────┘
(user sees 4 copies of the generated quadrant, mirrored)
```

---

## Proposed Acceptance Test Matrix Extension

Add to the existing C1-C24:

```
C33: symmetry=none generates asymmetric symbol
C34: symmetry=vertical preserves left-right mirror
C35: symmetry=both preserves V+H mirrors
C36: symmetry=4-fold rotates at 90° intervals
C37: symmetry=8-fold rotates at 45° intervals, includes 8 mirrors
C38: changing symmetry with locked seed regenerates with new symmetry
C39: symmetry affects revisionId (different symmetry = different revision)
C40: domain-suggested symmetry matches sacred theme (divine → 6-fold)
C41: incompatible symmetry + base_shape shows warning or auto-adjusts
C42: export includes symmetry config in metadata
```

---

## Summary: Symmetry Expansion Strategy

| Scope | Count | Examples |
|-------|-------|----------|
| **Current** | 3 | none, [2 others] |
| **Phase 1 (MVP)** | 7 | none, vert, horiz, both, 4-fold, 8-fold, mandala |
| **Phase 2** | 15 | + 3-fold, 6-fold, 2-fold, radial variants |
| **Phase 3** | 25+ | + hybrid mirrors, gestalt, domain-aware |

**Recommendation:** Start with Phase 1 (7 options), test with users. Phase 2/3 as feedback warrants.

**Most cosmetically impactful:** 8-fold radial (mandala style) and quad-mirror are the "wow" options for sacred symbols.
