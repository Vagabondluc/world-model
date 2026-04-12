'use client';

import {
  FilePlus, FolderOpen, Save, FileDown, Upload, Search, Undo2, Redo2, Settings,
  BookText, Info, Users, ArrowLeftRight, LayoutGrid, Network, ServerCog,
  Copy, Route, Keyboard, Clock, ScrollText, CalendarDays, Shield, type LucideIcon,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorldStore } from '@/store/useWorldStore';
import { downloadWorldJSON } from '@/lib/io';
import { exportWorldAsMarkdown } from '@/lib/export-markdown';
import type { ViewMode } from '@/lib/types';

interface NavMenusProps {
  onCommandPaletteOpen: () => void;
  onImportLore: () => void;
  onTemplateManagerOpen: () => void;
  onPathFinderOpen: () => void;
  onAboutAction: (_action: string) => void;
}

const MI = 'text-bone-300 focus:bg-white/[0.06] focus:text-bone-100 cursor-pointer';

type StdItem = { action: string; icon: LucideIcon; label: string; shortcut?: string; disabled?: boolean; iconClass?: string };

function NavTrigger({ label, testId }: { label: string; testId?: string }) {
  return (
    <DropdownMenuTrigger asChild>
      <button data-testid={testId} className="text-xs text-ash-500 hover:text-bone-300 transition-colors px-2 py-1 rounded-sm hover:bg-white/[0.04] cursor-pointer">{label}</button>
    </DropdownMenuTrigger>
  );
}

