import { buildOrbisDomains, buildOrbisEventFeed, getSimulationAttachment } from "@/donors/projectors";
import { useAppStore } from "@/state/app-store";

export function OrbisRehostPage() {
  const { state, openModal } = useAppStore();
  const bundle = state.canonical.bundle;
  const attachment = getSimulationAttachment(bundle);
  const domains = buildOrbisDomains(bundle);
  const events = buildOrbisEventFeed(bundle);

  return (
    <div className="donor-surface donor-surface-orbis">
      <header className="donor-topbar donor-topbar-orbis">
        <div className="donor-brand">
          <strong>Orbis donor surface</strong>
          <span>Adapter-derived simulation panel because the current workspace has no runnable donor UI root.</span>
        </div>
        <div className="donor-actions">
          <button type="button" className="ghost donor-ghost" onClick={() => openModal("import-preview")}>
            Inspect import
          </button>
          <button type="button" onClick={() => openModal("migration-report-viewer")}>
            View migration
          </button>
        </div>
      </header>

      <section className="card-grid donor-card-grid">
        <article className="card donor-card">
          <h3>Simulation profile</h3>
          {attachment ? (
            <>
              <p>Profile: {attachment.profile_id ?? "implicit"}</p>
              <p>Dashboard mode: {String(attachment.dashboard_mode)}</p>
              <p>Source: {String(attachment.provenance.source_system)}</p>
            </>
          ) : (
            <p>No simulation attachment is present in the canonical world record.</p>
          )}
        </article>

        <article className="card donor-card">
          <h3>Enabled domains</h3>
          {domains.length > 0 ? (
            <ul className="list">
              {domains.map((domain) => (
                <li key={domain.id}>
                  {domain.id} · {domain.enabled ? "enabled" : "disabled"} · {domain.fidelity} · {domain.tickMode}
                </li>
              ))}
            </ul>
          ) : (
            <p>No domain toggles were projected from the bundle.</p>
          )}
        </article>

        <article className="card donor-card">
          <h3>Snapshots</h3>
          {attachment?.latest_snapshot_refs.length ? (
            <ul className="list">
              {attachment.latest_snapshot_refs.map((snapshot) => (
                <li key={snapshot.snapshot_ref}>
                  {String(snapshot.domain_id)} · {snapshot.snapshot_ref} · {snapshot.trace_id}
                </li>
              ))}
            </ul>
          ) : (
            <p>No simulation snapshots are available.</p>
          )}
        </article>

        <article className="card donor-card">
          <h3>Event stream</h3>
          {events.length > 0 ? (
            <ul className="list">
              {events.map((event) => (
                <li key={event.event_id}>
                  {event.event_type} · {event.event_id}
                </li>
              ))}
            </ul>
          ) : (
            <p>No events are available for simulation review.</p>
          )}
        </article>
      </section>
    </div>
  );
}
