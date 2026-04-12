import Index from "@/pages/Index";

export function DashboardWorkspace() {
  return (
    <section className="flex-1 min-w-0 overflow-auto">
      <div className="p-4 border-b border-border bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Workspace mode uses the same generator engine with dashboard framing and diagnostics.
        </p>
      </div>
      <Index />
    </section>
  );
}

