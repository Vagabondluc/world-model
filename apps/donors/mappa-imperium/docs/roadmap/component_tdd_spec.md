# Component TDD Specification

**Version:** 1.0.0  
**Last Updated:** 2026-01-28  
**Reference Implementations:** 
- [`src/components/map/HexTile.tsx`](../../src/components/map/HexTile.tsx)
- [`src/components/map/UnifiedMapRenderer.tsx`](../../src/components/map/UnifiedMapRenderer.tsx)
- [`src/components/setup/WorldCreationWizard.tsx`](../../src/components/setup/WorldCreationWizard.tsx)
- [`src/components/map/MapStyleToggle.tsx`](../../src/components/map/MapStyleToggle.tsx)
- [`src/components/layout/AppLayout.tsx`](../../src/components/layout/AppLayout.tsx)

---

## Test Suite Overview

This test suite defines comprehensive test specifications for React components in the Mappa Imperium project. Components are tested for rendering, user interactions, state updates, and accessibility.

### Key Components Under Test

| Component | Purpose |
|-----------|---------|
| `HexTile` | Single hexagonal tile renderer |
| `UnifiedMapRenderer` | Full map rendering component |
| `WorldCreationWizard` | Map generation and configuration UI |
| `MapStyleToggle` | Map rendering mode switcher |
| `AppLayout` | Main application layout |

---

## Test Cases

### 1. HexTile Component

#### Test 1.1: SVG mode rendering
- **Input:** `hex = { q: 0, r: 0, s: 0 }`, `biome = 'grassland'`, `mode = 'svg'`, `size = 40`
- **Expected Output:** SVG polygon rendered with correct color
- **Edge Cases:** None
- **Description:** Should render SVG polygon in SVG mode

#### Test 1.2: Tile mode rendering
- **Input:** `hex = { q: 0, r: 0, s: 0 }`, `biome = 'forest'`, `mode = 'tile'`, `theme = 'classic'`, `size = 40`
- **Expected Output:** Image element rendered with correct sprite
- **Edge Cases:** None
- **Description:** Should render image tile in tile mode

#### Test 1.3: Origin hex position
- **Input:** `hex = { q: 0, r: 0, s: 0 }`, `size = 40`
- **Expected Output:** Hex positioned at (0, 0)
- **Edge Cases:** None
- **Description:** Origin hex should be at origin

#### Test 1.4: Positive coordinate hex position
- **Input:** `hex = { q: 1, r: 0, s: -1 }`, `size = 40`
- **Expected Output:** Hex positioned at correct pixel coordinates
- **Edge Cases:** None
- **Description:** Positive coordinate hexes should be positioned correctly

#### Test 1.5: Negative coordinate hex position
- **Input:** `hex = { q: -1, r: 0, s: 1 }`, `size = 40`
- **Expected Output:** Hex positioned at correct pixel coordinates
- **Edge Cases:** Negative coordinates
- **Description:** Negative coordinate hexes should be positioned correctly

#### Test 1.6: Different biome colors (SVG mode)
- **Input:** Various biome types in SVG mode
- **Expected Output:** Correct color for each biome
- **Edge Cases:** All biome types
- **Description:** Each biome should render with correct color

#### Test 1.7: Different biome tiles (tile mode)
- **Input:** Various biome types in tile mode
- **Expected Output:** Correct sprite for each biome
- **Edge Cases:** All biome types
- **Description:** Each biome should render with correct sprite

#### Test 1.8: Size scaling
- **Input:** `size = 20` vs `size = 80`
- **Expected Output:** Correct scaling for each size
- **Edge Cases:** Different sizes
- **Description:** Hex should scale correctly with size parameter

#### Test 1.9: Owner overlay
- **Input:** `owner = 1`
- **Expected Output:** Owner indicator displayed
- **Edge Cases:** Owner specified
- **Description:** Should display owner when specified

#### Test 1.10: No owner
- **Input:** `owner = undefined`
- **Expected Output:** No owner indicator
- **Edge Cases:** No owner
- **Description:** Should not display owner when not specified

#### Test 1.11: Theme selection (tile mode)
- **Input:** `theme = 'classic'`, `theme = 'vibrant'`, `theme = 'pastel'`
- **Expected Output:** Correct tileset for each theme
- **Edge Cases:** Different themes
- **Description:** Should use correct tileset for each theme

