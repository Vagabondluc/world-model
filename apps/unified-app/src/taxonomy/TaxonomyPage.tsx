import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import type { CanonicalBundle, EntityRecord, WorldRecord } from "@/domain/canonical";
import { SharedConceptLensPanel } from "@/product/SharedConceptLensPanel";
import type { TaxonomyFamily } from "@/taxonomy/config";
import { getTaxonomyDefinition } from "@/taxonomy/config";
import { slugify } from "@/services/canonical-ops";
import { useAppStore } from "@/state/app-store";

interface MetadataDraft {
  label: string;
  summary: string;
  tags: string;
  description: string;
}

function descriptionFromPayload(payload: unknown): string {
  return typeof payload === "object" && payload ? ((payload as { description?: string }).description ?? "") : "";
}

function tagsToText(tags: string[] | undefined): string {
  return (tags ?? []).join(", ");
}

function worldDraftFrom(world: WorldRecord | null): MetadataDraft {
  return {
    label: world?.metadata.label ?? "Untitled world",
    summary: world?.metadata.summary ?? "",
    tags: tagsToText(world?.metadata.tags),
    description: descriptionFromPayload(world?.payload)
  };
}

function entityDraftFrom(entity: EntityRecord | null): MetadataDraft {
  return {
    label: entity?.metadata.label ?? "Untitled entity",
    summary: entity?.metadata.summary ?? "",
    tags: tagsToText(entity?.metadata.tags),
    description: descriptionFromPayload(entity?.payload)
  };
}

function draftToMetadata(draft: { label: string; summary: string; tags: string }): { label: string; summary: string; tags: string } {
  return {
    label: draft.label,
    summary: draft.summary,
    tags: draft.tags
  };
}

function generateName(seed: string): string {
  const syllables = [
    "al",
    "ar",
    "bel",
    "cor",
    "den",
    "el",
    "fal",
    "gar",
    "hal",
    "is",
    "jor",
    "kel",
    "lor",
    "mar",
    "nor",
    "or",
    "pel",
    "qua",
    "ran",
    "sar",
    "tor",
    "ul",
    "ver",
    "wel",
    "yor",
    "zen"
  ];
  const chars = [...seed.trim().toLowerCase().replace(/[^a-z0-9]/g, "")];
  const base = chars.length > 0 ? chars : ["w", "o", "r", "l", "d"];
  const index = base.reduce((sum, char, position) => sum + char.charCodeAt(0) * (position + 1), 0);
  const a = syllables[index % syllables.length];
  const b = syllables[(index + 5) % syllables.length];
  const c = syllables[(index + 11) % syllables.length];
  return `${a}${b}${c}`.replace(/^(.)/, (letter) => letter.toUpperCase());
}

function currentEntity(bundle: CanonicalBundle, selectedEntityId: string | null): EntityRecord | null {
  const entities = Object.values(bundle.entities);
  return entities.find((entity) => entity.entity_id === selectedEntityId) ?? entities[0] ?? null;
}

