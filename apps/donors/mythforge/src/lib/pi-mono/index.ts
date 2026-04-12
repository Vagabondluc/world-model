export const PI_MONO_REPO_URL = 'https://github.com/badlogic/pi-mono';
export const PI_MONO_LOCAL_MIRROR = 'docs/research/pi-mono';

export { toPiMonoAdapterContext } from './context';

export const piMonoLibrary = {
  name: 'pi-mono',
  repoUrl: PI_MONO_REPO_URL,
  localMirror: PI_MONO_LOCAL_MIRROR,
} as const;

export type PiMonoLibrary = typeof piMonoLibrary;
