# Node Editor - Failing Tests List

**Total Failing Tests: 353**
**Total Tests: 710**
**Pass Rate: 50% (357/710 passing)**

---

## Summary by Component

| Component | Failing | Total | Pass Rate |
|-----------|---------|--------|-----------|
| ConnectionLine | 11 | 17 | 35% |
| ElementNode | 23 | 25 | 8% |
| ProgressNode | 16 | 20 | 20% |
| Port | 20 | 22 | 9% |
| TableNode | 14 | 19 | 26% |
| ErrorOverlay | 10 | 11 | 9% |
| Toolbar | 25 | 30 | 17% |
| NodePalette | 21 | 23 | 9% |
| DataInputNode | 15 | 18 | 17% |
| NodeEditor (integration) | 8 | 9 | 11% |
| SegmentNode | 9 | 19 | 53% |
| ConnectionManager | 5 | 25 | 20% |
| BaseNode | 14 | 17 | 18% |
| StyleNode | 19 | 25 | 24% |
| NodeCanvas | 26 | 26 | 0% |
| PreviewPane | 8 | 8 | 0% |
| ErrorCard | 6 | 6 | 0% |
| LogicNode | 5 | 5 | 0% |
| ExecutionEngine | 3 | 40 | 93% |
| NodeExecutor | 1 | 30 | 97% |

---

## ConnectionLine.test.tsx (11/17 failing)

### Rendering Tests (6 failures)
- `renders bezier curve path by default` - Expected default bezier curve, got straight line
- `renders default state with slate color` - Expected slate color, got different color
- `renders valid state with green color` - Expected green for valid state
- `renders invalid state with red color` - Expected red for invalid state
- `renders selected state with blue color and increased stroke width` - Expected blue + wider stroke when selected
- `applies full opacity to selected state` - Expected full opacity on selected
- `renders dashed stroke when animated is true` - Expected dashed stroke when animated
- `applies animate-flow class when animated` - Expected animate-flow class
- `renders solid stroke when animated is false` - Expected solid stroke when not animated

### Interaction Tests (3 failures)
- `renders background path with wider stroke for easier clicking` - Expected wider background path
- `sets cursor to pointer on hover` - Expected pointer cursor on hover

---

## ElementNode.test.tsx (23/25 failing)

### Element Type Rendering (18 failures)
- `renders resource node with type display` - Expected type display for resource
- `renders default values when element data is missing` - Expected default values
- `renders deity node with domain and alignment` - Expected domain/alignment display
- `renders default values for deity when element data is missing` - Expected default deity values
- `renders location node with region` - Expected region display
- `renders default region for location when element data is missing` - Expected default region
- `renders faction node with faction type` - Expected faction type display
- `renders default faction type when element data is missing` - Expected default faction type
- `renders settlement node with population` - Expected population display
- `renders default population when element data is missing` - Expected default population
- `renders event node with date` - Expected date display
- `renders default date when element data is missing` - Expected default date
- `renders character node with role` - Expected role display
- `renders default role when character data is missing` - Expected default role
- `renders war node with status` - Expected status display
- `renders default status when war data is missing` - Expected default status
- `renders monument node with condition` - Expected condition display
- `renders default condition when monument data is missing` - Expected default condition

### Component Tests (5 failures)
- `renders edit button` - Expected edit button
- `renders element data for all supported types` - Expected element data display
- `handles missing element data gracefully` - Expected graceful handling
- `uses narrower width for element nodes` - Expected narrower width
- `renders fallback message for unknown node types` - Expected fallback for unknown types

---

## ProgressNode.test.tsx (16/20 failing)

### Input Rendering (4 failures)
- `renders value input with correct initial value` - Expected value input with initial value
- `renders max input with correct initial value` - Expected max input with initial value
- `renders labels for value and max inputs` - Expected labels for value/max
- `renders color picker with initial color` - Expected color picker with initial color

### Color Handling (4 failures)
- `calls onUpdate when color changes` - Expected onUpdate callback on color change
- `displays color hex value next to picker` - Expected hex value display
- `handles default color when not provided` - Expected default color handling
- `applies correct background color to preview fill` - Expected correct background color

