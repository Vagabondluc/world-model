'use client';

import { useState, useMemo } from 'react';
import { useWorldStore } from '@/store/useWorldStore';
import { RELATIONSHIP_TYPES } from '@/lib/types';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Link2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Direction = 'active-parent' | 'active-child';

interface LinkEntityDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  entityId: string;
}

export function LinkEntityDialog({ open, onOpenChange, entityId }: LinkEntityDialogProps) {
  const { entities, addRelationship, getEntityById } = useWorldStore();
  const activeEntity = getEntityById(entityId);
  const [direction, setDirection] = useState<Direction>('active-parent');
  const [targetEntityId, setTargetEntityId] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const availableEntities = useMemo(() => entities.filter((e) => e.id !== entityId), [entities, entityId]);

  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return availableEntities;
    const q = searchQuery.toLowerCase();
    return availableEntities.filter(
      (e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.uuid_short.toLowerCase().includes(q),
    );
  }, [availableEntities, searchQuery]);

  const entitiesByCategory = useMemo(() => {
    const groups: Record<string, typeof availableEntities> = {};
    for (const entity of filteredEntities) {
      const group = entity.category;
      if (!groups[group]) groups[group] = [];
      groups[group].push(entity);
    }
    return groups;
  }, [filteredEntities]);

  const handleCreate = () => {
    if (!targetEntityId || !relationshipType) return;
    if (direction === 'active-parent') {
      addRelationship(entityId, targetEntityId, relationshipType);
    } else {
      addRelationship(targetEntityId, entityId, relationshipType);
    }
    setTargetEntityId('');
    setRelationshipType('');
    setSearchQuery('');
    setDirection('active-parent');
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTargetEntityId('');
      setRelationshipType('');
      setSearchQuery('');
      setDirection('active-parent');
    }
    onOpenChange(newOpen);
  };

  const isValid = targetEntityId && relationshipType;
  if (!activeEntity) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-void-800 border-white/[0.08] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-bone-100 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-accent-gold" />Link Entity
          </DialogTitle>
          <DialogDescription className="text-ash-400">
            Create a connection from the active entity to another entity in your world.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2">
          {/* Direction Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-ash-500 uppercase tracking-wider font-medium">Direction</label>
            <div className="flex gap-2">
              <button onClick={() => setDirection('active-parent')}
                className={`flex items-center gap-2 flex-1 px-3 py-2.5 rounded-lg text-sm border transition-all ${
                  direction === 'active-parent'
                    ? 'bg-surface-600 border-accent-gold/50 text-bone-100'
                    : 'bg-void-900 border-white/[0.06] text-ash-400 hover:border-white/[0.12] hover:text-bone-300'
                }`}>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-xs">
                  <span className="text-accent-gold font-medium">{activeEntity.title}</span>
                  <span className="mx-1.5 text-ash-600">→</span>Target
                </span>
              </button>
              <button onClick={() => setDirection('active-child')}
                className={`flex items-center gap-2 flex-1 px-3 py-2.5 rounded-lg text-sm border transition-all ${
                  direction === 'active-child'
                    ? 'bg-surface-600 border-accent-gold/50 text-bone-100'
                    : 'bg-void-900 border-white/[0.06] text-ash-400 hover:border-white/[0.12] hover:text-bone-300'
                }`}>
                <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-xs">
                  Target<span className="mx-1.5 text-ash-600">→</span>
                  <span className="text-accent-gold font-medium">{activeEntity.title}</span>
                </span>
              </button>
            </div>
          </div>
          {/* Target Entity Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-ash-500 uppercase tracking-wider font-medium">Target Entity</label>
            <Select value={targetEntityId} onValueChange={setTargetEntityId}>
              <SelectTrigger className="w-full bg-void-900 border-white/[0.06] text-bone-300 hover:border-white/[0.12] focus:ring-accent-gold/30 focus:border-accent-gold/40 h-9">
                <div className="flex items-center gap-2 min-w-0">
                  <Search className="w-3.5 h-3.5 text-ash-600 flex-shrink-0" />
                  <SelectValue placeholder="Select target entity..." />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-void-800 border-white/[0.08] max-h-64">
                <div className="p-2 border-b border-white/[0.06]">
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search entities..."
                    className="bg-void-900 border-white/[0.06] text-bone-300 text-xs h-8 placeholder:text-ash-600 focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40"
                    onClick={(e) => e.stopPropagation()} />
                </div>
                {Object.entries(entitiesByCategory).map(([category, categoryEntities]) => (
                  <SelectGroup key={category}>
                    <SelectLabel className="text-ash-500 text-xs font-medium uppercase tracking-wider px-2 py-1">{category}</SelectLabel>
                    {categoryEntities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}
                        className="text-bone-300 focus:bg-surface-600 focus:text-bone-100 py-2 cursor-pointer">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate">{entity.title}</span>
                          <span className="text-ash-600 text-xs flex-shrink-0">{entity.uuid_short}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
                {filteredEntities.length === 0 && (
                  <div className="p-3 text-center text-ash-600 text-xs italic">No entities found</div>
                )}
              </SelectContent>
            </Select>
          </div>
          {/* Relationship Type Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-ash-500 uppercase tracking-wider font-medium">Relationship Type</label>
            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger className="w-full bg-void-900 border-white/[0.06] text-bone-300 hover:border-white/[0.12] focus:ring-accent-gold/30 focus:border-accent-gold/40 h-9">
                <SelectValue placeholder="Select relationship type..." />
              </SelectTrigger>
              <SelectContent className="bg-void-800 border-white/[0.08] max-h-60">
                {RELATIONSHIP_TYPES.map((type) => (
                  <SelectItem key={type} value={type}
                    className="text-bone-300 focus:bg-surface-600 focus:text-bone-100 capitalize cursor-pointer">
                    {type.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => handleOpenChange(false)}
            className="text-ash-400 hover:text-bone-300 hover:bg-surface-600">Cancel</Button>
          <Button onClick={handleCreate} disabled={!isValid}
            className="bg-accent-gold text-void-900 hover:bg-accent-gold-dim font-medium disabled:opacity-40 disabled:cursor-not-allowed">
            <Link2 className="w-4 h-4 mr-1.5" />Create Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