#### Test 1.12: Invalid biome fallback
- **Input:** Invalid biome type
- **Expected Output:** Default color/sprite used
- **Edge Cases:** Invalid biome
- **Description:** Should handle invalid biome gracefully

#### Test 1.13: Zero size
- **Input:** `size = 0`
- **Expected Output:** Hex not visible or handled gracefully
- **Edge Cases:** Zero size
- **Description:** Should handle zero size gracefully

#### Test 1.14: Large size
- **Input:** `size = 200`
- **Expected Output:** Hex rendered at large size
- **Edge Cases:** Large size
- **Description:** Should handle large sizes correctly

#### Test 1.15: Fractional coordinates
- **Input:** `hex = { q: 1.5, r: 0.5, s: -2 }`
- **Expected Output:** Hex positioned correctly
- **Edge Cases:** Fractional coordinates
- **Description:** Should handle fractional coordinates

---

### 2. UnifiedMapRenderer Component

#### Test 2.1: Empty map rendering
- **Input:** `hexBiomes = {}`, `mode = 'svg'`, `theme = 'classic'`
- **Expected Output:** Empty map rendered (no hexes)
- **Edge Cases:** Empty map
- **Description:** Should render empty map correctly

#### Test 2.2: Single hex rendering
- **Input:** `hexBiomes = { '0,0': 'grassland' }`
- **Expected Output:** Single hex rendered
- **Edge Cases:** Single hex
- **Description:** Should render single hex map

#### Test 2.3: Multiple hexes rendering
- **Input:** `hexBiomes = { '0,0': 'grassland', '1,0': 'forest', '0,1': 'ocean' }`
- **Expected Output:** All hexes rendered
- **Edge Cases:** Multiple hexes
- **Description:** Should render all hexes in map

#### Test 2.4: SVG mode rendering
- **Input:** `mode = 'svg'`, `theme = 'classic'`
- **Expected Output:** All hexes rendered as SVG polygons
- **Edge Cases:** None
- **Description:** Should render SVG mode correctly

#### Test 2.5: Tile mode rendering
- **Input:** `mode = 'tile'`, `theme = 'classic'`
- **Expected Output:** All hexes rendered as image tiles
- **Edge Cases:** None
- **Description:** Should render tile mode correctly

#### Test 2.6: Different themes
- **Input:** `theme = 'classic'`, `theme = 'vibrant'`, `theme = 'pastel'`, `theme = 'sketchy'`
- **Expected Output:** Correct theme applied to all hexes
- **Edge Cases:** Different themes
- **Description:** Should apply theme to all hexes

#### Test 2.7: Custom size
- **Input:** `size = 30`
- **Expected Output:** All hexes rendered at custom size
- **Edge Cases:** Custom size
- **Description:** Should use custom size parameter

#### Test 2.8: Default size
- **Input:** `size = undefined`
- **Expected Output:** All hexes rendered at default size (40)
- **Edge Cases:** Default value
- **Description:** Should use default size when not specified

#### Test 2.9: ViewBox calculation
- **Input:** Map with hexes at various coordinates
- **Expected Output:** Correct viewBox dimensions
- **Edge Cases:** None
- **Description:** Should calculate correct viewBox for map

#### Test 2.10: Large map rendering
- **Input:** Map with 100+ hexes
- **Expected Output:** All hexes rendered
- **Edge Cases:** Large map
- **Description:** Should handle large maps efficiently

#### Test 2.11: Sparse map rendering
- **Input:** Map with scattered hexes
- **Expected Output:** Only specified hexes rendered
- **Edge Cases:** Sparse map
- **Description:** Should only render specified hexes

#### Test 2.12: Map with negative coordinates
- **Input:** Map with negative coordinate hexes
- **Expected Output:** All hexes rendered correctly
- **Edge Cases:** Negative coordinates
- **Description:** Should handle negative coordinate hexes

#### Test 2.13: Map with large coordinates
- **Input:** Map with large coordinate hexes
- **Expected Output:** All hexes rendered correctly
- **Edge Cases:** Large coordinates
- **Description:** Should handle large coordinate hexes

#### Test 2.14: Re-render on prop change
- **Input:** Change hexBiomes prop
- **Expected Output:** Map re-renders with new data
- **Edge Cases:** Prop changes
- **Description:** Should re-render when props change

#### Test 2.15: Accessibility attributes
- **Input:** Rendered map
- **Expected Output:** Appropriate ARIA attributes present
- **Edge Cases:** None
- **Description:** Should include accessibility attributes

