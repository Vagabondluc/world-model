# Task List: Chronicler History Book UI

**TDD Reference:** [025-chronicler-history-book-ui.tdd.md](../tdd/025-chronicler-history-book-ui.tdd.md)

---

## Phase 1: UI Types and State

### Task 1.1: Create HistoryBookState Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Book state management)
**Implementation Steps:**
1. Create file `logic/chronicler/ui/types.ts`
2. Define `HistoryBookState` interface with fields:
   - `entries: JournalEntry[]`
   - `currentPage: number`
   - `entriesPerPage: number`
   - `filters: EntryFilters`
   - `searchQuery: string`
   - `selectedEntryId: string | null`
3. Export interface
**Test Mapping:** TC-001-001, TC-001-002 (State tests)

### Task 1.2: Create EntryFilters Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-005 (Filter application)
**Implementation Steps:**
1. In `logic/chronicler/ui/types.ts`, define `EntryFilters` interface with fields:
   - `entryTypes: EntryType[]`
   - `scopes: EntryScope[]`
   - `dateRange: { start: number; end: number } | null`
   - `authors: string[]`
2. Export interface
**Test Mapping:** TC-005-001, TC-005-002 (Filter tests)

### Task 1.3: Create BookViewMode Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Book view modes)
**Implementation Steps:**
1. In `logic/chronicler/ui/types.ts`, define `BookViewMode` enum with values: `LIST`, `DETAIL`, `TABLE_OF_CONTENTS`
2. Export enum
**Test Mapping:** TC-001-003, TC-001-004 (View mode tests)

---

## Phase 2: History Book State Manager

### Task 2.1: Create HistoryBookManager Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (Book state management)
**Implementation Steps:**
1. Create file `logic/chronicler/ui/manager.ts`
2. Implement `HistoryBookManager` class
3. Add `setState(state: Partial<HistoryBookState>): void` method
4. Add `getState(): HistoryBookState` method
5. Add `subscribe(listener: (state: HistoryBookState) => void): () => void` method
6. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Manager tests)

### Task 2.2: Create HistoryBookManager Instance
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Global history book manager)
**Implementation Steps:**
1. In `logic/chronicler/ui/manager.ts`, create singleton instance `historyBookManager`
2. Export singleton for application-wide use
**Test Mapping:** TC-001-001 (Singleton test)

---

## Phase 3: Page Navigation

### Task 3.1: Implement nextPage Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Page navigation)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `nextPage(): void` method
2. Check if not on last page
3. Increment current page
4. Notify subscribers
5. Export method
**Test Mapping:** TC-002-001, TC-002-002 (Next page tests)

### Task 3.2: Implement previousPage Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Page navigation)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `previousPage(): void` method
2. Check if not on first page
3. Decrement current page
4. Notify subscribers
5. Export method
**Test Mapping:** TC-002-003, TC-002-004 (Previous page tests)

### Task 3.3: Implement goToPage Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Page navigation)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `goToPage(page: number): void` method
2. Validate page number
3. Set current page
4. Notify subscribers
5. Export method
**Test Mapping:** TC-002-005, TC-002-006 (Go to page tests)

### Task 3.4: Implement getCurrentPageEntries Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Current page entries)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `getCurrentPageEntries(): JournalEntry[]` method
2. Calculate page start and end indices
3. Slice entries array
4. Return page entries
5. Export method
**Test Mapping:** TC-002-007, TC-002-008 (Current page tests)

---

## Phase 4: Entry Display

### Task 4.1: Implement selectEntry Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Entry display)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `selectEntry(entryId: string): void` method
2. Find entry by ID
3. Set selected entry ID
4. Switch to detail view mode
5. Notify subscribers
6. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Select entry tests)

### Task 4.2: Implement getSelectedEntry Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Selected entry retrieval)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `getSelectedEntry(): JournalEntry | null` method
2. Find entry by selected ID
3. Return entry or null
4. Export method
**Test Mapping:** TC-003-003, TC-003-004 (Get selected tests)

