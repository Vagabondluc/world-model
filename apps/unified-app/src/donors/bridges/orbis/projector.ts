import { createBridgeProjection } from "@/donors/bridges/shared";

export function projectOrbisWorld() {
  return createBridgeProjection("orbis", "world-model/apps/donors/orbis", "Orbis");
}
