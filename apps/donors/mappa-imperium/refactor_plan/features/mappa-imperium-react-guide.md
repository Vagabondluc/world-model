# Complete React Best Practices Guide for Mappa Imperium

## 1. Components and JSX - Complete Architecture

### Component Hierarchy Strategy

**Top-Level Application Structure**:
```jsx
// App.jsx - Root component with global providers
function App() {
  return (
    <ErrorBoundary>
      <GameStateProvider>
        <RealtimeProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/setup" element={<GameSetup />} />
                  <Route path="/game/:gameId" element={<GameSession />} />
                  <Route path="/chronicle/:feedId" element={<ChronicleViewer />} />
                </Routes>
              </main>
              <Toast />
            </div>
          </Router>
        </RealtimeProvider>
      </GameStateProvider>
    </ErrorBoundary>
  );
}
```

**Game Session Component Architecture**:
```jsx
// GameSession.jsx - Main game interface
function GameSession() {
  return (
    <div className="game-session">
      <NavigationHeader />
      <div className="game-workspace">
        <EraInterface />
        <ElementManager />
        <PlayerPanel />
      </div>
      <ProgressFooter />
    </div>
  );
}

// EraInterface.jsx - Era-specific content container
function EraInterface() {
  const { currentEra } = useGameState();
  
  return (
    <div className="era-interface">
      <EraHeader era={currentEra} />
      <EraContent era={currentEra} />
      <EraActions era={currentEra} />
    </div>
  );
}
```

**Element Management Components**:
```jsx
// ElementManager.jsx - World state visualization
function ElementManager() {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState(initialFilters);
  
  return (
    <div className="element-manager">
      <ElementFilters 
        filters={filters} 
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {viewMode === 'grid' ? (
        <ElementGrid filters={filters} />
      ) : (
        <ElementList filters={filters} />
      )}
    </div>
  );
}

// ElementCard.jsx - Individual element display
function ElementCard({ element, permissions, onEdit, onClick }) {
  return (
    <div 
      className={`element-card element-card--${element.type} player-${element.owner}`}
      onClick={() => onClick(element)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(element)}
      aria-label={`${element.type}: ${element.name}, owned by Player ${element.owner}`}
    >
      <div className="element-card__header">
        <span className="element-card__icon" aria-hidden="true">
          {getElementIcon(element.type)}
        </span>
        <h3 className="element-card__title">{element.name}</h3>
        {permissions.canEdit && (
          <DropdownMenu>
            <DropdownItem onClick={() => onEdit(element)}>
              Edit
            </DropdownItem>
            <DropdownItem onClick={() => onDelete(element)}>
              Delete
            </DropdownItem>
            <DropdownItem onClick={() => onExport(element)}>
              Export
            </DropdownItem>
          </DropdownMenu>
        )}
      </div>
      <p className="element-card__summary">{element.quickSummary}</p>
      <div className="element-card__meta">
        <span className="element-card__era">Era {element.eraCreated}</span>
        <span className="element-card__owner">Player {element.owner}</span>
      </div>
    </div>
  );
}
```

**Era-Specific Components**:
```jsx
// Era I Components
function GeographyBuilder() {
  const [currentGeography, setCurrentGeography] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);
  
  return (
    <div className="geography-builder">
      <DiceRoller 
        diceCount={2}
        onRoll={handleGeographyRoll}
        disabled={placementMode}
      />
      {currentGeography && (
        <GeographyPlacer
          geography={currentGeography}
          onPlacement={handlePlacement}
          onCancel={() => setCurrentGeography(null)}
        />
      )}
      <AIGuidancePanel 
        context="geography-placement"
        currentAction={currentGeography}
      />
    </div>
  );
}

// Era II Components
function PantheonBuilder() {
  const [deities, setDeities] = useState([]);
  const [currentDeity, setCurrentDeity] = useState(null);
  
  return (
    <div className="pantheon-builder">
      <DeityCreator 
        onDeityCreate={handleDeityCreate}
        existingDeities={deities}
      />
      <DeityList 
        deities={deities}
        onDeitySelect={setCurrentDeity}
      />
      {currentDeity && (
        <DeityDetailEditor 
          deity={currentDeity}
          onSave={handleDeitySave}
        />
      )}
    </div>
  );
}

// Era IV-VI Components
function EventProcessor() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventYear, setEventYear] = useState(null);
  
  return (
    <div className="event-processor">
      <DiceRoller 
        diceCount={1}
        onRoll={handleEventRoll}
      />
      {currentEvent && (
        <>
          <YearSelector 
            currentTurn={getCurrentTurn()}
            onYearSelect={setEventYear}
          />
          <EventForm 
            event={currentEvent}
            year={eventYear}
            onSubmit={handleEventSubmit}
          />
        </>
      )}
      <EventHistory />
    </div>
  );
}
```