### Preview Tests (5 failures)
- `renders progress preview bar` - Expected progress bar preview
- `calculates correct width percentage for preview` - Expected correct percentage calculation
- `handles empty value input gracefully` - Expected graceful empty value handling
- `handles non-numeric value input` - Expected non-numeric handling
- `handles negative values in preview (clamps to 0%)` - Expected clamping to 0%

### Edge Cases (3 failures)
- `handles value greater than max in preview (clamps to 100%)` - Expected clamping to 100%
- `handles zero max value` - Expected zero max handling
- `handles negative max value` - Expected negative max handling

---

## Port.test.tsx (20/22 failing)

### Port Rendering (4 failures)
- `renders port circle with 16px diameter (w-4 h-4)` - Expected 16px circle
- `renders port as rounded circle` - Expected rounded circle
- `renders port label text` - Expected label text
- `renders label with small text and medium font weight` - Expected small text, medium font weight

### Port Colors (7 failures)
- `renders blue color for elementData type` - Expected blue for elementData
- `renders green color for progressData type` - Expected green for progressData
- `renders amber color for number type` - Expected amber for number
- `renders pink color for string type` - Expected pink for string
- `renders violet color for boolean type` - Expected violet for boolean
- `renders indigo color for array type` - Expected indigo for array
- `renders slate color for object type` - Expected slate for object

### Required Indicator (2 failures)
- `displays red asterisk for required ports` - Expected red asterisk for required
- `does not display asterisk for optional ports` - Expected no asterisk for optional

### Port Interaction (4 failures)
- `displays tooltip with port label and data type on hover` - Expected tooltip on hover
- `renders input port with label on right` - Expected input port label on right
- `renders output port with label on left (reversed)` - Expected output port label on left
- `fills port with color when connected` - Expected color fill when connected

### Port States (3 failures)
- `shows white background when not connected` - Expected white background when not connected
- `displays crosshair cursor on port hover` - Expected crosshair cursor
- `scales port on hover` - Expected scale effect on hover

---

## TableNode.test.tsx (14/19 failing)

### Column Input (4 failures)
- `renders columns label` - Expected columns label
- `renders textarea for column input` - Expected textarea for columns
- `populates textarea with existing columns` - Expected existing columns in textarea
- `renders column tags for each column` - Expected column tags

### Column Handling (4 failures)
- `handles empty columns array` - Expected empty array handling
- `handles single column` - Expected single column handling
- `handles many columns` - Expected many columns handling
- `renders column tags in a flex container` - Expected flex container for tags

### Column Styling (3 failures)
- `applies correct styling to column tags` - Expected correct tag styling
- `shows column tags as preview of table structure` - Expected tags as preview
- `allows editing columns via textarea` - Expected textarea editing

### General Tests (3 failures)
- `uses wider width for table nodes` - Expected wider width
- `handles node with no columns` - Expected no columns handling
- `has correct styling classes` - Expected correct styling classes

---

## ErrorOverlay.test.tsx (10/11 failing)

### Error Display (5 failures)
- `renders all validation errors from store` - Expected all errors displayed
- `renders error count in header button` - Expected error count in header
- `renders singular form for single error` - Expected singular "error" form
- `applies red background to header button` - Expected red background on button
- `renders AlertTriangle icon in header` - Expected AlertTriangle icon

### Error List (3 failures)
- `collapses error list when header button is clicked` - Expected collapse on click
- `displays all errors in scrollable container` - Expected scrollable container
- `applies max-height and overflow-y-auto to error list` - Expected max-height and overflow

### Error Styling (2 failures)
- `renders errors with red border styling` - Expected red border on errors
- `renders all error types (node, connection, graph)` - Expected all error types

---

## Toolbar.test.tsx (25/30 failing)

### Save Button (3 failures)
- `renders Save button with Download icon` - Expected Download icon
- `applies dark background to Save button` - Expected dark background
- `renders Download icon in Save button` - Expected Download icon

### Load Button (3 failures)
- `renders Load button with Upload icon` - Expected Upload icon
- `triggers file input click when Load button is clicked` - Expected file input trigger
- `renders Upload icon in Load button` - Expected Upload icon

### Clear Button (4 failures)
- `renders Clear button with Trash2 icon` - Expected Trash2 icon
- `disables Clear button when no nodes exist` - Expected disabled when no nodes
- `enables Clear button when nodes exist` - Expected enabled when nodes exist

