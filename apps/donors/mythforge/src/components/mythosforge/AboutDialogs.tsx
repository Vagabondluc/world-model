'use client';

import { BookOpen, Info, Users, Settings, Sun, Moon, Sparkles, Globe, Database, Layers } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useWorldStore } from '@/store/useWorldStore';
import { OllamaSettingsPanel } from './OllamaSettingsPanel';

export type AboutDialogType = 'version' | 'credits' | 'documentation' | 'preferences';

interface AboutDialogsProps {
  openDialog: AboutDialogType | null;
  onClose: () => void;
}

const DLG = 'bg-void-800 border-white/[0.08] text-bone-100 sm:max-w-lg';

const SHORTCUTS = [
  { keys: '⌘K', desc: 'Command Palette' },
  { keys: '⌘S', desc: 'Save / Backup (JSON)' },
  { keys: '⌘N', desc: 'New Entity' },
  { keys: '⌘Z / ⇧⌘Z', desc: 'Undo / Redo' },
  { keys: '⌘D', desc: 'Duplicate Entity' },
  { keys: '⌘P', desc: 'Path Finder (Graph view)' },
  { keys: 'Tab', desc: 'Toggle DM HUD' },
  { keys: '?', desc: 'Keyboard Shortcuts' },
  { keys: '⌘,', desc: 'Preferences' },
];

function VersionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (_v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DLG}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-accent-gold" />
            <DialogTitle className="text-accent-gold">MythosForge</DialogTitle>
            <Badge variant="outline" className="border-white/[0.12] text-bone-300 text-xs">v0.1.0</Badge>
          </div>
          <DialogDescription className="text-bone-400">Dark Esoteric Worldbuilding Tool</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-bone-300">
          <p>A worldbuilding workspace for crafting dark fantasy universes — from cosmos creation and pantheon design to campaigns, session logs, and interactive AI-powered lore expansion.</p>
          <Separator className="bg-white/[0.06]" />
          <div className="flex flex-wrap gap-1.5">
            {['Entity CRUD', 'Relationship Graph', 'AI Copilot', 'Calendar Forge', 'Session Logger', 'Command Palette', 'Path Finder'].map(f => (
              <Badge key={f} variant="outline" className="border-white/[0.08] text-bone-400 text-[10px]">{f}</Badge>
            ))}
          </div>
          <Separator className="bg-white/[0.06]" />
          <p className="text-xs text-ash-500">Data stored locally in your browser. Export anytime as JSON or Markdown ZIP.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreditsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (_v: boolean) => void }) {
  const tech = [
    { icon: Globe, label: 'Next.js 16', desc: 'React Framework' },
    { icon: Layers, label: 'React Flow', desc: 'Node Graph Visualization' },
    { icon: Database, label: 'Zustand', desc: 'State Management & Persistence' },
    { icon: Sparkles, label: 'z-ai-web-dev-sdk', desc: 'AI Chat Backend' },
    { icon: Sun, label: 'shadcn/ui', desc: 'Component Library' },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DLG}>
        <DialogHeader>
          <div className="flex items-center gap-2"><Users className="size-5 text-accent-gold" /><DialogTitle className="text-bone-100">Credits</DialogTitle></div>
          <DialogDescription className="text-bone-400">Built with modern web technologies</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm text-bone-300">
          {tech.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-white/[0.04] transition-colors">
              <Icon className="size-4 text-ash-400 shrink-0" />
              <span className="font-medium text-bone-200">{label}</span>
              <span className="text-xs text-ash-500 ml-auto">{desc}</span>
            </div>
          ))}
          <Separator className="bg-white/[0.06] my-2" />
          <p className="text-xs text-ash-500">Styled with Tailwind CSS 4 · Dark Esoteric Theme · Icons by Lucide</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DocumentationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (_v: boolean) => void }) {
  const openShortcuts = useWorldStore((s) => s.setShowShortcuts);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${DLG} sm:max-w-xl`}>
        <DialogHeader>
          <div className="flex items-center gap-2"><Info className="size-5 text-accent-gold" /><DialogTitle className="text-bone-100">Documentation</DialogTitle></div>
          <DialogDescription className="text-bone-400">Quick reference for MythosForge features and shortcuts</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-xs font-semibold text-ash-500 uppercase tracking-wider mb-2">Keyboard Shortcuts</h4>
            <div className="space-y-1.5">
              {SHORTCUTS.map(({ keys, desc }) => (
                <div key={keys} className="flex items-center justify-between gap-2">
                  <span className="text-bone-300 text-xs">{desc}</span>
                  <kbd className="text-[10px] text-bone-400 bg-void-700 border border-white/[0.08] px-1.5 py-0.5 rounded font-mono">{keys}</kbd>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-ash-500 uppercase tracking-wider mb-2">Features</h4>
            <ul className="space-y-1.5 text-xs text-bone-300">
              <li className="flex gap-2"><Sparkles className="size-3 text-accent-gold shrink-0 mt-0.5" /> <span><strong className="text-bone-200">AI Copilot</strong> — 4 modes: Architect, Lorekeeper, Scholar, Roleplayer</span></li>
              <li className="flex gap-2"><Layers className="size-3 text-accent-gold shrink-0 mt-0.5" /> <span><strong className="text-bone-200">Node Graph</strong> — Visualize entity relationships</span></li>
              <li className="flex gap-2"><Globe className="size-3 text-accent-gold shrink-0 mt-0.5" /> <span><strong className="text-bone-200">Calendar Forge</strong> — Design custom calendar systems</span></li>
              <li className="flex gap-2"><Database className="size-3 text-accent-gold shrink-0 mt-0.5" /> <span><strong className="text-bone-200">Session Logger</strong> — Track sessions with @-mentions</span></li>
              <li className="flex gap-2"><Settings className="size-3 text-accent-gold shrink-0 mt-0.5" /> <span><strong className="text-bone-200">Path Finder</strong> — Find paths between entities</span></li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="border-white/[0.08] text-bone-300 hover:bg-white/[0.06] hover:text-bone-100" onClick={() => { onOpenChange(false); setTimeout(() => openShortcuts(true), 100); }}>
            Open Full Shortcuts Dialog
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreferencesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (_v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="preferences-dialog" className={`${DLG} sm:max-w-2xl`}>
        <DialogHeader>
          <div className="flex items-center gap-2"><Settings className="size-5 text-accent-gold" /><DialogTitle className="text-bone-100">Preferences</DialogTitle></div>
          <DialogDescription className="text-bone-400">Configure MythosForge settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <OllamaSettingsPanel open={open} />
          <div className="flex items-center justify-between py-2 px-3 rounded-md bg-void-700/50 border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Moon className="size-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-bone-200">Dark Theme</p>
                <p className="text-xs text-ash-500">Esoteric dark color scheme</p>
              </div>
            </div>
            <Switch checked disabled />
          </div>
          <p className="text-[10px] text-ash-600 px-1">Additional preferences coming soon — theme switching, auto-save interval, default AI mode, etc.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AboutDialogs({ openDialog, onClose }: AboutDialogsProps) {
  return (
    <>
      <VersionDialog open={openDialog === 'version'} onOpenChange={(v) => { if (!v) onClose(); }} />
      <CreditsDialog open={openDialog === 'credits'} onOpenChange={(v) => { if (!v) onClose(); }} />
      <DocumentationDialog open={openDialog === 'documentation'} onOpenChange={(v) => { if (!v) onClose(); }} />
      <PreferencesDialog open={openDialog === 'preferences'} onOpenChange={(v) => { if (!v) onClose(); }} />
    </>
  );
}
