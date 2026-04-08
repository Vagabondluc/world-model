import { useAppStore } from "@/state/app-store";
import { MigrationReportViewer } from "@/components/MigrationReportViewer";

export function ArchitectMode() {
  const { state } = useAppStore();
  const bundle = state.canonical.bundle;

  return (
    <div className="panel-body mode-surface">
      <section className="hero">
        <h2>Architect mode</h2>
        <p>Schema, adapter, and contract inspection surface for expert review and future migration tooling.</p>
      </section>

      <section className="card-grid">
        <div className="card">
          <h3>Canonical contract</h3>
          <p>Version {state.canonical.contractVersion}</p>
          <p>
            {Object.keys(bundle.assets).length} assets · {Object.keys(bundle.entities).length} entities
          </p>
        </div>
        <div className="card">
          <h3>Schema view</h3>
          <ul className="list">
            <li>WorldRecord and EntityRecord hydrate the same canonical bundle.</li>
            <li>UI overlays do not serialize into saved bundles.</li>
            <li>Mode switching never mutates canonical records.</li>
          </ul>
        </div>
        <div className="card">
          <h3>Adapter posture</h3>
          <p>Phase 3 stops at executable scaffolding. Donor import translation is deferred to Phase 4.</p>
        </div>
      </section>

      <MigrationReportViewer />
    </div>
  );
}
