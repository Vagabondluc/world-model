import { createBridgeTranslation } from "@/donors/bridges/shared";

export function translateDawnOfWorldsAction(actionType: string) {
  return createBridgeTranslation("dawn-of-worlds", actionType);
}
