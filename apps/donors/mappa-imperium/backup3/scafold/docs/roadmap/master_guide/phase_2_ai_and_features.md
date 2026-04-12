> **_Note: This document details Phase 2 (Weeks 7-10) of the Mappa Imperium development roadmap. It describes a target architecture. The application's current implementation is detailed in the `/docs/current` directory._**

# Phase 2: Advanced Eras & Collaboration (IV-VI) (Weeks 7-10)

### Week 7: AI Integration & Cross-Player Coordination

#### Day 1-2: AI Template System
```javascript
// DELIVERABLE: AI template integration

// src/services/aiTemplateService.js (100 lines)
export class AITemplateService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.templates = new Map();
  }
  
  async loadTemplate(templateId) {
    if (!this.templates.has(templateId)) {
      const template = await this.fetchTemplate(templateId);
      this.templates.set(templateId, template);
    }
    return this.templates.get(templateId);
  }
  
  async generateContent(templateId, inputData, context) {
    const template = await this.loadTemplate(templateId);
    const prompt = this.buildPrompt(template, inputData, context);
    
    try {
      const response = await this.callAI(prompt);
      return this.parseResponse(response, template);
    } catch (error) {
      console.error('AI generation failed:', error);
      return this.getFallbackContent(templateId, inputData);
    }
  }
  
  buildPrompt(template, inputData, context) {
    // Construct context-aware prompt from template and inputs
    return `${template.systemPrompt}\n\nContext: ${JSON.stringify(context)}\nInput: ${JSON.stringify(inputData)}`;
  }
}

// src/hooks/useAIGeneration.js (90 lines)
export const useAIGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const generate = useCallback(async (templateId, inputData, context) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiTemplateService.generateContent(
        templateId, 
        inputData, 
        context
      );
      setResult(response);
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    generate,
    loading,
    error,
    result,
    clearResult: () => setResult(null)
  };
};
```

#### Day 3-5: Cross-Player Coordination System
```javascript
// DELIVERABLE: Real-time collaboration framework

// src/components/collaboration/CrossPlayerManager.js (150 lines)
export const CrossPlayerManager = () => {
  const { 
    activeEvents, 
    pendingApprovals, 
    nearbyPlayers 
  } = useCrossPlayerState();
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  return (
    <div className="cross-player-manager">
      <CollaborationHeader 
        onlineStatus={getOnlineStatus()}
        gamePhase={getCurrentGamePhase()}
      />
      
      <div className="collaboration-content">
        <PendingApprovals 
          approvals={pendingApprovals}
          onApprove={handleApproval}
          onReject={handleRejection}
        />
        
        <ActiveEvents 
          events={activeEvents}
          onEventClick={setSelectedEvent}
        />
        
        <NearbyPlayerActivity 
          players={nearbyPlayers}
          onInitiateCollaboration={handleCollaborationRequest}
        />
      </div>
      
      {selectedEvent && (
        <EventCoordinationModal 
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onCoordinate={handleEventCoordination}
        />
      )}
    </div>
  );
};

// src/hooks/useCrossPlayerState.js (100 lines)
export const useCrossPlayerState = () => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const { realtimeConnection } = useRealtimeSync();
  
  useEffect(() => {
    if (!realtimeConnection) return;
    
    const unsubscribeEvents = realtimeConnection.subscribe(
      'cross_player_events',
      (events) => setActiveEvents(events)
    );
    
    const unsubscribeApprovals = realtimeConnection.subscribe(
      'pending_approvals',
      (approvals) => setPendingApprovals(approvals)
    );
    
    return () => {
      unsubscribeEvents();
      unsubscribeApprovals();
    };
  }, [realtimeConnection]);
  
  const initiateEvent = useCallback(async (eventType, eventData) => {
    try {
      const result = await crossPlayerService.initiateEvent(eventType, eventData);
      return { success: true, eventId: result.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);
  
  return {
    activeEvents,
    pendingApprovals,
    initiateEvent,
    nearbyPlayers: getNearbyPlayers()
  };
};

// src/components/collaboration/WarCoordination.js (120 lines)
export const WarCoordination = ({ warEvent, onComplete }) => {
  const [battleInput, setBattleInput] = useState({
    tactics: '',
    forces: '',
    objectives: ''
  });
  const [opponentInput, setOpponentInput] = useState(null);
  const { generate, loading } = useAIGeneration();
  
  const submitBattleInput = async () => {
    const battleContext = {
      attacker: warEvent.attacker,
      defender: warEvent.defender,
      battleground: warEvent.location,
      gamePhase: 'war_resolution'
    };
    
    const result = await crossPlayerService.submitWarInput(
      warEvent.id,
      battleInput
    );
    
    if (result.allInputsReceived) {
      await generateBattleResolution(result.combinedInputs);
    }
  };
  
  const generateBattleResolution = async (combinedInputs) => {
    const battleChronicle = await generate('battle_chronicle', {
      attacker_input: combinedInputs.attacker,
      defender_input: combinedInputs.defender,
      battle_context: warEvent
    }, { gamePhase: 'war_resolution' });
    
    onComplete(battleChronicle);
  };
  
  return (
    <div className="war-coordination">
      <BattleContextPanel battle={warEvent} />
      
      <div className="battle-input-section">
        <BattleInputForm 
          input={battleInput}
          onChange={setBattleInput}
          onSubmit={submitBattleInput}
          loading={loading}
        />
        
        {opponentInput && (
          <OpponentInputPreview input={opponentInput} />
        )}
      </div>
      
      <CoordinationStatus 
        event={warEvent}
        playerSubmitted={!!battleInput.submitted}
      />
    </div>
  );
};
```