---

### 3. WorldCreationWizard Component

#### Test 3.1: Initial render
- **Input:** Component mounted
- **Expected Output:** Wizard rendered with default state
- **Edge Cases:** Initial render
- **Description:** Should render with default algorithm and settings

#### Test 3.2: Imperial algorithm selection
- **Input:** Click imperial algorithm button
- **Expected Output:** Algorithm set to 'imperial', imperial button selected
- **Edge Cases:** None
- **Description:** Should select imperial algorithm

#### Test 3.3: Wilderness algorithm selection
- **Input:** Click wilderness algorithm button
- **Expected Output:** Algorithm set to 'wilderness', wilderness button selected
- **Edge Cases:** None
- **Description:** Should select wilderness algorithm

#### Test 3.4: SVG render mode selection
- **Input:** Click SVG render mode button
- **Expected Output:** Render mode set to 'svg', SVG button selected
- **Edge Cases:** None
- **Description:** Should select SVG render mode

#### Test 3.5: Tile render mode selection
- **Input:** Click tile render mode button
- **Expected Output:** Render mode set to 'tile', tile button selected
- **Edge Cases:** None
- **Description:** Should select tile render mode

#### Test 3.6: Tile theme selection
- **Input:** Select different tile theme
- **Expected Output:** Theme updated, preview reflects change
- **Edge Cases:** None
- **Description:** Should update tile theme

#### Test 3.7: Seed input change
- **Input:** Enter new seed value
- **Expected Output:** Seed updated, map regenerated
- **Edge Cases:** None
- **Description:** Should update seed and regenerate map

#### Test 3.8: Re-roll seed button
- **Input:** Click re-roll seed button
- **Expected Output:** New random seed generated, map regenerated
- **Edge Cases:** None
- **Description:** Should generate new random seed

#### Test 3.9: Map generation on algorithm change
- **Input:** Change algorithm
- **Expected Output:** Map regenerated with new algorithm
- **Edge Cases:** None
- **Description:** Should regenerate map when algorithm changes

#### Test 3.10: Map generation on seed change
- **Input:** Change seed
- **Expected Output:** Map regenerated with new seed
- **Edge Cases:** None
- **Description:** Should regenerate map when seed changes

#### Test 3.11: Loading state during generation
- **Input:** Map generation in progress
- **Expected Output:** Loading spinner shown, preview disabled
- **Edge Cases:** Loading state
- **Description:** Should show loading state during generation

#### Test 3.12: Preview map display
- **Input:** Map generation complete
- **Expected Output:** Preview map rendered with current settings
- **Edge Cases:** None
- **Description:** Should display generated preview map

#### Test 3.13: Confirm button enabled
- **Input:** Preview map generated
- **Expected Output:** Confirm button enabled
- **Edge Cases:** None
- **Description:** Should enable confirm button when preview ready

#### Test 3.14: Confirm button disabled
- **Input:** No preview map or generating
- **Expected Output:** Confirm button disabled
- **Edge Cases:** No preview
- **Description:** Should disable confirm button when no preview

#### Test 3.15: Confirm action
- **Input:** Click confirm button
- **Expected Output:** Map data saved, settings saved, state transition
- **Edge Cases:** None
- **Description:** Should save data and transition on confirm

#### Test 3.16: Store integration
- **Input:** Component actions
- **Expected Output:** Store updated correctly
- **Edge Cases:** None
- **Description:** Should integrate with game store

#### Test 3.17: Effect dependencies
- **Input:** Algorithm or seed changes
- **Expected Output:** Map regenerated only when dependencies change
- **Edge Cases:** Effect dependencies
- **Description:** Should regenerate map on dependency changes

#### Test 3.18: Artificial delay
- **Input:** Map generation triggered
- **Expected Output:** 800ms delay before showing result
- **Edge Cases:** Timing
- **Description:** Should apply artificial delay for UX

#### Test 3.19: Algorithm button styling
- **Input:** Different algorithm selected
- **Expected Output:** Selected button has active styling
- **Edge Cases:** None
- **Description:** Should style selected algorithm button

#### Test 3.20: Render mode button styling
- **Input:** Different render mode selected
- **Expected Output:** Selected button has active styling
- **Edge Cases:** None
- **Description:** Should style selected render mode button

---

### 4. MapStyleToggle Component

