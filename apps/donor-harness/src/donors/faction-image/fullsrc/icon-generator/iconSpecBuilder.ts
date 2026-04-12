import type { IconConfig, IconSpec, Layer, LayerType, Mood, BackgroundShape, Complexity } from "./types";
import { createRNG } from "./rng";
import { SYMBOL_PATHS } from "./symbolPaths";
import { getDomainPalette } from "./domainPalettes";
import { applySymmetryToLayers } from "./symmetry";
import {
  polygonPoints,
  sunRaysPath,
  eyePath,
  crescentPath,
  serpentPath,
  handPath,
  crossPath,
  dotsPositions,
} from "./geometry";

const BASE_SHAPES: LayerType[] = [
  "circle", "triangle", "square", "diamond", "pentagon", "eye", "sun", "moon", "cross",
];

const DETAIL_SHAPES: LayerType[] = [
  "circle", "ring", "triangle", "diamond", "arc", "rays", "dots", "serpent", "hand", "eye",
];

const MOOD_DEFAULTS: Record<Mood, { minLayers: number; maxLayers: number; preferStroke: boolean; sharpBias: number }> = {
  stark:   { minLayers: 1, maxLayers: 3, preferStroke: true, sharpBias: 0.3 },
  ornate:  { minLayers: 4, maxLayers: 8, preferStroke: false, sharpBias: 0.4 },
  warlike: { minLayers: 2, maxLayers: 5, preferStroke: true, sharpBias: 0.9 },
  mystic:  { minLayers: 3, maxLayers: 6, preferStroke: false, sharpBias: 0.1 },
  gentle:  { minLayers: 2, maxLayers: 4, preferStroke: false, sharpBias: 0.0 },
  corrupt: { minLayers: 3, maxLayers: 6, preferStroke: true, sharpBias: 0.7 },
};

/** Complexity multipliers for layer density, stroke weight, and detail */
const COMPLEXITY_CONFIG: Record<Complexity, { layerMul: number; swMul: number; detailScale: number; extraRings: number }> = {
  1: { layerMul: 0.4, swMul: 0.7, detailScale: 0.6, extraRings: 0 },
  2: { layerMul: 0.7, swMul: 0.85, detailScale: 0.8, extraRings: 0 },
  3: { layerMul: 1.0, swMul: 1.0, detailScale: 1.0, extraRings: 1 },
  4: { layerMul: 1.4, swMul: 1.15, detailScale: 1.2, extraRings: 2 },
  5: { layerMul: 1.8, swMul: 1.3, detailScale: 1.4, extraRings: 3 },
};

const SHARP_SHAPES: LayerType[] = ["triangle", "diamond", "rays", "cross"];
const ROUND_SHAPES: LayerType[] = ["circle", "ring", "arc", "dots", "eye", "moon"];

