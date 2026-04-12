/**
 * Session Management Types
 * 
 * This module defines types for session persistence, state capture,
 * and session restoration for the Mechanical Sycophant application.
 */

import type { SessionId, Id } from './ids';
import type { GenerationRequest, GenerationResponse } from './generation';

/**
 * Session status enum
 * Tracks the current state of a session
 */
export enum SessionStatus {
    /** Session is currently active */
    ACTIVE = 'active',
    /** Session is paused (not actively being used) */
    PAUSED = 'paused',
    /** Session has been completed */
    COMPLETED = 'completed',
    /** Session has been archived */
    ARCHIVED = 'archived',
}

/**
 * Session type enum
 * Categorizes sessions by their primary purpose
 */
export enum SessionType {
    /** Campaign planning session */
    CAMPAIGN = 'campaign',
    /** Dungeon design session */
    DUNGEON = 'dungeon',
    /** NPC creation session */
    NPC = 'npc',
    /** Encounter design session */
    ENCOUNTER = 'encounter',
    /** World building session */
    WORLD_BUILDING = 'world-building',
    /** General session */
    GENERAL = 'general',
}

/**
 * Session interface
 * Represents a user session with state persistence
 */
export interface Session {
    /** Unique session identifier */
    id: SessionId;
    /** Session name */
    name: string;
    /** Session description */
    description?: string;
    /** Session type */
    type: SessionType;
    /** Current session status */
    status: SessionStatus;
    /** Current state snapshot */
    state: SessionSnapshot;
    /** Session history */
    history: SessionHistory;
    /** Session metadata */
    metadata: SessionMetadata;
    /** Creation timestamp */
    createdAt: string;
    /** Last updated timestamp */
    updatedAt: string;
    /** Last accessed timestamp */
    lastAccessedAt: string;
}

/**
 * Session metadata
 */
export interface SessionMetadata {
    /** Session version */
    version: string;
    /** User ID who owns this session */
    userId?: string;
    /** Campaign ID if associated with a campaign */
    campaignId?: Id;
    /** Tags for categorization */
    tags: string[];
    /** Whether this is a pinned session */
    isPinned: boolean;
    /** Whether this session is auto-saved */
    autoSave: boolean;
    /** Auto-save interval (ms) */
    autoSaveInterval?: number;
    /** Maximum history entries */
    maxHistoryEntries?: number;
}

/**
 * Session snapshot interface
 * Captures the complete state of the application at a point in time
 */
export interface SessionSnapshot {
    /** Snapshot ID */
    id: string;
    /** Snapshot timestamp */
    timestamp: string;
    /** Snapshot name */
    name: string;
    /** Snapshot description */
    description?: string;
    /** Application state */
    appState: AppState;
    /** Store states */
    storeStates: Record<string, unknown>;
    /** UI state */
    uiState: UIStateSnapshot;
    /** Generation history */
    generationHistory: GenerationHistoryEntry[];
    /** Snapshot metadata */
    metadata: SnapshotMetadata;
}

/**
 * Application state
 */
export interface AppState {
    /** Current route/path */
    route: string;
    /** Active tool/category */
    activeTool?: string;
    /** Selected entities */
    selectedEntities: Id[];
    /** Current view mode */
    viewMode: string;
    /** Application settings */
    settings: AppSettings;
}

/**
 * App settings
 */
export interface AppSettings {
    /** Theme mode */
    theme: 'light' | 'dark' | 'auto';
    /** Language preference */
    language: string;
    /** Generation preferences */
    generation: GenerationPreferences;
    /** UI preferences */
    ui: UIPreferences;
}

/**
 * Generation preferences
 */
export interface GenerationPreferences {
    /** Default generation mode */
    defaultMode: 'ai' | 'procedural' | 'hybrid';
    /** Default creativity level */
    creativity: number;
    /** Default output format */
    outputFormat: string;
    /** Whether to stream results */
    stream: boolean;
}

/**
 * UI preferences
 */