#### Test 4.1: Initial render
- **Input:** Component mounted with default mode
- **Expected Output:** Toggle button rendered in correct state
- **Edge Cases:** Initial render
- **Description:** Should render with initial mode

#### Test 4.2: SVG mode display
- **Input:** `mode = 'svg'`
- **Expected Output:** Layout icon shown, title indicates tile mode
- **Edge Cases:** None
- **Description:** Should show correct icon for SVG mode

#### Test 4.3: Tile mode display
- **Input:** `mode = 'tile'`
- **Expected Output:** Image icon shown, title indicates SVG mode
- **Edge Cases:** None
- **Description:** Should show correct icon for tile mode

#### Test 4.4: Toggle from SVG to tile
- **Input:** Click button when mode is 'svg'
- **Expected Output:** Mode changed to 'tile', icon updates
- **Edge Cases:** None
- **Description:** Should toggle to tile mode

#### Test 4.5: Toggle from tile to SVG
- **Input:** Click button when mode is 'tile'
- **Expected Output:** Mode changed to 'svg', icon updates
- **Edge Cases:** None
- **Description:** Should toggle to SVG mode

#### Test 4.6: Store integration
- **Input:** Toggle action
- **Expected Output:** Store updated with new mode
- **Edge Cases:** None
- **Description:** Should update store with new mode

#### Test 4.7: Button styling (SVG mode)
- **Input:** `mode = 'svg'`
- **Expected Output:** Button has inactive styling
- **Edge Cases:** None
- **Description:** Should style button for SVG mode

#### Test 4.8: Button styling (tile mode)
- **Input:** `mode = 'tile'`
- **Expected Output:** Button has active styling (indigo)
- **Edge Cases:** None
- **Description:** Should style button for tile mode

#### Test 4.9: Fixed positioning
- **Input:** Component rendered
- **Expected Output:** Button fixed at bottom-right
- **Edge Cases:** None
- **Description:** Should be positioned correctly

#### Test 4.10: Z-index layering
- **Input:** Component rendered
- **Expected Output:** Button has high z-index
- **Edge Cases:** None
- **Description:** Should layer above other content

#### Test 4.11: Tooltip display
- **Input:** Hover over button
- **Expected Output:** Tooltip shown with correct text
- **Edge Cases:** None
- **Description:** Should show tooltip on hover

#### Test 4.12: Accessibility attributes
- **Input:** Component rendered
- **Expected Output:** Appropriate ARIA attributes present
- **Edge Cases:** None
- **Description:** Should include accessibility attributes

#### Test 4.13: Responsive sizing
- **Input:** Component rendered at different viewport sizes
- **Expected Output:** Button size appropriate for viewport
- **Edge Cases:** Different viewports
- **Description:** Should be responsive to viewport size

#### Test 4.14: Icon rendering
- **Input:** Component rendered
- **Expected Output:** Lucide icons render correctly
- **Edge Cases:** None
- **Description:** Should render Lucide icons correctly

#### Test 4.15: Mode persistence
- **Input:** Toggle mode, reload component
- **Expected Output:** Mode persists from store
- **Edge Cases:** Persistence
- **Description:** Should persist mode from store

---

### 5. AppLayout Component

#### Test 5.1: Initial render with loading state
- **Input:** `isGameReady = false`
- **Expected Output:** Loading spinner shown
- **Edge Cases:** Loading state
- **Description:** Should show loading when game not ready

#### Test 5.2: Render with game ready
- **Input:** `isGameReady = true`
- **Expected Output:** Main layout rendered
- **Edge Cases:** None
- **Description:** Should render layout when game ready

#### Test 5.3: Eras view rendering
- **Input:** `view = 'eras'`
- **Expected Output:** EraContent component rendered
- **Edge Cases:** None
- **Description:** Should render era content in eras view

#### Test 5.4: Elements view rendering
- **Input:** `view = 'elements'`
- **Expected Output:** ElementManager component rendered
- **Edge Cases:** None
- **Description:** Should render element manager in elements view

#### Test 5.5: Navigation header rendering
- **Input:** Component rendered
- **Expected Output:** NavigationHeader component present
- **Edge Cases:** None
- **Description:** Should render navigation header

#### Test 5.6: Completion tracker rendering
- **Input:** Component rendered
- **Expected Output:** CompletionTracker component present
- **Edge Cases:** None
- **Description:** Should render completion tracker

#### Test 5.7: Collaboration status rendering
- **Input:** Component rendered
- **Expected Output:** CollaborationStatus component present
- **Edge Cases:** None
- **Description:** Should render collaboration status

