import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { DONOR_DEFINITIONS } from "@/donors/config";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("adventure generator conformance", () => {
  it("mounts the donor route through the non-exact subapp scaffold", () => {
    const definition = DONOR_DEFINITIONS["adventure-generator"];
    renderAt(definition.route);

    const host = screen.getByTestId("donor-subapp-host");

    expect(screen.getByRole("heading", { name: "Adventure Generator" })).toBeInTheDocument();
    expect(host).toHaveAttribute("data-donor-id", "adventure-generator");
    expect(host).toHaveAttribute("data-mount-kind", "scaffold-mounted");
    expect(host).toHaveAttribute("data-implementation-status", "scaffold-mounted");
    expect(screen.getByText(definition.vendoredRoot)).toBeInTheDocument();
  });
});
