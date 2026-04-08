import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

describe("app shell", () => {
  it("renders the shell surfaces", () => {
    window.history.pushState({}, "", "/guided");
    render(<App />);

    expect(screen.getByLabelText("left navigation")).toBeInTheDocument();
    expect(screen.getByLabelText("top context bar")).toBeInTheDocument();
    expect(screen.getByLabelText("workspace")).toBeInTheDocument();
    expect(screen.getByLabelText("inspector")).toBeInTheDocument();
    expect(screen.getByLabelText("bottom drawer")).toBeInTheDocument();
  });

  it("switches modes without losing the selected world context", () => {
    window.history.pushState({}, "", "/guided");
    render(<App />);

    const topBar = screen.getByLabelText("top context bar");
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Studio Authoring surface/ }));
    expect(screen.getByRole("heading", { name: "Studio mode" })).toBeInTheDocument();
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Architect Expert surface/ }));
    expect(screen.getByRole("heading", { name: "Architect mode" })).toBeInTheDocument();
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();
  });
});
