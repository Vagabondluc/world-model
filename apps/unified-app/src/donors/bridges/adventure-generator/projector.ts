import { createBridgeProjection } from "@/donors/bridges/shared";

export function projectAdventureGeneratorWorld() {
  return createBridgeProjection("adventure-generator", "world-model/apps/donors/adventure-generator", "Adventure Generator");
}