export function TaxonomyPage({ family, tab }: { family: TaxonomyFamily; tab: string }) {
  const taxonomy = getTaxonomyDefinition(family);
  const activeTab = taxonomy.tabs.some((entry) => entry.key === tab) ? tab : taxonomy.defaultTab;
  const activeTabDefinition = taxonomy.tabs.find((entry) => entry.key === activeTab) ?? taxonomy.tabs[0];
  const { state, openModal, selectEntity, selectWorld, updateWorld, updateEntity, updateWorldDescription, updateEntityDescription } =
    useAppStore();
  const bundle = state.canonical.bundle;
  const world = bundle.world ?? null;
  const entities = Object.values(bundle.entities);
  const selectedEntity = currentEntity(bundle, state.overlay.selectedEntityId);

  const worldDraft = useMemo(() => worldDraftFrom(world), [world]);
  const entityDraft = useMemo(() => entityDraftFrom(selectedEntity), [selectedEntity]);

  return (
    <div className="panel-body mode-surface">
      <section className="hero">
        <h2>
          {taxonomy.label} / {activeTabDefinition.label}
        </h2>
        <p>{taxonomy.description}</p>
        <div className="context-pills">
          <span className="pill">{activeTabDefinition.hint}</span>
          <span className="pill">{family.toUpperCase()} family</span>
          <span className="pill">{state.canonical.dirty ? "Unsaved changes" : "Saved bundle"}</span>
        </div>
      </section>

      <section className="card-grid">
        <div className="card">
          <h3>Quick tools</h3>
          <div className="stack">
            <button type="button" onClick={() => openModal("create-world")}>
              Create world
            </button>
            <button type="button" className="secondary" onClick={() => openModal("create-entity")}>
              Create entity
            </button>
            <button type="button" className="secondary" onClick={() => openModal("markov-name")}>
              Markov name
            </button>
            <button type="button" className="secondary" onClick={() => openModal("city-generator")}>
              City generator
            </button>
            <button type="button" className="secondary" onClick={() => openModal("import-preview")}>
              Import preview
            </button>
            <button type="button" className="secondary" onClick={() => openModal("migration-report-viewer")}>
              Migration report
            </button>
          </div>
        </div>
        <div className="card">
          <h3>Canonical bundle</h3>
          <p>{world?.metadata.label ?? "No world loaded"}</p>
          <p>
            {entities.length} entities · {bundle.events.length} events · {Object.keys(bundle.assets).length} assets
          </p>
          <p>{state.canonical.dirty ? "Unsaved changes" : "Saved bundle"}</p>
        </div>
        <div className="card">
          <h3>Selection</h3>
          <p>World: {state.overlay.selectedWorldId ?? "none"}</p>
          <p>Entity: {state.overlay.selectedEntityId ?? "none"}</p>
          <div className="stack">
            <button type="button" className="secondary" onClick={() => selectWorld(world?.world_id ?? null)}>
              Select current world
            </button>
            <button type="button" className="secondary" onClick={() => selectEntity(selectedEntity?.entity_id ?? null)}>
              Select current entity
            </button>
          </div>
        </div>
      </section>

      {family === "role" ? (
        <section className="card-grid">
          <div className="card">
            <h3>Shared canonical concept</h3>
            <p>Switch lenses on the same biome/location record without mutating canonical state.</p>
            <SharedConceptLensPanel family="biome-location" />
          </div>
          <div className="card">
            <h3>Cross-donor journeys</h3>
            <p>Continue into the donor comparison or the product integration surface from the same bundle.</p>
            <div className="stack">
              <NavLink to="/compare" className="nav-link nav-family">
                <span>Compare product integration</span>
                <span className="nav-meta">Shared concept matrix</span>
              </NavLink>
              <NavLink to="/compare/donors" className="nav-link nav-family">
                <span>Compare donors</span>
                <span className="nav-meta">Donor surfaces</span>
              </NavLink>
            </div>
          </div>
        </section>
      ) : null}

      {family === "role" ? (
        <>
          {activeTab === "world" ? (
            <WorldSurface
              worldDraft={worldDraft}
              selectedEntity={selectedEntity}
              onSelectEntity={selectEntity}
              onUpdateWorld={(draft) => updateWorld(draft)}
              onUpdateWorldDescription={(description) => updateWorldDescription(description)}
              onUpdateEntity={(entityId, draft) => updateEntity(entityId, draft)}
              onUpdateEntityDescription={(entityId, description) => updateEntityDescription(entityId, description)}
            />
          ) : null}
          {activeTab === "story" ? <StorySurface worldLabel={world?.metadata.label ?? "No world"} entityCount={entities.length} selectedEntity={selectedEntity} /> : null}
          {activeTab === "schema" ? <SchemaSurface bundle={bundle} /> : null}
        </>
      ) : null}

      {family === "task" ? (
        <>
          {activeTab === "create" ? <CreateSurface /> : null}
          {activeTab === "edit" ? (
            <EditSurface
              worldDraft={worldDraft}
              entityDraft={entityDraft}
              selectedEntity={selectedEntity}
              onUpdateWorld={(draft) => updateWorld(draft)}
              onUpdateWorldDescription={(description) => updateWorldDescription(description)}
              onUpdateEntity={(entityId, draft) => updateEntity(entityId, draft)}
              onUpdateEntityDescription={(entityId, description) => updateEntityDescription(entityId, description)}
            />
          ) : null}
          {activeTab === "inspect" ? <InspectSurface bundle={bundle} selectedEntity={selectedEntity} onSelectEntity={selectEntity} onSelectWorld={selectWorld} /> : null}
          {activeTab === "validate" ? <ValidateSurface bundle={bundle} /> : null}
        </>
      ) : null}

      {family === "flow" ? (
        <>
          {activeTab === "start" ? <StartSurface /> : null}
          {activeTab === "build" ? (
            <BuildSurface
              worldDraft={worldDraft}
              entityDraft={entityDraft}
              selectedEntity={selectedEntity}
              onUpdateWorld={(draft) => updateWorld(draft)}
              onUpdateWorldDescription={(description) => updateWorldDescription(description)}
              onUpdateEntity={(entityId, draft) => updateEntity(entityId, draft)}
              onUpdateEntityDescription={(entityId, description) => updateEntityDescription(entityId, description)}
            />
          ) : null}
          {activeTab === "run" ? <RunSurface worldLabel={world?.metadata.label ?? "No world"} selectedEntity={selectedEntity} onSelectEntity={selectEntity} /> : null}
          {activeTab === "review" ? <ReviewSurface bundle={bundle} /> : null}
        </>
      ) : null}
    </div>
  );
}

