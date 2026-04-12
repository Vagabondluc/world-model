import type { FactionDomain } from "./domainPalettes";

export type DomainStyleCuration = {
  version: number;
  domains: Record<FactionDomain, { defaultStyles: string[]; fallbackStyle: string }>;
};

export const DOMAIN_STYLE_CURATION: DomainStyleCuration = {
  version: 1,
  domains: {
    arcane: { defaultStyles: ["shield", "mandala", "star", "rune", "circle", "beast"], fallbackStyle: "shield" },
    divine: { defaultStyles: ["shield", "crown", "star", "mandala", "circle", "rune"], fallbackStyle: "shield" },
    nature: { defaultStyles: ["beast", "circle", "mandala", "shield", "star", "rune"], fallbackStyle: "beast" },
    shadow: { defaultStyles: ["rune", "shield", "beast", "star", "circle", "mandala"], fallbackStyle: "rune" },
    chaos: { defaultStyles: ["star", "beast", "rune", "shield", "mandala", "circle"], fallbackStyle: "star" },
    order: { defaultStyles: ["shield", "star", "mandala", "circle", "rune", "crown"], fallbackStyle: "shield" },
    primal: { defaultStyles: ["beast", "shield", "rune", "star", "circle", "mandala"], fallbackStyle: "beast" },
    death: { defaultStyles: ["rune", "shield", "beast", "circle", "star", "mandala"], fallbackStyle: "rune" },
    life: { defaultStyles: ["circle", "shield", "mandala", "star", "beast", "rune"], fallbackStyle: "circle" },
    forge: { defaultStyles: ["hammer", "shield", "star", "rune", "circle", "mandala"], fallbackStyle: "hammer" },
    storm: { defaultStyles: ["star", "shield", "rune", "circle", "mandala", "beast"], fallbackStyle: "star" },
    trickery: { defaultStyles: ["rune", "star", "beast", "mandala", "shield", "circle"], fallbackStyle: "rune" },
  },
};

export function validateDomainStyleCuration(curation: DomainStyleCuration): void {
  (Object.keys(curation.domains) as FactionDomain[]).forEach((domain) => {
    const styles = curation.domains[domain].defaultStyles;
    if (styles.length !== 6) {
      throw new Error(`Domain ${domain} must define exactly 6 default styles.`);
    }
    const unique = new Set(styles);
    if (unique.size !== styles.length) {
      throw new Error(`Domain ${domain} default styles must be unique.`);
    }
  });
}

