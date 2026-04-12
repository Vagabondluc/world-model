'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import {
  DndContext, PointerSensor, useSensor, useSensors, DragOverlay,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useWorldStore } from '@/store/useWorldStore';
import { TagInput } from '@/components/mythosforge/TagInput';
import { StaticEntityItem, SortableEntityItem } from './explorer-tree-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select';
type EntityBrief = { id: string; title: string; uuid_short: string; category: string };

type TreeGroupListProps = {
  effectiveGroups: Record<string, string[]>;
  groupedEntities: Record<string, EntityBrief[]>;
  collapsedGroups: Record<string, boolean>;
  toggleGroup: (_n: string) => void;
  activeEntityId: string | null;
  setActiveEntity: (_id: string) => void;
  getChildEntities: (_pid: string) => EntityBrief[];
  mounted: boolean;
};

function TreeGroupList({ effectiveGroups, groupedEntities, collapsedGroups, toggleGroup, activeEntityId, setActiveEntity, getChildEntities, mounted }: TreeGroupListProps) {
  const Item = mounted ? SortableEntityItem : StaticEntityItem;
  return (
    <div className="py-1">
      {Object.entries(effectiveGroups).map(([name]) => {
        const open = !collapsedGroups[name], ents = groupedEntities[name] ?? [];
        if (!ents.length) return null;
        return (
          <Collapsible key={name} open={open} onOpenChange={() => toggleGroup(name)}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center w-full gap-2 px-3 py-2 text-xs font-semibold text-ash-500 uppercase tracking-wider hover:text-bone-300 hover:bg-surface-700/30 transition-colors cursor-pointer">
                <ChevronRight className={`size-3 text-ash-600 transition-transform duration-150 ${open ? 'rotate-90' : ''}`} />
                <span className="flex-1 text-left">{name}</span>
                <span className="text-[10px] text-ash-600 font-normal normal-case">{ents.length}</span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pb-1">
                {ents.map((e) => (
                  <Item key={e.id} entity={e} depth={1} activeEntityId={activeEntityId} setActiveEntity={setActiveEntity} getChildEntities={getChildEntities} />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}

type GroupListProps = Omit<TreeGroupListProps, 'mounted'>;
export function ExplorerTree() {
  const { entities, relationships, activeEntityId, setActiveEntity, addEntity, addRelationship, deleteRelationship, getChildEntities, getAllTags, getEffectiveGroups } = useWorldStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragEntity, setDragEntity] = useState<{ id: string; title: string; category: string } | null>(null);

  useEffect(() => { const id = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(id); }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allTags = useMemo(() => getAllTags(), [getAllTags, entities]);
  const customCategories = useWorldStore((s) => s.customCategories);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const effectiveGroups = useMemo(() => getEffectiveGroups(), [getEffectiveGroups, entities, customCategories]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function isDescendant(pid: string, aid: string): boolean {
    if (pid === aid) return true;
    return useWorldStore.getState().getParentEntities(pid).some((p) => isDescendant(p.id, aid));
  }

  const handleDragStart = (event: DragStartEvent) => {
    const e = entities.find((ent) => ent.id === event.active.id);
    if (e) { setActiveDragId(e.id); setDragEntity({ id: e.id, title: e.title, category: e.category }); }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null); setDragEntity(null);
    if (!over || active.id === over.id) return;
    const draggedId = active.id as string, targetId = over.id as string;
    if (isDescendant(targetId, draggedId)) return;
    const state = useWorldStore.getState();
    const oldRel = state.relationships.find((r) => r.child_id === draggedId && r.relationship_type === 'contains');
    if (oldRel) deleteRelationship(oldRel.id);
    addRelationship(targetId, draggedId, 'contains');
  };

  const handleDragCancel = () => { setActiveDragId(null); setDragEntity(null); };

  const { groupedEntities } = useMemo(() => {
    const childIds = new Set<string>();
    const filtered = tagFilter.length > 0 ? entities.filter((e) => e.tags.some((t) => tagFilter.includes(t))) : entities;
    const getParents = useWorldStore.getState().getParentEntities;
    filtered.forEach((e) => { if (getParents(e.id).length > 0) childIds.add(e.id); });
    const groups: Record<string, typeof filtered> = {};
    for (const [gn, cats] of Object.entries(effectiveGroups))
      groups[gn] = filtered.filter((e) => cats.includes(e.category) && !childIds.has(e.id));
    return { groupedEntities: groups };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- relationships dep triggers recomputation on relationship changes
  }, [entities, relationships, tagFilter, effectiveGroups]);

  const allEntityIds = useMemo(() => entities.map((e) => e.id), [entities]);
  const allCategories = Object.entries(effectiveGroups);
  const toggleGroup = (gn: string) => setCollapsedGroups((prev) => ({ ...prev, [gn]: !prev[gn] }));

  const handleCreate = () => {
    if (!newTitle.trim() || !newCategory) return;
    addEntity(newTitle.trim(), newCategory);
    setNewTitle(''); setNewCategory(''); setDialogOpen(false);
  };

  const groupProps: GroupListProps = { effectiveGroups, groupedEntities, collapsedGroups, toggleGroup, activeEntityId, setActiveEntity, getChildEntities };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-white/[0.06] flex flex-col gap-2">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-ash-500 hover:text-accent-gold hover:bg-surface-600/50 h-8 text-xs" onClick={() => setDialogOpen(true)}>
          <Plus className="size-3.5" /> New Entity
        </Button>
        {mounted && allTags.length > 0 && (
          <TagInput tags={tagFilter} onAdd={(t) => setTagFilter((p) => [...p, t])} onRemove={(t) => setTagFilter((p) => p.filter((x) => x !== t))} suggestions={allTags} placeholder="Filter by tags..." />
        )}
      </div>
      {mounted ? (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <ScrollArea className="flex-1">
            <SortableContext items={allEntityIds} strategy={verticalListSortingStrategy}>
              <TreeGroupList {...groupProps} mounted />
            </SortableContext>
          </ScrollArea>
          <DragOverlay dropAnimation={null}>
            {activeDragId && dragEntity && (
              <div className="bg-surface-600 border border-accent-gold/30 rounded-lg p-2 min-w-[160px] shadow-xl opacity-90">
                <div className="text-bone-100 font-semibold text-sm">{dragEntity.title}</div>
                <div className="text-ash-500 text-xs">{dragEntity.category}</div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        <ScrollArea className="flex-1"><TreeGroupList {...groupProps} mounted={false} /></ScrollArea>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-void-800 border-white/[0.08] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-accent-gold">Create New Entity</DialogTitle>
            <DialogDescription className="text-ash-500">Add a new entity to your world. Choose a category and give it a name.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="entity-title" className="text-bone-300 text-sm">Title</Label>
              <Input id="entity-title" placeholder="Enter entity title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                className="bg-surface-700 border-white/[0.08] text-bone-100 placeholder:text-ash-600 focus-visible:border-accent-gold focus-visible:ring-accent-gold/30" autoFocus />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="entity-category" className="text-bone-300 text-sm">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="w-full bg-surface-700 border-white/[0.08] text-bone-100 focus:ring-accent-gold/30"><SelectValue placeholder="Select a category..." /></SelectTrigger>
                <SelectContent className="bg-void-800 border-white/[0.08] max-h-64">
                  {allCategories.map(([gl, cats]) => (
                    <SelectGroup key={gl}>
                      <SelectLabel className="text-accent-gold/70 font-semibold">{gl}</SelectLabel>
                      {cats.map((c) => <SelectItem key={c} value={c} className="text-bone-300 focus:bg-surface-600 focus:text-bone-100">{c}</SelectItem>)}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-ash-500 hover:text-bone-300 hover:bg-surface-600/50">Cancel</Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim() || !newCategory} className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30 border border-accent-gold/30">Create Entity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
