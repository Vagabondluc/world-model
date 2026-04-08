import { useMemo, useState } from "react";
import type { CanonicalBundle } from "@/domain/canonical";
import { useAppStore } from "@/state/app-store";
import {
  type DonorLens,
  type SharedConceptFamily,
  projectSharedConcept,
  SHARED_CONCEPT_FAMILIES
} from "@/product/surface-contract";

const LENSES: { value: DonorLens; label: string }[] = [
  { value: "mythforge", label: "Mythforge" },
  { value: "adventure-generator", label: "Adventure Generator" },
  { value: "orbis", label: "Orbis" }
];

export function SharedConceptLensPanel({
  family = "biome-location",
  bundle,
  compact = false
}: {
  family?: SharedConceptFamily;
  bundle?: CanonicalBundle;
  compact?: boolean;
}) {
  const { state } = useAppStore();
  const sourceBundle = bundle ?? state.canonical.bundle;
  const familyDefinition = SHARED_CONCEPT_FAMILIES.find((entry) => entry.family === family) ?? SHARED_CONCEPT_FAMILIES[0];
  const [lens, setLens] = useState<DonorLens>(familyDefinition.defaultLens);
  const projection = useMemo(() => projectSharedConcept(sourceBundle, family, lens), [sourceBundle, family, lens]);

  return (
    <div className="card donor-card" aria-label={`${familyDefinition.label} lens panel`}>
      <div className="donor-section-header">
        <div>
          <h3>{familyDefinition.label}</h3>
          <p>{familyDefinition.summary}</p>
        </div>
        <span className="pill">{projection.lensLabel}</span>
      </div>
      <div className="context-pills" style={{ marginTop: compact ? 8 : 12 }}>
        {LENSES.map((entry) => (
          <button
            key={entry.value}
            type="button"
            className={lens === entry.value ? "donor-pill donor-pill-active" : "donor-pill"}
            onClick={() => setLens(entry.value)}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="stack" style={{ marginTop: compact ? 10 : 12 }}>
        <strong>{projection.label}</strong>
        <p>{projection.summary}</p>
        <div className="card">
          <h4>Canonical key</h4>
          <p>{projection.canonicalKey}</p>
        </div>
        <ul className="list">
          {projection.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
