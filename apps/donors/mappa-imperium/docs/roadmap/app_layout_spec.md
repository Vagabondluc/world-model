# AppLayout Component Specification

## Purpose

The [`AppLayout`](../../src/components/layout/AppLayout.tsx:18) component defines the overall page structure and layout for the Mappa Imperium application. It manages content transitions, handles initialization state, and coordinates between navigation, content areas, and fixed UI elements like status bars and modals.

## Dependencies

### External Dependencies
- React (hooks: `useState`, `useEffect`, `useCallback`)

### Internal Dependencies
- [`@/stores/gameStore`](../../src/stores/gameStore.ts:10) - [`useGameStore()`](../../src/stores/gameStore.ts:10) for state management
- [`@/design/tokens`](../../src/design/tokens.ts:1) - [`componentStyles`](../../src/design/tokens.ts:1) for styling
- [`../navigation/NavigationHeader`](../../src/components/navigation/NavigationHeader.tsx:1) - Top navigation bar
- [`../world-manager/ElementManager`](../../src/components/world-manager/ElementManager.tsx:1) - Element management view
- [`../era-interfaces/EraContent`](../../src/components/era-interfaces/EraContent.tsx:1) - Era content view
- [`./CompletionTracker`](../../src/components/layout/CompletionTracker.tsx:1) - Bottom status bar (completion)
- [`./CollaborationStatus`](../../src/components/layout/CollaborationStatus.tsx:1) - Bottom status bar (collaboration)
- [`../shared/SettingsModal`](../../src/components/shared/SettingsModal.tsx:1) - Settings modal dialog
- [`../shared/LoadingSpinner`](../../src/components/shared/LoadingSpinner.tsx:1) - Loading indicator
- [`../map/MapStyleToggle`](../../src/components/map/MapStyleToggle.tsx:7) - Floating map style toggle

### Child Components
- `NavigationHeader` - Top navigation
- `EraContent` - Era-specific content display
- `ElementManager` - Element management interface
- `CompletionTracker` - Game progress tracker
- `CollaborationStatus` - Multiplayer status display
- `SettingsModal` - Settings configuration modal
- `LoadingSpinner` - Loading state indicator
- `MapStyleToggle` - Map render mode toggle

## Props Interface

```typescript
// No props - component uses game store directly
```

## State Requirements

### Local State

| State | Type | Purpose |
|-------|------|---------|
| `isContentVisible` | `boolean` | Controls fade-in animation for content |
| `isContentLoadedAndReady` | `boolean` | Signals when content has fully rendered |

### Store Dependencies (from [`useGameStore`](../../src/stores/gameStore.ts:10))

| Property | Type | Purpose |
|----------|------|---------|
| `viewedEraId` | `number` | Currently selected era ID |
| `view` | [`View`](../../src/types.ts:10) | Current view mode ('eras' or 'elements') |
| `players` | [`Player[]`](../../src/types.ts:74) | List of players in the game |
| `currentPlayer` | [`Player \| null`](../../src/types.ts:74) | Currently active player |
| `elements` | [`ElementCard[]`](../../src/types.ts:166) | Game elements |
| `gameRole` | [`GameRole`](../../src/types.ts:12) | User's role ('player' or 'observer') |
| `appSettings` | [`AppSettings`](../../src/types.ts:69) | Application settings |
| `isSettingsModalOpen` | `boolean` | Settings modal visibility |
| `toggleSettingsModal` | `() => void` | Toggle settings modal |
| `saveSettings` | `(settings) => void` | Save settings to store |
| `updateElement` | `(element) => void` | Update an element |
| `deleteElement` | `(elementId) => void` | Delete an element |
| `exportElementHtml` | `(element) => void` | Export element as HTML |
| `exportElementMarkdown` | `(element) => void` | Export element as Markdown |
| `gameSettings` | [`GameSettings \| null`](../../src/types.ts:61) | Game configuration |
| `isTransitioning` | `boolean` | Content transition in progress |
| `isGameReady` | `boolean` | Store hydrated and ready |

