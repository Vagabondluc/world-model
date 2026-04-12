export function DashboardSidebarRail() {
  return (
    <aside className="hidden xl:block w-72 border-r border-border bg-card/40">
      <div className="p-4 space-y-4">
        <h2 className="text-sm font-semibold">Dashboard Rail</h2>
        <p className="text-xs text-muted-foreground">
          Dashboard-only chrome. Core icon generation remains in the shared workspace.
        </p>
        <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
          Phase 2+: analytics widgets and role-aware controls.
        </div>
      </div>
    </aside>
  );
}