### JSX Best Practices Implementation

**Dynamic Styling and Classes**:
```jsx
// Player-specific styling
const elementClasses = [
  'element-card',
  `element-card--${element.type}`,
  `player-${element.owner}`,
  element.status === 'legendary' && 'element-card--legendary',
  permissions.canEdit && 'element-card--editable'
].filter(Boolean).join(' ');

// Conditional content rendering
{gameState.currentEra >= 3 && (
  <FactionManager factions={factions} />
)}

// Dynamic attributes
<input
  type="text"
  value={elementName}
  onChange={(e) => setElementName(e.target.value)}
  disabled={!permissions.canEdit}
  className={`input ${hasError ? 'input--error' : ''}`}
  aria-invalid={hasError}
  aria-describedby={hasError ? 'name-error' : undefined}
/>
```

**React Fragments for Clean Markup**:
```jsx
// Avoiding wrapper divs in lists
function ElementList({ elements }) {
  return (
    <div className="element-list">
      {elements.map(element => (
        <React.Fragment key={element.id}>
          <ElementListItem element={element} />
          {element.relationships.length > 0 && (
            <RelationshipIndicators relationships={element.relationships} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Modal content without wrapper
function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  
  return createPortal(
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        {children}
      </div>
    </>,
    document.getElementById('modal-root')
  );
}
```

## 2. Props and Keys - Data Management

### Props Architecture for Multi-Player System

**Player and Permission Props**:
```jsx
// High-level prop structure
interface GameSessionProps {
  gameId: string;
  currentPlayer: Player;
  allPlayers: Player[];
  gameState: GameState;
  permissions: PermissionSystem;
  onStateUpdate: (update: StateUpdate) => void;
}

// Element-specific props
interface ElementCardProps {
  element: ElementCard;
  permissions: ElementPermissions;
  isSelected?: boolean;
  showRelationships?: boolean;
  onEdit: (element: ElementCard) => void;
  onDelete: (element: ElementCard) => void;
  onView: (element: ElementCard) => void;
  onRelationshipCreate: (source: ElementCard, target: ElementCard) => void;
}

// Era-specific props
interface EraContentProps {
  era: EraData;
  playerElements: ElementCard[];
  worldState: WorldState;
  onElementCreate: (element: Partial<ElementCard>) => void;
  onElementUpdate: (elementId: string, updates: Partial<ElementCard>) => void;
  aiGuidance: AIGuidanceSystem;
}
```

**Children Prop for Layout Composition**:
```jsx
// Flexible layout components
function GamePanel({ title, actions, children }) {
  return (
    <div className="game-panel">
      <header className="game-panel__header">
        <h2>{title}</h2>
        <div className="game-panel__actions">
          {actions}
        </div>
      </header>
      <div className="game-panel__content">
        {children}
      </div>
    </div>
  );
}

// Usage with composition
<GamePanel 
  title="Era I: Age of Creation" 
  actions={<EraProgressButton />}
>
  <GeographyBuilder />
  <ResourceManager />
  <AIGuidancePanel />
</GamePanel>

// Modal composition
function ConfirmationModal({ title, message, onConfirm, onCancel, children }) {
  return (
    <Modal>
      <div className="confirmation-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        {children}
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} className="btn--danger">
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

### Key Prop Strategy for Dynamic Lists

**Element Card Keys**:
```jsx
// Compound keys for complex data
{elements.map(element => (
  <ElementCard
    key={`${element.type}-${element.id}-${element.owner}-${element.version}`}
    element={element}
    permissions={getElementPermissions(element, currentPlayer)}
  />
))}

// Relationship mapping with stable keys
{element.relationships.map(relationship => (
  <RelationshipLink
    key={`rel-${relationship.sourceId}-${relationship.targetId}-${relationship.type}`}
    relationship={relationship}
    onEdit={handleRelationshipEdit}
  />
))}

