import { buildAdventureWorkflowList, collectWorkflowAttachments } from "@/donors/projectors";
import { useAppStore } from "@/state/app-store";

export function AdventureGeneratorRehostPage() {
  const { state, openModal } = useAppStore();
  const bundle = state.canonical.bundle;
  const workflows = buildAdventureWorkflowList(bundle);
  const attachments = collectWorkflowAttachments(bundle);

  return (
    <div className="donor-surface donor-surface-adventure">
      <header className="donor-topbar donor-topbar-adventure">
        <div className="donor-brand">
          <strong>Adventure Generator donor surface</strong>
          <span>Guided workflow rehost derived from surviving donor fragments and canonical workflow state.</span>
        </div>
        <div className="donor-actions">
          <button type="button" className="ghost donor-ghost" onClick={() => openModal("create-entity")}>
            Create linked entity
          </button>
          <button type="button" onClick={() => openModal("city-generator")}>
            Start generator
          </button>
        </div>
      </header>

      <section className="card-grid donor-card-grid">
        <article className="card donor-card">
          <h3>Workflow registry</h3>
          {workflows.length > 0 ? (
            <ul className="list">
              {workflows.map((workflow) => (
                <li key={workflow.workflow_id}>
                  {workflow.metadata.label} · {workflow.attachment.status as string} · {(workflow.attachment.progress_ratio * 100).toFixed(0)}%
                </li>
              ))}
            </ul>
          ) : (
            <p>No workflow records are present in the canonical bundle.</p>
          )}
        </article>

        <article className="card donor-card">
          <h3>Guided steps</h3>
          {attachments.length > 0 ? (
            <ul className="list">
              {attachments.flatMap((attachment) =>
                attachment.step_state.map((step) => (
                  <li key={`${attachment.workflow_id}:${step.step_key}`}>
                    {attachment.workflow_id} · {step.step_key} · {String(step.state)}
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p>No step-state attachments were projected from donor workflow semantics.</p>
          )}
        </article>

        <article className="card donor-card">
          <h3>Checkpoints</h3>
          {attachments.length > 0 ? (
            <ul className="list">
              {attachments.flatMap((attachment) =>
                attachment.checkpoints.map((checkpoint) => (
                  <li key={`${attachment.workflow_id}:${checkpoint.checkpoint_key}`}>
                    {checkpoint.checkpoint_key} · {checkpoint.reached_at}
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p>No checkpoints are available.</p>
          )}
        </article>

        <article className="card donor-card">
          <h3>Generated outputs</h3>
          {attachments.length > 0 ? (
            <ul className="list">
              {attachments.flatMap((attachment) =>
                attachment.output_references.map((output, index) => (
                  <li key={`${attachment.workflow_id}:output:${index}`}>{JSON.stringify(output)}</li>
                ))
              )}
            </ul>
          ) : (
            <p>No generated outputs are linked yet.</p>
          )}
        </article>
      </section>
    </div>
  );
}
