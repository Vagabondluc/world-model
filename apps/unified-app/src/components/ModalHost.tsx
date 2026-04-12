import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MigrationReportViewer } from "@/components/MigrationReportViewer";
import { slugify } from "@/services/canonical-ops";
import { generateName } from "@/services/name-generation";
import { useAppStore } from "@/state/app-store";

function modalTitle(kind: string): string {
  switch (kind) {
    case "create-world":
      return "Create world";
    case "create-entity":
      return "Create entity";
    case "markov-name":
      return "Markov name generator";
    case "city-generator":
      return "City generator";
    case "import-preview":
      return "Import preview";
    case "migration-report-viewer":
      return "Migration report viewer";
    default:
      return "Tool";
  }
}

function joinTags(tags: string[]): string {
  return tags.join(", ");
}

function splitDescription(payload: unknown): string {
  return typeof payload === "object" && payload ? ((payload as { description?: string }).description ?? "") : "";
}

function ModalShell({
  title,
  children,
  onClose
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
          }
        }}
      >
        <div className="modal-header">
          <div>
            <h3>{title}</h3>
            <p>Modal tools stay local until applied to the canonical bundle.</p>
          </div>
          <button ref={closeButtonRef} type="button" className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

export function ModalHost() {
  const {
    state,
    closeModal,
    createWorld,
    createEntity,
    updateEntity,
    updateEntityDescription,
    updateWorld,
  } = useAppStore();
  const modal = state.overlay.activeModal;
  const bundle = state.canonical.bundle;
  const world = bundle.world;
  const entities = Object.values(bundle.entities);
  const selectedEntity = entities.find((entity) => entity.entity_id === state.overlay.selectedEntityId) ?? entities[0] ?? null;
  const selectedWorldId = world?.world_id ?? state.overlay.selectedWorldId ?? "world:sample";

  const defaultWorldDraft = useMemo(
    () => ({
      worldId: world?.world_id ?? `world:${slugify(world?.metadata.label ?? "new-world")}`,
      label: world?.metadata.label ?? "New World",
      summary: world?.metadata.summary ?? "",
      tags: joinTags(world?.metadata.tags ?? ["phase-5", "world"]),
      description: splitDescription(world?.payload)
    }),
    [world]
  );

  const defaultEntityDraft = useMemo(
    () => ({
      entityId: selectedEntity?.entity_id ?? `entity:${slugify(selectedEntity?.metadata.label ?? "new-entity")}`,
      entityType: selectedEntity?.entity_type ?? "city",
      worldId: selectedEntity?.world_id ?? selectedWorldId,
      label: selectedEntity?.metadata.label ?? "New Entity",
      summary: selectedEntity?.metadata.summary ?? "",
      tags: joinTags(selectedEntity?.metadata.tags ?? ["phase-5", "entity"]),
      description: splitDescription(selectedEntity?.payload),
      mapAnchor:
        selectedEntity?.location_attachment?.map_anchor ??
        `map:${slugify(selectedEntity?.metadata.label ?? selectedEntity?.entity_type ?? "entity")}`,
      spatialScope: selectedEntity?.location_attachment?.spatial_scope ?? selectedEntity?.entity_type ?? "entity"
    }),
    [selectedEntity, selectedWorldId]
  );

  if (!modal) {
    return null;
  }

  switch (modal) {
    case "create-world":
      return (
        <CreateWorldModal
          title={modalTitle(modal)}
          defaultValue={defaultWorldDraft}
          onClose={closeModal}
          onSubmit={(draft) => {
            createWorld(draft);
          }}
        />
      );
    case "create-entity":
      return (
        <CreateEntityModal
          title={modalTitle(modal)}
          defaultValue={defaultEntityDraft}
          onClose={closeModal}
          onSubmit={(draft) => {
            createEntity(draft);
          }}
        />
      );
    case "markov-name":
      return (
        <MarkovNameModal
          title={modalTitle(modal)}
          targetWorldLabel={world?.metadata.label ?? "No world"}
          targetEntityLabel={selectedEntity?.metadata.label ?? "No entity"}
          onClose={closeModal}
          onApplyWorld={(label) =>
            world &&
            updateWorld({
              label,
              summary: world.metadata.summary ?? "",
              tags: joinTags(world.metadata.tags ?? [])
            })
          }
          onApplyEntity={(label) =>
            selectedEntity &&
            updateEntity(selectedEntity.entity_id, {
              label,
              summary: selectedEntity.metadata.summary ?? "",
              tags: joinTags(selectedEntity.metadata.tags ?? [])
            })
          }
        />
      );
    case "city-generator":
      return (
        <CityGeneratorModal
          title={modalTitle(modal)}
          defaultName={selectedEntity?.entity_type === "city" ? selectedEntity.metadata.label : "New City"}
          onClose={closeModal}
          onCreate={(draft) => createEntity(draft)}
          onUpdate={(entityId, draft) => updateEntity(entityId, draft)}
          onUpdateDescription={updateEntityDescription}
        />
      );
    case "import-preview":
      return <ImportPreviewModal title={modalTitle(modal)} onClose={closeModal} />;
    case "migration-report-viewer":
      return (
        <ModalShell title={modalTitle(modal)} onClose={closeModal}>
          <MigrationReportViewer />
        </ModalShell>
      );
    default:
      return null;
  }
}

