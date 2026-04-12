import { useAppStore } from "@/state/app-store";
import { SAMPLE_BUNDLE } from "@/services/canonical-fixtures";

export function GuidedMode() {
  const { state, loadBundle, selectWorld, selectEntity } = useAppStore();

  return (
    <div className="panel-body mode-surface">
      <section className="hero">
        <h2>Guided mode</h2>
        <p>
          Start with a canonical bundle, pin the current world context, and move toward the primary create/open/save
          loop without exposing expert controls.
        </p>
      </section>

      <section className="card-grid">
        <div className="card">
          <h3>First actions</h3>
          <ul className="list">
            <li>Open a canonical bundle from disk.</li>
            <li>Save the current bundle back to JSON.</li>
            <li>Reset to a blank canonical surface.</li>
          </ul>
        </div>
        <div className="card">
          <h3>Current bundle</h3>
          <p>{state.canonical.bundle.world?.metadata.label ?? "No world loaded yet."}</p>
          <p>{Object.keys(state.canonical.bundle.entities).length} entities available for guided selection.</p>
        </div>
        <div className="card">
          <h3>Actions</h3>
          <div className="stack">
            <button type="button" onClick={() => loadBundle(SAMPLE_BUNDLE)}>
              Load sample canonical bundle
            </button>
            <button type="button" className="secondary" onClick={() => selectWorld(SAMPLE_BUNDLE.world?.world_id ?? null)}>
              Pin sample world
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => selectEntity(Object.keys(SAMPLE_BUNDLE.entities)[0] ?? null)}
            >
              Pin sample entity
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