export function buildIconSpec(config: IconConfig): IconSpec {
  const seed = config.seed || Math.random().toString(36).slice(2);
  const rng = createRNG(seed);
  const size = config.size || 128;
  const cx = size / 2;
  const cy = size / 2;
  const mood = config.mood || "stark";
  const moodDef = MOOD_DEFAULTS[mood];
  const symmetry = config.symmetry || "none";
  const complexity: Complexity = config.complexity ?? 3;
  const compCfg = COMPLEXITY_CONFIG[complexity];

  // Resolve colors: domain palette takes priority, then manual colors, then defaults
  let primary: string;
  let secondary: string;
  let accent: string;
  let shadow: string | undefined;
  let highlight: string | undefined;

  if (config.domain) {
    const palette = getDomainPalette(config.domain);
    primary = config.primaryColor || palette.primary;
    secondary = config.secondaryColor || palette.secondary;
    accent = config.accentColor || palette.accent;
    shadow = palette.shadow;
    highlight = palette.highlight;
  } else {
    primary = config.primaryColor || "#1a1a2e";
    secondary = config.secondaryColor || "#16213e";
    accent = config.accentColor || "#e94560";
  }

  // Complexity-adjusted stroke width and layer count
  const baseSW = config.strokeWidth ?? 2;
  const sw = baseSW * compCfg.swMul;
  const rawLayerCount = config.layerCount ?? rng.nextInt(moodDef.minLayers, moodDef.maxLayers);
  const layerCount = Math.max(1, Math.round(rawLayerCount * compCfg.layerMul));

  const layers: Layer[] = [];
  const coreLayerIds = new Set<string>();
  let lid = 0;
  const nextId = () => `l${lid++}`;

  // Background layer
  if (config.backgroundColor) {
    layers.push(buildBackgroundLayer(nextId(), config.backgroundShape || "circle", config.backgroundColor, size));
  }

  // Main symbol layer (if set)
  if (config.mainSymbol && config.mainSymbol !== "none") {
    const symbolPath = SYMBOL_PATHS[config.mainSymbol];
    const symbolScale = size / 128;
    const layer: Layer = {
      id: nextId(),
      type: config.mainSymbol as LayerType,
      d: symbolPath,
      fill: primary,
      stroke: accent,
      strokeWidth: sw,
      opacity: 1,
      transform: symbolScale !== 1 ? `scale(${symbolScale})` : undefined,
    };
    layers.push(layer);
    coreLayerIds.add(layer.id);
  }

  // Base layer
  const baseType = config.baseShape || rng.pick(BASE_SHAPES);
  const baseLayer = makeShapeLayer(nextId(), baseType, cx, cy, size * 0.4, primary, secondary, sw, moodDef.preferStroke);
  layers.push(baseLayer);
  coreLayerIds.add(baseLayer.id);

  // Detail layers (complexity-adjusted count)
  const detailCount = Math.max(0, layerCount - 1);
  for (let i = 0; i < detailCount; i++) {
    const pool = rng.next() < moodDef.sharpBias ? SHARP_SHAPES : ROUND_SHAPES;
    const detailAvail = pool.filter((s) => DETAIL_SHAPES.includes(s));
    const shape = rng.pick(detailAvail.length ? detailAvail : DETAIL_SHAPES);
    const scale = (0.15 + rng.next() * 0.25) * compCfg.detailScale;
    const detailR = size * scale;
    const dcx = cx + (rng.next() - 0.5) * size * 0.3;
    const dcy = cy + (rng.next() - 0.5) * size * 0.3;

    const detailColor = rng.next() > 0.5 ? accent : secondary;
    const strokeC = shadow || primary;
    const layer = makeShapeLayer(
      nextId(), shape, dcx, dcy, detailR,
      detailColor, strokeC, sw * 0.7,
      moodDef.preferStroke,
      0.6 + rng.next() * 0.4
    );

    layers.push(layer);
    coreLayerIds.add(layer.id);
  }

  // Extra ornamental rings at higher complexity
  for (let i = 0; i < compCfg.extraRings; i++) {
    const ringR = size * (0.35 + i * 0.08);
    const ringColor = highlight || accent;
    const layer: Layer = {
      id: nextId(),
      type: "ring",
      cx, cy,
      r: ringR,
      fill: "none",
      stroke: ringColor,
      strokeWidth: sw * (0.5 + i * 0.15),
      opacity: 0.4 + i * 0.1,
    };
    layers.push(layer);
    coreLayerIds.add(layer.id);
  }

  // Text layer
  if (config.includeText && config.textChar) {
    layers.push({
      id: nextId(),
      type: "text",
      text: config.textChar,
      fontSize: size * 0.25,
      cx, cy,
      fill: accent,
      opacity: 0.9,
    });
  }

  const symmetricLayers = applySymmetryToLayers({
    layers,
    symmetryId: symmetry,
    centerX: cx,
    centerY: cy,
    size,
    coreLayerIds,
    nextId,
    accentColor: accent,
    strokeWidth: sw,
  });

  // Build domain description
  const domainLabel = config.domain ? ` (${config.domain})` : "";

  return {
    id: seed,
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size,
    layers: symmetricLayers,
    title: "Sacred Sigil",
    desc: `Generated icon: ${mood} mood, ${baseType} base, ${symmetry} symmetry, complexity ${complexity}${domainLabel}`,
  };
}