export interface UIPreferences {
    /** Sidebar state */
    sidebar: SidebarPreferences;
    /** Whether to show animations */
    animations: boolean;
    /** Whether to show tooltips */
    tooltips: boolean;
    /** Density mode */
    density: 'comfortable' | 'compact' | 'spacious';
}

/**
 * Sidebar preferences
 */
export interface SidebarPreferences {
    /** Whether sidebar is collapsed */
    collapsed: boolean;
    /** Sidebar width */
    width: number;
    /** Sidebar position */
    position: 'left' | 'right';
}

/**
 * UI state snapshot
 */
export interface UIStateSnapshot {
    /** Open modals */
    modals: OpenModal[];
    /** Active toasts/notifications */
    toasts: ToastState[];
    /** Active dialogs */
    dialogs: DialogState[];
    /** Selection state */
    selection: SelectionStateSnapshot;
    /** Filter state */
    filters: FilterStateSnapshot;
}

/**
 * Open modal
 */
export interface OpenModal {
    /** Modal ID */
    id: string;
    /** Modal type */
    type: string;
    /** Modal props */
    props?: Record<string, unknown>;
}

/**
 * Toast state
 */
export interface ToastState {
    /** Toast ID */
    id: string;
    /** Toast message */
    message: string;
    /** Toast type */
    type: 'info' | 'success' | 'warning' | 'error';
    /** Toast duration (ms) */
    duration?: number;
}

/**
 * Dialog state
 */
export interface DialogState {
    /** Dialog ID */
    id: string;
    /** Dialog type */
    type: string;
    /** Dialog props */
    props?: Record<string, unknown>;
}

/**
 * Selection state snapshot
 */
export interface SelectionStateSnapshot {
    /** Selected entity IDs */
    selectedIds: Id[];
    /** Last selected ID */
    lastSelectedId?: Id;
    /** Selection mode */
    mode: 'single' | 'multiple';
}

/**
 * Filter state snapshot
 */
export interface FilterStateSnapshot {
    /** Active filters */
    filters: Record<string, unknown>;
    /** Search query */
    searchQuery?: string;
    /** Sort order */
    sortOrder?: string;
}

/**
 * Snapshot metadata
 */
export interface SnapshotMetadata {
    /** Snapshot version */
    version: string;
    /** User who created the snapshot */
    userId?: string;
    /** Whether this is an auto-save */
    isAutoSave: boolean;
    /** Snapshot tags */
    tags: string[];
}

/**
 * Session history entry
 */
export interface SessionHistoryEntry {
    /** Entry ID */
    id: string;
    /** Entry type */
    type: HistoryEntryType;
    /** Entry timestamp */
    timestamp: string;
    /** Entry description */
    description: string;
    /** Previous state (for undo) */
    previousState?: Partial<SessionSnapshot>;
    /** New state */
    newState?: Partial<SessionSnapshot>;
    /** Entry metadata */
    metadata: HistoryEntryMetadata;
}

/**
 * History entry type enum
 */
export enum HistoryEntryType {
    /** Entity created */
    ENTITY_CREATED = 'entity-created',
    /** Entity updated */
    ENTITY_UPDATED = 'entity-updated',
    /** Entity deleted */
    ENTITY_DELETED = 'entity-deleted',
    /** Generation performed */
    GENERATION = 'generation',
    /** State changed */
    STATE_CHANGE = 'state-change',
    /** Navigation occurred */
    NAVIGATION = 'navigation',
    /** Snapshot created */
    SNAPSHOT = 'snapshot',
    /** Settings changed */
    SETTINGS_CHANGE = 'settings-change',
}

/**
 * History entry metadata
 */
export interface HistoryEntryMetadata {
    /** User who performed the action */
    userId?: string;
    /** Related entity IDs */
    relatedEntities?: Id[];
    /** Action source */
    source: 'user' | 'system' | 'automation';
}

/**
 * Session history
 */
export interface SessionHistory {
    /** History entries */
    entries: SessionHistoryEntry[];
    /** Current position in history (for undo/redo) */
    currentPosition: number;
    /** Maximum history entries */
    maxEntries: number;
}