function StdMenu({ label, width, items, onAction }: {
  label: string; width?: string;
  items: (StdItem | 'sep')[]; onAction: (_a: string) => void;
}) {
  return (
    <DropdownMenu>
      <NavTrigger label={label} testId={`nav-${label.toLowerCase()}`} />
      <DropdownMenuContent sideOffset={4} align="start" className={`${width ?? 'w-52'} bg-void-800 border-white/[0.08] text-bone-300`}>
        {items.map((item, i) => item === 'sep'
          ? <DropdownMenuSeparator key={i} className="bg-white/[0.06]" />
          : (() => { const Icon = item.icon; return (
              <DropdownMenuItem key={item.action} data-testid={`menu-${item.action}`} onClick={() => onAction(item.action)} disabled={item.disabled}
              className={`${item.disabled ? 'text-ash-600 opacity-50' : MI} cursor-pointer`}>
              <Icon className={`size-4 ${item.iconClass ?? 'text-ash-500'}`} />
              {item.label}
              {item.shortcut && <DropdownMenuShortcut className="text-ash-600 text-xs">{item.shortcut}</DropdownMenuShortcut>}
            </DropdownMenuItem>
          ); })()
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const VIEW_MODES: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
  { mode: 'grid', icon: LayoutGrid, label: 'Grid' },
  { mode: 'graph', icon: Network, label: 'Graph' },
  { mode: 'timeline', icon: Clock, label: 'Timeline' },
  { mode: 'session', icon: ScrollText, label: 'Sessions' },
  { mode: 'forge', icon: CalendarDays, label: 'Calendar Forge' },
];

export function NavMenus({ onCommandPaletteOpen, onImportLore, onTemplateManagerOpen, onPathFinderOpen, onAboutAction }: NavMenusProps) {
  const { isLayoutInverted, toggleLayoutInversion, viewMode, setViewMode, toggleGmHud, undo, redo, canUndo, canRedo } = useWorldStore();

  const handleAction = (action: string) => {
    const map: Record<string, () => void> = {
      'new-world': () => useWorldStore.getState().resetWorld(),
      'open-world': onImportLore,
      'import-lore': onImportLore,
      'save-json': () => { const s = useWorldStore.getState(); downloadWorldJSON({ entities: s.entities, relationships: s.relationships }); },
      'export-markdown': () => { const s = useWorldStore.getState(); exportWorldAsMarkdown({ entities: s.entities, relationships: s.relationships }); },
      'global-search': onCommandPaletteOpen,
      'undo': undo, 'redo': redo,
      'template-manager': onTemplateManagerOpen,
      'path-finder': onPathFinderOpen,
      'shortcuts': () => useWorldStore.getState().setShowShortcuts(true),
      'preferences': () => onAboutAction('preferences'),
      'ollama-settings': () => onAboutAction('preferences'),
      'documentation': () => onAboutAction('documentation'),
      'version': () => onAboutAction('version'),
      'credits': () => onAboutAction('credits'),
      'dm-screen': toggleGmHud,
      'invert-layout': toggleLayoutInversion,
    };
    (map[action] ?? (() => {}))();
  };

  const ud = !canUndo();
  const rd = !canRedo();

  // ── File ──
  const fileItems: (StdItem | 'sep')[] = [
    { action: 'new-world', icon: FilePlus, label: 'New World' },
    { action: 'open-world', icon: FolderOpen, label: 'Open World…' },
    'sep',
    { action: 'save-json', icon: Save, label: 'Save as JSON', shortcut: '⌘S' },
    { action: 'export-markdown', icon: FileDown, label: 'Export as Markdown', shortcut: '⇧⌘E' },
    { action: 'import-lore', icon: Upload, label: 'Import Lore…' },
  ];

  // ── Edit ──
  const editItems: (StdItem | 'sep')[] = [
    { action: 'global-search', icon: Search, label: 'Search Entities', shortcut: '⌘K' },
    'sep',
    { action: 'undo', icon: Undo2, label: 'Undo', shortcut: '⌘Z', disabled: ud, iconClass: ud ? 'text-ash-600' : 'text-ash-500' },
    { action: 'redo', icon: Redo2, label: 'Redo', shortcut: '⇧⌘Z', disabled: rd, iconClass: rd ? 'text-ash-600' : 'text-ash-500' },
    'sep',
    { action: 'template-manager', icon: Copy, label: 'Entity Templates' },
    { action: 'preferences', icon: Settings, label: 'Preferences', shortcut: '⌘,' },
    { action: 'ollama-settings', icon: ServerCog, label: 'Ollama Settings' },
  ];

  // ── View ──
  const vm = (m: string) => viewMode === m;
  const vic = (m: string) => vm(m) ? 'text-accent-gold' : 'text-ash-500';
  const vc = (m: string) => vm(m) ? 'text-accent-gold focus:bg-white/[0.06] focus:text-accent-gold' : '';

  return (
    <>
      <StdMenu label="File" items={fileItems} onAction={handleAction} />
      <StdMenu label="Edit" items={editItems} onAction={handleAction} />

      {/* View Menu */}
      <DropdownMenu>
        <NavTrigger label="View" />
        <DropdownMenuContent sideOffset={4} align="start" className="w-52 bg-void-800 border-white/[0.08] text-bone-300">
          {/* Layout */}
          <DropdownMenuItem onClick={() => handleAction('invert-layout')} className={MI}>
            <ArrowLeftRight className="size-4 text-ash-500" /> Invert Panel Layout
            <DropdownMenuShortcut className="text-ash-600 text-[10px] ml-auto">{isLayoutInverted ? 'Chat ← Tree' : 'Tree ← Chat'}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/[0.06]" />

          {/* Workspace Views */}
          {VIEW_MODES.map(({ mode, icon: Icon, label }) => (
            <DropdownMenuItem key={mode} onClick={() => setViewMode(mode)} className={`cursor-pointer ${MI} ${vc(mode)}`}>
              <Icon className={`size-4 ${vic(mode)}`} /> {label}
              {vm(mode) && <span className="ml-auto text-[10px] text-accent-gold">●</span>}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-white/[0.06]" />

          {/* DM Screen */}
          <DropdownMenuItem onClick={() => handleAction('dm-screen')} className={MI}>
            <Shield className="size-4 text-ash-500" /> DM Screen
            <DropdownMenuShortcut className="text-ash-600 text-xs">Tab</DropdownMenuShortcut>
          </DropdownMenuItem>

          {/* Path Finder — only meaningful in graph */}
          <DropdownMenuItem onClick={() => handleAction('path-finder')} className={MI}>
            <Route className="size-4 text-ash-500" /> Path Finder
            <DropdownMenuShortcut className="text-ash-600 text-xs">⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help Menu */}
      <StdMenu label="Help" items={[
        { action: 'shortcuts', icon: Keyboard, label: 'Keyboard Shortcuts', shortcut: '?' },
        'sep',
        { action: 'documentation', icon: BookText, label: 'Documentation' },
        { action: 'version', icon: Info, label: 'About MythosForge' },
        { action: 'credits', icon: Users, label: 'Credits' },
      ]} onAction={handleAction} />
    </>
  );
}
