# Mappa Imperium - Updated Design Brief with AI Template Integration

## Visual Consistency & Style Guide
To ensure a consistent and high-quality user experience, all UI development must adhere to the official project style guide. This document codifies our color palette, typography, and component standards.
**Reference**: [Project Style Guide](./current/style_guide.md)

## AI Guidance Integration Strategy - REVISED

### Template-Based Frontend Implementation

#### Template Input Form Generation

**Dynamic Form Creation**:
**Code Review Checklist for File Size Management**:

- [ ] **Line Count Check**: Every PR must include file line counts
- [ ] **Decomposition Review**: Files >200 lines require decomposition plan
- [ ] **Rejection Policy**: Files >300 lines automatically rejected
- [ ] **Refactoring Required**: Flag files approaching 250 lines for refactoring
- [ ] **Documentation**: Each file should have clear purpose documented in header
  **Common File Size Violations and Solutions**:
  
  ```javascript
  // VIOLATION: Large component with multiple concerns
  const EraManager = () => {
  // State management (50 lines)
  const [currentEra, setCurrentEra] = useState(1);
  const [players, setPlayers] = useState([]);
  // ... lots of state
  ```

// API calls (80 lines)
 const saveEraData = async () => { /* ... */ };
 const loadEraData = async () => { /* ... */ };
 // ... many API functions

// Event handlers (70 lines)
 const handleEraChange = () => { /* ... */ };
 const handlePlayerUpdate = () => { /* ... */ };
 // ... many handlers

// Validation logic (60 lines)
 const validateEraProgression = () => { /* ... */ };
 const checkPlayerPermissions = () => { /* ... */ };
 // ... validation functions

// Render logic (100 lines)
 return (
 <div>
 {/* complex JSX */}
 </div>
 );
}; // TOTAL: 360 lines - TOO LARGE!
// SOLUTION: Decompose into focused files
// components/EraManager/index.js (40 lines)
const EraManager = () => {
 return (
 <EraProvider>
 <EraNavigation />
 <PlayerStatus />
 <EraContent />
 </EraProvider>
 );
};
// hooks/useEraData.js (90 lines)
export const useEraData = () => {
 // All era-related state and API calls
};
// hooks/usePlayerManagement.js (80 lines)
export const usePlayerManagement = () => {
 // All player-related logic
};
// utils/eraValidation.js (70 lines)
export const validateEraProgression = () => {
 // Validation logic only
};
// components/EraManager/EraNavigation.js (60 lines)
export const EraNavigation = () => {
 // Navigation UI only
};

```
**Template-Specific File Size Guidelines**:
```javascript
// For AI Template Integration Components
// Template Form Components: Max 150 lines
const DeityCreationForm = () => {
 // Focus only on form UI and basic validation
 // Extract complex logic to hooks
};
// Template Response Display: Max 100 lines
const DeityProfileDisplay = ({ deity }) => {
 // Focus only on rendering deity data
 // Extract formatting to utils
};
// Template Processing Hooks: Max 120 lines
const useDeityTemplate = () => {
 // Handle template-specific logic only
 // Extract general template logic to base hook
};
// Template Validation Utils: Max 80 lines
export const validateDeityResponse = (response) => {
 // Focus on single template validation
 // Extract common validation to shared utils
};
```

**File Organization Strategy**:

```
features/
├── deity-creation/ # Feature-based organization
│ ├── components/
│ │ ├── DeityForm.js # 80 lines - form UI only
│ │ ├── ProfilePreview.js # 60 lines - preview display
│ │ └── ValidationPanel.js # 50 lines - validation UI
│ ├── hooks/
│ │ ├── useDeityCreation.js # 100 lines - creation logic
│ │ └── useDeityValidation.js # 80 lines - validation logic
│ ├── utils/
│ │ ├── deityFormatters.js # 60 lines - formatting only
│ │ └── deityConstants.js # 40 lines - constants only
│ └── index.js # 20 lines - feature exports
```

**Enforcement Strategies**:

- **ESLint Rule**: Configure max-lines rule to 300 with warnings at 200
- **Pre-commit Hooks**: Automatically check file sizes before commit
- **CI/CD Integration**: Fail builds with files >300 lines
- **Code Review Template**: Include file size checklist in PR template
- **Refactoring Sprints**: Regular sprints dedicated to file size cleanup
  **When Files Can Exceed 200 Lines**:
- **Configuration Files**: Large config objects (still cap at 300)
- **Type Definitions**: Complex TypeScript interfaces (extract to .d.ts files)
- **Test Files**: Comprehensive test suites (break into describe blocks in separate files)
- **Generated Code**: Auto-generated files (exclude from linting)
  **Monthly File Size Audit Process**:

- [ ] Run automated file size report
- [ ] Identify files >250 lines for priority refactoring
- [ ] Create decomposition tickets for large files
- [ ] Review component architecture for optimization opportunities
- [ ] Update coding guidelines based on patterns foundjavascript
  // Create reusable template form generator
  const TemplateForm = ({ templateId, onSubmit }) => {
  const template = useTemplate(templateId);
  const [formData, setFormData] = useState({});

return (
 <form onSubmit={(e) => handleSubmit(e, template, formData)}>
 {template.requiredInputs.map(input => (
 <DynamicInput 
key={input.name}
 type={input.type}
 label={input.label}
 validation={input.validation}
 value={formData[input.name]}
 onChange={(value) => updateFormData(input.name, value)}
 />
 ))}
 </form>
 );
};

```
#### AI Response Display System
**Structured Response Components**:
```javascript
// Template-aware response renderer
const TemplateResponse = ({ response, templateType }) => {
 const ResponseComponent = useMemo(() => {
 switch(templateType) {
 case 'deity-creation': return DeityProfileDisplay;
 case 'faction-development': return FactionThemeDisplay;
 case 'battle-chronicle': return BattleNarrativeDisplay;
 default: return GenericResponseDisplay;
 }
 }, [templateType]);

return <ResponseComponent data={response} />;
};
```

