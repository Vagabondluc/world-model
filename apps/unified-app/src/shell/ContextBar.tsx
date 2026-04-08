import { FileBundleInput } from "@/components/FileBundleInput";
import { useAppStore } from "@/state/app-store";

export function ContextBar() {
  const { state, saveBundleText, resetBundle } = useAppStore();
  const worldLabel = state.overlay.selectedWorldId ?? "No selected world";
  const entityLabel = state.overlay.selectedEntityId ?? "No selected entity";

  return (
    <>
      <div className="context-stack">
        <strong>{state.overlay.mode.toUpperCase()} mode</strong>
        <span>
          {worldLabel} · {entityLabel}
        </span>
      </div>
      <div className="context-pills">
        <span className="pill">Contract {state.canonical.contractVersion}</span>
        <span className="pill">{state.canonical.dirty ? "Dirty" : "Saved"}</span>
        <span className="pill">Worlds {state.canonical.bundle.world ? 1 : 0}</span>
        <span className="pill">Entities {Object.keys(state.canonical.bundle.entities).length}</span>
      </div>
      <div className="context-pills">
        <FileBundleInput />
        <button
          type="button"
          className="secondary"
          onClick={() => {
            const text = saveBundleText();
            const blob = new Blob([text], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "canonical-bundle.json";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
        >
          Save bundle
        </button>
        <button type="button" className="ghost" onClick={resetBundle}>
          Reset
        </button>
      </div>
    </>
  );
}
