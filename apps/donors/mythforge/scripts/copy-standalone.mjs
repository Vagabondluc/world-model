import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const nextDir = path.join(root, '.next');
const standaloneDir = path.join(nextDir, 'standalone');

await mkdir(path.join(standaloneDir, '.next'), { recursive: true });
await cp(path.join(nextDir, 'static'), path.join(standaloneDir, '.next', 'static'), { recursive: true });
await cp(path.join(root, 'public'), path.join(standaloneDir, 'public'), { recursive: true });
