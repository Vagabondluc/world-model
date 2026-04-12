export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card/70 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-6 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
          <h1 className="text-lg font-semibold">Sacred Sigil Operations</h1>
        </div>
        <div className="text-xs text-muted-foreground">
          Distinct endpoint: <code>/dashboard.html</code>
        </div>
      </div>
    </header>
  );
}