## Rendering Logic

### Layout Structure

```
<div class="min-h-screen flex flex-col">
    <!-- Navigation Header -->
    <NavigationHeader />

    <!-- Main Content Area -->
    <main class="flex-grow container mx-auto my-8 pb-40">
        <div class="content-box">
            <div class="fade-container">
                <!-- Content: EraContent or ElementManager -->
            </div>
        </div>
    </main>

    <!-- Fixed Bottom Status Bars -->
    <div class="fixed bottom-0 left-0 w-full z-10 mt-auto">
        <CompletionTracker />
        <CollaborationStatus />
    </div>

    <!-- Modals and Overlays -->
    <SettingsModal />
    <MapStyleToggle />
</div>
```

### Initialization Gate

Before rendering main content, component checks initialization state:

```typescript
if (!isGameReady) {
    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-200">
            <LoadingSpinner message="Initializing World..." />
        </div>
    );
}
```

### Player Role Validation

Ensures player role has a current player assigned:

```typescript
if (gameRole === 'player' && !currentPlayer) {
    return <div>Error: Player role selected, but no current player is set.</div>;
}
```

### Content Rendering

Based on current `view` state:

| View | Component | Purpose |
|------|------------|---------|
| 'eras' | `EraContent` | Display era-specific gameplay content |
| 'elements' | `ElementManager` | Display and manage game elements |

### Transition Animation System

#### Fade-Out (Transition Start)

```typescript
useEffect(() => {
    if (isTransitioning) {
        setIsContentVisible(false);
    }
}, [isTransitioning]);
```

#### Fade-In (Transition Complete)

```typescript
useEffect(() => {
    if (!isTransitioning && isContentLoadedAndReady) {
        const timer = setTimeout(() => {
            setIsContentVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }
}, [isTransitioning, isContentLoadedAndReady, viewedEraId, view]);
```

#### Content Ready Callback

```typescript
const handleContentReady = useCallback((isReady: boolean) => {
    setIsContentLoadedAndReady(isReady);
}, []);
```

The callback is wrapped in `useCallback` to maintain stable reference and prevent infinite render loops in child components.

### Styling

#### Container Classes
- `min-h-screen`: Minimum full viewport height
- `flex flex-col`: Flex column layout
- `container mx-auto my-8 pb-40`: Centered container with bottom padding for fixed elements

#### Content Box
- Uses [`componentStyles.layout.contentBoxMain`](../../src/design/tokens.ts:1) for consistent styling

#### Animation Classes
- `animate-fade-in`: Applied when `isContentVisible` is true
- `opacity-0`: Applied when `isContentVisible` is false

### Fixed Elements

| Element | Position | Z-Index |
|---------|----------|---------|
| `CompletionTracker` | Bottom-left | 10 |
| `CollaborationStatus` | Bottom-left (above tracker) | 10 |
| `SettingsModal` | Centered overlay | Modal z-index |
| `MapStyleToggle` | Bottom-right (offset) | 100 |

## Event Handling

### User Interactions

| Interaction | Handler | Source |
|-------------|---------|--------|
| Navigation clicks | Handled by `NavigationHeader` | Child component |
| Element updates | `updateElement()` | Passed to `ElementManager` |
| Element deletion | `deleteElement()` | Passed to `ElementManager` |
| Settings toggle | `toggleSettingsModal()` | Passed to `SettingsModal` |
| Settings save | `saveSettings()` | Passed to `SettingsModal` |
| Content ready signal | `handleContentReady()` | Passed to `EraContent` |

### Callbacks

- `handleContentReady(isReady: boolean)`: Signals when child content has fully rendered

## Accessibility

### ARIA Labels

- **Main content area**: Should include `role="main"` and appropriate `aria-label`
- **Navigation**: Handled by `NavigationHeader` component
- **Status bars**: Should include `role="status"` for screen reader announcements
- **Modals**: Handled by `SettingsModal` component