// Player territory keys
{players.map(player => (
  <PlayerTerritory
    key={`territory-${player.id}-${player.regionAssignment}`}
    player={player}
    elements={getPlayerElements(player.id)}
  />
))}
```

**Event Timeline Keys**:
```jsx
// Chronological event rendering
{chronologicalEvents.map(event => (
  <TimelineEvent
    key={`event-${event.id}-${event.createdYear}-${event.era}`}
    event={event}
    isExpanded={expandedEvents.includes(event.id)}
    onToggle={() => toggleEventExpansion(event.id)}
  />
))}

// Multi-turn era keys
{eraProgression.map((turn, index) => (
  <EraTurn
    key={`era-${currentEra}-turn-${index}-${turn.startYear}`}
    turn={turn}
    isActive={index === currentTurnIndex}
  />
))}
```

## 3. Rendering and State - Real-Time Collaboration

### State Architecture for Complex Game State

**Global Game State Management**:
```jsx
// GameStateContext.js
const initialGameState = {
  gameSettings: {
    gameId: null,
    maxPlayers: 4,
    currentEra: 1,
    gameMode: 'standard',
    createdAt: null
  },
  players: [],
  elements: [],
  currentPlayer: null,
  eraProgression: {},
  realtimeStatus: {
    connected: false,
    lastSync: null,
    conflictResolution: []
  }
};

const gameStateReducer = (state, action) => {
  switch (action.type) {
    case 'PLAYER_JOIN':
      return {
        ...state,
        players: [...state.players, action.player]
      };
    
    case 'ELEMENT_CREATE':
      const newElement = {
        ...action.element,
        id: generateUniqueId(),
        createdAt: new Date(),
        owner: state.currentPlayer.id
      };
      return {
        ...state,
        elements: [...state.elements, newElement]
      };
    
    case 'ELEMENT_UPDATE':
      return {
        ...state,
        elements: state.elements.map(element =>
          element.id === action.elementId 
            ? { ...element, ...action.updates, updatedAt: new Date() }
            : element
        )
      };
    
    case 'ERA_ADVANCE':
      return {
        ...state,
        gameSettings: {
          ...state.gameSettings,
          currentEra: state.gameSettings.currentEra + 1
        },
        eraProgression: {
          ...state.eraProgression,
          [state.gameSettings.currentEra]: {
            completedAt: new Date(),
            playerContributions: action.contributions
          }
        }
      };
    
    case 'REALTIME_SYNC':
      return {
        ...state,
        ...action.syncedState,
        realtimeStatus: {
          connected: true,
          lastSync: new Date(),
          conflictResolution: []
        }
      };
    
    default:
      return state;
  }
};

function GameStateProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState);
  
  // Real-time synchronization effect
  useEffect(() => {
    if (gameState.gameSettings.gameId) {
      const realtimeConnection = establishRealtimeConnection(
        gameState.gameSettings.gameId,
        (syncUpdate) => dispatch({ type: 'REALTIME_SYNC', syncedState: syncUpdate })
      );
      
      return () => realtimeConnection.disconnect();
    }
  }, [gameState.gameSettings.gameId]);
  
  const contextValue = {
    gameState,
    dispatch,
    // Convenience methods
    createElement: (element) => dispatch({ type: 'ELEMENT_CREATE', element }),
    updateElement: (elementId, updates) => dispatch({ type: 'ELEMENT_UPDATE', elementId, updates }),
    advanceEra: (contributions) => dispatch({ type: 'ERA_ADVANCE', contributions })
  };
  
  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
}
```

### Controlled Components for All Game Forms

**Element Creation Forms**:
```jsx
function ElementCreationForm({ elementType, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    quickSummary: '',
    keyDetails: [],
    fullDescription: '',
    mechanicalStats: {},
    futureHooks: []
  });
  
  const [validation, setValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validation[field]) {
      setValidation(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateElementData(formData, elementType);
    if (Object.keys(validationErrors).length > 0) {
      setValidation(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        type: elementType,
        eraCreated: getCurrentEra()
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="element-creation-form">
      <div className="form-group">
        <label htmlFor="element-name">Name *</label>
        <input
          id="element-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={isSubmitting}
          className={validation.name ? 'input--error' : ''}
          aria-invalid={!!validation.name}
          aria-describedby={validation.name ? 'name-error' : undefined}
        />
        {validation.name && (
          <div id="name-error" className="form-error" role="alert">
            {validation.name}
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="quick-summary">Quick Summary *</label>
        <textarea
          id="quick-summary"
          value={formData.quickSummary}
          onChange={(e) => handleInputChange('quickSummary', e.target.value)}
          disabled={isSubmitting}
          rows={3}
          maxLength={200}
        />
        <div className="form-hint">
          {200 - formData.quickSummary.length} characters remaining
        </div>
      </div>
      
      <KeyDetailsEditor
        details={formData.keyDetails}
        onChange={(details) => handleInputChange('keyDetails', details)}
        disabled={isSubmitting}
      />
      
      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Element'}
        </button>
      </div>
    </form>
  );
}
```

**Dice Rolling Interface**:
```jsx
function DiceRoller({ diceCount, diceType = 6, onRoll, disabled, label }) {
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  
  const handleRoll = async () => {
    setIsRolling(true);
    
    // Simulate dice roll animation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const rolls = Array.from({ length: diceCount }, () => 
      Math.floor(Math.random() * diceType) + 1
    );
    
    const rollResult = {
      individual: rolls,
      total: rolls.reduce((sum, roll) => sum + roll, 0),
      timestamp: new Date()
    };
    
    setLastRoll(rollResult);
    setIsRolling(false);
    onRoll(rollResult);
  };
  
  return (
    <div className="dice-roller">
      <button
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className={`dice-roll-button ${isRolling ? 'rolling' : ''}`}
        aria-label={label || `Roll ${diceCount}d${diceType}`}
      >
        {isRolling ? (
          <span className="dice-animation">🎲</span>
        ) : (
          `Roll ${diceCount}d${diceType}`
        )}
      </button>
      
      {lastRoll && (
        <div className="roll-result" role="status" aria-live="polite">
          <div className="individual-dice">
            {lastRoll.individual.map((die, index) => (
              <span key={index} className="die-result">
                {die}
              </span>
            ))}
          </div>
          <div className="total-result">
            Total: {lastRoll.total}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Virtual DOM Optimization for Large Datasets

**Efficient Element Lists**:
```jsx
function VirtualizedElementList({ elements, itemHeight = 120 }) {
  const [containerRef, setContainerRef] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight) + 1,
    elements.length
  );
  
  const visibleElements = elements.slice(visibleStartIndex, visibleEndIndex);
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  useEffect(() => {
    if (containerRef) {
      const resizeObserver = new ResizeObserver(entries => {
        setContainerHeight(entries[0].contentRect.height);
      });
      resizeObserver.observe(containerRef);
      return () => resizeObserver.disconnect();
    }
  }, [containerRef]);
  
  return (
    <div
      ref={setContainerRef}
      className="virtualized-list"
      onScroll={handleScroll}
      style={{ height: '100%', overflow: 'auto' }}
    >
      <div style={{ height: elements.length * itemHeight, position: 'relative' }}>
        {visibleElements.map((element, index) => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              top: (visibleStartIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            <ElementCard element={element} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 4. Hooks - Advanced State and Effect Management

### Custom Hooks for Game Logic

**Era Management Hook**:
```jsx
function useEraManagement() {
  const { gameState, dispatch } = useGameState();
  const [eraTransition, setEraTransition] = useState(null);
  
  const checkEraCompletion = useCallback(() => {
    const currentEra = gameState.gameSettings.currentEra;
    const requiredElements = getRequiredElementsForEra(currentEra);
    const playerElements = gameState.elements.filter(
      el => el.eraCreated === currentEra && el.owner === gameState.currentPlayer.id
    );
    
    return requiredElements.every(type =>
      playerElements.some(el => el.type === type)
    );
  }, [gameState]);
  
  const advanceEra = useCallback(async () => {
    if (!checkEraCompletion()) {
      throw new Error('Era requirements not met');
    }
    
    setEraTransition({ from: gameState.gameSettings.currentEra, to: gameState.gameSettings.currentEra + 1 });
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Transition animation
    
    dispatch({ 
      type: 'ERA_ADVANCE',
      contributions: getPlayerContributions(gameState.currentPlayer.id)
    });
    
    setEraTransition(null);
  }, [gameState, dispatch, checkEraCompletion]);
  
  return {
    currentEra: gameState.gameSettings.currentEra,
    isEraComplete: checkEraCompletion(),
    eraTransition,
    advanceEra,
    getEraProgress: () => getEraProgressPercentage(gameState)
  };
}
```

**Real-time Synchronization Hook**:
```jsx
function useRealtimeSync(gameId) {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [conflictResolution, setConflictResolution] = useState([]);
  const { gameState, dispatch } = useGameState();
  const websocketRef = useRef(null);
  
  useEffect(() => {
    if (!gameId) return;
    
    const websocket = new WebSocket(`ws://localhost:8080/game/${gameId}`);
    websocketRef.current = websocket;
    
    websocket.onopen = () => {
      setConnectionStatus('connected');
      // Send current player state
      websocket.send(JSON.stringify({
        type: 'PLAYER_CONNECT',
        player: gameState.currentPlayer
      }));
    };
    
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'STATE_SYNC':
          dispatch({ type: 'REALTIME_SYNC', syncedState: message.state });
          break;
          
        case 'PLAYER_UPDATE':
          dispatch({ type: 'PLAYER_UPDATE', player: message.player });
          break;
          
        case 'ELEMENT_CONFLICT':
          setConflictResolution(prev => [...prev, message.conflict]);
          break;
          
        case 'ELEMENT_UPDATE':
          dispatch({ 
            type: 'ELEMENT_UPDATE', 
            elementId: message.elementId, 
            updates: message.updates 
          });
          break;
      }
    };
    
    websocket.onclose = () => {
      setConnectionStatus('disconnected');
    };
    
    websocket.onerror = () => {
      setConnectionStatus('error');
    };
    
    return () => websocket.close();
  }, [gameId, dispatch, gameState.currentPlayer]);
  
  const sendUpdate = useCallback((updateType, data) => {
    if (connectionStatus === 'connected' && websocketRef.current) {
      websocketRef.current.send(JSON.stringify({ type: updateType, data }));
    }
  }, [connectionStatus]);
  
  return {
    connectionStatus,
    conflictResolution,
    sendUpdate,
    resolveConflict: (conflictId, resolution) => {
      sendUpdate('RESOLVE_CONFLICT', { conflictId, resolution });
      setConflictResolution(prev => prev.filter(c => c.id !== conflictId));
    }
  };
}
```

**AI Guidance Integration Hook**:
```jsx
function useAIGuidance(context) {
  const [guidance, setGuidance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { gameState } = useGameState();
  
  const requestGuidance = useCallback(async (prompt, options = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contextData = {
        currentEra: gameState.gameSettings.currentEra,
        playerElements: gameState.elements.filter(el => el.owner === gameState.currentPlayer.id),
        worldState: gameState,
        context
      };
      
      const response = await aiService.generateGuidance(prompt, contextData, options);
      setGuidance(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, context]);
  
  const clearGuidance = useCallback(() => {
    setGuidance(null);
    setError(null);
  }, []);
  
  return {
    guidance,
    isLoading,
    error,
    requestGuidance,
    clearGuidance
  };
}
```

### Effect Hooks for Side Effects

**Auto-save System**:
```jsx
function useAutoSave(gameState, interval = 30000) {
  const lastSaveRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (JSON.stringify(gameState) !== lastSaveRef.current) {
        setSaveStatus('saving');
        try {
          await saveGameState(gameState);
          lastSaveRef.current = JSON.stringify(gameState);
          setSaveStatus('saved');
        } catch (error) {
          setSaveStatus('error');
        }
      }
    }, interval);
    
    return () => clearInterval(autoSaveInterval);
  }, [gameState, interval]);
  
  return saveStatus;
}
```

**Keyboard Shortcuts**:
```jsx
function useKeyboardShortcuts() {
  const { createElement, advanceEra, saveGameState } = useGameState();
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            saveGameState();
            break;
          case 'n':
            event.preventDefault();
            openCreateElementModal();
            break;
          case 'e':
            event.preventDefault();
            if (event.shiftKey) {
              advanceEra();
            }
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [createElement, advanceEra, saveGameState]);
}
```

### Ref Hooks for Direct DOM Access

**Map Interaction System**:
```jsx
function useMapInteraction() {
  const mapRef = useRef(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  
  const initializeMap = useCallback(() => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBoundingClientRect();
      setMapBounds(bounds);
    }
  }, []);
  
  const getMapCoordinates = useCallback((clientX, clientY) => {
    if (!mapBounds) return null;
    
    return {
      x: ((clientX - mapBounds.left) / mapBounds.width) * 100,
      y: ((clientY - mapBounds.top) / mapBounds.height) * 100
    };
  }, [mapBounds]);
  
  const startDrawing = useCallback((event) => {
    setIsDrawing(true);
    const coords = getMapCoordinates(event.clientX, event.clientY);
    if (coords) {
      setCurrentPath([coords]);
    }
  }, [getMapCoordinates]);
  
  const continueDrawing = useCallback((event) => {
    if (!isDrawing) return;
    
    const coords = getMapCoordinates(event.clientX, event.clientY);
    if (coords) {
      setCurrentPath(prev => [...prev, coords]);
    }
  }, [isDrawing, getMapCoordinates]);
  
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    if (currentPath.length > 1) {
      // Save the completed path
      onPathComplete(currentPath);
    }
    setCurrentPath([]);
  }, [currentPath, onPathComplete]);
  
  useEffect(() => {
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('mousedown', startDrawing);
      mapElement.addEventListener('mousemove', continueDrawing);
      mapElement.addEventListener('mouseup', stopDrawing);
      
      // Initialize map bounds
      initializeMap();
      
      // Handle window resize
      const handleResize = () => initializeMap();
      window.addEventListener('resize', handleResize);
      
      return () => {
        mapElement.removeEventListener('mousedown', startDrawing);
        mapElement.removeEventListener('mousemove', continueDrawing);
        mapElement.removeEventListener('mouseup', stopDrawing);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [startDrawing, continueDrawing, stopDrawing, initializeMap]);
  
  return {
    mapRef,
    isDrawing,
    currentPath,
    getMapCoordinates
  };
}
```

**Focus Management for Modals**:
```jsx
function useFocusManagement(isOpen) {
  const focusRef = useRef(null);
  const previousFocusRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the modal content
      if (focusRef.current) {
        focusRef.current.focus();
      }
      
      // Trap focus within modal
      const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
          const focusableElements = focusRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements?.length) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey && document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
        
        if (event.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        
        // Restore focus to previous element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);
  
  return focusRef;
}
```

## 5. Advanced Concepts - Professional Polish

### Context for Global Game State

**Game State Context Implementation**:
```jsx
// contexts/GameStateContext.js
const GameStateContext = createContext({
  gameState: null,
  dispatch: () => {},
  // Convenience methods
  createElement: () => {},
  updateElement: () => {},
  deleteElement: () => {},
  // Player management
  addPlayer: () => {},
  updatePlayer: () => {},
  // Era management
  advanceEra: () => {},
  checkEraCompletion: () => false,
  // Export functions
  exportGameState: () => {},
  importGameState: () => {}
});

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

// Enhanced provider with all game logic
export function GameStateProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState);
  
  // Element management functions
  const createElement = useCallback((elementData) => {
    const element = {
      ...elementData,
      id: generateUniqueId(),
      createdAt: new Date(),
      owner: gameState.currentPlayer?.id,
      version: 1
    };
    
    dispatch({ type: 'ELEMENT_CREATE', element });
    return element;
  }, [gameState.currentPlayer]);
  
  const updateElement = useCallback((elementId, updates) => {
    dispatch({ 
      type: 'ELEMENT_UPDATE', 
      elementId, 
      updates: {
        ...updates,
        updatedAt: new Date(),
        version: gameState.elements.find(el => el.id === elementId)?.version + 1 || 1
      }
    });
  }, [gameState.elements]);
  
  const deleteElement = useCallback((elementId) => {
    dispatch({ type: 'ELEMENT_DELETE', elementId });
  }, []);
  
  // Player management
  const addPlayer = useCallback((playerData) => {
    const player = {
      ...playerData,
      id: generateUniqueId(),
      joinedAt: new Date(),
      isOnline: true
    };
    
    dispatch({ type: 'PLAYER_JOIN', player });
    return player;
  }, []);
  
  // Era management
  const checkEraCompletion = useCallback(() => {
    const currentEra = gameState.gameSettings.currentEra;
    const requiredElements = getRequiredElementsForEra(currentEra);
    const playerElements = gameState.elements.filter(
      el => el.eraCreated === currentEra && el.owner === gameState.currentPlayer?.id
    );
    
    return requiredElements.every(type =>
      playerElements.some(el => el.type === type)
    );
  }, [gameState]);
  
  const advanceEra = useCallback(() => {
    if (!checkEraCompletion()) {
      throw new Error('Era requirements not met');
    }
    
    dispatch({ 
      type: 'ERA_ADVANCE',
      contributions: getPlayerContributions(gameState.currentPlayer.id)
    });
  }, [gameState, checkEraCompletion]);
  
  // Export/Import functions
  const exportGameState = useCallback(() => {
    return {
      gameSettings: gameState.gameSettings,
      players: gameState.players,
      elements: gameState.elements,
      currentEraId: gameState.gameSettings.currentEra,
      exportedByPlayerNumber: gameState.currentPlayer?.playerNumber,
      exportedAt: new Date()
    };
  }, [gameState]);
  
  const importGameState = useCallback((importedData) => {
    dispatch({ type: 'GAME_IMPORT', importedData });
  }, []);
  
  const contextValue = {
    gameState,
    dispatch,
    // Element management
    createElement,
    updateElement,
    deleteElement,
    // Player management
    addPlayer,
    updatePlayer: (playerId, updates) => dispatch({ type: 'PLAYER_UPDATE', playerId, updates }),
    // Era management
    advanceEra,
    checkEraCompletion,
    // Export/Import
    exportGameState,
    importGameState,
    // Utility functions
    getPlayerElements: (playerId) => gameState.elements.filter(el => el.owner === playerId),
    getElementsByType: (type) => gameState.elements.filter(el => el.type === type),
    getElementsByEra: (era) => gameState.elements.filter(el => el.eraCreated === era)
  };
  
  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
}
```

### Portals for Modal Systems

**Modal Portal Implementation**:
```jsx
// components/shared/Modal.jsx
function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  const focusRef = useFocusManagement(isOpen, onClose);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal modal--${size}`}
        onClick={(e) => e.stopPropagation()}
        ref={focusRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <header className="modal__header">
            <h2 id="modal-title" className="modal__title">{title}</h2>
            <button 
              className="modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </header>
        )}
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

// Enhanced modal for element editing
function ElementEditModal({ element, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(element || {});
  const [isDirty, setIsDirty] = useState(false);
  
  const handleSave = async () => {
    try {
      await onSave(formData);
      setIsDirty(false);
      onClose();
    } catch (error) {
      // Handle error
    }
  };
  
  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={`Edit ${element?.type || 'Element'}`}
      size="large"
    >
      <ElementForm
        data={formData}
        onChange={(updates) => {
          setFormData(prev => ({ ...prev, ...updates }));
          setIsDirty(true);
        }}
        onSubmit={handleSave}
        onCancel={handleClose}
      />
    </Modal>
  );
}
```

