// @ts-nocheck
/**
 * Extended state types for parametric generation control
 */

export interface GenerationParams {
  // Geography
  riverEnabled: boolean;
  riverWidth: number;
  riverMeanderStrength: number;
  riverBankBuffer: number;
  riverCrossingAllowed: boolean;
  parksEnabled: boolean;
  parksDensity: number;
  parksClustering: number;

  // Fortifications
  wallThickness: number;
  wallSmoothing: number;
  wallCornerBias: number;
  wallOffsetFromBuiltArea: number;
  towerRadiusRatio: number;
  towerMinSpacing: number;
  towerMaxSpacing: number;
  towerPlacementMode: 'corner-only' | 'periodic';
  gatesTargetCount: number;
  gatesMinSpacing: number;
  gatesOnArteralsOnly: boolean;
  watergateMode: boolean;

  // Bridges
  bridgesMaxCount: number;
  bridgesMinSpacing: number;
  bridgesCollectorsOnly: boolean;
  bridgesWidth: number;
  bridgeDemandWeight: number;
  bridgeCentralityWeight: number;
  bridgeProximityWeight: number;

  // Roads
  arterialsCount: number;
  ringRoadChance: number;
  organicBias: number;
  arterialWidth: number;
  collectorWidth: number;
  localWidth: number;

  // Buildings
  densityCore: number;
  densityOutskirts: number;
  buildingMinSetback: number;
  alignmentStrength: number;
  footprintMinSize: number;
  footprintMaxSize: number;
}

export interface QualityCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warn' | 'unknown';
  message: string;
  offenders?: Array<{
    id: string;
    reason: string;
    location?: { x: number; y: number };
  }>;
}

export interface DebugMode {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
}

export const DEFAULT_GENERATION_PARAMS: GenerationParams = {
  // Geography
  riverEnabled: true,
  riverWidth: 3.0,
  riverMeanderStrength: 0.4,
  riverBankBuffer: 2.0,
  riverCrossingAllowed: true,
  parksEnabled: true,
  parksDensity: 0.15,
  parksClustering: 0.6,

  // Fortifications
  wallThickness: 0.3,
  wallSmoothing: 0.5,
  wallCornerBias: 0.3,
  wallOffsetFromBuiltArea: 1.0,
  towerRadiusRatio: 0.25,
  towerMinSpacing: 2.0,
  towerMaxSpacing: 4.0,
  towerPlacementMode: 'periodic',
  gatesTargetCount: 4,
  gatesMinSpacing: 3.0,
  gatesOnArteralsOnly: true,
  watergateMode: false,

  // Bridges
  bridgesMaxCount: 2,
  bridgesMinSpacing: 1.5,
  bridgesCollectorsOnly: true,
  bridgesWidth: 0.8,
  bridgeDemandWeight: 0.4,
  bridgeCentralityWeight: 0.35,
  bridgeProximityWeight: 0.25,

  // Roads
  arterialsCount: 3,
  ringRoadChance: 0.4,
  organicBias: 0.3,
  arterialWidth: 1.2,
  collectorWidth: 0.8,
  localWidth: 0.5,

  // Buildings
  densityCore: 0.8,
  densityOutskirts: 0.4,
  buildingMinSetback: 0.5,
  alignmentStrength: 0.7,
  footprintMinSize: 0.3,
  footprintMaxSize: 2.0,
};

export const DEFAULT_DEBUG_MODES: DebugMode[] = [
  {
    id: 'collision-heatmap',
    label: 'Collision Heatmap',
    enabled: false,
    description: 'Buildings vs wall/water/roads',
  },
  {
    id: 'forbidden-masks',
    label: 'Forbidden Masks',
    enabled: false,
    description: 'Wall buffer, river buffer, inner clear-zone',
  },
  {
    id: 'road-classes',
    label: 'Road Classes',
    enabled: false,
    description: 'Arterial/collector/local color coding',
  },
  {
    id: 'gate-candidates',
    label: 'Gate Candidates',
    enabled: false,
    description: 'Candidate gates + chosen gates',
  },
  {
    id: 'bridge-analysis',
    label: 'Bridge Analysis',
    enabled: false,
    description: 'Candidates + rejected with reasons',
  },
  {
    id: 'tower-spacing',
    label: 'Tower Spacing',
    enabled: false,
    description: 'Show min/max violation markers',
  },
  {
    id: 'block-polygons',
    label: 'Block Polygons',
    enabled: false,
    description: 'Blocks, parcels, frontages',
  },
];