### Keyboard Navigation

- **Tab order**: Navigation → Main content → Status bars → Modals
- **Focus management**: Modal focus trapping handled by `SettingsModal`
- **Skip links**: Consider adding skip-to-content link for keyboard users

### Semantic HTML

- `<main>`: Primary content area
- Proper heading hierarchy maintained by child components
- Fixed elements use appropriate ARIA roles

## Performance

### Optimization Strategies

1. **useCallback for handlers**: `handleContentReady` wrapped to prevent child re-renders
2. **Conditional rendering**: Only renders appropriate child based on `view` state
3. **Initialization gate**: Prevents rendering until store is hydrated
4. **Micro-task delay**: 50ms delay ensures browser renders opacity-0 state before animation

### Rendering Considerations

- **Transition animations**: Fade in/out controlled by state flags
- **Store subscriptions**: Subscribes to all necessary store values
- **Child component memoization**: Consider memoizing `EraContent` and `ElementManager` if they become expensive

### Animation Timing

| Event | Delay | Purpose |
|-------|-------|---------|
| Transition start | Immediate | Fade out content |
| Transition complete + content ready | 50ms | Ensure opacity-0 state before fade-in |

## Responsive Design

### Current Implementation

- **Container**: `container mx-auto` provides responsive max-width
- **Padding**: `pb-40` reserves space for fixed bottom elements
- **Flex layout**: Column layout adapts to screen height

### Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Single column, stacked elements |
| Tablet | Centered container, adequate spacing |
| Desktop | Full-width container, optimal spacing |

### Mobile Navigation Drawer

#### Drawer Component

```typescript
interface NavigationDrawerProps {
    isOpen: boolean;
    onToggle: () => void;
    currentView: 'eras' | 'elements';
    onViewChange: (view: 'eras' | 'elements') => void;
    viewedEraId: number;
    onEraChange: (eraId: number) => void;
    players: Player[];
    currentPlayer: Player | null;
    gameRole: GameRole;
    onSettingsClick: () => void;
}
```

#### Drawer Structure

```typescript
<div class="mobile-navigation-drawer">
    {/* Backdrop Overlay */}
    <div
        class={cn(
            "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onToggle}
    />
    
    {/* Drawer Panel */}
    <div
        class={cn(
            "fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}
    >
        {/* Drawer Content */}
        <div class="drawer-content">
            {/* Header */}
            <div class="drawer-header">
                <h2>Mappa Imperium</h2>
                <Button onClick={onToggle} variant="ghost">
                    <XIcon />
                </Button>
            </div>
            
            {/* Player Info */}
            {gameRole === 'player' && currentPlayer && (
                <div class="player-info">
                    <div class="player-avatar">
                        {currentPlayer.name.charAt(0)}
                    </div>
                    <div>
                        <div class="player-name">{currentPlayer.name}</div>
                        <div class="player-number">Player {currentPlayer.number}</div>
                    </div>
                </div>
            )}
            
            {/* Navigation Items */}
            <nav class="drawer-nav">
                {/* View Toggle */}
                <div class="nav-section">
                    <h3>View</h3>
                    <button
                        class={cn("nav-item", currentView === 'eras' && "active")}
                        onClick={() => onViewChange('eras')}
                    >
                        <CalendarIcon />
                        Eras
                    </button>
                    <button
                        class={cn("nav-item", currentView === 'elements' && "active")}
                        onClick={() => onViewChange('elements')}
                    >
                        <ListIcon />
                        Elements
                    </button>
                </div>
                
                {/* Era Selection */}
                {currentView === 'eras' && (
                    <div class="nav-section">
                        <h3>Current Era</h3>
                        {eras.map(era => (
                            <button
                                key={era.id}
                                class={cn("nav-item", viewedEraId === era.id && "active")}
                                onClick={() => onEraChange(era.id)}
                            >
                                {era.name}
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Settings */}
                <div class="nav-section">
                    <button class="nav-item" onClick={onSettingsClick}>
                        <SettingsIcon />
                        Settings
                    </button>
                </div>
            </nav>
            
            {/* Footer */}
            <div class="drawer-footer">
                <div class="version-info">v1.0.0</div>
            </div>
        </div>
    </div>
</div>
```

