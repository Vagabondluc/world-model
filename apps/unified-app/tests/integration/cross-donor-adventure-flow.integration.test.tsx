import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

function navigateTo(pathname: string) {
  act(() => {
    window.history.pushState({}, "", pathname);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}

describe("cross-donor adventure flow", () => {
  it("moves a workflow-heavy bundle across the donor and product compare surfaces", () => {
    renderAt("/compare/donors");

    const topBar = screen.getByLabelText("top context bar");
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /Compare donor surfaces/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: /Adventure Generator route/i }));
    expect(screen.getByRole("heading", { name: "Adventure Generator" })).toBeInTheDocument();
    expect(screen.getByTestId("donor-subapp-host")).toHaveAttribute("data-donor-id", "adventure-generator");
    expect(screen.queryByTestId("source-ui-preview")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("top context bar")).not.toBeInTheDocument();

    navigateTo("/compare");
    expect(screen.getByRole("heading", { name: /Compare product integration/i })).toBeInTheDocument();
    const returnedTopBar = screen.getByLabelText("top context bar");
    expect(within(returnedTopBar).getByText(/world:sample/i)).toBeInTheDocument();
    expect(within(returnedTopBar).getByText(/entity:harbor-biome/i)).toBeInTheDocument();
  });
});
