'use client';

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useWorldStore } from '@/store/useWorldStore';
import { TopNav } from '@/components/mythosforge/TopNav';
import { ExplorerTree } from '@/components/mythosforge/ExplorerTree';
import { Workspace } from '@/components/mythosforge/Workspace';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { ChevronRight, PanelRightClose } from 'lucide-react';
import { EntityModalWrapper, GMHudWrapper, MobileFABs, MobileSidebarDrawer } from './Overlays';
import { useToast } from '@/hooks/use-toast';
import { importWorld } from '@/lib/io';
import {
  hydrateMythforgeWorldState,
  isCanonicalWorldModelResponse,
  saveMythforgeCanonicalBundle,
  type MythforgeWorldStateOverlay,
} from '@/lib/world-model-client';

const STORAGE_KEY = 'mythforge-panel-layout';
const DEFAULT_SIZES = { sidebar: 24, workspace: 76 };
type MythforgeStoreState = ReturnType<typeof useWorldStore.getState>;

function loadPanelSizes() {
  if (typeof window === 'undefined') return DEFAULT_SIZES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        sidebar: typeof parsed.sidebar === 'number' ? parsed.sidebar : DEFAULT_SIZES.sidebar,
        workspace: typeof parsed.workspace === 'number' ? parsed.workspace : DEFAULT_SIZES.workspace,
      };
    }
  } catch {
    // ignore local storage failures
  }
  return DEFAULT_SIZES;
}

