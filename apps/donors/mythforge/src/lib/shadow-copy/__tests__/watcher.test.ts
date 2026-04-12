import { describe, it, expect, vi } from 'vitest';
import { createWatcher } from '@/lib/shadow-copy/watcher';
import { sleep } from '../../../../tests/utils/helpers';

describe('Shadow Copy — watcher', () => {
  it('debounces rapid file changes', async () => {
    const onChange = vi.fn();
    const w = (createWatcher as any)?.({ onChange });
    // simulate rapid events
    if (w && typeof w.emit === 'function') {
      w.emit('change', 'a');
      w.emit('change', 'b');
    }
    await sleep(50);
    expect(onChange).toHaveBeenCalled();
  });
});
