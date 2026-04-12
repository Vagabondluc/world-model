
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { GameView, GameSessionConfig } from './types';
import Layout from './components/Layout';
import MobileLayout from './components/MobileLayout';
import MainView from './components/MainView';
import TimelineView from './components/TimelineView';
import SearchOverlay from './components/SearchOverlay';
import EndTurnModal from './components/EndTurnModal';
import DesignSystem from './components/DesignSystem';
import StartScreen from './components/StartScreen';
import SetupWizard from './components/SetupWizard';
import PlayerDashboard from './components/PlayerDashboard';
import ChroniclerView from './components/ChroniclerView';
import OnboardingHint from './components/OnboardingHint';
import TurnHandoverOverlay from './components/TurnHandoverOverlay';
import ShortcutsOverlay from './components/ShortcutsOverlay';
import TheArena from './components/TheArena';
import { LobbyView } from './components/LobbyView';
import WhisperingGallery from './components/WhisperingGallery';
import WorldCounselor from './components/WorldCounselor';
import { useGameStore } from './store/gameStore';
import { triggerHaptic } from './logic/haptics';
import { useSyncChannel } from './hooks/useSyncChannel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import AIController from './components/ai/AIController';
import GenerationMethodSelector from './components/genesis/GenerationMethodSelector';
import { getAvailableGenerators } from './logic/generators';
// import GlobeTestPage from './components/GlobeTestPage';
const DebugDashboard = lazy(() => import('./components/debug/DebugDashboard'));

type AppFlow = 'LANDING' | 'METHOD_SELECT' | 'WIZARD' | 'LOBBY' | 'GAME' | 'GLOBE_TEST';

