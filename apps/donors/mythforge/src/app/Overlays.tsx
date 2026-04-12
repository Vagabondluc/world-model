'use client';

import { useWorldStore } from '@/store/useWorldStore';
import { ShortcutsDialog } from '@/components/mythosforge/ShortcutsDialog';
import { CommandPalette } from '@/components/mythosforge/CommandPalette';
import { TemplateManager } from '@/components/mythosforge/TemplateManager';
import { EntityModal } from '@/components/mythosforge/EntityModal';
import { GMHud } from '@/components/mythosforge/GMHud';
import { ExplorerTree } from '@/components/mythosforge/ExplorerTree';
import { X, Menu } from 'lucide-react';

// =============================================================================
// Dialog Overlays
// =============================================================================

export function ShortcutsDialogWrapper() {
  const showShortcuts = useWorldStore((s) => s.showShortcuts);
  const setShowShortcuts = useWorldStore((s) => s.setShowShortcuts);
  return <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />;
}

export function CommandPaletteWrapper({ open, onOpenChange }: { open: boolean; onOpenChange: (_v: boolean) => void }) {
  return <CommandPalette open={open} onOpenChange={onOpenChange} />;
}

export function TemplateManagerWrapper({ open, onOpenChange }: { open: boolean; onOpenChange: (_v: boolean) => void }) {
  return <TemplateManager open={open} onOpenChange={onOpenChange} />;
}

export function EntityModalWrapper() {
  return <EntityModal />;
}

export function GMHudWrapper() {
  return <GMHud />;
}

// =============================================================================
// Mobile Sidebar Drawer (< md)
// =============================================================================

export function MobileSidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <aside className="absolute inset-y-0 left-0 w-72 bg-void-800 border-r border-white/[0.08] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between h-10 px-3 border-b border-white/[0.06]">
          <span className="text-xs font-semibold text-ash-500 uppercase tracking-wider">Explorer</span>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface-600 text-ash-500 hover:text-bone-300 transition-colors" title="Close sidebar">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-[calc(100%-40px)] overflow-y-auto"><ExplorerTree /></div>
      </aside>
    </div>
  );
}

// =============================================================================
// Floating Action Buttons (mobile only)
// =============================================================================

export function MobileFABs({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <>
      <button
        onClick={onOpenSidebar}
        className="md:hidden fixed top-14 left-3 z-40 p-2 rounded-lg bg-void-800/90 border border-white/[0.08] shadow-lg text-ash-400 hover:text-bone-300 hover:bg-void-700 transition-colors backdrop-blur-sm"
        title="Open explorer" aria-label="Open explorer sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
