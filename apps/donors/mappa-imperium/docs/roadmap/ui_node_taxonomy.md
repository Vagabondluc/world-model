# UI-Node Taxonomy

## Overview

This document defines a comprehensive UI-Node Taxonomy that serves as the definitive bridge between user intent and system data. It establishes a unified language across all components of the node-based visual editor, explicitly detailing how visual components represent, interact with, and differentiate between various node definitions.

## Taxonomy Structure

```
User Intent
    ↓
Visual Representation (UI Elements)
    ↓
Data Schema (System State)
```

### Hierarchical Layers

1. **User Intent Layer** - What the user wants to accomplish
2. **Visual Representation Layer** - How the UI presents options to the user
3. **Data Schema Layer** - How the system stores and processes the configuration

---

## Visual Component Taxonomy

### 1. Node Body

**Purpose**: The main container representing a node in the canvas.

**Visual Properties**:
- **Color Coding**: Each node type has a distinct color from [`NODE_REGISTRY`](../src/components/node-editor/nodes/NodeRegistry.ts:1)
  - DataInput: `#3B82F6` (Blue)
  - Progress: `#10B981` (Green)
  - Segment: `#F59E0B` (Amber)
  - Style: `#8B5CF6` (Purple)
  - Logic: `#EF4444` (Red)
  - Table: `#6366F1` (Indigo)
  - Transform: `#EC4899` (Pink)
  - Aggregate: `#F97316` (Orange)
  - Filter: `#6B7280` (Gray)

- **Iconography**: Each node displays an emoji icon representing its function
  - DataInput: 📊
  - Progress: 📊
  - Segment: 🔲
  - Style: 🎨
  - Logic: ⚡
  - Table: 📋
  - Transform: 🔄
  - Aggregate: ➕
  - Filter: 🔍

- **Border Styling**:
  - Default: 2px solid `--border-default`
  - Selected: 2px solid `--c-primary-600` with ring-4 ring-amber-300 ring-offset-2
  - Error: 2px solid `--c-red-600`

- **Shadow**: `shadow-lg` with elevation based on selection state

**Behavioral Expectations**:
- **Draggable**: Entire node body responds to mouse drag events
- **Selectable**: Click anywhere on node body to select
- **Positioning**: Absolute positioning based on `{ x, y }` coordinates
- **Z-Index**: Selected nodes have higher z-index (100) than unselected (50)

### 2. Node Header

**Purpose**: Displays node type label and provides quick actions.

**Visual Properties**:
- **Label**: Node type name (e.g., "Progress Bar", "Data Input")
- **Font**: `font-semibold text-sm`
- **Color**: `--text-heading`

**Interactive Elements**:
- **Delete Button**: Trash icon (🗑️) in top-right corner
  - Visible only when node is selected
  - Hover state: `--c-red-700` background
  - Click triggers `onDelete(nodeId)` callback
- **Duplicate Button**: Copy icon (📋) in top-right corner
  - Visible only when node is selected
  - Hover state: `--c-primary-700` background
  - Click creates copy of node with new ID

### 3. Node Ports

**Purpose**: Connection points for data flow between nodes.

**Visual Properties**:

#### Input Ports (Left Side)
- **Shape**: Circle with 16px diameter
- **Color**: 
  - Default: `--c-blue-500` background, `--c-blue-700` border
  - Connected: `--c-green-500` background, `--c-green-700` border
  - Error: `--c-red-500` background, `--c-red-700` border
- **Position**: Left edge of node body, vertically centered relative to port's position in definition
- **Label**: Port name displayed above the port (e.g., "Value", "Data")
- **Required Indicator**: Small asterisk (*) in red for required ports

#### Output Ports (Right Side)
- **Shape**: Circle with 16px diameter
- **Color**:
  - Default: `--c-green-500` background, `--c-green-700` border
  - Connected: `--c-blue-500` background, `--c-blue-700` border
  - Error: `--c-red-500` background, `--c-red-700` border
- **Position**: Right edge of node body, vertically centered
- **Label**: Port name displayed above the port (e.g., "Progress", "Result")

**Port Geometries**:
- **Circle**: `w-4 h-4 rounded-full border-2`
- **Hover State**: `scale-125 transition-transform`
- **Active State**: `ring-2 ring-amber-400` when connection is being created

**Behavioral Expectations**:
- **Connection Start**: Mouse down on output port initiates connection creation
- **Connection End**: Mouse up on input port completes connection
- **Hover Tooltip**: Shows port data type and label
- **Validation Feedback**: Visual indication of connection validity during drag

### 4. Node Content Area

**Purpose**: Displays node-specific configuration and data.

**Visual Properties**:
- **Background**: `--bg-card`
- **Padding**: `p-3`
- **Border**: Bottom border separating content from ports

