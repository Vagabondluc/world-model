import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { DONOR_DEFINITIONS, type DonorId } from "@/donors/config";

const donorSubapps: Partial<Record<DonorId, LazyExoticComponent<ComponentType>>> = {
  "mythforge": lazy(() => import("../../../donors/mythforge/src/WorldModelDonorApp")),
  "orbis": lazy(() => import("../../../donors/orbis/src/WorldModelDonorApp")),
  "adventure-generator": lazy(() => import("../../../donors/adventure-generator/src/WorldModelDonorApp")),
  "mappa-imperium": lazy(() => import("../../../donors/mappa-imperium/src/WorldModelDonorApp")),
  "dawn-of-worlds": lazy(() => import("../../../donors/dawn-of-worlds/src/WorldModelDonorApp")),
  "faction-image": lazy(() => import("../../../donors/faction-image/src/WorldModelDonorApp")),
  "watabou-city": lazy(() => import("../../../donors/watabou-city/src/WorldModelDonorApp")),
  "encounter-balancer": lazy(() => import("../../../donors/encounter-balancer/src/WorldModelDonorApp")),
};

function DonorScaffold({ donor }: { donor: DonorId }) {
  const definition = DONOR_DEFINITIONS[donor];

  return (
    <main
      className="donor-subapp-host donor-subapp-host--scaffold"
      data-testid="donor-subapp-host"
      data-donor-id={donor}
      data-mount-kind={definition.mountKind}
      data-implementation-status={definition.implementationStatus}
    >
      <section className="donor-scaffold" aria-label={`${definition.label} donor scaffold`}>
        <p className="eyebrow">Phase 9 rehost pending</p>
        <h1>{definition.label}</h1>
        <p>{definition.summary}</p>
        <p>
          This donor route is intentionally marked as <strong>{definition.implementationStatus}</strong>. It must not
          count as exact until the original donor UI is vendored, mounted, canonical-bridged, and behavior-tested.
        </p>
        <dl>
          <div>
            <dt>Expected source</dt>
            <dd>{definition.sourceRoot}</dd>
          </div>
          <div>
            <dt>Vendored root</dt>
            <dd>{definition.vendoredRoot}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

export function DonorSubappHost({ donor }: { donor: DonorId }) {
  const definition = DONOR_DEFINITIONS[donor];
  const DonorApp = donorSubapps[donor];

  // If there is no vendored donor app registered, or the manifest still marks
  // the donor as scaffold-mounted, render the scaffold placeholder. This
  // preserves the manifest-driven truth while allowing vendored imports to
  // exist for donors that are ready to be rehost-mounted.
  if (!DonorApp || definition.implementationStatus === "scaffold-mounted") {
    return <DonorScaffold donor={donor} />;
  }

  return (
    <main
      className="donor-subapp-host donor-subapp-host--rehost"
      data-testid="donor-subapp-host"
      data-donor-id={donor}
      data-mount-kind={definition.mountKind}
      data-implementation-status={definition.implementationStatus}
    >
      <Suspense fallback={<div className="donor-subapp-loading">Loading {definition.label}...</div>}>
        <DonorApp />
      </Suspense>
    </main>
  );
}
