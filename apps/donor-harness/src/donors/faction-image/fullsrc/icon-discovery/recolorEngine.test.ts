import { describe, expect, it } from "vitest";
import { IconRecolorEngine } from "./recolorEngine";

describe("IconRecolorEngine", () => {
  it("recolors pure black and preserves non-black", () => {
    const engine = new IconRecolorEngine();
    const input = `<svg xmlns="http://www.w3.org/2000/svg"><g fill="#000"><path d="M0,0h10v10z"/><path fill="#ff0000" d="M0,0h5v5z"/></g></svg>`;
    const result = engine.recolor(input, { targetColor: "#00ff00", brightness: 1, saturation: 1, opacity: 1, scope: "black-only" });
    expect(result.success).toBe(true);
    expect(result.svg.toLowerCase()).toContain("#00ff00");
    expect(result.svg.toLowerCase()).toContain("#ff0000");
  });

  it("detects warning flags", () => {
    const engine = new IconRecolorEngine();
    const input = `<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g"/></defs><path fill="#000" opacity="0.5" d="M0,0h10v10z"/><path fill="#000" opacity="0.4" d="M0,0h10v10z"/><path fill="#000" opacity="0.3" d="M0,0h10v10z"/></svg>`;
    const result = engine.recolor(input, { targetColor: "#00ff00", brightness: 1, saturation: 1, opacity: 1, scope: "black-only" });
    expect(result.warnings).toContain("gradient_detected");
    expect(result.warnings).toContain("heavy_opacity_layering");
  });

  it("recolors simple icon within target budget", () => {
    const engine = new IconRecolorEngine();
    const input = `<svg xmlns="http://www.w3.org/2000/svg">${Array.from({ length: 80 }, (_, i) => `<path fill="#000000" d="M${i},${i}h10v10z"/>`).join("")}</svg>`;
    const start = performance.now();
    const result = engine.recolor(input, { targetColor: "#00ff00", brightness: 1, saturation: 1, opacity: 1, scope: "grayscale" });
    const elapsed = performance.now() - start;
    expect(result.success).toBe(true);
    expect(elapsed).toBeLessThan(50);
  });
});
