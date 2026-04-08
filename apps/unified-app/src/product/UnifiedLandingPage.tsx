import { NavLink } from "react-router-dom";
import { SharedConceptLensPanel } from "@/product/SharedConceptLensPanel";
import {
  CROSS_DONOR_JOURNEYS,
  PRODUCT_SURFACE_BOUNDARY,
  PRODUCT_SURFACES,
  recommendSurfaceForBundle
} from "@/product/surface-contract";
import { useAppStore } from "@/state/app-store";

export function UnifiedLandingPage() {
  const { state } = useAppStore();
  const bundle = state.canonical.bundle;
  const recommendation = recommendSurfaceForBundle(bundle);

  return (
    <div className="panel-body mode-surface">
      <section className="hero">
        <h2>Unified product surface</h2>
        <p>One canonical bundle, three product surfaces, and three donor-faithful rehosts beneath them.</p>
        <div className="context-pills">
          <span className="pill">Recommended: {recommendation.label}</span>
          <span className="pill">{recommendation.reason}</span>
          <span className="pill">{state.canonical.dirty ? "Unsaved changes" : "Saved bundle"}</span>
        </div>
      </section>

      <section className="card-grid">
        {PRODUCT_SURFACES.map((surface) => (
          <article key={surface.key} className="card donor-card">
            <h3>{surface.label}</h3>
            <p>{surface.description}</p>
            <div className="nav-links">
              <NavLink to={surface.route} className="nav-link nav-family">
                <span>Open {surface.label}</span>
                <span className="nav-meta">{surface.summary}</span>
              </NavLink>
            </div>
          </article>
        ))}
      </section>

      <section className="card-grid">
        <article className="card">
          <h3>Shared canonical view</h3>
          <p>Inspect the same biome/location record through donor lenses without mutating canonical state.</p>
          <SharedConceptLensPanel family="biome-location" compact />
        </article>

        <article className="card">
          <h3>Cross-donor journeys</h3>
          <div className="stack">
            {CROSS_DONOR_JOURNEYS.map((journey) => (
              <div key={journey.title} className="card">
                <h4>{journey.title}</h4>
                <p>{journey.summary}</p>
                <div className="nav-links">
                  {journey.steps.map((step) => (
                    <NavLink key={`${journey.title}-${step.label}`} to={step.route} className="nav-link">
                      <span>{step.label}</span>
                      <span className="nav-meta">{step.note}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h3>Boundary</h3>
          <p>{PRODUCT_SURFACE_BOUNDARY.note}</p>
          <div className="context-pills">
            <span className="pill">{PRODUCT_SURFACE_BOUNDARY.productLanguage}</span>
            <span className="pill">{PRODUCT_SURFACE_BOUNDARY.donorLanguage}</span>
            <span className="pill">{PRODUCT_SURFACE_BOUNDARY.codeBoundary}</span>
          </div>
        </article>
      </section>

      <section className="card-grid">
        <article className="card">
          <h3>Surface guidance</h3>
          <p>Use the recommendation to continue from the current canonical bundle state.</p>
          <div className="nav-links">
            <NavLink to={`/${recommendation.key}`} className="nav-link nav-family">
              <span>Continue to {recommendation.label}</span>
              <span className="nav-meta">Bundle-aware recommendation</span>
            </NavLink>
            <NavLink to="/compare" className="nav-link nav-family">
              <span>Compare product integration</span>
              <span className="nav-meta">Shared concept matrix</span>
            </NavLink>
            <NavLink to="/compare/donors" className="nav-link nav-family">
              <span>Compare donors</span>
              <span className="nav-meta">Donor-faithful rehosts</span>
            </NavLink>
          </div>
        </article>
      </section>
    </div>
  );
}
