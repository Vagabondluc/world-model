import type { ReactNode } from "react";
import { BottomDrawer } from "@/shell/BottomDrawer";
import { ContextBar } from "@/shell/ContextBar";
import { Inspector } from "@/shell/Inspector";
import { Navigation } from "@/shell/Navigation";
import { useAppStore } from "@/state/app-store";

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useAppStore();

  return (
    <div className="app-shell">
      <Navigation />
      <section className="shell-top panel" aria-label="top context bar">
        <ContextBar />
      </section>
      <main className="shell-workspace panel" aria-label="workspace">
        {children}
      </main>
      <aside className="shell-inspector panel" aria-label="inspector">
        <Inspector />
      </aside>
      {state.overlay.drawerOpen ? (
        <footer className="shell-drawer panel" aria-label="bottom drawer">
          <BottomDrawer />
        </footer>
      ) : null}
    </div>
  );
}