### Week 8: Era IV - Age of Discovery
```javascript
// DELIVERABLE: Dynamic discovery system

// src/components/era-four/AgeDiscoveryInterface.js (140 lines)
export const AgeDiscoveryInterface = () => {
  const { 
    discoveryState, 
    currentTurn, 
    worldState 
  } = useEraFourState();
  
  return (
    <div className="age-discovery-interface">
      <EraHeader 
        title="Age of Discovery"
        subtitle="Explore the world and expand your empire"
        icon="🗺️"
      />
      
      <DiscoveryProgress 
        currentTurn={currentTurn}
        totalTurns={6}
        discoveries={discoveryState.completedDiscoveries}
      />
      
      <DiscoveryEngine 
        worldState={worldState}
        onDiscovery={handleDiscovery}
        onEventGenerated={handleEventGeneration}
      />
      
      <WorldStateViewer 
        entities={worldState.allEntities}
        recentChanges={discoveryState.recentChanges}
      />
    </div>
  );
};

// src/components/era-four/DiscoveryEngine.js (130 lines)
export const DiscoveryEngine = ({ worldState, onDiscovery, onEventGenerated }) => {
  const [currentRoll, setCurrentRoll] = useState(null);
  const [eventInProgress, setEventInProgress] = useState(false);
  const { generate, loading } = useAIGeneration();
  
  const rollDiscovery = () => {
    const roll = rollDice(3); // 3d6 for discovery
    const eventType = getDiscoveryEventType(roll);
    setCurrentRoll({ dice: roll, eventType });
  };
  
  const processDiscoveryEvent = async (eventType) => {
    setEventInProgress(true);
    
    const context = {
      factionState: worldState.playerFaction,
      worldHistory: worldState.chronicledEvents,
      neighboringFactions: worldState.neighbors,
      recentEvents: worldState.recentEvents,
      gamePhase: 'discovery'
    };
    
    const eventResult = await generate('discovery_event_processing', {
      event_type: eventType,
      faction_context: context.factionState,
      world_context: context
    }, context);
    
    if (eventResult) {
      const generatedEntities = extractEntitiesFromEvent(eventResult);
      onEventGenerated(eventResult, generatedEntities);
    }
    
    setEventInProgress(false);
    setCurrentRoll(null);
  };
  
  return (
    <div className="discovery-engine">
      <DiscoveryRoller 
        onRoll={rollDiscovery}
        currentRoll={currentRoll}
        processing={eventInProgress}
      />
      
      {currentRoll && (
        <EventProcessor 
          eventType={currentRoll.eventType}
          onProcess={() => processDiscoveryEvent(currentRoll.eventType)}
          loading={loading}
        />
      )}
      
      <DiscoveryHistory 
        events={worldState.discoveryHistory}
        onEventClick={handleEventReview}
      />
    </div>
  );
};

// src/utils/entityExtraction.js (80 lines)
export const extractEntitiesFromEvent = (eventResult) => {
  const entities = [];
  
  // Extract named characters
  const characterMatches = eventResult.content.match(/([A-Z][a-z]+ [A-Z][a-z]+)/g) || [];
  characterMatches.forEach(name => {
    if (!isCommonPhrase(name)) {
      entities.push({
        type: 'character',
        name: name.trim(),
        source: 'ai_generated',
        context: eventResult.eventType
      });
    }
  });
  
  // Extract named locations
  const locationMatches = eventResult.content.match(/((?:Mount|Lake|River|Forest|City|Town|Fort) [A-Z][a-z]+)/g) || [];
  locationMatches.forEach(location => {
    entities.push({
      type: 'location',
      name: location.trim(),
      source: 'ai_generated',
      context: eventResult.eventType
    });
  });
  
  // Extract significant events
  if (eventResult.eventName) {
    entities.push({
      type: 'event',
      name: eventResult.eventName,
      description: eventResult.content,
      source: 'ai_generated',
      era: 4
    });
  }
  
  return entities;
};
```

