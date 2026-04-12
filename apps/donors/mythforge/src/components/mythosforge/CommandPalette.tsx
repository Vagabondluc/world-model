// =============================================================================
// MythosForge - Command Palette
// =============================================================================

'use client';

import { useRef } from 'react';
import { useWorldStore } from '@/store/useWorldStore';
import {
  CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command';
import { BookOpen } from 'lucide-react';
import { AI_MODES } from '@/lib/types';
import { importWorld } from '@/lib/io';
import { useToast } from '@/hooks/use-toast';
import { CATEGORY_ICON_MAP, AI_MODE_ICONS } from './command-palette/Categories';
import { CommandPaletteActions } from './command-palette/Actions';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { toast } = useToast();
  const {
    entities, setActiveEntity, setAiMode, aiMode,
  } = useWorldStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectEntity = (entityId: string) => {
    setActiveEntity(entityId);
    onOpenChange(false);
  };

  const handleAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { entities: importedEntities, relationships: importedRelationships } = await importWorld(file);
      useWorldStore.setState({
        entities: importedEntities,
        relationships: importedRelationships,
        activeEntityId: null,
        pinnedEntityIds: importedEntities.filter((e) => e.isPinned).map((e) => e.id),
      });
      toast({ title: 'World imported', description: `${importedEntities.length} entities loaded.` });
    } catch (err) {
      toast({ title: 'Import failed', description: err instanceof Error ? err.message : 'Could not read the file.', variant: 'destructive' });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange} title="Command Palette" description="Search entities, actions, and AI modes" className="bg-void-800 border-white/[0.08] rounded-xl shadow-2xl max-w-lg">
        <CommandInput placeholder="Search entities, actions..." className="text-bone-100 placeholder:text-ash-500 border-b-white/[0.06] bg-transparent" />
        <CommandList className="max-h-96 overflow-y-auto">
          <CommandEmpty className="text-ash-500">No results found.</CommandEmpty>
          {/* Entities Group */}
          <CommandGroup heading="Entities" className="[&_[cmdk-group-heading]]:text-ash-500">
            {entities.map((entity) => {
              const Icon = CATEGORY_ICON_MAP[entity.category] || BookOpen;
              return (
                <CommandItem
                  key={entity.id}
                  value={`entity-${entity.title}-${entity.uuid_short}`}
                  onSelect={() => handleSelectEntity(entity.id)}
                  className="text-bone-300 data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-bone-100 cursor-pointer"
                >
                  <Icon className="size-4 text-ash-500 shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{entity.title}</span>
                    <span className="text-[11px] text-ash-600">{entity.category} · {entity.uuid_short}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>

          {/* Actions Group (extracted) */}
          <CommandPaletteActions onAction={handleAction} />

          <CommandSeparator className="bg-white/[0.06]" />
          {/* AI Modes Group */}
          <CommandGroup heading="AI Modes" className="[&_[cmdk-group-heading]]:text-ash-500">
            {AI_MODES.map((mode) => {
              const Icon = AI_MODE_ICONS[mode.id];
              const isActive = aiMode === mode.id;
              return (
                <CommandItem
                  key={mode.id}
                  value={`ai-${mode.label.toLowerCase()}`}
                  onSelect={() => handleAction(() => setAiMode(mode.id))}
                  className={`cursor-pointer ${isActive ? 'text-accent-gold data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-accent-gold' : 'text-bone-300 data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-bone-100'}`}
                >
                  <Icon className={`size-4 shrink-0 ${isActive ? 'text-accent-gold' : 'text-ash-500'}`} />
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-sm font-medium">{mode.label}</span>
                    <span className="text-[11px] text-ash-600">{mode.description}</span>
                  </div>
                  {isActive && <span className="ml-auto text-[10px] text-accent-gold">●</span>}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Hidden file input for import */}
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
    </>
  );
}
