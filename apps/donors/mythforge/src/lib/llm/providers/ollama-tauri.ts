export type OllamaChunk = { token: string; done: boolean };

export async function* ollamaGenerate(model: string, prompt: string): AsyncGenerator<string, void, unknown> {
  // Dynamically import Tauri APIs so tests can mock these modules.
  // Start generation on the Rust side (returns immediately)
  const tauri = await import('@tauri-apps/api/core');
  const eventApi = await import('@tauri-apps/api/event');

  await tauri.invoke('ollama_generate', { model, prompt });

  // Queue to collect events
  const queue: OllamaChunk[] = [];

  const unlisten = await eventApi.listen('ollama_chunk', (event: { payload: unknown }) => {
    const payload = event.payload as Partial<OllamaChunk> | undefined;
    if (payload && typeof payload.token === 'string') {
      queue.push({ token: payload.token, done: !!payload.done });
    }
  });

  try {
    while (true) {
      if (queue.length > 0) {
        const next = queue.shift();
        if (!next) continue;
        if (next.token && next.token.length > 0) {
          yield next.token;
        }
        if (next.done) break;
      } else {
        // wait shortly
        await new Promise((r) => setTimeout(r, 40));
      }
    }
  } finally {
    await unlisten();
  }
}

export default ollamaGenerate;
