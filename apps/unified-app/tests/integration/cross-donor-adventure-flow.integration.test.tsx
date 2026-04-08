import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("cross-donor adventure flow", () => {
  it("moves a workflow-heavy bundle across the donor and product compare surfaces", () => {
    renderAt("/compare/donors");

    const topBar = screen.getByLabelText("top context bar");
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Open Adventure Generator/i }));
    expect(screen.getByRole("heading", { name: "Adventure Generator" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Adventure Generator/i })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("link", { name: /Compare product Shared concept views/i })[0]);
    expect(screen.getByRole("heading", { name: /Compare product integration/i })).toBeInTheDocument();
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();
    expect(within(topBar).getByText(/entity:harbor-biome/i)).toBeInTheDocument();
  });
});
