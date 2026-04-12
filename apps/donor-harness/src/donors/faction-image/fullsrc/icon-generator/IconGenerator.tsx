import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type {
  BlendMode,
  ColorChannel,
  ColorPresetKey,
  CompositionConfig,
  CompositionMode,
  ExportPayload,
  FilterDef,
  FilterPreset,
  IconConfig,
  IconSpec,
  Layer,
  MainSymbolType,
  SeedHistoryEntry,
  LayerItem,
  LayersStateExport,
  DebugHookSettings,
  UiPreferences,
} from "./types";
import { buildIconSpec } from "./iconSpecBuilder";
import { SVGRuntimeRenderer } from "./SVGRuntimeRenderer";
import { ConfigForm } from "./ConfigForm";
import { SymbolPicker } from "./SymbolPicker";
import { toSVGString, downloadExportPayloadJSON, downloadPNG, downloadSVG, toReactComponentSnippet } from "./exportUtils";
import { SYMBOL_PATHS } from "./symbolPaths";
import { getDomainPalette, type FactionDomain } from "./domainPalettes";
import { applyColorAction, DEFAULT_OWNER_BY_CHANNEL, PRESET_PALETTES, domainPaletteToColorPalette } from "./colorReducer";
import { nextSeedState } from "./seedManager";
import { buildCompositionConfig, compositionRevisionId } from "./composition";
import { ONBOARDING_STEPS } from "./onboardingScript";
import { buildSymmetryConfig } from "./symmetry";
import { createInitialLayersState, layersReducer, layersToRenderableFlat } from "./layersReducer";
import { LayersSidebar } from "./LayersSidebar";
import { DEFAULT_DEBUG_HOOK_SETTINGS } from "./layersFeatureFlags";
import { KEYBOARD_SHORTCUTS, isTypingTarget, keyMatches } from "./keyboardShortcuts";
import { loadUiPreferences, persistDebugHooks, persistScaleLinked, persistSidebarSectionCollapsed } from "./uiPreferences";
import { IconRecolorEngine } from "@/icon-discovery/recolorEngine";
import { LocalIconAssetProvider } from "@/icon-discovery/providers";
import { IconDiscoveryPanel } from "@/icon-discovery/IconDiscoveryPanel";
import { useDiscovery } from "@/icon-discovery/DiscoveryContext";
import { RecolorQueue } from "@/icon-discovery/recolorQueue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

function buildVariantSpecs(config: IconConfig, count: number, rootSeed: string): IconSpec[] {
  return Array.from({ length: count }, (_, i) => buildIconSpec({ ...config, seed: `${rootSeed}-v${i + 1}` }));
}

type SymbolOverlayType = Exclude<MainSymbolType, "none">;

const SYMBOL_OVERLAYS: SymbolOverlayType[] = ["eye", "hammer", "shield", "mandala", "rune", "beast", "star", "crown"];
const PHASE1_LAYER_BLEND_MODES: BlendMode[] = ["normal", "multiply", "screen", "overlay", "lighten", "darken"];
const PHASE2_ADV_LAYER_BLEND_MODES: BlendMode[] = ["color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"];

function originPoint(
  origin: LayerItem["transform"]["transformOrigin"],
  width: number,
  height: number,
): { x: number; y: number } {
  const mapX = origin.includes("left") ? 0 : origin.includes("right") ? width : width / 2;
  const mapY = origin.includes("top") ? 0 : origin.includes("bottom") ? height : height / 2;
  return { x: mapX, y: mapY };
}

function findLayerById(layers: LayerItem[], layerId: string | null): LayerItem | null {
  if (!layerId) return null;
  for (const layer of layers) {
    if (layer.layerId === layerId) return layer;
    if (layer.children?.length) {
      const child = findLayerById(layer.children, layerId);
      if (child) return child;
    }
  }
  return null;
}

function flattenLayerIds(layers: LayerItem[]): string[] {
  const out: string[] = [];
  const walk = (items: LayerItem[]) => {
    for (const layer of items) {
      out.push(layer.layerId);
      if (layer.children?.length) walk(layer.children);
    }
  };
  walk(layers);
  return out;
}

function makeCompositionLayers(size: number, blendMode: BlendMode, intensity: number, withRings: boolean, withHalo: boolean, withDust: boolean): Layer[] {
  const cx = size / 2;
  const cy = size / 2;
  const layers: Layer[] = [];
  if (withRings) {
    layers.push({
      id: `comp-rings-${size}`,
      type: "ring",
      cx,
      cy,
      r: size * 0.46,
      fill: "none",
      stroke: "#ffffff",
      strokeWidth: 0.8 + intensity * 1.4,
      opacity: 0.12 + intensity * 0.24,
      blendMode,
    });
  }
  if (withHalo) {
    layers.push({
      id: `comp-halo-${size}`,
      type: "circle",
      cx,
      cy,
      r: size * 0.42,
      fill: "#ffffff",
      stroke: "none",
      opacity: 0.04 + intensity * 0.12,
      blendMode: blendMode === "normal" ? "screen" : blendMode,
    });
  }
  if (withDust) {
    const dustPath = Array.from({ length: 12 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 12;
      const r = size * (0.3 + (i % 3) * 0.07);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const dotR = 0.8 + (i % 4) * 0.5;
      return `M${x},${y}m-${dotR},0a${dotR},${dotR} 0 1,0 ${dotR * 2},0a${dotR},${dotR} 0 1,0 -${dotR * 2},0`;
    }).join("");
    layers.push({
      id: `comp-dust-${size}`,
      type: "dots",
      d: dustPath,
      fill: "#ffffff",
      stroke: "none",
      opacity: 0.2 + intensity * 0.3,
      blendMode,
    });
  }
  return layers;
}

function applyComposition(spec: IconSpec, blendMode: BlendMode, filterPreset: FilterPreset, filterIntensity: number, withRings: boolean, withHalo: boolean, withDust: boolean): IconSpec {
  const filterId = filterPreset === "none" ? undefined : "fx-main";
  const filters: FilterDef[] | undefined = filterPreset === "none"
    ? undefined
    : [{ id: "fx-main", preset: filterPreset, intensity: filterIntensity }];
  const baseLayers = spec.layers.map((layer) => ({ ...layer, blendMode, filterId }));
  const compLayers = makeCompositionLayers(spec.width, blendMode, filterIntensity, withRings, withHalo, withDust).map((layer) => ({ ...layer, filterId }));
  return { ...spec, layers: [...baseLayers, ...compLayers], filters };
}

