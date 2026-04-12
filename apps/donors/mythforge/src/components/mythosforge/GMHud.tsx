'use client';

import { useState, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorldStore } from '@/store/useWorldStore';
import {
  Shield, X, Plus, Trash2, Pencil, ChevronDown,
  LayoutGrid, Pin, Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Entity } from '@/lib/types';

// ---------------------------------------------------------------------------
// DM Screen Tab Bar
// ---------------------------------------------------------------------------
function ScreenTabBar({
  onNewScreen,
}: {
  onNewScreen: () => void;
}) {
  const { dmScreens, activeDmScreenId, setActiveDmScreen, deleteDmScreen, renameDmScreen } = useWorldStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startRename = useCallback((id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  }, []);

  const commitRename = useCallback(() => {
    if (editingId && editName.trim()) renameDmScreen(editingId, editName.trim());
    setEditingId(null);
  }, [editingId, editName, renameDmScreen]);

  return (
    <div className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 border-b border-white/[0.06] bg-void-800/30 overflow-x-auto">
      {dmScreens.map((screen) => {
        const isActive = screen.id === activeDmScreenId;
        const isEditing = editingId === screen.id;
        return (
          <div
            key={screen.id}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm cursor-pointer transition-colors shrink-0 ${
              isActive
                ? 'bg-surface-600 text-accent-gold border border-accent-gold/20'
                : 'text-ash-500 hover:text-bone-300 hover:bg-surface-600/50 border border-transparent'
            }`}
            onClick={() => !isEditing && setActiveDmScreen(screen.id)}
          >
            {isEditing ? (
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingId(null); }}
                onBlur={commitRename}
                className="bg-transparent text-sm text-bone-100 outline-none w-28"
              />
            ) : (
              <span className="truncate max-w-[120px]">{screen.name}</span>
            )}
            {!isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-0.5 rounded hover:bg-surface-500 text-ash-600 hover:text-bone-200 transition-colors"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-void-800 border-white/[0.08] text-bone-300 min-w-[140px]">
                  <DropdownMenuItem onClick={() => startRename(screen.id, screen.name)} className="text-bone-300 focus:bg-white/[0.06] cursor-pointer gap-2">
                    <Pencil className="size-3.5 text-ash-500" /> Rename
                  </DropdownMenuItem>
                  {dmScreens.length > 1 && (
                    <>
                      <DropdownMenuSeparator className="bg-white/[0.06]" />
                      <DropdownMenuItem
                        onClick={() => deleteDmScreen(screen.id)}
                        className="text-red-400 focus:bg-white/[0.06] focus:text-red-300 cursor-pointer gap-2"
                      >
                        <Trash2 className="size-3.5" /> Delete Screen
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}
      <button
        onClick={onNewScreen}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-ash-500 hover:text-accent-gold hover:bg-surface-600/50 transition-colors shrink-0 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" /> New
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pinned Entity Card (shared between Default and Screen views)
// ---------------------------------------------------------------------------
function PinnedEntityCard({ entity, onRemove }: { entity: Entity; onRemove: (_id: string) => void }) {
  const entries = useMemo(() => Object.entries(entity.json_attributes), [entity.json_attributes]);

  return (
    <div className="masonry-grid-item">
      <div className="bg-surface-700 border border-white/[0.06] rounded-lg p-5 relative group">
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(entity.id); }}
          className="absolute top-3 right-3 p-1 rounded-md opacity-0 group-hover:opacity-100 text-ash-500 hover:text-bone-100 hover:bg-surface-500 transition-all"
          title="Remove from screen"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-bone-100 font-semibold text-lg lore-serif pr-8 mb-1">{entity.title}</h3>
        <span className="text-xs text-ash-500">{entity.category}</span>
        {entity.markdown_content && (
          <div className="mt-4 mb-4 prose prose-invert prose-sm max-w-none lore-serif
            prose-headings:text-bone-100 prose-headings:font-semibold
            prose-p:text-bone-300 prose-p:leading-relaxed
            prose-li:text-bone-400 prose-strong:text-bone-100
            [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4
            [&_a]:text-accent-gold [&_a]:no-underline hover:[&_a]:underline
            [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm
            [&_hr]:border-white/[0.06]">
            <ReactMarkdown>{entity.markdown_content}</ReactMarkdown>
          </div>
        )}
        {entries.length > 0 && (
          <div className="border-t border-white/[0.06] pt-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {entries.map(([key, value]) => (
                <div key={key} className="contents">
                  <span className="text-xs text-ash-500 truncate">{key.replace(/_/g, ' ')}</span>
                  <span className="text-xs text-bone-300 truncate">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyState({ message, onAction, actionLabel }: { message: string; onAction?: () => void; actionLabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <Shield className="w-10 h-10 text-ash-700" />
      <p className="text-ash-600 text-sm text-center max-w-md">{message}</p>
      {onAction && actionLabel && (
        <Button variant="ghost" size="sm" onClick={onAction}
          className="text-ash-500 hover:text-accent-gold hover:bg-surface-600/50 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main GM HUD Component
// ---------------------------------------------------------------------------
export function GMHud() {
  const {
    gmHudVisible, entities, pinnedEntityIds,
    dmScreens, activeDmScreenId,
    togglePinEntity, toggleGmHud,
    addDmScreen, toggleEntityOnDmScreen,
  } = useWorldStore();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newScreenDialogOpen, setNewScreenDialogOpen] = useState(false);
  const [newScreenName, setNewScreenName] = useState('');

  const activeScreen = dmScreens.find((s) => s.id === activeDmScreenId);
  const hasScreens = dmScreens.length > 0;

  // Build pinned entities list based on current context
  const screenEntities = useMemo(() => {
    if (!activeScreen) return [];
    const idSet = new Set(activeScreen.pinnedEntityIds);
    return entities.filter((e) => idSet.has(e.id));
  }, [entities, activeScreen]);

  const defaultPinnedEntities = useMemo(() => {
    if (hasScreens) return [];
    return entities.filter((e) => pinnedEntityIds.includes(e.id));
  }, [entities, pinnedEntityIds, hasScreens]);

  const displayedEntities = hasScreens ? screenEntities : defaultPinnedEntities;
  const displayScreenId = activeDmScreenId;

  const handleRemove = useCallback((entityId: string) => {
    if (displayScreenId) {
      toggleEntityOnDmScreen(displayScreenId, entityId);
    } else {
      togglePinEntity(entityId);
    }
  }, [displayScreenId, toggleEntityOnDmScreen, togglePinEntity]);

  const handleCreateScreen = useCallback(() => {
    if (!newScreenName.trim()) return;
    addDmScreen(newScreenName.trim());
    setNewScreenName('');
    setNewScreenDialogOpen(false);
  }, [newScreenName, addDmScreen]);

  const handleAddEntities = useCallback(() => {
    if (hasScreens && activeDmScreenId) {
      setAddDialogOpen(true);
    } else {
      // For default mode, just open the entity selector — toggle pins
      setAddDialogOpen(true);
    }
  }, [hasScreens, activeDmScreenId]);

  const handleAddSelect = useCallback((entityId: string) => {
    if (activeDmScreenId) {
      toggleEntityOnDmScreen(activeDmScreenId, entityId);
    } else {
      togglePinEntity(entityId);
    }
    setAddDialogOpen(false);
  }, [activeDmScreenId, toggleEntityOnDmScreen, togglePinEntity]);

  const availableForAdd = useMemo(() => {
    const pinnedIds = hasScreens && activeScreen
      ? new Set(activeScreen.pinnedEntityIds)
      : new Set(pinnedEntityIds);
    return entities.filter((e) => !pinnedIds.has(e.id));
  }, [entities, hasScreens, activeScreen, pinnedEntityIds]);

  return (
    <AnimatePresence>
      {gmHudVisible && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <motion.div
            className="fixed inset-0 bg-void-900/80 gm-hud-backdrop"
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(12px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />

          <div className="fixed inset-0 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-void-800/40">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent-gold" />
                <span className="text-accent-gold font-bold text-xl">
                  {activeScreen ? activeScreen.name : 'DM Screen'}
                </span>
                {hasScreens && (
                  <span className="text-[10px] text-ash-600 bg-surface-600/50 px-1.5 py-0.5 rounded">
                    {dmScreens.length} screen{dmScreens.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddEntities}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-ash-500 hover:text-accent-gold hover:bg-surface-600/50 transition-colors cursor-pointer"
                  title="Add entities to screen"
                >
                  <Pin className="w-3.5 h-3.5" /> Add
                </button>
                <span className="text-xs text-ash-500 hidden sm:block">Tab to close</span>
                <button onClick={toggleGmHud} className="p-2 rounded-md hover:bg-surface-600 text-ash-500 hover:text-bone-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Screen Tabs (only when screens exist) */}
            {hasScreens && <ScreenTabBar onNewScreen={() => setNewScreenDialogOpen(true)} />}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {displayedEntities.length === 0 ? (
                <EmptyState
                  message={
                    hasScreens
                      ? 'This screen is empty. Add entities to build your quick reference.'
                      : 'No entities pinned. Pin entities from the workspace, or create a named DM screen.'
                  }
                  onAction={hasScreens ? handleAddEntities : undefined}
                  actionLabel="Add Entities"
                />
              ) : (
                <div className="masonry-grid">
                  {displayedEntities.map((entity) => (
                    <PinnedEntityCard key={entity.id} entity={entity} onRemove={handleRemove} />
                  ))}
                </div>
              )}

              {/* Create first screen CTA (shown when no screens exist) */}
              {!hasScreens && (
                <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col items-center gap-3">
                  <p className="text-ash-600 text-xs">
                    Create named screens to organize different views (e.g. &quot;Battle&quot;, &quot;NPCs&quot;).
                  </p>
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => setNewScreenDialogOpen(true)}
                    className="text-ash-500 hover:text-accent-gold hover:bg-surface-600/50 gap-1.5 text-xs"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Create First Screen
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* New Screen Dialog */}
          <Dialog open={newScreenDialogOpen} onOpenChange={setNewScreenDialogOpen}>
            <DialogContent className="bg-void-800 border-white/[0.08] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-accent-gold">Create DM Screen</DialogTitle>
                <DialogDescription className="text-ash-500">
                  Name your screen to organize quick references for different situations.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 py-2">
                <Input
                  autoFocus
                  placeholder="e.g. Battle Screen, NPC Reference..."
                  value={newScreenName}
                  onChange={(e) => setNewScreenName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateScreen(); }}
                  className="bg-surface-700 border-white/[0.08] text-bone-100 placeholder:text-ash-600 focus-visible:border-accent-gold focus-visible:ring-accent-gold/30"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['Battle', 'NPCs', 'Locations', 'Lore', 'Session'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setNewScreenName(suggestion)}
                      className="px-2 py-0.5 text-[10px] rounded-full border border-white/[0.06] text-ash-500 hover:text-accent-gold hover:border-accent-gold/30 transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setNewScreenDialogOpen(false)}
                  className="text-ash-500 hover:text-bone-300 hover:bg-surface-600/50">Cancel</Button>
                <Button onClick={handleCreateScreen} disabled={!newScreenName.trim()}
                  className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 border border-accent-gold/30">Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Entity Dialog */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogContent className="bg-void-800 border-white/[0.08] sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-accent-gold">Add Entity</DialogTitle>
                <DialogDescription className="text-ash-500">
                  Choose entities to add to {hasScreens && activeScreen ? `"${activeScreen.name}"` : 'the DM screen'}.
                </DialogDescription>
              </DialogHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ash-600 pointer-events-none" />
                <Input
                  autoFocus
                  placeholder="Search entities..."
                  id="dm-add-search"
                  className="pl-8 bg-surface-700 border-white/[0.08] text-bone-100 placeholder:text-ash-600 focus-visible:border-accent-gold/30"
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {availableForAdd.length === 0 ? (
                  <p className="text-ash-600 text-sm text-center py-6">All entities already added.</p>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {availableForAdd.map((entity) => (
                      <button
                        key={entity.id}
                        onClick={() => handleAddSelect(entity.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-left text-bone-300 hover:bg-white/[0.06] hover:text-bone-100 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <span className="text-sm font-medium truncate">{entity.title}</span>
                          <span className="text-[11px] text-ash-600">{entity.category} · {entity.uuid_short}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
