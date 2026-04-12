export type LayerType =
  | "circle"
  | "ring"
  | "triangle"
  | "square"
  | "diamond"
  | "pentagon"
  | "eye"
  | "sun"
  | "moon"
  | "serpent"
  | "hand"
  | "cross"
  | "arc"
  | "rays"
  | "dots"
  | "text"
  | "symbol"
  | "hammer"
  | "mandala"
  | "rune"
  | "beast"
  | "star"
  | "crown"
  | "shield"
  | "raw-svg";

export type AlignMode = "center" | "north" | "south" | "east" | "west";

export type ColorChannel = "primaryColor" | "secondaryColor" | "accentColor" | "backgroundColor";
export type ColorOwner = "domain" | "preset" | "manual";
export type ColorPresetKey = "domain" | "default" | "high-contrast" | "muted" | "vivid" | "monochrome";

export type OwnerByChannel = Record<ColorChannel, ColorOwner>;

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "difference"
  | "exclusion"
  | "soft-light";

export type FilterPreset = "none" | "glow" | "etch" | "mist";

export type FilterDef = {
  id: string;
  preset: Exclude<FilterPreset, "none">;
  intensity: number;
};

export type Layer = {
  id: string;
  type: LayerType;
  rawSvg?: string;
  transform?: string;
  opacity?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  align?: AlignMode;
  // Shape-specific extras
  r?: number;
  points?: string;
  d?: string; // SVG path data
  text?: string;
  fontSize?: number;
  cx?: number;
  cy?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  blendMode?: BlendMode;
  filterId?: string;
};

export type IconSpec = {
  id: string;
  viewBox: string;
  width: number;
  height: number;
  layers: Layer[];
  title?: string;
  desc?: string;
  filters?: FilterDef[];
};

export type SeedHistoryReason =
  | "initial"
  | "generate-next"
  | "randomize"
  | "manual-edit"
  | "regenerate-same"
  | "imported-legacy"
  | "imported-derived";

export type SeedHistoryEntry = {
  revision: number;
  seed: string;
  reason: SeedHistoryReason;
  timestamp: string;
};

export type CompositionMode = "overlay-center" | "impalement-horizontal" | "quartered";

export type CompositionConfig = {
  id: string;
  compositionVersion: number;
  mode: CompositionMode;
  revisionId: string;
  appliedToVariants: string[] | "all";
  updatedAt: string;
  layers?: LayerItem[];
};

export type ExportPayload = {
  schemaVersion: "1.0.0";
  generatorVersion: string;
  faction: {
    id: string;
    name: string;
    domain?: import("./domainPalettes").FactionDomain;
  };
  state: {
    seed: string;
    seedRevision: number;
    seedHistory: SeedHistoryEntry[];
    symmetry: SymmetryConfig;
    ownerByChannel: OwnerByChannel;
    colorPresetKey: ColorPresetKey | null;
    layersSidebar?: LayersStateExport;
    iconDiscovery?: {
      query: string;
      selectedAssetId: string | null;
      recolor: {
        targetColor: string;
        brightness: number;
        saturation: number;
        opacity: number;
        scope: "black-only" | "grayscale";
      };
    };
  };
  selection: {
    variantIndex: number;
    style?: string;
  };
  composition: CompositionConfig | null;
  artifacts: {
    svg: string;
    png: null;
  };
};

export type AssetRecord = {
  key: string;
  factionId: string;
  seed: string;
  seedRevision: number;
  seedHistory: SeedHistoryEntry[];
  variantIndex: number;
  compositionRevisionId: string;
  payload: ExportPayload;
};

export type LayerId = string;

export type SemanticRole = "symbol" | "frame" | "overlay" | "unspecified";

export type LayerContent =
  | { type: "blank" }
  | { type: "symbol"; symbol: Exclude<MainSymbolType, "none">; color: string; scale: number }
  | {
    type: "asset-symbol";
    assetId: string;
    assetPath: string;
    recolor: {
      targetColor: string;
      brightness: number;
      saturation: number;
      opacity: number;
      scope: "black-only" | "grayscale";
    };
    sourceHash: string;
    quality: number;
    warnings: string[];
    previewThumbnail?: string;
  }
  | { type: "group" };

export type LayerItem = {
  layerId: LayerId;
  name: string;
  content: LayerContent;
  semanticRole: SemanticRole; // "symbol" for hero, "frame" for background, "overlay" for top decorations
  visible: boolean;
  locked: boolean;
  opacity: number; // 0..100
  blendMode: BlendMode;
  transform: {
    rotation: number;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    transformOrigin: "center" | "top-left" | "top" | "top-right" | "left" | "right" | "bottom-left" | "bottom" | "bottom-right";
  };
  createdAt: string;
  modifiedAt: string;
  zIndex: number;
  children?: LayerItem[];
};

