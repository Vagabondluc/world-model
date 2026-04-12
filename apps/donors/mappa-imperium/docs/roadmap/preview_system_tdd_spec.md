# Preview System TDD Specification

## Overview

This Test-Driven Development specification defines test cases for the Preview System component of the node-based visual editor. The Preview System is responsible for rendering real-time previews of tables and progress bars based on execution engine results.

## UI-Node Taxonomy Reference

This specification references the [UI-Node Taxonomy](./ui_node_taxonomy.md) for comprehensive visual component definitions, including:

- **Visual Component Taxonomy** - Defines how all UI elements are rendered
- **Data Schema Mapping** - Links visual representations to data structures
- **Behavioral Expectations** - Interaction patterns and states
- **Dynamic Node Creation** - JSON schema for custom node types

All test cases in this specification must align with the visual behaviors and rendering expectations defined in the taxonomy.

## Table of Contents

1. [PreviewPane Component](#previewpane-component)
2. [TablePreview Component](#tablepreview-component)
3. [ProgressBarsPreview Component](#progressbarspreview-component)
4. [PreviewStates Components](://previewstates-components)
5. [useDebounce Hook](#usedebounce-hook)

---

## PreviewPane Component

### Test Suite: PreviewPane Rendering

**File**: `src/components/node-editor/preview/PreviewPane.test.tsx`

#### Test: PreviewPane renders loading state when isLoading is true
```typescript
test('PreviewPane renders loading state when isLoading is true', () => {
    render(
        <PreviewPane
            graphResult={null}
            isLoading={true}
            error={null}
        />
    );
    
    expect(screen.getByText('Loading preview...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

#### Test: PreviewPane renders error state when error is provided
```typescript
test('PreviewPane renders error state when error is provided', () => {
    const mockError = new Error('Execution failed');
    
    render(
        <PreviewPane
            graphResult={null}
            isLoading={false}
            error={mockError}
        />
    );
    
    expect(screen.getByText('Preview Error')).toBeInTheDocument();
    expect(screen.getByText('Execution failed')).toBeInTheDocument();
});
```

#### Test: PreviewPane renders empty state when no result is provided
```typescript
test('PreviewPane renders empty state when no result is provided', () => {
    render(
        <PreviewPane
            graphResult={null}
            isLoading={false}
            error={null}
        />
    );
    
    expect(screen.getByText('No preview available')).toBeInTheDocument();
    expect(screen.getByText(/Execute the node graph to see the preview/)).toBeInTheDocument();
});
```

#### Test: PreviewPane renders table preview when graphResult contains table
```typescript
test('PreviewPane renders table preview when graphResult contains table', () => {
    const mockGraphResult: GraphResult = {
        table: {
            headers: [
                { id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true },
                { id: 'col-2', label: 'Value', width: 100, align: 'right', sortable: true }
            ],
            rows: [
                { id: 'row-1', cells: { 'col-1': 'Item 1', 'col-2': 50 } },
                { id: 'row-2', cells: { 'col-1': 'Item 2', 'col-2': 75 } }
            ],
            config: { rowHeight: 40, showBorders: true, stripeRows: true }
        },
        progressBars: [],
        errors: []
    };
    
    render(
        <PreviewPane
            graphResult={mockGraphResult}
            isLoading={false}
            error={null}
        />
    );
    
    expect(screen.getByText('Table Preview')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
});
```

#### Test: PreviewPane renders progress bars preview when graphResult contains progressBars
```typescript
test('PreviewPane renders progress bars preview when graphResult contains progressBars', () => {
    const mockGraphResult: GraphResult = {
        table: undefined,
        progressBars: [
            {
                label: 'Completion',
                value: 75,
                max: 100,
                progress: 0.75,
                style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
                showPercentage: true,
                showLabel: true
            }
        ],
        errors: []
    };
    
    render(
        <PreviewPane
            graphResult={mockGraphResult}
            isLoading={false}
            error={null}
        />
    );
    
    expect(screen.getByText('Progress Bars Preview')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
});
```

### Test Suite: PreviewPane Interaction

#### Test: PreviewPane allows switching between table and progress views
```typescript
test('PreviewPane allows switching between table and progress views', () => {
    const mockGraphResult: GraphResult = {
        table: createMockTableResult(),
        progressBars: createMockProgressBars(),
        errors: []
    };
    
    render(
        <PreviewPane
            graphResult={mockGraphResult}
            isLoading={false}
            error={null}
        />
    );
    
    const tableTab = screen.getByRole('tab', { name: 'Table' });
    const progressTab = screen.getByRole('tab', { name: 'Progress Bars' });
    
    expect(tableTab).toHaveAttribute('aria-selected', 'true');
    expect(progressTab).toHaveAttribute('aria-selected', 'false');
    
    fireEvent.click(progressTab);
    
    expect(tableTab).toHaveAttribute('aria-selected', 'false');
    expect(progressTab).toHaveAttribute('aria-selected', 'true');
});
```

---

## TablePreview Component

### Test Suite: TablePreview Rendering

**File**: `src/components/node-editor/preview/TablePreview.test.tsx`

#### Test: TablePreview renders table headers
```typescript
test('TablePreview renders table headers', () => {
    const mockTableResult: TableResult = {
        headers: [
            { id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true },
            { id: 'col-2', label: 'Value', width: 100, align: 'right', sortable: true }
        ],
        rows: [],
        config: { rowHeight: 40, showBorders: true, stripeRows: true }
    };
    
    render(<TablePreview table={mockTableResult} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
});
```

#### Test: TablePreview renders table rows
```typescript
test('TablePreview renders table rows', () => {
    const mockTableResult: TableResult = {
        headers: [
            { id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true },
            { id: 'col-2', label: 'Value', width: 100, align: 'right', sortable: true }
        ],
        rows: [
            { id: 'row-1', cells: { 'col-1': 'Item 1', 'col-2': 50 } },
            { id: 'row-2', cells: { 'col-1': 'Item 2', 'col-2': 75 } }
        ],
        config: { rowHeight: 40, showBorders: true, stripeRows: true }
    };
    
    render(<TablePreview table={mockTableResult} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
});
```

#### Test: TablePreview applies correct row height
```typescript
test('TablePreview applies correct row height', () => {
    const mockTableResult: TableResult = {
        headers: [{ id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true }],
        rows: [{ id: 'row-1', cells: { 'col-1': 'Item 1' } }],
        config: { rowHeight: 50, showBorders: true, stripeRows: true }
    };
    
    const { container } = render(<TablePreview table={mockTableResult} />);
    const tableRow = container.querySelector('[data-row-id="row-1"]');
    
    expect(tableRow).toHaveStyle({ height: '50px' });
});
```

#### Test: TablePreview shows borders when config.showBorders is true
```typescript
test('TablePreview shows borders when config.showBorders is true', () => {
    const mockTableResult: TableResult = {
        headers: [{ id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true }],
        rows: [{ id: 'row-1', cells: { 'col-1': 'Item 1' } }],
        config: { rowHeight: 40, showBorders: true, stripeRows: true }
    };
    
    const { container } = render(<TablePreview table={mockTableResult} />);
    const table = container.querySelector('table');
    
    expect(table).toHaveClass('table-with-borders');
});
```

#### Test: TablePreview applies stripe rows when config.stripeRows is true
```typescript
test('TablePreview applies stripe rows when config.stripeRows is true', () => {
    const mockTableResult: TableResult = {
        headers: [{ id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true }],
        rows: [
            { id: 'row-1', cells: { 'col-1': 'Item 1' } },
            { id: 'row-2', cells: { 'col-1': 'Item 2' } }
        ],
        config: { rowHeight: 40, showBorders: true, stripeRows: true }
    };
    
    const { container } = render(<TablePreview table={mockTableResult} />);
    const rows = container.querySelectorAll('tr');
    
    expect(rows[1]).toHaveClass('striped-row');
});
```

#### Test: TablePreview applies column alignment
```typescript
test('TablePreview applies column alignment', () => {
    const mockTableResult: TableResult = {
        headers: [
            { id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true },
            { id: 'col-2', label: 'Value', width: 100, align: 'right', sortable: true }
        ],
        rows: [{ id: 'row-1', cells: { 'col-1': 'Item 1', 'col-2': 50 } }],
        config: { rowHeight: 40, showBorders: true, stripeRows: true }
    };
    
    const { container } = render(<TablePreview table={mockTableResult} />);
    const cells = container.querySelectorAll('td');
    
    expect(cells[0]).toHaveClass('text-left');
    expect(cells[1]).toHaveClass('text-right');
});
```

### Test Suite: TablePreview Sorting

#### Test: TablePreview sorts rows when header is clicked
```typescript
test('TablePreview sorts rows when header is clicked', () => {
    const mockTableResult: TableResult = {
        headers: [
            { id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true },
            { id: 'col-2', label: 'Value', width: 100, align: 'right', sortable: true }
        ],
        rows: [
            { id: 'row-1', cells: { 'col-1': 'Item 1', 'col-2': 75 } },
            { id: 'row-2', cells: { 'col-1': 'Item 2', 'col-2': 50 } }
        ],
        config: { rowHeight: 40, showBorders: true, stripeRows: true }
    };
    
    render(<TablePreview table={mockTableResult} />);
    
    const valueHeader = screen.getByText('Value');
    fireEvent.click(valueHeader);
    
    // After sorting by Value ascending, Item 2 (50) should appear before Item 1 (75)
    const rows = screen.getAllByRole('row');
    expect(rows[0]).toHaveTextContent(/Item 2/);
    expect(rows[1]).toHaveTextContent(/Item 1/);
});
```

---

## ProgressBarsPreview Component

### Test Suite: ProgressBarsPreview Rendering

**File**: `src/components/node-editor/preview/ProgressBarsPreview.test.tsx`

#### Test: ProgressBarsPreview renders all progress bars
```typescript
test('ProgressBarsPreview renders all progress bars', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Completion',
            value: 75,
            max: 100,
            progress: 0.75,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        {
            label: 'Tasks',
            value: 3,
            max: 5,
            progress: 0.6,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#f59e0b', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        }
    ];
    
    render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    
    expect(screen.getByText('Completion')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
});
```

#### Test: ProgressBarsPreview renders progress bar with correct width
```typescript
test('ProgressBarsPreview renders progress bar with correct width', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Test',
            value: 75,
            max: 100,
            progress: 0.75,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        }
    ];
    
    const { container } = render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    const progressBar = container.querySelector('.progress-bar-fill');
    
    expect(progressBar).toHaveStyle({ width: '75%' });
});
```

#### Test: ProgressBarsPreview applies custom height
```typescript
test('ProgressBarsPreview applies custom height', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Test',
            value: 75,
            max: 100,
            progress: 0.75,
            style: { height: 32, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        }
    ];
    
    const { container } = render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    const progressBar = container.querySelector('.progress-bar-track');
    
    expect(progressBar).toHaveStyle({ height: '32px' });
});
```

#### Test: ProgressBarsPreview applies custom border radius
```typescript
test('ProgressBarsPreview applies custom border radius', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Test',
            value: 75,
            max: 100,
            progress: 0.75,
            style: { height: 24, borderRadius: 8, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        }
    ];
    
    const { container } = render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    const progressBar = container.querySelector('.progress-bar-track');
    
    expect(progressBar).toHaveStyle({ borderRadius: '8px' });
});
```

#### Test: ProgressBarsPreview applies custom colors
```typescript
test('ProgressBarsPreview applies custom colors', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Test',
            value: 75,
            max: 100,
            progress: 0.75,
            style: { height: 24, borderRadius: 4, backgroundColor: '#1f2937', fillColor: '#ef4444', textColor: '#f9fafb', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        }
    ];
    
    const { container } = render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    const progressBar = container.querySelector('.progress-bar-track');
    const progressBarFill = container.querySelector('.progress-bar-fill');
    
    expect(progressBar).toHaveStyle({ backgroundColor: '#1f2937' });
    expect(progressBarFill).toHaveStyle({ backgroundColor: '#ef4444' });
});
```

#### Test: ProgressBarsPreview hides label when showLabel is false
```typescript
test('ProgressBarsPreview hides label when showLabel is false', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Test',
            value: 75,
            max: 100,
            progress: 0.75,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: false
        }
    ];
    
    render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
});
```

#### Test: ProgressBarsPreview hides percentage when showPercentage is false
```typescript
test('ProgressBarsPreview hides percentage when showPercentage is false', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Test',
            value: 75,
            max: 100,
            progress: 0.75,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: false,
            showLabel: true
        }
    ];
    
    render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
});
```

### Test Suite: ProgressBarsPreview Segments

#### Test: ProgressBarsPreview renders progress bar with segments
```typescript
test('ProgressBarsPreview renders progress bar with segments', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Total',
            value: 100,
            max: 100,
            progress: 1,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true,
            segments: [
                { id: 'seg-1', label: 'Done', value: 50, color: '#10b981' },
                { id: 'seg-2', label: 'In Progress', value: 30, color: '#f59e0b' },
                { id: 'seg-3', label: 'Pending', value: 20, color: '#6b7280' }
            ]
        }
    ];
    
    render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
});
```

#### Test: ProgressBarsPreview calculates segment widths correctly
```typescript
test('ProgressBarsPreview calculates segment widths correctly', () => {
    const mockProgressBars: ProgressResult[] = [
        {
            label: 'Test',
            value: 100,
            max: 100,
            progress: 1,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true,
            segments: [
                { id: 'seg-1', label: 'A', value: 50, color: '#10b981' },
                { id: 'seg-2', label: 'B', value: 50, color: '#f59e0b' }
            ]
        }
    ];
    
    const { container } = render(<ProgressBarsPreview progressBars={mockProgressBars} />);
    const segments = container.querySelectorAll('.progress-segment');
    
    expect(segments[0]).toHaveStyle({ width: '50%' });
    expect(segments[1]).toHaveStyle({ width: '50%' });
});
```

---

## PreviewStates Components

### Test Suite: Loading State

**File**: `src/components/node-editor/preview/PreviewStates.test.tsx`

#### Test: PreviewLoadingState renders loading spinner
```typescript
test('PreviewLoadingState renders loading spinner', () => {
    render(<PreviewLoadingState />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading preview...')).toBeInTheDocument();
});
```

### Test Suite: Error State

#### Test: PreviewErrorState renders error message
```typescript
test('PreviewErrorState renders error message', () => {
    const mockError = new Error('Execution failed: Invalid node configuration');
    
    render(<PreviewErrorState error={mockError} />);
    
    expect(screen.getByText('Preview Error')).toBeInTheDocument();
    expect(screen.getByText('Execution failed: Invalid node configuration')).toBeInTheDocument();
});
```

#### Test: PreviewErrorState renders retry button
```typescript
test('PreviewErrorState renders retry button', () => {
    const mockError = new Error('Test error');
    const mockOnRetry = jest.fn();
    
    render(<PreviewErrorState error={mockError} onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalled();
});
```

### Test Suite: Empty State

#### Test: PreviewEmptyState renders empty message
```typescript
test('PreviewEmptyState renders empty message', () => {
    render(<PreviewEmptyState />);
    
    expect(screen.getByText('No preview available')).toBeInTheDocument();
    expect(screen.getByText(/Execute the node graph to see the preview/)).toBeInTheDocument();
});
```

---

## useDebounce Hook

### Test Suite: Debounce Functionality

**File**: `src/components/node-editor/hooks/useDebounce.test.ts`

#### Test: useDebounce delays function execution
```typescript
test('useDebounce delays function execution', () => {
    jest.useFakeTimers();
    const mockFn = jest.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 300));
    
    act(() => {
        result.current('arg1');
    });
    
    // Function should not be called immediately
    expect(mockFn).not.toHaveBeenCalled();
    
    // Fast-forward timers
    act(() => {
        jest.advanceTimersByTime(300);
    });
    
    expect(mockFn).toHaveBeenCalledWith('arg1');
    jest.useRealTimers();
});
```

#### Test: useDebounce resets timer on subsequent calls
```typescript
test('useDebounce resets timer on subsequent calls', () => {
    jest.useFakeTimers();
    const mockFn = jest.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 300));
    
    act(() => {
        result.current('arg1');
    });
    
    act(() => {
        jest.advanceTimersByTime(100);
    });
    
    // Second call before timer completes
    act(() => {
        result.current('arg2');
    });
    
    act(() => {
        jest.advanceTimersByTime(300);
    });
    
    // Only second call should execute
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('arg2');
    jest.useRealTimers();
});
```

#### Test: useDebounce cancels pending call on unmount
```typescript
test('useDebounce cancels pending call on unmount', () => {
    jest.useFakeTimers();
    const mockFn = jest.fn();
    const { result, unmount } = renderHook(() => useDebounce(mockFn, 300));
    
    act(() => {
        result.current('arg1');
    });
    
    unmount();
    
    act(() => {
        jest.advanceTimersByTime(300);
    });
    
    expect(mockFn).not.toHaveBeenCalled();
    jest.useRealTimers();
});
```

---

## Helper Functions

```typescript
// Test helper functions
function createMockTableResult(): TableResult {
    return {
        headers: [
            { id: 'col-1', label: 'Name', width: 'auto', align: 'left', sortable: true },
            { id: 'col-2', label: 'Value', width: 100, align: 'right', sortable: true }
        ],
        rows: [
            { id: 'row-1', cells: { 'col-1': 'Item 1', 'col-2': 50 } },
            { id: 'row-2', cells: { 'col-1': 'Item 2', 'col-2': 75 } }
        ],
        config: { rowHeight: 40, showBorders: true, stripeRows: true }
    };
}

function createMockProgressBars(): ProgressResult[] {
    return [
        {
            label: 'Completion',
            value: 75,
            max: 100,
            progress: 0.75,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#10b981', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        },
        {
            label: 'Tasks',
            value: 3,
            max: 5,
            progress: 0.6,
            style: { height: 24, borderRadius: 4, backgroundColor: '#e5e7eb', fillColor: '#f59e0b', textColor: '#374151', fontSize: 14, fontWeight: 'normal' },
            showPercentage: true,
            showLabel: true
        }
    ];
}
```