/**
 * Generation history entry
 */
export interface GenerationHistoryEntry {
    /** Entry ID */
    id: string;
    /** Generation request */
    request: GenerationRequest;
    /** Generation response */
    response: GenerationResponse;
    /** Entry timestamp */
    timestamp: string;
    /** Entry metadata */
    metadata: GenerationHistoryMetadata;
}

/**
 * Generation history metadata
 */
export interface GenerationHistoryMetadata {
    /** Whether the result was saved */
    saved: boolean;
    /** Saved entity ID if applicable */
    savedEntityId?: Id;
    /** User rating */
    rating?: number;
    /** User notes */
    notes?: string;
}

/**
 * Resume timeline interface
 * Provides information for restoring a session
 */
export interface ResumeTimeline {
    /** Session ID */
    sessionId: SessionId;
    /** Timeline of events */
    events: TimelineEvent[];
    /** Current position in timeline */
    currentPosition: number;
    /** Resume options */
    options: ResumeOptions;
}

/**
 * Timeline event
 */
export interface TimelineEvent {
    /** Event ID */
    id: string;
    /** Event type */
    type: string;
    /** Event timestamp */
    timestamp: string;
    /** Event description */
    description: string;
    /** Event data */
    data: Record<string, unknown>;
}

/**
 * Resume options
 */
export interface ResumeOptions {
    /** Whether to restore UI state */
    restoreUI: boolean;
    /** Whether to restore store states */
    restoreStores: boolean;
    /** Whether to restore generation history */
    restoreHistory: boolean;
    /** Whether to restore selection */
    restoreSelection: boolean;
    /** Point in history to resume from */
    resumePoint?: string;
}

/**
 * Session export format
 */
export interface SessionExport {
    /** Export format version */
    version: string;
    /** Export timestamp */
    exportedAt: string;
    /** Session being exported */
    session: Session;
    /** Include snapshots */
    includeSnapshots: boolean;
    /** Snapshots to include */
    snapshots?: SessionSnapshot[];
    /** Export metadata */
    metadata: {
        /** Export source */
        source: string;
        /** Total snapshots */
        snapshotCount: number;
    };
}

/**
 * Session import result
 */
export interface SessionImportResult {
    /** Imported session */
    session?: Session;
    /** Number of snapshots imported */
    snapshotsImported: number;
    /** Whether import was successful */
    success: boolean;
    /** Import errors */
    errors: SessionImportError[];
}

/**
 * Session import error
 */
export interface SessionImportError {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
    /** Related data */
    data?: unknown;
}

/**
 * Session statistics
 */
export interface SessionStatistics {
    /** Session ID */
    sessionId: SessionId;
    /** Total time spent in session (ms) */
    totalTime: number;
    /** Number of generations performed */
    generationCount: number;
    /** Number of entities created */
    entitiesCreated: number;
    /** Number of entities modified */
    entitiesModified: number;
    /** Number of snapshots taken */
    snapshotCount: number;
    /** Most used generation type */
    mostUsedGenerationType?: string;
    /** Activity by day */
    activityByDay: Record<string, number>;
}

/**
 * Session filter options
 */
export interface SessionFilterOptions {
    /** Filter by status */
    status?: SessionStatus | SessionStatus[];
    /** Filter by type */
    type?: SessionType | SessionType[];
    /** Filter by tags */
    tags?: string[];
    /** Filter by date range */
    dateRange?: {
        start: string;
        end: string;
    };
    /** Search query */
    search?: string;
    /** Whether to include archived sessions */
    includeArchived?: boolean;
}

/**
 * Session sort options
 */
export enum SessionSortOption {
    NAME_ASC = 'name-asc',
    NAME_DESC = 'name-desc',
    CREATED_ASC = 'created-asc',
    CREATED_DESC = 'created-desc',
    UPDATED_ASC = 'updated-asc',
    UPDATED_DESC = 'updated-desc',
    ACCESSED_ASC = 'accessed-asc',
    ACCESSED_DESC = 'accessed-desc',
    MOST_USED = 'most-used',
}
