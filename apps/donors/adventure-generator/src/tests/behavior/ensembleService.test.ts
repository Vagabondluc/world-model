import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnsembleService } from '../../services/ensembleService';
import { isTauri } from '../../utils/envUtils';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

vi.mock('../../utils/envUtils', () => ({
    isTauri: vi.fn()
}));

vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn()
}));

vi.mock('@tauri-apps/api/event', () => ({
    listen: vi.fn().mockResolvedValue(() => {})
}));

describe('EnsembleService file watching', () => {
    beforeEach(() => {
        vi.mocked(isTauri).mockReset();
        vi.mocked(invoke).mockReset();
        vi.mocked(listen).mockReset();
    });

    afterEach(() => {
        // Explicitly restore all spies to prevent memory leaks
        vi.restoreAllMocks();
    });

    it('skips tauri watchers in browser mode and refreshes tree', async () => {
        vi.mocked(isTauri).mockReturnValue(false);
        const refreshSpy = vi.spyOn(EnsembleService, 'refreshFileTree').mockResolvedValue();

        await EnsembleService.startWatching('test-path');

        expect(invoke).not.toHaveBeenCalled();
        expect(listen).not.toHaveBeenCalled();
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('starts watchers in tauri mode and refreshes tree', async () => {
        vi.mocked(isTauri).mockReturnValue(true);
        const refreshSpy = vi.spyOn(EnsembleService, 'refreshFileTree').mockResolvedValue();

        await EnsembleService.startWatching('test-path');

        expect(invoke).toHaveBeenCalledWith('start_watching', { path: 'test-path' });
        expect(listen).toHaveBeenCalledWith('file-changed', expect.any(Function));
        expect(refreshSpy).toHaveBeenCalled();
    });
});
