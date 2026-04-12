import { NavLink } from "react-router-dom";
import { SharedConceptLensPanel } from "@/product/SharedConceptLensPanel";
import {
  CROSS_DONOR_JOURNEYS,
  PRODUCT_SURFACE_BOUNDARY,
  PRODUCT_SURFACES,
  SHARED_CONCEPT_FAMILIES
} from "@/product/surface-contract";
import { useAppStore } from "@/state/app-store";

export function TaxonomyComparePage() {
  const { state } = useAppStore();

  return (
    <div className="panel-body mode-surface">
      <section className="hero">
        <h2>Compare product integration</h2>
        <p>Inspect the intentional public product surface, the donor-faithful surfaces, and the shared canonical views that connect them.</p>
        <div className="context-pills">
          <span className="pill">{PRODUCT_SURFACE_BOUNDARY.productLanguage}</span>
          <span className="pill">{PRODUCT_SURFACE_BOUNDARY.donorLanguage}</span>
          <span className="pill">{state.canonical.dirty ? "Unsaved changes" : "Saved bundle"}</span>
        </div>
      </section>

      <section className="card-grid">
        <article className="card donor-card">
          <h3>Unified product surface</h3>
          <p>The public product is intentional, context-aware, and built from canonical state.</p>
          <div className="nav-links">
            {PRODUCT_SURFACES.map((surface) => (
              <NavLink key={surface.key} to={surface.route} className="nav-link">
                <span>{surface.label}</span>
                <span className="nav-meta">{surface.summary}</span>
              </NavLink>
            ))}
          </div>
          <NavLink to="/" className="nav-link nav-family">
            <span>Open product home</span>
            <span className="nav-meta">Bundle-aware landing page</span>
          </NavLink>
        </article>

        <article className="card donor-card">
          <h3>Shared concept matrix</h3>
          <p>Six shared concept families are tracked explicitly so lens switching stays read-only.</p>
          <div className="context-pills">
            {SHARED_CONCEPT_FAMILIES.map((family) => (
              <span key={family.family} className="pill">
                {family.label}
              </span>
            ))}
          </div>
          <SharedConceptLensPanel family="biome-location" compact />
        </article>

        <article className="card donor-card">
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

        <article className="card donor-card">
          <h3>Language boundary</h3>
          <p>{PRODUCT_SURFACE_BOUNDARY.note}</p>
          <div className="context-pills">
            <span className="pill">Product language: World / Story / Schema</span>
            <span className="pill">Donor language: Mythforge / Adventure Generator / Orbis</span>
            <span className="pill">Code boundary: {PRODUCT_SURFACE_BOUNDARY.codeBoundary}</span>
          </div>
          <div className="stack">
            <NavLink to="/compare/donors" className="nav-link nav-family">
              <span>Compare donors</span>
              <span className="nav-meta">Faithful donor routes and surfaces</span>
            </NavLink>
          </div>
        </article>
      </section>
    </div>
  );
}
