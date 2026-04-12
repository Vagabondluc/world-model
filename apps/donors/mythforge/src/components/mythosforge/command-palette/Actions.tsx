// =============================================================================
// MythosForge - Command Palette: Action Items Group
// =============================================================================

'use client';

import {
  FilePlus, LayoutGrid, Network, MonitorSmartphone, ArrowLeftRight,
  Copy, CalendarDays, Shield,
} from 'lucide-react';
import {
  CommandItem, CommandGroup, CommandSeparator,
} from '@/components/ui/command';
import { useWorldStore } from '@/store/useWorldStore';

const MI = 'text-bone-300 data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-bone-100 cursor-pointer';

interface CommandPaletteActionsProps {
  onAction: (_action: () => void) => void;
}

export function CommandPaletteActions({ onAction }: CommandPaletteActionsProps) {
  const {
    setViewMode, toggleGmHud, toggleLayoutInversion,
    addEntity, setActiveEntity, activeEntityId, duplicateEntity,
    viewMode, addDmScreen,
  } = useWorldStore();

  return (
    <>
      <CommandSeparator className="bg-white/[0.06]" />
      {/* Actions Group */}
      <CommandGroup heading="Actions" className="[&_[cmdk-group-heading]]:text-ash-500">
        <CommandItem
          value="action-new-entity"
          onSelect={() => onAction(() => { const e = addEntity('Untitled Entity', 'Lore Note', '', {}); setActiveEntity(e.id); })}
          className={MI}
        >
          <FilePlus className="size-4 text-ash-500" />
          New Entity
          <span className="ml-auto text-xs text-ash-600">⌘N</span>
        </CommandItem>
        {activeEntityId && (
          <CommandItem
            value="action-duplicate-entity"
            onSelect={() => onAction(() => { const dup = duplicateEntity(activeEntityId); if (dup) setActiveEntity(dup.id); })}
            className={MI}
          >
            <Copy className="size-4 text-ash-500" />
            Duplicate Active Entity
            <span className="ml-auto text-xs text-ash-600">⌘D</span>
          </CommandItem>
        )}
        <CommandItem
          value="action-toggle-view"
          onSelect={() => onAction(() => setViewMode(viewMode === 'grid' ? 'graph' : 'grid'))}
          className={MI}
        >
          {viewMode === 'grid' ? <Network className="size-4 text-ash-500" /> : <LayoutGrid className="size-4 text-ash-500" />}
          Toggle Grid / Graph View
          <span className="ml-auto text-xs text-ash-600">{viewMode === 'grid' ? '→ Graph' : '→ Grid'}</span>
        </CommandItem>
        <CommandItem value="action-toggle-dm" onSelect={() => onAction(toggleGmHud)} className={MI}>
          <MonitorSmartphone className="size-4 text-ash-500" />
          Toggle DM Screen
          <span className="ml-auto text-xs text-ash-600">Tab</span>
        </CommandItem>
        <CommandItem value="action-new-dm-screen" onSelect={() => onAction(() => { addDmScreen('New Screen'); toggleGmHud(); })} className={MI}>
          <Shield className="size-4 text-ash-500" />
          Create New DM Screen
        </CommandItem>
        <CommandItem value="action-invert-layout" onSelect={() => onAction(toggleLayoutInversion)} className={MI}>
          <ArrowLeftRight className="size-4 text-ash-500" />
          Invert Layout
        </CommandItem>
        <CommandItem
          value="action-calendar-forge"
          onSelect={() => onAction(() => setViewMode('forge'))}
          className={MI}
        >
          <CalendarDays className="size-4 text-ash-500" />
          Open Calendar Forge
        </CommandItem>
      </CommandGroup>
    </>
  );
}
