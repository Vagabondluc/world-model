import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("shared concept lens switch", () => {
  it("switches donor lenses in place without mutating the canonical key", () => {
    renderAt("/compare");

    const panel = screen.getByLabelText("Biome / location lens panel");
    expect(within(panel).getByText(/Harbor Biome/i)).toBeInTheDocument();
    expect(within(panel).getByText(/entity:harbor-biome/i)).toBeInTheDocument();
    expect(within(panel).getByText(/Mythforge lens/i)).toBeInTheDocument();

    fireEvent.click(within(panel).getByRole("button", { name: "Orbis" }));
    expect(within(panel).getByText(/Orbis lens/i)).toBeInTheDocument();
    expect(within(panel).getByText(/entity:harbor-biome/i)).toBeInTheDocument();

    fireEvent.click(within(panel).getByRole("button", { name: "Adventure Generator" }));
    expect(within(panel).getByText(/Adventure Generator lens/i)).toBeInTheDocument();
    expect(within(panel).getByText(/entity:harbor-biome/i)).toBeInTheDocument();

    fireEvent.click(within(panel).getByRole("button", { name: "Mythforge" }));
    expect(within(panel).getByText(/Mythforge lens/i)).toBeInTheDocument();
    expect(within(panel).getByText(/entity:harbor-biome/i)).toBeInTheDocument();
  });
});
