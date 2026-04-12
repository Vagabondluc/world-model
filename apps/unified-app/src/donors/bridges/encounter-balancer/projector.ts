import { createBridgeProjection } from "@/donors/bridges/shared";

export function projectEncounterBalancerWorld() {
  return createBridgeProjection(
    "encounter-balancer",
    "world-model/apps/donors/encounter-balancer",
    "Encounter Balancer Scaffold",
  );
}
