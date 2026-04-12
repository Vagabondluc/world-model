import type { FactionDomain } from "@/icon-generator/domainPalettes";

export type IconRecolorWarning =
  | "gradient_detected"
  | "pattern_detected"
  | "heavy_opacity_layering"
  | "high_complexity"
  | "parse_error";

export type RecolorConfig = {
  targetColor: string;
  brightness: number;
  saturation: number;
  opacity: number;
  scope: "black-only" | "grayscale";
};

export type RecolorResult = {
  success: boolean;
  svg: string;
  warnings: IconRecolorWarning[];
  quality: number;
};

export type IconKeywordRecord = {
  id: string;
  assetPath: string;
  category: string;
  keywords: string[];
  domains: Partial<Record<FactionDomain, number>>;
  quality: {
    recolorQuality: number;
    hasGradients: boolean;
    hasOpacity: boolean;
  };
};

export type IconKeywordIndex = {
  version: string;
  generatedAt: string;
  records: IconKeywordRecord[];
};

export type DiscoveryQuery = {
  query: string;
  domain?: FactionDomain;
  category?: string;
  limit?: number;
};

export type DiscoveryResult = {
  items: IconKeywordRecord[];
  elapsedMs: number;
};
