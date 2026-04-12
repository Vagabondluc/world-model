import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InputController } from '../InputController';
import { KeyboardShortcutManager } from '../KeyboardShortcutManager';
import { DEFAULT_KEYBINDS, DEFAULT_MOVEMENT_CONFIG } from '../types';

describe('InputController', () => {
    let controller: InputController;
    let shortcutManager: KeyboardShortcutManager;

    beforeEach(() => {
        shortcutManager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
        controller = new InputController(shortcutManager, DEFAULT_MOVEMENT_CONFIG);
    });

    describe('Key State', () => {
        it('should track pressed keys on keydown', () => {
            controller.handleKeyDown('KeyW');
            expect(controller.isKeyPressed('KeyW')).toBe(true);
        });

        it('should release keys on keyup', () => {
            controller.handleKeyDown('KeyW');
            controller.handleKeyUp('KeyW');
            expect(controller.isKeyPressed('KeyW')).toBe(false);
        });

        it('should track Shift modifier key', () => {
            controller.handleKeyDown('ShiftLeft');
            expect(controller.modifiers.shift).toBe(true);
            expect(controller.modifiers.ctrl).toBe(false);
        });

        it('should track Ctrl modifier key', () => {
            controller.handleKeyDown('ControlLeft');
            expect(controller.modifiers.ctrl).toBe(true);
            expect(controller.modifiers.shift).toBe(false);
        });

        it('should track Alt modifier key', () => {
            controller.handleKeyDown('AltLeft');
            expect(controller.modifiers.alt).toBe(true);
        });

        it('should release modifier keys on keyup', () => {
            controller.handleKeyDown('ShiftLeft');
            controller.handleKeyUp('ShiftLeft');
            expect(controller.modifiers.shift).toBe(false);
        });

        it('should return all currently pressed keys', () => {
            controller.handleKeyDown('KeyW');
            controller.handleKeyDown('KeyA');
            const pressed = controller.getPressedKeys();
            expect(pressed).toContain('KeyW');
            expect(pressed).toContain('KeyA');
            expect(pressed.length).toBe(2);
        });
    });

    describe('Mouse State', () => {
        it('should track mouse position in normalized device coordinates - center', () => {
            controller.handleMouseMove({ clientX: 400, clientY: 300 }, { width: 800, height: 600 });
            expect(controller.mousePosition.x).toBeCloseTo(0);
            expect(controller.mousePosition.y).toBeCloseTo(0);
        });

        it('should track mouse position - top left corner', () => {
            controller.handleMouseMove({ clientX: 0, clientY: 0 }, { width: 800, height: 600 });
            expect(controller.mousePosition.x).toBeCloseTo(-1);
            expect(controller.mousePosition.y).toBeCloseTo(1);
        });

        it('should track mouse position - bottom right corner', () => {
            controller.handleMouseMove({ clientX: 800, clientY: 600 }, { width: 800, height: 600 });
            expect(controller.mousePosition.x).toBeCloseTo(1);
            expect(controller.mousePosition.y).toBeCloseTo(-1);
        });

        it('should account for viewport offset', () => {
            controller.handleMouseMove(
                { clientX: 500, clientY: 400 },
                { width: 800, height: 600, left: 100, top: 100 }
            );
            expect(controller.mousePosition.x).toBeCloseTo(0);
            expect(controller.mousePosition.y).toBeCloseTo(0);
        });

        it('should track mouse button states', () => {
            controller.handleMouseDown(0); // Left button
            expect(controller.isMouseButtonPressed(0)).toBe(true);
            expect(controller.isMouseButtonPressed(1)).toBe(false);
        });

        it('should release mouse buttons', () => {
            controller.handleMouseDown(0);
            controller.handleMouseUp(0);
            expect(controller.isMouseButtonPressed(0)).toBe(false);
        });
    });

    describe('Scroll', () => {
        it('should track scroll delta', () => {
            controller.handleWheel({ deltaY: -100 });
            expect(controller.getScrollDelta()).toBe(-100);
        });

        it('should reset scroll delta after update', () => {
            controller.handleWheel({ deltaY: -100 });
            controller.update(16);
            expect(controller.getScrollDelta()).toBe(0);
        });
    });

    describe('Event Emission', () => {
        it('should emit action events based on key mappings', () => {
            const callback = vi.fn();
            controller.on('rotate-left', callback);
            controller.handleKeyDown('KeyA');
            controller.update(16); // One frame at 60fps
            expect(callback).toHaveBeenCalled();
        });

        it('should emit continuous events while key is held', () => {
            const callback = vi.fn();
            controller.on('rotate-left', callback);
            controller.handleKeyDown('KeyA');
            controller.update(16);
            controller.update(16);
            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('should emit single-fire events only once per press', () => {
            const callback = vi.fn();
            controller.on('reset-view', callback);
            controller.handleKeyDown('KeyR');
            controller.update(16);
            controller.update(16);
            controller.update(16);
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should allow single-fire events to fire again after key release', () => {
            const callback = vi.fn();
            controller.on('reset-view', callback);

            controller.handleKeyDown('KeyR');
            controller.update(16);
            controller.handleKeyUp('KeyR');
            controller.handleKeyDown('KeyR');
            controller.update(16);

            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('should pass delta time in seconds to callbacks', () => {
            const callback = vi.fn();
            controller.on('rotate-left', callback);
            controller.handleKeyDown('KeyA');
            controller.update(100); // 100ms
            expect(callback).toHaveBeenCalledWith(0.1); // 0.1 seconds
        });

        it('should allow removing event listeners', () => {
            const callback = vi.fn();
            controller.on('rotate-left', callback);
            controller.off('rotate-left', callback);
            controller.handleKeyDown('KeyA');
            controller.update(16);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Speed Multiplier', () => {
        it('should return 1.0 when no modifiers are pressed', () => {
            expect(controller.getSpeedMultiplier()).toBe(1.0);
        });

        it('should return shift multiplier when Shift is pressed', () => {
            controller.handleKeyDown('ShiftLeft');
            expect(controller.getSpeedMultiplier()).toBe(2.0);
        });

        it('should return ctrl multiplier when Ctrl is pressed', () => {
            controller.handleKeyDown('ControlLeft');
            expect(controller.getSpeedMultiplier()).toBe(0.5);
        });
    });

    describe('Configuration', () => {
        it('should allow updating config', () => {
            controller.setConfig({ rotationSpeed: 120 });
            const config = controller.getConfig();
            expect(config.rotationSpeed).toBe(120);
        });

        it('should preserve other config values when updating', () => {
            controller.setConfig({ rotationSpeed: 120 });
            const config = controller.getConfig();
            expect(config.zoomSpeed).toBe(DEFAULT_MOVEMENT_CONFIG.zoomSpeed);
        });
    });

    describe('Dispose', () => {
        it('should clear all state on dispose', () => {
            controller.handleKeyDown('KeyA');
            controller.handleMouseDown(0);
            controller.dispose();

            expect(controller.isKeyPressed('KeyA')).toBe(false);
            expect(controller.isMouseButtonPressed(0)).toBe(false);
            expect(controller.getPressedKeys().length).toBe(0);
        });
    });
});
