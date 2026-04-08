import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("cross-donor context retention", () => {
  it("retains selected world and entity context across public, compare, and donor routes", () => {
    renderAt("/world");

    const topBar = screen.getByLabelText("top context bar");
    fireEvent.click(screen.getByRole("button", { name: /Harbor Warden · character/i }));

    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();
    expect(within(topBar).getByText(/entity:harbor-warden/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("link", { name: /Compare product integration Shared concept matrix/i })[0]);
    expect(screen.getByRole("heading", { name: /Compare product integration/i })).toBeInTheDocument();
    expect(within(topBar).getByText(/entity:harbor-warden/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("link", { name: /Compare donors Faithful donor rehosts/i })[0]);
    fireEvent.click(screen.getByRole("link", { name: /Open Orbis/i }));
    expect(screen.getByRole("heading", { name: "Orbis" })).toBeInTheDocument();
    expect(within(topBar).getByText(/entity:harbor-warden/i)).toBeInTheDocument();
  });
});
