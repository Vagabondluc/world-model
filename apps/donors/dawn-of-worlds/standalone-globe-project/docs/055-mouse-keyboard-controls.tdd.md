# TDD-055: Mouse and Keyboard Controls

**Specification:** SPEC-055  
**Status:** DRAFT  
**Created:** 2026-02-06

## 1. Overview

Test-Driven Development outline for implementing comprehensive mouse and keyboard controls in the standalone globe project. Each section defines tests that must be written and pass before implementation.

## 2. Test Files Structure

```
src/logic/globe/
├── input/
│   ├── __tests__/
│   │   ├── InputController.test.ts
│   │   ├── CameraController.test.ts
│   │   └── KeyboardShortcutManager.test.ts
│   ├── InputController.ts
│   ├── CameraController.ts
│   └── KeyboardShortcutManager.ts
```

---

## 3. InputController Tests

**File:** `src/logic/globe/input/__tests__/InputController.test.ts`

### 3.1 Key State Management

```typescript
describe('InputController', () => {
  describe('Key State', () => {
    it('should track pressed keys on keydown', () => {
      const controller = new InputController();
      controller.handleKeyDown('KeyW');
      expect(controller.isKeyPressed('KeyW')).toBe(true);
    });

    it('should release keys on keyup', () => {
      const controller = new InputController();
      controller.handleKeyDown('KeyW');
      controller.handleKeyUp('KeyW');
      expect(controller.isKeyPressed('KeyW')).toBe(false);
    });

    it('should track modifier keys (Shift, Ctrl, Alt)', () => {
      const controller = new InputController();
      controller.handleKeyDown('ShiftLeft');
      expect(controller.modifiers.shift).toBe(true);
      expect(controller.modifiers.ctrl).toBe(false);
    });

    it('should return all currently pressed keys', () => {
      const controller = new InputController();
      controller.handleKeyDown('KeyW');
      controller.handleKeyDown('KeyA');
      expect(controller.getPressedKeys()).toEqual(['KeyW', 'KeyA']);
    });
  });
});
```

### 3.2 Mouse State Management

```typescript
describe('Mouse State', () => {
  it('should track mouse position in normalized device coordinates', () => {
    const controller = new InputController();
    controller.handleMouseMove({ clientX: 400, clientY: 300 }, { width: 800, height: 600 });
    expect(controller.mousePosition).toEqual({ x: 0, y: 0 }); // Center
  });

  it('should track mouse button states', () => {
    const controller = new InputController();
    controller.handleMouseDown(0); // Left button
    expect(controller.isMouseButtonPressed(0)).toBe(true);
  });

  it('should track scroll delta', () => {
    const controller = new InputController();
    controller.handleWheel({ deltaY: -100 });
    expect(controller.getScrollDelta()).toBe(-100);
  });
});
```

### 3.3 Event Emission

