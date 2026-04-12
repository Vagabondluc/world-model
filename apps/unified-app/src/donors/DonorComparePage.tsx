import { NavLink } from "react-router-dom";
import { DONOR_DEFINITIONS, DONOR_ORDER } from "@/donors/config";
import { SourceUiPreview } from "@/donors/SourceUiPreview";

export function DonorComparePage() {
  return (
    <div className="panel-body mode-surface">
      <section className="hero donor-hero">
        <h2>Compare donor surfaces</h2>
        <p>Use the same canonical bundle to inspect donor routes and reference panels.</p>
        <div className="context-pills">
          <span className="pill">Public routes: /world /story /schema</span>
          <span className="pill">Donor routes: /donor/&lt;name&gt;</span>
        </div>
      </section>

      <section className="card-grid">
        <article className="card donor-card">
          <h3>Unified public surface</h3>
          <p>The converged product remains World / Story / Schema over the canonical bundle.</p>
          <div className="nav-links">
            <NavLink to="/world" className="nav-link">
              <span>World</span>
              <span className="nav-meta">Public route</span>
            </NavLink>
            <NavLink to="/story" className="nav-link">
              <span>Story</span>
              <span className="nav-meta">Public route</span>
            </NavLink>
            <NavLink to="/schema" className="nav-link">
              <span>Schema</span>
              <span className="nav-meta">Public route</span>
            </NavLink>
          </div>
        </article>

        {DONOR_ORDER.map((donor) => {
          const definition = DONOR_DEFINITIONS[donor];
          return (
            <div key={donor}>
              <SourceUiPreview definition={definition} compact />
              <article className="card donor-card">
                <h3>{definition.label} route</h3>
                <p>{definition.compareHint}</p>
                <div className="context-pills">
                  <span className="pill">{definition.classification}</span>
                </div>
                <NavLink to={definition.route} className="nav-link nav-family">
                  <span>Open {definition.label} route</span>
                  <span className="nav-meta">Internal donor page</span>
                </NavLink>
              </article>
            </div>
          );
        })}
      </section>
    </div>
  );
}
