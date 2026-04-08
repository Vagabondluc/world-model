import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("orbis conformance", () => {
  it("mounts the donor route with simulation profile and domains projected from canonical state", () => {
    renderAt("/donor/orbis");

    expect(screen.getByRole("heading", { name: "Orbis" })).toBeInTheDocument();
    expect(screen.getByText(/Profile: profile:sample-world/)).toBeInTheDocument();
    expect(screen.getByText(/weather · enabled · high · continuous/)).toBeInTheDocument();
    expect(screen.getByText(/snapshot:weather-001/)).toBeInTheDocument();
  });
});
