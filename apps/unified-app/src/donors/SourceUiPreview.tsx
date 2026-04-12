import type { DonorDefinition } from "@/donors/config";

interface SourceUiPreviewProps {
  definition: DonorDefinition;
  compact?: boolean;
}

export function SourceUiPreview({ definition, compact = false }: SourceUiPreviewProps) {
  const frameHeight = compact ? 440 : 720;

  if (!definition.sourceUiUrl) {
    return (
      <section className="card donor-card" data-testid="source-ui-preview">
        <h3>{definition.label} source baseline</h3>
        <p>{definition.sourceStatus}</p>
        <p>{definition.compareHint}</p>
        <div className="context-pills">
          <span className="pill">{definition.sourceRoot}</span>
          <span className="pill">{definition.classification}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="card donor-card" data-testid="source-ui-preview">
      <h3>{definition.label} live source UI</h3>
      <p>{definition.sourceStatus}</p>
      <p>{definition.compareHint}</p>
      <iframe
        className="donor-source-frame"
        title={`${definition.label} live source UI`}
        src={definition.sourceUiUrl}
        style={{ width: "100%", minHeight: frameHeight, border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: 16 }}
      />
      <div className="context-pills">
        <span className="pill">{definition.sourceRoot}</span>
        <span className="pill">{definition.classification}</span>
      </div>
      <div className="nav-links nav-links-row" aria-label={`${definition.label} source actions`}>
        <a className="nav-link nav-family" href={definition.sourceUiUrl} target="_blank" rel="noreferrer">
          <span>Open live source UI</span>
          <span className="nav-meta">{definition.label}</span>
        </a>
      </div>
    </section>
  );
}
