import type { IconRecolorWarning, RecolorConfig, RecolorResult } from "./types";

const PURE_BLACK = new Set(["#000", "#000000", "rgb(0,0,0)", "rgb(0, 0, 0)"]);

function normalizeColor(value: string): string {
  return value.trim().toLowerCase();
}

function isPureBlack(value: string | null): boolean {
  if (!value) return false;
  return PURE_BLACK.has(normalizeColor(value));
}

function parseColor(value: string | null): { r: number; g: number; b: number } | null {
  if (!value) return null;
  const v = normalizeColor(value);
  if (v.startsWith("#")) {
    if (v.length === 4) {
      const r = parseInt(v[1] + v[1], 16);
      const g = parseInt(v[2] + v[2], 16);
      const b = parseInt(v[3] + v[3], 16);
      return { r, g, b };
    }
    if (v.length === 7) {
      const r = parseInt(v.slice(1, 3), 16);
      const g = parseInt(v.slice(3, 5), 16);
      const b = parseInt(v.slice(5, 7), 16);
      return { r, g, b };
    }
  }
  const rgbMatch = v.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) };
  }
  return null;
}

function isGrayscaleLike(value: string | null): boolean {
  const rgb = parseColor(value);
  if (!rgb) return false;
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const spread = max - min;
  const avg = (rgb.r + rgb.g + rgb.b) / 3;
  return spread <= 20 && avg <= 190;
}

function shouldRecolorValue(value: string | null, scope: "black-only" | "grayscale"): boolean {
  if (!value) return false;
  const normalized = normalizeColor(value);
  if (normalized === "none" || normalized === "transparent" || normalized.startsWith("url(")) return false;
  if (scope === "black-only") return isPureBlack(value);
  return isPureBlack(value) || isGrayscaleLike(value);
}

function warningScore(warnings: IconRecolorWarning[]): number {
  let quality = 5;
  for (const warning of warnings) {
    if (warning === "gradient_detected") quality -= 2;
    if (warning === "pattern_detected") quality -= 2;
    if (warning === "heavy_opacity_layering") quality -= 1;
    if (warning === "high_complexity") quality -= 1;
    if (warning === "parse_error") quality = 0;
  }
  return Math.max(0, Math.min(5, quality));
}

function applyPostEffects(svg: SVGSVGElement, config: RecolorConfig) {
  const safeOpacity = Math.max(0, Math.min(1, config.opacity));
  if (safeOpacity !== 1) {
    svg.setAttribute("opacity", String(safeOpacity));
  }
  if (config.brightness !== 1 || config.saturation !== 1) {
    const filters = [
      `brightness(${Math.max(0.2, Math.min(2, config.brightness)).toFixed(3)})`,
      `saturate(${Math.max(0.2, Math.min(2, config.saturation)).toFixed(3)})`,
    ];
    const style = svg.getAttribute("style") || "";
    svg.setAttribute("style", `${style} filter:${filters.join(" ")};`);
  }
}

export class IconRecolorEngine {
  recolor(rawSvg: string, config: RecolorConfig): RecolorResult {
    try {
      const dom = new DOMParser().parseFromString(rawSvg, "image/svg+xml");
      const svg = dom.documentElement as SVGSVGElement;
      const warnings: IconRecolorWarning[] = [];

      if (dom.querySelector("linearGradient, radialGradient")) warnings.push("gradient_detected");
      if (dom.querySelector("pattern")) warnings.push("pattern_detected");
      const opacityEls = Array.from(dom.querySelectorAll("[opacity]")).filter((el) => Number(el.getAttribute("opacity") || "1") < 1);
      if (opacityEls.length > 2) warnings.push("heavy_opacity_layering");
      if (dom.querySelectorAll("*").length > 1000) warnings.push("high_complexity");

      const target = config.targetColor;
      const recolorAttrs = (el: Element) => {
        const fill = el.getAttribute("fill");
        const stroke = el.getAttribute("stroke");
        if (shouldRecolorValue(fill, config.scope)) el.setAttribute("fill", target);
        if (shouldRecolorValue(stroke, config.scope)) el.setAttribute("stroke", target);
      };

      // Recolor explicit black attributes.
      dom.querySelectorAll("*").forEach(recolorAttrs);

      // Recolor group-level inherited black fills/strokes.
      dom.querySelectorAll("g[fill], g[stroke]").forEach((group) => {
        const inheritedFill = group.getAttribute("fill");
        const inheritedStroke = group.getAttribute("stroke");
        if (shouldRecolorValue(inheritedFill, config.scope)) {
          group.setAttribute("fill", target);
          group.querySelectorAll(":scope > *:not([fill])").forEach((child) => {
            if (!child.getAttribute("fill")) child.setAttribute("fill", target);
          });
        }
        if (shouldRecolorValue(inheritedStroke, config.scope)) {
          group.setAttribute("stroke", target);
          group.querySelectorAll(":scope > *:not([stroke])").forEach((child) => {
            if (!child.getAttribute("stroke")) child.setAttribute("stroke", target);
          });
        }
      });

      applyPostEffects(svg, config);
      const serialized = new XMLSerializer().serializeToString(dom);
      return {
        success: true,
        svg: serialized,
        warnings,
        quality: warningScore(warnings),
      };
    } catch {
      return {
        success: false,
        svg: "",
        warnings: ["parse_error"],
        quality: 0,
      };
    }
  }
}
