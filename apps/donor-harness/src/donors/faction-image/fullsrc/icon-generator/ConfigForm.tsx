import React, { useState } from "react";
import type {
  ColorChannel,
  ColorOwner,
  ColorPresetKey,
  Complexity,
  IconConfig,
  LayerType,
  MainSymbolType,
  Mood,
  SymmetryId,
  BackgroundShape,
} from "./types";
import { SUPPORTED_SYMMETRY_IDS, SYMMETRY_DEFINITIONS } from "./symmetryDefinitions";
import { getSymmetryCompatibility } from "./symmetryCompatibility";
import { getDomainSymmetrySuggestions } from "./domainSymmetryAffinities";
import { FACTION_DOMAINS, DOMAIN_COLORS, type FactionDomain } from "./domainPalettes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const SHAPES: LayerType[] = [
  "circle", "triangle", "square", "diamond", "pentagon",
  "eye", "sun", "moon", "serpent", "hand", "cross",
];
const MOODS: Mood[] = ["stark", "ornate", "warlike", "mystic", "gentle", "corrupt"];
const BG_SHAPES: BackgroundShape[] = ["circle", "square", "shield", "diamond"];
const MAIN_SYMBOLS: MainSymbolType[] = ["none", "eye", "hammer", "shield", "mandala", "rune", "beast", "star", "crown"];
const COLOR_PRESETS: ColorPresetKey[] = ["domain", "default", "high-contrast", "muted", "vivid", "monochrome"];
const COMPLEXITY_LABELS: Record<Complexity, string> = {
  1: "Minimal",
  2: "Simple",
  3: "Standard",
  4: "Complex",
  5: "Ornate",
};

const OWNER_ICON: Record<ColorOwner, string> = {
  domain: "🌐",
  preset: "🎨",
  manual: "✏️",
};

interface ConfigFormProps {
  value: IconConfig;
  locked: boolean;
  onChange: (c: IconConfig) => void;
  onDomainChange: (domain?: FactionDomain) => void;
  onApplyPreset: (preset: ColorPresetKey, applyToAll: boolean) => void;
  onManualColorChange: (channel: ColorChannel, value: string) => void;
  onResetDomainColors: () => void;
  onResetPresetColors: () => void;
  onGenerate: () => void;
  onRegenerateSame: () => void;
  onToggleLock: (v: boolean) => void;
  onRandomize: () => void;
  composeRings: boolean;
  composeHalo: boolean;
  composeDust: boolean;
  onComposeRingsChange: (v: boolean) => void;
  onComposeHaloChange: (v: boolean) => void;
  onComposeDustChange: (v: boolean) => void;
  sectionCollapsed: { generate: boolean; style: boolean };
  onSectionCollapsedChange: (section: "generate" | "style", collapsed: boolean) => void;
}

function OwnerLabel({ owner, text }: { owner: ColorOwner; text: string }) {
  return <Label className="text-xs">{OWNER_ICON[owner]} {text}</Label>;
}