### Suspense for Progressive Loading

**Lazy Loading Implementation**:
```jsx
// Lazy load era components for code splitting
const EraCreationContent = lazy(() => import('./era-interfaces/EraCreationContent'));
const EraMythContent = lazy(() => import('./era-interfaces/EraMythContent'));
const EraFoundationContent = lazy(() => import('./era-interfaces/EraFoundationContent'));
const EraDiscoveryContent = lazy(() => import('./era-interfaces/EraDiscoveryContent'));
const EraEmpiresContent = lazy(() => import('./era-interfaces/EraEmpiresContent'));
const EraCollapseContent = lazy(() => import('./era-interfaces/EraCollapseContent'));

// Era content with suspense wrapper
function EraContent({ era }) {
  const EraComponent = {
    1: EraCreationContent,
    2: EraMythContent,
    3: EraFoundationContent,
    4: EraDiscoveryContent,
    5: EraEmpiresContent,
    6: EraCollapseContent
  }[era];
  
  return (
    <Suspense fallback={<EraLoadingSpinner era={era} />}>
      <EraComponent />
    </Suspense>
  );
}

// AI guidance with suspense
function AIGuidancePanel({ context, prompt }) {
  const [guidancePromise, setGuidancePromise] = useState(null);
  
  const requestGuidance = useCallback(() => {
    const promise = aiService.generateGuidance(prompt, context);
    setGuidancePromise(promise);
  }, [prompt, context]);
  
  return (
    <div className="ai-guidance-panel">
      <button onClick={requestGuidance}>
        Get AI Guidance
      </button>
      
      {guidancePromise && (
        <Suspense fallback={<AILoadingIndicator />}>
          <AIGuidanceContent guidancePromise={guidancePromise} />
        </Suspense>
      )}
    </div>
  );
}

// Loading components
function EraLoadingSpinner({ era }) {
  return (
    <div className="era-loading">
      <div className="spinner" />
      <p>Loading Era {era} interface...</p>
    </div>
  );
}

function AILoadingIndicator() {
  return (
    <div className="ai-loading">
      <div className="thinking-animation">🤔</div>
      <p>AI is thinking...</p>
    </div>
  );
}
```

