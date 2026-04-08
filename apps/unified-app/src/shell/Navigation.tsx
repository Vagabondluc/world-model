import { NavLink } from "react-router-dom";
import { useAppStore } from "@/state/app-store";

const LINKS = [
  { to: "/guided", label: "Guided", hint: "Entry surface" },
  { to: "/studio", label: "Studio", hint: "Authoring surface" },
  { to: "/architect", label: "Architect", hint: "Expert surface" }
] as const;

export function Navigation() {
  const { state, setDrawerOpen } = useAppStore();

  return (
    <nav className="shell-nav panel" aria-label="left navigation">
      <div className="brand">
        <h1>Unified App</h1>
        <p>Canonical shell for world-model bundles and adapter-aware authoring.</p>
      </div>
      <div className="nav-links">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
          >
            <span>{link.label}</span>
            <span className="nav-meta">{link.hint}</span>
          </NavLink>
        ))}
      </div>
      <div className="stack">
        <button
          type="button"
          className="ghost"
          onClick={() => setDrawerOpen(!state.overlay.drawerOpen)}
        >
          {state.overlay.drawerOpen ? "Hide drawer" : "Show drawer"}
        </button>
      </div>
    </nav>
  );
}
