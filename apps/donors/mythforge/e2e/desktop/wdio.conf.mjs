import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { existsSync, createWriteStream } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');
const artifactsDir = path.resolve(projectRoot, 'e2e', 'desktop', 'artifacts');
const isWindows = process.platform === 'win32';

let tauriDriver;
let nextDevServer;
let ownsNextDevServer = false;
let exitRequested = false;
let nextDevServerLog;
let tauriDriverLog;

function tauriDriverPath() {
  const base = path.resolve(os.homedir(), '.cargo', 'bin', 'tauri-driver');
  return isWindows ? `${base}.exe` : base;
}

function appBinaryPath() {
  const binary = isWindows ? 'mythforge-tauri.exe' : 'mythforge-tauri';
  return path.resolve(projectRoot, 'src-tauri', 'target', 'debug', binary);
}

function closeTauriDriver() {
  exitRequested = true;
  tauriDriver?.kill();
}

function closeNextDevServer() {
  if (ownsNextDevServer) {
    nextDevServer?.kill();
  }
}

function closeLogStream(stream) {
  try {
    stream?.end();
  } catch {
    // ignore
  }
}

async function waitForHttp(url, timeoutMs = 60000) {
  const started = Date.now();
  // Keep polling until the dev server is actually serving the app.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // ignore and retry
    }
    if (Date.now() - started > timeoutMs) {
      throw new Error(`Timed out waiting for ${url}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    const done = (value) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(1000);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

function onShutdown(fn) {
  const cleanup = () => {
    try {
      fn();
    } finally {
      process.exit();
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('SIGHUP', cleanup);
  process.on('SIGBREAK', cleanup);
}

export const config = {
  host: '127.0.0.1',
  port: 4444,
  specs: [path.resolve(__dirname, 'specs/**/*.e2e.mjs')],
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      'tauri:options': {
        application: appBinaryPath(),
      },
    },
  ],
  reporters: ['spec'],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
  onPrepare: async () => {
    if (await isPortOpen(3000)) {
      ownsNextDevServer = false;
      return;
    }

    ownsNextDevServer = true;
    nextDevServerLog = createWriteStream(path.resolve(artifactsDir, 'next-server.log'), { flags: 'a' });
    nextDevServer = spawn(
      'npm',
      ['run', 'start'],
      {
        cwd: projectRoot,
        stdio: ['ignore', 'ignore', 'pipe'],
        env: {
          ...process.env,
          PORT: '3000',
        },
        shell: true,
      },
    );
    nextDevServer.stderr?.pipe(nextDevServerLog, { end: false });

    nextDevServer.on('error', (error) => {
      console.error('next dev server error:', error);
      process.exit(1);
    });

    await waitForHttp('http://127.0.0.1:3000');
  },
  beforeSession: () => {
    const appBinary = appBinaryPath();
    const driverBinary = tauriDriverPath();

    if (!existsSync(appBinary)) {
      throw new Error(`[E2E] Tauri app binary not found at ${appBinary}. Run the Rust build before desktop E2E.`);
    }
    if (!existsSync(driverBinary)) {
      throw new Error(`[E2E] tauri-driver not found at ${driverBinary}. Install it before running desktop E2E.`);
    }

    tauriDriverLog = createWriteStream(path.resolve(artifactsDir, 'tauri-driver.log'), { flags: 'a' });

    tauriDriver = spawn(
      driverBinary,
      [],
      {
        stdio: ['ignore', 'ignore', 'pipe'],
        env: {
          ...process.env,
          PATH: `${projectRoot};${process.env.PATH ?? ''}`,
        },
      },
    );
    tauriDriver.stderr?.pipe(tauriDriverLog, { end: false });

    tauriDriver.on('error', (error) => {
      console.error('tauri-driver error:', error);
      process.exit(1);
    });

    tauriDriver.on('exit', (code) => {
      if (!exitRequested) {
        console.error('tauri-driver exited with code:', code);
        process.exit(1);
      }
    });
  },
  afterSession: () => {
    closeTauriDriver();
    closeNextDevServer();
    closeLogStream(nextDevServerLog);
    closeLogStream(tauriDriverLog);
  },
};

onShutdown(() => {
  closeTauriDriver();
  closeNextDevServer();
  closeLogStream(nextDevServerLog);
  closeLogStream(tauriDriverLog);
});