#### Test 5.8: Settings modal rendering
- **Input:** `isSettingsModalOpen = true`
- **Expected Output:** SettingsModal component rendered
- **Edge Cases:** Modal open
- **Description:** Should render settings modal when open

#### Test 5.9: Settings modal hidden
- **Input:** `isSettingsModalOpen = false`
- **Expected Output:** SettingsModal not rendered
- **Edge Cases:** Modal closed
- **Description:** Should not render settings modal when closed

#### Test 5.10: Map style toggle rendering
- **Input:** Component rendered
- **Expected Output:** MapStyleToggle component present
- **Edge Cases:** None
- **Description:** Should render map style toggle

#### Test 5.11: Content fade-in animation
- **Input:** Content becomes visible
- **Expected Output:** Fade-in animation applied
- **Edge Cases:** Animation
- **Description:** Should apply fade-in animation

#### Test 5.12: Content fade-out on transition
- **Input:** `isTransitioning = true`
- **Expected Output:** Content fades out
- **Edge Cases:** Transition
- **Description:** Should fade out content during transition

#### Test 5.13: Content ready callback
- **Input:** EraContent signals ready
- **Expected Output:** Fade-in triggered
- **Edge Cases:** Content ready
- **Description:** Should handle content ready callback

#### Test 5.14: Store integration
- **Input:** Component actions
- **Expected Output:** Store updated correctly
- **Edge Cases:** None
- **Description:** Should integrate with game store

#### Test 5.15: Player role validation
- **Input:** `gameRole = 'player'`, `currentPlayer = null`
- **Expected Output:** Error state shown
- **Edge Cases:** Invalid state
- **Description:** Should show error for invalid player state

#### Test 5.16: Effect cleanup
- **Input:** Component unmounts
- **Expected Output:** Timers cleared
- **Edge Cases:** Cleanup
- **Description:** Should clean up effects on unmount

#### Test 5.17: Transition effect dependencies
- **Input:** `isTransitioning` changes
- **Expected Output:** Content visibility updated
- **Edge Cases:** Effect dependencies
- **Description:** Should update content visibility on transition

#### Test 5.18: Content ready effect dependencies
- **Input:** `isContentLoadedAndReady` changes
- **Expected Output:** Fade-in triggered
- **Edge Cases:** Effect dependencies
- **Description:** Should trigger fade-in when content ready

#### Test 5.19: Era key prop
- **Input:** `viewedEraId` changes
- **Expected Output:** EraContent re-renders with new key
- **Edge Cases:** Key changes
- **Description:** Should re-render era content when era changes

#### Test 5.20: Layout structure
- **Input:** Component rendered
- **Expected Output:** Correct HTML structure
- **Edge Cases:** None
- **Description:** Should render correct layout structure

#### Test 5.21: Error boundary handling
- **Input:** Child component throws error
- **Expected Output:** Error boundary catches error, displays fallback UI
- **Edge Cases:** Component error
- **Description:** Should handle component errors gracefully

---

### 6. Performance Tests for Component Rendering

#### Test 6.1: HexTile rendering performance
- **Input:** Render 1,000 HexTile components
- **Expected Output:** Complete within 500ms
- **Edge Cases:** Large number of tiles
- **Description:** HexTile should render efficiently in bulk

#### Test 6.2: UnifiedMapRenderer performance - small map
- **Input:** Map with 100 hexes
- **Expected Output:** Initial render within 100ms
- **Edge Cases:** Small map
- **Description:** Small maps should render quickly

#### Test 6.3: UnifiedMapRenderer performance - medium map
- **Input:** Map with 500 hexes
- **Expected Output:** Initial render within 300ms
- **Edge Cases:** Medium map
- **Description:** Medium maps should render efficiently

#### Test 6.4: UnifiedMapRenderer performance - large map
- **Input:** Map with 1,000 hexes
- **Expected Output:** Initial render within 1 second
- **Edge Cases:** Large map
- **Description:** Large maps should render within acceptable time

#### Test 6.5: Map re-render performance
- **Input:** Re-render map with changed props
- **Expected Output:** Update within 100ms (using React reconciliation)
- **Edge Cases:** Prop changes
- **Description:** Map updates should be efficient

#### Test 6.6: WorldCreationWizard performance
- **Input:** Generate and render preview map
- **Expected Output:** Complete within 2 seconds
- **Edge Cases:** Map generation
- **Description:** Wizard should handle generation efficiently

#### Test 6.7: AppLayout transition performance
- **Input:** Switch between views with fade animations
- **Expected Output:** Transitions complete within 300ms
- **Edge Cases:** View transitions
- **Description:** View transitions should be smooth and fast

#### Test 6.8: Memory usage for large map
- **Input:** Render map with 1,000 hexes
- **Expected Output:** Memory usage within expected bounds
- **Edge Cases:** Large dataset
- **Description:** Large maps should not cause memory issues

#### Test 6.9: Virtual scrolling performance
- **Input:** Scroll through map with 5,000 hexes (virtualized)
- **Expected Output:** Maintain 60fps
- **Edge Cases:** Large virtualized list
- **Description:** Virtual scrolling should maintain performance

#### Test 6.10: Component unmount performance
- **Input:** Unmount components with 1,000 hexes
- **Expected Output:** Unmount within 200ms
- **Edge Cases:** Large unmount
- **Description:** Component unmounting should be efficient

---

### 7. Accessibility Tests

#### Test 7.1: Keyboard navigation - HexTile
- **Input:** Tab through hex tiles
- **Expected Output:** Focus moves logically through tiles
- **Edge Cases:** None
- **Description:** Hex tiles should be keyboard navigable

#### Test 7.2: Keyboard navigation - WorldCreationWizard
- **Input:** Navigate wizard using Tab and Enter
- **Expected Output:** All controls accessible via keyboard
- **Edge Cases:** None
- **Description:** Wizard should be fully keyboard accessible

#### Test 7.3: Keyboard navigation - MapStyleToggle
- **Input:** Activate toggle using keyboard
- **Expected Output:** Toggle works with Enter/Space
- **Edge Cases:** None
- **Description:** Toggle should be keyboard accessible

#### Test 7.4: Keyboard navigation - AppLayout
- **Input:** Navigate layout using keyboard
- **Expected Output:** All interactive elements accessible
- **Edge Cases:** None
- **Description:** Layout should be fully keyboard navigable

#### Test 7.5: Screen reader - HexTile ARIA labels
- **Input:** Screen reader reads hex tile
- **Expected Output:** Appropriate ARIA labels announced
- **Edge Cases:** None
- **Description:** Hex tiles should have descriptive ARIA labels

#### Test 7.6: Screen reader - WorldCreationWizard
- **Input:** Screen reader navigates wizard
- **Expected Output:** All controls and states announced
- **Edge Cases:** None
- **Description:** Wizard should be screen reader friendly

#### Test 7.7: Screen reader - MapStyleToggle
- **Input:** Screen reader encounters toggle
- **Expected Output:** Current state announced correctly
- **Edge Cases:** None
- **Description:** Toggle state should be announced

#### Test 7.8: Screen reader - AppLayout regions
- **Input:** Screen reader navigates layout
- **Expected Output:** Landmarks and regions identified
- **Edge Cases:** None
- **Description:** Layout should use proper landmark roles

#### Test 7.9: Focus management - WorldCreationWizard
- **Input:** Complete wizard step, move to next
- **Expected Output:** Focus moves to appropriate element
- **Edge Cases:** None
- **Description:** Focus should be managed during transitions

#### Test 7.10: Focus management - Modal dialogs
- **Input:** Open and close settings modal
- **Expected Output:** Focus trapped in modal, returned on close
- **Edge Cases:** Modal focus
- **Description:** Modals should manage focus correctly

#### Test 7.11: Color contrast - HexTile
- **Input:** Check color contrast ratios
- **Expected Output:** WCAG AA compliant (4.5:1 minimum)
- **Edge Cases:** None
- **Description:** Hex tile colors should meet contrast standards

#### Test 7.12: Color contrast - WorldCreationWizard
- **Input:** Check color contrast ratios
- **Expected Output:** WCAG AA compliant
- **Edge Cases:** None
- **Description:** Wizard colors should meet contrast standards

#### Test 7.13: Touch targets - MapStyleToggle
- **Input:** Measure button size
- **Expected Output:** Minimum 44x44px touch target
- **Edge Cases:** Touch accessibility
- **Description:** Touch targets should be appropriately sized

#### Test 7.14: Live regions - Status updates
- **Input:** Status changes during operation
- **Expected Output:** Updates announced via aria-live
- **Edge Cases:** Dynamic content
- **Description:** Status updates should use live regions