### Error Boundaries for Robust Collaboration

**Comprehensive Error Boundary System**:
```jsx
// Global error boundary
class GameErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }
  
  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: generateUniqueId()
    };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to monitoring service
    errorReportingService.logError({
      error,
      errorInfo,
      gameState: this.props.gameState,
      userAgent: navigator.userAgent,
      timestamp: new Date()
    });
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorRecoveryUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onReset={this.handleReset}
          onReportIssue={() => this.props.onReportIssue(this.state)}
        />
      );
    }
    
    return this.props.children;
  }
}

// Feature-specific error boundaries
function EraErrorBoundary({ era, children }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="era-error">
          <h3>Era {era} Error</h3>
          <p>Something went wrong with the Era {era} interface.</p>
          <details>
            <summary>Error details</summary>
            <pre>{error.message}</pre>
          </details>
          <button onClick={resetError}>
            Retry Era {era}
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// Element-specific error boundary
function ElementErrorBoundary({ elementId, children }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="element-error">
          <p>Error loading element {elementId}</p>
          <button onClick={resetError}>Retry</button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// Error recovery component
function ErrorRecoveryUI({ error, errorInfo, errorId, onReset, onReportIssue }) {
  const [isReporting, setIsReporting] = useState(false);
  
  const handleReportIssue = async () => {
    setIsReporting(true);
    try {
      await onReportIssue();
      // Show success message
    } finally {
      setIsReporting(false);
    }
  };
  
  return (
    <div className="error-recovery">
      <div className="error-recovery__content">
        <h2>Oops! Something went wrong</h2>
        <p>
          We encountered an unexpected error in the game. Your progress has been saved,
          and you can try to continue or restart the current session.
        </p>
        
        <div className="error-recovery__actions">
          <button onClick={onReset} className="btn btn--primary">
            Try Again
          </button>
          <button 
            onClick={handleReportIssue} 
            className="btn btn--secondary"
            disabled={isReporting}
          >
            {isReporting ? 'Reporting...' : 'Report Issue'}
          </button>
        </div>
        
        <details className="error-details">
          <summary>Technical Details (Error ID: {errorId})</summary>
          <pre className="error-stack">
            {error?.stack || error?.message}
          </pre>
        </details>
      </div>
    </div>
  );
}
```

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
1. **Component Architecture**: Establish basic component hierarchy and prop patterns
2. **State Management**: Implement GameStateContext and core reducers
3. **Element System**: Build ElementCard components with proper keys and props
4. **Basic Forms**: Create controlled components for element creation

### Phase 2: Advanced Features (Weeks 5-8)
1. **Custom Hooks**: Implement era management and AI guidance hooks
2. **Modal System**: Build portal-based modal architecture
3. **Error Boundaries**: Add comprehensive error handling
4. **Performance**: Implement virtualization and lazy loading

### Phase 3: Real-time Features (Weeks 9-12)
1. **WebSocket Integration**: Add real-time synchronization hooks
2. **Conflict Resolution**: Implement multi-player coordination
3. **Auto-save**: Build robust persistence system
4. **Accessibility**: Ensure full keyboard navigation and screen reader support

### Phase 4: Polish and Optimization (Weeks 13-16)
1. **Performance Tuning**: Optimize render cycles and memory usage
2. **Testing**: Comprehensive testing of all React patterns
3. **Documentation**: Component documentation and usage guides
4. **Deployment**: Production build optimization and deployment

This comprehensive React implementation ensures Mappa Imperium will be maintainable, performant, and provide the seamless collaborative experience outlined in the design brief. Each React concept directly supports the complex requirements of real-time worldbuilding collaboration while maintaining clean, testable code.