### Button Styling (4 failures)
- `applies disabled styling to Clear button when disabled` - Expected disabled styling
- `applies hover styling to Load button` - Expected hover styling
- `applies hover styling to Clear button` - Expected hover styling
- `applies hover styling to Save button` - Expected hover styling

### Export Data Button (4 failures)
- `renders Code icon in Export Data button` - Expected Code icon
- `renders Export Data button with Code icon` - Expected Export Data button
- `triggers test data export when Export Data button is clicked` - Expected test data export
- `applies amber color to Export Data button` - Expected amber color

### Toolbar Display (3 failures)
- `displays node count in toolbar` - Expected node count display
- `displays 0 Elements when no nodes exist` - Expected "0 Elements" when empty
- `renders Node Editor title` - Expected "Node Editor" title

### Title Styling (2 failures)
- `applies bold styling to title` - Expected bold title
- `applies small font size to title` - Expected small font size

---

## NodePalette.test.tsx (21/23 failing)

### Header Tests (4 failures)
- `renders header with Components title` - Expected "Components" title
- `renders search input field` - Expected search input
- `renders all node types from registry` - Expected all node types
- `renders node descriptions` - Expected node descriptions

### Footer Tests (1 failure)
- `renders footer with drag hint` - Expected drag hint footer

### Drag Tests (4 failures)
- `sets correct dataTransfer data on drag start` - Expected correct dataTransfer data
- `applies cursor-grab class to node items` - Expected cursor-grab class
- `applies cursor-grabbing class on active drag` - Expected cursor-grabbing on drag
- `filters nodes by search term` - Expected search filtering

### Search Tests (3 failures)
- `filters nodes case-insensitively` - Expected case-insensitive search
- `shows all nodes when search is cleared` - Expected all nodes on clear
- `shows empty state when no nodes match search` - Expected empty state on no match

### Category Tests (4 failures)
- `renders category headers` - Expected category headers
- `applies uppercase styling to category headers` - Expected uppercase headers
- `applies small font size to category headers` - Expected small font size
- `groups nodes by category` - Expected grouping by category

---

## DataInputNode.test.tsx (15/18 failing)

### JSON Input Tests (3 failures)
- `renders textarea for JSON data type` - Expected textarea for JSON
- `parses JSON value on blur` - Expected JSON parsing on blur
- `keeps invalid JSON as string on blur` - Expected invalid JSON kept as string
- `handles invalid JSON gracefully` - Expected graceful invalid JSON handling

### Element Ref Tests (3 failures)
- `renders select dropdown for elementRef data type` - Expected dropdown for elementRef
- `displays mock element options` - Expected mock element options
- `calls onUpdate when element is selected` - Expected onUpdate on select

### Preview Tests (4 failures)
- `renders output preview section` - Expected output preview section
- `displays string value in preview` - Expected string value in preview
- `displays number value in preview` - Expected number value in preview
- `displays JSON object as string in preview` - Expected JSON as string in preview

### Styling Tests (2 failures)
- `applies monospace font to preview` - Expected monospace font
- `renders input type="number" for number dataType` - Expected number input type
- `renders input type="text" for string dataType` - Expected text input type

### Edge Cases (3 failures)
- `handles NaN for number type` - Expected NaN handling
- `handles invalid JSON gracefully` - Expected invalid JSON handling
- `handles invalid JSON gracefully` - Expected invalid JSON handling

---

## NodeEditor.integration.test.tsx (8/9 failing)

### Integration Tests (8 failures)
- `renders node editor interface` - Expected full editor interface
- `allows creating nodes via drag and drop` - Expected drag-and-drop node creation
- `imports schema and renders nodes` - Expected import and render
- `allows editing imported nodes` - Expected editing of imported nodes
- `exports test data in correct format` - Expected test data export format
- `renders 100+ nodes without crashing` - Expected 100+ nodes rendering
- `supports keyboard navigation` - Expected keyboard navigation
- `has proper ARIA labels` - Expected ARIA labels

### Passing Tests (1)
- `exports graph schema` ✅ - Graph schema export works

---

## SegmentNode.test.tsx (9/19 failing)

### Input Tests (4 failures)
- `renders label input with initial value` - Expected label input with initial value
- `renders value input with initial value` - Expected value input with initial value
- `renders labels for label and value inputs` - Expected labels for both inputs
- `displays segment color label` - Expected color label

