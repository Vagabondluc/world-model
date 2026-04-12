> **_Note: This document details Phase 1 of the Mappa Imperium development roadmap. It describes a target architecture. The application's current implementation is detailed in the `/docs/current` directory._**

# Phase 1: Foundation & Core Eras (I-III) (Weeks 1-6)

### Week 1: Project Setup & Core Architecture

#### Day 1-2: Environment Setup
```bash
# Project initialization
npx create-react-app mappa-imperium --template typescript
cd mappa-imperium

# Essential dependencies
npm install @types/react @types/node
npm install socket.io-client  # Real-time collaboration
npm install react-router-dom  # Navigation
npm install tailwindcss       # Styling framework
npm install @testing-library/react @testing-library/jest-dom

# Development tools
npm install --save-dev eslint-plugin-max-lines-per-function
npm install --save-dev @typescript-eslint/eslint-plugin

# Configure ESLint for file size enforcement
# .eslintrc.js
module.exports = {
  rules: {
    'max-lines-per-function': ['error', { max: 200, skipComments: true }],
    'max-lines': ['error', { max: 200, skipComments: true }]
  }
};
```

#### Day 3-5: Core Component Architecture
```javascript
// DELIVERABLE: Base component structure

// src/components/layout/AppLayout.js (60 lines)
export const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <NavigationHeader />
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
    <CollaborationStatus />
  </div>
);

// src/components/navigation/NavigationHeader.js (80 lines)
export const NavigationHeader = () => {
  const { currentEra, completedEras } = useGameState();
  return (
    <nav className="bg-amber-900 text-amber-100">
      <EraSelector eras={completedEras} current={currentEra} />
      <PlayerStatus />
      <ExportOptions />
    </nav>
  );
};

// src/components/shared/LoadingState.js (40 lines)
export const LoadingState = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
);

// src/components/shared/ErrorBoundary.js (60 lines)
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Week 2: Era Interface Foundation

#### Day 1-3: Era Navigation System
```javascript
// DELIVERABLE: Era progression interface

// src/components/era-navigation/EraSelector.js (100 lines)
export const EraSelector = () => {
  const { currentEra, completedEras, canAdvance } = useGameState();
  
  const eras = [
    { id: 1, name: "Age of Creation", icon: "🌍" },
    { id: 2, name: "Age of Myth", icon: "⚡" },
    { id: 3, name: "Age of Foundation", icon: "🏛️" },
    { id: 4, name: "Age of Discovery", icon: "🗺️" },
    { id: 5, name: "Age of Empires", icon: "👑" },
    { id: 6, name: "Age of Collapse", icon: "🔥" }
  ];
  
  return (
    <div className="era-selector">
      {eras.map(era => (
        <EraButton 
          key={era.id}
          era={era}
          status={getEraStatus(era.id, currentEra, completedEras)}
          onClick={() => handleEraClick(era.id)}
        />
      ))}
    </div>
  );
};

// src/components/era-navigation/EraButton.js (80 lines)
export const EraButton = ({ era, status, onClick }) => {
  const styles = {
    completed: "bg-green-600 text-white border-green-700",
    current: "bg-amber-600 text-white border-amber-700 ring-2 ring-amber-300",
    locked: "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed",
    available: "bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
  };
  
  return (
    <button 
      className={`era-button ${styles[status]}`}
      onClick={onClick}
      disabled={status === 'locked'}
    >
      <span className="era-icon">{era.icon}</span>
      <span className="era-name">{era.name}</span>
      <EraStatusIndicator status={status} />
    </button>
  );
};
```

#### Day 4-5: Game Session Management
```javascript
// DELIVERABLE: Multi-player session system

// src/components/session/GameSession.js (120 lines)
export const GameSession = () => {
  const [sessionState, setSessionState] = useState('joining'); // joining|active|paused
  const { gameId, playerId, isHost } = useGameSession();
  
  if (sessionState === 'joining') {
    return <SessionJoinFlow onJoined={() => setSessionState('active')} />;
  }
  
  return (
    <SessionProvider gameId={gameId} playerId={playerId}>
      <AppLayout>
        <EraInterface />
      </AppLayout>
    </SessionProvider>
  );
};