#### Drawer Styling

```css
.mobile-navigation-drawer {
    /* Drawer Panel */
    .drawer-content {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .player-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #f9fafb;
    }
    
    .player-avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: #4f46e5;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .drawer-nav {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }
    
    .nav-section {
        margin-bottom: 1.5rem;
    }
    
    .nav-section h3 {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #6b7280;
        margin-bottom: 0.5rem;
        padding-left: 0.75rem;
    }
    
    .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background: transparent;
        border: none;
        text-align: left;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .nav-item:hover {
        background: #f3f4f6;
    }
    
    .nav-item.active {
        background: #e0e7ff;
        color: #4f46e5;
        font-weight: 500;
    }
    
    .drawer-footer {
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
        text-align: center;
    }
    
    .version-info {
        font-size: 0.75rem;
        color: #9ca3af;
    }
}
```

#### Hamburger Menu Button

```typescript
const HamburgerButton = ({ onClick, isOpen }: HamburgerButtonProps) => (
    <Button
        onClick={onClick}
        variant="ghost"
        size="sm"
        class="hamburger-button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="navigation-drawer"
    >
        {isOpen ? <XIcon /> : <MenuIcon />}
    </Button>
);
```

#### Drawer State Management

```typescript
interface DrawerState {
    isOpen: boolean;
}

interface DrawerActions {
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
}

const useNavigationDrawer = (): [DrawerState, DrawerActions] => {
    const [isOpen, setIsOpen] = useState(false);
    
    const openDrawer = () => setIsOpen(true);
    const closeDrawer = () => setIsOpen(false);
    const toggleDrawer = () => setIsOpen(prev => !prev);
    
    // Close drawer on route change
    useEffect(() => {
        closeDrawer();
    }, [currentView, viewedEraId]);
    
    // Close drawer on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDrawer();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);
    
    return [{ isOpen }, { openDrawer, closeDrawer, toggleDrawer }];
};
```

#### Drawer Accessibility

```typescript
<div
    id="navigation-drawer"
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
    aria-hidden={!isOpen}
    class="mobile-navigation-drawer"
>
    {/* Drawer content */}
</div>
```

#### Drawer Integration with Layout

```typescript
const AppLayout = () => {
    const [{ isOpen }, { toggleDrawer }] = useNavigationDrawer();
    
    return (
        <div class="min-h-screen flex flex-col">
            {/* Navigation Header */}
            <NavigationHeader
                onMobileMenuClick={toggleDrawer}
                showHamburger={true}
            />
            
            {/* Mobile Navigation Drawer */}
            <NavigationDrawer
                isOpen={isOpen}
                onToggle={toggleDrawer}
                currentView={view}
                onViewChange={setView}
                viewedEraId={viewedEraId}
                onEraChange={setViewedEraId}
                players={players}
                currentPlayer={currentPlayer}
                gameRole={gameRole}
                onSettingsClick={toggleSettingsModal}
            />
            
            {/* Main Content */}
            <main class="flex-grow container mx-auto my-8 pb-40">
                {/* Content */}
            </main>
            
            {/* Fixed Bottom Status Bars */}
            <div class="fixed bottom-0 left-0 w-full z-10 mt-auto">
                <CompletionTracker />
                <CollaborationStatus />
            </div>
        </div>
    );
};
```

#### Drawer Breakpoints

| Breakpoint | Drawer Width | Trigger |
|------------|--------------|---------|
| Mobile (< 768px) | 320px | Hamburger menu visible |
| Tablet (768px - 1024px) | 320px | Hamburger menu visible |
| Desktop (> 1024px) | N/A | Hamburger hidden, use header navigation |

#### Drawer Animation Timing

