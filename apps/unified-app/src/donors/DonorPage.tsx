import type { DonorId } from "@/donors/config";
import { DONOR_DEFINITIONS } from "@/donors/config";
import { AdventureGeneratorRehostPage } from "@/donors/AdventureGeneratorRehostPage";
import { MythforgeRehostPage } from "@/donors/MythforgeRehostPage";
import { OrbisRehostPage } from "@/donors/OrbisRehostPage";

export function DonorPage({ donor }: { donor: DonorId }) {
  const definition = DONOR_DEFINITIONS[donor];

  return (
    <div className="panel-body mode-surface">
      <section className="hero donor-hero">
        <h2>{definition.label}</h2>
        <p>{definition.summary}</p>
        <div className="context-pills">
          <span className="pill">{definition.classification}</span>
          <span className="pill">{definition.sourceStatus}</span>
        </div>
      </section>

      {donor === "mythforge" ? <MythforgeRehostPage /> : null}
      {donor === "orbis" ? <OrbisRehostPage /> : null}
      {donor === "adventure-generator" ? <AdventureGeneratorRehostPage /> : null}
    </div>
  );
}