// src/hooks/useGameSession.js (90 lines)
export const useGameSession = () => {
  const [sessionData, setSessionData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const joinSession = useCallback(async (gameId, playerNumber, password) => {
    try {
      const response = await sessionService.joinGame(gameId, playerNumber, password);
      setSessionData(response.sessionData);
      setConnectionStatus('connected');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);
  
  return {
    sessionData,
    connectionStatus,
    joinSession,
    leaveSession: () => setConnectionStatus('disconnected')
  };
};
```

### Week 3: Era I Implementation

#### Day 1-2: Geography Data Entry & AI Advisor
```javascript
// DELIVERABLE: Data entry interface for geography features and AI-powered placement advice. This system is designed to accept inputs from an external tabletop session (like Foundry VTT), not for visual map creation within the app.

// src/components/era-one/GeographyAdvisor.js (120 lines)
export const GeographyAdvisor = () => {
  const { landmassType, features, advice, isLoading } = useEraCreationState();

  return (
    <div className="geography-advisor">
      <p>Select landmass and geography features based on your external game rolls.</p>
      
      <FeatureSelector 
        landmassType={landmassType}
        features={features}
        onUpdate={handleFeatureUpdate}
      />

      <AIAdviceButton onClick={getAIAdvice} disabled={isLoading} />
      
      <AIAdvicePanel 
        advice={advice}
        isLoading={isLoading}
      />
    </div>
  );
};

// src/components/era-one/FeatureSelector.js (100 lines)
export const FeatureSelector = ({ features, onUpdate }) => {
  return (
    <div className="feature-selector">
      <LandmassSelector />
      {features.map(feature => (
        <GeographyFeatureInput 
          key={feature.id}
          feature={feature}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
```

#### Day 3-4: Navigation & Tab System
```javascript
// DELIVERABLE: Era I navigation and workflow management

// src/components/era-one/AgeCreationInterface.js (120 lines)
export const AgeCreationInterface = () => {
  const [currentSubTab, setCurrentSubTab] = useState('geography');
  const { geographyData, resources, isEraComplete } = useEraOneState();
  
  const subTabs = [
    { 
      id: 'geography', 
      label: 'Geography Placement',
      icon: '🏔️',
      completed: geographyData.completed
    },
    { 
      id: 'resources', 
      label: '1.4 Resources & Special Sites',
      icon: '💎',
      completed: resources.length >= 2
    }
  ];
  
  return (
    <div className="age-creation-interface">
      <EraHeader 
        title="Age of Creation"
        subtitle="Establish the physical foundation of your world"
        icon="🌍"
      />
      
      <div className="era-navigation">
        <div className="main-tabs">
          <TabButton active={true}>Gameplay</TabButton>
          <TabButton disabled={true}>Chronicle</TabButton>
          <TabButton disabled={true}>Export</TabButton>
        </div>
        
        <div className="sub-navigation">
          {subTabs.map(tab => (
            <SubTabButton 
              key={tab.id}
              tab={tab}
              active={currentSubTab === tab.id}
              onClick={() => setCurrentSubTab(tab.id)}
            />
          ))}
        </div>
      </div>
      
      <div className="era-content">
        {currentSubTab === 'geography' && (
          <GeographyWorkflow 
            data={geographyData}
            onUpdate={handleGeographyUpdate}
          />
        )}
        
        {currentSubTab === 'resources' && (
          <ResourceWorkflow 
            resources={resources}
            onResourceCreated={handleResourceCreated}
          />
        )}
      </div>
      
      <EraProgress 
        completed={isEraComplete}
        requirements={getEraRequirements()}
      />
    </div>
  );
};

// src/components/era-one/ResourceWorkflow.js (100 lines)
export const ResourceWorkflow = ({ resources, onResourceCreated }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  
  return (
    <div className="resource-workflow">
      <div className="workflow-header">
        <h3>Resources & Special Sites</h3>
        <p>Create two unique elements that make your region distinctive and valuable. These will become important for trade, conflict, and cultural development in later eras.</p>
      </div>
      
      <div className="resource-interface">
        <div className="creator-panel">
          <CustomResourceCreator 
            onResourceCreated={onResourceCreated}
            existingResources={resources}
          />
        </div>
        
        <div className="resources-panel">
          <ResourcesList 
            resources={resources}
            onResourceClick={setSelectedResource}
          />
        </div>
      </div>
      
      {selectedResource && (
        <ResourceDetailModal 
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onEdit={handleResourceEdit}
        />
      )}
      
      <WorkflowStatus 
        progress={resources.length}
        total={2}
        message={resources.length < 2 
          ? `Create ${2 - resources.length} more resource${2 - resources.length === 1 ? '' : 's'} to complete this phase`
          : 'All resources defined! Your region\'s unique elements are ready for the next era.'
        }
      />
    </div>
  );
};

// src/hooks/useEraOneState.js (80 lines)
export const useEraOneState = () => {
  const [geographyData, setGeographyData] = useState({
    landmassStructure: null,
    features: Array(8).fill(null),
    aiAdvice: null,
    completed: false
  });
  
  const [resources, setResources] = useState([]);
  
  const updateGeographyData = useCallback((updates) => {
    setGeographyData(prev => {
      const updated = { ...prev, ...updates };
      
      // Auto-mark as completed when all requirements met
      if (updated.landmassStructure && 
          updated.features.every(f => f !== null) && 
          updated.aiAdvice) {
        updated.completed = true;
      }
      
      return updated;
    });
  }, []);
  
  const addResource = useCallback((resource) => {
    setResources(prev => [...prev, resource]);
    
    // Create element card automatically
    elementCardService.createCard({
      type: 'resource',
      name: resource.name,
      properties: resource,
      era: 1,
      owner: getCurrentPlayerId()
    });
  }, []);
  
  const isEraComplete = useMemo(() => {
    return geographyData.completed && resources.length >= 2;
  }, [geographyData.completed, resources.length]);
  
  return {
    geographyData,
    resources,
    updateGeographyData,
    addResource,
    isEraComplete
  };
};
```

#### Day 5: Element Card Integration
```javascript
// DELIVERABLE: Automatic element card generation from Era I activities

// src/services/elementCardService.js (120 lines)
export class ElementCardService {
  constructor(apiService, realtimeService) {
    this.api = apiService;
    this.realtime = realtimeService;
  }
  
  async createCard(cardData) {
    try {
      const newCard = await this.api.createElementCard(cardData);
      
      // Broadcast to other players in real-time
      this.realtime.broadcast('card_created', newCard);
      
      return newCard;
    } catch (error) {
      console.error('Failed to create element card:', error);
      // Handle error, maybe show notification to user
      return null;
    }
  }
  
  // Method to create geography card
  createGeographyCard(geographyType, landmass, player) {
    const cardData = {
      type: 'location',
      name: `${landmass}'s ${geographyType}`,
      description: `A region of ${geographyType.toLowerCase()} located on the ${landmass.toLowerCase()}.`,
      era: 1,
      owner: player.id,
      tags: ['geography', geographyType.toLowerCase()]
    };
    
    return this.createCard(cardData);
  }
  
  // Method to create resource card
  createResourceCard(resource, player) {
    const cardData = {
      type: 'resource',
      name: resource.name,
      description: resource.properties,
      era: 1,
      owner: player.id,
      tags: ['resource', resource.type]
    };
    
    return this.createCard(cardData);
  }
}

// src/hooks/useEraOneState.js (UPDATED)
export const useEraOneState = () => {
  // ... existing state
  
  const addResource = useCallback((resource) => {
    setResources(prev => [...prev, resource]);
    
    // Auto-generate element card
    elementCardService.createResourceCard(resource, getCurrentPlayer());
  }, []);
  
  // ... other logic
};
```

### Week 4: World Manager Foundation

#### Day 1-5: Enhanced Element Manager System
```javascript
// DELIVERABLE: Core element management UI with filtering, search, and multiple views.

// src/components/world-manager/ElementManager.js (180 lines)
export const ElementManager = () => {
  const { elements, players, currentPlayer, gameRole } = useGameState();
  const [modalElement, setModalElement] = useState(null);
  
  // State for new features
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [filterEra, setFilterEra] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredElements = useMemo(() => 
    filterElements(elements, { searchTerm, filterOwner, filterEra, filterType }),
    [elements, searchTerm, filterOwner, filterEra, filterType]
  );
  
  return (
    <div className="element-manager">
      <header>
        <h1>Element Manager</h1>
      </header>
      
      {/* Filter and View Controls */}
      <div className="filter-bar">
        <input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)}>
          {/* Options for players */}
        </select>
        <select value={filterEra} onChange={e => setFilterEra(e.target.value)}>
          {/* Options for eras */}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          {/* Options for element types */}
        </select>
        <button onClick={() => setViewMode('grid')}>Grid</button>
        <button onClick={() => setViewMode('list')}>List</button>
      </div>

      {viewMode === 'grid' ? (
        <div className="element-grid">
          {filteredElements.map(card => (
            <ElementCardDisplay 
              key={card.id} 
              card={card} 
              onView={() => openModal(card, true)}
              onEdit={() => openModal(card, false)}
            />
          ))}
        </div>
      ) : (
        <div className="element-list">
           {filteredElements.map(card => (
            <ElementListRow 
              key={card.id} 
              card={card} 
              onView={() => openModal(card, true)}
              onEdit={() => openModal(card, false)}
            />
          ))}
        </div>
      )}
      
      {modalElement && (
        <EditElementModal 
          element={modalElement.element}
          isReadOnly={modalElement.isReadOnly}
          onClose={() => setModalElement(null)}
        />
      )}
    </div>
  );
};

// src/components/world-manager/ElementCardDisplay.js (100 lines)
export const ElementCardDisplay = ({ card, onView, onEdit, onDelete }) => {
  // ... Card rendering logic ...
  const canEdit = usePermissions(card);

  return (
    <div className="element-card">
      {/* ... card content ... */}
      <div className="actions-dropdown">
        <button onClick={onView}>View</button>
        {canEdit && <button onClick={onEdit}>Edit</button>}
        {canEdit && <button onClick={onDelete}>Delete</button>}
        <button onClick={() => exportAsHTML(card)}>Export HTML</button>
        <button onClick={() => exportAsMarkdown(card)}>Export Markdown</button>
      </div>
    </div>
  );
};
```

### Week 5: Era II - Age of Myth

#### Day 1-2: Era II - Age of Myth Complete
```javascript
// DELIVERABLE: Complete Era II interface

// src/components/era-two/AgeMythInterface.js (150 lines)
export const AgeMythInterface = () => {
  const { 
    pantheonState, 
    currentStep, 
    canAdvance 
  } = useEraTwoState();
  
  const steps = [
    { id: 'deity_count', name: 'Determine Deity Count', component: DeityCountSelector },
    { id: 'deity_creation', name: 'Create Deities', component: DeityCreationWizard },
    { id: 'sacred_sites', name: 'Place Sacred Sites', component: SacredSitePlacer },
    { id: 'pantheon_review', name: 'Review Pantheon', component: PantheonReview }
  ];
  
  const CurrentStepComponent = steps.find(s => s.id === currentStep)?.component;
  
  return (
    <div className="age-myth-interface">
      <EraHeader 
        title="Age of Myth"
        subtitle="Create the divine forces that shape your world"
        icon="⚡"
      />
      
      <ProgressStepper 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />
      
      <div className="era-content">
        <CurrentStepComponent 
          pantheonState={pantheonState}
          onUpdate={handlePantheonUpdate}
        />
      </div>
      
      <EraNavigation 
        canAdvance={canAdvance}
        onAdvance={handleAdvanceEra}
        onBack={handleBackStep}
      />
    </div>
  );
};

// src/components/era-two/DeityCreationWizard.js (130 lines)
export const DeityCreationWizard = ({ pantheonState, onUpdate }) => {
  const [currentDeityIndex, setCurrentDeityIndex] = useState(0);
  const [deityInProgress, setDeityInProgress] = useState(null);
  
  const totalDeities = pantheonState.deityCount;
  const completedDeities = pantheonState.deities.length;
  
  return (
    <div className="deity-creation-wizard">
      <WizardProgress 
        current={currentDeityIndex + 1}
        total={totalDeities}
        completed={completedDeities}
      />
      
      <DeityBuilder 
        deity={deityInProgress}
        onUpdate={setDeityInProgress}
        existingDeities={pantheonState.deities}
      />
      
      <AIDeityGenerator 
        domain={deityInProgress?.domain}
        symbol={deityInProgress?.symbol}
        existingDeities={pantheonState.deities}
        onGenerated={handleAIGenerated}
      />
      
      <WizardNavigation 
        onNext={handleNextDeity}
        onPrevious={handlePreviousDeity}
        onSave={handleSaveDeity}
        canProceed={isDeityComplete(deityInProgress)}
      />
    </div>
  );
};
```

### Week 6: Era III - Age of Foundation

#### Day 3-4: Era III - Age of Foundation
```javascript
// DELIVERABLE: Complete Era III interface

// src/components/era-three/AgeFoundationInterface.js (140 lines)
export const AgeFoundationInterface = () => {
  const { factionState, currentPhase } = useEraThreeState();
  
  const phases = [
    { id: 'prime_faction', name: 'Create Prime Faction', component: PrimeFactionBuilder },
    { id: 'faction_development', name: 'Develop Culture', component: FactionDevelopmentSuite },
    { id: 'neighbors', name: 'Place Neighbors', component: NeighborPlacer },
    { id: 'early_settlements', name: 'Early Settlements', component: SettlementBuilder },
    { id: 'foundation_review', name: 'Review Foundation', component: FoundationReview }
  ];
  
  const CurrentPhaseComponent = phases.find(p => p.id === currentPhase)?.component;
  
  return (
    <div className="age-foundation-interface">
      <EraHeader 
        title="Age of Foundation"
        subtitle="Establish your empire and shape early civilization"
        icon="🏛️"
      />
      
      <PhaseTracker 
        phases={phases}
        currentPhase={currentPhase}
        factionProgress={factionState.completionStatus}
      />
      
      <div className="era-content">
        <CurrentPhaseComponent 
          factionState={factionState}
          onUpdate={handleFactionUpdate}
        />
      </div>
      
      <CrossPlayerCoordination 
        visibleBorders={getNearbyPlayers()}
        sharedElements={getSharedElements()}
      />
    </div>
  );
};

// src/components/era-three/FactionDevelopmentSuite.js (150 lines)
export const FactionDevelopmentSuite = ({ factionState, onUpdate }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [developmentStep, setDevelopmentStep] = useState('theme_selection');
  const { generate, loading, result } = useAIGeneration();
  
  const generateThemeOptions = async () => {
    const context = {
      race: factionState.race,
      symbol: factionState.symbol,
      colors: factionState.colors,
      geographicContext: getPlayerRegionContext(),
      gamePhase: 'faction_development'
    };
    
    const themes = await generate('faction_theme_development', {
      race: factionState.race,
      symbol: factionState.symbol,
      color: factionState.primaryColor
    }, context);
    
    return themes;
  };
  
  return (
    <div className="faction-development-suite">
      {developmentStep === 'theme_selection' && (
        <ThemeSelectionPanel 
          onGenerateOptions={generateThemeOptions}
          onThemeSelected={setSelectedTheme}
          loading={loading}
          options={result?.themeOptions || []}
        />
      )}
      
      {developmentStep === 'leadership' && (
        <LeadershipBuilder 
          theme={selectedTheme}
          onLeadershipDefined={handleLeadershipComplete}
        />
      )}
      
      {developmentStep === 'naming' && (
        <NamingConventions 
          theme={selectedTheme}
          onNamingComplete={handleNamingComplete}
        />
      )}
      
      <DevelopmentProgress 
        currentStep={developmentStep}
        onStepChange={setDevelopmentStep}
        completed={factionState.developmentCompleted}
      />
    </div>
  );
};
```