#### Cross-Template Continuity Tracking

```javascript
// Narrative continuity state management
const useContinuityTracking = () => {
 const [characters] = useSelector(state => state.entities.characters);
 const [locations] = useSelector(state => state.entities.locations);
 const [events] = useSelector(state => state.entities.events);

const findReferences = useCallback((entityId, entityType) => {
 // Find all cross-references to this entity
 return {
 appearances: findEntityAppearances(entityId, entityType),
 relationships: findEntityRelationships(entityId),
 causality: findCausalityChains(entityId)
 };
 }, [characters, locations, events]);

return { findReferences };
};
```

### Core UI Component Specifications

#### Progress Tracker (`CompletionTracker.tsx`)
- **Main View**: The main progress bar must always represent the overall group progress for the current era. It should be explicitly labeled "Overall Progress: [Era Name]".
- **Turn-Based Era Display**: For eras where progress is measured in turns (IV, V, VI), the expanded player detail view must show the count clearly, e.g., "Era IV Progress (Turn 3 of 6)". This makes the connection between creating an element and completing a turn explicit.
- **Tooltip**: The main progress bar should have a tooltip explaining that it shows the combined progress of all players for the current era.

### Component Development Checklist

#### Era I: Age of Creation Components

- [ ] **FeatureSelector**: Input interface for dice roll results from external sessions
- [ ] **LandmassSelector**: Dropdown selection for island structure types
- [ ] **AIAdvicePanel**: Holistic geography placement guidance generation
- [ ] **CustomResourceCreator**: Form-based unique resource definition interface
- [ ] **ResourcesList**: Display and management of created resources
- [ ] **EmojiPicker**: Symbol selection interface for resource map representation
  
  #### Era II: Age of Myth Components
- [ ] **DeityCreationWizard**: Template `2_1_god-prompt-template.md` implementation
- [ ] **PantheonRelationshipMapper**: Deity interaction visualization
- [ ] **SacredSitePlacement**: Location-aware site positioning
- [ ] **CulturalConsistencyChecker**: Name and theme validation
- [ ] **PantheonExportView**: Complete mythology documentation
  
  #### Era III: Age of Foundation Components
- [ ] **FactionDevelopmentSuite**: Template `3_1_faction-prompt-revised.md` integration
- [ ] **HeroLocationCreator**: Template `3_2_hero-location-prompt.md` implementation
- [ ] **SettlementBuilder**: Template `4_23_settlement-prompt.md` integration
- [ ] **NeighborRelationshipManager**: Border-aware faction placement
- [ ] **TradeRouteVisualizer**: Connection logic between settlements
  
  #### Era IV-VI: Event-Driven Components
