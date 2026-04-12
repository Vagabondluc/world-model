import { EventEmitter } from 'node:events';

type WatcherOptions = {
  onChange: (_path: string) => void;
  debounceMs?: number;
};

export function createWatcher(options: WatcherOptions) {
  const emitter = new EventEmitter();
  const debounceMs = options.debounceMs ?? 25;
  let timer: NodeJS.Timeout | undefined;

  emitter.on('change', (filePath: string) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => options.onChange(filePath), debounceMs);
  });

  return emitter;
}
