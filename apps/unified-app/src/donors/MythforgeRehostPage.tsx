import { useMemo, useState } from "react";
import { useAppStore } from "@/state/app-store";
import { buildMythforgeGroups, currentEntity } from "@/donors/projectors";

export function MythforgeRehostPage() {
  const { state, openModal, saveBundleText, selectEntity } = useAppStore();
  const [viewMode, setViewMode] = useState<"grid" | "graph">("grid");
  const bundle = state.canonical.bundle;
  const groups = useMemo(() => buildMythforgeGroups(bundle), [bundle]);
  const selected = currentEntity(bundle, state.overlay.selectedEntityId);

  return (
    <div className="donor-surface donor-surface-mythforge">
      <header className="donor-topbar donor-topbar-mythforge">
        <div className="donor-brand">
          <strong>Mythforge donor rehost</strong>
          <span>Explorer, workspace, and top-nav workflow rehosted over canonical state.</span>
        </div>
        <div className="donor-actions">
          <button type="button" className="ghost donor-ghost" onClick={() => openModal("create-world")}>
            New World
          </button>
          <button type="button" className="ghost donor-ghost" onClick={() => openModal("create-entity")}>
            New Entity
          </button>
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([saveBundleText()], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = "mythforge-canonical-bundle.json";
              anchor.click();
              URL.revokeObjectURL(url);
            }}
          >
            Save Canonical
          </button>
        </div>
      </header>

      <section className="donor-frame donor-frame-mythforge">
        <aside className="donor-sidebar">
          <div className="donor-section-header">
            <h3>Explorer</h3>
            <button type="button" className="ghost donor-ghost" onClick={() => openModal("create-entity")}>
              Add
            </button>
          </div>
          {Object.entries(groups).map(([group, entities]) => (
            <div key={group} className="donor-group">
              <p className="donor-group-label">{group}</p>
              <div className="stack">
                {entities.map((entity) => (
                  <button
                    key={entity.entityId}
                    type="button"
                    className={selected?.entity_id === entity.entityId ? "donor-list-item donor-list-item-active" : "donor-list-item"}
                    onClick={() => selectEntity(entity.entityId)}
                  >
                    <span>{entity.label}</span>
                    <span>{entity.entityType}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <section className="donor-workspace-panel">
          <div className="donor-toolbar">
            <div className="nav-links nav-links-row">
              <button type="button" className={viewMode === "grid" ? "donor-pill donor-pill-active" : "donor-pill"} onClick={() => setViewMode("grid")}>
                Grid
              </button>
              <button type="button" className={viewMode === "graph" ? "donor-pill donor-pill-active" : "donor-pill"} onClick={() => setViewMode("graph")}>
                Graph
              </button>
            </div>
            <div className="context-pills">
              <span className="pill">Entities {Object.keys(bundle.entities).length}</span>
              <span className="pill">Relations {bundle.relations.length}</span>
              <span className="pill">Events {bundle.events.length}</span>
            </div>
          </div>

          {selected ? (
            <div className="card-grid donor-card-grid">
              <article className="card donor-card">
                <h3>{selected.metadata.label}</h3>
                <p>{selected.metadata.summary ?? "No summary recorded."}</p>
                <p>Type: {selected.entity_type}</p>
                <p>World: {selected.world_id}</p>
              </article>
              <article className="card donor-card">
                <h3>{viewMode === "grid" ? "Entity card" : "Graph detail"}</h3>
                <p>
                  {viewMode === "grid"
                    ? "This panel preserves the donor card-first editing posture over canonical entity records."
                    : "This panel preserves the donor graph-first inspection posture over canonical relations and projections."}
                </p>
                <div className="context-pills">
                  {selected.metadata.tags.map((tag) => (
                    <span key={tag} className="pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
              <article className="card donor-card">
                <h3>Canonical projection</h3>
                <p>Latest projection: {selected.latest_projection_reference ?? "none"}</p>
                <p>Location scope: {selected.location_attachment?.spatial_scope ?? "none"}</p>
                <button type="button" className="secondary" onClick={() => openModal("markov-name")}>
                  Open name generator
                </button>
              </article>
            </div>
          ) : (
            <div className="card donor-card">
              <h3>No entity selected</h3>
              <p>The donor explorer is mounted, but the canonical bundle has no entity records to project.</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
