import { createBridgeProjection } from "@/donors/bridges/shared";

export function projectMythforgeWorld() {
  return createBridgeProjection("mythforge", "world-model/apps/donors/mythforge", "Mythforge");
}
