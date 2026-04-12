import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("app shell", () => {
  it("renders the shell surfaces", () => {
    renderAt("/world");

    expect(screen.getByLabelText("left navigation")).toBeInTheDocument();
    expect(screen.getByLabelText("top context bar")).toBeInTheDocument();
    expect(screen.getByLabelText("workspace")).toBeInTheDocument();
    expect(screen.getByLabelText("inspector")).toBeInTheDocument();
    expect(screen.getByLabelText("bottom drawer")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Role \/ World/ })).toBeInTheDocument();
  });

  it("redirects legacy aliases to public routes", () => {
    renderAt("/guided");

    expect(window.location.pathname).toBe("/world");
    expect(screen.getByRole("heading", { name: /Role \/ World/ })).toBeInTheDocument();
  });

  it("renders the comparison surface with public and prototype families", () => {
    renderAt("/compare");

    expect(screen.getByRole("heading", { name: /Compare product integration/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Unified product surface/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Shared concept matrix/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Cross-donor journeys/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Language boundary/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open product home/ })).toBeInTheDocument();
  });

  it("switches taxonomy families and tabs without losing selected world context", () => {
    renderAt("/world");

    const topBar = screen.getByLabelText("top context bar");
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Task Create \/ Edit \/ Inspect \/ Validate workflow split\./ }));
    expect(screen.getByRole("heading", { name: /Task \/ Create/ })).toBeInTheDocument();
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Validate Schema and reports/ }));
    expect(screen.getByRole("heading", { name: /Task \/ Validate/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Flow/ }));
    expect(screen.getByRole("heading", { name: /Flow \/ Start/ })).toBeInTheDocument();
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();
  });

  it("launches the create world modal and applies canonical changes", () => {
    renderAt("/world");

    const workspace = screen.getByLabelText("workspace");
    fireEvent.click(within(workspace).getByRole("button", { name: "Create world" }));
    const dialog = screen.getByRole("dialog", { name: "Create world" });
    expect(dialog).toBeInTheDocument();

    fireEvent.change(within(dialog).getByRole("textbox", { name: "World ID" }), { target: { value: "world:moon-harbor" } });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Label" }), { target: { value: "Moon Harbor" } });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Summary" }), { target: { value: "A moonlit harbor city." } });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Tags" }), { target: { value: "city, moon, harbor" } });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Description" }), { target: { value: "The harbor district shines at night." } });

    fireEvent.click(within(dialog).getByRole("button", { name: "Create world" }));

    expect(screen.queryByRole("dialog", { name: "Create world" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Moon Harbor").length).toBeGreaterThan(0);
  });
});
