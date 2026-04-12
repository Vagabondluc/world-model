import type { ExportPayload, IconSpec } from "./types";
import { buildSymmetryConfig } from "./symmetry";
import { SUPPORTED_SYMMETRY_IDS } from "./symmetryDefinitions";

export function toSVGString(spec: IconSpec): string {
  // We render to a DOM element and serialize
  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.setAttribute("viewBox", spec.viewBox);
  svg.setAttribute("width", String(spec.width));
  svg.setAttribute("height", String(spec.height));
  svg.setAttribute("xmlns", svgNs);

  if (spec.title) {
    const t = document.createElementNS(svgNs, "title");
    t.textContent = spec.title;
    svg.appendChild(t);
  }
  if (spec.desc) {
    const d = document.createElementNS(svgNs, "desc");
    d.textContent = spec.desc;
    svg.appendChild(d);
  }
  const needsBlendFallback = spec.layers.some((layer) => layer.blendMode && layer.blendMode !== "normal");
  if (spec.filters?.length || needsBlendFallback) {
    const defs = document.createElementNS(svgNs, "defs");
    for (const filter of spec.filters) {
      const filterEl = filterToElement(svgNs, filter.id, filter.preset, filter.intensity);
      defs.appendChild(filterEl);
    }
    if (needsBlendFallback) {
      const blendModes = Array.from(new Set(spec.layers.map((layer) => layer.blendMode).filter((m): m is string => !!m && m !== "normal")));
      for (const mode of blendModes) {
        const filter = document.createElementNS(svgNs, "filter");
        filter.setAttribute("id", `blend-fallback-${mode}`);
        const fe = document.createElementNS(svgNs, "feBlend");
        fe.setAttribute("in", "SourceGraphic");
        fe.setAttribute("in2", "BackgroundImage");
        fe.setAttribute("mode", mode);
        filter.appendChild(fe);
        defs.appendChild(filter);
      }
    }
    svg.appendChild(defs);
  }

  for (const layer of spec.layers) {
    const el = layerToElement(svgNs, layer);
    if (el) svg.appendChild(el);
  }

  return new XMLSerializer().serializeToString(svg);
}

function layerToElement(ns: string, layer: any): Element | null {
  const setCommon = (el: Element) => {
    if (layer.fill) el.setAttribute("fill", layer.fill);
    if (layer.stroke) el.setAttribute("stroke", layer.stroke);
    if (layer.strokeWidth) el.setAttribute("stroke-width", String(layer.strokeWidth));
    if (layer.opacity != null && layer.opacity !== 1) el.setAttribute("opacity", String(layer.opacity));
    if (layer.transform) el.setAttribute("transform", layer.transform);
    if (layer.filterId) el.setAttribute("filter", `url(#${layer.filterId})`);
    if (layer.blendMode && layer.blendMode !== "normal") {
      const existing = el.getAttribute("style");
      const cssBlend = `mix-blend-mode:${layer.blendMode};`;
      el.setAttribute("style", existing ? `${existing} ${cssBlend}` : cssBlend);
      if (!layer.filterId) {
        el.setAttribute("filter", `url(#blend-fallback-${layer.blendMode})`);
      }
    }
  };
  let el: Element | null = null;

  if (layer.type === "raw-svg") {
    const g = document.createElementNS(ns, "g");
    const payload = layer.rawSvg || "";
    if (payload) {
      const inner = new DOMParser().parseFromString(`<svg xmlns="${ns}">${payload}</svg>`, "image/svg+xml");
      Array.from(inner.documentElement.childNodes).forEach((node) => {
        g.appendChild(document.importNode(node, true));
      });
    }
    el = g;
    setCommon(el);
    return el;
  }

  switch (layer.type) {
    case "circle":
    case "ring": {
      el = document.createElementNS(ns, "circle");
      el.setAttribute("cx", String(layer.cx ?? 64));
      el.setAttribute("cy", String(layer.cy ?? 64));
      el.setAttribute("r", String(layer.r ?? 32));
      if (layer.type === "ring") {
        el.setAttribute("fill", "none");
      }
      break;
    }
    case "square": {
      el = document.createElementNS(ns, "rect");
      el.setAttribute("x", String(layer.x ?? 32));
      el.setAttribute("y", String(layer.y ?? 32));
      el.setAttribute("width", String(layer.width ?? 64));
      el.setAttribute("height", String(layer.height ?? 64));
      break;
    }
    case "triangle":
    case "diamond":
    case "pentagon": {
      el = document.createElementNS(ns, "polygon");
      el.setAttribute("points", layer.points || "");
      break;
    }
    case "sun": {
      const g = document.createElementNS(ns, "g");
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", String(layer.cx ?? 64));
      c.setAttribute("cy", String(layer.cy ?? 64));
      c.setAttribute("r", String(layer.r ?? 16));
      g.appendChild(c);
      if (layer.d) {
        const p = document.createElementNS(ns, "path");
        p.setAttribute("d", layer.d);
        p.setAttribute("fill", "none");
        if (layer.stroke) p.setAttribute("stroke", layer.stroke);
        if (layer.strokeWidth) p.setAttribute("stroke-width", String(layer.strokeWidth));
        g.appendChild(p);
      }
      el = g;
      break;
    }
    case "text": {
      el = document.createElementNS(ns, "text");
      el.setAttribute("x", String(layer.cx ?? 64));
      el.setAttribute("y", String(layer.cy ?? 64));
      el.setAttribute("text-anchor", "middle");
      el.setAttribute("dominant-baseline", "central");
      el.setAttribute("font-size", String(layer.fontSize ?? 24));
      el.setAttribute("font-family", "serif");
      el.textContent = layer.text || "";
      break;
    }
    default: {
      if (layer.d) {
        el = document.createElementNS(ns, "path");
        el.setAttribute("d", layer.d);
      }
      break;
    }
  }

  if (el) setCommon(el);
  return el;
}

