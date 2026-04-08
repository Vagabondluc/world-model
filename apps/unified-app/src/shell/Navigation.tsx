import { NavLink, useLocation } from "react-router-dom";
import { DONOR_ORDER, DONOR_DEFINITIONS } from "@/donors/config";
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

  return (
    <nav className="shell-nav panel" aria-label="left navigation">
      <div className="brand">
        <h1>Unified App</h1>
        <p>Canonical shell for public product routes, donor rehosts, modal tools, and prototype families.</p>
        <NavLink to="/" className="nav-link nav-family">
          <span>Product home</span>
          <span className="nav-meta">Unified landing page</span>
        </NavLink>
        <NavLink to="/compare" className="nav-link nav-family">
          <span>Compare product</span>
          <span className="nav-meta">Shared concept views</span>
        </NavLink>
        <NavLink to="/compare/donors" className="nav-link nav-family">
          <span>Compare donors</span>
          <span className="nav-meta">Faithful donor rehosts</span>
        </NavLink>
      </div>

      <div className="stack">
        <p className="eyebrow">Public product</p>
        <NavLink to={defaultRouteForFamily("role")} className="nav-link nav-family">
          <span>World / Story / Schema</span>
          <span className="nav-meta">Active public surface</span>
        </NavLink>
        <div className="nav-links" aria-label="public product tabs">
          {getTaxonomyDefinition("role").tabs.map((tab) => (
            <NavLink
              key={tab.key}
              to={routeForTab("role", tab.key)}
              className={({ isActive }) => `nav-link${isActive || (activeFamily === "role" && context.tab === tab.key) ? " is-active" : ""}`}
            >
              <span>{tab.label}</span>
              <span className="nav-meta">{tab.hint}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="stack">
        <p className="eyebrow">Internal prototypes</p>
        <div className="nav-links" aria-label="prototype families">
          {FAMILY_ORDER.filter((family) => family !== "role").map((family) => {
            const definition = getTaxonomyDefinition(family);
            return (
              <div key={family} className="card">
                <NavLink
                  to={defaultRouteForFamily(family)}
                  className={({ isActive }) => `nav-link nav-family${isActive || activeFamily === family ? " is-active" : ""}`}
                >
                  <span>{definition.label}</span>
                  <span className="nav-meta">{definition.description}</span>
                </NavLink>
                <div className="nav-links">
                  {definition.tabs.map((tab) => (
                    <NavLink
                      key={tab.key}
                      to={routeForTab(family, tab.key)}
                      className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
                    >
                      <span>{tab.label}</span>
                      <span className="nav-meta">{tab.hint}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stack">
        <p className="eyebrow">Donor rehosts</p>
        <div className="nav-links" aria-label="donor routes">
          {DONOR_ORDER.map((donor) => {
            const definition = DONOR_DEFINITIONS[donor];
            return (
              <NavLink key={donor} to={definition.route} className="nav-link">
                <span>{definition.label}</span>
                <span className="nav-meta">{definition.classification}</span>
              </NavLink>
            );
          })}
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