```typescript
describe('Event Emission', () => {
  it('should emit action events based on key mappings', () => {
    const controller = new InputController();
    const callback = jest.fn();
    controller.on('rotate-left', callback);
    controller.handleKeyDown('KeyA');
    controller.update(16); // One frame at 60fps
    expect(callback).toHaveBeenCalled();
  });

  it('should emit continuous events while key is held', () => {
    const controller = new InputController();
    const callback = jest.fn();
    controller.on('rotate-left', callback);
    controller.handleKeyDown('KeyA');
    controller.update(16);
    controller.update(16);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should emit single-fire events only once per press', () => {
    const controller = new InputController();
    const callback = jest.fn();
    controller.on('reset-view', callback);
    controller.handleKeyDown('KeyR');
    controller.update(16);
    controller.update(16);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

---

## 4. CameraController Tests

**File:** `src/logic/globe/input/__tests__/CameraController.test.ts`

### 4.1 Programmatic Camera Control

```typescript
describe('CameraController', () => {
  let mockOrbitControls: MockOrbitControls;
  let mockCamera: MockCamera;
  let controller: CameraController;

  beforeEach(() => {
    mockCamera = createMockCamera();
    mockOrbitControls = createMockOrbitControls(mockCamera);
    controller = new CameraController(mockOrbitControls, mockCamera, { globeRadius: 2 });
  });

  describe('Rotation', () => {
    it('should rotate camera by given angle', () => {
      const initialAzimuth = mockOrbitControls.getAzimuthalAngle();
      controller.rotateHorizontal(10); // degrees
      expect(mockOrbitControls.getAzimuthalAngle()).toBeCloseTo(
        initialAzimuth + (10 * Math.PI / 180)
      );
    });

    it('should rotate vertically within bounds', () => {
      controller.rotateVertical(90); // degrees
      const polar = mockOrbitControls.getPolarAngle();
      expect(polar).toBeLessThanOrEqual(Math.PI - 0.1); // Not exactly at pole
    });

    it('should apply rotation speed config', () => {
      controller.setConfig({ rotationSpeed: 60 }); // 60 deg/s
      controller.rotateHorizontal(1); // 1 degree
      // Verify internal calculation uses config
    });
  });

  describe('Zoom', () => {
    it('should zoom to specified distance', () => {
      controller.zoomTo(4);
      expect(mockCamera.position.length()).toBeCloseTo(4);
    });

    it('should enforce minimum zoom distance', () => {
      controller.zoomTo(0.5); // Below min
      expect(mockCamera.position.length()).toBeGreaterThanOrEqual(2 * 1.2);
    });

    it('should enforce maximum zoom distance', () => {
      controller.zoomTo(100); // Above max
      expect(mockCamera.position.length()).toBeLessThanOrEqual(2 * 6);
    });

    it('should zoom smoothly over time with interpolation', () => {
      controller.zoomTo(4, { animated: true });
      controller.update(100); // 100ms
      // Should be partway to target
      expect(mockCamera.position.length()).toBeLessThan(4);
      expect(mockCamera.position.length()).toBeGreaterThan(controller.getCurrentDistance());
    });
  });

  describe('Center On Cell', () => {
    it('should rotate camera to face the cell center', () => {
      const cell = { center: { x: 1, y: 0, z: 0 } };
      controller.centerOn(cell);
      controller.update(1000); // Allow animation to complete
      // Camera should be looking at the cell
      expect(mockOrbitControls.target.distanceTo(cell.center)).toBeLessThan(0.01);
    });
  });

  describe('Reset View', () => {
    it('should return camera to default position', () => {
      controller.rotateHorizontal(90);
      controller.zoomTo(10);
      controller.resetView();
      controller.update(1000);
      expect(mockCamera.position.z).toBeCloseTo(2 * 2.5); // Default z
    });
  });
});
```

### 4.2 Integration with OrbitControls

```typescript
describe('OrbitControls Integration', () => {
  it('should respect existing damping settings', () => {
    const controller = new CameraController(mockOrbitControls, mockCamera, {});
    expect(mockOrbitControls.enableDamping).toBe(true);
  });

  it('should toggle auto-rotate', () => {
    const controller = new CameraController(mockOrbitControls, mockCamera, {});
    controller.toggleAutoRotate();
    expect(mockOrbitControls.autoRotate).toBe(false);
    controller.toggleAutoRotate();
    expect(mockOrbitControls.autoRotate).toBe(true);
  });
});
```

---

## 5. KeyboardShortcutManager Tests

**File:** `src/logic/globe/input/__tests__/KeyboardShortcutManager.test.ts`

### 5.1 Keybind Matching

```typescript
describe('KeyboardShortcutManager', () => {
  describe('Simple Keybinds', () => {
    it('should match single key shortcuts', () => {
      const manager = new KeyboardShortcutManager({
        'rotate-left': ['KeyA', 'ArrowLeft']
      });
      expect(manager.matchAction('KeyA')).toBe('rotate-left');
      expect(manager.matchAction('ArrowLeft')).toBe('rotate-left');
    });

    it('should return null for unbound keys', () => {
      const manager = new KeyboardShortcutManager({});
      expect(manager.matchAction('KeyQ')).toBeNull();
    });
  });

  describe('Combo Keybinds', () => {
    it('should match Shift+Key combinations', () => {
      const manager = new KeyboardShortcutManager({
        'cycle-back': ['Shift+Tab']
      });
      expect(manager.matchAction('Tab', { shift: true })).toBe('cycle-back');
      expect(manager.matchAction('Tab', { shift: false })).toBeNull();
    });

    it('should match Ctrl+Key combinations', () => {
      const manager = new KeyboardShortcutManager({
        'undo': ['Ctrl+KeyZ']
      });
      expect(manager.matchAction('KeyZ', { ctrl: true })).toBe('undo');
    });
  });

  describe('Action Categories', () => {
    it('should categorize actions as continuous or single-fire', () => {
      const manager = new KeyboardShortcutManager({
        'rotate-left': ['KeyA'],
        'reset-view': ['KeyR']
      });
      expect(manager.isContinuous('rotate-left')).toBe(true);
      expect(manager.isContinuous('reset-view')).toBe(false);
    });
  });

  describe('Custom Keybinds', () => {
    it('should allow runtime keybind updates', () => {
      const manager = new KeyboardShortcutManager({});
      manager.setKeybind('rotate-left', ['KeyQ']);
      expect(manager.matchAction('KeyQ')).toBe('rotate-left');
    });
  });
});
```

---

## 6. Integration Tests

**File:** `src/logic/globe/input/__tests__/InputIntegration.test.ts`

### 6.1 End-to-End Input Flow

```typescript
describe('Input Integration', () => {
  it('should rotate camera when A key is pressed', () => {
    const { inputController, cameraController, mockCamera } = setupIntegration();
    
    const initialX = mockCamera.position.x;
    inputController.handleKeyDown('KeyA');
    inputController.update(500); // Half second
    cameraController.update(500);
    
    expect(mockCamera.position.x).not.toEqual(initialX);
  });

  it('should zoom when scroll wheel is used', () => {
    const { inputController, cameraController, mockCamera } = setupIntegration();
    
    const initialDistance = mockCamera.position.length();
    inputController.handleWheel({ deltaY: -100 });
    inputController.update(16);
    cameraController.update(16);
    
    expect(mockCamera.position.length()).toBeLessThan(initialDistance);
  });

  it('should toggle panel visibility on P key', () => {
    const { inputController, shortcutManager } = setupIntegration();
    const callback = jest.fn();
    
    inputController.on('toggle-panel', callback);
    inputController.handleKeyDown('KeyP');
    inputController.update(16);
    
    expect(callback).toHaveBeenCalled();
  });
});
```

---

## 7. Test Utilities

**File:** `src/logic/globe/input/__tests__/testUtils.ts`

```typescript
export function createMockCamera(): THREE.PerspectiveCamera {
  return {
    position: new THREE.Vector3(0, 0, 5),
    lookAt: jest.fn(),
    updateProjectionMatrix: jest.fn(),
  } as unknown as THREE.PerspectiveCamera;
}