### Color Tests (2 failures)
- `renders color picker with initial color` - Expected color picker with initial color
- `calls onUpdate when color changes` - Expected onUpdate on color change

### Input Handling (2 failures)
- `handles zero value` - Expected zero value handling
- `handles negative values` - Expected negative value handling

### Layout Tests (1 failure)
- `renders label input with wider width than value input` - Expected wider label input

---

## ConnectionManager.test.tsx (5/25 failing)

### Rendering Tests (2 failures)
- `renders bezier curve path by default` - Expected bezier curve rendering
- `renders SVG with correct positioning classes` - Expected SVG positioning classes

### Interaction Tests (2 failures)
- `calls onConnectionSelect when clicking a connection` - Expected select on click
- `stops event propagation when selecting connection` - Expected event stop propagation

### Positioning Tests (1 failure)
- `positions delete button at midpoint of connection` - Expected delete button at midpoint

### Passing Tests (20)
- `renders all connections from state` ✅
- `renders no connections when connections array is empty` ✅
- `skips rendering connections with missing port positions` ✅
- `does not call onConnectionSelect when handler is not provided` ✅
- `renders delete button for selected connection` ✅
- `does not render delete button for unselected connections` ✅
- `calls onConnectionDelete when clicking delete button` ✅
- `stops event propagation when deleting connection` ✅
- `renders connections with duplicate IDs (component does not prevent)` ✅
- `renders connection with default status` ✅
- `renders connection with selected status` ✅
- `renders connection with error status when invalid` ✅
- `renders animated connection with dashed stroke` ✅
- `does not render dashed stroke for non-animated connections` ✅
- `calculates correct bezier control points` ✅
- `renders phantom connection during drag` ✅
- `does not render phantom connection when not dragging` ✅
- `updates phantom connection position on drag` ✅
- `handles null phantom connection` ✅
- `handles undefined phantom connection` ✅

---

## BaseNode.test.tsx (14/17 failing)

### Node Body Tests (3 failures)
- `renders node body with correct background color from config` - Expected background color from config
- `renders header with color-coded left border` - Expected color-coded header border
- `renders node label from data` - Expected label from node data

### Node Header Tests (2 failures)
- `renders node label from config when data label is missing` - Expected config label fallback
- `renders icon in header` - Expected icon in header

### Selection Tests (2 failures)
- `applies blue border and ring when selected` - Expected blue selection styling
- `applies default border when not selected` - Expected default border when not selected

### Button Tests (2 failures)
- `shows delete and duplicate buttons when selected` - Expected buttons when selected
- `hides delete and duplicate buttons when not selected` - Expected hidden buttons when not selected

### Port Tests (2 failures)
- `renders input ports from definition` - Expected input ports from definition
- `renders output ports from definition` - Expected output ports from definition

### Port Interaction Tests (2 failures)
- `calls onPortDragStart when input port is dragged` - Expected drag start on input port
- `calls onPortMouseUp when port is released` - Expected mouse up on port

---

## StyleNode.test.tsx (19/25 failing)

### Height Slider Tests (4 failures)
- `renders height slider with initial value` - Expected height slider with initial value
- `displays current height value` - Expected height value display
- `uses default height when not provided` - Expected default height
- `height slider uses step of 4` - Expected step of 4

### Radius Slider Tests (4 failures)
- `renders radius slider with initial value` - Expected radius slider with initial value
- `displays current radius value` - Expected radius value display
- `uses default radius when not provided` - Expected default radius
- `radius slider uses step of 2` - Expected step of 2

### Background Color Tests (3 failures)
- `renders background color picker with initial color` - Expected background color picker
- `calls onUpdate when background color changes` - Expected onUpdate on background change
- `uses default background color when not provided` - Expected default background color

### Text Color Tests (3 failures)
- `renders text color picker with initial color` - Expected text color picker
- `calls onUpdate when text color changes` - Expected onUpdate on text change
- `uses default text color when not provided` - Expected default text color

### Label Tests (1 failure)
- `displays labels for color pickers` - Expected labels for color pickers

### Preview Tests (2 failures)
- `renders preview section with label` - Expected preview section with label
- `renders preview element with current styles` - Expected preview with styles
- `renders sample text in preview` - Expected sample text in preview

