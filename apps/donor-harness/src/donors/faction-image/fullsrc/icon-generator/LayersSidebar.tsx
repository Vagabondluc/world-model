import React, { useEffect, useMemo, useRef, useState } from "react";
import type { BlendMode, DebugHookSettings, LayerId, LayerItem, LayersState } from "./types";
import type { LayersAction } from "./layersReducer";
import { List, type RowComponentProps } from "react-window";
import { SYMBOL_PATHS } from "./symbolPaths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Props = {
  state: LayersState;
  dispatch: React.Dispatch<LayersAction>;
  onCopyTransform: (layerId: LayerId) => void;
  onPasteTransform: (layerId: LayerId) => void;
  onOpenDiscovery: () => void;
  debugHooks: DebugHookSettings;
  sectionCollapsed: { properties: boolean; transform: boolean; batchOps: boolean; templates: boolean };
  onSectionCollapsedChange: (section: "properties" | "transform" | "batchOps" | "templates", collapsed: boolean) => void;
  scaleLinked: boolean;
  onScaleLinkedChange: (value: boolean) => void;
  onOpenDebugSettings: () => void;
};

const PHASE1_BLENDS: BlendMode[] = ["normal", "multiply", "screen", "overlay", "lighten", "darken"];
const PHASE2_ADV_BLEND_MODES: BlendMode[] = ["color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"];
const TRANSFORM_ORIGINS: LayerItem["transform"]["transformOrigin"][] = ["center", "top-left", "top", "top-right", "left", "right", "bottom-left", "bottom", "bottom-right"];

function LayerThumbnail({ layer }: { layer: LayerItem }) {
  if (layer.content.type === "group") {
    return <div className="h-8 w-8 rounded border bg-muted/30 flex items-center justify-center text-xs">📁</div>;
  }
  if (layer.content.type === "blank") {
    return <div className="h-8 w-8 rounded border bg-muted/20" />;
  }
  if (layer.content.type === "asset-symbol") {
    return <div className="h-8 w-8 rounded border bg-muted/20 flex items-center justify-center text-xs">A</div>;
  }
  const d = SYMBOL_PATHS[layer.content.symbol];
  const cx = 16;
  const cy = 16;
  const x = layer.transform.x / 8;
  const y = layer.transform.y / 8;
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 rounded border bg-muted/20">
      <g transform={`translate(${x} ${y}) translate(${cx} ${cy}) rotate(${layer.transform.rotation}) scale(${Math.max(0.4, layer.content.scale * layer.transform.scaleX) * 0.23} ${Math.max(0.4, layer.content.scale * layer.transform.scaleY) * 0.23}) translate(${-64} ${-64})`}>
        <path d={d} fill={layer.content.color} opacity={Math.max(0.1, layer.opacity / 100)} />
      </g>
    </svg>
  );
}

type FlatRow = { layer: LayerItem; depth: number };

function filterTree(
  layers: LayerItem[],
  query: string,
): LayerItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return layers;
  const visit = (node: LayerItem): LayerItem | null => {
    const childMatches = (node.children || []).map(visit).filter((c): c is LayerItem => !!c);
    const descriptor = node.content.type === "symbol"
      ? node.content.symbol
      : node.content.type === "asset-symbol"
        ? node.content.assetId
        : node.content.type;
    const selfText = `${node.name} ${descriptor}`.toLowerCase();
    const selfMatch = selfText.includes(q);
    if (selfMatch || childMatches.length) return { ...node, children: childMatches.length ? childMatches : undefined };
    return null;
  };
  return layers.map(visit).filter((n): n is LayerItem => !!n);
}

function flattenVisibleTree(layers: LayerItem[], collapsed: Set<LayerId>, depth = 0): FlatRow[] {
  const out: FlatRow[] = [];
  for (const layer of layers) {
    out.push({ layer, depth });
    if (layer.children?.length && !collapsed.has(layer.layerId)) {
      out.push(...flattenVisibleTree(layer.children, collapsed, depth + 1));
    }
  }
  return out;
}