export function createMockOrbitControls(camera: THREE.Camera): OrbitControls {
  return {
    target: new THREE.Vector3(0, 0, 0),
    enableDamping: true,
    dampingFactor: 0.05,
    autoRotate: true,
    autoRotateSpeed: 0.5,
    minDistance: 2,
    maxDistance: 10,
    getAzimuthalAngle: jest.fn(() => 0),
    getPolarAngle: jest.fn(() => Math.PI / 2),
    update: jest.fn(),
    dispose: jest.fn(),
  } as unknown as OrbitControls;
}

export function setupIntegration() {
  const mockCamera = createMockCamera();
  const mockOrbitControls = createMockOrbitControls(mockCamera);
  const inputController = new InputController();
  const cameraController = new CameraController(mockOrbitControls, mockCamera, { globeRadius: 2 });
  const shortcutManager = new KeyboardShortcutManager(DEFAULT_KEYBINDS);
  
  return { inputController, cameraController, shortcutManager, mockCamera, mockOrbitControls };
}
```

---

## 8. Test Commands

Run all input-related tests:
```bash
cd standalone-globe-project
npx vitest run src/logic/globe/input/
```

Run with coverage:
```bash
npx vitest run src/logic/globe/input/ --coverage
```

Watch mode during development:
```bash
npx vitest watch src/logic/globe/input/
```

---

## 9. Acceptance Criteria

- [ ] All tests in `InputController.test.ts` pass
- [ ] All tests in `CameraController.test.ts` pass
- [ ] All tests in `KeyboardShortcutManager.test.ts` pass
- [ ] All tests in `InputIntegration.test.ts` pass
- [ ] Code coverage > 80% for all input modules
- [ ] No performance regressions (60fps maintained)