function CreateWorldModal({
  title,
  defaultValue,
  onClose,
  onSubmit
}: {
  title: string;
  defaultValue: {
    worldId: string;
    label: string;
    summary: string;
    tags: string;
    description: string;
  };
  onClose: () => void;
  onSubmit: (draft: {
    worldId: string;
    label: string;
    summary: string;
    tags: string;
    description: string;
  }) => void;
}) {
  const [worldId, setWorldId] = useState(defaultValue.worldId);
  const [label, setLabel] = useState(defaultValue.label);
  const [summary, setSummary] = useState(defaultValue.summary);
  const [tags, setTags] = useState(defaultValue.tags);
  const [description, setDescription] = useState(defaultValue.description);
  const suggestion = useMemo(() => generateName(label || worldId), [label, worldId]);

  return (
    <ModalShell title={title} onClose={onClose}>
      <form
        className="modal-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ worldId, label, summary, tags, description });
        }}
      >
        <label>
          World ID
          <input value={worldId} onChange={(event) => setWorldId(event.target.value)} />
        </label>
        <label>
          Label
          <input value={label} onChange={(event) => setLabel(event.target.value)} />
        </label>
        <label>
          Summary
          <textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
        </label>
        <label>
          Tags
          <input value={tags} onChange={(event) => setTags(event.target.value)} />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <div className="card">
          <h4>Suggested name</h4>
          <p>{suggestion}</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={() => setLabel(suggestion)}>
            Use suggestion
          </button>
          <button type="button" className="ghost" onClick={() => setSummary(description)}>
            Copy description to summary
          </button>
          <button type="submit">Create world</button>
        </div>
      </form>
    </ModalShell>
  );
}

function CreateEntityModal({
  title,
  defaultValue,
  onClose,
  onSubmit
}: {
  title: string;
  defaultValue: {
    entityId: string;
    entityType: string;
    worldId: string;
    label: string;
    summary: string;
    tags: string;
    description: string;
    mapAnchor: string;
    spatialScope: string;
  };
  onClose: () => void;
  onSubmit: (draft: {
    entityId: string;
    entityType: string;
    worldId: string;
    label: string;
    summary: string;
    tags: string;
    description: string;
    mapAnchor: string;
    spatialScope: string;
  }) => void;
}) {
  const [entityId, setEntityId] = useState(defaultValue.entityId);
  const [entityType, setEntityType] = useState(defaultValue.entityType);
  const [worldId, setWorldId] = useState(defaultValue.worldId);
  const [label, setLabel] = useState(defaultValue.label);
  const [summary, setSummary] = useState(defaultValue.summary);
  const [tags, setTags] = useState(defaultValue.tags);
  const [description, setDescription] = useState(defaultValue.description);
  const [mapAnchor, setMapAnchor] = useState(defaultValue.mapAnchor);
  const [spatialScope, setSpatialScope] = useState(defaultValue.spatialScope);
  const suggestion = useMemo(() => generateName(label || entityId), [label, entityId]);

  return (
    <ModalShell title={title} onClose={onClose}>
      <form
        className="modal-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ entityId, entityType, worldId, label, summary, tags, description, mapAnchor, spatialScope });
        }}
      >
        <label>
          Entity ID
          <input value={entityId} onChange={(event) => setEntityId(event.target.value)} />
        </label>
        <label>
          Entity type
          <input value={entityType} onChange={(event) => setEntityType(event.target.value)} />
        </label>
        <label>
          World ID
          <input value={worldId} onChange={(event) => setWorldId(event.target.value)} />
        </label>
        <label>
          Label
          <input value={label} onChange={(event) => setLabel(event.target.value)} />
        </label>
        <label>
          Summary
          <textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
        </label>
        <label>
          Tags
          <input value={tags} onChange={(event) => setTags(event.target.value)} />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label>
          Map anchor
          <input value={mapAnchor} onChange={(event) => setMapAnchor(event.target.value)} />
        </label>
        <label>
          Spatial scope
          <input value={spatialScope} onChange={(event) => setSpatialScope(event.target.value)} />
        </label>
        <div className="card">
          <h4>Suggested name</h4>
          <p>{suggestion}</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={() => setLabel(suggestion)}>
            Use suggestion
          </button>
          <button type="button" className="ghost" onClick={() => setSummary(description)}>
            Copy description to summary
          </button>
          <button type="submit">Create entity</button>
        </div>
      </form>
    </ModalShell>
  );
}