### Task 4.3: Implement deselectEntry Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Entry deselection)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `deselectEntry(): void` method
2. Clear selected entry ID
3. Switch to list view mode
4. Notify subscribers
5. Export method
**Test Mapping:** TC-003-005, TC-003-006 (Deselect tests)

---

## Phase 5: Table of Contents

### Task 5.1: Implement getTableOfContents Method
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-004 (Table of contents)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `getTableOfContents(): TableOfContentsEntry[]` method
2. Group entries by date or category
3. Generate TOC entries
4. Return TOC array
5. Export method
**Test Mapping:** TC-004-001, TC-004-002 (TOC tests)

### Task 5.2: Implement goToTOCEntry Method
**Priority:** P1
**Dependencies:** Task 2.1, Task 5.1
**Acceptance Criteria:** AC-004 (TOC navigation)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `goToTOCEntry(tocId: string): void` method
2. Find page for TOC entry
3. Navigate to page
4. Notify subscribers
5. Export method
**Test Mapping:** TC-004-003, TC-004-004 (TOC navigation tests)

---

## Phase 6: Filter Application

### Task 6.1: Implement setFilters Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-005 (Filter application)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `setFilters(filters: EntryFilters): void` method
2. Update filters in state
3. Reset to first page
4. Apply filters to entries
5. Notify subscribers
6. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Set filters tests)

### Task 6.2: Implement clearFilters Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-005 (Filter clearing)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `clearFilters(): void` method
2. Reset filters to default
3. Reset to first page
4. Notify subscribers
5. Export method
**Test Mapping:** TC-005-003, TC-005-004 (Clear filters tests)

### Task 6.3: Implement getFilteredEntries Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-005 (Filtered entries retrieval)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `getFilteredEntries(): JournalEntry[]` method
2. Apply filters to all entries
3. Return filtered array
4. Export method
**Test Mapping:** TC-005-005, TC-005-006 (Get filtered tests)

---

## Phase 7: Search Functionality

### Task 7.1: Implement setSearchQuery Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-006 (Search functionality)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `setSearchQuery(query: string): void` method
2. Update search query in state
3. Reset to first page
4. Apply search to entries
5. Notify subscribers
6. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Set search tests)

### Task 7.2: Implement clearSearch Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-006 (Search clearing)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `clearSearch(): void` method
2. Clear search query
3. Reset to first page
4. Notify subscribers
5. Export method
**Test Mapping:** TC-006-003, TC-006-004 (Clear search tests)

### Task 7.3: Implement searchEntries Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-006 (Entry search)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `searchEntries(query: string): JournalEntry[]` method
2. Search entry titles and text
3. Return matching entries
4. Export method
**Test Mapping:** TC-006-005, TC-006-006 (Search tests)

---

## Phase 8: Cross-Link Display

### Task 8.1: Implement getCrossLinks Method
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-007 (Cross-link display)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `getCrossLinks(entryId: string): CrossLink[]` method
2. Find entries referencing the given entry
3. Find entries referenced by the given entry
4. Return cross-links array
5. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Cross-link tests)

### Task 8.2: Implement navigateToCrossLink Method
**Priority:** P1
**Dependencies:** Task 2.1, Task 8.1
**Acceptance Criteria:** AC-007 (Cross-link navigation)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `navigateToCrossLink(entryId: string): void` method
2. Select the linked entry
3. Switch to detail view
4. Notify subscribers
5. Export method
**Test Mapping:** TC-007-003, TC-007-004 (Navigation tests)

---

## Phase 9: Responsive Layout

### Task 9.1: Create HistoryBookLayout Component
**Priority:** P0
**Dependencies:** Task 2.2
**Acceptance Criteria:** AC-008 (Responsive layout)
**Implementation Steps:**
1. Create file `components/chronicler/HistoryBookLayout.tsx`
2. Implement layout component with sidebar and main content
3. Add responsive breakpoints for mobile/tablet/desktop
4. Handle sidebar toggle for mobile
5. Export component
**Test Mapping:** TC-008-001, TC-008-002 (Layout tests)