#### Test 7.15: Skip links - AppLayout
- **Input:** Screen reader encounters layout
- **Expected Output:** Skip link to main content available
- **Edge Cases:** None
- **Description:** Should provide skip navigation links

---

### 8. Integration Tests Between Components

#### Test 8.1: WorldCreationWizard → UnifiedMapRenderer
- **Input:** Generate map in wizard, render in map component
- **Expected Output:** Map data flows correctly, renders properly
- **Edge Cases:** None
- **Description:** Wizard and map renderer should integrate correctly

#### Test 8.2: MapStyleToggle → UnifiedMapRenderer
- **Input:** Toggle map style, verify renderer updates
- **Expected Output:** Renderer mode changes, map re-renders correctly
- **Edge Cases:** None
- **Description:** Toggle and renderer should integrate correctly

#### Test 8.3: UnifiedMapRenderer → HexTile
- **Input:** Map renderer passes props to hex tiles
- **Expected Output:** All tiles render with correct props
- **Edge Cases:** None
- **Description:** Renderer and tiles should integrate correctly

#### Test 8.4: AppLayout → WorldCreationWizard
- **Input:** Layout renders wizard component
- **Expected Output:** Wizard renders in correct context
- **Edge Cases:** None
- **Description:** Layout and wizard should integrate correctly

#### Test 8.5: AppLayout → UnifiedMapRenderer
- **Input:** Layout renders map component
- **Expected Output:** Map renders in correct context
- **Edge Cases:** None
- **Description:** Layout and map should integrate correctly

#### Test 8.6: Store integration across components
- **Input:** Update store, verify all components reflect changes
- **Expected Output:** All components update correctly
- **Edge Cases:** None
- **Description:** Components should react to store changes

#### Test 8.7: Full world creation flow
- **Input:** User creates world through wizard to final map
- **Expected Output:** Complete flow works end-to-end
- **Edge Cases:** None
- **Description:** Full world creation should work seamlessly

#### Test 8.8: Map style change flow
- **Input:** User toggles map style multiple times
- **Expected Output:** Style changes apply correctly each time
- **Edge Cases:** None
- **Description:** Style changes should work consistently

#### Test 8.9: View transition flow
- **Input:** User switches between eras and elements views
- **Expected Output:** Transitions work smoothly
- **Edge Cases:** None
- **Description:** View transitions should work seamlessly

#### Test 8.10: Settings modal flow
- **Input:** User opens, modifies, closes settings
- **Expected Output:** Settings persist correctly
- **Edge Cases:** None
- **Description:** Settings modal should integrate correctly

#### Test 8.11: Error boundary integration
- **Input:** Component error occurs in layout
- **Expected Output:** Error boundary catches, layout remains functional
- **Edge Cases:** Component error
- **Description:** Error boundary should protect layout

#### Test 8.12: Component prop validation
- **Input:** Pass invalid props between components
- **Expected Output:** Props validated or handled gracefully
- **Edge Cases:** Invalid props
- **Description:** Components should validate props

#### Test 8.13: Event propagation between components
- **Input:** User interacts with component, verify event handling
- **Expected Output:** Events propagate correctly
- **Edge Cases:** None
- **Description:** Component events should propagate correctly

#### Test 8.14: Component lifecycle integration
- **Input:** Components mount/unmount together
- **Expected Output:** Lifecycles coordinated correctly
- **Edge Cases:** None
- **Description:** Component lifecycles should be coordinated

#### Test 8.15: Performance under integration
- **Input:** All components rendered together
- **Expected Output:** Performance remains acceptable
- **Edge Cases:** Full integration
- **Description:** Full integration should maintain performance

---

## Test Categories

### Unit Tests
- Component rendering with different props
- State updates and callbacks
- Conditional rendering logic

### Integration Tests
- Component interaction with store
- Parent-child component communication
- Component lifecycle effects

### End-to-End Tests
- Full user flows (e.g., create world and confirm)
- Multi-component interactions
- State persistence across actions

### Accessibility Tests
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility

---

## Mock Requirements

### Store Mocks
```typescript
const mockGameStore = {
  gameSettings: { algorithm: 'imperial', seed: 'test' },
  appSettings: { mapRender: { mode: 'svg', theme: 'classic' } },
  players: [{ id: 'P1', name: 'Player 1' }],
  currentPlayer: { id: 'P1', name: 'Player 1' },
  elements: [],
  gameRole: 'player',
  isSettingsModalOpen: false,
  isTransitioning: false,
  isGameReady: true,
  saveSettings: vi.fn(),
  setMapData: vi.fn(),
  toggleSettingsModal: vi.fn()
};
```

