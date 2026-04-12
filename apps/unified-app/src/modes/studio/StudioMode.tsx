import { useAppStore } from "@/state/app-store";

export function StudioMode() {
  const { state, selectEntity } = useAppStore();
  const entities = Object.values(state.canonical.bundle.entities);

  return (
    <div className="panel-body mode-surface">
      <section className="hero">
        <h2>Studio mode</h2>
        <p>Canonical editing surface for worlds, entities, relations, attachments, and save/load orchestration.</p>
      </section>

      <section className="card-grid">
        <div className="card">
          <h3>World canvas</h3>
          <p>{state.canonical.bundle.world?.metadata.label ?? "Empty canonical bundle"}</p>
          <p>World ID: {state.canonical.bundle.world?.world_id ?? "none"}</p>
        </div>
        <div className="card">
          <h3>Entities</h3>
          <ul className="list">
            {entities.map((entity) => (
              <li key={entity.entity_id}>
                <button type="button" className="secondary" onClick={() => selectEntity(entity.entity_id)}>
                  {entity.metadata.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Studio notes</h3>
          <p>Overlay state remains local; the canonical bundle is the only durable source of truth.</p>
        </div>
      </section>
    </div>
  );
}
