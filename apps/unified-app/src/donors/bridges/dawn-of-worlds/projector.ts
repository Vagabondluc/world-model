import { createBridgeProjection } from "@/donors/bridges/shared";

export function projectDawnOfWorldsWorld() {
  return createBridgeProjection("dawn-of-worlds", "world-model/apps/donors/dawn-of-worlds", "Dawn of Worlds");
}
