import type { DebugHookSettings } from "./types";

export const DEFAULT_DEBUG_HOOK_SETTINGS: DebugHookSettings = {
  phase2CanvasGizmos: true,
  phase2Thumbnails: true,
  phase2CopyPasteTransforms: true,
  phase2AdvancedBlendModes: true,
  phase3SearchFilter: true,
  phase3Templates: true,
};

export const LAYERS_FEATURE_FLAGS = DEFAULT_DEBUG_HOOK_SETTINGS;

export type LayersFeatureFlag = keyof DebugHookSettings;
