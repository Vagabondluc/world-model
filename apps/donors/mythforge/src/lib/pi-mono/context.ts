import type { AiContextPack, AiRuntimeCapabilities } from '@/lib/llm/ai-context';

export const PI_MONO_REPO_URL = 'https://github.com/badlogic/pi-mono';
export const PI_MONO_LOCAL_MIRROR = 'docs/research/pi-mono';

export interface PiMonoAdapterContext {
  repoUrl: string;
  localMirror: string;
  contextPack: AiContextPack;
  providerCapabilities: AiRuntimeCapabilities;
  structuredBlocks: string[];
}

export function toPiMonoAdapterContext(contextPack: AiContextPack): PiMonoAdapterContext {
  return {
    repoUrl: PI_MONO_REPO_URL,
    localMirror: PI_MONO_LOCAL_MIRROR,
    contextPack,
    providerCapabilities: contextPack.runtime,
    structuredBlocks: contextPack.outputContract.allowedBlocks,
  };
}