function filterToElement(ns: string, id: string, preset: string, intensity: number): Element {
  const filter = document.createElementNS(ns, "filter");
  filter.setAttribute("id", id);
  const amount = Math.max(0, Math.min(intensity, 1));

  if (preset === "glow") {
    filter.setAttribute("x", "-30%");
    filter.setAttribute("y", "-30%");
    filter.setAttribute("width", "160%");
    filter.setAttribute("height", "160%");
    const blur = document.createElementNS(ns, "feGaussianBlur");
    blur.setAttribute("stdDeviation", String(1 + amount * 3));
    blur.setAttribute("result", "blurred");
    const merge = document.createElementNS(ns, "feMerge");
    const nodeBlur = document.createElementNS(ns, "feMergeNode");
    nodeBlur.setAttribute("in", "blurred");
    const nodeSrc = document.createElementNS(ns, "feMergeNode");
    nodeSrc.setAttribute("in", "SourceGraphic");
    merge.appendChild(nodeBlur);
    merge.appendChild(nodeSrc);
    filter.appendChild(blur);
    filter.appendChild(merge);
    return filter;
  }

  if (preset === "etch") {
    const m = 0.35 + amount * 0.5;
    const matrix = document.createElementNS(ns, "feColorMatrix");
    matrix.setAttribute("type", "matrix");
    matrix.setAttribute("values", `${m} 0 0 0 0 0 ${m} 0 0 0 0 0 ${m} 0 0 0 0 0 1 0`);
    filter.appendChild(matrix);
    return filter;
  }

  const blur = document.createElementNS(ns, "feGaussianBlur");
  blur.setAttribute("stdDeviation", String(0.5 + amount * 1.5));
  filter.appendChild(blur);
  return filter;
}

export function downloadSVG(spec: IconSpec, filename: string): void {
  const svgStr = toSVGString(spec);
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPNG(spec: IconSpec, filename: string): void {
  const svgStr = toSVGString(spec);
  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = spec.width;
    canvas.height = spec.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pngUrl);
    }, "image/png");
  };
  img.src = url;
}

