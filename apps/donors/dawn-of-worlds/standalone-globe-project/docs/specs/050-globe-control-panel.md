# SPEC-050: Globe Control Panel

**Epic:** Globe UI Components
**Status:** DRAFT
**Dependencies:** SPEC-051 (Globe App Orchestration), SPEC-052 (Globe Renderer Integration)

## 1. Overview

The ControlPanel component provides a comprehensive user interface for controlling world generation parameters and simulation controls for the standalone globe project. It features a collapsible design with intuitive controls for seed generation, parameter adjustment via sliders, era display, and simulation management.

## 2. Core Features

### 2.1 World Generation Controls

- **Seed Input**: Numeric input field (1-999999) with random seed generation button
- **Subdivisions Slider**: Controls icosphere subdivision levels (1-5)
- **Tectonic Plates Slider**: Adjusts plate count for world generation (5-20)
- **Noise Scale Slider**: Fine-tunes terrain noise scale (0.1-2.0, step 0.1)
- **Noise Octaves Slider**: Controls noise complexity (1-8)
- **Generate Button**: Triggers world generation with current parameters

### 2.2 Simulation Controls

- **Era Display**: Shows current simulation era in large, prominent format
- **Step Simulation Button**: Manually advances simulation by one era
- **Auto-Run Toggle**: Starts/stops automatic simulation progression

### 2.3 UI Features

- **Collapsible Panel**: Toggle between expanded and collapsed states
- **Responsive Design**: Adapts to mobile and desktop viewports
- **Visual Feedback**: Hover states, transitions, and disabled states
- **Glass Morphism Design**: Semi-transparent background with blur effects

## 3. Component Architecture

### 3.1 Props Interface

```typescript
export interface ControlPanelProps {
    onGenerateWorld: (params: WorldGenerationParams) => void;
    onStepSimulation: () => void;
    onToggleAutoRun: (enabled: boolean) => void;
    era?: number;
    isAutoRunning?: boolean;
}
```

### 3.2 State Management

```typescript
export interface WorldGenerationParams {
    seed: number;
    subdivisions: number;
    plateCount: number;
    noiseScale: number;
    noiseOctaves: number;
}

// Internal state
const [isCollapsed, setIsCollapsed] = useState(false);
const [seed, setSeed] = useState(12345);
const [subdivisions, setSubdivisions] = useState(3);
const [plateCount, setPlateCount] = useState(7);
const [noiseScale, setNoiseScale] = useState(2.0);
const [noiseOctaves, setNoiseOctaves] = useState(4);
```

## 4. User Interaction Flows

### 4.1 World Generation Flow

1. User adjusts parameters via sliders and input fields
2. User clicks "Generate New World" button
3. Component packages parameters into WorldGenerationParams object
4. onGenerateWorld callback is invoked with parameters
5. Era counter resets to 0

### 4.2 Simulation Control Flow

1. **Manual Step**: User clicks "Step Simulation" → onStepSimulation callback
2. **Auto-Run**: User clicks "Auto Run" → onToggleAutoRun(true) → simulation starts
3. **Pause**: User clicks "Pause" → onToggleAutoRun(false) → simulation stops

### 4.3 Panel Collapse Flow

1. User clicks collapse toggle (✕ when expanded, ⚙️ when collapsed)
2. Panel content is hidden/shown with smooth transition
3. Panel width adjusts accordingly
4. State persists across component lifecycle

## 5. Styling and Layout Specifications

### 5.1 Visual Design

- **Position**: Absolute positioning (top: 20px, right: 20px)
- **Dimensions**: 320px width (expanded), auto width (collapsed)
- **Background**: Semi-transparent dark theme with blur effect
- **Border**: Rounded corners (12px) with subtle border
- **Typography**: System font stack with appropriate sizing hierarchy

### 5.2 Component Styling

- **Buttons**: Three variants (primary, secondary, toggle) with hover states
- **Sliders**: Custom-styled range inputs with blue accent color
- **Input Fields**: Dark theme with focus states and blue borders
- **Era Display**: Prominent display with large monospace font

### 5.3 Responsive Behavior

- **Mobile (< 768px)**: Full width with 10px margins
- **Desktop**: Fixed width positioning in top-right corner
- **Transitions**: Smooth 0.3s ease transitions for all interactions

## 6. Accessibility Considerations

- **Semantic HTML**: Proper label associations with form controls
- **Keyboard Navigation**: Tab order follows logical flow
- **ARIA Labels**: Descriptive labels for interactive elements
- **Color Contrast**: Sufficient contrast ratios for text readability
- **Focus Indicators**: Visible focus states for keyboard users

## 7. Future Enhancement Opportunities

### 7.1 Parameter Presets

- Predefined parameter sets for different world types (islands, continents, etc.)
- Save/load custom parameter configurations

### 7.2 Advanced Controls

- Additional noise parameters (lacunarity, persistence)
- Climate and biome distribution controls
- Elevation range adjustments

### 7.3 UI Improvements

- Tooltips explaining parameter effects
- Real-time parameter preview
- Undo/redo functionality for parameter changes
- Parameter animation for demonstration purposes

### 7.4 Integration Features

- Export/import world parameters
- Share parameter sets via URL
- Integration with world gallery

## 8. Implementation Details

### 8.1 Key Dependencies

- React hooks (useState, useEffect)
- CSS modules for styling
- No external UI libraries required

### 8.2 Performance Considerations

- Debounced parameter updates to prevent excessive regeneration
- Efficient state management with minimal re-renders
- Optimized CSS transitions for smooth animations

### 8.3 Error Handling

- Input validation for numeric fields
- Boundary enforcement for slider values
- Graceful handling of missing callback functions

## 9. Verification

- **Functional Test**: All controls trigger appropriate callbacks
- **Visual Test**: Panel collapse/expand works smoothly
- **Responsive Test**: Layout adapts correctly to different screen sizes
- **Accessibility Test**: Keyboard navigation and screen reader compatibility
- **Parameter Test**: World generation parameters are correctly packaged and passed