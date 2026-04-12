import { createBridgeProjection } from "@/donors/bridges/shared";

export function projectFactionImageWorld() {
  return createBridgeProjection("faction-image", "world-model/apps/donors/faction-image", "Faction Image");
}
