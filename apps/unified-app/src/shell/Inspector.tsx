import { useAppStore } from "@/state/app-store";

export function Inspector() {
  const { state, selectEntity, selectWorld, setInspectorTab } = useAppStore();
  const entities = Object.values(state.canonical.bundle.entities);
  const world = state.canonical.bundle.world;
  const selectedEntity = entities.find((entity) => entity.entity_id === state.overlay.selectedEntityId);

  return (
    <div className="panel-body stack">
      <div className="panel-header">
        <h2>Inspector</h2>
        <div className="context-pills">
          <button type="button" className="ghost" onClick={() => setInspectorTab("summary")}>
            Summary
          </button>
          <button type="button" className="ghost" onClick={() => setInspectorTab("relations")}>
            Relations
          </button>
          <button type="button" className="ghost" onClick={() => setInspectorTab("attachments")}>
            Attachments
          </button>
        </div>
      </div>
      <div className="card-grid">
        <div className="card">
          <h3>World</h3>
          <p>{world?.metadata.label ?? "No world record"}</p>
          <button type="button" className="secondary" onClick={() => selectWorld(world?.world_id ?? null)}>
            Select world
          </button>
        </div>
        <div className="card">
          <h3>Entities</h3>
          <p>{entities.length} canonical entities</p>
          <button type="button" className="secondary" onClick={() => selectEntity(entities[0]?.entity_id ?? null)}>
            Select first entity
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Selected entity</h3>
        {selectedEntity ? (
          <>
            <p>{selectedEntity.metadata.label}</p>
            <p>
              {selectedEntity.entity_type} · {selectedEntity.world_id}
            </p>
          </>
        ) : (
          <p>No entity selected.</p>
        )}
      </div>
      <div className="card">
        <h3>Contract posture</h3>
        <p>Canonical bundles are validated before hydration and serialized back to JSON without overlay state.</p>
      </div>
    </div>
  );
}