### Task 9.2: Implement Responsive Entry List
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-008 (Responsive entry list)
**Implementation Steps:**
1. Create file `components/chronicler/EntryList.tsx`
2. Implement entry list component
3. Add responsive styling for different screen sizes
4. Handle touch interactions for mobile
5. Export component
**Test Mapping:** TC-008-003, TC-008-004 (Entry list tests)

---

## Phase 10: Keyboard Navigation

### Task 10.1: Implement Keyboard Navigation Handler
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-009 (Keyboard navigation)
**Implementation Steps:**
1. Create file `logic/chronicler/ui/keyboard.ts`
2. Implement `handleKeyboardNavigation(event: KeyboardEvent): void` function
3. Handle arrow keys for entry selection
4. Handle Page Up/Down for page navigation
5. Handle Escape for deselecting
6. Export handler function
**Test Mapping:** TC-009-001, TC-009-002 (Keyboard tests)

### Task 10.2: Integrate Keyboard Navigation with Manager
**Priority:** P1
**Dependencies:** Task 2.1, Task 10.1
**Acceptance Criteria:** AC-009 (Keyboard integration)
**Implementation Steps:**
1. Add keyboard event listener to `HistoryBookManager`
2. Route keyboard events to navigation handler
3. Export keyboard configuration options
**Test Mapping:** TC-009-003, TC-009-004 (Integration tests)

---

## Phase 11: Touch Gestures

### Task 11.1: Implement Touch Gesture Handler
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-010 (Touch gestures)
**Implementation Steps:**
1. Create file `logic/chronicler/ui/touch.ts`
2. Implement `handleTouchGesture(gesture: TouchGesture): void` function
3. Handle swipe left/right for page navigation
4. Handle tap for entry selection
5. Handle pinch for zoom
6. Export handler function
**Test Mapping:** TC-010-001, TC-010-002 (Gesture tests)

### Task 11.2: Integrate Touch Gestures with Manager
**Priority:** P1
**Dependencies:** Task 2.1, Task 11.1
**Acceptance Criteria:** AC-010 (Touch integration)
**Implementation Steps:**
1. Add touch event listeners to `HistoryBookManager`
2. Route touch events to gesture handler
3. Export gesture configuration options
**Test Mapping:** TC-010-003, TC-010-004 (Integration tests)

---

## Phase 12: Book Export

### Task 12.1: Implement exportToJSON Method
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-011 (Book export)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `exportToJSON(): string` method
2. Serialize entries to JSON
3. Return JSON string
4. Export method
**Test Mapping:** TC-011-001, TC-011-002 (JSON export tests)

### Task 12.2: Implement exportToMarkdown Method
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-011 (Book export)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `exportToMarkdown(): string` method
2. Convert entries to Markdown format
3. Return Markdown string
4. Export method
**Test Mapping:** TC-011-003, TC-011-004 (Markdown export tests)

### Task 12.3: Implement exportToHTML Method
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-011 (Book export)
**Implementation Steps:**
1. In `HistoryBookManager`, implement `exportToHTML(): string` method
2. Convert entries to HTML format
3. Return HTML string
4. Export method
**Test Mapping:** TC-011-005, TC-011-006 (HTML export tests)

---

## Phase 13: Accessibility Support

### Task 13.1: Implement ARIA Attributes
**Priority:** P1
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-012 (Accessibility support)
**Implementation Steps:**
1. Add ARIA labels to interactive elements
2. Add ARIA roles to containers
3. Add ARIA live regions for dynamic content
4. Export accessibility utilities
**Test Mapping:** TC-012-001, TC-012-002 (ARIA tests)