export default function Home() {
  const { toast } = useToast();
  const [initialSizes] = useState(() => loadPanelSizes());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sidebarPanelRef = useRef<React.ComponentRef<typeof Panel>>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  const handleLayoutChange = useCallback((layout: Record<string, number>) => {
    try {
      const sizes = {
        sidebar: layout['sidebar-panel'] ?? DEFAULT_SIZES.sidebar,
        workspace: layout['workspace-panel'] ?? DEFAULT_SIZES.workspace,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes));
    } catch {
      // ignore storage failures
    }
  }, []);

  const handleToggleSidebar = useCallback(() => {
    const ref = sidebarPanelRef.current as unknown as { isCollapsed: () => boolean; expand: () => void; collapse: () => void };
    if (!ref) return;
    if (ref.isCollapsed()) {
      ref.expand();
    } else {
      ref.collapse();
    }
  }, []);

  const handleSidebarResize = useCallback((info: { asPercentage: number }) => {
    setSidebarCollapsed(info.asPercentage <= 3);
  }, []);

  const buildWorldOverlay = useCallback((): MythforgeWorldStateOverlay => {
    const state = useWorldStore.getState();
    return {
      entities: state.entities,
      relationships: state.relationships,
      customCategories: state.customCategories,
      dmScreens: state.dmScreens,
      pinnedEntityIds: state.pinnedEntityIds,
      aiMode: state.aiMode,
      viewMode: state.viewMode,
    };
  }, []);

  const handleNewWorld = useCallback(() => {
    useWorldStore.getState().resetWorld();
    toast({
      title: 'World reset',
      description: 'Mythforge returned to the minimal MVP world state.',
    });
  }, [toast]);

  const handleSaveWorld = useCallback(async () => {
    try {
      setIsSaving(true);
      const response = await saveMythforgeCanonicalBundle(buildWorldOverlay());
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `mythforge-world-model-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      toast({
        title: 'Canonical bundle saved',
        description: 'Mythforge state was exported through the world-model driver.',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Unable to export the canonical bundle.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [buildWorldOverlay, toast]);

  const handleOpenWorld = useCallback(() => {
    importFileInputRef.current?.click();
  }, []);

  const handleImportFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const content = await file.text();
      const parsed = JSON.parse(content) as unknown;
      const currentState = buildWorldOverlay();

      if (isCanonicalWorldModelResponse(parsed)) {
        const hydrated = hydrateMythforgeWorldState(parsed, currentState);
        useWorldStore.setState({
          ...hydrated,
          activeEntityId: null,
        } as Partial<MythforgeStoreState>);
        toast({
          title: 'Canonical world loaded',
          description: 'Mythforge state was hydrated from a world-model bundle.',
        });
      } else {
        const legacy = await importWorld(file);
        useWorldStore.setState({
          entities: legacy.entities,
          relationships: legacy.relationships,
          pinnedEntityIds: legacy.entities.filter((entity) => entity.isPinned).map((entity) => entity.id),
          activeEntityId: null,
        } as Partial<MythforgeStoreState>);
        toast({
          title: 'Legacy world imported',
          description: 'The older JSON export format was loaded as a fallback.',
        });
      }
    } catch (error) {
      toast({
        title: 'Open failed',
        description: error instanceof Error ? error.message : 'Could not read the selected file.',
        variant: 'destructive',
      });
    } finally {
      if (importFileInputRef.current) {
        importFileInputRef.current.value = '';
      }
      setIsLoading(false);
    }
  }, [buildWorldOverlay, toast]);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-void-800 overflow-hidden">
      <div className="flex items-center justify-between h-10 px-3 border-b border-white/[0.06] flex-shrink-0">
        {!sidebarCollapsed && <span className="text-xs font-semibold text-ash-500 uppercase tracking-wider select-none">Explorer</span>}
        <button
          onClick={handleToggleSidebar}
          className="p-1.5 rounded-md hover:bg-surface-600 text-ash-500 hover:text-bone-300 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
        </button>
      </div>
      {!sidebarCollapsed && <div className="flex-1 overflow-y-auto min-h-0"><ExplorerTree /></div>}
    </div>
  );

  const panelContent: Record<string, ReactNode> = {
    sidebar: sidebarContent,
    workspace: <Workspace />,
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-void-900">
      <TopNav
        onNewWorld={handleNewWorld}
        onOpenWorld={handleOpenWorld}
        onSaveWorld={handleSaveWorld}
      />

      <div className="hidden md:flex flex-1 overflow-hidden">
        <PanelGroup orientation="horizontal" onLayoutChange={handleLayoutChange}>
          {(['sidebar', 'workspace'] as const).map((key, index) => (
            <Fragment key={key}>
              {index > 0 && (
                <PanelResizeHandle className="w-1.5 bg-void-800 hover:bg-surface-600 active:bg-accent-gold/30 transition-colors duration-150 relative group">
                  <div className="absolute inset-y-0 -left-1 -right-1" />
                </PanelResizeHandle>
              )}
              <Panel
                id={`${key}-panel`}
                defaultSize={initialSizes[key]}
                minSize={key === 'sidebar' ? 18 : 60}
                collapsible={key === 'sidebar'}
                collapsedSize={key === 'sidebar' ? 3 : undefined}
                {...(key === 'sidebar' ? { panelRef: sidebarPanelRef, onResize: handleSidebarResize } : {})}
              >
                {panelContent[key]}
              </Panel>
            </Fragment>
          ))}
        </PanelGroup>
      </div>

      <main className="md:hidden flex-1 overflow-hidden">
        <Workspace />
      </main>

      <MobileSidebarDrawer open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <MobileFABs onOpenSidebar={() => setMobileSidebarOpen(true)} />

      <EntityModalWrapper />
      <GMHudWrapper />

      <input
        ref={importFileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportFileChange}
        aria-hidden="true"
      />

      {isSaving && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4">
          <div className="rounded-full border border-white/[0.08] bg-void-800/90 px-4 py-2 text-xs text-bone-300 shadow-lg backdrop-blur-sm">
            Saving canonical world-model bundle...
          </div>
        </div>
      )}

      {isLoading && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4">
          <div className="rounded-full border border-white/[0.08] bg-void-800/90 px-4 py-2 text-xs text-bone-300 shadow-lg backdrop-blur-sm">
            Loading canonical world-model bundle...
          </div>
        </div>
      )}
    </div>
  );
}
