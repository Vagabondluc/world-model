> **_Note: This document details Phase 3 (Weeks 11-12) of the Mappa Imperium development roadmap. It describes a target architecture. The application's current implementation is detailed in the `/docs/current` directory._**

# Phase 3: Production Readiness (Weeks 11-12)

### Week 11: Export System & Polish

#### Day 1-2: Session & Element Export System
```javascript
// DELIVERABLE: A two-part export system.
// 1. Session Management: A global "Export World" button that saves the entire game state (settings, players, elements) to a JSON file. This file can be re-imported to resume a session.
// 2. Content Sharing: An "Actions" menu on each element card (in Element Manager and gameplay interfaces) to export that specific element as a clean HTML file or a Markdown file. A new settings panel allows users to choose between regular Markdown and a Homebrewery/GM Binder-compatible format.

// src/index.tsx (Export/Import/Settings Handlers)
const App = () => {
    // ... state management ...
    const [appSettings, setAppSettings] = useState({ markdownFormat: 'regular' });

    const handleExport = () => {
        // Gathers gameSettings, players, elements into a JSON object
        // Triggers download of 'mappa-imperium-export.json'
    };

    const handleImport = (file) => {
        // Reads JSON file, validates structure
        // Sets gameSettings, players, elements from file
        // Transitions gameState to 'player_selection'
    };

    const handleExportElementHtml = (element) => {
        exportService.exportElementToHtml(element, players);
    };
    
    const handleExportElementMarkdown = (element) => {
        exportService.exportElementToMarkdown(element, players, appSettings.markdownFormat);
    };

    const handleSaveSettings = (newSettings) => {
        setAppSettings(newSettings);
    };

    // ... render logic ...
};

// src/services/exportService.ts (Export Logic)
export function exportElementToHtml(element, players) {
  // Generates a clean, styled HTML document for the single element
  // Triggers download
}

export function exportElementToMarkdown(element, players, format) {
  // Generates a Markdown string for the single element
  // Applies 'regular' or 'homebrewery' styling
  // Triggers download
}

// src/components/shared/SettingsModal.tsx (New Component)
export const SettingsModal = ({ onSave, currentSettings }) => {
    // UI for selecting markdown format
    // Calls onSave with the new settings object
};
```

#### Day 3-4: Quality Assurance & Testing
```javascript
// DELIVERABLE: Comprehensive testing suite

// src/__tests__/integration/EraProgression.test.js
describe('Era Progression Integration', () => {
  test('Complete Era I to Era II progression', async () => {
    const { gameState, mockPlayers } = setupTestGame();
    
    // Era I completion
    await completeGeographyPlacement(gameState, mockPlayers[0]);
    await completeResourcePlacement(gameState, mockPlayers[0]);
    
    expect(gameState.eras[1].completed).toBe(true);
    expect(gameState.eras[2].unlocked).toBe(true);
    
    // Era II starts with proper context
    const eraIIContext = getEraContext(gameState, 2);
    expect(eraIIContext.geography).toBeDefined();
    expect(eraIIContext.resources).toBeDefined();
  });
  
  test('Cross-player coordination during Era V', async () => {
    const { gameState, mockPlayers } = setupTestGame();
    advanceToEra(gameState, 5);
    
    // Player 1 initiates war against Player 2
    const warEvent = await initiateWar(
      mockPlayers[0], 
      mockPlayers[1], 
      { target: 'TestSettlement' }
    );
    
    expect(warEvent.status).toBe('pending_coordination');
    expect(warEvent.participants).toContain(mockPlayers[1].id);
    
    // Both players submit input
    await submitWarInput(mockPlayers[0], warEvent.id, mockAttackerInput);
    await submitWarInput(mockPlayers[1], warEvent.id, mockDefenderInput);
    
    expect(warEvent.status).toBe('ready_for_resolution');
  });
});
// src/__tests__/components/WorldManager.test.js
describe('World Manager Component', () => {
  test('Entity filtering and search', () => {
    const mockEntities = createMockEntities();
    const { getByTestId, getByPlaceholderText } = render(
      <WorldManager entities={mockEntities} />
    );
    
    // Test search functionality
    const searchInput = getByPlaceholderText('Search entities...');
    fireEvent.change(searchInput, { target: { value: 'Dragon' } });
    
    expect(getByTestId('entity-grid')).toContainElement(
      getByTestId('entity-card-dragon-of-the-north')
    );
    expect(getByTestId('entity-grid')).not.toContainElement(
      getByTestId('entity-card-fortress-ironhold')
    );
  });
  
  test('Real-time entity updates', async () => {
    const mockRealtimeService = createMockRealtimeService();
    const { getByTestId } = render(
      <WorldManager realtimeService={mockRealtimeService} />
    );
    
    // Simulate entity update from another player
    act(() => {
      mockRealtimeService.simulateUpdate({
        type: 'entity_updated',
        entityId: 'test-entity-1',
        changes: { name: 'Updated Name' }
      });
    });
    
    await waitFor(() => {
      expect(getByTestId('entity-test-entity-1')).toHaveTextContent('Updated Name');
    });
  });
});
```

