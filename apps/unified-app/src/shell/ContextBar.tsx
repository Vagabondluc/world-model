import { useLocation } from "react-router-dom";
import { FileBundleInput } from "@/components/FileBundleInput";
import { DONOR_DEFINITIONS, isDonorId } from "@/donors/config";
import { getTaxonomyDefinition, resolveRouteContext } from "@/taxonomy/config";
import { useAppStore } from "@/state/app-store";

export function ContextBar() {
  const { state, saveBundleText, resetBundle } = useAppStore();
  const location = useLocation();
  const worldLabel = state.overlay.selectedWorldId ?? "No selected world";
  const entityLabel = state.overlay.selectedEntityId ?? "No selected entity";
  const donorMatch = location.pathname.match(/^\/donor\/([^/]+)$/);
  const donorId = donorMatch?.[1] ?? null;
  const resolvedDonor = donorId !== null && isDonorId(donorId) ? donorId : null;
  const isDonorRoute = resolvedDonor !== null;
  const isDonorCompare = location.pathname === "/compare/donors";
  const isProductCompare = location.pathname === "/compare";
  const isHome = location.pathname === "/";

  let title = "";
  let subtitle = "";
  if (isHome) {
    title = "Unified product / Home";
    subtitle = "Bundle-aware landing page";
  } else if (isDonorRoute) {
    const definition = DONOR_DEFINITIONS[resolvedDonor];
    title = `${definition.label} / Donor`;
    subtitle = `${definition.classification} · donor rehost route`;
  } else if (isDonorCompare) {
    title = "Compare / Donors";
    subtitle = "Internal donor comparison route";
  } else if (isProductCompare) {
    title = "Compare / Product";
    subtitle = "Shared concepts, journeys, and language boundary";
  } else {
    const routeContext = resolveRouteContext(location.pathname);
    const taxonomy = getTaxonomyDefinition(routeContext.family);
    const tabDefinition = taxonomy.tabs.find((entry) => entry.key === routeContext.tab) ?? taxonomy.tabs[0];
    title = `${taxonomy.label} / ${tabDefinition.label}`;
    subtitle = `${routeContext.prototype ? "Prototype route" : "Public route"}${routeContext.legacy ? " · legacy alias" : ""}`;
  }

  return (
    <>
      <div className="context-stack">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="context-pills">
        <span className="pill">Contract {state.canonical.contractVersion}</span>
        <span className="pill">{state.canonical.dirty ? "Dirty" : "Saved"}</span>
        <span className="pill">Worlds {state.canonical.bundle.world ? 1 : 0}</span>
        <span className="pill">Entities {Object.keys(state.canonical.bundle.entities).length}</span>
        <span className="pill">World {worldLabel}</span>
        <span className="pill">Entity {entityLabel}</span>
      </div>
      <div className="context-pills">
        <FileBundleInput />
        <button
          type="button"
          className="secondary"
          onClick={() => {
            const text = saveBundleText();
            const blob = new Blob([text], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "canonical-bundle.json";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
        >
          Save bundle
        </button>
        <button type="button" className="ghost" onClick={resetBundle}>
          Reset
        </button>
      </div>
    </>
  );
}
