> **_Note: This document describes the aspirational, long-term vision for Mappa Imperium's developer tools. It outlines a target architecture. The application's current, simpler implementation is detailed in the `/docs/current` directory._**

# Debug Features & Developer Tools

This document provides the full specification for the Mappa Imperium debug system.

## Debug Control Panel
**Purpose**: Toggle debugging features on/off for development and testing

**Debug Panel Location**: 
- **Developer Menu**: Hidden panel accessible via keyboard shortcut (Ctrl+Shift+D) or a dedicated button in debug builds.
- **Settings Integration**: Debug section in main settings for authorized users.
- **Environment Detection**: Auto-enable in development, manual toggle in production.

## Core Debug Flags

#### Form Debugging (`DEBUG_FORMS`)
**When Enabled**:
- **Field State Indicators**: Visual badges showing field validation status (✓ valid, ⚠ warning, ✗ invalid)
- **Form Data Inspector**: Expandable panel showing current form state as JSON
- **Validation Rule Display**: Tooltip showing which validation rules apply to each field
- **Auto-Fill Test Data**: Button to populate forms with realistic test data
- **Skip Required Fields**: Option to submit forms without completing required fields
- **Form Timing**: Display how long user spent on each section

#### AI Integration Debugging (`DEBUG_AI`)
**When Enabled**:
- **Prompt Preview**: Show exact prompt that will be sent to AI before generation
- **Template Inspection**: Display which template is being used and why
- **Context Data Viewer**: Show all world state data being included in AI context
- **Generation Timeline**: Track AI response times and retry attempts
- **Response Raw Data**: Display unprocessed AI output before parsing
- **Mock AI Responses**: Use pre-written test responses instead of real AI calls

#### Collaboration Debugging (`DEBUG_COLLAB`)
**When Enabled**:
- **WebSocket Inspector**: Real-time display of all WebSocket messages
- **Player State Tracker**: Show online/offline status and current activity for all players
- **Conflict Simulation**: Buttons to simulate editing conflicts and resolution scenarios
- **Permission Visualizer**: Clear indicators of what each player can/cannot edit
- **Event Timeline**: Chronological log of all cross-player events and responses
- **Sync Status**: Visual indicators of data synchronization state

#### Data Flow Debugging (`DEBUG_DATA`)
**When Enabled**:
- **Element Card Inspector**: Detailed view of any card's data structure and relationships
- **State Change Logger**: Console logging of all state modifications
- **Export Preview**: See export data before generating final files
- **Relationship Mapper**: Visual diagram of all element relationships
- **UUID Tracker**: Display and copy UUIDs for all elements
- **Database Query Monitor**: Show what data is being fetched/saved

#### Era Progression Debugging (`DEBUG_ERAS`)
**When Enabled**:
- **Era Unlock Override**: Manually unlock any era regardless of completion
- **Progress Manipulation**: Manually mark players as complete/incomplete for any era
- **Dice Roll Override**: Set specific dice results instead of random rolls
- **Event Trigger**: Manually trigger any event type for testing
- **Turn Counter Override**: Jump to any turn number in event-driven eras
- **Completion Bypass**: Skip to end of era without completing requirements

## Advanced Debug Features

#### Performance Debugging (`DEBUG_PERFORMANCE`)
**When Enabled**:
- **Render Timing**: Display component render times
- **Memory Usage**: Show memory consumption for large world states
- **Network Monitor**: Track API call frequency and response times
- **Bundle Size Analyzer**: Display which code modules are loading
- **Frame Rate Monitor**: Track UI responsiveness during heavy operations

#### Quality Assurance (`DEBUG_QA`)
**When Enabled**:
- **Content Validation**: Check all generated content against quality requirements
- **Name Uniqueness**: Flag duplicate names across all elements
- **Cultural Consistency**: Highlight potential inconsistencies in faction themes
- **Template Compliance**: Verify AI outputs match template specifications
- **Relationship Logic**: Validate that all element relationships make sense

#### Accessibility Testing (`DEBUG_A11Y`)
**When Enabled**:
- **Keyboard Navigation Tracer**: Visual highlight of keyboard focus path
- **Screen Reader Preview**: Text representation of screen reader output
- **Color Contrast Checker**: Flag any contrast issues
- **ARIA Validator**: Check all ARIA labels and roles
- **Focus Trap Tester**: Verify modal and dropdown focus behavior

## Debug Interface Design

#### Debug Panel Layout
```
┌─ Debug Control Panel ──────────────────────────────┐
│ [Form] [AI] [Collab] [Data] [Eras] [Perf] [QA] [A11Y] │
│                                                    │
│ Active Flags: ● Forms ● AI ○ Collab              │
│                                                    │
│ ┌─ Quick Actions ──────────────────────────────┐   │
│ │ [Auto-Fill Forms] [Mock AI] [Skip Validation]│   │
│ │ [Unlock All Eras] [Export Debug Data]        │   │
│ └───────────────────────────────────────────────┘   │
│                                                    │
│ ┌─ Live Data ─────────────────────────────────┐     │
│ │ Players Online: 3/4                        │     │
│ │ Sync Status: ✓ Connected                   │     │
│ │ Last AI Call: 2.3s ago                     │     │
│ │ Form Validation: 2 warnings                │     │
│ └───────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

#### Debug Indicators in UI
- **Form Fields**: Small debug icons next to each field showing state
- **Element Cards**: Debug overlay with UUID, owner, creation time
- **AI Buttons**: Show template ID and input validation status
- **Player Status**: Enhanced status indicators with debug information
- **Era Progress**: Detailed breakdown of completion requirements

## Debug Data Export

#### Debug Report Generation
**When Enabled**:
- **Session Summary**: Complete log of all user actions and system responses
- **Error Log**: All errors, warnings, and validation failures
- **Performance Metrics**: Timing data for all major operations
- **AI Usage**: Complete history of AI calls with inputs/outputs
- **Collaboration Events**: Full timeline of multi-player interactions

#### Debug Data Format
```json
{
  "session_id": "debug-session-12345",
  "debug_flags": ["DEBUG_FORMS", "DEBUG_AI"],
  "session_duration": "45:23",
  "user_actions": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "action": "form_submit",
      "form_type": "deity_creation",
      "validation_errors": ["missing_required_field"],
      "completion_time": "2.3s"
    }
  ],
  "ai_interactions": [
    {
      "timestamp": "2024-01-15T10:32:00Z",
      "template": "2_1_god-prompt-template",
      "input_data": {},
      "response_time": "4.2s",
      "tokens_used": 1250
    }
  ],
  "performance_metrics": {
    "average_render_time": "16ms",
    "memory_peak": "250MB",
    "api_calls": 47
  }
}
```

## Implementation Considerations

#### Debug Flag Storage
- **Local Storage**: Persist debug settings across sessions
- **URL Parameters**: Enable debug modes via URL flags
- **Environment Variables**: Default debug states for different environments
- **User Preferences**: Save debug preferences per user account

#### Security & Production
- **Access Control**: Debug features only available to authorized users
- **Performance Impact**: Minimal overhead when debug flags are disabled
- **Data Privacy**: Debug logs exclude sensitive user information
- **Automatic Cleanup**: Debug data auto-expires after set timeframe

#### Developer Experience
- **Hot Reloading**: Debug panel updates reflect immediately
- **Keyboard Shortcuts**: Quick access to common debug functions
- **Visual Feedback**: Clear indication when debug modes are active
- **Documentation Links**: Quick access to relevant technical docs from debug panel
