import { describe, expect, it } from "vitest";
import { DOMAIN_STYLE_CURATION, validateDomainStyleCuration } from "./domainStyleCuration";

describe("domain style curation", () => {
  it("C20 each domain has exactly 6 unique styles", () => {
    expect(() => validateDomainStyleCuration(DOMAIN_STYLE_CURATION)).not.toThrow();
  });
});