export function ConfigForm({
  value,
  locked,
  onChange,
  onDomainChange,
  onApplyPreset,
  onManualColorChange,
  onResetDomainColors,
  onResetPresetColors,
  onGenerate,
  onRegenerateSame,
  onToggleLock,
  onRandomize,
  composeRings,
  composeHalo,
  composeDust,
  onComposeRingsChange,
  onComposeHaloChange,
  onComposeDustChange,
  sectionCollapsed,
  onSectionCollapsedChange,
}: ConfigFormProps) {
  const [applyPresetToAll, setApplyPresetToAll] = useState(false);
  const set = <K extends keyof IconConfig>(key: K, val: IconConfig[K]) => onChange({ ...value, [key]: val });
  const complexity = (value.complexity ?? 3) as Complexity;
  const symmetryCompatibility = getSymmetryCompatibility(value.symmetry || "none", value.baseShape);
  const symmetrySuggestions = getDomainSymmetrySuggestions(value.domain);
  const primarySuggested = symmetrySuggestions.primary;
  const secondarySuggested = new Set(symmetrySuggestions.secondary);
  const groupedSymmetries = {
    none: SUPPORTED_SYMMETRY_IDS.filter((id) => SYMMETRY_DEFINITIONS[id].category === "none"),
    mirror: SUPPORTED_SYMMETRY_IDS.filter((id) => SYMMETRY_DEFINITIONS[id].category === "mirror"),
    rotational: SUPPORTED_SYMMETRY_IDS.filter((id) => SYMMETRY_DEFINITIONS[id].category === "rotational"),
    radial: SUPPORTED_SYMMETRY_IDS.filter((id) => SYMMETRY_DEFINITIONS[id].category === "radial"),
    hybrid: SUPPORTED_SYMMETRY_IDS.filter((id) => SYMMETRY_DEFINITIONS[id].category === "hybrid"),
  };
  const owners = value.ownerByChannel || {
    primaryColor: "domain",
    secondaryColor: "domain",
    accentColor: "domain",
    backgroundColor: "domain",
  };

  return (
    <div className="space-y-4">
      <Collapsible
        open={!sectionCollapsed.generate}
        onOpenChange={(open) => onSectionCollapsedChange("generate", !open)}
      >
        <CollapsibleTrigger className="w-full flex items-center justify-between rounded-md border border-border px-3 py-2 text-left">
          <span className="font-medium">Frame</span>
          <span aria-hidden>{sectionCollapsed.generate ? "▶" : "▼"}</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-5">
          <div className="space-y-2" data-onboard="seed">
            <Label>Seed</Label>
            <div className="flex gap-2">
              <Input
                value={value.seed || ""}
                onChange={(e) => set("seed", e.target.value)}
                placeholder="Auto-generated"
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={onRandomize}>
                🎲
              </Button>
            </div>
          </div>

          <div className="space-y-2" data-onboard="domain">
            <Label>Domain</Label>
            <Select value={value.domain || "__none__"} onValueChange={(v) => onDomainChange(v === "__none__" ? undefined : (v as FactionDomain))}>
              <SelectTrigger><SelectValue placeholder="None (manual colors)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None (manual colors)</SelectItem>
                {FACTION_DOMAINS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {DOMAIN_COLORS[d].label} - {DOMAIN_COLORS[d].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2" data-onboard="complexity">
            <Label>Complexity: {complexity} - {COMPLEXITY_LABELS[complexity]}</Label>
            <Slider min={1} max={5} step={1} value={[complexity]} onValueChange={([v]) => set("complexity", v as Complexity)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Base Shape</Label>
              <Select value={value.baseShape || ""} onValueChange={(v) => set("baseShape", v as LayerType)}>
                <SelectTrigger><SelectValue placeholder="Random" /></SelectTrigger>
                <SelectContent>
                  {SHAPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2" data-onboard="composition">
              <Label>Composition Toggles</Label>
              <div className="space-y-2 rounded-md border border-border p-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Ornamental Ring</Label>
                  <Switch checked={composeRings} onCheckedChange={onComposeRingsChange} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Halo Wash</Label>
                  <Switch checked={composeHalo} onCheckedChange={onComposeHaloChange} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Glyph Dust</Label>
                  <Switch checked={composeDust} onCheckedChange={onComposeDustChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2" data-onboard="generate-actions">
            <Button onClick={onGenerate}>Generate Frame</Button>
            <Button variant="outline" onClick={onRegenerateSame}>Regenerate Frame</Button>
          </div>
          <div className="flex items-center justify-between">
            <Label>Seed Lock</Label>
            <Switch checked={locked} onCheckedChange={onToggleLock} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={!sectionCollapsed.style}
        onOpenChange={(open) => onSectionCollapsedChange("style", !open)}
      >
        <CollapsibleTrigger className="w-full flex items-center justify-between rounded-md border border-border px-3 py-2 text-left">
          <span className="font-medium">Style</span>
          <span aria-hidden>{sectionCollapsed.style ? "▶" : "▼"}</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-5">
          <div className="space-y-2" data-onboard="symmetry">
            <Label>Mood</Label>
            <Select value={value.mood || ""} onValueChange={(v) => set("mood", v as Mood)}>
              <SelectTrigger><SelectValue placeholder="stark" /></SelectTrigger>
              <SelectContent>
                {MOODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Symmetry</Label>
              {primarySuggested ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => set("symmetry", primarySuggested)}
                >
                  Use Recommended
                </Button>
              ) : null}
            </div>
            <Select value={value.symmetry || "none"} onValueChange={(v) => set("symmetry", v as SymmetryId)}>
              <SelectTrigger><SelectValue placeholder="none" /></SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">None</div>
                {groupedSymmetries.none.map((s) => (
                  <SelectItem key={s} value={s}>{SYMMETRY_DEFINITIONS[s].displayName}</SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Mirror</div>
                {groupedSymmetries.mirror.map((s) => (
                  <SelectItem key={s} value={s}>
                    {SYMMETRY_DEFINITIONS[s].displayName}
                    {primarySuggested === s ? " (recommended)" : secondarySuggested.has(s) ? " (good fit)" : ""}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Rotation</div>
                {groupedSymmetries.rotational.map((s) => (
                  <SelectItem key={s} value={s}>
                    {SYMMETRY_DEFINITIONS[s].displayName}
                    {primarySuggested === s ? " (recommended)" : secondarySuggested.has(s) ? " (good fit)" : ""}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Radial</div>
                {groupedSymmetries.radial.map((s) => (
                  <SelectItem key={s} value={s}>
                    {SYMMETRY_DEFINITIONS[s].displayName}
                    {primarySuggested === s ? " (recommended)" : secondarySuggested.has(s) ? " (good fit)" : ""}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Hybrid</div>
                {groupedSymmetries.hybrid.map((s) => (
                  <SelectItem key={s} value={s}>
                    {SYMMETRY_DEFINITIONS[s].displayName}
                    {primarySuggested === s ? " (recommended)" : secondarySuggested.has(s) ? " (good fit)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {primarySuggested && value.domain ? (
              <p className="text-xs text-muted-foreground">
                Recommended for {DOMAIN_COLORS[value.domain].label}: {SYMMETRY_DEFINITIONS[primarySuggested].displayName}
                {value.symmetry === primarySuggested ? " (active)" : ""}
              </p>
            ) : null}
            {symmetryCompatibility === "warn" ? (
              <p className="text-xs text-amber-600">
                Warning: this base shape may look odd with the selected symmetry. You can still use it.
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4" data-onboard="symbol-setup">
            <div className="space-y-2">
              <Label>Main Symbol</Label>
              <Select value={value.mainSymbol || "none"} onValueChange={(v) => set("mainSymbol", v as MainSymbolType)}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  {MAIN_SYMBOLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Background Shape</Label>
              <Select value={value.backgroundShape || ""} onValueChange={(v) => set("backgroundShape", v as BackgroundShape)}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  {BG_SHAPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2" data-onboard="style-sliders">
            <Label>Layer Count: {value.layerCount ?? "Auto"}</Label>
            <Slider min={1} max={8} step={1} value={[value.layerCount ?? 3]} onValueChange={([v]) => set("layerCount", v)} />
            <Label>Stroke Width: {value.strokeWidth ?? 2}</Label>
            <Slider min={1} max={5} step={0.5} value={[value.strokeWidth ?? 2]} onValueChange={([v]) => set("strokeWidth", v)} />
          </div>

          <div className="space-y-2 border border-border rounded-md p-3" data-onboard="color-preset">
            <Label>Color Preset</Label>
            <Select value={value.colorPresetKey || "domain"} onValueChange={(v) => onApplyPreset(v as ColorPresetKey, applyPresetToAll)}>
              <SelectTrigger><SelectValue placeholder="Choose a preset" /></SelectTrigger>
              <SelectContent>
                {COLOR_PRESETS.map((preset) => <SelectItem key={preset} value={preset}>{preset}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Apply Preset To All</Label>
              <Switch checked={applyPresetToAll} onCheckedChange={setApplyPresetToAll} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={onResetDomainColors}>Reset Domain Colors</Button>
              <Button variant="outline" size="sm" onClick={onResetPresetColors} disabled={!value.colorPresetKey || value.colorPresetKey === "domain"}>
                Reset Preset Colors
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3" data-onboard="color-channels">
            <div className="space-y-1">
              <OwnerLabel owner={owners.primaryColor} text="Primary" />
              <Input type="color" value={value.primaryColor || "#1a1a2e"} onChange={(e) => onManualColorChange("primaryColor", e.target.value)} className="h-9 p-1 cursor-pointer" />
            </div>
            <div className="space-y-1">
              <OwnerLabel owner={owners.secondaryColor} text="Secondary" />
              <Input type="color" value={value.secondaryColor || "#16213e"} onChange={(e) => onManualColorChange("secondaryColor", e.target.value)} className="h-9 p-1 cursor-pointer" />
            </div>
            <div className="space-y-1">
              <OwnerLabel owner={owners.accentColor} text="Accent" />
              <Input type="color" value={value.accentColor || "#e94560"} onChange={(e) => onManualColorChange("accentColor", e.target.value)} className="h-9 p-1 cursor-pointer" />
            </div>
            <div className="space-y-1">
              <OwnerLabel owner={owners.backgroundColor} text="Background" />
              <Input type="color" value={value.backgroundColor || "#0f3460"} onChange={(e) => onManualColorChange("backgroundColor", e.target.value)} className="h-9 p-1 cursor-pointer" />
            </div>
          </div>

          <div className="space-y-2" data-onboard="size-text">
            <Label>Size: {value.size ?? 128}px</Label>
            <Slider min={64} max={512} step={16} value={[value.size ?? 128]} onValueChange={([v]) => set("size", v)} />
            <div className="flex items-center gap-3">
              <Switch checked={value.includeText ?? false} onCheckedChange={(v) => set("includeText", v)} />
              <Label>Include Text</Label>
              {value.includeText && (
                <Input value={value.textChar || ""} onChange={(e) => set("textChar", e.target.value.slice(0, 3))} placeholder="Ω" className="w-16" maxLength={3} />
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
