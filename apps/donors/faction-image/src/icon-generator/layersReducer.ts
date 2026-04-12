import type {
  BlendMode,
  LayerContent,
  LayerCreateSource,
  LayerId,
  LayerItem,
  LayerOperation,
  LayerOperationType,
  LayerSnapshot,
  LayersState,
  MainSymbolType,
  SemanticRole,
} from "./types";

const MAX_HISTORY = 50;

function nowIso(): string {
  return new Date().toISOString();
}

function cloneLayers(layers: LayerItem[]): LayerItem[] {
  return JSON.parse(JSON.stringify(layers)) as LayerItem[];
}

function snapshot(state: LayersState): LayerSnapshot {
  return {
    layers: cloneLayers(state.layers),
    selectedLayerId: state.selectedLayerId,
    selectedLayerIds: [...state.selectedLayerIds],
  };
}

function restore(state: LayersState, shot: LayerSnapshot): LayersState {
  return {
    ...state,
    layers: cloneLayers(shot.layers),
    selectedLayerId: shot.selectedLayerId,
    selectedLayerIds: [...shot.selectedLayerIds],
  };
}

function reindex(layers: LayerItem[]): LayerItem[] {
  return layers.map((layer, index) => ({ ...layer, zIndex: index }));
}

function touch(layer: LayerItem): LayerItem {
  return { ...layer, modifiedAt: nowIso() };
}

function op(
  type: LayerOperationType,
  affectedLayers: LayerId[],
  before: LayerSnapshot,
  afterState: LayersState,
  gestureId?: string,
  coalesced = false,
): LayerOperation {
  return {
    type,
    affectedLayers,
    before,
    after: snapshot(afterState),
    timestamp: nowIso(),
    gestureId,
    coalesced,
  };
}

function withHistory(
  state: LayersState,
  next: LayersState,
  type: LayerOperationType,
  affected: LayerId[],
  gestureId?: string,
): LayersState {
  const beforeShot = snapshot(state);
  const operation = op(type, affected, beforeShot, next, gestureId);
  let undoStack = [...state.undoStack];
  if (gestureId && undoStack.length) {
    const last = undoStack[undoStack.length - 1];
    if (last.gestureId === gestureId && last.type === type) {
      undoStack[undoStack.length - 1] = op(type, affected, last.before, next, gestureId, true);
      return { ...next, pendingCommit: true, undoStack, redoStack: [] };
    }
  }
  undoStack = [...undoStack, operation].slice(-MAX_HISTORY);
  return { ...next, pendingCommit: true, undoStack, redoStack: [] };
}

function findById(layers: LayerItem[], layerId: LayerId): LayerItem | null {
  for (const layer of layers) {
    if (layer.layerId === layerId) return layer;
    if (layer.children?.length) {
      const hit = findById(layer.children, layerId);
      if (hit) return hit;
    }
  }
  return null;
}

function updateById(layers: LayerItem[], layerId: LayerId, fn: (layer: LayerItem) => LayerItem): LayerItem[] {
  return layers.map((layer) => {
    if (layer.layerId === layerId) return fn(layer);
    if (layer.children?.length) return { ...layer, children: updateById(layer.children, layerId, fn) };
    return layer;
  });
}

function removeById(layers: LayerItem[], layerId: LayerId): LayerItem[] {
  return layers
    .filter((layer) => layer.layerId !== layerId)
    .map((layer) => (layer.children?.length ? { ...layer, children: removeById(layer.children, layerId) } : layer));
}

function removeNode(layers: LayerItem[], layerId: LayerId): { layers: LayerItem[]; node: LayerItem | null } {
  let removed: LayerItem | null = null;
  const next = layers
    .filter((layer) => {
      if (layer.layerId === layerId) {
        removed = layer;
        return false;
      }
      return true;
    })
    .map((layer) => {
      if (layer.children?.length) {
        const childResult = removeNode(layer.children, layerId);
        if (childResult.node) removed = childResult.node;
        return { ...layer, children: childResult.layers };
      }
      return layer;
    });
  return { layers: next, node: removed };
}