| Property | Duration | Easing |
|----------|-----------|--------|
| Transform (slide) | 300ms | ease-in-out |
| Opacity (backdrop) | 300ms | ease-in-out |
| Hover states | 200ms | ease |
| Active states | 150ms | ease |

### Future Enhancements

- Collapsible status bars on small screens
- Touch-optimized interactions for mobile
- Swipe gestures for drawer
- Nested navigation for complex menus

## Navigation

### Navigation Header

The [`NavigationHeader`](../../src/components/navigation/NavigationHeader.tsx:1) component provides:
- Era selection buttons
- View toggle (eras/elements)
- Player status display
- Settings access

### View Switching

Users can switch between:
- **Eras view**: Era-specific gameplay content
- **Elements view**: Element management interface

View switching triggers transition animation via `isTransitioning` state.

## Player Status Display

Player status is displayed in the [`NavigationHeader`](../../src/components/navigation/NavigationHeader.tsx:1) component, showing:
- Current player name
- Player number
- Online status
- Role indicator

## Chat Panel Integration

### Chat Panel Component

```typescript
interface ChatMessage {
    id: string;
    playerId: number;
    playerName: string;
    content: string;
    timestamp: Date;
    type: 'chat' | 'system' | 'action' | 'ai';
    isEdited?: boolean;
}

interface ChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    onEditMessage?: (messageId: string, newContent: string) => void;
    onDeleteMessage?: (messageId: string) => void;
    isOpen: boolean;
    onToggle: () => void;
    players: Player[];
    currentPlayer: Player | null;
    unreadCount: number;
    typingUsers: Player[];
    isCollaborationActive: boolean;
}
```

### Chat Panel Positioning

#### Desktop Layout (Fixed Right Sidebar)

```typescript
<div class="flex h-screen">
    {/* Main Content */}
    <main class="flex-1 overflow-auto">
        {/* EraContent or ElementManager */}
    </main>
    
    {/* Chat Panel - Fixed Right Sidebar */}
    <aside
        class={cn(
            "w-80 border-l bg-white transition-all duration-300",
            isOpen ? "translate-x-0" : "translate-x-full absolute right-0"
        )}
    >
        <ChatPanel {...chatProps} />
    </aside>
</div>
```

#### Tablet Layout (Collapsible Floating Panel)

```typescript
<div class="relative">
    {/* Main Content */}
    <main class="w-full">
        {/* EraContent or ElementManager */}
    </main>
    
    {/* Chat Panel - Floating */}
    <div
        class={cn(
            "fixed right-4 bottom-4 w-72 h-96 bg-white rounded-lg shadow-xl transition-all duration-300",
            isOpen ? "translate-y-0" : "translate-y-full"
        )}
    >
        <ChatPanel {...chatProps} />
    </div>
</div>
```

#### Mobile Layout (Bottom Drawer)

```typescript
<div class="relative">
    {/* Main Content */}
    <main class="w-full pb-80">
        {/* EraContent or ElementManager */}
    </main>
    
    {/* Chat Panel - Bottom Drawer */}
    <div
        class={cn(
            "fixed bottom-0 left-0 right-0 h-72 bg-white border-t transition-transform duration-300",
            isOpen ? "translate-y-0" : "translate-y-full"
        )}
    >
        <ChatPanel {...chatProps} />
    </div>
</div>
```

### Chat Panel State Management

```typescript
interface ChatState {
    messages: ChatMessage[];
    unreadCount: number;
    isOpen: boolean;
    typingUsers: Player[];
    isCollaborationActive: boolean;
}

interface ChatActions {
    sendMessage: (content: string) => void;
    editMessage: (messageId: string, content: string) => void;
    deleteMessage: (messageId: string) => void;
    togglePanel: () => void;
    markAsRead: () => void;
    setTyping: (isTyping: boolean) => void;
}
```

### Chat Panel Integration Points

1. **Multiplayer Sessions**:
   - Display player names with color coding
   - Show online/offline status
   - Support private messages (future)

