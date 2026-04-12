export interface BridgeProjection {
  donorId: string;
  runtimeRoot: string;
  label: string;
}

export interface BridgeTranslation {
  donorId: string;
  actionType: string;
  canonicalWrites: string[];
}

export function createBridgeProjection(donorId: string, runtimeRoot: string, label: string): BridgeProjection {
  return {
    donorId,
    runtimeRoot,
    label,
  };
}

export function createBridgeTranslation(donorId: string, actionType: string): BridgeTranslation {
  return {
    donorId,
    actionType,
    canonicalWrites: [actionType],
  };
}