export function downloadSpecJSON(spec: IconSpec, filename: string): void {
  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadExportPayloadJSON(payload: ExportPayload, filename: string): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseExportPayload(input: string): ExportPayload {
  const parsed = JSON.parse(input);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid export payload.");
  }
  if (!parsed.schemaVersion) {
    throw new Error("Missing schemaVersion.");
  }
  if (parsed.schemaVersion !== "1.0.0") {
    throw new Error(`Unsupported schemaVersion: ${parsed.schemaVersion}`);
  }

  if (!parsed.state || typeof parsed.state !== "object") {
    throw new Error("Missing state payload.");
  }

  if (!parsed.state.seedHistory && parsed.state.seed) {
    parsed.state.seedHistory = [{
      revision: 0,
      seed: parsed.state.seed,
      reason: "imported-legacy",
      timestamp: new Date(0).toISOString(),
    }];
    parsed.state.seedRevision = 0;
  }

  if (!Array.isArray(parsed.state.seedHistory)) {
    throw new Error("Missing seedHistory for payload.");
  }

  if (!parsed.state.ownerByChannel) {
    parsed.state.ownerByChannel = {
      primaryColor: "domain",
      secondaryColor: "domain",
      accentColor: "domain",
      backgroundColor: "domain",
    };
  }

  if (!parsed.state.layersSidebar) {
    parsed.state.layersSidebar = {
      schemaRevision: 1,
      layers: [{
        layerId: "legacy-base-1",
        name: "Layer 1",
        content: { type: "blank" },
        visible: true,
        locked: false,
        opacity: 100,
        blendMode: "normal",
        transform: {
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          x: 0,
          y: 0,
          transformOrigin: "center",
        },
        createdAt: new Date(0).toISOString(),
        modifiedAt: new Date(0).toISOString(),
        zIndex: 0,
      }],
      selectedLayerId: null,
      selectedLayerIds: [],
      sidebarOpen: true,
      sidebarWidth: 300,
      sidebarAutoHide: false,
      pendingCommit: false,
      activeGesture: null,
      historyDepth: 0,
    };
  } else {
    const normalizeLayer = (layer: any) => ({
      ...layer,
      content: layer?.content?.type === "asset-symbol"
        ? {
          type: "asset-symbol",
          assetId: layer.content.assetId || "unknown",
          assetPath: layer.content.assetPath || "",
          sourceHash: layer.content.sourceHash || "",
          recolor: {
            targetColor: layer.content.recolor?.targetColor || "#ffffff",
            brightness: layer.content.recolor?.brightness ?? 1,
            saturation: layer.content.recolor?.saturation ?? 1,
            opacity: layer.content.recolor?.opacity ?? 1,
            scope: layer.content.recolor?.scope ?? "grayscale",
          },
          quality: layer.content.quality ?? 0,
          warnings: Array.isArray(layer.content.warnings) ? layer.content.warnings : [],
          previewThumbnail: layer.content.previewThumbnail,
        }
        : layer.content,
      transform: {
        rotation: layer?.transform?.rotation ?? 0,
        scaleX: layer?.transform?.scaleX ?? 1,
        scaleY: layer?.transform?.scaleY ?? 1,
        x: layer?.transform?.x ?? 0,
        y: layer?.transform?.y ?? 0,
        transformOrigin: layer?.transform?.transformOrigin ?? "center",
      },
      children: Array.isArray(layer?.children) ? layer.children.map(normalizeLayer) : undefined,
    });
    parsed.state.layersSidebar.layers = (parsed.state.layersSidebar.layers || []).map(normalizeLayer);
    parsed.state.layersSidebar.schemaRevision = parsed.state.layersSidebar.schemaRevision ?? 1;
    parsed.state.layersSidebar.pendingCommit = false;
    parsed.state.layersSidebar.activeGesture = null;
  }

  if (!parsed.state.symmetry) {
    parsed.state.symmetry = buildSymmetryConfig({
      symmetryId: "none",
      seed: parsed.state.seed || "",
      domain: parsed.faction?.domain,
      generatorVersion: parsed.generatorVersion || "1.0.0",
      selectedBy: "user",
      regenerateReason: null,
    });
  } else {
    const symmetryId = parsed.state.symmetry.symmetryId;
    if (!SUPPORTED_SYMMETRY_IDS.includes(symmetryId)) {
      throw new Error(`Unsupported symmetry: ${symmetryId}`);
    }
  }

  if (!parsed.composition) {
    parsed.composition = null;
  }

  return parsed as ExportPayload;
}

export function toReactComponentSnippet(spec: IconSpec, componentName: string): string {
  const svgStr = toSVGString(spec);
  return `export function ${componentName}(props: React.SVGProps<SVGSVGElement>) {
  return (
    ${svgStr.replace("<svg ", "<svg {...props} ")}
  );
}`;
}