function insertRelative(
  layers: LayerItem[],
  targetId: LayerId,
  node: LayerItem,
  position: "before" | "after",
): { layers: LayerItem[]; inserted: boolean } {
  const idx = layers.findIndex((layer) => layer.layerId === targetId);
  if (idx >= 0) {
    const next = [...layers];
    const insertAt = position === "before" ? idx : idx + 1;
    next.splice(insertAt, 0, node);
    return { layers: next, inserted: true };
  }
  let inserted = false;
  const mapped = layers.map((layer) => {
    if (!layer.children?.length) return layer;
    const childResult = insertRelative(layer.children, targetId, node, position);
    if (childResult.inserted) {
      inserted = true;
      return { ...layer, children: childResult.layers };
    }
    return layer;
  });
  return { layers: mapped, inserted };
}

function flatten(layers: LayerItem[]): LayerItem[] {
  const out: LayerItem[] = [];
  for (const layer of layers) {
    out.push(layer);
    if (layer.children?.length) out.push(...flatten(layer.children));
  }
  return out;
}

function canMutate(layer: LayerItem | null): boolean {
  return !!layer && !layer.locked;
}

function makeId(prefix = "layer"): LayerId {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function defaultLayer(name: string, content: LayerContent, semanticRole: SemanticRole = "unspecified"): LayerItem {
  const now = nowIso();
  return {
    layerId: makeId("ly"),
    name,
    content,
    semanticRole,
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
    createdAt: now,
    modifiedAt: now,
    zIndex: 0,
  };
}

function symbolLayer(
  symbol: Exclude<MainSymbolType, "none">,
  color: string,
  scale: number,
  blendMode: BlendMode,
  opacity01: number,
  indexHint: number,
): LayerItem {
  const layer = defaultLayer(`${symbol}-${indexHint}`, {
    type: "symbol",
    symbol,
    color,
    scale,
  }, "overlay"); // Procedural symbols are overlay elements
  layer.opacity = Math.round(Math.max(0, Math.min(100, opacity01 * 100)));
  layer.blendMode = blendMode;
  return layer;
}

export type LayersAction =
  | { type: "hydrate"; state: LayersState }
  | { type: "mark-committed" }
  | { type: "begin-gesture"; kind: "opacity" | "rotation" | "scale" | "position"; gestureId?: string }
  | { type: "end-gesture" }
  | { type: "toggle-sidebar-open" }
  | { type: "set-sidebar-open"; open: boolean }
  | { type: "set-sidebar-width"; width: number }
  | { type: "set-sidebar-autohide"; enabled: boolean }
  | { type: "set-rename-target"; layerId: LayerId | null }
  | { type: "create-layer"; source: LayerCreateSource; payload?: { layerId?: LayerId; assetId?: string; proceduralSeed?: string } }
  | { type: "select-layer"; layerId: LayerId | null; additive?: boolean }
  | { type: "add-blank-layer" }
  | { type: "add-symbol-layer"; symbol: Exclude<MainSymbolType, "none">; color: string; scale: number; blendMode: BlendMode; opacity: number }
  | {
    type: "add-asset-layer";
    assetId: string;
    assetPath: string;
    sourceHash: string;
    recolor: { targetColor: string; brightness: number; saturation: number; opacity: number; scope: "black-only" | "grayscale" };
    quality: number;
    warnings: string[];
  }
  | {
    type: "set-asset-recolor";
    layerId: LayerId;
    recolor: Partial<{
      targetColor: string;
      brightness: number;
      saturation: number;
      opacity: number;
      scope: "black-only" | "grayscale";
    }>;
  }
  | { type: "rename-layer"; layerId: LayerId; name: string }
  | { type: "toggle-visible"; layerId: LayerId }
  | { type: "toggle-locked"; layerId: LayerId }
  | { type: "set-opacity"; layerId: LayerId; opacity: number }
  | { type: "set-blend-mode"; layerId: LayerId; blendMode: BlendMode }
  | { type: "set-rotation"; layerId: LayerId; rotation: number }
  | { type: "set-scale"; layerId: LayerId; scaleX: number; scaleY: number }
  | { type: "set-position"; layerId: LayerId; x: number; y: number }
  | { type: "set-transform-origin"; layerId: LayerId; transformOrigin: LayerItem["transform"]["transformOrigin"] }
  | { type: "reset-transform"; layerId: LayerId }
  | { type: "nudge-transform"; layerId: LayerId; dx: number; dy: number }
  | { type: "delete-layer"; layerId: LayerId }
  | { type: "duplicate-layer"; layerId: LayerId }
  | { type: "reorder-layer"; layerId: LayerId; toIndex?: number; targetLayerId?: LayerId; position?: "before" | "after" }
  | { type: "move-layer-up"; layerId: LayerId }
  | { type: "move-layer-down"; layerId: LayerId }
  | { type: "move-layer-top"; layerId: LayerId }
  | { type: "move-layer-bottom"; layerId: LayerId }
  | { type: "merge-down"; layerId: LayerId }
  | { type: "group-selected" }
  | { type: "ungroup"; layerId: LayerId }
  | { type: "batch-set-visible"; visible: boolean }
  | { type: "batch-set-opacity"; opacity: number }
  | { type: "batch-set-blend"; blendMode: BlendMode }
  | { type: "batch-delete" }
  | { type: "phase2-copy-transform"; layerId: LayerId }
  | { type: "phase2-paste-transform"; layerId: LayerId }
  | { type: "phase2-toggle-gizmo"; enabled: boolean }
  | { type: "phase3-set-search"; value: string }
  | { type: "phase3-apply-template"; templateId: string }
  | { type: "undo" }
  | { type: "redo" };

export function createInitialLayersState(): LayersState {
  const layer = defaultLayer("Layer 1", { type: "blank" });
  return {
    layers: [layer],
    selectedLayerId: layer.layerId,
    selectedLayerIds: [layer.layerId],
    sidebarOpen: true,
    sidebarWidth: 300,
    sidebarAutoHide: false,
    pendingCommit: false,
    activeGesture: null,
    renameTargetLayerId: null,
    undoStack: [],
    redoStack: [],
  };
}

function ensureLayersHaveSemanticRole(layers: LayerItem[]): LayerItem[] {
  return layers.map((layer) => ({
    ...layer,
    semanticRole: layer.semanticRole || "unspecified",
    children: layer.children ? ensureLayersHaveSemanticRole(layer.children) : undefined,
  }));
}

export function layersToRenderableFlat(layers: LayerItem[]): LayerItem[] {
  const walk = (
    items: LayerItem[],
    parentVisible = true,
    parentOpacity = 100,
    parentBlend: BlendMode = "normal",
  ): LayerItem[] => {
    const out: LayerItem[] = [];
    for (const layer of items) {
      const visible = parentVisible && layer.visible;
      const opacity = Math.round((parentOpacity * layer.opacity) / 100);
      const blendMode = layer.blendMode === "normal" ? parentBlend : layer.blendMode;
      if (layer.content.type === "group") {
        if (layer.children?.length) {
          out.push(...walk(layer.children, visible, opacity, blendMode));
        }
      } else {
        out.push({
          ...layer,
          visible,
          opacity,
          blendMode,
        });
      }
    }
    return out;
  };
  return walk(layers);
}

export function layersReducer(state: LayersState, action: LayersAction): LayersState {
  if (action.type === "hydrate") {
    return {
      ...action.state,
      layers: ensureLayersHaveSemanticRole(action.state.layers),
    };
  }
  if (action.type === "mark-committed") return { ...state, pendingCommit: false };
  if (action.type === "begin-gesture") {
    return {
      ...state,
      activeGesture: {
        id: action.gestureId || `gesture-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        kind: action.kind,
      },
    };
  }
  if (action.type === "end-gesture") return { ...state, activeGesture: null };
  if (action.type === "toggle-sidebar-open") return { ...state, sidebarOpen: !state.sidebarOpen };
  if (action.type === "set-sidebar-open") return { ...state, sidebarOpen: action.open };
  if (action.type === "set-sidebar-width") return { ...state, sidebarWidth: Math.max(220, Math.min(520, action.width)) };
  if (action.type === "set-sidebar-autohide") return { ...state, sidebarAutoHide: action.enabled };
  if (action.type === "set-rename-target") return { ...state, renameTargetLayerId: action.layerId };

  if (action.type === "undo") {
    if (!state.undoStack.length) return state;
    const opEntry = state.undoStack[state.undoStack.length - 1];
    const undoStack = state.undoStack.slice(0, -1);
    const redoStack = [...state.redoStack, opEntry].slice(-MAX_HISTORY);
    return { ...restore(state, opEntry.before), undoStack, redoStack };
  }

  if (action.type === "redo") {
    if (!state.redoStack.length) return state;
    const opEntry = state.redoStack[state.redoStack.length - 1];
    const redoStack = state.redoStack.slice(0, -1);
    const undoStack = [...state.undoStack, opEntry].slice(-MAX_HISTORY);
    return { ...restore(state, opEntry.after), undoStack, redoStack };
  }

  if (action.type === "select-layer") {
    if (!action.layerId) return { ...state, selectedLayerId: null, selectedLayerIds: [] };
    if (action.additive) {
      const set = new Set(state.selectedLayerIds);
      if (set.has(action.layerId)) set.delete(action.layerId); else set.add(action.layerId);
      const selectedLayerIds = Array.from(set);
      return { ...state, selectedLayerId: action.layerId, selectedLayerIds, renameTargetLayerId: null };
    }
    return { ...state, selectedLayerId: action.layerId, selectedLayerIds: [action.layerId], renameTargetLayerId: null };
  }

  if (action.type === "create-layer") {
    if (action.source === "blank") {
      return layersReducer(state, { type: "add-blank-layer" });
    }
    if (action.source === "clone" && (action.payload?.layerId || state.selectedLayerId)) {
      return layersReducer(state, { type: "duplicate-layer", layerId: action.payload?.layerId || (state.selectedLayerId as LayerId) });
    }
    // Phase Y+ hooks
    if (action.source === "asset") {
      return state;
    }
    if (action.source === "procedural") {
      return state;
    }
    return state;
  }

  if (action.type === "add-blank-layer") {
    const layer = defaultLayer(`Layer ${flatten(state.layers).length + 1}`, { type: "blank" });
    const next = {
      ...state,
      layers: reindex([...state.layers, layer]),
      selectedLayerId: layer.layerId,
      selectedLayerIds: [layer.layerId],
      renameTargetLayerId: null,
    };
    return withHistory(state, next, "add", [layer.layerId]);
  }

  if (action.type === "add-symbol-layer") {
    const layer = symbolLayer(
      action.symbol,
      action.color,
      action.scale,
      action.blendMode,
      action.opacity,
      flatten(state.layers).length + 1,
    );
    const next = {
      ...state,
      layers: reindex([...state.layers, layer]),
      selectedLayerId: layer.layerId,
      selectedLayerIds: [layer.layerId],
      renameTargetLayerId: null,
    };
    return withHistory(state, next, "add", [layer.layerId]);
  }

  if (action.type === "add-asset-layer") {
    const layer = defaultLayer(`asset-${flatten(state.layers).length + 1}`, {
      type: "asset-symbol",
      assetId: action.assetId,
      assetPath: action.assetPath,
      sourceHash: action.sourceHash,
      recolor: action.recolor,
      quality: action.quality,
      warnings: action.warnings,
    }, "symbol"); // Asset layers from the SymbolPicker are hero elements
    const next = {
      ...state,
      layers: reindex([...state.layers, layer]),
      selectedLayerId: layer.layerId,
      selectedLayerIds: [layer.layerId],
      renameTargetLayerId: null,
    };
    return withHistory(state, next, "add", [layer.layerId]);
  }

  if (action.type === "rename-layer") {
    const target = findById(state.layers, action.layerId);
    if (!target || target.locked) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({ ...layer, name: action.name.trim() || layer.name }));
    return withHistory(state, { ...state, layers: reindex(layers), renameTargetLayerId: null }, "rename", [action.layerId]);
  }

  if (action.type === "toggle-visible") {
    const target = findById(state.layers, action.layerId);
    if (!target || target.locked) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({ ...layer, visible: !layer.visible }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId]);
  }

  if (action.type === "toggle-locked") {
    const layers = updateById(state.layers, action.layerId, (layer) => touch({ ...layer, locked: !layer.locked }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId]);
  }

  if (action.type === "set-opacity") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target)) return state;
    const opacity = Math.max(0, Math.min(100, Math.round(action.opacity)));
    const layers = updateById(state.layers, action.layerId, (layer) => touch({ ...layer, opacity }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId], state.activeGesture?.kind === "opacity" ? state.activeGesture.id : undefined);
  }

  if (action.type === "set-blend-mode") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target)) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({ ...layer, blendMode: action.blendMode }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId]);
  }

  if (action.type === "set-asset-recolor") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target) || !target || target.content.type !== "asset-symbol") return state;
    const layers = updateById(state.layers, action.layerId, (layer) => {
      if (layer.content.type !== "asset-symbol") return layer;
      return touch({
        ...layer,
        content: {
          ...layer.content,
          recolor: {
            ...layer.content.recolor,
            ...action.recolor,
          },
        },
      });
    });
    return withHistory(state, { ...state, layers }, "update", [action.layerId]);
  }

  if (action.type === "set-rotation") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target)) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({
      ...layer,
      transform: { ...layer.transform, rotation: action.rotation },
    }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId], state.activeGesture?.kind === "rotation" ? state.activeGesture.id : undefined);
  }

  if (action.type === "set-scale") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target)) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({
      ...layer,
      transform: {
        ...layer.transform,
        scaleX: Math.max(0.1, action.scaleX),
        scaleY: Math.max(0.1, action.scaleY),
      },
    }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId], state.activeGesture?.kind === "scale" ? state.activeGesture.id : undefined);
  }

  if (action.type === "set-position") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target)) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({
      ...layer,
      transform: { ...layer.transform, x: action.x, y: action.y },
    }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId], state.activeGesture?.kind === "position" ? state.activeGesture.id : undefined);
  }

  if (action.type === "reset-transform") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target)) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({
      ...layer,
      transform: {
        ...layer.transform,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
      },
    }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId]);
  }

  if (action.type === "set-transform-origin") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target)) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({
      ...layer,
      transform: { ...layer.transform, transformOrigin: action.transformOrigin },
    }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId]);
  }

  if (action.type === "nudge-transform") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target)) return state;
    const layers = updateById(state.layers, action.layerId, (layer) => touch({
      ...layer,
      transform: {
        ...layer.transform,
        x: layer.transform.x + action.dx,
        y: layer.transform.y + action.dy,
      },
    }));
    return withHistory(state, { ...state, layers }, "update", [action.layerId], state.activeGesture?.kind === "position" ? state.activeGesture.id : undefined);
  }

  if (action.type === "delete-layer") {
    const target = findById(state.layers, action.layerId);
    if (!canMutate(target) || flatten(state.layers).length <= 1) return state;
    const layers = reindex(removeById(state.layers, action.layerId));
    const flat = flatten(layers);
    const fallback = flat[flat.length - 1]?.layerId || null;
    const selectedLayerId = state.selectedLayerId === action.layerId ? fallback : state.selectedLayerId;
    const selectedLayerIds = state.selectedLayerIds.filter((id) => id !== action.layerId);
    const next = { ...state, layers, selectedLayerId, selectedLayerIds: selectedLayerIds.length ? selectedLayerIds : (selectedLayerId ? [selectedLayerId] : []), renameTargetLayerId: null };
    return withHistory(state, next, "delete", [action.layerId]);
  }

  if (action.type === "duplicate-layer") {
    const target = findById(state.layers, action.layerId);
    if (!target || target.locked) return state;
    const copy: LayerItem = {
      ...JSON.parse(JSON.stringify(target)) as LayerItem,
      layerId: makeId("dup"),
      name: `${target.name} Copy`,
      createdAt: nowIso(),
      modifiedAt: nowIso(),
      locked: false,
    };
    const layers = [...state.layers];
    const idx = layers.findIndex((l) => l.layerId === action.layerId);
    if (idx < 0) return state;
    layers.splice(idx + 1, 0, copy);
    const next = { ...state, layers: reindex(layers), selectedLayerId: copy.layerId, selectedLayerIds: [copy.layerId], renameTargetLayerId: null };
    return withHistory(state, next, "add", [copy.layerId]);
  }

  if (action.type === "reorder-layer" || action.type === "move-layer-up" || action.type === "move-layer-down" || action.type === "move-layer-top" || action.type === "move-layer-bottom") {
    const layerId = action.layerId;
    const target = findById(state.layers, layerId);
    if (!canMutate(target)) return state;
    const flat = flatten(state.layers).map((l) => l.layerId);
    const currentIdx = flat.indexOf(layerId);
    if (currentIdx < 0) return state;
    let targetLayerId: LayerId | undefined = action.targetLayerId;
    let position: "before" | "after" = action.position || "before";
    if (action.type === "move-layer-up" && currentIdx > 0) {
      targetLayerId = flat[currentIdx - 1];
      position = "before";
    } else if (action.type === "move-layer-down" && currentIdx < flat.length - 1) {
      targetLayerId = flat[currentIdx + 1];
      position = "after";
    } else if (action.type === "move-layer-top" && flat.length > 1) {
      targetLayerId = flat[0];
      position = "before";
    } else if (action.type === "move-layer-bottom" && flat.length > 1) {
      targetLayerId = flat[flat.length - 1];
      position = "after";
    } else if (action.type === "reorder-layer" && targetLayerId == null && typeof action.toIndex === "number") {
      const clamped = Math.max(0, Math.min(flat.length - 1, action.toIndex));
      targetLayerId = flat[clamped];
      position = "before";
    }
    if (!targetLayerId || targetLayerId === layerId) return state;
    const targetLayer = findById(state.layers, targetLayerId);
    if (!targetLayer || targetLayer.locked) return state;
    const removed = removeNode(state.layers, layerId);
    if (!removed.node) return state;
    let inserted = insertRelative(removed.layers, targetLayerId, removed.node, position);
    if (!inserted.inserted) {
      const fallback = [...removed.layers, removed.node];
      inserted = { layers: fallback, inserted: true };
    }
    return withHistory(state, { ...state, layers: reindex(inserted.layers) }, "reorder", [layerId, targetLayerId]);
  }

  if (action.type === "merge-down") {
    const layerId = action.layerId;
    const layers = [...state.layers];
    const idx = layers.findIndex((l) => l.layerId === layerId);
    if (idx <= 0) return state;
    const top = layers[idx];
    const below = layers[idx - 1];
    if (!canMutate(top) || !canMutate(below)) return state;
    const merged: LayerItem = touch({
      ...below,
      name: `${below.name} + ${top.name}`,
      opacity: Math.max(below.opacity, top.opacity),
      blendMode: top.blendMode === "normal" ? below.blendMode : top.blendMode,
    });
    layers.splice(idx, 1);
    layers[idx - 1] = merged;
    const mergedTransform = {
      ...merged.transform,
      x: below.transform.x + top.transform.x,
      y: below.transform.y + top.transform.y,
      rotation: below.transform.rotation + top.transform.rotation,
      scaleX: below.transform.scaleX * top.transform.scaleX,
      scaleY: below.transform.scaleY * top.transform.scaleY,
    };
    layers[idx - 1] = { ...merged, transform: mergedTransform };
    const next = { ...state, layers: reindex(layers), selectedLayerId: merged.layerId, selectedLayerIds: [merged.layerId], renameTargetLayerId: null };
    return withHistory(state, next, "merge", [below.layerId, top.layerId]);
  }

  if (action.type === "group-selected") {
    const selected = state.selectedLayerIds.length ? state.selectedLayerIds : (state.selectedLayerId ? [state.selectedLayerId] : []);
    if (selected.length < 2) return state;
    const topLevelSelected = state.layers.filter((l) => selected.includes(l.layerId));
    if (topLevelSelected.length < 2) return state;
    const group = defaultLayer(`Group ${Math.max(1, state.layers.filter((l) => l.content.type === "group").length + 1)}`, { type: "group" });
    group.children = topLevelSelected;
    const remaining = state.layers.filter((l) => !selected.includes(l.layerId));
    const nextLayers = reindex([...remaining, group]);
    const next = { ...state, layers: nextLayers, selectedLayerId: group.layerId, selectedLayerIds: [group.layerId], renameTargetLayerId: null };
    return withHistory(state, next, "group", [...selected, group.layerId]);
  }

  if (action.type === "ungroup") {
    const idx = state.layers.findIndex((l) => l.layerId === action.layerId && l.content.type === "group");
    if (idx < 0) return state;
    const group = state.layers[idx];
    if (group.locked) return state;
    const layers = [...state.layers];
    layers.splice(idx, 1, ...(group.children || []));
    const next = { ...state, layers: reindex(layers), selectedLayerId: null, selectedLayerIds: [], renameTargetLayerId: null };
    return withHistory(state, next, "group", [action.layerId]);
  }

  if (action.type === "batch-set-visible" || action.type === "batch-set-opacity" || action.type === "batch-set-blend" || action.type === "batch-delete") {
    const selected = state.selectedLayerIds.length ? state.selectedLayerIds : (state.selectedLayerId ? [state.selectedLayerId] : []);
    if (!selected.length) return state;
    if (action.type === "batch-delete") {
      const lockedIds = new Set(flatten(state.layers).filter((l) => l.locked).map((l) => l.layerId));
      const deletable = selected.filter((id) => !lockedIds.has(id));
      if (!deletable.length || flatten(state.layers).length - deletable.length < 1) return state;
      let layers = state.layers;
      for (const id of deletable) layers = removeById(layers, id);
      const nextLayers = reindex(layers);
      const fallback = flatten(nextLayers)[0]?.layerId || null;
      const next = { ...state, layers: nextLayers, selectedLayerId: fallback, selectedLayerIds: fallback ? [fallback] : [], renameTargetLayerId: null };
      return withHistory(state, next, "batch", deletable);
    }
    const selectedSet = new Set(selected);
    const layers = updateById(state.layers, "", (layer) => layer);
    const walk = (items: LayerItem[]): LayerItem[] => items.map((layer) => {
      let next = layer;
      if (selectedSet.has(layer.layerId) && !layer.locked) {
        if (action.type === "batch-set-visible") next = touch({ ...layer, visible: action.visible });
        if (action.type === "batch-set-opacity") next = touch({ ...layer, opacity: Math.max(0, Math.min(100, Math.round(action.opacity))) });
        if (action.type === "batch-set-blend") next = touch({ ...layer, blendMode: action.blendMode });
      }
      if (next.children?.length) next = { ...next, children: walk(next.children) };
      return next;
    });
    const next = { ...state, layers: walk(layers) };
    return withHistory(state, next, "batch", selected);
  }

  if (action.type === "phase2-copy-transform" || action.type === "phase2-paste-transform" || action.type === "phase2-toggle-gizmo" || action.type === "phase3-set-search" || action.type === "phase3-apply-template") {
    if (action.type === "phase3-apply-template") {
      const indexBase = flatten(state.layers).length + 1;
      let additions: LayerItem[] = [];
      if (action.templateId === "heraldic-duo") {
        additions = [
          symbolLayer("shield", "#f4f4f5", 1.0, "overlay", 0.85, indexBase),
          symbolLayer("crown", "#f59e0b", 0.8, "screen", 0.8, indexBase + 1),
        ];
      } else if (action.templateId === "mystic-triad") {
        additions = [
          symbolLayer("rune", "#a78bfa", 0.8, "screen", 0.75, indexBase),
          symbolLayer("star", "#eab308", 0.7, "color-dodge", 0.7, indexBase + 1),
          symbolLayer("mandala", "#38bdf8", 1.1, "soft-light", 0.65, indexBase + 2),
        ];
      } else if (action.templateId === "war-sigil") {
        additions = [
          symbolLayer("beast", "#ef4444", 0.9, "multiply", 0.8, indexBase),
          symbolLayer("hammer", "#e5e7eb", 0.8, "overlay", 0.8, indexBase + 1),
        ];
      }
      if (!additions.length) return state;
      const layers = reindex([...state.layers, ...additions]);
      const selectedLayerId = additions[additions.length - 1].layerId;
      const next = { ...state, layers, selectedLayerId, selectedLayerIds: [selectedLayerId], renameTargetLayerId: null };
      return withHistory(state, next, "batch", additions.map((l) => l.layerId));
    }
    // Reserved hook for future integrations.
    return state;
  }

  return state;
}
