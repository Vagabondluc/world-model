import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { DONOR_DEFINITIONS } from "@/donors/config";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("mappa imperium conformance", () => {
  it("mounts the donor route through the non-exact subapp scaffold", () => {
    const definition = DONOR_DEFINITIONS["mappa-imperium"];
    renderAt(definition.route);

    const host = screen.getByTestId("donor-subapp-host");

    expect(screen.getByRole("heading", { name: "Mappa Imperium" })).toBeInTheDocument();
    expect(host).toHaveAttribute("data-donor-id", "mappa-imperium");
    expect(host).toHaveAttribute("data-mount-kind", "scaffold-mounted");
    expect(host).toHaveAttribute("data-implementation-status", "scaffold-mounted");
    expect(screen.getByText(definition.vendoredRoot)).toBeInTheDocument();
  });
});
