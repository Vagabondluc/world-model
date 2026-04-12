import { startE2EServers } from "./lib/server-manager";

export default async function globalSetup(): Promise<void> {
  await startE2EServers();
}