#### Day 5: Performance Optimization & Documentation
```javascript
// DELIVERABLE: Production-ready optimization

// src/hooks/usePerformanceOptimization.js (80 lines)
export const usePerformanceOptimization = () => {
  const [renderMetrics, setRenderMetrics] = useState({});
  
  const measureRender = useCallback((componentName, renderFunction) => {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    
    setRenderMetrics(prev => ({
      ...prev,
      [componentName]: {
        lastRenderTime: endTime - startTime,
        averageRenderTime: calculateAverage(prev[componentName], endTime - startTime)
      }
    }));
    
    return result;
  }, []);
  
  const memoizedEntityFilter = useMemo(() => 
    createOptimizedFilter(1000), // Cache up to 1000 filter combinations
    []
  );
  
  return {
    measureRender,
    renderMetrics,
    memoizedEntityFilter
  };
};

// src/utils/lazyLoading.js (60 lines)
export const createLazyComponent = (importFunction, fallback = <LoadingState />) => {
  const LazyComponent = lazy(importFunction);
  
  return (props) => (
    <Suspense fallback={fallback}>
      <ErrorBoundary>
        <LazyComponent {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

// Lazy load heavy components
export const EraFourInterface = createLazyComponent(
  () => import('../components/era-four/AgeDiscoveryInterface')
);

export const WorldManager = createLazyComponent(
  () => import('../components/world-manager/EntityManager')
);
```

### Week 12: Backend Integration & Final Polish

#### Day 1-2: API Integration
```javascript
// DELIVERABLE: Complete backend connectivity

// src/services/apiService.js (100 lines)
export class APIService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    this.setupInterceptors();
  }
  
  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authService.handleTokenExpiry();
        }
        return Promise.reject(error);
      }
    );
  }
  
  // Game session methods
  async createGame(gameData) {
    const response = await this.client.post('/games', gameData);
    return response.data;
  }
  
  async joinGame(gameId, playerData) {
    const response = await this.client.post(`/games/${gameId}/join`, playerData);
    return response.data;
  }
  
  // Element card methods
  async getElementCards(gameId, filters = {}) {
    const response = await this.client.get(`/games/${gameId}/cards`, { params: filters });
    return response.data;
  }
  
  async createElementCard(gameId, cardData) {
    const response = await this.client.post(`/games/${gameId}/cards`, cardData);
    return response.data;
  }
  
  async updateElementCard(gameId, cardId, updates) {
    const response = await this.client.put(`/games/${gameId}/cards/${cardId}`, updates);
    return response.data;
  }
  
  // AI generation methods
  async generateAIContent(templateId, inputData, context) {
    const response = await this.client.post('/ai/generate', {
      templateId,
      inputData,
      context
    });
    return response.data;
  }
  
  // Cross-player coordination
  async initiateCrossPlayerEvent(gameId, eventData) {
    const response = await this.client.post(`/games/${gameId}/cross-events`, eventData);
    return response.data;
  }
  
  async submitEventApproval(gameId, eventId, approvalData) {
    const response = await this.client.post(`/games/${gameId}/cross-events/${eventId}/approve`, approvalData);
    return response.data;
  }
}

// src/services/realtimeService.js (90 lines)
export class RealtimeService {
  constructor(gameId, playerId) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.subscriptions = new Map();
  }
  
  connect() {
    this.socket = io(process.env.REACT_APP_WEBSOCKET_URL, {
      query: { gameId: this.gameId, playerId: this.playerId }
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to game session');
      this.reconnectAttempts = 0;
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from game session');
      this.handleReconnect();
    });
    
    this.socket.on('entity_updated', (data) => {
      this.notifySubscribers('entity_updated', data);
    });
    
    this.socket.on('cross_player_event', (data) => {
      this.notifySubscribers('cross_player_event', data);
    });
    
    this.socket.on('player_status_changed', (data) => {
      this.notifySubscribers('player_status_changed', data);
    });
  }
  
  subscribe(eventType, callback) {
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, new Set());
    }
    this.subscriptions.get(eventType).add(callback);
    
    return () => {
      this.subscriptions.get(eventType)?.delete(callback);
    };
  }
  
  notifySubscribers(eventType, data) {
    const callbacks = this.subscriptions.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
  
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    }
  }
}
```

