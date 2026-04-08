import { useRef } from "react";
import { useAppStore } from "@/state/app-store";

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

export function FileBundleInput() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { loadBundleText } = useAppStore();

  return (
    <>
      <input
        ref={inputRef}
        aria-label="Canonical bundle file input"
        data-testid="bundle-file-input"
        type="file"
        accept=".json,application/json"
        hidden
        onChange={async (event) => {
          const input = event.currentTarget;
          const file = input.files?.[0];
          if (!file) {
            return;
          }
          const text = await readFileText(file);
          loadBundleText(text);
          input.value = "";
        }}
      />
      <button
        className="secondary"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        Open bundle
      </button>
    </>
  );
}