2. **Observer Mode**:
   - Read-only access to chat
   - Visual indicator for observer status
   - Cannot send messages

3. **AI Player Communication**:
   - AI messages marked with distinct icon
   - AI can respond to game events
   - AI can provide narrative commentary

4. **Game Events**:
   - System messages for game state changes
   - Turn notifications
   - Action announcements

### Chat Panel Features

#### Message Types

| Type | Description | Styling |
|------|-------------|---------|
| chat | Standard player message | Player color, timestamp |
| system | System notification | Gray, italic, centered |
| action | Game action announcement | Bold, accent color |
| ai | AI player message | Purple, AI icon |

#### Typing Indicators

```typescript
interface TypingIndicatorProps {
    players: Player[];
}

const TypingIndicator = ({ players }: TypingIndicatorProps) => (
    <div class="typing-indicator">
        {players.length > 0 && (
            <span>
                {players.map(p => p.name).join(', ')} {players.length === 1 ? 'is' : 'are'} typing...
            </span>
        )}
    </div>
);
```

#### Unread Count Badge

```typescript
const UnreadBadge = ({ count }: { count: number }) => (
    <div class="unread-badge">
        {count > 0 && (
            <span class="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {count > 99 ? '99+' : count}
            </span>
        )}
    </div>
);
```

#### Message Input

```typescript
interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

const MessageInput = ({ onSend, disabled, placeholder }: MessageInputProps) => (
    <div class="message-input">
        <textarea
            placeholder={placeholder || "Type a message..."}
            disabled={disabled}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSend(e.currentTarget.value);
                }
            }}
        />
        <Button onClick={() => onSend(inputRef.current?.value)}>
            Send
        </Button>
    </div>
);
```

### Chat Panel Toggle Button

```typescript
const ChatToggle = ({ isOpen, onToggle, unreadCount }: ChatToggleProps) => (
    <Button
        onClick={onToggle}
        variant="secondary"
        class="chat-toggle-button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
    >
        <MessageIcon />
        {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
    </Button>
);
```

### Chat Panel Positioning Summary

| Breakpoint | Position | Width | Height | Toggle Button |
|------------|----------|-------|--------|---------------|
| Desktop | Fixed right sidebar | 320px | Full height | Header icon |
| Tablet | Floating panel | 288px | 384px | Floating button |
| Mobile | Bottom drawer | Full width | 288px | Bottom bar icon |

## Future Enhancements

1. **Layout Customization**:
   - User-configurable panel positions
   - Collapsible sidebars
   - Custom theme selection

2. **Improved Transitions**:
   - Slide animations for view changes
   - Staggered content reveal
   - Smooth modal transitions

3. **Performance Improvements**:
   - Virtual scrolling for large element lists
   - Lazy loading of era content
   - Image optimization for map rendering

4. **Accessibility**:
   - Skip-to-content link
   - Reduced motion mode support
   - High contrast mode
   - Screen reader improvements

5. **Mobile Enhancements**:
   - Touch gestures for navigation
   - Swipe-based panel toggles
   - Adaptive layouts for small screens

6. **Debug and Developer Tools**:
   - Component tree viewer
   - State inspector
   - Performance monitor overlay

7. **Collaboration Features**:
   - Real-time cursors
   - User presence indicators
   - Shared annotations

8. **Notification System**:
    - Toast notifications
    - In-app alerts
    - Actionable notifications

## Related Documents

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [unified_map_renderer_spec.md](./unified_map_renderer_spec.md:1) - Map renderer component used in era content
- [world_creation_wizard_spec.md](./world_creation_wizard_spec.md:1) - World creation wizard integrated into layout
- [map_style_toggle_spec.md](./map_style_toggle_spec.md:1) - Map style toggle button component
- [wireframes/main_map_interface_wireframe.md](./wireframes/main_map_interface_wireframe.md:1) - Wireframe mockup for main map interface
- [component_tdd_spec.md](./component_tdd_spec.md:1) - Test-driven documentation for component patterns