### Component Props Mocks
```typescript
const mockHexTileProps = {
  hex: { q: 0, r: 0, s: 0 },
  biome: 'grassland',
  mode: 'svg' as 'svg' | 'tile',
  theme: 'classic',
  size: 40,
  owner: undefined
};

const mockUnifiedMapRendererProps = {
  hexBiomes: { '0,0': 'grassland', '1,0': 'forest' },
  mode: 'svg' as 'svg' | 'tile',
  theme: 'classic',
  size: 40
};
```

---

## Test Data

### Sample Biome Types
```typescript
const biomes: BiomeType[] = [
  'grassland', 'forest', 'mountain', 'desert', 'swamp',
  'ocean', 'lake', 'arctic', 'hill', 'jungle',
  'volcanic', 'wasteland', 'urban', 'coastal',
  'underdark', 'underwater', 'planar'
];
```

### Sample Hex Coordinates
```typescript
const hexCoordinates: HexCoordinate[] = [
  { q: 0, r: 0, s: 0 },
  { q: 1, r: 0, s: -1 },
  { q: 0, r: 1, s: -1 },
  { q: -1, r: 0, s: 1 },
  { q: 0, r: -1, s: 1 },
  { q: 1, r: -1, s: 0 }
];
```

### Sample Map Data
```typescript
const sampleHexBiomes: Record<string, BiomeType> = {
  '0,0': 'grassland',
  '1,0': 'forest',
  '0,1': 'ocean',
  '-1,0': 'mountain',
  '0,-1': 'desert',
  '1,-1': 'swamp'
};
```

---

## Coverage Goals

| Metric | Target | Notes |
|--------|--------|-------|
| Line Coverage | 90%+ | All major code paths |
| Branch Coverage | 85%+ | All conditional branches |
| Function Coverage | 100% | All component functions |
| Statement Coverage | 90%+ | All statements |

---

## Implementation Notes

### Testing Framework
- Use **Vitest** for unit tests
- Use **@testing-library/react** for component testing
- Use **@testing-library/jest-dom** for DOM assertions
- Use **@testing-library/user-event** for user interactions

### Test Organization
```typescript
// Example test structure
describe('HexTile', () => {
  describe('rendering', () => {
    it('should render SVG polygon in SVG mode', () => {
      render(<HexTile hex={{q:0,r:0,s:0}} biome="grassland" mode="svg" size={40} />);
      expect(screen.getByRole('graphics-symbol')).toBeInTheDocument();
    });
    
    it('should render image tile in tile mode', () => {
      render(<HexTile hex={{q:0,r:0,s:0}} biome="grassland" mode="tile" theme="classic" size={40} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
  
  describe('positioning', () => {
    it('should position origin hex at (0,0)', () => {
      // test implementation
    });
  });
  
  describe('biomes', () => {
    it('should render correct color for grassland', () => {
      // test implementation
    });
  });
});

describe('WorldCreationWizard', () => {
  describe('algorithm selection', () => {
    it('should select imperial algorithm', async () => {
      render(<WorldCreationWizard />);
      await userEvent.click(screen.getByText('Imperial Architect'));
      expect(screen.getByText('Imperial Architect')).toHaveClass('border-indigo-600');
    });
  });
  
  describe('map generation', () => {
    it('should regenerate map on seed change', () => {
      // test implementation
    });
  });
});
```

### Accessibility Testing
- Test keyboard navigation
- Verify ARIA attributes
- Test screen reader compatibility
- Test color contrast ratios

### Performance Considerations
- Large map rendering tests should be marked as slow
- Use shallow rendering for unit tests where appropriate
- Consider virtualization testing for large lists

---

## Related Documentation

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [hex_tile_renderer_spec.md](./hex_tile_renderer_spec.md:1) - Hex tile component specification
- [unified_map_renderer_spec.md](./unified_map_renderer_spec.md:1) - Unified map renderer specification
- [world_creation_wizard_spec.md](./world_creation_wizard_spec.md:1) - World creation wizard specification
- [map_style_toggle_spec.md](./map_style_toggle_spec.md:1) - Map style toggle specification
- [app_layout_spec.md](./app_layout_spec.md:1) - App layout specification
