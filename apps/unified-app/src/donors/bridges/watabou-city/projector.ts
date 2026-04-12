import { createBridgeProjection } from "@/donors/bridges/shared";

export function projectWatabouCityWorld() {
  return createBridgeProjection("watabou-city", "world-model/apps/donors/watabou-city", "Watabou City");
}