const App: React.FC = () => {
  const [appFlow, setAppFlow] = useState<AppFlow>('LANDING');
  const [currentView, setCurrentView] = useState<GameView>(GameView.MAIN);
  const [joinCode, setJoinCode] = useState<string | undefined>(undefined);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEndTurnOpen, setIsEndTurnOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Store Hooks
  const config = useGameStore(state => state.config);
  const isHydrated = useGameStore(state => state.isHydrated);
  const onboardingStep = useGameStore(state => state.onboardingStep);
  const initializeSession = useGameStore(state => state.initializeSession);

  // Enable Networking (Local Sync & Lobby)
  useSyncChannel();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);

    // Check for join code
    const params = new URLSearchParams(window.location.search);
    const code = params.get('join');
    if (code) {
      setJoinCode(code);
      setAppFlow('LOBBY');
      // Clean URL
      window.history.replaceState({}, '', '/');
    }

    // Check for globe test route
    //   setAppFlow('GLOBE_TEST');
    // }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Stabilize handlers for keyboard shortcuts
  const handleNewGameClick = useCallback(() => { triggerHaptic('tap'); setAppFlow('METHOD_SELECT'); }, []);
  const handleLobbyClick = useCallback(() => { triggerHaptic('tap'); setAppFlow('LOBBY'); }, []);
  const handleContinueClick = useCallback(() => { triggerHaptic('confirm'); setAppFlow('GAME'); }, []);

  const handleWizardComplete = useCallback((newConfig: GameSessionConfig) => {
    initializeSession(newConfig);
    setAppFlow('GAME');
  }, [initializeSession]);

  const handleExitGame = useCallback(() => { triggerHaptic('reject'); setAppFlow('LANDING'); }, []);

  const toggleSearch = useCallback(() => {
    triggerHaptic('tap');
    setIsSearchOpen(p => !p);
  }, []);

  const toggleEndTurn = useCallback(() => {
    triggerHaptic('tap');
    setIsEndTurnOpen(p => !p);
  }, []);

  const toggleShortcuts = useCallback(() => {
    triggerHaptic('tap');
    setIsShortcutsOpen(p => !p);
  }, []);

  const toggleTimeline = useCallback(() => {
    triggerHaptic('tap');
    setCurrentView(prev => prev === GameView.TIMELINE ? GameView.MAIN : GameView.TIMELINE);
  }, []);

  const toggleDashboard = useCallback(() => {
    triggerHaptic('tap');
    setCurrentView(prev => prev === GameView.DASHBOARD ? GameView.MAIN : GameView.DASHBOARD);
  }, []);

  const toggleChronicler = useCallback(() => {
    triggerHaptic('tap');
    setCurrentView(prev => prev === GameView.CHRONICLER ? GameView.MAIN : GameView.CHRONICLER);
  }, []);

  const toggleCounselor = useCallback(() => {
    triggerHaptic('tap');
    setCurrentView(prev => prev === GameView.COUNSELOR ? GameView.MAIN : GameView.COUNSELOR);
  }, []);

  const toggleErrorState = useCallback(() => {
    setIsErrorState(p => {
      if (!p) triggerHaptic('reject');
      return !p;
    });
  }, []);

  const switchToMain = useCallback(() => setCurrentView(GameView.MAIN), []);

  const handleQuickStart = useCallback(() => {
    triggerHaptic('confirm');
    const quickConfig: GameSessionConfig = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      worldName: 'Quick World',
      mapSize: 'STANDARD',
      initialAge: 1,
      players: [
        { id: 'P1', name: 'The Architect', color: '#ffffff', isHuman: true, secret: '', avatar: 'eye', domain: 'FORGE' },
        { id: 'P2', name: 'The Weaver', color: '#a855f7', isHuman: false, secret: '', avatar: 'flare', domain: 'LIFE' }
      ],
      rules: { strictAP: true, draftMode: false },
      worldGen: { waterLevel: 0.5, mountainDensity: 0.3, forestDensity: 0.4, seed: Math.floor(Math.random() * 1000000) }
    };
    initializeSession(quickConfig);
    setAppFlow('GAME');
  }, [initializeSession]);

  // Enable Keyboard Shortcuts
  useKeyboardShortcuts(
    toggleSearch,
    toggleEndTurn,
    toggleDashboard,
    toggleChronicler,
    toggleTimeline,
    toggleShortcuts
  );

  const hasSave = !!config;

  // Loading Screen (Hydration Guard)
  if (!isHydrated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <div className="size-12 border-t-2 border-primary border-r-2 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse text-primary">Summoning World...</p>
      </div>
    );
  }

  if (appFlow === 'LANDING') {
    return <StartScreen onNewGame={handleNewGameClick} onJoinLobby={handleLobbyClick} onContinue={handleContinueClick} onQuickStart={handleQuickStart} hasSave={hasSave} />;
  }

  // if (appFlow === 'GLOBE_TEST') {
  //   return <GlobeTestPage />;
  // }

  if (appFlow === 'METHOD_SELECT') {
    const allGenerators = getAvailableGenerators();
    const generators = allGenerators.filter(gen => {
      // Show globe only if enabled in settings
      if (gen.experimental) {
        return useGameStore.getState().settings.genesis.enableGlobeMode;
      }
      return true;
    });

    return (
      <GenerationMethodSelector
        generators={generators}
        onSelect={(generatorId) => {
          if (generatorId === 'classic') {
            triggerHaptic('confirm');
            setAppFlow('WIZARD');
          } else if (generatorId === 'globe') {
            // TODO: Route to GlobeWizard when implemented
            triggerHaptic('reject');
            alert('Globe mode coming soon with Epic 045!');
          }
        }}
        onBack={() => setAppFlow('LANDING')}
      />
    );
  }

  if (appFlow === 'WIZARD') {
    return <SetupWizard onComplete={handleWizardComplete} onCancel={() => setAppFlow('METHOD_SELECT')} />;
  }

  if (appFlow === 'LOBBY') {
    return <LobbyView onStartGame={() => setAppFlow('GAME')} onExit={() => setAppFlow('LANDING')} initialJoinCode={joinCode} />;
  }

  return (
    <div className="relative h-screen w-screen flex flex-col bg-bg-dark font-sans text-sm antialiased overflow-hidden">
      <TurnHandoverOverlay />
      <AIController />
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <DebugDashboard />
        </Suspense>
      )}
      <WhisperingGallery />
      <TheArena />

      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
      {isEndTurnOpen && <EndTurnModal onClose={() => setIsEndTurnOpen(false)} />}
      {isShortcutsOpen && <ShortcutsOverlay onClose={() => setIsShortcutsOpen(false)} />}

      {appFlow === 'GAME' && <OnboardingHint step={onboardingStep} />}

      {currentView === GameView.CHRONICLER && (
        <ChroniclerView onClose={switchToMain} />
      )}

      {currentView === GameView.COUNSELOR && (
        <WorldCounselor onClose={switchToMain} />
      )}

      {currentView === GameView.DASHBOARD && (
        <PlayerDashboard onClose={switchToMain} onExitGame={handleExitGame} />
      )}

      {currentView === GameView.DESIGN_SYSTEM ? (
        <DesignSystem onExit={switchToMain} />
      ) : isMobile ? (
        <MobileLayout
          onSearchClick={toggleSearch}
          onEndTurnClick={toggleEndTurn}
          onShortcutsClick={toggleShortcuts}
          isErrorState={isErrorState}
          toggleErrorState={toggleErrorState}
        />
      ) : (
        <Layout
          onSearchClick={toggleSearch}
          onEndTurnClick={toggleEndTurn}
          onTimelineClick={toggleTimeline}
          onBrandClick={toggleDashboard}
          onChroniclerClick={toggleChronicler}
          onShortcutsClick={toggleShortcuts}
          onCounselorClick={toggleCounselor}
          isTimelineActive={currentView === GameView.TIMELINE}
          isErrorState={isErrorState}
        >
          {currentView === GameView.TIMELINE ? (
            <TimelineView onClose={switchToMain} />
          ) : (
            <MainView isErrorState={isErrorState} toggleErrorState={toggleErrorState} />
          )}
        </Layout>
      )}
    </div>
  );
};

export default App;