function WorldSurface({
  worldDraft,
  selectedEntity,
  onSelectEntity,
  onUpdateWorld,
  onUpdateWorldDescription,
  onUpdateEntity,
  onUpdateEntityDescription
}: {
  worldDraft: MetadataDraft;
  selectedEntity: EntityRecord | null;
  onSelectEntity: (entityId: string | null) => void;
  onUpdateWorld: (draft: { label: string; summary: string; tags: string }) => void;
  onUpdateWorldDescription: (description: string) => void;
  onUpdateEntity: (entityId: string, draft: { label: string; summary: string; tags: string }) => void;
  onUpdateEntityDescription: (entityId: string, description: string) => void;
}) {
  const { state } = useAppStore();
  const bundle = state.canonical.bundle;
  const entities = Object.values(bundle.entities);
  return (
    <section className="card-grid">
      <MetadataEditor title="World editor" values={worldDraft} onSubmit={onUpdateWorld} onDescription={onUpdateWorldDescription} />
      <div className="card">
        <h3>World view</h3>
        <p>{bundle.world?.metadata.label ?? "No world"}</p>
        <p>{bundle.world?.metadata.summary ?? "The world summary is empty."}</p>
        <p>{bundle.world?.top_level_entity_index.length ?? 0} top-level entities</p>
      </div>
      <div className="card">
        <h3>People and places</h3>
        <ul className="list">
          {entities.map((entity) => (
            <li key={entity.entity_id}>
              <button type="button" className="secondary" onClick={() => onSelectEntity(entity.entity_id)}>
                {entity.metadata.label} · {entity.entity_type}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Spatial lens</h3>
        <p>Inspect the same biome/location concept through donor lenses from the world surface.</p>
        <SharedConceptLensPanel family="biome-location" compact />
      </div>
      <MetadataEditor
        title="Selected entity"
        values={entityDraftFrom(selectedEntity)}
        onSubmit={(draft) => selectedEntity && onUpdateEntity(selectedEntity.entity_id, draftToMetadata(draft))}
        onDescription={(description) => selectedEntity && onUpdateEntityDescription(selectedEntity.entity_id, description)}
      />
    </section>
  );
}

function StorySurface({
  worldLabel,
  entityCount,
  selectedEntity
}: {
  worldLabel: string;
  entityCount: number;
  selectedEntity: EntityRecord | null;
}) {
  const { openModal, selectEntity } = useAppStore();
  return (
    <section className="card-grid">
      <div className="card">
        <h3>Narrative loop</h3>
        <p>{worldLabel}</p>
        <p>{entityCount} canonical entities ready for session or quest scaffolding.</p>
      </div>
      <div className="card">
        <h3>Selected focus</h3>
        <p>{selectedEntity?.metadata.label ?? "No focus selected"}</p>
        <p>{selectedEntity?.metadata.summary ?? "Use a generator or selection button to focus a story beat."}</p>
      </div>
      <div className="card">
        <h3>Story tools</h3>
        <div className="stack">
          <button type="button" onClick={() => openModal("markov-name")}>
            Name generator
          </button>
          <button type="button" className="secondary" onClick={() => openModal("create-entity")}>
            Create narrative entity
          </button>
          <button type="button" className="secondary" onClick={() => selectEntity(selectedEntity?.entity_id ?? null)}>
            Focus selected entity
          </button>
        </div>
      </div>
    </section>
  );
}

function SchemaSurface({ bundle }: { bundle: CanonicalBundle }) {
  const { openModal } = useAppStore();
  return (
    <section className="card-grid">
      <div className="card">
        <h3>Canonical contract</h3>
        <p>
          {bundle.world ? 1 : 0} world · {Object.keys(bundle.entities).length} entities
        </p>
        <p>{bundle.migrations.length} migration records</p>
      </div>
      <div className="card">
        <h3>Adapter and report tools</h3>
        <div className="stack">
          <button type="button" onClick={() => openModal("import-preview")}>
            Open import preview
          </button>
          <button type="button" className="secondary" onClick={() => openModal("migration-report-viewer")}>
            Open migration report
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Shared concept lens</h3>
        <p>Switch between donor lenses without mutating the canonical bundle.</p>
        <SharedConceptLensPanel family="projections" compact />
      </div>
      <div className="card">
        <h3>Schema notes</h3>
        <ul className="list">
          <li>Promoted schemas remain inspectable from the expert surface.</li>
          <li>Reports stay local and read-only in the UI.</li>
          <li>Canonical bundles hydrate without donor runtime imports.</li>
        </ul>
      </div>
    </section>
  );
}

function CreateSurface() {
  const { openModal } = useAppStore();
  return (
    <section className="card-grid">
      <div className="card">
        <h3>Creation tools</h3>
        <div className="stack">
          <button type="button" onClick={() => openModal("create-world")}>
            Create world
          </button>
          <button type="button" className="secondary" onClick={() => openModal("create-entity")}>
            Create entity
          </button>
          <button type="button" className="secondary" onClick={() => openModal("markov-name")}>
            Markov name
          </button>
          <button type="button" className="secondary" onClick={() => openModal("city-generator")}>
            City generator
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Bundle setup</h3>
        <p>Prototype creation stays canonical-first and can always fall back to the saved bundle.</p>
      </div>
      <div className="card">
        <h3>Preview</h3>
        <button type="button" className="secondary" onClick={() => openModal("import-preview")}>
          Import preview
        </button>
      </div>
    </section>
  );
}

function EditSurface({
  worldDraft,
  entityDraft,
  selectedEntity,
  onUpdateWorld,
  onUpdateWorldDescription,
  onUpdateEntity,
  onUpdateEntityDescription
}: {
  worldDraft: MetadataDraft;
  entityDraft: MetadataDraft;
  selectedEntity: EntityRecord | null;
  onUpdateWorld: (draft: { label: string; summary: string; tags: string }) => void;
  onUpdateWorldDescription: (description: string) => void;
  onUpdateEntity: (entityId: string, draft: { label: string; summary: string; tags: string }) => void;
  onUpdateEntityDescription: (entityId: string, description: string) => void;
}) {
  return (
    <section className="card-grid">
      <MetadataEditor title="World editor" values={worldDraft} onSubmit={onUpdateWorld} onDescription={onUpdateWorldDescription} />
      <MetadataEditor
        title="Entity editor"
        values={entityDraft}
        onSubmit={(draft) => selectedEntity && onUpdateEntity(selectedEntity.entity_id, draftToMetadata(draft))}
        onDescription={(description) => selectedEntity && onUpdateEntityDescription(selectedEntity.entity_id, description)}
      />
      <div className="card">
        <h3>Edit posture</h3>
        <p>Only canonical metadata and payloads are edited here. Overlay state remains local.</p>
      </div>
    </section>
  );
}

function InspectSurface({
  bundle,
  selectedEntity,
  onSelectEntity,
  onSelectWorld
}: {
  bundle: CanonicalBundle;
  selectedEntity: EntityRecord | null;
  onSelectEntity: (entityId: string | null) => void;
  onSelectWorld: (worldId: string | null) => void;
}) {
  return (
    <section className="card-grid">
      <div className="card">
        <h3>Bundle inspection</h3>
        <p>{bundle.world?.metadata.label ?? "No world loaded"}</p>
        <p>
          {Object.keys(bundle.entities).length} entities · {bundle.relations.length} relations
        </p>
      </div>
      <div className="card">
        <h3>Selection</h3>
        <p>{selectedEntity?.metadata.label ?? "No entity selected"}</p>
        <div className="stack">
          <button type="button" className="secondary" onClick={() => onSelectWorld(bundle.world?.world_id ?? null)}>
            Select world
          </button>
          <button type="button" className="secondary" onClick={() => onSelectEntity(selectedEntity?.entity_id ?? null)}>
            Select entity
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Attachments</h3>
        <p>{selectedEntity?.asset_attachments.length ?? 0} asset attachments</p>
        <p>{selectedEntity?.workflow_attachment ? "Workflow attached" : "No workflow attachment"}</p>
      </div>
    </section>
  );
}

function ValidateSurface({ bundle }: { bundle: CanonicalBundle }) {
  const { openModal } = useAppStore();
  return (
    <section className="card-grid">
      <div className="card">
        <h3>Validation surface</h3>
        <p>Inspect promoted schema IDs, adapter mappings, and import previews from one place.</p>
      </div>
      <div className="card">
        <h3>Reports</h3>
        <div className="stack">
          <button type="button" onClick={() => openModal("migration-report-viewer")}>
            Migration report viewer
          </button>
          <button type="button" className="secondary" onClick={() => openModal("import-preview")}>
            Import preview
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Bundle posture</h3>
        <p>
          {bundle.world ? 1 : 0} world, {Object.keys(bundle.entities).length} entities, {bundle.events.length} events
        </p>
      </div>
    </section>
  );
}

function StartSurface() {
  const { openModal } = useAppStore();
  return (
    <section className="card-grid">
      <div className="card">
        <h3>Start here</h3>
        <p>Create or open a world, then save canonical changes immediately.</p>
      </div>
      <div className="card">
        <h3>Actions</h3>
        <div className="stack">
          <button type="button" onClick={() => openModal("create-world")}>
            Create world
          </button>
          <button type="button" className="secondary" onClick={() => openModal("create-entity")}>
            Create entity
          </button>
          <button type="button" className="secondary" onClick={() => openModal("markov-name")}>
            Markov name
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Open and reload</h3>
        <p>Use the shell controls to open or save the current canonical bundle.</p>
      </div>
    </section>
  );
}

function BuildSurface({
  worldDraft,
  entityDraft,
  selectedEntity,
  onUpdateWorld,
  onUpdateWorldDescription,
  onUpdateEntity,
  onUpdateEntityDescription
}: {
  worldDraft: MetadataDraft;
  entityDraft: MetadataDraft;
  selectedEntity: EntityRecord | null;
  onUpdateWorld: (draft: { label: string; summary: string; tags: string }) => void;
  onUpdateWorldDescription: (description: string) => void;
  onUpdateEntity: (entityId: string, draft: { label: string; summary: string; tags: string }) => void;
  onUpdateEntityDescription: (entityId: string, description: string) => void;
}) {
  const { openModal } = useAppStore();
  return (
    <section className="card-grid">
      <MetadataEditor title="World build editor" values={worldDraft} onSubmit={onUpdateWorld} onDescription={onUpdateWorldDescription} />
      <MetadataEditor
        title="Entity build editor"
        values={entityDraft}
        onSubmit={(draft) => selectedEntity && onUpdateEntity(selectedEntity.entity_id, draftToMetadata(draft))}
        onDescription={(description) => selectedEntity && onUpdateEntityDescription(selectedEntity.entity_id, description)}
      />
      <div className="card">
        <h3>Generators</h3>
        <div className="stack">
          <button type="button" onClick={() => openModal("city-generator")}>
            City generator
          </button>
          <button type="button" className="secondary" onClick={() => openModal("markov-name")}>
            Name generator
          </button>
        </div>
      </div>
    </section>
  );
}

function RunSurface({
  worldLabel,
  selectedEntity,
  onSelectEntity
}: {
  worldLabel: string;
  selectedEntity: EntityRecord | null;
  onSelectEntity: (entityId: string | null) => void;
}) {
  const { openModal } = useAppStore();
  return (
    <section className="card-grid">
      <div className="card">
        <h3>Run surface</h3>
        <p>{worldLabel}</p>
        <p>{selectedEntity?.metadata.label ?? "No entity selected"}</p>
      </div>
      <div className="card">
        <h3>Use the world</h3>
        <div className="stack">
          <button type="button" onClick={() => onSelectEntity(selectedEntity?.entity_id ?? null)}>
            Focus current entity
          </button>
          <button type="button" className="secondary" onClick={() => openModal("create-entity")}>
            Create next entity
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Session posture</h3>
        <p>Run mode stays inside the canonical bundle and does not reach donor runtime code.</p>
      </div>
    </section>
  );
}

function ReviewSurface({ bundle }: { bundle: CanonicalBundle }) {
  const { openModal } = useAppStore();
  return (
    <section className="card-grid">
      <div className="card">
        <h3>Review surface</h3>
        <p>{bundle.migrations.length} migration records are available for audit.</p>
      </div>
      <div className="card">
        <h3>Reports</h3>
        <div className="stack">
          <button type="button" onClick={() => openModal("migration-report-viewer")}>
            Load report viewer
          </button>
          <button type="button" className="secondary" onClick={() => openModal("import-preview")}>
            Open import preview
          </button>
        </div>
      </div>
      <div className="card">
        <h3>Audit summary</h3>
        <p>Expert review stays local and read-only until the canonical bundle is updated explicitly.</p>
      </div>
    </section>
  );
}

function MetadataEditor({
  title,
  values,
  onSubmit,
  onDescription
}: {
  title: string;
  values: MetadataDraft;
  onSubmit: (draft: { label: string; summary: string; tags: string }) => void;
  onDescription: (description: string) => void;
}) {
  const [label, setLabel] = useState(values.label);
  const [summary, setSummary] = useState(values.summary);
  const [tags, setTags] = useState(values.tags);
  const [description, setDescription] = useState(values.description);

  useEffect(() => {
    setLabel(values.label);
    setSummary(values.summary);
    setTags(values.tags);
    setDescription(values.description);
  }, [values.label, values.summary, values.tags, values.description]);

  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="stack">
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
        <div className="modal-actions">
          <button type="button" onClick={() => onSubmit({ label, summary, tags })}>
            Save metadata
          </button>
          <button type="button" className="secondary" onClick={() => onDescription(description)}>
            Save description
          </button>
        </div>
      </div>
    </div>
  );
}
