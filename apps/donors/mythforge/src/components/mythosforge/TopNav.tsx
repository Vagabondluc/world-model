'use client';

import { BookOpen, FilePlus2, FolderOpen, Save } from 'lucide-react';

interface TopNavProps {
  onNewWorld: () => void;
  onOpenWorld: () => void;
  onSaveWorld: () => void;
}

export function TopNav({
  onNewWorld, onOpenWorld, onSaveWorld,
}: TopNavProps) {
  return (
    <nav className="flex h-11 items-center justify-between gap-3 bg-void-800 border-b border-white/[0.06] px-4 select-none">
      <div className="flex items-center gap-2">
        <BookOpen className="size-4 text-accent-gold" />
        <span className="font-bold text-accent-gold text-sm tracking-wide">Mythforge MVP</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewWorld}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-bone-300 hover:bg-white/[0.05] hover:text-bone-100"
        >
          <FilePlus2 className="size-3.5 text-ash-500" />
          New World
        </button>
        <button
          onClick={onOpenWorld}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-bone-300 hover:bg-white/[0.05] hover:text-bone-100"
        >
          <FolderOpen className="size-3.5 text-ash-500" />
          Open World
        </button>
        <button
          onClick={onSaveWorld}
          className="inline-flex items-center gap-1.5 rounded-md border border-accent-gold/30 bg-accent-gold/10 px-3 py-1.5 text-xs text-accent-gold hover:bg-accent-gold/15"
        >
          <Save className="size-3.5" />
          Save Canonical
        </button>
      </div>
    </nav>
  );
}
