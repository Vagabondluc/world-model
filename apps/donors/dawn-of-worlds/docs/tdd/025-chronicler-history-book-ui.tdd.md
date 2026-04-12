# TDD: Chronicler History Book UI

## Specification Reference
- Spec: [`025-chronicler-history-book-ui.md`](../specs/025-chronicler-history-book-ui.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Book State Management
**Given** a BookState is initialized
**When** book is opened
**Then** state must reflect open status and current page

### AC-002: Page Navigation
**Given** a book with multiple pages
**When** user navigates
**Then** current page must update correctly

### AC-003: Entry Display
**Given** a journal entry
**When** entry is rendered
**Then** entry must display title, text, author, and metadata

### AC-004: Table of Contents
**Given** a book with entries
**When** TOC is requested
**Then** all entries must be organized by age

### AC-005: Filter Application
**Given** active filters
**When** entries are displayed
**Then** only matching entries must be shown

### AC-006: Search Functionality
**Given** a search query
**When** search is executed
**Then** matching entries must be returned

### AC-007: Cross-Link Display
**Given** an entry with related objects
**When** entry is displayed
**Then** related hexes and world objects must be shown

### AC-008: Responsive Layout
**Given** different screen sizes
**When** book is rendered
**Then** layout must adapt to screen size

### AC-009: Keyboard Navigation
**Given** keyboard shortcuts
**When** user presses keys
**Then** appropriate navigation action must occur

### AC-010: Touch Gesture Support
**Given** touch input
**When** user performs gestures
**Then** appropriate action must occur

### AC-011: Book Export
**Given** a book with entries
**When** export is requested
**Then** entries must be exported in specified format

### AC-012: Accessibility Support
**Given** screen reader enabled
**When** book is rendered
**Then** all elements must have proper ARIA labels

---

## Test Cases

### AC-001: Book State Management

#### TC-001-001: Happy Path - Open Book
**Input**:
```typescript
{
  action: "OPEN"
}
```
**Expected**: Book state isOpen=true, currentPage=0
**Priority**: P0

#### TC-001-002: Happy Path - Close Book
**Input**:
```typescript
{
  action: "CLOSE"
}
```
**Expected**: Book state isOpen=false
**Priority**: P0

#### TC-001-003: Edge Case - Open Already Open Book
**Input**:
```typescript
{
  state: { isOpen: true },
  action: "OPEN"
}
```
**Expected**: No change, already open
**Priority**: P1

#### TC-001-004: Integration - Open with Specific Page
**Input**:
```typescript
{
  action: "OPEN",
  pageNumber: 5
}
```
**Expected**: Book state isOpen=true, currentPage=5
**Priority**: P0

---

### AC-002: Page Navigation

#### TC-002-001: Happy Path - Next Page
**Input**:
```typescript
{
  state: { currentPage: 5, totalPages: 10 },
  action: "NEXT_PAGE"
}
```
**Expected**: currentPage=6
**Priority**: P0

#### TC-002-002: Happy Path - Previous Page
**Input**:
```typescript
{
  state: { currentPage: 5, totalPages: 10 },
  action: "PREVIOUS_PAGE"
}
```
**Expected**: currentPage=4
**Priority**: P0

#### TC-002-003: Edge Case - Next at Last Page
**Input**:
```typescript
{
  state: { currentPage: 9, totalPages: 10 },
  action: "NEXT_PAGE"
}
```
**Expected**: No change, already at last page
**Priority**: P1

#### TC-002-004: Edge Case - Previous at First Page
**Input**:
```typescript
{
  state: { currentPage: 0, totalPages: 10 },
  action: "PREVIOUS_PAGE"
}
```
**Expected**: No change, already at first page
**Priority**: P1

#### TC-002-005: Integration - Go to Specific Page
**Input**:
```typescript
{
  state: { totalPages: 10 },
  action: "GO_TO_PAGE",
  pageNumber: 7
}
```
**Expected**: currentPage=7
**Priority**: P0

---

### AC-003: Entry Display

#### TC-003-001: Happy Path - Display Chronicle Entry
**Input**:
```typescript
{
  entry: {
    id: "je_A1_001",
    type: "CHRONICLE",
    title: "The Founding of Ashkel",
    text: "Ashkel became the first true city of the First Age.",
    author: "IMPERIAL_SCRIBE",
    age: 1,
    scope: "GLOBAL"
  },
  showMetadata: true
}
```
**Expected**: Entry displays with all fields
**Priority**: P0

#### TC-003-002: Happy Path - Display Myth Entry
**Input**:
```typescript
{
  entry: {
    id: "je_A1_010",
    type: "MYTH",
    title: "The Awakening of the Mountain",
    text: "Some say it was not made, but awakened.",
    author: "KARTHI",
    age: 1,
    scope: "REGIONAL"
  },
  showMetadata: true
}
```
**Expected**: Entry displays with myth styling
**Priority**: P0

#### TC-003-003: Edge Case - Entry Without Metadata
**Input**:
```typescript
{
  entry: { /* entry */ },
  showMetadata: false
}
```
**Expected**: Entry displays without metadata
**Priority**: P1

#### TC-003-004: Integration - Entry with Cross-Links
**Input**:
```typescript
{
  entry: {
    id: "je_A1_001",
    relatedHexes: ["h:12:-5", "h:13:-4"],
    relatedWorldIds: ["city_ashkel", "race_karthi"]
  },
  showCrossLinks: true
}
```
**Expected**: Entry displays with clickable cross-links
**Priority**: P0

---

### AC-004: Table of Contents

#### TC-004-001: Happy Path - Generate TOC
**Input**:
```typescript
{
  entries: [
    { id: "je_A1_001", age: 1, title: "Entry 1" },
    { id: "je_A1_002", age: 1, title: "Entry 2" },
    { id: "je_A2_001", age: 2, title: "Entry 3" }
  ]
}
```
**Expected**: TOC organized by age with all entries
**Priority**: P0

#### TC-004-002: Happy Path - Navigate from TOC
**Input**:
```typescript
{
  tocEntry: { entryId: "je_A1_002", pageNumber: 2 },
  action: "NAVIGATE"
}
```
**Expected**: Book navigates to page 2
**Priority**: P0

#### TC-004-003: Edge Case - Empty TOC
**Input**:
```typescript
{
  entries: []
}
```
**Expected**: TOC shows "No entries available"
**Priority**: P1

#### TC-004-004: Integration - TOC with Appendices
**Input**:
```typescript
{
  entries: [ /* entries */ ],
  appendices: [
    { id: "wars", title: "Wars", type: "WARS" },
    { id: "cities", title: "Cities", type: "CITIES" }
  ]
}
```
**Expected**: TOC includes appendices section
**Priority**: P1

---

### AC-005: Filter Application

#### TC-005-001: Happy Path - Filter by Entry Type
**Input**:
```typescript
{
  entries: [
    { id: "je_001", type: "CHRONICLE" },
    { id: "je_002", type: "MYTH" },
    { id: "je_003", type: "OBSERVATION" }
  ],
  filter: { types: ["CHRONICLE"] }
}
```
**Expected**: Only je_001 displayed
**Priority**: P0

#### TC-005-002: Happy Path - Filter by Scope
**Input**:
```typescript
{
  entries: [
    { id: "je_001", scope: "GLOBAL" },
    { id: "je_002", scope: "REGIONAL" },
    { id: "je_003", scope: "LOCAL" }
  ],
  filter: { scopes: ["GLOBAL", "REGIONAL"] }
}
```
**Expected**: je_001 and je_002 displayed
**Priority**: P0

#### TC-005-003: Happy Path - Filter by Author
**Input**:
```typescript
{
  entries: [
    { id: "je_001", author: "THE_WORLD" },
    { id: "je_002", author: "IMPERIAL_SCRIBE" },
    { id: "je_003", author: "UNKNOWN" }
  ],
  filter: { authors: ["THE_WORLD"] }
}
```
**Expected**: Only je_001 displayed
**Priority**: P0

#### TC-005-004: Edge Case - No Matching Entries
**Input**:
```typescript
{
  entries: [ /* entries */ ],
  filter: { types: ["CHRONICLE"] }
}
```
**Expected**: "No entries match filter" displayed
**Priority**: P1

#### TC-005-005: Integration - Multiple Filters
**Input**:
```typescript
{
  entries: [ /* entries */ ],
  filter: { types: ["CHRONICLE"], scopes: ["GLOBAL"], authors: ["THE_WORLD"] }
}
```
**Expected**: Entries matching all filters displayed
**Priority**: P0

---

### AC-006: Search Functionality

#### TC-006-001: Happy Path - Search Found
**Input**:
```typescript
{
  entries: [
    { id: "je_001", title: "The Founding of Ashkel" },
    { id: "je_002", title: "The War of Three Crowns" },
    { id: "je_003", title: "The Emergence of Karthi" }
  ],
  query: "Ashkel"
}
```
**Expected**: je_001 returned as match
**Priority**: P0

#### TC-006-002: Happy Path - Search Multiple Results
**Input**:
```typescript
{
  entries: [
    { id: "je_001", title: "The Founding of Ashkel" },
    { id: "je_002", title: "The Founding of Velor" }
  ],
  query: "Founding"
}
```
**Expected**: Both entries returned as matches
**Priority**: P0

#### TC-006-003: Edge Case - No Search Results
**Input**:
```typescript
{
  entries: [ /* entries */ ],
  query: "NonExistent"
}
```
**Expected**: "No results found" displayed
**Priority**: P1

#### TC-006-004: Edge Case - Empty Search Query
**Input**:
```typescript
{
  entries: [ /* entries */ ],
  query: ""
}
```
**Expected**: All entries returned or prompt for query
**Priority**: P1

#### TC-006-005: Integration - Search with Filter
**Input**:
```typescript
{
  entries: [ /* entries */ ],
  query: "Ashkel",
  activeFilter: { types: ["CHRONICLE"] }
}
```
**Expected**: Only chronicles about Ashkel returned
**Priority**: P0

---

### AC-007: Cross-Link Display

#### TC-007-001: Happy Path - Display Related Hexes
**Input**:
```typescript
{
  entry: {
    relatedHexes: ["h:12:-5", "h:13:-4"]
  },
  onHexClick: (hexes) => { /* handler */ }
}
```
**Expected**: Hexes displayed as clickable links
**Priority**: P0

#### TC-007-002: Happy Path - Display Related World Objects
**Input**:
```typescript
{
  entry: {
    relatedWorldIds: ["city_ashkel", "race_karthi"]
  },
  onObjectClick: (ids) => { /* handler */ }
}
```
**Expected**: World objects displayed as clickable links
**Priority**: P0

#### TC-007-003: Edge Case - No Related Objects
**Input**:
```typescript
{
  entry: {
    relatedHexes: [],
    relatedWorldIds: []
  }
}
```
**Expected**: "Related" section not displayed
**Priority**: P1

#### TC-007-004: Integration - Cross-Link Navigation
**Input**:
```typescript
{
  entry: { relatedHexes: ["h:12:-5"] },
  onHexClick: (hexes) => { navigate to hex view }
}
```
**Expected**: Clicking hex link navigates to map view
**Priority**: P0

---

### AC-008: Responsive Layout

#### TC-008-001: Happy Path - Desktop Layout
**Input**:
```typescript
{
  viewport: { width: 1200, height: 800 }
}
```
**Expected**: Three-column layout rendered
**Priority**: P0

#### TC-008-002: Happy Path - Tablet Layout
**Input**:
```typescript
{
  viewport: { width: 768, height: 1024 }
}
```
**Expected**: Two-column layout rendered
**Priority**: P0

#### TC-008-003: Happy Path - Mobile Layout
**Input**:
```typescript
{
  viewport: { width: 375, height: 667 }
}
```
**Expected**: Single-column layout rendered
**Priority**: P0

#### TC-008-004: Edge Case - Very Small Screen
**Input**:
```typescript
{
  viewport: { width: 320, height: 480 }
}
```
**Expected**: Simplified mobile layout rendered
**Priority**: P1

#### TC-008-005: Integration - Layout Transition
**Input**:
```typescript
{
  fromViewport: { width: 1200, height: 800 },
  toViewport: { width: 768, height: 1024 }
}
```
**Expected**: Layout transitions smoothly
**Priority**: P0

---

### AC-009: Keyboard Navigation

#### TC-009-001: Happy Path - Next Page Key
**Input**:
```typescript
{
  key: "ArrowRight",
  state: { currentPage: 5, totalPages: 10 }
}
```
**Expected**: currentPage=6
**Priority**: P0

#### TC-009-002: Happy Path - Previous Page Key
**Input**:
```typescript
{
  key: "ArrowLeft",
  state: { currentPage: 5, totalPages: 10 }
}
```
**Expected**: currentPage=4
**Priority**: P0

#### TC-009-003: Happy Path - Open TOC Key
**Input**:
```typescript
{
  key: "t",
  action: "OPEN_TOC"
}
```
**Expected**: TOC opens
**Priority**: P0

#### TC-009-004: Happy Path - Close Book Key
**Input**:
```typescript
{
  key: "Escape",
  action: "CLOSE"
}
```
**Expected**: Book closes
**Priority**: P0

#### TC-009-005: Edge Case - Invalid Key
**Input**:
```typescript
{
  key: "InvalidKey"
}
```
**Expected**: No action, key not recognized
**Priority**: P1

#### TC-009-006: Integration - Custom Shortcuts
**Input**:
```typescript
{
  shortcuts: {
    nextPage: ["ArrowRight", "PageDown"],
    previousPage: ["ArrowLeft", "PageUp"]
  }
}
```
**Expected**: All shortcuts work correctly
**Priority**: P1

---

### AC-010: Touch Gesture Support

#### TC-010-001: Happy Path - Swipe Left for Previous Page
**Input**:
```typescript
{
  gesture: "SWIPE_LEFT",
  state: { currentPage: 5, totalPages: 10 }
}
```
**Expected**: currentPage=4
**Priority**: P0

#### TC-010-002: Happy Path - Swipe Right for Next Page
**Input**:
```typescript
{
  gesture: "SWIPE_RIGHT",
  state: { currentPage: 5, totalPages: 10 }
}
```
**Expected**: currentPage=6
**Priority**: P0

#### TC-010-003: Happy Path - Tap to Select Entry
**Input**:
```typescript
{
  gesture: "TAP",
  entry: { id: "je_A1_001" }
}
```
**Expected**: Entry selected
**Priority**: P0

#### TC-010-004: Edge Case - Swipe at Boundaries
**Input**:
```typescript
{
  gesture: "SWIPE_RIGHT",
  state: { currentPage: 9, totalPages: 10 }
}
```
**Expected**: No change, at last page
**Priority**: P1

#### TC-010-005: Integration - Pinch to Zoom
**Input**:
```typescript
{
  gesture: "PINCH",
  scale: 1.5
}
```
**Expected**: Text zoomed to 150%
**Priority**: P1

---

### AC-011: Book Export

#### TC-011-001: Happy Path - Export as Markdown
**Input**:
```typescript
{
  format: "MARKDOWN",
  entries: [ /* entries */ ]
}
```
**Expected**: File downloaded with .md extension
**Priority**: P0

#### TC-011-002: Happy Path - Export as PDF
**Input**:
```typescript
{
  format: "PDF",
  entries: [ /* entries */ ]
}
```
**Expected**: File downloaded with .pdf extension
**Priority**: P0

#### TC-011-003: Edge Case - Export Empty Book
**Input**:
```typescript
{
  format: "MARKDOWN",
  entries: []
}
```
**Expected**: "No entries to export" message
**Priority**: P1

#### TC-011-004: Integration - Export with Filters Applied
**Input**:
```typescript
{
  format: "MARKDOWN",
  entries: [ /* entries */ ],
  activeFilter: { types: ["CHRONICLE"] }
}
```
**Expected**: Only filtered entries exported
**Priority**: P0

---

### AC-012: Accessibility Support

#### TC-012-001: Happy Path - ARIA Labels on Entries
**Input**:
```typescript
{
  entry: { id: "je_A1_001", title: "The Founding of Ashkel" }
}
```
**Expected**: Entry has role="article", aria-label="Entry: The Founding of Ashkel"
**Priority**: P0

#### TC-012-002: Happy Path - ARIA Labels on Navigation
**Input**:
```typescript
{
  navigation: "NEXT_PAGE"
}
```
**Expected**: Button has aria-label="Next page"
**Priority**: P0

#### TC-012-003: Happy Path - Screen Reader Announcements
**Input**:
```typescript
{
  action: "NAVIGATE",
  fromPage: 5,
  toPage: 6
}
```
**Expected**: Live region announces "Navigated to page 6"
**Priority**: P0

#### TC-012-004: Edge Case - Missing ARIA Label
**Input**:
```typescript
{
  element: { /* element without label */ }
}
```
**Expected**: Warning logged, element may not be accessible
**Priority**: P1

#### TC-012-005: Integration - Full Keyboard Navigation
**Input**:
```typescript
{
  screenReaderEnabled: true,
  shortcuts: { /* all shortcuts */ }
}
```
**Expected**: All navigation accessible via keyboard
**Priority**: P0

---

## Test Data

### Sample BookState
```typescript
const SAMPLE_BOOK_STATE: BookState = {
  isOpen: true,
  currentPage: 5,
  totalPages: 10,
  currentAge: 1,
  currentFilter: {
    types: ["CHRONICLE", "MYTH"],
    scopes: ["GLOBAL", "REGIONAL"],
    authors: ["THE_WORLD", "IMPERIAL_SCRIBE"],
    regions: [],
    searchQuery: ""
  },
  sortBy: "CHRONOLOGICAL",
  showChrome: true,
  viewMode: "DESKTOP"
};
```

### Sample JournalEntry
```typescript
const SAMPLE_JOURNAL_ENTRY: JournalEntry = {
  id: "je_A1_001",
  type: "CHRONICLE",
  age: 1,
  title: "The Founding of Ashkel",
  text: "Ashkel became the first true city of the First Age. Here, permanence replaced wandering, and history found a place to begin.",
  scope: "GLOBAL",
  relatedWorldIds: ["city_ashkel", "race_karthi"],
  relatedHexes: ["h:12:-5", "h:13:-4"],
  triggeredByEventIds: ["evt_settlement_001"],
  author: "IMPERIAL_SCRIBE",
  timestamp: 15
};
```

### Sample EntryFilter
```typescript
const SAMPLE_FILTER: EntryFilter = {
  types: ["CHRONICLE", "MYTH"],
  scopes: ["GLOBAL", "REGIONAL"],
  authors: ["THE_WORLD", "IMPERIAL_SCRIBE"],
  regions: ["NORTH", "SOUTH"],
  searchQuery: ""
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test book state management
- Test page navigation logic
- Test entry rendering
- Test filter application
- Test search functionality
- Test cross-link display

### Integration Testing Approach
- Test book with chronicler data
- Test book with backlog system
- Test navigation between pages
- Test filter and search integration
- Test export functionality

### End-to-End Testing Approach
- Test full book reading workflow
- Test book navigation scenarios
- Test filter and search workflows
- Test export workflows
- Test accessibility scenarios

### Performance Testing Approach
- Test rendering with many entries
- Test filter performance with large datasets
- Test search performance
- Test responsive layout transitions

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── ui/
│   │   ├── BookState.test.ts
│   │   ├── PageNavigation.test.ts
│   │   ├── EntryDisplay.test.ts
│   │   ├── TableOfContents.test.ts
│   │   ├── FilterApplication.test.ts
│   │   ├── SearchFunctionality.test.ts
│   │   ├── CrossLinkDisplay.test.ts
│   │   ├── ResponsiveLayout.test.ts
│   │   ├── KeyboardNavigation.test.ts
│   │   ├── TouchGestures.test.ts
│   │   ├── BookExport.test.ts
│   │   └── Accessibility.test.ts
├── integration/
│   ├── ui/
│   │   ├── BookWithData.test.ts
│   │   ├── NavigationWorkflows.test.ts
│   │   ├── FilterSearchIntegration.test.ts
│   │   ├── CrossLinkNavigation.test.ts
│   │   └── ExportWorkflows.test.ts
└── e2e/
    ├── ui/
    │   ├── FullBookReading.test.ts
    │   ├── NavigationScenarios.test.ts
    │   ├── FilterSearchWorkflows.test.ts
    │   ├── AccessibilityScenarios.test.ts
    │   └── ExportScenarios.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by UI component for unit tests
- Group by integration feature for integration tests
- Group by user scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases
