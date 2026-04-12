# SPEC-051: Globe App Orchestration

**Epic:** Globe UI Components
**Status:** DRAFT
**Dependencies:** SPEC-050 (Globe Control Panel), SPEC-052 (Globe Renderer Integration)

## 1. Overview

The App component serves as the central orchestration layer for the standalone globe project. It manages application state, coordinates between the GlobeRenderer and ControlPanel components, and handles simulation logic through the WorldEngine. This component follows a unidirectional data flow pattern with clear separation of concerns.

## 2. Core Features

### 2.1 State Management

- **World Generation Parameters**: Seed, subdivisions, cell count, hex grid visibility, generator type
- **Simulation State**: Era counter, auto-run status, interval management
- **World Engine Reference**: Persistent reference to WorldEngine instance

### 2.2 Component Coordination

- **GlobeRenderer Integration**: Passes rendering parameters to GlobeRenderer
- **ControlPanel Integration**: Receives user actions and updates state accordingly
- **WorldEngine Management**: Initializes and manages WorldEngine lifecycle

### 2.3 Simulation Control

- **Manual Step**: Advances simulation by one era
- **Auto-Run**: Automatically advances simulation at 500ms intervals
- **Era Tracking**: Maintains current era count for display

## 3. Component Architecture

### 3.1 State Interface

```typescript
// World generation state
const [seed, setSeed] = useState(12345);
const [subdivisions, setSubdivisions] = useState(3);
const [cellCount, setCellCount] = useState(500);
const [showHexGrid, setShowHexGrid] = useState(true);
const [generatorType, setGeneratorType] = useState(GeneratorType.SIMPLEX);

// Simulation state
const [era, setEra] = useState(0);
const [isAutoRunning, setIsAutoRunning] = useState(false);
const autoRunIntervalRef = useRef<number | null>(null);

// World Engine reference
const worldEngineRef = useRef<WorldEngine | null>(null);
```

### 3.2 WorldEngine Configuration

```typescript
const config = {
    seed: seed.toString(),
    radius: 2,
    axialTilt: 23.5,
    plateCount: 7
};
```

### 3.3 Effect Hooks

- **Initialization Effect**: Creates WorldEngine instance on mount and seed changes
- **Auto-Run Effect**: Manages simulation interval based on auto-run state

## 4. User Interaction Flows

### 4.1 World Generation Flow

1. User adjusts parameters in ControlPanel
2. User clicks "Generate New World"
3. App receives WorldGenerationParams via onGenerateWorld callback
4. App updates state (seed, subdivisions, era reset)
5. App reinitializes WorldEngine with new configuration
6. GlobeRenderer re-renders with new parameters

### 4.2 Manual Simulation Step Flow

1. User clicks "Step Simulation" in ControlPanel
2. App receives onStepSimulation callback
3. App calls worldEngine.runStep()
4. App increments era counter
5. GlobeRenderer updates with new simulation state

### 4.3 Auto-Run Simulation Flow

1. User clicks "Auto Run" in ControlPanel
2. App receives onToggleAutoRun(true) callback
3. App sets isAutoRunning to true
4. Auto-run effect starts interval (500ms)
5. Interval triggers stepSimulation() repeatedly
6. User clicks "Pause" → onToggleAutoRun(false) → interval cleared

## 5. Data Flow Architecture

### 5.1 Unidirectional Flow

```
User Input → ControlPanel → App → WorldEngine
                      ↓                    ↓
                 State Update → GlobeRenderer
```

### 5.2 State Propagation

- **Downward**: App passes props to GlobeRenderer and ControlPanel
- **Upward**: Child components invoke callbacks to update App state
- **Side Effects**: WorldEngine operations triggered by state changes

### 5.3 Reference Management

- **WorldEngine Ref**: Maintained across re-renders to preserve engine state
- **Interval Ref**: Tracked for proper cleanup on unmount

## 6. Lifecycle Management

### 6.1 Mount Phase

1. Component initializes with default state values
2. WorldEngine created and initialized with default config
3. GlobeRenderer and ControlPanel rendered with initial props

### 6.2 Update Phase

1. State changes trigger re-renders
2. Effect hooks respond to specific state changes
3. WorldEngine reinitialized only on seed changes
4. Auto-run interval managed based on isAutoRunning state

### 6.3 Unmount Phase

1. Auto-run interval cleared
2. WorldEngine reference released
3. All event listeners cleaned up

## 7. Performance Considerations

### 7.1 Optimization Strategies

- **useCallback**: Memoize event handlers to prevent unnecessary re-renders
- **useRef**: Preserve WorldEngine instance across re-renders
- **Selective Updates**: Only reinitialize WorldEngine when seed changes
- **Effect Dependencies**: Properly scoped effects to prevent redundant operations

### 7.2 Memory Management

- **Interval Cleanup**: Ensures intervals are cleared on unmount
- **Reference Cleanup**: WorldEngine reference released when component unmounts
- **Effect Cleanup**: All effects return cleanup functions

### 7.3 Render Optimization

- **Stable Props**: Use memoized callbacks to prevent child re-renders
- **Conditional Rendering**: Only re-render components when necessary
- **State Co-location**: Keep related state close to where it's used

## 8. Error Handling

### 8.1 WorldEngine Failures

- Graceful handling of WorldEngine initialization failures
- Fallback to default configuration if initialization fails
- Error logging for debugging purposes

### 8.2 Simulation Errors

- Try-catch blocks around WorldEngine.runStep() calls
- Pause auto-run on simulation errors
- User notification of simulation failures

### 8.3 State Validation

- Input validation for world generation parameters
- Boundary checks for numeric values
- Type safety through TypeScript interfaces

## 9. Future Enhancement Opportunities

### 9.1 State Persistence

- Save/load world state to IndexedDB
- Persist user preferences across sessions
- Export/import world configurations

### 9.2 Advanced Simulation Features

- Configurable auto-run speed
- Simulation rewind functionality
- Branching simulation paths

### 9.3 Integration Features

- WebSocket integration for multiplayer
- Real-time collaboration features
- Cloud-based world storage

### 9.4 Performance Improvements

- Web Workers for simulation calculations
- Virtualization for large-scale simulations
- Optimized rendering with React.memo

## 10. Implementation Details

### 10.1 Key Dependencies

- React hooks (useState, useEffect, useCallback, useRef)
- WorldEngine from logic/world-engine
- GeneratorType from logic/globe/overlay/hexGrid

### 10.2 Component Structure

```typescript
const App: React.FC = () => {
    // State declarations
    // Effect hooks
    // Event handlers
    // Render
    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <GlobeRenderer {...rendererProps} />
            <ControlPanel {...controlPanelProps} />
        </div>
    );
};
```

### 10.3 Event Handlers

- **handleGenerateWorld**: Processes world generation requests
- **stepSimulation**: Advances simulation by one era
- **handleToggleAutoRun**: Manages auto-run state

## 11. Verification

- **Functional Test**: All user interactions produce expected results
- **State Test**: State updates propagate correctly to child components
- **Lifecycle Test**: Component mounts, updates, and unmounts correctly
- **Performance Test**: Auto-run runs smoothly without memory leaks
- **Integration Test**: GlobeRenderer and ControlPanel coordinate properly
