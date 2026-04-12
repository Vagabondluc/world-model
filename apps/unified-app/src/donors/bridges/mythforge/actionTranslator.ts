import { createBridgeTranslation } from "@/donors/bridges/shared";

export function translateMythforgeAction(actionType: string) {
  return createBridgeTranslation("mythforge", actionType);
}
