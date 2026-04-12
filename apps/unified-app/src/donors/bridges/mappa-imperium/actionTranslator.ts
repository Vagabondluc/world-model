import { createBridgeTranslation } from "@/donors/bridges/shared";

export function translateMappaImperiumAction(actionType: string) {
  return createBridgeTranslation("mappa-imperium", actionType);
}
