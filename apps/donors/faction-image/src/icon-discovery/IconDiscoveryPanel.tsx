import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDiscovery } from "./DiscoveryContext";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLayer: (payload: {
    assetId: string;
    assetPath: string;
    sourceHash: string;
    recolor: { targetColor: string; brightness: number; saturation: number; opacity: number; scope: "black-only" | "grayscale" };
    quality: number;
    warnings: string[];
  }) => void;
};

export function IconDiscoveryPanel({ open, onOpenChange, onAddLayer }: Props) {
  const { state, setQuery, setSelected, setRecolor } = useDiscovery();
  const [visibleCount, setVisibleCount] = React.useState(50);
  const visibleItems = state.results.slice(0, visibleCount);
  React.useEffect(() => {
    setVisibleCount(50);
  }, [state.query, state.category, state.domain]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Icon Discovery</DialogTitle>
          <DialogDescription>Search, recolor preview, then add as a layer.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-[1fr_1fr] gap-4">
          <div className="space-y-3">
            <Input
              placeholder="Search icons..."
              value={state.query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {state.loading ? "Searching..." : `${state.results.length} results in ${state.elapsedMs.toFixed(1)}ms`}
            </p>
            <div className="max-h-[50vh] overflow-auto space-y-2 border border-border rounded-md p-2">
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className={`w-full text-left rounded border px-2 py-2 ${state.selected?.id === item.id ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className="font-medium text-sm">{item.id}</div>
                  <div className="text-xs text-muted-foreground">{item.keywords.slice(0, 5).join(", ")}</div>
                </button>
              ))}
              {state.results.length > visibleItems.length ? (
                <Button variant="outline" className="w-full" onClick={() => setVisibleCount((n) => n + 50)}>
                  Load More
                </Button>
              ) : null}
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-md border border-border p-3 space-y-2">
              <Label>Target Color</Label>
              <Input type="color" value={state.recolor.targetColor} onChange={(e) => setRecolor({ targetColor: e.target.value })} />
              <Label>Recolor Scope</Label>
              <Select value={state.recolor.scope} onValueChange={(v) => setRecolor({ scope: v as "black-only" | "grayscale" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                  <SelectItem value="black-only">Black-only</SelectItem>
                </SelectContent>
              </Select>
              <Label>Brightness: {state.recolor.brightness.toFixed(2)}</Label>
              <Slider min={0.2} max={2} step={0.05} value={[state.recolor.brightness]} onValueChange={([v]) => setRecolor({ brightness: v })} />
              <Label>Saturation: {state.recolor.saturation.toFixed(2)}</Label>
              <Slider min={0.2} max={2} step={0.05} value={[state.recolor.saturation]} onValueChange={([v]) => setRecolor({ saturation: v })} />
              <Label>Opacity: {state.recolor.opacity.toFixed(2)}</Label>
              <Slider min={0} max={1} step={0.05} value={[state.recolor.opacity]} onValueChange={([v]) => setRecolor({ opacity: v })} />
            </div>
            <div className="rounded-md border border-border p-3 min-h-[220px]">
              {state.preview?.success ? (
                <div
                  className="w-full h-full [&>svg]:max-w-full [&>svg]:max-h-[220px]"
                  dangerouslySetInnerHTML={{ __html: state.preview.svg }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Select an icon to preview recolor.</p>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Quality: {state.preview?.quality ?? "-"} | Warnings: {(state.preview?.warnings || []).join(", ") || "none"}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button
                disabled={!state.selected || !state.preview?.success}
                onClick={() => {
                  if (!state.selected || !state.preview) return;
                  const sourceHash = `${state.selected.id}:${JSON.stringify(state.recolor)}`;
                  onAddLayer({
                    assetId: state.selected.id,
                    assetPath: state.selected.assetPath,
                    sourceHash,
                    recolor: state.recolor,
                    quality: state.preview.quality,
                    warnings: state.preview.warnings,
                  });
                  onOpenChange(false);
                }}
              >
                Add as Layer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