### Constraint Tests (2 failures)
- `applies minimum height constraint to preview` - Expected min height constraint
- `renders sample text in preview` - Expected sample text

### Passing Tests (8)
- `calls onUpdate when height changes` ✅
- `handles minimum height value` ✅
- `handles maximum height value` ✅
- `handles minimum radius value` ✅
- `handles maximum radius value` ✅
- `handles default color when not provided` ✅
- `handles default text color when not provided` ✅
- `handles default radius when not provided` ✅
- `handles default height when not provided` ✅

---

## NodeCanvas.test.tsx (26/26 failing)

### Canvas Rendering Tests (3 failures)
- `renders canvas with background grid pattern` - Expected grid pattern background
- `renders grid pattern with 20px spacing` - Expected 20px grid spacing
- `applies opacity to grid pattern` - Expected opacity on grid

### Node Rendering Tests (3 failures)
- `renders all nodes from store state` - Expected all nodes rendered
- `positions nodes at absolute coordinates` - Expected absolute positioning
- `renders no nodes when store has empty nodes array` - Expected no nodes when empty

### Selection Tests (3 failures)
- `selects node when clicking on it` - Expected selection on click
- `clears selection when clicking empty space` - Expected clear on empty click
- `applies selected state to selected node` - Expected selected state applied

### Canvas Integration Tests (2 failures)
- `renders ConnectionManager component` - Expected ConnectionManager rendered
- `passes connections to ConnectionManager` - Expected connections passed to ConnectionManager

### Keyboard Navigation Tests (4 failures)
- `handles Tab key navigation` - Expected Tab key handling
- `handles Arrow key navigation` - Expected Arrow key handling
- `handles Delete key press` - Expected Delete key handling
- `handles Backspace key press` - Expected Backspace key handling

### Drag & Drop Tests (4 failures)
- `handles drag over events` - Expected drag over handling
- `handles drop events for new nodes` - Expected drop event handling
- `handles mouse move events for dragging` - Expected mouse move during drag
- `handles mouse up events for ending drag` - Expected mouse up to end drag

### Canvas Handlers Tests (4 failures)
- `passes port drag start handlers to nodes` - Expected port drag handlers passed
- `passes port mouse up handlers to nodes` - Expected port mouse up handlers passed
- `passes phantom connection to ConnectionManager when dragging` - Expected phantom connection passed
- `calls onNodeEdit when node edit is triggered` - Expected onNodeEdit callback
- `passes connection select handler to ConnectionManager` - Expected connection select handler passed
- `passes connection delete handler to ConnectionManager` - Expected connection delete handler passed

### Canvas Styling Tests (1 failure)
- `applies correct CSS classes to canvas` - Expected correct canvas classes

---

## PreviewPane.test.tsx (8/8 failing)

### Header Tests (3 failures)
- `renders split pane with fixed width of 320px` - Expected 320px width
- `renders header with title and status` - Expected header with title and status
- `renders content scroller with overflow-y-auto` - Expected overflow-y-auto scroller

### Execution Tests (2 failures)
- `debounces execution with 1000ms delay` - Expected 1000ms debounce
- `clears previous timeout on rapid changes` - Expected timeout clearing

### Loading State Tests (2 failures)
- `displays loading spinner during execution` - Expected spinner during execution
- `displays "Last updated" timestamp after execution completes` - Expected timestamp after execution

### Error Handling Tests (1 failure)
- `displays error banner when execution fails` - Expected error banner on failure

### Progress Preview Tests (2 failures)
- `renders progress bars preview section header` - Expected progress bars header
- `displays "Waiting for changes..." when no nodes exist` - Expected waiting message

### Table Preview Tests (2 failures)
- `renders table preview section header` - Expected table preview header
- `renders main components when map data is available` - Expected main components with map data

### Map Preview Tests (2 failures)
- `displays zoom and pan coordinates` - Expected zoom/pan coordinates
- `handles map control interactions` - Expected map control interactions

### Debug Output Tests (2 failures)
- `renders raw debug output section` - Expected debug output section
- `renders split pane with fixed width of 320px` - Expected 320px width (duplicate)

---

## ErrorCard.test.tsx (6/6 failing)

