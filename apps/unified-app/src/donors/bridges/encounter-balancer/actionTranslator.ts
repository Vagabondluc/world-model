import { createBridgeTranslation } from "@/donors/bridges/shared";

export function translateEncounterBalancerAction(actionType: string) {
  return createBridgeTranslation("encounter-balancer", actionType);
}
