import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { DONOR_DEFINITIONS, DONOR_ORDER } from "@/donors/config";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("donor route subapp mounts", () => {
  for (const donor of DONOR_ORDER) {
    it(`mounts ${donor} through the donor subapp host without SourceUiPreview`, async () => {
      renderAt(DONOR_DEFINITIONS[donor].route);

      const definition = DONOR_DEFINITIONS[donor];
      const host = await screen.findByTestId("donor-subapp-host");

      expect(host).toHaveAttribute("data-donor-id", donor);
      expect(host).toHaveAttribute("data-mount-kind", definition.mountKind);
      expect(host).toHaveAttribute("data-implementation-status", definition.implementationStatus);
      expect(screen.queryByTestId("source-ui-preview")).not.toBeInTheDocument();

      if (donor === "watabou-city") {
        expect(definition.implementationStatus).toBe("rehost-mounted");
        expect(await screen.findByRole("heading", { name: "URBAN_SYNTH" }, { timeout: 5_000 })).toBeInTheDocument();
      } else {
        expect(definition.implementationStatus).toBe("scaffold-mounted");
        expect(screen.getByRole("heading", { name: definition.label })).toBeInTheDocument();
        expect(screen.getByText(/Phase 9 rehost pending/)).toBeInTheDocument();
      }
    });
  }
});