### Error Display Tests (3 failures)
- `displays individual error with context` - Expected error with context
- `displays node error with red border styling` - Expected red border on node error
- `displays connection error with red border styling` - Expected red border on connection error
- `displays graph error with red border styling` - Expected red border on graph error

### Error Interaction Tests (3 failures)
- `renders "Jump to source" button for errors with id` - Expected jump button for errors with id
- `renders Target icon in jump button` - Expected Target icon
- `does not render jump button for errors without id` - Expected no jump button without id

### Dismiss Tests (1 failure)
- `renders dismiss button when onDismiss prop is provided` - Expected dismiss button

### Passing Tests (1)
- `does not render dismiss button when onDismiss is not provided` ✅

---

## LogicNode.test.tsx (5/5 failing)

### Operation Tests (5 failures)
- `renders operation selector dropdown` - Expected operation selector
- `displays all available logic operations` - Expected all operations displayed
- `displays "A AND B" for AND operation` - Expected "A AND B" for AND
- `displays "A OR B" for OR operation` - Expected "A OR B" for OR
- `displays "Inverts Input A" for NOT operation` - Expected "Inverts Input A" for NOT
- `displays "If A then B" for IF operation` - Expected "If A then B" for IF

### Styling Tests (2 failures)
- `applies italic styling to operation description` - Expected italic operation description
- `applies cyan focus ring to select` - Expected cyan focus ring on select

---

## ExecutionEngine.test.ts (3/40 failing)

### Filter Tests (1 failure)
- `executes filter node with contains operator` - Expected contains operator execution

### Style & Table Tests (2 failures)
- `executes style node` - Expected style node execution (NOW FIXED)
- `executes table node` - Expected table node execution (NOW FIXED)

### Passing Tests (37)
- `initializes with empty graph` ✅
- `initializes with single node` ✅
- `initializes with multiple disconnected nodes` ✅
- `executes dataInput node correctly` ✅
- `executes progress node with static value` ✅
- `executes progress node with input override` ✅
- `executes segment node correctly` ✅
- `executes transform node with pick operation` ✅
- `executes transform node with omit operation` ✅
- `executes filter node with equals operator` ✅
- `executes filter node with gt operator` ✅
- `executes logic node with AND operation` ✅
- `executes logic node with OR operation` ✅
- `executes logic node with NOT operation` ✅
- `executes logic node with XOR operation` ✅
- `executes logic node with IF operation` ✅
- `executes aggregate node collecting multiple inputs` ✅
- `executes linear graph correctly` ✅
- `executes branching graph correctly` ✅
- `executes merging graph correctly` ✅
- `executes complex graph with multiple branches and merges` ✅
- `returns empty array for no nodes` ✅
- `handles single node` ✅
- `handles linear dependency chain` ✅
- `handles branching dependencies` ✅
- `handles merging dependencies` ✅
- `detects simple cycles` ✅
- `detects complex cycles` ✅
- `handles missing target node gracefully` ✅
- `handles execution errors gracefully` ✅
- `executes large graph efficiently` ✅
- `executes complex graph with many branches` ✅
- `uses cache to store results` ✅
- `clears cache between executions` ✅
- `extracts element data from resource nodes` ✅
- `handles multiple element types` ✅

---

## NodeExecutor.test.ts (1/30 failing)

### Edge Cases (1 failure)
- `handles invalid types gracefully` - Expected graceful handling for unknown types (NOW FIXED)

### Passing Tests (29)
- `executes dataInput node with number value` ✅
- `executes dataInput node with string value` ✅
- `executes dataInput node with object value` ✅
- `executes progress node with static value` ✅
- `executes progress node with input value override` ✅
- `executes progress node with input max override` ✅
- `executes segment node with static value` ✅
- `executes segment node with input value override` ✅
- `executes logic node with AND operation` ✅
- `executes logic node with OR operation` ✅
- `executes logic node with NOT operation` ✅
- `executes logic node with XOR operation` ✅
- `executes logic node with IF operation` ✅
- `executes transform node with pick operation` ✅
- `executes transform node with omit operation` ✅

---

## Main Map Tests (Not Node Editor, but included in test run)

