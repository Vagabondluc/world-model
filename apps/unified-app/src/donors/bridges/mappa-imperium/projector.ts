import { createBridgeProjection } from "@/donors/bridges/shared";

export function projectMappaImperiumWorld() {
  return createBridgeProjection("mappa-imperium", "world-model/apps/donors/mappa-imperium", "Mappa Imperium");
}
