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

describe("cross-donor world flow", () => {
  it("keeps the selected world and entity context while moving through donor and product surfaces", () => {
    renderAt("/world");

    const topBar = screen.getByLabelText("top context bar");
    expect(within(topBar).getByText(/world:sample/i)).toBeInTheDocument();
    expect(within(topBar).getByText(/entity:harbor-biome/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Harbor Warden · character/i }));
    expect(within(topBar).getByText(/entity:harbor-warden/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("link", { name: /Compare donors Donor surfaces/i })[0]);
    expect(screen.getByRole("heading", { name: /Compare donor surfaces/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Open Mythforge route/i }));
    expect(screen.getByRole("heading", { name: "Mythforge" })).toBeInTheDocument();
    expect(screen.getByTestId("donor-subapp-host")).toHaveAttribute("data-donor-id", "mythforge");
    expect(screen.queryByLabelText("top context bar")).not.toBeInTheDocument();

    navigateTo("/compare");
    expect(screen.getByRole("heading", { name: /Compare product integration/i })).toBeInTheDocument();
    const returnedTopBar = screen.getByLabelText("top context bar");
    expect(within(returnedTopBar).getByText(/world:sample/i)).toBeInTheDocument();
    expect(within(returnedTopBar).getByText(/entity:harbor-warden/i)).toBeInTheDocument();
  });
});