function applyOverlayLayers(
  spec: IconSpec,
  layersStateLayers: LayerItem[],
  assetSvgByLayerId: Record<string, { svg: string; quality: number; warnings: string[]; error?: string }>,
): IconSpec {
  const baseScale = spec.width / 128;
  const toTransform = (layer: LayerItem) => {
    const tx = layer.transform.x;
    const ty = layer.transform.y;
    const rot = layer.transform.rotation;
    const sx = layer.transform.scaleX;
    const sy = layer.transform.scaleY;
    const { x: ox, y: oy } = originPoint(layer.transform.transformOrigin, spec.width, spec.height);
    // Deterministic order: translate -> rotate -> scale.
    const contentAny: any = (layer.content as any) || {};
    const scaleVal = contentAny.scale ?? 1;
    return `translate(${tx} ${ty}) translate(${ox} ${oy}) rotate(${rot}) scale(${baseScale * scaleVal * sx} ${baseScale * scaleVal * sy}) translate(${-64} ${-64})`;
  };
  const renderable = layersToRenderableFlat(layersStateLayers).filter((layer) => layer.visible);
  const symbolOverlays: Layer[] = renderable
    .filter((layer) => layer.content.type === "symbol")
    .map((layer) => {
      const content: any = layer.content;
      return {
        id: `overlay-${layer.layerId}`,
        type: content.symbol,
        d: SYMBOL_PATHS[content.symbol as keyof typeof SYMBOL_PATHS],
        fill: content.color,
        stroke: "none",
        opacity: layer.opacity / 100,
        blendMode: layer.blendMode,
        transform: toTransform(layer),
      } as Layer;
    });
  const assetOverlays: Layer[] = renderable
    .filter((layer) => layer.content.type === "asset-symbol")
    .map((layer) => {
      const content: any = layer.content;
      const rendered = assetSvgByLayerId[layer.layerId];
      const fallbackSvg = `<g><circle cx="64" cy="64" r="28" fill="none" stroke="#ff4d4f" stroke-width="6"/><path d="M48 48L80 80M80 48L48 80" stroke="#ff4d4f" stroke-width="6" fill="none"/></g>`;
      // Attempt to use assetPath/recolor when available
      try {
        if (content?.assetPath && (assetSvgByLayerId[layer.layerId] == null)) {
          // noop here; asset rendering happens elsewhere
        }
      } catch (_) {
        // ignore
      }
      return {
        id: `overlay-asset-${layer.layerId}`,
        type: "raw-svg",
        rawSvg: rendered?.svg ? stripSvgWrapper(rendered.svg) : fallbackSvg,
        fill: "none",
        stroke: "none",
        opacity: layer.opacity / 100,
        blendMode: layer.blendMode,
        transform: toTransform(layer),
      } as Layer;
    });
  return { ...spec, layers: [...spec.layers, ...symbolOverlays, ...assetOverlays] };
}

function stripSvgWrapper(rawSvg: string): string {
  const doc = new DOMParser().parseFromString(rawSvg, "image/svg+xml");
  return doc.documentElement.innerHTML;
}

