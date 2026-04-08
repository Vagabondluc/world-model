import { useState } from "react";

interface MigrationReport {
  donor: string;
  run_id: string;
  mode: string;
  mapped_count: number;
  dropped_count: number;
  conflict_count: number;
  quarantined_count: number;
  replay_equivalent?: boolean | null;
  output_bundle_path?: string | null;
  issues?: Array<{ code?: string; message?: string }>;
}

async function readFileText(file: File): Promise<string> {
  if (typeof file.text === "function") {
    return file.text();
  }
  if (typeof FileReader !== "undefined") {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.readAsText(file);
    });
  }
  throw new Error("File text reading is not supported in this environment");
}

export function MigrationReportViewer() {
  const [report, setReport] = useState<MigrationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="card">
      <div className="section-header">
        <h3>Migration report viewer</h3>
        <p>Load a Phase 4 migration report JSON to inspect provenance and replay status.</p>
      </div>

      <input
        aria-label="Migration report file input"
        data-testid="migration-report-file-input"
        type="file"
        accept=".json,application/json"
        onChange={async (event) => {
          const input = event.currentTarget;
          const file = input.files?.[0];
          if (!file) {
            return;
          }
          try {
            const text = await readFileText(file);
            const parsed = JSON.parse(text) as MigrationReport;
            setReport(parsed);
            setError(null);
          } catch (cause) {
            setReport(null);
            setError(cause instanceof Error ? cause.message : "Unable to parse migration report");
          } finally {
            input.value = "";
          }
        }}
      />

      {error ? <p className="error" role="alert">{error}</p> : null}

      {report ? (
        <div className="report-summary" data-testid="migration-report-summary">
          <p>
            {report.donor} · {report.mode} · {report.run_id}
          </p>
          <p>
            mapped {report.mapped_count} · dropped {report.dropped_count} · conflicts {report.conflict_count} ·
            quarantined {report.quarantined_count}
          </p>
          <p>replay equivalent: {String(report.replay_equivalent ?? false)}</p>
          <p>output: {report.output_bundle_path ?? "none"}</p>
          {report.issues?.length ? (
            <ul className="list">
              {report.issues.slice(0, 3).map((issue, index) => (
                <li key={`${issue.code ?? "issue"}-${index}`}>
                  {issue.code ?? "issue"}: {issue.message ?? "unknown issue"}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="muted">No migration report loaded.</p>
      )}
    </section>
  );
}