**Content Types by Node Type**:

#### DataInputNode Content
- **Data Source Toggle**: Radio buttons for "Manual" vs "API"
- **JSON Editor**: Textarea for manual JSON entry
- **Preview**: Collapsible section showing parsed data structure
- **Row Count**: Badge showing number of items (e.g., "5 items")

#### ProgressNode Content
- **Label Input**: Text input for progress bar label
- **Value Input**: Number input for current value
- **Max Input**: Number input for maximum value
- **Auto Toggle**: Checkbox to use "auto" value from connected input
- **Percentage Toggle**: Checkbox to show/hide percentage
- **Label Toggle**: Checkbox to show/hide label
- **Style Preview**: Mini preview of progress bar with current settings

#### SegmentNode Content
- **Label Input**: Text input for segment label
- **Value Input**: Number input for segment value
- **Color Picker**: Color input with preset swatches
- **Pattern Select**: Dropdown for "solid", "striped", "gradient"

#### StyleNode Content
- **Height Slider**: Range input (8-64px)
- **Border Radius Slider**: Range input (0-16px)
- **Background Color**: Color picker
- **Fill Color**: Color picker
- **Text Color**: Color picker
- **Font Size Slider**: Range input (12-24px)
- **Font Weight Select**: Dropdown for "normal", "bold", "lighter"

#### LogicNode Content
- **Condition Input**: Text input for boolean expression
- **True Value Input**: Any input for true branch
- **False Value Input**: Any input for false branch
- **Expression Help**: Collapsible tooltip showing supported operators

#### TableNode Content
- **Header Configuration**: List of column definitions
  - Add Header Button
  - Remove Header Button
  - Per-Header: Label, Width, Alignment, Sortable
- **Row Height Slider**: Range input (24-72px)
- **Borders Toggle**: Checkbox
- **Stripe Rows Toggle**: Checkbox

### 5. Connection Lines

**Purpose**: Visual representation of data flow between nodes.

**Visual Properties**:
- **Type**: Bezier curves by default, with options for "straight" or "step"
- **Color**: `--c-neutral-500` by default, configurable per connection
- **Width**: 2px by default, configurable
- **Animation**: Optional flowing dash animation for active connections

**Connection States**:
- **Default**: Solid line with no animation
- **Hover**: Thicker line (3px) with highlight color
- **Selected**: Different color (`--c-primary-600`) with glow effect
- **Error**: Red dashed line indicating invalid connection
- **Creating**: Temporary line following cursor during drag

**Bezier Curve Parameters**:
- **Control Point 1**: 50% horizontal from source, same Y as source
- **Control Point 2**: 50% horizontal from target, same Y as target
- **Smoothness**: Cubic bezier for smooth curves

---

## Data Schema Mapping

### Node Definition Schema

```typescript
interface NodeDefinition {
    // Visual Properties
    id: string;                    // Unique identifier
    type: NodeType;                // Node type from taxonomy
    position: { x: number; y: number };  // Canvas position
    
    // Data Properties
    data: NodeData;                // Node-specific configuration
    inputs: PortDefinition[];       // Input ports
    outputs: PortDefinition[];      // Output ports
    config: NodeConfig;             // Registry configuration
}
```

### Port Definition Schema

```typescript
interface PortDefinition {
    // Visual Properties
    id: string;              // Port identifier
    label: string;           // Display label
    dataType: PortDataType;  // Type of data (visualized via color)
    required: boolean;       // Whether connection is required
    
    // Visual Mapping
    // dataType maps to visual color:
    // 'array' → Blue
    // 'object' → Purple
    // 'number' → Green
    // 'string' → Yellow
    // 'boolean' → Red
    // 'progressData' → Teal
    // 'tableRow' → Pink
}
```

### Port Data Type Definition

```typescript
type PortDataType =
    | 'array'
    | 'object'
    | 'number'
    | 'string'
    | 'boolean'
    | 'progressData'
    | 'tableRow';
```

### Port Color Mapping

```typescript
interface PortColorMapping {
    dataType: PortDataType;
    color: string;
    label: string;
}

const PORT_COLOR_MAP: PortColorMapping[] = [
    { dataType: 'array', color: '#3B82F6', label: 'Blue' },
    { dataType: 'object', color: '#8B5CF6', label: 'Purple' },
    { dataType: 'number', color: '#10B981', label: 'Green' },
    { dataType: 'string', color: '#F59E0B', label: 'Yellow' },
    { dataType: 'boolean', color: '#EF4444', label: 'Red' },
    { dataType: 'progressData', color: '#14B8A6', label: 'Teal' },
    { dataType: 'tableRow', color: '#EC4899', label: 'Pink' }
];
```