export function IconGenerator() {
  const LAYERS_STORAGE_KEY = "faction-image.layers-sidebar.v1";
  const ONBOARD_PANEL_WIDTH = 420;
  const ONBOARD_PANEL_HEIGHT = 240;
  const ONBOARD_MARGIN = 16;
  const [factionName] = useState("Faction");
  const initialUiPrefsRef = useRef<UiPreferences | null>(null);
  if (!initialUiPrefsRef.current) initialUiPrefsRef.current = loadUiPreferences();
  const [config, setConfig] = useState<IconConfig>({
    mood: "mystic",
    symmetry: "radial-8",
    layerCount: 4,
    primaryColor: "#1a1a2e",
    secondaryColor: "#16213e",
    accentColor: "#e94560",
    backgroundColor: "#0f3460",
    ownerByChannel: { ...DEFAULT_OWNER_BY_CHANNEL },
    colorPresetKey: "domain",
  });
  const [seedHistory, setSeedHistory] = useState<SeedHistoryEntry[]>([]);
  const [seedLocked, setSeedLocked] = useState(false);
  const [variants, setVariants] = useState<IconSpec[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [variantCount, setVariantCount] = useState(6);

  const [blendMode, setBlendMode] = useState<BlendMode>("normal");
  const [filterPreset, setFilterPreset] = useState<FilterPreset>("none");
  const [filterIntensity, setFilterIntensity] = useState(0.5);
  const [composeRings, setComposeRings] = useState(true);
  const [composeHalo, setComposeHalo] = useState(false);
  const [composeDust, setComposeDust] = useState(false);
  const [sectionCollapsed, setSectionCollapsed] = useState({
    generate: initialUiPrefsRef.current.sidebarSections.generate,
    style: initialUiPrefsRef.current.sidebarSections.style,
    properties: initialUiPrefsRef.current.sidebarSections.properties,
    transform: initialUiPrefsRef.current.sidebarSections.transform,
    batchOps: initialUiPrefsRef.current.sidebarSections.batchOps,
    templates: initialUiPrefsRef.current.sidebarSections.templates,
  });
  const [scaleLinked, setScaleLinked] = useState(initialUiPrefsRef.current.scaleLinked);
  const [debugSettingsOpen, setDebugSettingsOpen] = useState(false);
  const [debugHooks, setDebugHooks] = useState<DebugHookSettings>(initialUiPrefsRef.current.debugHooks);
  const [copiedSvgPulse, setCopiedSvgPulse] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [variantScrollState, setVariantScrollState] = useState({ canLeft: false, canRight: false });

  const [layersState, layersDispatch] = useReducer(layersReducer, undefined, createInitialLayersState);
  const [newOverlaySymbol, setNewOverlaySymbol] = useState<SymbolOverlayType>("star");
  const [newOverlayColor, setNewOverlayColor] = useState("#ffffff");
  const [newOverlayOpacity, setNewOverlayOpacity] = useState(1);
  const [newOverlayScale, setNewOverlayScale] = useState(1);
  const [newOverlayBlend, setNewOverlayBlend] = useState<BlendMode>("normal");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const variantGridRef = useRef<HTMLDivElement | null>(null);
  const [assetRenderByLayerId, setAssetRenderByLayerId] = useState<Record<string, { svg: string; quality: number; warnings: string[]; signature: string; error?: string }>>({});
  const assetProviderRef = useRef(new LocalIconAssetProvider());
  const recolorEngineRef = useRef(new IconRecolorEngine());
  const recolorQueueRef = useRef(new RecolorQueue(5));
  const { state: discoveryState, setDomain: setDiscoveryDomain } = useDiscovery();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [gizmoDrag, setGizmoDrag] = useState<null | {
    mode: "move" | "rotate" | "scale";
    layerId: string;
    startX: number;
    startY: number;
    startRotation: number;
    startScaleX: number;
    startScaleY: number;
    startPosX: number;
    startPosY: number;
    startDist: number;
    centerX: number;
    centerY: number;
    gestureId: string;
  }>(null);
  const [onboardingPanelPos, setOnboardingPanelPos] = useState<{ top: number; left: number }>({
    top: ONBOARD_MARGIN,
    left: ONBOARD_MARGIN,
  });
  const highlightedRef = useRef<HTMLElement | null>(null);
  const normalizeLayer = (layer: LayerItem): LayerItem => ({
    ...layer,
    content: layer.content.type === "asset-symbol"
      ? {
        ...layer.content,
        recolor: {
          targetColor: layer.content.recolor?.targetColor ?? "#ffffff",
          brightness: layer.content.recolor?.brightness ?? 1,
          saturation: layer.content.recolor?.saturation ?? 1,
          opacity: layer.content.recolor?.opacity ?? 1,
          scope: layer.content.recolor?.scope ?? "grayscale",
        },
        quality: layer.content.quality ?? 0,
        warnings: layer.content.warnings ?? [],
      }
      : layer.content,
    transform: {
      rotation: layer.transform?.rotation ?? 0,
      scaleX: layer.transform?.scaleX ?? 1,
      scaleY: layer.transform?.scaleY ?? 1,
      x: layer.transform?.x ?? 0,
      y: layer.transform?.y ?? 0,
      transformOrigin: layer.transform?.transformOrigin ?? "center",
    },
    children: layer.children?.map(normalizeLayer),
  });
  const toLayersExport = (): LayersStateExport => ({
    schemaRevision: 1,
    layers: layersState.layers,
    selectedLayerId: layersState.selectedLayerId,
    selectedLayerIds: layersState.selectedLayerIds,
    sidebarOpen: layersState.sidebarOpen,
    sidebarWidth: layersState.sidebarWidth,
    sidebarAutoHide: layersState.sidebarAutoHide,
    pendingCommit: false,
    activeGesture: null,
    historyDepth: layersState.undoStack.length,
  });

  const computeOnboardingPanelPos = (target: HTMLElement | null) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const fallback = {
      top: ONBOARD_MARGIN,
      left: Math.max(ONBOARD_MARGIN, viewportWidth - ONBOARD_PANEL_WIDTH - ONBOARD_MARGIN),
    };
    if (!target) return fallback;

    const rect = target.getBoundingClientRect();
    const canPlaceRight = rect.right + ONBOARD_PANEL_WIDTH + ONBOARD_MARGIN <= viewportWidth;
    const canPlaceLeft = rect.left - ONBOARD_PANEL_WIDTH - ONBOARD_MARGIN >= 0;
    let left = fallback.left;
    if (canPlaceRight) {
      left = rect.right + ONBOARD_MARGIN;
    } else if (canPlaceLeft) {
      left = rect.left - ONBOARD_PANEL_WIDTH - ONBOARD_MARGIN;
    } else {
      left = Math.min(
        viewportWidth - ONBOARD_PANEL_WIDTH - ONBOARD_MARGIN,
        Math.max(ONBOARD_MARGIN, rect.left),
      );
    }

    const canPlaceAbove = rect.top - ONBOARD_PANEL_HEIGHT - ONBOARD_MARGIN >= 0;
    const canPlaceBelow = rect.bottom + ONBOARD_PANEL_HEIGHT + ONBOARD_MARGIN <= viewportHeight;
    let top = ONBOARD_MARGIN;
    if (canPlaceAbove) {
      top = rect.top - ONBOARD_PANEL_HEIGHT - ONBOARD_MARGIN;
    } else if (canPlaceBelow) {
      top = rect.bottom + ONBOARD_MARGIN;
    } else {
      top = Math.min(
        viewportHeight - ONBOARD_PANEL_HEIGHT - ONBOARD_MARGIN,
        Math.max(ONBOARD_MARGIN, rect.top),
      );
    }
    return { top, left };
  };

  const selectedSpecRaw = variants.find((v) => v.id === selectedVariantId) || variants[0] || null;
  const selectedSpecComposed = selectedSpecRaw
    ? applyComposition(selectedSpecRaw, blendMode, filterPreset, filterIntensity, composeRings, composeHalo, composeDust)
    : null;
  const selectedSpec = selectedSpecComposed ? applyOverlayLayers(selectedSpecComposed, layersState.layers, assetRenderByLayerId) : null;
  const selectedVariantIndex = selectedSpecRaw ? variants.findIndex((v) => v.id === selectedSpecRaw.id) : 0;
  const renderableLayers = layersToRenderableFlat(layersState.layers);
  const symbolLayers = renderableLayers.filter((layer) => layer.content.type === "symbol");
  const selectedLayer = findLayerById(layersState.layers, layersState.selectedLayerId);
  const selectedLayerOrigin = selectedLayer ? originPoint(selectedLayer.transform.transformOrigin, 128, 128) : { x: 64, y: 64 };

  const startGizmoDrag = (mode: "move" | "rotate" | "scale", event: React.MouseEvent) => {
    if (!selectedLayer || selectedLayer.locked || !selectedSpec || !previewRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = previewRef.current.getBoundingClientRect();
    const centerX = rect.left + ((selectedLayerOrigin.x + selectedLayer.transform.x) / selectedSpec.width) * rect.width;
    const centerY = rect.top + ((selectedLayerOrigin.y + selectedLayer.transform.y) / selectedSpec.height) * rect.height;
    const startDist = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    const gestureId = `gizmo-${mode}-${selectedLayer.layerId}-${Date.now()}`;
    layersDispatch({ type: "begin-gesture", kind: mode === "move" ? "position" : mode === "rotate" ? "rotation" : "scale", gestureId });
    setGizmoDrag({
      mode,
      layerId: selectedLayer.layerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotation: selectedLayer.transform.rotation,
      startScaleX: selectedLayer.transform.scaleX,
      startScaleY: selectedLayer.transform.scaleY,
      startPosX: selectedLayer.transform.x,
      startPosY: selectedLayer.transform.y,
      startDist,
      centerX,
      centerY,
      gestureId,
    });
  };

  const compositionConfig: CompositionConfig = useMemo(() => {
    const mode: CompositionMode = "overlay-center";
    const normalized = {
      mode,
      blendMode,
      filterPreset,
      filterIntensity,
      composeRings,
      composeHalo,
      composeDust,
      layers: layersState.layers,
    };
    return buildCompositionConfig({ mode, normalizedInput: normalized });
  }, [blendMode, composeDust, composeHalo, composeRings, filterIntensity, filterPreset, layersState.layers]);
  const selectedVariantIndexRef = useRef(0);
  const variantWindowStart = Math.max(0, selectedVariantIndex + 1);
  const variantWindowEnd = Math.min(variants.length, variantWindowStart + 5);
  const updateVariantScrollState = () => {
    const el = variantGridRef.current;
    if (!el) {
      setVariantScrollState({ canLeft: false, canRight: false });
      return;
    }
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const canLeft = el.scrollLeft > 2;
    const canRight = el.scrollLeft < maxLeft - 2;
    setVariantScrollState({ canLeft, canRight });
  };
  const scrollVariantGrid = (direction: "left" | "right") => {
    if (!variantGridRef.current) return;
    const page = Math.max(120, Math.floor(variantGridRef.current.clientWidth * 0.9));
    variantGridRef.current.scrollBy({ left: direction === "left" ? -page : page, behavior: "smooth" });
  };

  const regenerateWithSeed = (nextConfig: IconConfig, seed: string) => {
    const withSeed = { ...nextConfig, seed };
    setConfig(withSeed);
    const nextVariants = buildVariantSpecs(withSeed, variantCount, seed);
    setVariants(nextVariants);
    setSelectedVariantId(nextVariants[0]?.id || null);
  };

  const handleGenerateAction = (action: "generate" | "regenerate-same" | "randomize") => {
    const next = nextSeedState({
      currentSeed: config.seed,
      hasGenerated: variants.length > 0,
      locked: seedLocked,
      action,
      seedHistory,
    });
    setSeedHistory(next.history);
    regenerateWithSeed(config, next.seed);
  };

  const handleGenerate = () => handleGenerateAction("generate");
  const handleRegenerateSame = () => handleGenerateAction("regenerate-same");
  const handleRandomize = () => handleGenerateAction("randomize");

  const handleDomainChange = (domain?: FactionDomain) => {
    const nextDomain = domain;
    const palette = nextDomain ? domainPaletteToColorPalette(getDomainPalette(nextDomain)) : PRESET_PALETTES.default;
    const nextBaseConfig: IconConfig = nextDomain ? { ...config, domain: nextDomain } : (() => {
      const { domain: _domain, ...rest } = config;
      return rest;
    })();
    const nextConfig = applyColorAction(nextBaseConfig, { type: "select-domain", palette });
    setConfig(nextConfig);

    if (variants.length) {
      const seed = config.seed || (seedHistory[seedHistory.length - 1]?.seed ?? "");
      if (seed) {
        regenerateWithSeed(nextConfig, seed);
      }
    }
  };

  const handleApplyPreset = (preset: ColorPresetKey, applyToAll: boolean) => {
    if (preset === "domain") {
      const palette = domainPaletteToColorPalette(getDomainPalette(config.domain || "shadow"));
      setConfig(applyColorAction(config, { type: "reset-domain", palette }));
      return;
    }
    setConfig(applyColorAction(config, {
      type: "select-preset",
      preset,
      applyToAll,
      palette: PRESET_PALETTES[preset],
    }));
  };

  const handleManualColorChange = (channel: ColorChannel, value: string) => {
    setConfig(applyColorAction(config, { type: "manual-edit", channel, value }));
  };

  const handleResetDomainColors = () => {
    const palette = domainPaletteToColorPalette(getDomainPalette(config.domain || "shadow"));
    setConfig(applyColorAction(config, { type: "reset-domain", palette }));
  };

  const handleResetPresetColors = () => {
    const preset = config.colorPresetKey && config.colorPresetKey !== "domain" ? config.colorPresetKey : "default";
    setConfig(applyColorAction(config, { type: "reset-preset", preset, palette: PRESET_PALETTES[preset] }));
  };

  const handleSectionCollapsedChange = (
    section: "generate" | "style" | "properties" | "transform" | "batchOps" | "templates",
    collapsed: boolean,
  ) => {
    setSectionCollapsed((prev) => ({ ...prev, [section]: collapsed }));
    persistSidebarSectionCollapsed(section, collapsed);
  };

  const handleCopySVG = async () => {
    if (!selectedSpec) return;
    await navigator.clipboard.writeText(toSVGString(selectedSpec));
    setCopiedSvgPulse(true);
    window.setTimeout(() => setCopiedSvgPulse(false), 220);
    toast({ title: "Copied!", description: "SVG code copied to clipboard." });
  };

  const handleDownloadSVG = () => {
    if (!selectedSpec) return;
    downloadSVG(selectedSpec, `icon-${selectedSpec.id}.svg`);
    toast({ title: "Downloaded!", description: `icon-${selectedSpec.id}.svg saved.` });
  };

  const handleCopyReact = async () => {
    if (!selectedSpec) return;
    await navigator.clipboard.writeText(toReactComponentSnippet(selectedSpec, "ReligiousIcon"));
    toast({ title: "Copied!", description: "React component copied to clipboard." });
  };

  const handleDownloadPNG = () => {
    if (!selectedSpec) return;
    downloadPNG(selectedSpec, `icon-${selectedSpec.id}.png`);
    toast({ title: "Downloaded!", description: `icon-${selectedSpec.id}.png saved.` });
  };

  const handleDownloadJSON = () => {
    if (!selectedSpec) return;
    const payload: ExportPayload = {
      schemaVersion: "1.0.0",
      generatorVersion: "1.0.0",
      faction: {
        id: compositionRevisionId(`${factionName}:${config.domain || "none"}`),
        name: factionName,
        domain: config.domain,
      },
      state: {
        seed: config.seed || "",
        seedRevision: seedHistory.length ? seedHistory[seedHistory.length - 1].revision : 0,
        seedHistory,
        symmetry: buildSymmetryConfig({
          symmetryId: config.symmetry || "none",
          seed: config.seed || "",
          domain: config.domain,
          generatorVersion: "1.0.0",
          selectedBy: "user",
          regenerateReason: null,
        }),
        ownerByChannel: config.ownerByChannel || { ...DEFAULT_OWNER_BY_CHANNEL },
        colorPresetKey: config.colorPresetKey || "domain",
        layersSidebar: toLayersExport(),
        iconDiscovery: {
          query: discoveryState.query,
          selectedAssetId: discoveryState.selected?.id || null,
          recolor: discoveryState.recolor,
        },
      },
      selection: {
        variantIndex: Math.max(0, selectedVariantIndex),
        style: selectedSpecRaw?.layers.find((l) => l.type !== "ring" && l.type !== "circle")?.type,
      },
      composition: { ...compositionConfig, layers: layersState.layers },
      artifacts: {
        svg: toSVGString(selectedSpec),
        png: null,
      },
    };
    downloadExportPayloadJSON(payload, `icon-${selectedSpec.id}.json`);
    toast({ title: "Downloaded!", description: `icon-${selectedSpec.id}.json saved.` });
  };

  const handleAddOverlay = () => {
    layersDispatch({
      type: "add-symbol-layer",
      symbol: newOverlaySymbol,
      color: newOverlayColor,
      opacity: newOverlayOpacity,
      scale: newOverlayScale,
      blendMode: newOverlayBlend,
    });
  };
  const handleAddDiscoveryLayer = (payload: {
    assetId: string;
    assetPath: string;
    sourceHash: string;
    recolor: { targetColor: string; brightness: number; saturation: number; opacity: number; scope: "black-only" | "grayscale" };
    quality: number;
    warnings: string[];
  }) => {
    layersDispatch({
      type: "add-asset-layer",
      assetId: payload.assetId,
      assetPath: payload.assetPath,
      sourceHash: payload.sourceHash,
      recolor: payload.recolor,
      quality: payload.quality,
      warnings: payload.warnings,
    });
  };
  const handleUndo = () => layersDispatch({ type: "undo" });
  const handleRedo = () => layersDispatch({ type: "redo" });
  const handleResetOverlays = () => {
    const ids = layersToRenderableFlat(layersState.layers)
      .filter((layer) => layer.content.type === "symbol")
      .map((layer) => layer.layerId);
    for (const id of ids) {
      layersDispatch({ type: "delete-layer", layerId: id });
    }
  };

  const handleCopyTransform = async (layerId: string) => {
    const layer = findLayerById(layersState.layers, layerId);
    if (!layer) return;
    const payload = {
      rotation: layer.transform.rotation,
      scaleX: layer.transform.scaleX,
      scaleY: layer.transform.scaleY,
      x: layer.transform.x,
      y: layer.transform.y,
      transformOrigin: layer.transform.transformOrigin,
      opacity: layer.opacity,
      blendMode: layer.blendMode,
    };
    await navigator.clipboard.writeText(JSON.stringify(payload));
    toast({ title: "Copied", description: `Transform copied from ${layer.name}.` });
  };

  const handlePasteTransform = async (layerId: string) => {
    const layer = findLayerById(layersState.layers, layerId);
    if (!layer || layer.locked) return;
    try {
      const raw = await navigator.clipboard.readText();
      const parsed = JSON.parse(raw) as {
        rotation?: number;
        scaleX?: number;
        scaleY?: number;
        x?: number;
        y?: number;
        transformOrigin?: LayerItem["transform"]["transformOrigin"];
        opacity?: number;
        blendMode?: BlendMode;
      };
      layersDispatch({ type: "set-rotation", layerId, rotation: parsed.rotation ?? 0 });
      layersDispatch({ type: "set-scale", layerId, scaleX: parsed.scaleX ?? 1, scaleY: parsed.scaleY ?? 1 });
      layersDispatch({ type: "set-position", layerId, x: parsed.x ?? 0, y: parsed.y ?? 0 });
      layersDispatch({ type: "set-transform-origin", layerId, transformOrigin: parsed.transformOrigin ?? "center" });
      if (typeof parsed.opacity === "number") layersDispatch({ type: "set-opacity", layerId, opacity: parsed.opacity });
      if (parsed.blendMode) layersDispatch({ type: "set-blend-mode", layerId, blendMode: parsed.blendMode });
      toast({ title: "Pasted", description: `Transform pasted into ${layer.name}.` });
    } catch {
      toast({ title: "Paste failed", description: "Clipboard does not contain a valid transform payload." });
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem(LAYERS_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as LayersStateExport;
      if (!parsed?.layers) return;
      const hydrated = {
        ...createInitialLayersState(),
        layers: parsed.layers.map(normalizeLayer),
        selectedLayerId: parsed.selectedLayerId ?? null,
        selectedLayerIds: parsed.selectedLayerIds ?? [],
        sidebarOpen: parsed.sidebarOpen ?? true,
        sidebarWidth: parsed.sidebarWidth ?? 300,
        sidebarAutoHide: parsed.sidebarAutoHide ?? false,
        pendingCommit: false,
        activeGesture: null,
        renameTargetLayerId: null,
        undoStack: [],
        redoStack: [],
      };
      layersDispatch({ type: "hydrate", state: hydrated });
    } catch {
      // ignore bad persisted state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prefsOnly: Pick<LayersStateExport, "schemaRevision" | "sidebarOpen" | "sidebarWidth" | "sidebarAutoHide"> = {
      schemaRevision: 1,
      sidebarOpen: layersState.sidebarOpen,
      sidebarWidth: layersState.sidebarWidth,
      sidebarAutoHide: layersState.sidebarAutoHide,
    };
    const raw = localStorage.getItem(LAYERS_STORAGE_KEY);
    try {
      const current = raw ? JSON.parse(raw) as Partial<LayersStateExport> : toLayersExport();
      const next = { ...current, ...prefsOnly };
      localStorage.setItem(LAYERS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore bad persisted state
    }
  }, [layersState.sidebarAutoHide, layersState.sidebarOpen, layersState.sidebarWidth, LAYERS_STORAGE_KEY]);

  useEffect(() => {
    if (!layersState.pendingCommit || layersState.activeGesture) return;
    localStorage.setItem(LAYERS_STORAGE_KEY, JSON.stringify(toLayersExport()));
    layersDispatch({ type: "mark-committed" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersState.pendingCommit, layersState.activeGesture]);

  useEffect(() => {
    persistScaleLinked(scaleLinked);
  }, [scaleLinked]);

  useEffect(() => {
    persistDebugHooks(debugHooks);
  }, [debugHooks]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const active = layersState.selectedLayerId;
      if (keyMatches(event, KEYBOARD_SHORTCUTS.UNDO)) {
        event.preventDefault();
        layersDispatch({ type: "undo" });
        return;
      }
      if (keyMatches(event, KEYBOARD_SHORTCUTS.REDO)) {
        event.preventDefault();
        layersDispatch({ type: "redo" });
        return;
      }
      if (keyMatches(event, KEYBOARD_SHORTCUTS.DEBUG)) {
        event.preventDefault();
        setDebugSettingsOpen((v) => !v);
        return;
      }
      if (keyMatches(event, KEYBOARD_SHORTCUTS.EXPORT)) {
        event.preventDefault();
        setExportMenuOpen(true);
        return;
      }
      if (keyMatches(event, KEYBOARD_SHORTCUTS.GENERATE)) {
        event.preventDefault();
        handleGenerate();
        return;
      }
      if (!active) return;
      if (keyMatches(event, KEYBOARD_SHORTCUTS.DUPLICATE)) {
        event.preventDefault();
        layersDispatch({ type: "duplicate-layer", layerId: active });
      } else if (keyMatches(event, KEYBOARD_SHORTCUTS.GROUP)) {
        event.preventDefault();
        layersDispatch({ type: "group-selected" });
      } else if (keyMatches(event, KEYBOARD_SHORTCUTS.UNGROUP)) {
        event.preventDefault();
        layersDispatch({ type: "ungroup", layerId: active });
      } else if (keyMatches(event, KEYBOARD_SHORTCUTS.TOGGLE_VISIBLE)) {
        event.preventDefault();
        layersDispatch({ type: "toggle-visible", layerId: active });
      } else if (keyMatches(event, KEYBOARD_SHORTCUTS.TOGGLE_LOCK)) {
        event.preventDefault();
        layersDispatch({ type: "toggle-locked", layerId: active });
      } else if (keyMatches(event, KEYBOARD_SHORTCUTS.PREV_LAYER)) {
        event.preventDefault();
        const ids = flattenLayerIds(layersState.layers);
        const idx = Math.max(0, ids.indexOf(active));
        const nextId = ids[Math.max(0, idx - 1)];
        if (nextId) layersDispatch({ type: "select-layer", layerId: nextId });
      } else if (keyMatches(event, KEYBOARD_SHORTCUTS.NEXT_LAYER)) {
        event.preventDefault();
        const ids = flattenLayerIds(layersState.layers);
        const idx = Math.max(0, ids.indexOf(active));
        const nextId = ids[Math.min(ids.length - 1, idx + 1)];
        if (nextId) layersDispatch({ type: "select-layer", layerId: nextId });
      } else if (event.key.toLowerCase() === "r" && event.shiftKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        layersDispatch({ type: "set-rename-target", layerId: active });
      } else if ((event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        void handleCopyTransform(active);
      } else if ((event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === "v") {
        event.preventDefault();
        void handlePasteTransform(active);
      } else if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.toLowerCase() === "m") {
        event.preventDefault();
        layersDispatch({ type: "merge-down", layerId: active });
      } else if (event.key === "ArrowUp" && event.altKey) {
        event.preventDefault();
        layersDispatch({ type: "nudge-transform", layerId: active, dx: 0, dy: -1 });
      } else if (event.key === "ArrowDown" && event.altKey) {
        event.preventDefault();
        layersDispatch({ type: "nudge-transform", layerId: active, dx: 0, dy: 1 });
      } else if (event.key === "ArrowLeft" && event.altKey) {
        event.preventDefault();
        layersDispatch({ type: "nudge-transform", layerId: active, dx: -1, dy: 0 });
      } else if (event.key === "ArrowRight" && event.altKey) {
        event.preventDefault();
        layersDispatch({ type: "nudge-transform", layerId: active, dx: 1, dy: 0 });
      } else if (event.key === "Delete") {
        event.preventDefault();
        layersDispatch({ type: "delete-layer", layerId: active });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [layersState.selectedLayerId, layersState.layers, handleGenerate]);

  useEffect(() => {
    if (!gizmoDrag || !selectedSpec) return;
    const onMove = (event: MouseEvent) => {
      const rect = previewRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dxPx = event.clientX - gizmoDrag.startX;
      const dyPx = event.clientY - gizmoDrag.startY;
      const pxToSpecX = selectedSpec.width / rect.width;
      const pxToSpecY = selectedSpec.height / rect.height;
      if (gizmoDrag.mode === "move") {
        layersDispatch({
          type: "set-position",
          layerId: gizmoDrag.layerId,
          x: gizmoDrag.startPosX + dxPx * pxToSpecX,
          y: gizmoDrag.startPosY + dyPx * pxToSpecY,
        });
      } else if (gizmoDrag.mode === "rotate") {
        const a0 = Math.atan2(gizmoDrag.startY - gizmoDrag.centerY, gizmoDrag.startX - gizmoDrag.centerX);
        const a1 = Math.atan2(event.clientY - gizmoDrag.centerY, event.clientX - gizmoDrag.centerX);
        const delta = ((a1 - a0) * 180) / Math.PI;
        layersDispatch({ type: "set-rotation", layerId: gizmoDrag.layerId, rotation: gizmoDrag.startRotation + delta });
      } else if (gizmoDrag.mode === "scale") {
        const d = Math.hypot(event.clientX - gizmoDrag.centerX, event.clientY - gizmoDrag.centerY);
        const ratio = Math.max(0.2, d / Math.max(1, gizmoDrag.startDist));
        layersDispatch({
          type: "set-scale",
          layerId: gizmoDrag.layerId,
          scaleX: gizmoDrag.startScaleX * ratio,
          scaleY: gizmoDrag.startScaleY * ratio,
        });
      }
    };
    const onUp = () => {
      layersDispatch({ type: "end-gesture" });
      setGizmoDrag(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [gizmoDrag, selectedSpec]);

  useEffect(() => {
    if (!layersState.sidebarAutoHide) return;
    const onMouseDown = () => layersDispatch({ type: "set-sidebar-open", open: false });
    const targets = Array.from(document.querySelectorAll('[data-onboard="variant-grid"], [data-layer-canvas="preview"]'));
    for (const target of targets) target.addEventListener("mousedown", onMouseDown);
    return () => {
      for (const target of targets) target.removeEventListener("mousedown", onMouseDown);
    };
  }, [layersState.sidebarAutoHide]);

  useEffect(() => {
    setDiscoveryDomain(config.domain);
  }, [config.domain, setDiscoveryDomain]);

  useEffect(() => {
    const assetLayers = layersToRenderableFlat(layersState.layers).filter(
      (layer) => layer.content.type === "asset-symbol",
    );
    let cancelled = false;
    const queue = async () => {
      const needsRefresh = assetLayers.filter((layer) => {
        if (layer.content.type !== "asset-symbol") return false;
          const contentAny: any = layer.content;
          const signature = `${contentAny.assetPath}|${JSON.stringify(contentAny.recolor)}`;
        return assetRenderByLayerId[layer.layerId]?.signature !== signature;
      }).slice(0, 5);
      const staleIds = Object.keys(assetRenderByLayerId).filter((id) => !assetLayers.some((layer) => layer.layerId === id));
      if (staleIds.length) {
        setAssetRenderByLayerId((prev) => {
          const next = { ...prev };
          for (const id of staleIds) delete next[id];
          return next;
        });
      }
      if (!needsRefresh.length) return;
        await Promise.all(needsRefresh.map(async (layer) => {
        if (layer.content.type !== "asset-symbol") return;
        const contentAny: any = layer.content;
        const signature = `${contentAny.assetPath}|${JSON.stringify(contentAny.recolor)}`;
        await recolorQueueRef.current.enqueue(async () => {
          try {
            const raw = await assetProviderRef.current.loadRawSvg(contentAny.assetPath);
            const recolored = recolorEngineRef.current.recolor(raw, contentAny.recolor);
            if (cancelled) return;
            setAssetRenderByLayerId((prev) => ({
              ...prev,
              [layer.layerId]: {
                svg: recolored.svg,
                quality: recolored.quality,
                warnings: recolored.warnings,
                signature,
              },
            }));
          } catch (error) {
            if (cancelled) return;
            setAssetRenderByLayerId((prev) => ({
              ...prev,
              [layer.layerId]: {
                svg: "",
                quality: 0,
                warnings: ["parse_error"],
                signature,
                error: error instanceof Error ? error.message : "asset load failed",
              },
            }));
          }
        });
      }));
    };
    void queue();
    return () => { cancelled = true; };
  }, [layersState.layers, assetRenderByLayerId]);

  useEffect(() => {
    selectedVariantIndexRef.current = Math.max(0, variants.findIndex((v) => v.id === selectedVariantId));
  }, [variants, selectedVariantId]);

  useEffect(() => {
    updateVariantScrollState();
    const el = variantGridRef.current;
    if (!el) return;
    const onScroll = () => updateVariantScrollState();
    const onResize = () => updateVariantScrollState();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants.length, selectedVariantId]);

  useEffect(() => {
    if (!variants.length || !config.seed) return;
    const nextVariants = buildVariantSpecs(config, variantCount, config.seed);
    setVariants(nextVariants);
    const idx = selectedVariantIndexRef.current;
    setSelectedVariantId(nextVariants[idx]?.id || nextVariants[0]?.id || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, variantCount]);

  useEffect(() => {
    if (!onboardingOpen) {
      if (highlightedRef.current) {
        highlightedRef.current.style.outline = "";
        highlightedRef.current.style.outlineOffset = "";
      }
      highlightedRef.current = null;
      return;
    }
    const step = ONBOARDING_STEPS[onboardingIndex];
    const target = document.querySelector(step.target) as HTMLElement | null;
    if (!target) {
      setOnboardingPanelPos(computeOnboardingPanelPos(null));
      return;
    }
    if (highlightedRef.current && highlightedRef.current !== target) {
      highlightedRef.current.style.outline = "";
      highlightedRef.current.style.outlineOffset = "";
    }
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.style.outline = "2px solid hsl(var(--primary))";
    target.style.outlineOffset = "4px";
    highlightedRef.current = target;
    setOnboardingPanelPos(computeOnboardingPanelPos(target));
    const afterScroll = window.setTimeout(() => {
      setOnboardingPanelPos(computeOnboardingPanelPos(target));
    }, 320);
    return () => window.clearTimeout(afterScroll);
  }, [onboardingOpen, onboardingIndex]);

  useEffect(() => {
    if (!onboardingOpen) return;
    const reflow = () => {
      const step = ONBOARDING_STEPS[onboardingIndex];
      const target = document.querySelector(step.target) as HTMLElement | null;
      setOnboardingPanelPos(computeOnboardingPanelPos(target));
    };
    window.addEventListener("resize", reflow);
    window.addEventListener("scroll", reflow, true);
    return () => {
      window.removeEventListener("resize", reflow);
      window.removeEventListener("scroll", reflow, true);
    };
  }, [onboardingOpen, onboardingIndex]);

  useEffect(() => {
    if (!onboardingOpen) return;
    const step = ONBOARDING_STEPS[onboardingIndex];
    const stepsNeedingVariants = new Set([
      "variants",
      "layers-sidebar",
      "layer-list",
      "layer-properties",
      "layer-transform",
      "batch-ops",
      "templates",
      "settings-gear",
      "settings-modal",
      "composition",
      "touches",
      "export",
    ]);
    if (stepsNeedingVariants.has(step.id) && variants.length === 0) {
      handleGenerateAction("generate");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingOpen, onboardingIndex, variants.length]);

  useEffect(() => {
    if (!onboardingOpen) return;
    const step = ONBOARDING_STEPS[onboardingIndex];
    const sidebarStepIds = new Set([
      "layers-sidebar",
      "layer-list",
      "layer-properties",
      "layer-transform",
      "batch-ops",
      "templates",
      "settings-gear",
    ]);
    if (sidebarStepIds.has(step.id) && !layersState.sidebarOpen) {
      layersDispatch({ type: "set-sidebar-open", open: true });
    }
    if (step.id === "layer-properties" && sectionCollapsed.properties) {
      handleSectionCollapsedChange("properties", false);
    }
    if (step.id === "layer-transform" && sectionCollapsed.transform) {
      handleSectionCollapsedChange("transform", false);
    }
    if (step.id === "batch-ops" && sectionCollapsed.batchOps) {
      handleSectionCollapsedChange("batchOps", false);
    }
    if (step.id === "templates") {
      if (sectionCollapsed.templates) {
        handleSectionCollapsedChange("templates", false);
      }
      if (!debugHooks.phase3Templates) {
        setDebugHooks((prev) => ({ ...prev, phase3Templates: true }));
      }
    }
    if (import.meta.env.DEV && step.id === "settings-modal") {
      setDebugSettingsOpen(true);
    }
    if (step.id !== "settings-modal" && debugSettingsOpen) {
      setDebugSettingsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingOpen, onboardingIndex]);

  const currentStep = ONBOARDING_STEPS[onboardingIndex];
  const onboardingLast = onboardingIndex === ONBOARDING_STEPS.length - 1;

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sacred Sigil Generator</h1>
        <p className="text-muted-foreground mt-1">Procedural religious iconography for gods, cults, and sacred sites</p>
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { setOnboardingIndex(0); setOnboardingOpen(true); }}>
              Start Onboarding
            </Button>
            {!layersState.sidebarOpen ? (
              <Button variant="outline" size="sm" onClick={() => layersDispatch({ type: "set-sidebar-open", open: true })}>
                Open Layers
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto grid gap-6 md:grid-cols-[1fr_1.2fr_auto]">
        <Card>
          <CardHeader><CardTitle className="text-lg">Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <SymbolPicker
              onSymbolSelect={(symbol) => {
                layersDispatch({
                  type: "add-asset-layer",
                  assetId: symbol.assetId,
                  assetPath: symbol.assetPath,
                  sourceHash: symbol.sourceHash,
                  recolor: {
                    targetColor: symbol.color,
                    brightness: 1,
                    saturation: 1,
                    opacity: symbol.opacity,
                    scope: "grayscale",
                  },
                  quality: 4,
                  warnings: [],
                });
              }}
            />
            <ConfigForm
              value={config}
              locked={seedLocked}
              onChange={setConfig}
              onDomainChange={handleDomainChange}
              onApplyPreset={handleApplyPreset}
              onManualColorChange={handleManualColorChange}
              onResetDomainColors={handleResetDomainColors}
              onResetPresetColors={handleResetPresetColors}
              onGenerate={handleGenerate}
              onRegenerateSame={handleRegenerateSame}
              onToggleLock={setSeedLocked}
              onRandomize={handleRandomize}
              composeRings={composeRings}
              composeHalo={composeHalo}
              composeDust={composeDust}
              onComposeRingsChange={setComposeRings}
              onComposeHaloChange={setComposeHalo}
              onComposeDustChange={setComposeDust}
              sectionCollapsed={{ generate: sectionCollapsed.generate, style: sectionCollapsed.style }}
              onSectionCollapsedChange={(section, collapsed) => handleSectionCollapsedChange(section, collapsed)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Preview</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-full space-y-2">
              <Label>Variants: {variantCount}</Label>
              <Slider min={6} max={12} step={1} value={[variantCount]} onValueChange={([v]) => setVariantCount(v)} />
            </div>

            {selectedSpec ? (
              <>
                <div className="border border-border rounded-lg p-6 bg-muted/30 flex items-center justify-center" data-layer-canvas="preview">
                  <div ref={previewRef} className="relative w-full max-w-xs">
                    <SVGRuntimeRenderer spec={selectedSpec} className="w-full h-auto" />
                    {debugHooks.phase2CanvasGizmos && selectedLayer && selectedLayer.content.type === "symbol" && !selectedLayer.locked ? (
                      <>
                        <button
                          type="button"
                          aria-label="Move layer"
                          className="absolute h-3 w-3 rounded-full border border-white bg-primary shadow"
                          style={{
                            left: `${((selectedLayerOrigin.x + selectedLayer.transform.x) / selectedSpec.width) * 100}%`,
                            top: `${((selectedLayerOrigin.y + selectedLayer.transform.y) / selectedSpec.height) * 100}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          onMouseDown={(e) => startGizmoDrag("move", e)}
                        />
                        <button
                          type="button"
                          aria-label="Rotate layer"
                          className="absolute h-3 w-3 rounded-full border border-white bg-emerald-500 shadow"
                          style={{
                            left: `${((selectedLayerOrigin.x + selectedLayer.transform.x) / selectedSpec.width) * 100}%`,
                            top: `${((selectedLayerOrigin.y + selectedLayer.transform.y - 20) / selectedSpec.height) * 100}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          onMouseDown={(e) => startGizmoDrag("rotate", e)}
                        />
                        <button
                          type="button"
                          aria-label="Scale layer"
                          className="absolute h-3 w-3 rounded-full border border-white bg-amber-500 shadow"
                          style={{
                            left: `${((selectedLayerOrigin.x + selectedLayer.transform.x + 20) / selectedSpec.width) * 100}%`,
                            top: `${((selectedLayerOrigin.y + selectedLayer.transform.y + 20) / selectedSpec.height) * 100}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          onMouseDown={(e) => startGizmoDrag("scale", e)}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="w-full" data-onboard="variant-grid">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Select a variant</p>
                    {variants.length > 6 ? (
                      <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => scrollVariantGrid("right")}>
                        {variantWindowStart}–{variantWindowEnd} of {variants.length} ▸
                      </button>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden"
                      onClick={() => scrollVariantGrid("left")}
                      disabled={!variantScrollState.canLeft}
                    >
                      ◀
                    </Button>
                    <div className="relative w-full">
                      {variantScrollState.canLeft ? (
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent z-10" />
                      ) : null}
                      {variantScrollState.canRight ? (
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent z-10" />
                      ) : null}
                      <div
                        ref={variantGridRef}
                        className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 w-full"
                        role="listbox"
                        aria-label="Generated variants"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (!variants.length) return;
                          if (e.key === "ArrowLeft") {
                            e.preventDefault();
                            const idx = Math.max(0, selectedVariantIndex - 1);
                            setSelectedVariantId(variants[idx]?.id || null);
                          } else if (e.key === "ArrowRight") {
                            e.preventDefault();
                            const idx = Math.min(variants.length - 1, selectedVariantIndex + 1);
                            setSelectedVariantId(variants[idx]?.id || null);
                          } else if (e.key === "Home") {
                            e.preventDefault();
                            setSelectedVariantId(variants[0]?.id || null);
                          } else if (e.key === "End") {
                            e.preventDefault();
                            setSelectedVariantId(variants[variants.length - 1]?.id || null);
                          }
                        }}
                      >
                      {variants.map((variant, idx) => {
                        const isSelected = variant.id === selectedSpecRaw?.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => setSelectedVariantId(variant.id)}
                            className={`rounded-md border p-2 bg-muted/20 transition-colors min-w-[74px] snap-start ${isSelected ? "border-primary" : "border-border hover:border-primary/50"}`}
                            aria-label={`Select variant ${variant.id}`}
                            role="option"
                            aria-selected={isSelected}
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                e.preventDefault();
                                setSelectedVariantId(variant.id);
                              } else if (e.key === "ArrowLeft") {
                                e.preventDefault();
                                setSelectedVariantId(variants[Math.max(0, idx - 1)]?.id || variant.id);
                              } else if (e.key === "ArrowRight") {
                                e.preventDefault();
                                setSelectedVariantId(variants[Math.min(variants.length - 1, idx + 1)]?.id || variant.id);
                              }
                            }}
                          >
                            <SVGRuntimeRenderer spec={variant} className="w-full h-auto" />
                          </button>
                        );
                      })}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden"
                      onClick={() => scrollVariantGrid("right")}
                      disabled={!variantScrollState.canRight}
                    >
                      ▶
                    </Button>
                  </div>
                </div>

                <div className="w-full space-y-4 border border-border rounded-md p-3" data-onboard="composition">
                  <p className="text-sm font-medium">Composition</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Blend Mode</Label>
                      <Select value={blendMode} onValueChange={(v) => setBlendMode(v as BlendMode)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">normal</SelectItem>
                          <SelectItem value="multiply">multiply</SelectItem>
                          <SelectItem value="screen">screen</SelectItem>
                          <SelectItem value="overlay">overlay</SelectItem>
                          <SelectItem value="darken">darken</SelectItem>
                          <SelectItem value="lighten">lighten</SelectItem>
                          <SelectItem value="color-dodge">color-dodge</SelectItem>
                          <SelectItem value="soft-light">soft-light</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Filter</Label>
                      <Select value={filterPreset} onValueChange={(v) => setFilterPreset(v as FilterPreset)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">none</SelectItem>
                          <SelectItem value="glow">glow</SelectItem>
                          <SelectItem value="etch">etch</SelectItem>
                          <SelectItem value="mist">mist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Filter Intensity: {filterIntensity.toFixed(2)}</Label>
                    <Slider min={0} max={1} step={0.05} value={[filterIntensity]} onValueChange={([v]) => setFilterIntensity(v)} />
                  </div>
                </div>

                <div className="w-full space-y-4 border border-border rounded-md p-3" data-onboard="final-touches">
                  <p className="text-sm font-medium">Final Touches (Reversible)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Overlay Symbol</Label>
                      <Select value={newOverlaySymbol} onValueChange={(v) => setNewOverlaySymbol(v as SymbolOverlayType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{SYMBOL_OVERLAYS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Blend</Label>
                      <Select value={newOverlayBlend} onValueChange={(v) => setNewOverlayBlend(v as BlendMode)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PHASE1_LAYER_BLEND_MODES.map((mode) => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
                          {debugHooks.phase2AdvancedBlendModes ? PHASE2_ADV_LAYER_BLEND_MODES.map((mode) => <SelectItem key={mode} value={mode}>{mode}</SelectItem>) : null}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2"><Label>Color</Label><Input type="color" value={newOverlayColor} onChange={(e) => setNewOverlayColor(e.target.value)} className="h-9 p-1 cursor-pointer" /></div>
                    <div className="space-y-2"><Label>Opacity: {newOverlayOpacity.toFixed(2)}</Label><Slider min={0.1} max={1} step={0.05} value={[newOverlayOpacity]} onValueChange={([v]) => setNewOverlayOpacity(v)} /></div>
                    <div className="space-y-2"><Label>Scale: {newOverlayScale.toFixed(2)}</Label><Slider min={0.4} max={2} step={0.05} value={[newOverlayScale]} onValueChange={([v]) => setNewOverlayScale(v)} /></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={handleAddOverlay}>Add Overlay</Button>
                    <Button variant="outline" size="sm" onClick={handleUndo} disabled={!layersState.undoStack.length}>Undo</Button>
                    <Button variant="outline" size="sm" onClick={handleRedo} disabled={!layersState.redoStack.length}>Redo</Button>
                    <Button variant="outline" size="sm" onClick={handleResetOverlays} disabled={!symbolLayers.length}>Reset Layers</Button>
                  </div>
                  <div className="space-y-2">
                    {symbolLayers.length ? symbolLayers.map((overlay) => (
                      <div key={overlay.layerId} className="flex items-center justify-between border border-border rounded px-2 py-1">
                        <div className="text-sm">
                          {overlay.content.type === "symbol" ? overlay.content.symbol : "layer"} · {overlay.blendMode} · {(overlay.opacity / 100).toFixed(2)} · {overlay.content.type === "symbol" ? overlay.content.scale.toFixed(2) : "1.00"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={overlay.visible} onCheckedChange={() => layersDispatch({ type: "toggle-visible", layerId: overlay.layerId })} />
                          <Button variant="outline" size="sm" onClick={() => layersDispatch({ type: "delete-layer", layerId: overlay.layerId })}>Remove</Button>
                        </div>
                      </div>
                    )) : <p className="text-sm text-muted-foreground">No overlay layers yet.</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full" data-onboard="export-actions">
                  <DropdownMenu open={exportMenuOpen} onOpenChange={setExportMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Export ▾</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => void handleCopySVG()}>Copy SVG</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownloadSVG}>Download SVG</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownloadPNG}>Download PNG</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownloadJSON}>Download JSON</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => void handleCopyReact()}>Copy React</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleCopySVG()}
                    title="Copy SVG to clipboard"
                    className={copiedSvgPulse ? "bg-green-100 border-green-400" : ""}
                  >
                    {copiedSvgPulse ? "Copied!" : "Copy SVG"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground text-center py-16">Configure and click <strong>Generate Icon</strong> to create variants.</div>
            )}
          </CardContent>
        </Card>

        <LayersSidebar
          state={layersState}
          dispatch={layersDispatch}
          onCopyTransform={(layerId) => { void handleCopyTransform(layerId); }}
          onPasteTransform={(layerId) => { void handlePasteTransform(layerId); }}
          onOpenDiscovery={() => setDiscoveryOpen(true)}
          debugHooks={debugHooks}
          sectionCollapsed={{
            properties: sectionCollapsed.properties,
            transform: sectionCollapsed.transform,
            batchOps: sectionCollapsed.batchOps,
            templates: sectionCollapsed.templates,
          }}
          onSectionCollapsedChange={(section, collapsed) => handleSectionCollapsedChange(section, collapsed)}
          scaleLinked={scaleLinked}
          onScaleLinkedChange={setScaleLinked}
          onOpenDebugSettings={() => setDebugSettingsOpen(true)}
        />
      </main>

      <IconDiscoveryPanel
        open={discoveryOpen}
        onOpenChange={setDiscoveryOpen}
        onAddLayer={handleAddDiscoveryLayer}
      />

      {import.meta.env.DEV ? (
        <Dialog open={debugSettingsOpen} onOpenChange={setDebugSettingsOpen}>
          <DialogContent data-onboard="settings-modal">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm font-medium">Developer / Debug</p>
              {Object.keys(DEFAULT_DEBUG_HOOK_SETTINGS).map((key) => (
                <div key={key} className="flex items-center justify-between border rounded-md px-3 py-2">
                  <Label className="text-sm">{key}</Label>
                  <Switch
                    checked={debugHooks[key as keyof DebugHookSettings]}
                    onCheckedChange={(checked) => {
                      setDebugHooks((prev) => ({ ...prev, [key]: checked }));
                    }}
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDebugHooks({ ...DEFAULT_DEBUG_HOOK_SETTINGS })}
                >
                  Reset to Defaults
                </Button>
                <Button onClick={() => setDebugSettingsOpen(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}

      {onboardingOpen && (
        <div
          className="fixed z-50 w-[420px] max-w-[calc(100vw-2rem)] rounded-lg border bg-background p-4 shadow-xl"
          style={{ top: `${onboardingPanelPos.top}px`, left: `${onboardingPanelPos.left}px` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">Onboarding</p>
              <p className="text-sm text-muted-foreground">Step {onboardingIndex + 1} / {ONBOARDING_STEPS.length}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setOnboardingOpen(false)} aria-label="Close onboarding">
              ✕
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            <p className="font-medium">{currentStep.title}</p>
            <p className="text-sm text-muted-foreground">{currentStep.description}</p>
            <p className="text-sm"><strong>Do this now:</strong> {currentStep.task}</p>
            <p className="text-xs text-muted-foreground">The focused UI element is outlined on the page.</p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOnboardingOpen(false)}>
              Skip tour
            </Button>
            <Button
              variant="outline"
              onClick={() => setOnboardingIndex((i) => Math.max(0, i - 1))}
              disabled={onboardingIndex === 0}
            >
              Previous
            </Button>
            {!onboardingLast ? (
              <Button onClick={() => setOnboardingIndex((i) => Math.min(ONBOARDING_STEPS.length - 1, i + 1))}>
                Next
              </Button>
            ) : (
              <Button onClick={() => setOnboardingOpen(false)}>Finish</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
