import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { DONOR_DEFINITIONS } from "@/donors/config";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("mythforge conformance", () => {
  it("mounts the donor route through the non-exact subapp scaffold", () => {
    const definition = DONOR_DEFINITIONS.mythforge;
    renderAt(definition.route);

    const host = screen.getByTestId("donor-subapp-host");

    expect(screen.getByRole("heading", { name: "Mythforge" })).toBeInTheDocument();
    expect(host).toHaveAttribute("data-donor-id", "mythforge");
    expect(host).toHaveAttribute("data-mount-kind", "scaffold-mounted");
    expect(host).toHaveAttribute("data-implementation-status", "scaffold-mounted");
    expect(screen.getByText(definition.vendoredRoot)).toBeInTheDocument();
  });

  it("keeps the donor route stable without placeholder preview panels", () => {
    renderAt("/donor/mythforge");

    expect(screen.getByText(/Phase 9 rehost pending/)).toBeInTheDocument();
    expect(screen.queryByTestId("source-ui-preview")).not.toBeInTheDocument();
  });
});