### Node Type Taxonomy

```typescript
type NodeType = 
    // Data Input Nodes
    | 'dataInput'      // External data source
    
    // Progress Bar Nodes
    | 'progress'        // Main progress bar
    | 'segment'         // Progress segment (nested)
    | 'style'           // Style configuration
    
    // Logic Nodes
    | 'logic'           // Conditional logic
    | 'transform'       // Data transformation
    | 'aggregate'       // Data aggregation
    | 'filter'          // Data filtering
    
    // Output Nodes
    | 'table'           // Table output
    | 'chart'           // Chart output (future)
    | 'export'          // Export node (future);
```

---

## Dynamic Node Type Creation

### JSON Schema for Custom Node Types

```typescript
interface CustomNodeTypeDefinition {
    // Metadata
    id: string;
    name: string;
    description: string;
    category: NodeCategory;
    
    // Visual Configuration
    icon: string;           // Emoji or icon identifier
    color: string;          // Hex color code
    backgroundColor: string; // Node background color
    textColor: string;       // Label text color
    
    // Port Configuration
    inputs: PortDefinition[];
    outputs: PortDefinition[];
    
    // Default Data
    defaultData: NodeData;
    
    // Execution Configuration
    execute: (inputs: Map<string, any>) => any;
    
    // Validation Configuration
    validate?: (data: NodeData) => ValidationResult;
}

interface NodeCategory {
    id: string;
    name: string;
    description: string;
}
```

### Custom Node Registration Process

1. **Define Type**: Create a [`CustomNodeTypeDefinition`](docs/roadmap/ui_node_taxonomy.md:1)
2. **Register**: Add to `NODE_REGISTRY` via `registerCustomNodeType()`
3. **Visual Mapping**: System automatically assigns:
   - Port colors based on `dataType`
   - Node body color from `color` property
   - Icon from `icon` property
4. **Validation**: Optional custom validation function runs before execution

### Example Custom Node Definition

```json
{
    "id": "custom-progress-ring",
    "name": "Circular Progress",
    "description": "A circular progress indicator with percentage in center",
    "category": "progress",
    "icon": "⭕",
    "color": "#8B5CF6",
    "backgroundColor": "#FFFFFF",
    "textColor": "#374151",
    "inputs": [
        {
            "id": "value",
            "label": "Value",
            "dataType": "number",
            "required": true
        },
        {
            "id": "max",
            "label": "Max",
            "dataType": "number",
            "required": true
        }
    ],
    "outputs": [
        {
            "id": "progress",
            "label": "Progress",
            "dataType": "progressData",
            "required": true
        }
    ],
    "defaultData": {
        "value": 0,
        "max": 100,
        "showPercentage": true,
        "radius": 50
    },
    "execute": "function(inputs) { return { value: inputs.value, max: inputs.max, progress: inputs.value / inputs.max }; }"
}
```

---

## Interaction Behaviors

### Drag Operations

**Node Dragging**:
- **Initiation**: Mouse down on node body (not on ports)
- **Movement**: Real-time position updates following cursor
- **Constraints**: 
  - Minimum position: (0, 0)
  - Maximum position: Canvas bounds minus node dimensions
  - Snap to grid: Optional 20px grid alignment
- **Completion**: Mouse up anywhere ends drag

**Port Dragging**:
- **Initiation**: Mouse down on port
- **Visual Feedback**: 
  - Temporary connection line follows cursor
  - Valid target ports highlight
  - Invalid target ports show error indicator
- **Completion**: Mouse up on valid target port creates connection

### Selection Behaviors

**Node Selection**:
- **Single Selection**: Click on node body selects it
- **Deselection**: Click on empty canvas area deselects
- **Keyboard Selection**: Tab cycles through nodes, Arrow keys navigate
- **Multi-Selection**: Shift+Click for multiple nodes (future)

**Connection Selection**:
- **Selection**: Click on connection line selects it
- **Actions**: Selected connection shows delete button
- **Deselection**: Click elsewhere deselects

### Edit Behaviors

**Inline Editing**:
- **Label Editing**: Double-click on node label enables inline edit
- **Value Editing**: Double-click on input field focuses it
- **Auto-Save**: Changes apply on blur or Enter key

**Modal Editing**:
- **Configuration**: Double-click on node body opens configuration modal
- **Port Configuration**: Click on port opens port configuration panel

---

## Error Visualization

### Node-Level Errors

**Visual Indicators**:
- **Error Border**: Red border (2px solid `--c-red-600`)
- **Error Icon**: Warning icon (⚠️) in node header
- **Error Badge**: Red badge with error count in top-right corner
- **Tooltip**: Hover shows error message

**Error States**:
- **Validation Error**: Invalid configuration (e.g., negative value)
- **Connection Error**: Missing required input connection
- **Execution Error**: Runtime error during graph execution