function MarkovNameModal({
  title,
  targetWorldLabel,
  targetEntityLabel,
  onClose,
  onApplyWorld,
  onApplyEntity
}: {
  title: string;
  targetWorldLabel: string;
  targetEntityLabel: string;
  onClose: () => void;
  onApplyWorld: (label: string) => void;
  onApplyEntity: (label: string) => void;
}) {
  const [seed, setSeed] = useState("world");
  const [scope, setScope] = useState<"world" | "entity">("world");
  const suggestion = useMemo(() => generateName(seed), [seed]);

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="modal-form">
        <label>
          Seed
          <input value={seed} onChange={(event) => setSeed(event.target.value)} />
        </label>
        <label>
          Target
          <select value={scope} onChange={(event) => setScope(event.target.value as "world" | "entity")}>
            <option value="world">Selected world: {targetWorldLabel}</option>
            <option value="entity">Selected entity: {targetEntityLabel}</option>
          </select>
        </label>
        <div className="card">
          <h4>Suggested name</h4>
          <p>{suggestion}</p>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={() => (scope === "world" ? onApplyWorld(suggestion) : onApplyEntity(suggestion))}>
            Apply suggestion
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function CityGeneratorModal({
  title,
  defaultName,
  onClose,
  onCreate,
  onUpdate,
  onUpdateDescription
}: {
  title: string;
  defaultName: string;
  onClose: () => void;
  onCreate: (draft: {
    entityId: string;
    entityType: string;
    worldId: string;
    label: string;
    summary: string;
    tags: string;
    description: string;
    mapAnchor: string;
    spatialScope: string;
  }) => void;
  onUpdate: (
    entityId: string,
    draft: {
      label: string;
      summary: string;
      tags: string;
    }
  ) => void;
  onUpdateDescription: (entityId: string, description: string) => void;
}) {
  const { state } = useAppStore();
  const selectedEntity = Object.values(state.canonical.bundle.entities).find(
    (entity) => entity.entity_id === state.overlay.selectedEntityId
  );
  const selectedWorldId = state.canonical.bundle.world?.world_id ?? state.overlay.selectedWorldId ?? "world:sample";
  const [seed, setSeed] = useState(defaultName);
  const [summary, setSummary] = useState("Generated city from the modal tool.");
  const [tags, setTags] = useState("city, generated, phase-5");
  const suggestion = useMemo(() => generateName(seed), [seed]);

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="modal-form">
        <label>
          Seed
          <input value={seed} onChange={(event) => setSeed(event.target.value)} />
        </label>
        <div className="card">
          <h4>Suggestion</h4>
          <p>{suggestion}</p>
        </div>
        <label>
          Summary
          <textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
        </label>
        <label>
          Tags
          <input value={tags} onChange={(event) => setTags(event.target.value)} />
        </label>
        <div className="modal-actions">
          <button
            type="button"
            onClick={() => {
              if (selectedEntity?.entity_type === "city") {
                onUpdate(selectedEntity.entity_id, {
                  label: suggestion,
                  summary,
                  tags
                });
                onUpdateDescription(selectedEntity.entity_id, summary);
                return;
              }
              onCreate({
                entityId: `entity:${slugify(suggestion)}`,
                entityType: "city",
                worldId: selectedWorldId,
                label: suggestion,
                summary,
                tags,
                description: summary,
                mapAnchor: `map:${slugify(suggestion)}`,
                spatialScope: "city"
              });
            }}
          >
            Apply city
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ImportPreviewModal({ title, onClose }: { title: string; onClose: () => void }) {
  const { state } = useAppStore();
  const bundle = state.canonical.bundle;

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="stack">
        <div className="card">
          <h4>Preview status</h4>
          <p>Adapter snapshots and migration reports are reviewed without touching donor runtime code.</p>
        </div>
        <div className="card">
          <h4>Current canonical bundle</h4>
          <p>
            {bundle.world ? 1 : 0} world · {Object.keys(bundle.entities).length} entities · {bundle.events.length} events
          </p>
        </div>
        <div className="card">
          <h4>Next import checks</h4>
          <ul className="list">
            <li>snapshot fingerprint matches the adapter report</li>
            <li>mandatory mappings stay canonical</li>
            <li>quarantine and replay output stay deterministic</li>
          </ul>
        </div>
      </div>
    </ModalShell>
  );
}