#### Day 3-4: Real-time Synchronization
```javascript
// DELIVERABLE: Seamless real-time collaboration

// src/hooks/useRealtimeSync.js (100 lines)
export const useRealtimeSync = (gameId, playerId) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [realtimeService, setRealtimeService] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  useEffect(() => {
    if (gameId && playerId) {
      const service = new RealtimeService(gameId, playerId);
      
      service.subscribe('connection_status', setConnectionStatus);
      service.subscribe('entity_updated', handleEntityUpdate);
      service.subscribe('cross_player_event', handleCrossPlayerEvent);
      
      service.connect();
      setRealtimeService(service);
      
      return () => {
        service.disconnect();
      };
    }
  }, [gameId, playerId]);
  
  const handleEntityUpdate = useCallback((updateData) => {
    setLastUpdate({
      type: 'entity_update',
      data: updateData,
      timestamp: Date.now()
    });
    
    // Dispatch to global state
    globalState.dispatch({
      type: 'SYNC_ENTITY_UPDATE',
      payload: updateData
    });
  }, []);
  
  const handleCrossPlayerEvent = useCallback((eventData) => {
    setLastUpdate({
      type: 'cross_player_event',
      data: eventData,
      timestamp: Date.now()
    });
    
    // Show notification to user
    notificationService.showCrossPlayerEvent(eventData);
  }, []);
  
  const broadcastUpdate = useCallback((entityId, changes) => {
    if (realtimeService && connectionStatus === 'connected') {
      realtimeService.broadcastEntityUpdate(entityId, changes);
    }
  }, [realtimeService, connectionStatus]);
  
  return {
    connectionStatus,
    lastUpdate,
    broadcastUpdate,
    realtimeService
  };
};

// src/components/shared/ConnectionStatus.js (60 lines)
export const ConnectionStatus = () => {
  const { connectionStatus, lastUpdate } = useRealtimeSync();
  const [showDetails, setShowDetails] = useState(false);
  
  const statusStyles = {
    connected: "bg-green-500 text-white",
    connecting: "bg-yellow-500 text-black",
    disconnected: "bg-red-500 text-white",
    reconnecting: "bg-orange-500 text-white"
  };
  
  const statusIcons = {
    connected: "🟢",
    connecting: "🟡",
    disconnected: "🔴",
    reconnecting: "🟠"
  };
  
  return (
    <div className="connection-status">
      <div 
        className={`status-indicator ${statusStyles[connectionStatus]}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <span>{statusIcons[connectionStatus]}</span>
        <span className="status-text">{connectionStatus.toUpperCase()}</span>
      </div>
      
      {showDetails && (
        <div className="connection-details">
          <div>Status: {connectionStatus}</div>
          {lastUpdate && (
            <div>
              Last Update: {new Date(lastUpdate.timestamp).toLocaleTimeString()}
              <br />
              Type: {lastUpdate.type}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

#### Day 5: Data Persistence & Recovery
```javascript
// DELIVERABLE: Robust data management

// src/services/persistenceService.js (90 lines)
export class PersistenceService {
  constructor() {
    this.storageKey = 'mappa_imperium_game_state';
    this.backupInterval = 30000; // 30 seconds
    this.maxBackups = 10;
  }
  
  saveGameState(gameState) {
    try {
      const serializedState = JSON.stringify({
        gameState,
        timestamp: Date.now(),
        version: '1.0'
      });
      
      localStorage.setItem(this.storageKey, serializedState);
      this.createBackup(serializedState);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save game state:', error);
      return { success: false, error: error.message };
    }
  }
  
  loadGameState() {
    try {
      const serializedState = localStorage.getItem(this.storageKey);
      if (!serializedState) return null;
      
      const { gameState, timestamp, version } = JSON.parse(serializedState);
      
      // Validate version compatibility
      if (!this.isVersionCompatible(version)) {
        return this.migrateGameState(gameState, version);
      }
      
      return { gameState, timestamp };
    } catch (error) {
      console.error('Failed to load game state:', error);
      return this.loadFromBackup();
    }
  }
  
  createBackup(serializedState) {
    const backups = this.getBackups();
    const newBackup = {
      timestamp: Date.now(),
      data: serializedState
    };
    
    backups.unshift(newBackup);
    
    // Keep only the most recent backups
    if (backups.length > this.maxBackups) {
      backups.splice(this.maxBackups);
    }
    
    localStorage.setItem(this.storageKey + '_backups', JSON.stringify(backups));
  }
  
  getBackups() {
    try {
      const backups = localStorage.getItem(this.storageKey + '_backups');
      return backups ? JSON.parse(backups) : [];
    } catch {
      return [];
    }
  }
  
  loadFromBackup(backupIndex = 0) {
    const backups = this.getBackups();
    if (backups[backupIndex]) {
      try {
        const backup = JSON.parse(backups[backupIndex].data);
        return backup;
      } catch (error) {
        if (backupIndex < backups.length - 1) {
          return this.loadFromBackup(backupIndex + 1);
        }
      }
    }
    return null;
  }
}

// src/hooks/useDataRecovery.js (70 lines)
export const useDataRecovery = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const persistenceService = useRef(new PersistenceService());
  
  const saveGameState = useCallback((gameState) => {
    const result = persistenceService.current.saveGameState(gameState);
    if (result.success) {
      setHasUnsavedChanges(false);
    }
    return result;
  }, []);
  
  const loadGameState = useCallback(() => {
    return persistenceService.current.loadGameState();
  }, []);
  
  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        const currentState = globalState.getState();
        saveGameState(currentState);
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [autoSaveEnabled, hasUnsavedChanges, saveGameState]);
  
  // Warn before page unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);
  
  return {
    saveGameState,
    loadGameState,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    autoSaveEnabled,
    setAutoSaveEnabled,
    getBackups: () => persistenceService.current.getBackups()
  };
};
```