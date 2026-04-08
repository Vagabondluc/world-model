import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("adventure generator conformance", () => {
  it("mounts the donor route with workflow, checkpoints, and generated outputs", () => {
    renderAt("/donor/adventure-generator");

    expect(screen.getByRole("heading", { name: "Adventure Generator" })).toBeInTheDocument();
    expect(screen.getByText(/Sample Adventure · active · 50%/)).toBeInTheDocument();
    expect(screen.getByText(/workflow:sample-adventure · start · complete/)).toBeInTheDocument();
    expect(screen.getByText(/briefing · 2026-01-01T00:15:00.000Z/)).toBeInTheDocument();
  });
});
