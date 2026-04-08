import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MigrationReportViewer } from "@/components/MigrationReportViewer";

describe("migration report viewer", () => {
  it("renders the loaded migration report summary", async () => {
    render(<MigrationReportViewer />);

    const input = screen.getByLabelText("Migration report file input");
    const report = {
      donor: "mythforge",
      run_id: "run-123",
      mode: "replay",
      mapped_count: 11,
      dropped_count: 1,
      conflict_count: 0,
      quarantined_count: 0,
      replay_equivalent: true,
      output_bundle_path: "canonical/mythforge.bundle.json",
      issues: [{ code: "drop.reference-only", message: "reference-only concept skipped" }]
    };
    const file = new File([JSON.stringify(report)], "migration-report.json", {
      type: "application/json"
    });

    fireEvent.change(input, {
      target: {
        files: [file]
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId("migration-report-summary")).toHaveTextContent("mythforge · replay · run-123");
      expect(screen.getByTestId("migration-report-summary")).toHaveTextContent("mapped 11 · dropped 1");
      expect(screen.getByTestId("migration-report-summary")).toHaveTextContent("replay equivalent: true");
      expect(screen.getByTestId("migration-report-summary")).toHaveTextContent("canonical/mythforge.bundle.json");
      expect(screen.getByTestId("migration-report-summary")).toHaveTextContent(
        "drop.reference-only: reference-only concept skipped"
      );
    });
  });

  it("reports parse errors for invalid migration reports", async () => {
    render(<MigrationReportViewer />);

    const input = screen.getByLabelText("Migration report file input");
    const file = new File(["{"], "invalid-report.json", { type: "application/json" });

    fireEvent.change(input, {
      target: {
        files: [file]
      }
    });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/json/i);
    });
  });
});
