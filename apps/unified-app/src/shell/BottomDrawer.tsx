import { useAppStore } from "@/state/app-store";

export function BottomDrawer() {
  const { state } = useAppStore();

  return (
    <div className="panel-body stack">
      <div className="panel-header">
        <h2>Bottom drawer</h2>
        <span className="pill">Overlay state only</span>
      </div>
      <div className="status-grid">
        <div className="status-row">
          <span>Mode</span>
          <span>{state.overlay.mode}</span>
        </div>
        <div className="status-row">
          <span>Selected world</span>
          <span>{state.overlay.selectedWorldId ?? "none"}</span>
        </div>
        <div className="status-row">
          <span>Selected entity</span>
          <span>{state.overlay.selectedEntityId ?? "none"}</span>
        </div>
      </div>
    </div>
  );
}