function Row({
  layer,
  depth,
  selected,
  selectedMany,
  collapsed,
  onToggleGroup,
  dispatch,
  onRename,
  onCopyTransform,
  onPasteTransform,
  renameRequested,
  style,
}: {
  layer: LayerItem;
  depth: number;
  selected: boolean;
  selectedMany: boolean;
  collapsed: boolean;
  onToggleGroup: (layerId: LayerId) => void;
  dispatch: React.Dispatch<LayersAction>;
  onRename: (id: LayerId, name: string) => void;
  onCopyTransform: (id: LayerId) => void;
  onPasteTransform: (id: LayerId) => void;
  renameRequested: boolean;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(layer.name);
  const isGroup = layer.content.type === "group";
  useEffect(() => {
    if (renameRequested) {
      setEditing(true);
      setName(layer.name);
    }
  }, [renameRequested, layer.name]);
  return (
    <div
      className={`group rounded border px-2 py-2 text-sm ${selected ? "border-primary bg-primary/5" : "border-border"}`}
      style={{ marginLeft: `${depth * 12}px`, minHeight: "44px", ...style }}
      draggable={!layer.locked}
      onDragStart={(e) => e.dataTransfer.setData("text/layer-id", layer.layerId)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const dragId = e.dataTransfer.getData("text/layer-id");
        if (dragId && dragId !== layer.layerId) {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const position = e.clientY < rect.top + rect.height / 2 ? "before" : "after";
          dispatch({ type: "reorder-layer", layerId: dragId, targetLayerId: layer.layerId, position });
        }
      }}
      onClick={(e) => dispatch({ type: "select-layer", layerId: layer.layerId, additive: e.shiftKey })}
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch({ type: "select-layer", layerId: layer.layerId });
      }}
    >
      <div className="flex items-center gap-2">
        {isGroup ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onToggleGroup(layer.layerId); }}
            aria-label="Toggle group collapse"
          >
            {collapsed ? "▶" : "▼"}
          </Button>
        ) : null}
        <LayerThumbnail layer={layer} />
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); dispatch({ type: "toggle-visible", layerId: layer.layerId }); }}
          aria-label="Toggle visibility"
        >
          {layer.visible ? "👁" : "🙈"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); dispatch({ type: "toggle-locked", layerId: layer.layerId }); }}
          aria-label="Toggle lock"
        >
          {layer.locked ? "🔒" : "🔓"}
        </Button>
        {editing ? (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => { setEditing(false); dispatch({ type: "set-rename-target", layerId: null }); onRename(layer.layerId, name); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { setEditing(false); dispatch({ type: "set-rename-target", layerId: null }); onRename(layer.layerId, name); }
              if (e.key === "Escape") { setEditing(false); dispatch({ type: "set-rename-target", layerId: null }); setName(layer.name); }
            }}
            className="h-7"
            autoFocus
          />
        ) : (
          <button type="button" className="text-left flex-1 truncate" onDoubleClick={() => setEditing(true)}>
            {isGroup ? "📁 " : ""}{layer.name}
            {layer.content.type === "asset-symbol" && layer.content.warnings.length ? " ⚠" : ""}
            {selectedMany ? " (selected)" : ""}
          </button>
        )}
        <Button className="opacity-0 group-hover:opacity-100" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditing(true); }}>✎</Button>
        <Button className="opacity-0 group-hover:opacity-100" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onCopyTransform(layer.layerId); }}>⎘</Button>
        <Button className="opacity-0 group-hover:opacity-100" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onPasteTransform(layer.layerId); }} disabled={layer.locked}>⎀</Button>
        <Button className="opacity-0 group-hover:opacity-100" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); dispatch({ type: "duplicate-layer", layerId: layer.layerId }); }}>⧉</Button>
        <Button className="opacity-0 group-hover:opacity-100" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); dispatch({ type: "delete-layer", layerId: layer.layerId }); }} disabled={layer.locked}>✕</Button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); dispatch({ type: "move-layer-up", layerId: layer.layerId }); }} disabled={layer.locked}>↑</Button>
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); dispatch({ type: "move-layer-down", layerId: layer.layerId }); }} disabled={layer.locked}>↓</Button>
      </div>
    </div>
  );
}

