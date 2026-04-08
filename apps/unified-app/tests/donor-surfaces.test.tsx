import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

describe("donor surfaces", () => {
  it("renders the donor comparison route", () => {
    renderAt("/compare/donors");

    expect(screen.getByRole("heading", { name: /Compare donor surfaces/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open Mythforge/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open Orbis/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open Adventure Generator/ })).toBeInTheDocument();
  });

  it("preserves selected world context while moving from public to donor routes", () => {
    renderAt("/world");
    expect(screen.getByText(/World world:sample/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Mythforge app donor/ }));

    expect(screen.getByText(/World world:sample/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mythforge" })).toBeInTheDocument();
  });
});
