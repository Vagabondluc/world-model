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

    fireEvent.click(screen.getAllByRole("link", { name: /Compare donors Donor surfaces/i })[0]);
    fireEvent.click(screen.getByRole("link", { name: /Open Mythforge route/i }));
    expect(screen.getByTestId("donor-subapp-host")).toHaveAttribute("data-donor-id", "mythforge");
    expect(screen.queryByLabelText("top context bar")).not.toBeInTheDocument();

    navigateTo("/compare");
    const returnedTopBar = screen.getByLabelText("top context bar");
    expect(within(returnedTopBar).getByText(/entity:harbor-warden/i)).toBeInTheDocument();
  });
});
