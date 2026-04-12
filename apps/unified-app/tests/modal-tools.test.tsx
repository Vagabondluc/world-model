import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { generateName } from "@/services/name-generation";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("modal tools", () => {
  it("launches the Markov name modal from the tools menu and applies the generated world name", () => {
    renderAt("/world");

    const navigation = screen.getByLabelText("left navigation");
    fireEvent.click(within(navigation).getByRole("button", { name: "Markov name" }));
    const dialog = screen.getByRole("dialog", { name: "Markov name generator" });
    fireEvent.change(within(dialog).getByLabelText("Seed"), { target: { value: "moon" } });

    const expected = generateName("moon");
    fireEvent.click(within(dialog).getByRole("button", { name: "Apply suggestion" }));

    expect(screen.queryByRole("dialog", { name: "Markov name generator" })).not.toBeInTheDocument();
    expect(screen.getAllByText(expected).length).toBeGreaterThan(0);
  });

  it("opens the import preview modal from the tools menu", () => {
    renderAt("/world");

    const navigation = screen.getByLabelText("left navigation");
    fireEvent.click(within(navigation).getByRole("button", { name: "Import preview" }));

    expect(screen.getByRole("dialog", { name: "Import preview" })).toBeInTheDocument();
    expect(screen.getByText(/adapter snapshots and migration reports are reviewed/i)).toBeInTheDocument();
  });
});
