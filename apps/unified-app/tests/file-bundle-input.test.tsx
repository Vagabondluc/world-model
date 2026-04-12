import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import sampleBundle from "./fixtures/canonical-bundle.sample.json";
import { FileBundleInput } from "@/components/FileBundleInput";
import { AppStoreProvider, useAppStore } from "@/state/app-store";

function BundleProbe() {
  const { state } = useAppStore();
  return <output data-testid="bundle-probe">{state.canonical.bundle.world?.metadata.label ?? "empty"}</output>;
}

describe("bundle file input", () => {
  it("loads a canonical bundle from a JSON file", async () => {
    render(
      <AppStoreProvider>
        <FileBundleInput />
        <BundleProbe />
      </AppStoreProvider>
    );

    const input = screen.getByLabelText("Canonical bundle file input");
    const file = new File([JSON.stringify(sampleBundle)], "canonical-bundle.json", {
      type: "application/json"
    });

    fireEvent.change(input, {
      target: {
        files: [file]
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId("bundle-probe")).toHaveTextContent(sampleBundle.world?.metadata.label ?? "empty");
    });
  });
});