### Port-Level Errors

**Visual Indicators**:
- **Error Color**: Red background for port
- **Error Border**: Red border
- **Pulse Animation**: Pulsing effect for unconnected required ports

### Connection-Level Errors

**Visual Indicators**:
- **Error Style**: Red dashed line
- **Error Icon**: X icon at connection midpoint
- **Error Message**: Tooltip showing error reason

---

## Accessibility Considerations

### Keyboard Navigation

- **Tab**: Navigate between nodes
- **Arrow Keys**: Move selected node
- **Delete/Backspace**: Delete selected node or connection
- **Escape**: Cancel current operation (drag, edit)
- **Enter**: Confirm action

### Screen Reader Support

- **ARIA Labels**: All interactive elements have descriptive labels
- **Roles**: Semantic roles for nodes (`role="button"`, `role="listitem"`)
- **States**: ARIA states for selection (`aria-selected`), error (`aria-invalid`)
- **Live Regions**: Announce dynamic changes (connection created, error occurred)

### Focus Management

- **Focus Ring**: Visible focus indicator (`focus:ring-2`)
- **Focus Order**: Logical tab order through node elements
- **Focus Traps**: None - all interactive elements reachable

---

## Theme Integration

### Color Tokens

All UI elements use CSS custom properties from the design system:

```css
:root {
    /* Node Colors */
    --node-datainput-bg: #3B82F6;
    --node-progress-bg: #10B981;
    --node-segment-bg: #F59E0B;
    --node-style-bg: #8B5CF6;
    --node-logic-bg: #EF4444;
    --node-table-bg: #6366F1;
    
    /* Port Colors */
    --port-input-default: #3B82F6;
    --port-output-default: #10B981;
    --port-error: #EF4444;
    
    /* Status Colors */
    --status-valid: #10B981;
    --status-warning: #F59E0B;
    --status-error: #EF4444;
}
```

### Dark Mode Support

All colors automatically invert when `data-theme="dark"` is set on the `<html>` element.

---

## Extension Points

### Adding New Node Types

1. **Define Visual Properties**: Choose icon, color, and layout
2. **Define Data Schema**: Specify inputs, outputs, and configuration
3. **Implement Execution Logic**: Write the function that processes inputs
4. **Add to Registry**: Register with [`NODE_REGISTRY`](../src/components/node-editor/nodes/NodeRegistry.ts:1)
5. **Create Tests**: Add test cases to [`node_system_tdd_spec.md`](node_system_tdd_spec.md:1)

### Adding New Port Data Types

1. **Define Type**: Add to [`PortDataType`](../src/types/nodeEditor.types.ts:1) union
2. **Specify Visual Mapping**: Define color for the new type
3. **Update Port Rendering**: Modify [`Port`](../src/components/node-editor/connections/Port.tsx:1) component
4. **Add Validation**: Update [`NodeValidator`](../src/components/node-editor/validator/NodeValidator.ts:1)

---

## Reference Implementation

### Example: Creating a Custom Node Type

```typescript
// 1. Define the type
type 'customGauge' = 'customGauge';

// 2. Define visual configuration
const CUSTOM_GAUGE_CONFIG: NodeConfig = {
    label: 'Gauge',
    icon: '🎚',
    color: '#EC4899',
    inputs: [
        { id: 'value', label: 'Value', dataType: 'number', required: true },
        { id: 'min', label: 'Min', dataType: 'number', required: true },
        { id: 'max', label: 'Max', dataType: 'number', required: true }
    ],
    outputs: [
        { id: 'gauge', label: 'Gauge', dataType: 'any', required: true }
    ],
    defaultData: {
        value: 50,
        min: 0,
        max: 100,
        showLabel: true
    }
};

// 3. Register the type
NODE_REGISTRY['customGauge'] = CUSTOM_GAUGE_CONFIG;

// 4. Implement execution logic
function executeCustomGauge(inputs: Map<string, any>): any {
    return {
        value: inputs.get('value'),
        min: inputs.get('min'),
        max: inputs.get('max'),
        percentage: (inputs.get('value') - inputs.get('min')) / (inputs.get('max') - inputs.get('min'))
    };
}
```

---

## Related Specifications

This taxonomy is referenced by:
- [`spec-node-editor.md`](spec-node-editor.md:1) - Main architecture specification
- [`node_system_tdd_spec.md`](node_system_tdd_spec.md:1) - Node system TDD tests
- [`drag_drop_tdd_spec.md`](drag_drop_tdd_spec.md:1) - Drag-and-drop TDD tests
- [`validation_system_tdd_spec.md`](validation_system_tdd_spec.md:1) - Validation system TDD tests
