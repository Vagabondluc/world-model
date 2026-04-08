import { useLocation } from "react-router-dom";
import { resolveRouteContext } from "@/taxonomy/config";
import { useAppStore } from "@/state/app-store";

export function BottomDrawer() {
  const { state } = useAppStore();
  const location = useLocation();
  const routeContext = resolveRouteContext(location.pathname);

  return (
    <div className="panel-body stack">
      <div className="panel-header">
        <h2>Bottom drawer</h2>
        <span className="pill">Overlay state only</span>
      </div>
      <div className="status-grid">
        <div className="status-row">
          <span>Taxonomy</span>
          <span>{routeContext.family}</span>
        </div>
        <div className="status-row">
          <span>Selected world</span>
          <span>{state.overlay.selectedWorldId ?? "none"}</span>
        </div>
        <div className="status-row">
          <span>Selected entity</span>
          <span>{state.overlay.selectedEntityId ?? "none"}</span>
        </div>
        <div className="status-row">
          <span>Active modal</span>
          <span>{state.overlay.activeModal ?? "none"}</span>
        </div>
      </div>
    </div>
  );
}