function buildBackgroundLayer(id: string, shape: BackgroundShape, color: string, size: number): Layer {
  const cx = size / 2;
  const cy = size / 2;
  const pad = size * 0.03;
  switch (shape) {
    case "circle":
      return { id, type: "circle", fill: color, stroke: "none", strokeWidth: 0, opacity: 1, cx, cy, r: cx - pad };
    case "square":
      return { id, type: "square", fill: color, stroke: "none", strokeWidth: 0, opacity: 1, x: pad, y: pad, width: size - pad * 2, height: size - pad * 2 };
    case "diamond":
      return { id, type: "diamond", fill: color, stroke: "none", strokeWidth: 0, opacity: 1, points: polygonPoints(4, cx - pad, cx, cy) };
    case "shield":
      return { id, type: "shield", fill: color, stroke: "none", strokeWidth: 0, opacity: 1, d: SYMBOL_PATHS.shield };
    default:
      return { id, type: "circle", fill: color, stroke: "none", strokeWidth: 0, opacity: 1, cx, cy, r: cx - pad };
  }
}

function makeShapeLayer(
  id: string,
  type: LayerType,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string,
  strokeColor: string,
  sw: number,
  preferStroke: boolean,
  opacity = 1
): Layer {
  const fill = preferStroke ? "none" : fillColor;
  const stroke = strokeColor;
  const base: Partial<Layer> = { id, type, fill, stroke, strokeWidth: sw, opacity, cx, cy };

  switch (type) {
    case "circle":
      return { ...base, r: radius } as Layer;
    case "ring":
      return { ...base, r: radius, fill: "none", stroke: fillColor } as Layer;
    case "triangle":
      return { ...base, points: polygonPoints(3, radius, cx, cy) } as Layer;
    case "square":
      return { ...base, x: cx - radius, y: cy - radius, width: radius * 2, height: radius * 2 } as Layer;
    case "diamond":
      return { ...base, points: polygonPoints(4, radius, cx, cy) } as Layer;
    case "pentagon":
      return { ...base, points: polygonPoints(5, radius, cx, cy) } as Layer;
    case "eye":
      return { ...base, d: eyePath(cx, cy, radius, radius * 0.5) } as Layer;
    case "sun":
      return { ...base, r: radius * 0.5, d: sunRaysPath(cx, cy, radius * 0.55, radius, 12) } as Layer;
    case "moon":
      return { ...base, d: crescentPath(cx, cy, radius) } as Layer;
    case "serpent":
      return { ...base, d: serpentPath(cx, cy, radius * 2), fill: "none", stroke: fillColor } as Layer;
    case "hand":
      return { ...base, d: handPath(cx, cy, radius * 2) } as Layer;
    case "cross":
      return { ...base, d: crossPath(cx, cy, radius * 2) } as Layer;
    case "arc":
      return {
        ...base,
        d: `M${cx - radius},${cy} A${radius},${radius} 0 0 1 ${cx + radius},${cy}`,
        fill: "none",
        stroke: fillColor,
      } as Layer;
    case "rays":
      return { ...base, d: sunRaysPath(cx, cy, radius * 0.3, radius, 8), fill: "none", stroke: fillColor } as Layer;
    case "dots": {
      const pts = dotsPositions(cx, cy, radius, 6);
      return { ...base, d: pts.map((p) => `M${p.x},${p.y}m-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0`).join(""), fill: fillColor, stroke: "none" } as Layer;
    }
    default:
      return { ...base } as Layer;
  }
}
