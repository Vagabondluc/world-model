import { createBridgeTranslation } from "@/donors/bridges/shared";

export function translateWatabouCityAction(actionType: string) {
  return createBridgeTranslation("watabou-city", actionType);
}