### Task 13.2: Implement Focus Management
**Priority:** P1
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-012 (Accessibility support)
**Implementation Steps:**
1. Implement focus trapping for modals
2. Implement focus restoration after navigation
3. Add visible focus indicators
4. Export focus utilities
**Test Mapping:** TC-012-003, TC-012-004 (Focus tests)

### Task 13.3: Implement Screen Reader Support
**Priority:** P1
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-012 (Accessibility support)
**Implementation Steps:**
1. Add descriptive text for screen readers
2. Announce navigation changes
3. Provide alternative text for visual content
4. Export screen reader utilities
**Test Mapping:** TC-012-005, TC-012-006 (Screen reader tests)

---

## Phase 14: React Components

### Task 14.1: Create HistoryBook Component
**Priority:** P0
**Dependencies:** Task 2.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `components/chronicler/HistoryBook.tsx`
2. Implement main history book component
3. Connect to history book manager
4. Handle state updates
5. Export component
**Test Mapping:** TC-001-001, TC-001-002

### Task 14.2: Create EntryCard Component
**Priority:** P0
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `components/chronicler/EntryCard.tsx`
2. Implement entry card component
3. Display entry title, text, author, timestamp
4. Add click handler for selection
5. Export component
**Test Mapping:** TC-003-001, TC-003-002

### Task 14.3: Create EntryDetail Component
**Priority:** P0
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `components/chronicler/EntryDetail.tsx`
2. Implement entry detail component
3. Display full entry information
4. Show cross-links
5. Add navigation controls
6. Export component
**Test Mapping:** TC-003-003, TC-003-004

### Task 14.4: Create TableOfContents Component
**Priority:** P1
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `components/chronicler/TableOfContents.tsx`
2. Implement TOC component
3. Display TOC entries
4. Add navigation handlers
5. Export component
**Test Mapping:** TC-004-001, TC-004-002

### Task 14.5: Create FilterPanel Component
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `components/chronicler/FilterPanel.tsx`
2. Implement filter panel component
3. Add filter controls for entry types, scopes, date range
4. Add clear filters button
5. Export component
**Test Mapping:** TC-005-001, TC-005-002

### Task 14.6: Create SearchBar Component
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `components/chronicler/SearchBar.tsx`
2. Implement search bar component
3. Add text input
4. Add search and clear buttons
5. Export component
**Test Mapping:** TC-006-001, TC-006-002

### Task 14.7: Create PaginationControls Component
**Priority:** P0
**Dependencies:** Task 3.4
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `components/chronicler/PaginationControls.tsx`
2. Implement pagination controls component
3. Add previous/next buttons
4. Add page indicator
5. Export component
**Test Mapping:** TC-002-001, TC-002-002

### Task 14.8: Create ExportButton Component
**Priority:** P1
**Dependencies:** Task 12.3
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `components/chronicler/ExportButton.tsx`
2. Implement export button component
3. Add format selection dropdown
4. Add export trigger
5. Export component
**Test Mapping:** TC-011-001, TC-011-002

---

## Phase 15: Test Files

### Task 15.1: Create HistoryBookManager Tests
**Priority:** P0
**Dependencies:** Task 2.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/manager.test.ts`
2. Write tests for state management
3. Write tests for subscription
4. Write tests for singleton instance
**Test Mapping:** TC-001-001, TC-001-002

### Task 15.2: Create PageNavigation Tests
**Priority:** P0
**Dependencies:** Task 3.4
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/navigation.test.ts`
2. Write tests for next page
3. Write tests for previous page
4. Write tests for go to page
5. Write tests for boundary conditions
**Test Mapping:** TC-002-001, TC-002-002

### Task 15.3: Create EntryDisplay Tests
**Priority:** P0
**Dependencies:** Task 4.3
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/entry.test.ts`
2. Write tests for entry selection
3. Write tests for entry deselection
4. Write tests for missing entry handling
**Test Mapping:** TC-003-001, TC-003-002

### Task 15.4: Create TableOfContents Tests
**Priority:** P1
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/toc.test.ts`
2. Write tests for TOC generation
3. Write tests for TOC navigation
4. Write tests for empty TOC handling
**Test Mapping:** TC-004-001, TC-004-002