- [ ] **DiscoveryEventProcessor**: Template `4_1_discovery-prompts.md` integration
- [ ] **LandmarkGenerator**: Template `4_2_landmark-prompt.md` implementation
- [ ] **EmpireEventChronicler**: Template `5_1_empire-events-prompts.md` integration
- [ ] **CollapseNarrativeBuilder**: Template `6_1_collapse-prompt.md` integration
- [ ] **BattleChronicleSystem**: Template `Z_battle-chronicle-prompt.md` integration
  
  #### Cross-Era Systems
- [ ] **WorldStateManager**: Central entity relationship tracking
- [ ] **ChronicleSystem**: Template-generated narrative compilation
- [ ] **ExportEngine**: Multi-format output (HTML, JSON, Foundry)
- [ ] **QualityValidationSystem**: Template compliance checking
- [ ] **ContinuityTracker**: Cross-template reference management
  
  ### Data Architecture Implementation
  
  #### Entity Relationship Schema
  
  ```javascript
  // Template-aware entity structure
  const EntitySchema = {
  id: 'string',
  type: 'faction' | 'settlement' | 'deity' | 'event' | 'character' | 'location',
  owner: 'player1-8',
  era: 1-6,
  templateGenerated: {
  templateId: 'string',
  inputData: 'object',
  generatedContent: 'object',
  version: 'string'
  },
  relationships: [{
  targetId: 'string',
  type: 'causal' | 'cultural' | 'geographic' | 'political',
  strength: 1-10,
  description: 'string'
  }],
  narrative: {
  chronicle: 'string',
  keyEvents: ['string'],
  futureHooks: ['string']
  }
  };
  ```
  
  #### Template Response Processing
  
  ```javascript
  // Structured template response handler
  const processTemplateResponse = (templateId, response) => {
  const parser = getTemplateParser(templateId);
  const extracted = parser.extractEntities(response);
  ```

return {
 primaryEntity: extracted.main,
 relatedEntities: extracted.secondary,
 narrativeElements: extracted.chronicle,
 relationships: extracted.connections,
 futureImplications: extracted.hooks
 };
};

```
### Quality Assurance Implementation
#### Template Compliance Validation
```javascript
// Automated quality checking
const validateTemplateCompliance = (templateId, response) => {
 const requirements = getTemplateRequirements(templateId);
 const checks = {
 hasOriginalNames: checkNameOriginality(response),
 hasSpecificDetails: checkDetailSpecificity(response),
 hasCausality: checkCauseEffectRelations(response),
 hasCulturalIntegration: checkCulturalConsistency(response),
 hasNarrativeContinuity: checkContinuityReferences(response)
 };

return {
 passed: Object.values(checks).every(Boolean),
 details: checks,
 suggestions: generateImprovements(checks, requirements)
 };
};
```

#### Real-Time Collaboration Features

- [ ] **WebSocket Integration**: Live synchronization of all changes
- [ ] **Conflict Resolution**: Automatic merge strategies for simultaneous edits
- [ ] **Permission Enforcement**: Template-aware edit restrictions
- [ ] **Change Broadcasting**: Notify affected players of related updates
- [ ] **Version Control**: Complete audit trail of all modifications
  
  ### Testing Strategy
  
  #### Component Testing
  
  ```javascript
  // Template-specific component tests
  describe('DeityCreationWizard', () => {
  it('generates valid deity profiles from template', () => {
  const input = { domain: 'war', symbol: 'hammer' };
  const result = renderDeityCreation(input);
  expect(result).toMatchTemplateSchema('2_1_god-prompt-template');
  });
  ```

it('maintains cultural consistency across generations', () => {
 const faction = { theme: 'mountain-dwellers', culture: 'forge-masters' };
 const deity = generateDeity(faction);
 expect(deity.culturalAlignment).toBeConsistentWith(faction);
 });
});

```

#### Integration Testing

- [ ] **Cross-Template Continuity**: Verify entities persist correctly across eras
- [ ] **Real-Time Sync**: Test multi-player collaboration scenarios
- [ ] **Export Functionality**: Validate all output formats
- [ ] **Performance Under Load**: Test with maximum entity counts
- [ ] **Template Compliance**: Automated validation of all AI-generated content
  This comprehensive implementation guide ensures the frontend development maintains the structured narrative approach defined by your AI templates while following modern React.js best practices.