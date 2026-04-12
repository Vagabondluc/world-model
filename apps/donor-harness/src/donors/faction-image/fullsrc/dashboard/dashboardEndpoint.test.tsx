import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import DashboardApp from "@/DashboardApp";

vi.mock("@/dashboard/DashboardWorkspace", () => ({
  DashboardWorkspace: () => <div data-testid="dashboard-workspace">workspace</div>,
}));

describe("dashboard endpoint contracts", () => {
  it("mounts a distinct dashboard shell at runtime", () => {
    render(<DashboardApp />);
    expect(screen.getByText("Sacred Sigil Operations")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-workspace")).toBeInTheDocument();
    expect(document.getElementById("dashboard-root")).not.toBeNull();
  });

  it("uses AppProviders in both entries", () => {
    const appSrc = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");
    const dashboardMainSrc = readFileSync(resolve(process.cwd(), "src/main-dashboard.tsx"), "utf8");
    expect(appSrc).toContain("AppProviders");
    expect(dashboardMainSrc).toContain("AppProviders");
  });

  it("prevents direct provider duplication in entry roots", () => {
    const appSrc = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");
    const dashboardMainSrc = readFileSync(resolve(process.cwd(), "src/main-dashboard.tsx"), "utf8");
    const forbidden = [
      "QueryClientProvider",
      "TooltipProvider",
      "DiscoveryProvider",
      "<Toaster",
      "<Sonner",
    ];
    for (const token of forbidden) {
      expect(appSrc).not.toContain(token);
      expect(dashboardMainSrc).not.toContain(token);
    }
  });

  it("defines entry diagnostics markers in both entrypoints", () => {
    const mainSrc = readFileSync(resolve(process.cwd(), "src/main.tsx"), "utf8");
    const dashboardMainSrc = readFileSync(resolve(process.cwd(), "src/main-dashboard.tsx"), "utf8");
    expect(mainSrc).toContain('__APP_ENTRY__ = "main"');
    expect(dashboardMainSrc).toContain('__APP_ENTRY__ = "dashboard"');
  });
});
