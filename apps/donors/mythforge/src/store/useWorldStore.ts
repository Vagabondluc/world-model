import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Entity, Relationship, AIMode, ChatMessage, ViewMode, CustomCategoryDef, DmScreen } from '@/lib/types';
import { generateUuidShort } from '@/lib/types';
import { addCustomCategoryAction, updateCustomCategoryAction, removeCustomCategoryAction, getEffectiveTemplate, getEffectiveGroups, getEffectiveIcon } from './slices/category-actions';
import { pushHistory, undoAction, redoAction } from './slices/undo';
import type { DataSnapshot } from './slices/undo';
import { mockEntities, mockRelationships, MOCK_NPC_ID } from './mock-data';
interface WorldState {
  entities: Entity[]; relationships: Relationship[]; pinnedEntityIds: string[];
  nodePositions: Record<string, { x: number; y: number }>; customCategories: CustomCategoryDef[];
  activeEntityId: string | null; viewMode: ViewMode; sidebarCollapsed: boolean;
  gmHudVisible: boolean; isLayoutInverted: boolean; showPathFinder: boolean; showShortcuts: boolean;
  aiMode: AIMode; chatMessages: ChatMessage[]; chatInput: string;
  _historyPast: DataSnapshot[]; _historyFuture: DataSnapshot[];
  // DM Screens
  dmScreens: DmScreen[]; activeDmScreenId: string | null;
  // Entity CRUD
  addEntity: (_title: string, _category: string, _markdownContent?: string, _jsonAttributes?: Record<string, unknown>) => Entity;
  updateEntity: (_id: string, _updates: Partial<Entity>) => void;
  deleteEntity: (_id: string) => void;
  duplicateEntity: (_id: string) => Entity | undefined;
  setActiveEntity: (_id: string | null) => void;
  // Tags & pins
  addTag: (_entityId: string, _tag: string) => void;
  removeTag: (_entityId: string, _tag: string) => void;
  togglePinEntity: (_id: string) => void;
  // Relationships
  addRelationship: (_parentId: string, _childId: string, _type: string) => void;
  deleteRelationship: (_id: string) => void;
  // UI & AI
  setViewMode: (_mode: ViewMode) => void; toggleSidebar: () => void; toggleGmHud: () => void;
  toggleLayoutInversion: () => void; setShowPathFinder: (_show: boolean) => void;
  setShowShortcuts: (_show: boolean) => void; setAiMode: (_mode: AIMode) => void;
  addChatMessage: (_message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void; setChatInput: (_input: string) => void;
  // Graph & undo
  setNodePosition: (_id: string, _position: { x: number; y: number }) => void;
  clearNodePositions: () => void; undo: () => void; redo: () => void;
  canUndo: () => boolean; canRedo: () => boolean;
  resetWorld: () => void;
  // DM Screens
  addDmScreen: (_name: string) => DmScreen;
  renameDmScreen: (_id: string, _name: string) => void;
  deleteDmScreen: (_id: string) => void;
  setActiveDmScreen: (_id: string | null) => void;
  toggleEntityOnDmScreen: (_screenId: string, _entityId: string) => void;
  // Custom categories & utility
  addCustomCategory: (_def: CustomCategoryDef) => void;
  updateCustomCategory: (_id: string, _def: Partial<CustomCategoryDef>) => void;
  removeCustomCategory: (_id: string) => void;
  getEntityById: (_id: string) => Entity | undefined;
  getChildEntities: (_parentId: string) => Entity[];
  getParentEntities: (_childId: string) => Entity[];
  getAllTags: () => string[];
  getEffectiveTemplate: (_category: string) => Record<string, unknown> | undefined;
  getEffectiveGroups: () => Record<string, string[]>;
  getEffectiveIcon: (_category: string) => string;
}

export function isEntityPinned(state: Pick<WorldState, 'pinnedEntityIds'>, id: string): boolean {
  return state.pinnedEntityIds.includes(id);
}

type PersistedState = Pick<WorldState, 'entities' | 'relationships' | 'pinnedEntityIds' | 'nodePositions' | 'customCategories' | 'dmScreens'>;

export const useWorldStore = create<WorldState>()(
  persist(
    (set, get) => ({
      entities: mockEntities,
      relationships: mockRelationships,
      pinnedEntityIds: [MOCK_NPC_ID],
      nodePositions: {},
      customCategories: [],
      activeEntityId: null,
      viewMode: 'grid',
      sidebarCollapsed: false,
      gmHudVisible: false,
      isLayoutInverted: false,
      showPathFinder: false,
      showShortcuts: false,
      aiMode: 'lorekeeper',
      chatMessages: [],
      chatInput: '',
      _historyPast: [],
      _historyFuture: [],
      dmScreens: [],
      activeDmScreenId: null,

      addEntity: (title, category, markdownContent = '', jsonAttributes) => {
        const state = get();
        const hp = pushHistory(state);
        const id = uuidv4();
        const now = Date.now();
        const defaultAttrs = jsonAttributes || getEffectiveTemplate(category, state) || {};
        const newEntity: Entity = { id, uuid_short: generateUuidShort(), title, category, markdown_content: markdownContent, json_attributes: defaultAttrs, tags: [], isPinned: false, created_at: now, updated_at: now };
        set((s) => ({ ...hp, entities: [...s.entities, newEntity] }));
        return newEntity;
      },

      updateEntity: (id, updates) => {
        const hp = pushHistory(get());
        set((s) => ({ ...hp, entities: s.entities.map((e) => e.id === id ? { ...e, ...updates, updated_at: Date.now() } : e) }));
      },

      deleteEntity: (id) => {
        const hp = pushHistory(get());
        set((s) => {
          const remainingPositions = { ...s.nodePositions };
          delete remainingPositions[id];
          return { ...hp, entities: s.entities.filter((e) => e.id !== id), relationships: s.relationships.filter((r) => r.parent_id !== id && r.child_id !== id), activeEntityId: s.activeEntityId === id ? null : s.activeEntityId, pinnedEntityIds: s.pinnedEntityIds.filter((pid) => pid !== id), nodePositions: remainingPositions };
        });
      },

      duplicateEntity: (id) => {
        const state = get(); const source = state.entities.find((e) => e.id === id);
        if (!source) return undefined;
        const hp = pushHistory(state); const now = Date.now();
        const newEntity: Entity = { ...structuredClone(source), id: uuidv4(), uuid_short: generateUuidShort(), title: `${source.title} (Copy)`, created_at: now, updated_at: now, isPinned: false };
        set((s) => ({ ...hp, entities: [...s.entities, newEntity] }));
        return newEntity;
      },
      setActiveEntity: (id) => set({ activeEntityId: id }),
      addTag: (entityId, tag) => {
        const state = get();
        if (!state.entities.find((e) => e.id === entityId)?.tags.includes(tag)) {
          const hp = pushHistory(state);
          set((s) => ({ ...hp, entities: s.entities.map((e) => e.id === entityId ? { ...e, tags: [...e.tags, tag], updated_at: Date.now() } : e) }));
        }
      },

      removeTag: (entityId, tag) => { const hp = pushHistory(get()); set((s) => ({ ...hp, entities: s.entities.map((e) => e.id === entityId ? { ...e, tags: e.tags.filter((t) => t !== tag), updated_at: Date.now() } : e) })); },
      togglePinEntity: (id) => {
        const state = get();
        const pinned = state.pinnedEntityIds.includes(id);
        const hp = pushHistory(state);
        set((s) => ({ ...hp, pinnedEntityIds: pinned ? s.pinnedEntityIds.filter((pid) => pid !== id) : [...s.pinnedEntityIds, id], entities: s.entities.map((e) => e.id === id ? { ...e, isPinned: !pinned } : e) }));
      },

      addRelationship: (parentId, childId, type) => { const hp = pushHistory(get()); set((s) => ({ ...hp, relationships: [...s.relationships, { id: uuidv4(), parent_id: parentId, child_id: childId, relationship_type: type }] })); },
      deleteRelationship: (id) => { const hp = pushHistory(get()); set((s) => ({ ...hp, relationships: s.relationships.filter((r) => r.id !== id) })); },
      setNodePosition: (id, position) => set((state) => ({ nodePositions: { ...state.nodePositions, [id]: position } })),
      clearNodePositions: () => set({ nodePositions: {} }),
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleGmHud: () => set((state) => ({ gmHudVisible: !state.gmHudVisible })),
      toggleLayoutInversion: () => set((state) => ({ isLayoutInverted: !state.isLayoutInverted })),
      setShowPathFinder: (show) => set({ showPathFinder: show }),
      setShowShortcuts: (show) => set({ showShortcuts: show }),
      setAiMode: (mode) => set({ aiMode: mode }),

      addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, { ...message, id: uuidv4(), timestamp: Date.now() }] })),
      clearChat: () => set({ chatMessages: [] }),
      setChatInput: (input) => set({ chatInput: input }),
      undo: () => undoAction(set, get),
      redo: () => redoAction(set, get),
      canUndo: () => get()._historyPast.length > 0,
      canRedo: () => get()._historyFuture.length > 0,
      resetWorld: () => {
        set({
          entities: mockEntities, relationships: mockRelationships, pinnedEntityIds: [MOCK_NPC_ID],
          nodePositions: {}, customCategories: [], activeEntityId: null, viewMode: 'grid',
          sidebarCollapsed: false, gmHudVisible: false, isLayoutInverted: false,
          showPathFinder: false, showShortcuts: false, aiMode: 'lorekeeper',
          chatMessages: [], chatInput: '', _historyPast: [], _historyFuture: [],
          dmScreens: [], activeDmScreenId: null,
        });
      },
      // DM Screen actions
      addDmScreen: (name) => {
        const now = Date.now();
        const screen: DmScreen = { id: uuidv4(), name, pinnedEntityIds: [], created_at: now, updated_at: now };
        set((s) => ({ dmScreens: [...s.dmScreens, screen], activeDmScreenId: screen.id }));
        return screen;
      },
      renameDmScreen: (id, name) => set((s) => ({
        dmScreens: s.dmScreens.map((sc) => sc.id === id ? { ...sc, name, updated_at: Date.now() } : sc),
      })),
      deleteDmScreen: (id) => set((s) => ({
        dmScreens: s.dmScreens.filter((sc) => sc.id !== id),
        activeDmScreenId: s.activeDmScreenId === id ? (s.dmScreens.find((sc) => sc.id !== id)?.id ?? null) : s.activeDmScreenId,
      })),
      setActiveDmScreen: (id) => set({ activeDmScreenId: id }),
      toggleEntityOnDmScreen: (screenId, entityId) => set((s) => ({
        dmScreens: s.dmScreens.map((sc) => {
          if (sc.id !== screenId) return sc;
          const has = sc.pinnedEntityIds.includes(entityId);
          return { ...sc, pinnedEntityIds: has ? sc.pinnedEntityIds.filter((eid) => eid !== entityId) : [...sc.pinnedEntityIds, entityId], updated_at: Date.now() };
        }),
      })),
      addCustomCategory: (def) => addCustomCategoryAction(set, get, def),
      updateCustomCategory: (id, updates) => updateCustomCategoryAction(set, get, id, updates),
      removeCustomCategory: (id) => removeCustomCategoryAction(set, get, id),
      getEntityById: (id) => get().entities.find((e) => e.id === id),
      getChildEntities: (parentId) => {
        const state = get();
        const childIds = state.relationships.filter((r) => r.parent_id === parentId).map((r) => r.child_id);
        const entityMap = new Map(state.entities.map((e) => [e.id, e]));
        return childIds.map((id) => entityMap.get(id)).filter(Boolean) as Entity[];
      },
      getParentEntities: (childId) => {
        const state = get();
        const parentIds = state.relationships.filter((r) => r.child_id === childId).map((r) => r.parent_id);
        const entityMap = new Map(state.entities.map((e) => [e.id, e]));
        return parentIds.map((id) => entityMap.get(id)).filter(Boolean) as Entity[];
      },
      getAllTags: () => { const tagSet = new Set<string>(); for (const entity of get().entities) { for (const tag of entity.tags) { tagSet.add(tag); } } return Array.from(tagSet).sort(); },
      getEffectiveTemplate: (category) => getEffectiveTemplate(category, get()),
      getEffectiveGroups: () => getEffectiveGroups(get()),
      getEffectiveIcon: (category) => getEffectiveIcon(category, get()),
    }),
    {
      name: 'mythosforge-world',
        partialize: (state): PersistedState => ({
          entities: state.entities, relationships: state.relationships, pinnedEntityIds: state.pinnedEntityIds,
          nodePositions: state.nodePositions, customCategories: state.customCategories, dmScreens: state.dmScreens,
        }),
        version: 4,
        migrate: (persisted: unknown, version: number): PersistedState => {
          const persistedRecord = (persisted ?? {}) as Record<string, unknown>;
          if (version < 1) {
            if (!persistedRecord.entities) persistedRecord.entities = [];
            if (!persistedRecord.relationships) persistedRecord.relationships = [];
            if (!persistedRecord.pinnedEntityIds) persistedRecord.pinnedEntityIds = [];
            if (!persistedRecord.nodePositions) persistedRecord.nodePositions = {};
          }
          if (version < 2) {
            if (Array.isArray(persistedRecord.entities)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              persistedRecord.entities = (persistedRecord.entities as any[]).map((e: Record<string, unknown>) => ({ ...e, tags: Array.isArray(e.tags) ? e.tags : [] }));
            }
            if (!persistedRecord.customCategories) persistedRecord.customCategories = [];
          }
          if (version < 3) {
            if (!persistedRecord.dmScreens) persistedRecord.dmScreens = [];
          }

          if ('openuiOptionA' in persistedRecord) {
            delete persistedRecord.openuiOptionA;
          }
          return persistedRecord as PersistedState;
        },
    }
  )
);