export type LayerSnapshot = {
  layers: LayerItem[];
  selectedLayerId: LayerId | null;
  selectedLayerIds: LayerId[];
};

export type LayerOperationType =
  | "add"
  | "delete"
  | "reorder"
  | "update"
  | "rename"
  | "merge"
  | "group"
  | "batch";

export type LayerOperation = {
  type: LayerOperationType;
  affectedLayers: LayerId[];
  before: LayerSnapshot;
  after: LayerSnapshot;
  timestamp: string;
  gestureId?: string;
  coalesced?: boolean;
};

export type LayersState = {
  layers: LayerItem[];
  selectedLayerId: LayerId | null;
  selectedLayerIds: LayerId[];
  sidebarOpen: boolean;
  sidebarWidth: number;
  sidebarAutoHide: boolean;
  pendingCommit: boolean;
  activeGesture: null | {
    id: string;
    kind: "opacity" | "rotation" | "scale" | "position";
  };
  renameTargetLayerId: LayerId | null;
  undoStack: LayerOperation[];
  redoStack: LayerOperation[];
};

export type LayersStateExport = Omit<LayersState, "undoStack" | "redoStack" | "renameTargetLayerId"> & {
  schemaRevision: number;
  historyDepth: number;
};

export type LayerCreateSource = "blank" | "clone" | "asset" | "procedural";

export type SidebarSectionKey = "generate" | "style" | "properties" | "transform" | "batchOps" | "templates";

export type DebugHookSettings = {
  phase2CanvasGizmos: boolean;
  phase2Thumbnails: boolean;
  phase2CopyPasteTransforms: boolean;
  phase2AdvancedBlendModes: boolean;
  phase3SearchFilter: boolean;
  phase3Templates: boolean;
};

export type UiPreferences = {
  sidebarSections: Record<SidebarSectionKey, boolean>; // true=collapsed
  scaleLinked: boolean;
  debugHooks: DebugHookSettings;
};

export type Mood = "stark" | "ornate" | "warlike" | "mystic" | "gentle" | "corrupt";
export type SymmetryId =
  | "none"
  | "mirror-v"
  | "mirror-h"
  | "mirror-vh"
  | "rot-2"
  | "rot-3"
  | "rot-4"
  | "rot-6"
  | "rot-8"
  | "radial-4"
  | "radial-6"
  | "radial-8"
  | "radial-12"
  | "radial-16"
  | "hybrid-quad"
  | "hybrid-hex"
  | "hybrid-tri"
  | "hybrid-oct";
export type SymmetryCategory = "none" | "mirror" | "rotational" | "radial" | "hybrid";
export type SymmetrySelectedBy = "user" | "domain_suggest" | "preset";

export type SymmetryDefinition = {
  symmetryId: SymmetryId;
  displayName: string;
  description: string;
  category: SymmetryCategory;
  foldCount: number;
  mirrorCount: number;
  phase: 1 | 2 | 3;
};

export type SymmetryConfig = {
  symmetryId: SymmetryId;
  displayName: string;
  foldCount: number;
  mirrorCount: number;
  category: SymmetryCategory;
  selectedAt: string;
  selectedBy: SymmetrySelectedBy;
  revisionId: string;
  symmetryVersion: "1.0.0";
  regenerateReason?: "manual_symmetry_change" | "domain_change" | null;
};

export type BackgroundShape = "circle" | "square" | "shield" | "diamond";
export type MainSymbolType = "eye" | "hammer" | "shield" | "mandala" | "rune" | "beast" | "star" | "crown" | "none";

export type Complexity = 1 | 2 | 3 | 4 | 5;

export type IconConfig = {
  seed?: string;
  baseShape?: LayerType;
  mood?: Mood;
  symmetry?: SymmetryId;
  layerCount?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  strokeWidth?: number;
  size?: number;
  includeText?: boolean;
  textChar?: string;
  backgroundColor?: string;
  backgroundShape?: BackgroundShape;
  mainSymbol?: MainSymbolType;
  domain?: import("./domainPalettes").FactionDomain;
  complexity?: Complexity;
  ownerByChannel?: OwnerByChannel;
  colorPresetKey?: ColorPresetKey | null;
  manualColorDirtyByChannel?: Partial<Record<ColorChannel, boolean>>;
};
