import { createBridgeTranslation } from "@/donors/bridges/shared";

export function translateOrbisAction(actionType: string) {
  return createBridgeTranslation("orbis", actionType);
}
