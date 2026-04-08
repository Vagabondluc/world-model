import { NavLink, useLocation } from "react-router-dom";
import {
  defaultRouteForFamily,
  getTaxonomyDefinition,
  resolveRouteContext,
  routeForTab,
  type TaxonomyFamily
} from "@/taxonomy/config";
import { useAppStore } from "@/state/app-store";

const FAMILY_ORDER: TaxonomyFamily[] = ["role", "task", "flow"];

export function Navigation() {
  const location = useLocation();
  const { state, setDrawerOpen, openModal } = useAppStore();
  const context = resolveRouteContext(location.pathname);
  const activeFamily = context.family;
  const activeFamilyDefinition = getTaxonomyDefinition(activeFamily);

  return (
    <nav className="shell-nav panel" aria-label="left navigation">
      <div className="brand">
        <h1>Unified App</h1>
        <p>Canonical shell for world-model bundles, modal tools, and taxonomy prototypes.</p>
      </div>

      <div className="stack">
        <p className="eyebrow">Taxonomy families</p>
        <div className="nav-links nav-links-row" aria-label="taxonomy families">
          {FAMILY_ORDER.map((family) => {
            const definition = getTaxonomyDefinition(family);
            return (
              <NavLink
                key={family}
                to={defaultRouteForFamily(family)}
                className={({ isActive }) => `nav-link nav-family${isActive || activeFamily === family ? " is-active" : ""}`}
              >
                <span>{definition.label}</span>
                <span className="nav-meta">{definition.description}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="stack">
        <p className="eyebrow">{activeFamilyDefinition.label} tabs</p>
        <div className="nav-links">
          {activeFamilyDefinition.tabs.map((tab) => (
            <NavLink
              key={tab.key}
              to={routeForTab(activeFamily, tab.key)}
              className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
            >
              <span>{tab.label}</span>
              <span className="nav-meta">{tab.hint}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="stack">
        <p className="eyebrow">Tools</p>
        <div className="nav-links nav-links-row" aria-label="tools menu">
          {[
            ["Create world", "create-world"],
            ["Create entity", "create-entity"],
            ["Markov name", "markov-name"],
            ["City generator", "city-generator"],
            ["Import preview", "import-preview"],
            ["Migration report", "migration-report-viewer"]
          ].map(([label, modal]) => (
            <button key={modal} type="button" className="ghost nav-tool" onClick={() => openModal(modal as Parameters<typeof openModal>[0])}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="stack">
        {[
          ["Selected world", state.overlay.selectedWorldId ?? "none"],
          ["Selected entity", state.overlay.selectedEntityId ?? "none"]
        ].map(([label, value]) => (
          <div key={label} className="status-row">
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="stack">
        <button type="button" className="ghost" onClick={() => setDrawerOpen(!state.overlay.drawerOpen)}>
          {state.overlay.drawerOpen ? "Hide drawer" : "Show drawer"}
        </button>
      </div>
    </nav>
  );
}