export function LayersSidebar({
  state,
  dispatch,
  onCopyTransform,
  onPasteTransform,
  onOpenDiscovery,
  debugHooks,
  sectionCollapsed,
  onSectionCollapsedChange,
  scaleLinked,
  onScaleLinkedChange,
  onOpenDebugSettings,
}: Props) {
  const [search, setSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<LayerId>>(new Set());
  const filteredTree = useMemo(() => filterTree(state.layers, search), [state.layers, search]);
  const visibleRows = useMemo(() => flattenVisibleTree(filteredTree, collapsedGroups), [filteredTree, collapsedGroups]);
  const allLayers = useMemo(() => flattenVisibleTree(state.layers, new Set()).map((r) => r.layer), [state.layers]);
  const selected = state.selectedLayerIds.length === 1 ? (allLayers.find((layer) => layer.layerId === state.selectedLayerId) || null) : null;
  const selectedCount = state.selectedLayerIds.length;
  const selectedSet = new Set(state.selectedLayerIds);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftOpacity, setDraftOpacity] = useState(100);
  const [draftRotation, setDraftRotation] = useState(0);
  const [draftScaleX, setDraftScaleX] = useState(1);
  const [draftScaleY, setDraftScaleY] = useState(1);
  const [draftX, setDraftX] = useState(0);
  const [draftY, setDraftY] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(state.sidebarWidth);
  const opacityGestureRef = useRef<string | null>(null);
  const rotationGestureRef = useRef<string | null>(null);
  const [showLargeLayerWarning, setShowLargeLayerWarning] = useState(
    allLayers.length >= 30 && sessionStorage.getItem("layer-warning-dismissed") !== "true",
  );

  useEffect(() => {
    if (!selected) return;
    setDraftName(selected.name);
    setDraftOpacity(selected.opacity);
    setDraftRotation(selected.transform.rotation);
    setDraftScaleX(selected.transform.scaleX);
    setDraftScaleY(selected.transform.scaleY);
    setDraftX(selected.transform.x);
    setDraftY(selected.transform.y);
  }, [selected]);

  useEffect(() => {
    if (allLayers.length >= 30 && sessionStorage.getItem("layer-warning-dismissed") !== "true") {
      setShowLargeLayerWarning(true);
    }
  }, [allLayers.length]);

  const RowRenderer = ({ index, style }: RowComponentProps<object>) => {
    const { layer, depth } = visibleRows[index];
    return (
      <div style={style} className="px-3 py-1">
        <Row
          key={layer.layerId}
          layer={layer}
          depth={depth}
          selected={state.selectedLayerId === layer.layerId}
          selectedMany={selectedSet.has(layer.layerId)}
          collapsed={collapsedGroups.has(layer.layerId)}
          onToggleGroup={(layerId) => {
            setCollapsedGroups((prev) => {
              const next = new Set(prev);
              if (next.has(layerId)) next.delete(layerId); else next.add(layerId);
              return next;
            });
          }}
          dispatch={dispatch}
          onRename={(id, name) => dispatch({ type: "rename-layer", layerId: id, name })}
          onCopyTransform={onCopyTransform}
          onPasteTransform={onPasteTransform}
          renameRequested={state.renameTargetLayerId === layer.layerId}
        />
      </div>
    );
  };

  return (
    <aside
      className={`border border-border rounded-lg bg-card ${state.sidebarOpen ? "block" : "hidden"} md:block`}
      style={{ width: `${sidebarWidth}px`, minWidth: "220px", maxWidth: "520px" }}
      data-onboard="layers-sidebar"
    >
      <div className="border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Layers</p>
            <p className="text-xs text-muted-foreground">{allLayers.length} items</p>
          </div>
          <div className="flex items-center gap-1">
            {import.meta.env.DEV ? (
              <Button variant="ghost" size="sm" onClick={onOpenDebugSettings} title="Debug Settings" data-onboard="settings-gear">
                ⚙
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "toggle-sidebar-open" })}>−</Button>
            <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "set-sidebar-open", open: false })}>×</Button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => setShowAddMenu((v) => !v)}>+ Add Layer</Button>
          <Button size="sm" variant="outline" onClick={() => dispatch({ type: "group-selected" })} disabled={state.selectedLayerIds.length < 2}>Group</Button>
        </div>
        {debugHooks.phase3SearchFilter ? (
          <div className="mt-2">
            <Input
              placeholder="Search layers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                dispatch({ type: "phase3-set-search", value: e.target.value });
              }}
            />
          </div>
        ) : null}
        {showAddMenu ? (
          <div className="mt-2 space-y-2 rounded-md border border-border p-2">
            <Button size="sm" className="w-full justify-start" onClick={() => { dispatch({ type: "create-layer", source: "blank" }); setShowAddMenu(false); }}>
              Blank Layer
            </Button>
            <Button
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                if (state.selectedLayerId) dispatch({ type: "create-layer", source: "clone", payload: { layerId: state.selectedLayerId } });
                setShowAddMenu(false);
              }}
              disabled={!state.selectedLayerId}
            >
              Clone Selected
            </Button>
            <Button
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                onOpenDiscovery();
                setShowAddMenu(false);
              }}
            >
              From Discovery
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" disabled onClick={() => dispatch({ type: "create-layer", source: "asset" })}>
              Asset from Library (Phase Y+)
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" disabled onClick={() => dispatch({ type: "create-layer", source: "procedural" })}>
              Procedural Generator (Phase Y+)
            </Button>
          </div>
        ) : null}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => dispatch({ type: "undo" })} disabled={!state.undoStack.length}>Undo</Button>
          <Button variant="outline" size="sm" onClick={() => dispatch({ type: "redo" })} disabled={!state.redoStack.length}>Redo</Button>
        </div>
      </div>

      <div className="p-3" data-onboard="layer-list">
        {showLargeLayerWarning ? (
          <div className="mb-2 flex items-center justify-between rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800">
            <span>Large layer counts may slow preview rendering.</span>
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("layer-warning-dismissed", "true");
                setShowLargeLayerWarning(false);
              }}
            >
              ✕
            </button>
          </div>
        ) : null}
        <List
          style={{ height: Math.min(420, Math.max(160, visibleRows.length * 60)), width: "100%" }}
          rowCount={visibleRows.length}
          rowHeight={60}
          rowComponent={RowRenderer}
          rowProps={{}}
          overscanCount={3}
        />
      </div>

      <div className="border-t border-border p-3 space-y-3">
        <div data-onboard="layer-properties">
          <Collapsible open={!sectionCollapsed.properties} onOpenChange={(open) => onSectionCollapsedChange("properties", !open)}>
          <CollapsibleTrigger className="w-full flex items-center justify-between border rounded-md px-2 py-1">
            <span className="text-sm font-medium">Layer Properties</span>
            <span>{sectionCollapsed.properties ? "▶" : "▼"}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {selectedCount === 0 ? <p className="text-xs text-muted-foreground text-center py-4">Select a layer to edit properties</p> : null}
            {selectedCount > 1 ? <p className="text-xs text-muted-foreground text-center py-4">Select 1 layer for details</p> : null}
            {selected ? (
              <>
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={() => dispatch({ type: "rename-layer", layerId: selected.layerId, name: draftName })}
                    onKeyDown={(e) => { if (e.key === "Enter") dispatch({ type: "rename-layer", layerId: selected.layerId, name: draftName }); }}
                    disabled={selected.locked}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between border rounded-md px-2 py-1">
                    <Label className="text-xs">Visible</Label>
                    <Switch checked={selected.visible} onCheckedChange={() => dispatch({ type: "toggle-visible", layerId: selected.layerId })} disabled={selected.locked} />
                  </div>
                  <div className="flex items-center justify-between border rounded-md px-2 py-1">
                    <Label className="text-xs">Locked</Label>
                    <Switch checked={selected.locked} onCheckedChange={() => dispatch({ type: "toggle-locked", layerId: selected.layerId })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Opacity: {Math.round(draftOpacity)}%</Label>
                  <Slider
                    value={[draftOpacity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([v]) => {
                      if (selected.locked) return;
                      setDraftOpacity(v);
                      if (!opacityGestureRef.current) {
                        const id = `gesture-opacity-${selected.layerId}-${Date.now()}`;
                        opacityGestureRef.current = id;
                        dispatch({ type: "begin-gesture", kind: "opacity", gestureId: id });
                      }
                      dispatch({ type: "set-opacity", layerId: selected.layerId, opacity: v });
                    }}
                    onValueCommit={([v]) => {
                      if (selected.locked) return;
                      dispatch({ type: "set-opacity", layerId: selected.layerId, opacity: v });
                      dispatch({ type: "end-gesture" });
                      opacityGestureRef.current = null;
                    }}
                    disabled={selected.locked}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Blend Mode</Label>
                  <Select value={selected.blendMode} onValueChange={(v) => dispatch({ type: "set-blend-mode", layerId: selected.layerId, blendMode: v as BlendMode })} disabled={selected.locked}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PHASE1_BLENDS.map((mode) => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
                      {debugHooks.phase2AdvancedBlendModes ? PHASE2_ADV_BLEND_MODES.map((mode) => <SelectItem key={mode} value={mode}>{mode}</SelectItem>) : null}
                    </SelectContent>
                  </Select>
                </div>
                {selected.content.type === "asset-symbol" ? (
                  <div className="space-y-2 rounded-md border border-border p-2">
                    <p className="text-xs font-medium">Asset Recolor</p>
                    <div className="space-y-1">
                      <Label>Target Color</Label>
                      <Input
                        type="color"
                        value={selected.content.recolor.targetColor}
                        onChange={(e) => dispatch({
                          type: "set-asset-recolor",
                          layerId: selected.layerId,
                          recolor: { targetColor: e.target.value },
                        })}
                        disabled={selected.locked}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Scope</Label>
                      <Select
                        value={selected.content.recolor.scope}
                        onValueChange={(v) => dispatch({
                          type: "set-asset-recolor",
                          layerId: selected.layerId,
                          recolor: { scope: v as "black-only" | "grayscale" },
                        })}
                        disabled={selected.locked}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grayscale">grayscale</SelectItem>
                          <SelectItem value="black-only">black-only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
          </CollapsibleContent>
          </Collapsible>
        </div>

        <div data-onboard="layer-transform">
          <Collapsible
            open={!sectionCollapsed.transform}
            onOpenChange={(open) => onSectionCollapsedChange("transform", !open)}
          >
          <CollapsibleTrigger className="w-full flex items-center justify-between border rounded-md px-2 py-1">
            <span className="text-sm font-medium">Transform</span>
            <span>{sectionCollapsed.transform ? "▶" : "▼"}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {selected && selected.content.type !== "group" ? (
              <>
                <div className="space-y-1">
                  <Label>Rotation: {draftRotation.toFixed(0)}°</Label>
                  <Slider
                    value={[draftRotation]}
                    min={-180}
                    max={180}
                    step={1}
                    onValueChange={([v]) => {
                      if (selected.locked) return;
                      setDraftRotation(v);
                      if (!rotationGestureRef.current) {
                        const id = `gesture-rotation-${selected.layerId}-${Date.now()}`;
                        rotationGestureRef.current = id;
                        dispatch({ type: "begin-gesture", kind: "rotation", gestureId: id });
                      }
                      dispatch({ type: "set-rotation", layerId: selected.layerId, rotation: v });
                    }}
                    onValueCommit={([v]) => {
                      if (selected.locked) return;
                      dispatch({ type: "set-rotation", layerId: selected.layerId, rotation: v });
                      dispatch({ type: "end-gesture" });
                      rotationGestureRef.current = null;
                    }}
                    disabled={selected.locked}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Scale X</Label>
                    <Input
                      type="number"
                      value={draftScaleX}
                      step={0.05}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDraftScaleX(val);
                        if (scaleLinked) setDraftScaleY(val);
                      }}
                      onBlur={() => dispatch({ type: "set-scale", layerId: selected.layerId, scaleX: draftScaleX, scaleY: scaleLinked ? draftScaleX : draftScaleY })}
                      disabled={selected.locked}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Scale Y</Label>
                    <Input
                      type="number"
                      value={draftScaleY}
                      step={0.05}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDraftScaleY(val);
                        if (scaleLinked) setDraftScaleX(val);
                      }}
                      onBlur={() => dispatch({ type: "set-scale", layerId: selected.layerId, scaleX: scaleLinked ? draftScaleY : draftScaleX, scaleY: draftScaleY })}
                      disabled={selected.locked}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Button variant="ghost" size="sm" onClick={() => onScaleLinkedChange(!scaleLinked)} disabled={selected.locked}>
                    {scaleLinked ? "🔗 Linked" : "⛓ Unlinked"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>X</Label>
                    <Input
                      type="number"
                      value={draftX}
                      onChange={(e) => setDraftX(Number(e.target.value))}
                      onBlur={() => dispatch({ type: "set-position", layerId: selected.layerId, x: draftX, y: draftY })}
                      disabled={selected.locked}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Y</Label>
                    <Input
                      type="number"
                      value={draftY}
                      onChange={(e) => setDraftY(Number(e.target.value))}
                      onBlur={() => dispatch({ type: "set-position", layerId: selected.layerId, x: draftX, y: draftY })}
                      disabled={selected.locked}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Transform Origin</Label>
                  <Select
                    value={selected.transform.transformOrigin}
                    onValueChange={(v) => dispatch({ type: "set-transform-origin", layerId: selected.layerId, transformOrigin: v as LayerItem["transform"]["transformOrigin"] })}
                    disabled={selected.locked}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TRANSFORM_ORIGINS.map((origin) => <SelectItem key={origin} value={origin}>{origin}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => onCopyTransform(selected.layerId)}>
                    Copy Transform
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onPasteTransform(selected.layerId)} disabled={selected.locked}>
                    Paste Transform
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => dispatch({ type: "reset-transform", layerId: selected.layerId })} disabled={selected.locked}>
                  Reset Transform
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-3">Select a non-group layer for transform controls</p>
            )}
          </CollapsibleContent>
          </Collapsible>
        </div>

        <div data-onboard="batch-ops">
          <Collapsible open={!sectionCollapsed.batchOps} onOpenChange={(open) => onSectionCollapsedChange("batchOps", !open)}>
          <CollapsibleTrigger className="w-full flex items-center justify-between border rounded-md px-2 py-1">
            <span className="text-sm font-medium">Batch Operations</span>
            <span>{sectionCollapsed.batchOps ? "▶" : "▼"}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {selectedCount === 0 ? <p className="text-sm text-muted-foreground">Select layers to batch edit</p> : null}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => dispatch({ type: "batch-set-visible", visible: true })} disabled={selectedCount < 2}>Show All</Button>
              <Button variant="outline" size="sm" onClick={() => dispatch({ type: "batch-set-visible", visible: false })} disabled={selectedCount < 2}>Hide All</Button>
              <Button variant="outline" size="sm" onClick={() => dispatch({ type: "batch-set-opacity", opacity: 50 })} disabled={selectedCount < 2}>Set to 50% Opacity</Button>
              <Button variant="outline" size="sm" onClick={() => dispatch({ type: "batch-set-blend", blendMode: "overlay" })} disabled={selectedCount < 2}>Set Blend to Overlay</Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (selectedCount < 1) return;
                  if (window.confirm("Delete selected layers?")) dispatch({ type: "batch-delete" });
                }}
                disabled={selectedCount < 1}
              >
                Delete Selected
              </Button>
              <div className="flex items-center gap-2 rounded-md border px-2">
                <Label className="text-xs">Auto-hide</Label>
                <Switch checked={state.sidebarAutoHide} onCheckedChange={(v) => dispatch({ type: "set-sidebar-autohide", enabled: v })} />
              </div>
            </div>
          </CollapsibleContent>
          </Collapsible>
        </div>

        <div data-onboard="templates">
          {debugHooks.phase3Templates ? (
            <Collapsible open={!sectionCollapsed.templates} onOpenChange={(open) => onSectionCollapsedChange("templates", !open)}>
            <CollapsibleTrigger className="w-full flex items-center justify-between border rounded-md px-2 py-1">
              <span className="text-sm font-medium">Templates</span>
              <span>{sectionCollapsed.templates ? "▶" : "▼"}</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => dispatch({ type: "phase3-apply-template", templateId: "heraldic-duo" })}>
                  Heraldic Duo
                </Button>
                <Button variant="outline" size="sm" onClick={() => dispatch({ type: "phase3-apply-template", templateId: "mystic-triad" })}>
                  Mystic Triad
                </Button>
                <Button variant="outline" size="sm" onClick={() => dispatch({ type: "phase3-apply-template", templateId: "war-sigil" })}>
                  War Sigil
                </Button>
              </div>
            </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">
              Templates are disabled. Enable `phase3Templates` in Settings.
            </div>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Sidebar Width</Label>
          <Slider
            value={[sidebarWidth]}
            min={220}
            max={520}
            step={10}
            onValueChange={([v]) => setSidebarWidth(v)}
            onValueCommit={([v]) => dispatch({ type: "set-sidebar-width", width: v })}
          />
        </div>
      </div>
    </aside>
  );
}
