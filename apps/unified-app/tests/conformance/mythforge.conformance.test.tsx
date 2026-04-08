import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("mythforge conformance", () => {
  it("mounts the donor route with explorer and workspace controls", () => {
    renderAt("/donor/mythforge");

    expect(screen.getByRole("heading", { name: "Mythforge" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Explorer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New World" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New Entity" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Grid" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Graph" })).toBeInTheDocument();
  });

  it("projects canonical entities into the donor explorer and workspace", () => {
    renderAt("/donor/mythforge");

    fireEvent.click(screen.getByRole("button", { name: /Harbor Warden/i }));

    expect(screen.getAllByText(/Harbor Warden/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Graph detail|Entity card/)).toBeInTheDocument();
  });
});
