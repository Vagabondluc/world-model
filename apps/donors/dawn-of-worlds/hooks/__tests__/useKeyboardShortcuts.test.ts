import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';
import { useGameStore } from '../../store/gameStore';

// Mock dependencies
vi.mock('../../store/gameStore');
vi.mock('../../logic/haptics');
vi.mock('../../logic/undo');

describe('useKeyboardShortcuts', () => {
    let mockDispatch: ReturnType<typeof vi.fn>;
    let mockSetSelection: ReturnType<typeof vi.fn>;
    let mockToggleSearch: ReturnType<typeof vi.fn>;
    let mockToggleEndTurn: ReturnType<typeof vi.fn>;
    let mockToggleDashboard: ReturnType<typeof vi.fn>;
    let mockToggleChronicler: ReturnType<typeof vi.fn>;
    let mockToggleTimeline: ReturnType<typeof vi.fn>;
    let mockToggleShortcuts: ReturnType<typeof vi.fn>;
    let mockProposeTurnScopedUndo: ReturnType<typeof vi.fn>;
    let mockTriggerHaptic: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockDispatch = vi.fn();
        mockSetSelection = vi.fn();
        mockToggleSearch = vi.fn();
        mockToggleEndTurn = vi.fn();
        mockToggleDashboard = vi.fn();
        mockToggleChronicler = vi.fn();
        mockToggleTimeline = vi.fn();
        mockToggleShortcuts = vi.fn();
        mockProposeTurnScopedUndo = vi.fn();
        mockTriggerHaptic = vi.fn();

        vi.mocked(useGameStore).mockReturnValue({
            dispatch: mockDispatch,
            setSelection: mockSetSelection
        } as any);

        vi.doMock('../../logic/undo').importActual({
            proposeTurnScopedUndo: mockProposeTurnScopedUndo
        });

        vi.doMock('../../logic/haptics').importActual({
            triggerHaptic: mockTriggerHaptic
        });
    });

    describe('Ctrl+S shortcut', () => {
        it('should call toggleChronicler when Ctrl+S is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 's',
                ctrlKey: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockToggleChronicler).toHaveBeenCalled();
        });

        it('should call toggleChronicler when Meta+S is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 's',
                metaKey: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockToggleChronicler).toHaveBeenCalled();
        });

        it('should prevent default behavior', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 's',
                ctrlKey: true,
                cancelable: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(event.defaultPrevented).toBe(true);
        });
    });

    describe('Ctrl+Z shortcut', () => {
        it('should call proposeTurnScopedUndo when Ctrl+Z is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'z',
                ctrlKey: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockProposeTurnScopedUndo).toHaveBeenCalled();
        });

        it('should dispatch undo event when undo is available', () => {
            mockProposeTurnScopedUndo.mockReturnValue({
                id: 'undo_evt',
                type: 'EVENT_REVOKE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { targetEventIds: ['evt_1'], reason: 'User Undo' }
            } as any);

            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'z',
                ctrlKey: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockDispatch).toHaveBeenCalled();
        });

        it('should trigger confirm haptic when undo succeeds', () => {
            mockProposeTurnScopedUndo.mockReturnValue({
                id: 'undo_evt',
                type: 'EVENT_REVOKE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { targetEventIds: ['evt_1'], reason: 'User Undo' }
            } as any);

            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'z',
                ctrlKey: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockTriggerHaptic).toHaveBeenCalledWith('confirm');
        });

        it('should trigger reject haptic when undo fails', () => {
            mockProposeTurnScopedUndo.mockReturnValue(null);

            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'z',
                ctrlKey: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockTriggerHaptic).toHaveBeenCalledWith('reject');
        });
    });

    describe('Enter shortcut', () => {
        it('should call toggleEndTurn when Enter is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                shiftKey: false
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockToggleEndTurn).toHaveBeenCalled();
        });

        it('should not call toggleEndTurn when Shift+Enter is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                shiftKey: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockToggleEndTurn).not.toHaveBeenCalled();
        });

        it('should prevent default behavior', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                shiftKey: false,
                cancelable: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(event.defaultPrevented).toBe(true);
        });
    });

    describe('Escape shortcut', () => {
        it('should call setSelection with NONE when Escape is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'Escape'
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockSetSelection).toHaveBeenCalledWith({ kind: 'NONE' });
        });

        it('should work even when typing in input', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const input = document.createElement('input');
            document.body.appendChild(input);

            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true
            });

            act(() => {
                input.dispatchEvent(event);
            });

            expect(mockSetSelection).toHaveBeenCalledWith({ kind: 'NONE' });

            document.body.removeChild(input);
        });
    });

    describe('C shortcut', () => {
        it('should call toggleDashboard when C is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 'c'
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockToggleDashboard).toHaveBeenCalled();
        });
    });

    describe('T shortcut', () => {
        it('should call toggleTimeline when T is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: 't'
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockToggleTimeline).toHaveBeenCalled();
        });
    });

    describe('? shortcut', () => {
        it('should call toggleShortcuts when ? is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: '?'
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockToggleShortcuts).toHaveBeenCalled();
        });
    });

    describe('/ shortcut', () => {
        it('should call toggleSearch when / is pressed', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: '/'
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(mockToggleSearch).toHaveBeenCalled();
        });

        it('should prevent default behavior', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const event = new KeyboardEvent('keydown', {
                key: '/',
                cancelable: true
            });

            act(() => {
                window.dispatchEvent(event);
            });

            expect(event.defaultPrevented).toBe(true);
        });
    });

    describe('shortcut conflicts', () => {
        it('should not trigger shortcuts when typing in input', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const input = document.createElement('input');
            document.body.appendChild(input);

            const event = new KeyboardEvent('keydown', {
                key: 's',
                ctrlKey: true,
                bubbles: true
            });

            act(() => {
                input.dispatchEvent(event);
            });

            expect(mockToggleChronicler).not.toHaveBeenCalled();

            document.body.removeChild(input);
        });

        it('should not trigger shortcuts when typing in textarea', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);

            const event = new KeyboardEvent('keydown', {
                key: 's',
                ctrlKey: true,
                bubbles: true
            });

            act(() => {
                textarea.dispatchEvent(event);
            });

            expect(mockToggleChronicler).not.toHaveBeenCalled();

            document.body.removeChild(textarea);
        });

        it('should not trigger shortcuts when typing in contenteditable element', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const div = document.createElement('div');
            div.contentEditable = 'true';
            document.body.appendChild(div);

            const event = new KeyboardEvent('keydown', {
                key: 's',
                ctrlKey: true,
                bubbles: true
            });

            act(() => {
                div.dispatchEvent(event);
            });

            expect(mockToggleChronicler).not.toHaveBeenCalled();

            document.body.removeChild(div);
        });

        it('should allow Escape in input elements', () => {
            const { result } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            const input = document.createElement('input');
            document.body.appendChild(input);

            const event = new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true
            });

            act(() => {
                input.dispatchEvent(event);
            });

            expect(mockSetSelection).toHaveBeenCalledWith({ kind: 'NONE' });

            document.body.removeChild(input);
        });
    });

    describe('shortcut cleanup', () => {
        it('should remove event listener on unmount', () => {
            const removeSpy = vi.spyOn(window, 'removeEventListener');

            const { unmount } = renderHook(() => useKeyboardShortcuts(
                mockToggleSearch,
                mockToggleEndTurn,
                mockToggleDashboard,
                mockToggleChronicler,
                mockToggleTimeline,
                mockToggleShortcuts
            ));

            unmount();

            expect(removeSpy).toHaveBeenCalled();
        });
    });
});