### Week 9: Era V - Age of Empires
```javascript
// DELIVERABLE: Empire-scale management

// src/components/era-five/AgeEmpiresInterface.js (150 lines)
export const AgeEmpiresInterface = () => {
  const { 
    empireState, 
    globalEvents, 
    neighborDevelopment 
  } = useEraFiveState();
  
  return (
    <div className="age-empires-interface">
      <EraHeader 
        title="Age of Empires"
        subtitle="Flex imperial might across the known world"
        icon="👑"
      />
      
      <EmpireOverview 
        empire={empireState}
        globalInfluence={calculateGlobalInfluence(empireState)}
      />
      
      <GlobalEventEngine 
        empireState={empireState}
        onEmpireEvent={handleEmpireEvent}
        availableTargets={getAllValidTargets()}
      />
      
      <NeighborDevelopmentTracker 
        neighbors={neighborDevelopment}
        onNeighborUpdate={handleNeighborUpdate}
      />
      
      <DiplomaticOverview 
        relationships={empireState.diplomaticRelations}
        onDiplomaticAction={handleDiplomaticAction}
      />
    </div>
  );
};

// src/components/era-five/GlobalEventEngine.js (140 lines)
export const GlobalEventEngine = ({ empireState, onEmpireEvent, availableTargets }) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventResult, setEventResult] = useState(null);
  const { generate, loading } = useAIGeneration();
  
  const rollEmpireEvent = () => {
    const roll = rollDice(3); // 3d6 for empire events
    const eventType = getEmpireEventType(roll);
    setCurrentEvent({ roll, eventType });
  };
  
  const processEmpireEvent = async (eventType) => {
    const context = {
      empireState: empireState,
      globalSituation: getGlobalSituation(),
      availableTargets: availableTargets,
      gamePhase: 'empire_expansion'
    };
    
    const result = await generate('empire_event_chronicle', {
      event_type: eventType,
      empire_state: empireState,
      global_context: context
    }, context);
    
    if (result) {
      setEventResult(result);
      onEmpireEvent(result);
    }
  };
  
  return (
    <div className="global-event-engine">
      <EmpireEventRoller 
        onRoll={rollEmpireEvent}
        currentEvent={currentEvent}
        loading={loading}
      />
      
      {currentEvent && (
        <EventContextPanel 
          eventType={currentEvent.eventType}
          empireState={empireState}
          onProcess={() => processEmpireEvent(currentEvent.eventType)}
        />
      )}
      
      {eventResult && (
        <EventResultDisplay 
          result={eventResult}
          onAccept={handleAcceptEvent}
          onModify={handleModifyEvent}
        />
      )}
    </div>
  );
};
```

### Week 10: Era VI - Age of Collapse
```javascript
// DELIVERABLE: Transformation and legacy system

// src/components/era-six/AgeCollapseInterface.js (140 lines)
export const AgeCollapseInterface = () => {
  const { 
    collapseState, 
    iconicLandmarks, 
    worldOmen 
  } = useEraSixState();
  
  return (
    <div className="age-collapse-interface">
      <EraHeader 
        title="Age of Collapse"
        subtitle="Witness transformation and preserve legacy"
        icon="🔥"
      />
      
      <CollapseProgress 
        currentTurn={collapseState.currentTurn}
        totalTurns={5}
        transformations={collapseState.transformations}
      />
      
      <TransformationEngine 
        empireState={collapseState.empireState}
        onTransformation={handleTransformation}
      />
      
      <IconicLandmarkSelector 
        availableSites={getAllSignificantSites()}
        selectedLandmarks={iconicLandmarks}
        onLandmarkDesignated={handleLandmarkDesignation}
      />
      
      {collapseState.currentTurn === 5 && (
        <WorldOmenGenerator 
          worldState={getCompleteWorldState()}
          onOmenGenerated={handleWorldOmen}
        />
      )}
    </div>
  );
};

// src/components/era-six/TransformationEngine.js (120 lines)
export const TransformationEngine = ({ empireState, onTransformation }) => {
  const [currentCollapse, setCurrentCollapse] = useState(null);
  const [transformationResult, setTransformationResult] = useState(null);
  const { generate, loading } = useAIGeneration();
  
  const rollCollapseEvent = () => {
    const roll = rollDice(3); // 3d6 for collapse
    const collapseType = getCollapseEventType(roll);
    setCurrentCollapse({ roll, collapseType });
  };
  
  const processTransformation = async (collapseType) => {
    const context = {
      empireState: empireState,
      worldHistory: getCompleteWorldHistory(),
      vulnerabilities: identifyEmpireVulnerabilities(empireState),
      remainingStrengths: identifyEmpireStrengths(empireState),
      gamePhase: 'transformation'
    };
    
    const result = await generate('collapse_transformation', {
      collapse_type: collapseType,
      empire_vulnerabilities: context.vulnerabilities,
      remaining_strengths: context.remainingStrengths
    }, context);
    
    if (result) {
      setTransformationResult(result);
      onTransformation(result);
    }
  };
  
  return (
    <div className="transformation-engine">
      <CollapseRoller 
        onRoll={rollCollapseEvent}
        currentEvent={currentCollapse}
        loading={loading}
      />
      
      {currentCollapse && (
        <TransformationProcessor 
          collapseType={currentCollapse.collapseType}
          empireState={empireState}
          onProcess={() => processTransformation(currentCollapse.collapseType)}
        />
      )}
      
      {transformationResult && (
        <TransformationDisplay 
          result={transformationResult}
          onAccept={handleAcceptTransformation}
        />
      )}
    </div>
  );
};
```