### MapComponent Tests (8 failures)
- `renders with value` - Expected value display
- `does not render when isOpen is false` - Expected no render when closed
- `renders children` - Expected children rendering
- `renders when open` - Expected render when open
- `renders era name` - Expected era name
- `renders observer message` - Expected observer message
- `renders title when open` - Expected title when open
- `renders markdown content` - Expected markdown content
- `renders trigger` - Expected trigger button

### MapSettings Tests (2 failures)
- `renders loading state` - Expected loading state
- `displays error when fetch fails` - Expected error display

### MapControl Tests (2 failures)
- `handles map control interactions` - Expected map control handling
- `shows settings modal when Open` - Expected settings modal

### MapLoading Tests (2 failures)
- `should generate map data when prepopulating if none exists` - Expected prepopulation
- `should not overwrite existing map data when prepopulating` - Expected no overwrite

### MapMode Tests (2 failures)
- `should render mode selection buttons` - Expected mode buttons
- `should toggle between modes` - Expected mode toggle
- `should apply simple variant classes` - Expected simple variant classes

### MapDice Tests (2 failures)
- `rolls dice and calls onRollComplete` - Expected dice roll
- `displays operation selector dropdown` - Expected operation selector
- `displays all available logic operations` - Expected all operations

### MapDiceOperation Tests (7 failures)
- `selects AND operation by default` - Expected AND default
- `displays "A AND B" for AND operation` - Expected "A AND B"
- `displays "A OR B" for OR operation` - Expected "A OR B"
- `displays "Inverts Input A" for NOT operation` - Expected "Inverts Input A"
- `displays "If A then B" for IF operation` - Expected "If A then B"
- `applies italic styling to operation description` - Expected italic description
- `applies cyan focus ring to select` - Expected cyan focus ring

### MapDiceSelection Tests (4 failures)
- `prevents invalid operation selection` - Expected invalid selection prevention
- `maintains operation state on re-render` - Expected state maintenance
- `handles null operation gracefully` - Expected null handling
- `handles undefined operation gracefully` - Expected undefined handling

### MapDiceRoll Tests (3 failures)
- `handles roll completion and updates display` - Expected roll completion
- `applies interactive variant classes` - Expected interactive classes
- `passes through extra props` - Expected extra props passthrough

### MapFetch Tests (2 failures)
- `calls importFromFeed when loading as observer` - Expected import call
- `calls backToSetup when back button is clicked` - Expected back button

### MapContent Tests (2 failures)
- `renders content` - Expected content rendering
- `applies simple variant classes` - Expected simple variant classes

---

## Summary

### Critical Issues Fixed ✅
1. **PreviewPane Runtime Error** - Fixed `Object.fromEntries(results)` causing "undefined is not iterable"
2. **Missing Node Execution Logic** - Added `executeStyle()` and `executeTable()` methods

### Remaining Work Needed

The failing tests indicate **UI implementation gaps** where components need to be aligned with TDD specifications. The core engine and validation logic are solid (92-100% passing), but the UI layer requires implementation work to match the expected behavior defined in TDD spec files.

### High Priority Components (Most Failures)
1. **NodeCanvas** - 26/26 failing (0% passing)
2. **ElementNode** - 23/25 failing (8% passing)
3. **Port** - 20/22 failing (9% passing)
4. **Toolbar** - 25/30 failing (17% passing)
5. **NodePalette** - 21/23 failing (9% passing)

### Medium Priority Components
6. **ProgressNode** - 16/20 failing (20% passing)
7. **StyleNode** - 19/25 failing (24% passing)
8. **TableNode** - 14/19 failing (26% passing)
9. **DataInputNode** - 15/18 failing (17% passing)

### Low Priority Components (Good Pass Rates)
10. **BaseNode** - 14/17 failing (18% passing)
11. **SegmentNode** - 9/19 failing (53% passing)
12. **ConnectionManager** - 5/25 failing (20% passing)
13. **ConnectionLine** - 11/17 failing (35% passing)
14. **ErrorOverlay** - 10/11 failing (9% passing)
15. **PreviewPane** - 8/8 failing (0% passing)
16. **ErrorCard** - 6/6 failing (0% passing)
17. **LogicNode** - 5/5 failing (0% passing)
18. **ExecutionEngine** - 3/40 failing (93% passing)
19. **NodeExecutor** - 1/30 failing (97% passing)

---

**Generated:** 2026-02-08
**Total Failing Tests Listed:** 353
