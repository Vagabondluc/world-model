import { createBridgeTranslation } from "@/donors/bridges/shared";

export function translateAdventureGeneratorAction(actionType: string) {
  return createBridgeTranslation("adventure-generator", actionType);
}
