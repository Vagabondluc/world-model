/** Centered 128×128 SVG path data for recognizable central symbols. */
export type MainSymbolType =
  | "eye"
  | "hammer"
  | "shield"
  | "mandala"
  | "rune"
  | "beast"
  | "star"
  | "crown"
  | "none";

function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy} A${r},${r} 0 1 0 ${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} Z`;
}

function generateMandalaPath(): string {
  const rings = [44, 30, 16].map((r) => circlePath(64, 64, r)).join(" ");
  const petals = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 8;
    const x = 64 + Math.cos(a) * 30;
    const y = 64 + Math.sin(a) * 30;
    return circlePath(x, y, 7);
  }).join(" ");
  return `${rings} ${petals}`;
}

function generateRunePath(): string {
  return [
    "M64 20 L64 106",
    "M64 20 L92 42",
    "M64 56 L92 74",
    "M64 56 L38 84",
    "M42 30 L86 30",
  ].join(" ");
}

function generateBeastPath(): string {
  return [
    "M32 72 C32 48 46 34 64 34 C82 34 96 48 96 72",
    "L88 96 L76 86 L64 98 L52 86 L40 96 Z",
    "M48 42 L38 24 L56 34",
    "M80 42 L90 24 L72 34",
    "M54 64 A4 4 0 1 0 54 72 A4 4 0 1 0 54 64 Z",
    "M74 64 A4 4 0 1 0 74 72 A4 4 0 1 0 74 64 Z",
  ].join(" ");
}

function generateStarPath(): string {
  return "M64 18 L75 49 L108 49 L82 68 L92 100 L64 82 L36 100 L46 68 L20 49 L53 49 Z";
}

function generateCrownPath(): string {
  return [
    "M24 94 L30 42 L48 64 L64 34 L80 64 L98 42 L104 94 Z",
    "M24 94 L104 94 L104 106 L24 106 Z",
    "M42 74 A4 4 0 1 0 42 82 A4 4 0 1 0 42 74 Z",
    "M64 54 A4 4 0 1 0 64 62 A4 4 0 1 0 64 54 Z",
    "M86 74 A4 4 0 1 0 86 82 A4 4 0 1 0 86 74 Z",
  ].join(" ");
}

export const SYMBOL_PATHS: Record<Exclude<MainSymbolType, "none">, string> = {
  eye:
    // Almond outer + circular iris
    "M64 32 C40 32 20 48 20 64 C20 80 40 96 64 96 C88 96 108 80 108 64 C108 48 88 32 64 32 Z " +
    "M64 46 A18 18 0 1 1 64 82 A18 18 0 1 1 64 46 Z " +
    "M64 54 A10 10 0 1 1 64 74 A10 10 0 1 1 64 54 Z",

  hammer:
    // Block head + straight handle
    "M44 28 L84 28 L84 52 L70 52 L70 100 L58 100 L58 52 L44 52 Z",

  shield:
    // Classic heater shield
    "M64 16 L24 32 L24 64 C24 90 42 106 64 114 C86 106 104 90 104 64 L104 32 Z",
  mandala: generateMandalaPath(),
  rune: generateRunePath(),
  beast: generateBeastPath(),
  star: generateStarPath(),
  crown: generateCrownPath(),
};

export type BackgroundShape = "circle" | "square" | "shield" | "diamond";