### Task 15.5: Create FilterTests
**Priority:** P0
**Dependencies:** Task 6.3
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/filters.test.ts`
2. Write tests for filter application
3. Write tests for filter clearing
4. Write tests for multiple filters
**Test Mapping:** TC-005-001, TC-005-002

### Task 15.6: Create SearchTests
**Priority:** P0
**Dependencies:** Task 7.3
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/search.test.ts`
2. Write tests for search query
3. Write tests for search clearing
4. Write tests for no results handling
**Test Mapping:** TC-006-001, TC-006-002

### Task 15.7: Create CrossLinkTests
**Priority:** P1
**Dependencies:** Task 8.2
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/crosslink.test.ts`
2. Write tests for cross-link retrieval
3. Write tests for cross-link navigation
4. Write tests for no cross-links handling
**Test Mapping:** TC-007-001, TC-007-002

### Task 15.8: Create ResponsiveLayout Tests
**Priority:** P0
**Dependencies:** Task 9.2
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `components/chronicler/__tests__/layout.test.tsx`
2. Write tests for responsive layout
3. Write tests for sidebar toggle
4. Write tests for mobile view
**Test Mapping:** TC-008-001, TC-008-002

### Task 15.9: Create KeyboardNavigation Tests
**Priority:** P1
**Dependencies:** Task 10.2
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/keyboard.test.ts`
2. Write tests for arrow key navigation
3. Write tests for Page Up/Down navigation
4. Write tests for Escape key handling
**Test Mapping:** TC-009-001, TC-009-002

### Task 15.10: Create TouchGesture Tests
**Priority:** P1
**Dependencies:** Task 11.2
**Acceptance Criteria:** AC-010
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/touch.test.ts`
2. Write tests for swipe gestures
3. Write tests for tap gestures
4. Write tests for pinch gestures
**Test Mapping:** TC-010-001, TC-010-002

### Task 15.11: Create ExportTests
**Priority:** P1
**Dependencies:** Task 12.3
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `logic/chronicler/ui/__tests__/export.test.ts`
2. Write tests for JSON export
3. Write tests for Markdown export
4. Write tests for HTML export
**Test Mapping:** TC-011-001, TC-011-002

### Task 15.12: Create AccessibilityTests
**Priority:** P1
**Dependencies:** Task 13.3
**Acceptance Criteria:** AC-012
**Implementation Steps:**
1. Create file `components/chronicler/__tests__/accessibility.test.tsx`
2. Write tests for ARIA attributes
3. Write tests for focus management
4. Write tests for screen reader support
**Test Mapping:** TC-012-001, TC-012-002

---

## Summary

**Total Tasks:** 71
**P0 Tasks:** 44 (Types, Manager, Navigation, Entry display, Filters, Search, Layout, Components, Tests)
**P1 Tasks:** 27 (TOC, Cross-links, Keyboard, Touch, Export, Accessibility, Tests)

**Phases:** 15
- Phase 1: UI Types and State (3 tasks)
- Phase 2: History Book State Manager (2 tasks)
- Phase 3: Page Navigation (4 tasks)
- Phase 4: Entry Display (3 tasks)
- Phase 5: Table of Contents (2 tasks)
- Phase 6: Filter Application (3 tasks)
- Phase 7: Search Functionality (3 tasks)
- Phase 8: Cross-Link Display (2 tasks)
- Phase 9: Responsive Layout (2 tasks)
- Phase 10: Keyboard Navigation (2 tasks)
- Phase 11: Touch Gestures (2 tasks)
- Phase 12: Book Export (3 tasks)
- Phase 13: Accessibility Support (3 tasks)
- Phase 14: React Components (8 tasks)
- Phase 15: Test Files (12 tasks)
