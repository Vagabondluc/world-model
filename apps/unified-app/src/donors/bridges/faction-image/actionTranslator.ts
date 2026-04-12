import { createBridgeTranslation } from "@/donors/bridges/shared";

export function translateFactionImageAction(actionType: string) {
  return createBridgeTranslation("faction-image", actionType);
}
