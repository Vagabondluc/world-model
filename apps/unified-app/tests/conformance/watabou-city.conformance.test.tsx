import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { DONOR_DEFINITIONS } from "@/donors/config";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("watabou city conformance", () => {
  it("mounts the clean-room donor app through the subapp host", async () => {
    const definition = DONOR_DEFINITIONS["watabou-city"];
    renderAt(definition.route);

    const host = await screen.findByTestId("donor-subapp-host");

    expect(host).toHaveAttribute("data-donor-id", "watabou-city");
    expect(host).toHaveAttribute("data-mount-kind", "rehost-mounted");
    expect(host).toHaveAttribute("data-implementation-status", "rehost-mounted");
    expect(await screen.findByRole("heading", { name: "URBAN_SYNTH" }, { timeout: 5_000 })).toBeInTheDocument();
    expect(screen.getByText("Procedural City Generator")).toBeInTheDocument();
  });
});
