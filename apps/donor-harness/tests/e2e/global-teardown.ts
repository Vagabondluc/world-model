import { clearE2EServerState, loadE2EServerState, stopE2EServers } from "./lib/server-manager";

export default async function globalTeardown(): Promise<void> {
  const state = await loadE2EServerState();
  if (!state) {
    return;
  }
  await stopE2EServers(
    state.servers.map((server) => ({
      donorId: server.donorId,
      label: server.label,
      url: server.url,
      cwd: server.cwd,
      command: server.command,
      logPath: server.logPath,
      pid: server.pid,
      reused: server.reused,
      failed: server.failed
    }))
  );
  await clearE2EServerState();
}
