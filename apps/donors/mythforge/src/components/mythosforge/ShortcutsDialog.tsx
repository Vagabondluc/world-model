'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface ShortcutsDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

interface ShortcutEntry {
  keys: string;
  description: string;
}

interface ShortcutSection {
  heading: string;
  shortcuts: ShortcutEntry[];
}

const sections: ShortcutSection[] = [
  {
    heading: 'General',
    shortcuts: [
      { keys: '⌘K  /  Ctrl+K', description: 'Command Palette' },
      { keys: '?  /  ⌘/', description: 'Keyboard Shortcuts' },
      { keys: 'Escape', description: 'Close dialog / overlay / deselect entity' },
    ],
  },
  {
    heading: 'Entity Actions',
    shortcuts: [
      { keys: '⌘N  /  Ctrl+N', description: 'New Entity' },
      { keys: '⌘D  /  Ctrl+D', description: 'Duplicate Active Entity' },
    ],
  },
  {
    heading: 'History',
    shortcuts: [
      { keys: '⌘Z  /  Ctrl+Z', description: 'Undo' },
      { keys: '⇧⌘Z  /  Ctrl+Shift+Z', description: 'Redo' },
    ],
  },
  {
    heading: 'File',
    shortcuts: [
      { keys: '⌘S  /  Ctrl+S', description: 'Save / Export World JSON' },
    ],
  },
  {
    heading: 'Workspace',
    shortcuts: [
      { keys: '⌘P  /  Ctrl+P', description: 'Path Finder (Graph mode only)' },
      { keys: 'Tab', description: 'Toggle DM Screen / GM HUD' },
    ],
  },
];

export function ShortcutsDialog({
  open,
  onOpenChange,
}: ShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-void-800 border-white/[0.08] sm:max-w-lg p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-accent-gold text-lg">
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription className="text-ash-500 text-sm">
              Quick-reference for all MythosForge hotkeys.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 max-h-80 overflow-y-auto mythosforge-scrollbar">
          {sections.map((section, sectionIndex) => (
            <div key={section.heading}>
              {sectionIndex > 0 && (
                <Separator className="bg-white/[0.06] my-3" />
              )}
              <p className="text-xs text-ash-500 uppercase tracking-wider font-semibold mb-2">
                {section.heading}
              </p>
              <div className="space-y-2">
                {section.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.keys}
                    className="grid grid-cols-[1fr_auto] items-center gap-3"
                  >
                    <span className="text-sm text-bone-300">
                      {shortcut.description}
                    </span>
                    <kbd className="bg-void-900 border border-white/[0.06] rounded-md px-2 py-1 text-[11px] font-mono text-bone-300 whitespace-nowrap">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/[0.06]">
          <p className="text-[11px] text-ash-500 text-center">
            MythosForge v1.0.0 — Dark Esoteric Edition
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
