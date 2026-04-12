
import { MathPPM } from '../../core/types';

export type RiverId = number;
export type BasinId = number;
export type MouthId = number;
export type NodeId = number;

export interface Mouth {
  mouthId: MouthId;
  cellId: string; // Mapping back to HexData.id
  basinId: BasinId;
  strengthPPM: MathPPM; // Coastline suitability score
}

export interface Basin {
  basinId: BasinId;
  mouthId: MouthId;
  areaWeightPPM: MathPPM;
}

// Minimal graph node for river tracing
export interface RiverNode {
  cellId: string;
  downstreamId: string | null;
  flowPPM: MathPPM;
}
