import { describe, expect, it } from "vitest";
import { getDomainSymmetrySuggestions } from "./domainSymmetryAffinities";

describe("domain symmetry recommendations", () => {
  it("returns domain-aware primary recommendation", () => {
    expect(getDomainSymmetrySuggestions("divine").primary).toBe("radial-6");
    expect(getDomainSymmetrySuggestions("order").primary).toBe("hybrid-quad");
    expect(getDomainSymmetrySuggestions("chaos").primary).toBe("none");
  });

  it("returns fallbacks when no domain is selected", () => {
    const suggestions = getDomainSymmetrySuggestions(undefined);
    expect(suggestions.primary).toBeNull();
    expect(suggestions.secondary).toEqual([]);
  });
});

