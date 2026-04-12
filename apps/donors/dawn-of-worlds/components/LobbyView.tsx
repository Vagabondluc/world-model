
import React, { useState, useEffect } from 'react';
import { GameSessionConfig, PlayerConfig } from '../types';
import { PRESET_COLORS } from '../logic/wizard-data';
import { useGameStore } from '../store/gameStore';
import { triggerHaptic } from '../logic/haptics';
import { playJoin, initAudio } from '../logic/audio';
import { JoinScreen } from './lobby/JoinScreen';
import { ActiveLobby } from './lobby/ActiveLobby';

interface LobbyViewProps {
  onStartGame: () => void;
  onExit: () => void;
  initialJoinCode?: string;
}

export const LobbyView: React.FC<LobbyViewProps> = ({ onStartGame, onExit, initialJoinCode }) => {
  const config = useGameStore(state => state.config);
  const initializeSession = useGameStore(state => state.initializeSession);
  const updateConfig = useGameStore(state => state.updateConfig);
  
  const [sessionCode, setSessionCode] = useState(initialJoinCode || '');
  const [joinMode, setJoinMode] = useState(!!initialJoinCode);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);

  // Initialize Audio Context on mount interaction
  useEffect(() => {
    const unlockAudio = () => { initAudio(); window.removeEventListener('click', unlockAudio); };
    window.addEventListener('click', unlockAudio);
    return () => window.removeEventListener('click', unlockAudio);
  }, []);

  // Auto-join if config is missing but code is provided
  useEffect(() => {
    if (!config) {
      if (initialJoinCode) {
        handleJoinSession(initialJoinCode);
      } else {
        setJoinMode(true);
      }
    }
  }, [config, initialJoinCode]);

  const handleCreateHost = () => {
    const newConfig: GameSessionConfig = {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      worldName: 'New World',
      mapSize: 'STANDARD',
      initialAge: 1,
      players: [
        { id: 'P1', name: 'Host', color: PRESET_COLORS[0].hex, isHuman: true, avatar: 'person', domain: 'ORDER', isReady: true }
      ],
      rules: { strictAP: true, draftMode: false },
      // Added missing seed property to satisfy GameSessionConfig type
      worldGen: { waterLevel: 0.5, mountainDensity: 0.3, forestDensity: 0.4, seed: Math.floor(Math.random() * 1000000) }
    };
    initializeSession(newConfig);
    setMyPlayerId('P1');
    triggerHaptic('confirm');
    playJoin();
  };

  const handleJoinSession = (code?: string) => {
    const targetCode = code || sessionCode;
    if (targetCode.length < 4) return;
    
    // In a real networked app, we would fetch the config here.
    // For local sync, we initialize with a dummy config that matches the ID, 
    // and rely on useSyncChannel to pull the real config from the Host tab.
    const dummyConfig: GameSessionConfig = {
      id: targetCode.toUpperCase(),
      createdAt: 0,
      lastPlayed: 0,
      worldName: 'Joining...',
      mapSize: 'STANDARD',
      initialAge: 1,
      players: [],
      rules: { strictAP: true, draftMode: false },
      // Added missing seed property to satisfy GameSessionConfig type
      worldGen: { waterLevel: 0.5, mountainDensity: 0.3, forestDensity: 0.4, seed: 12345 }
    };
    initializeSession(dummyConfig);
    setJoinMode(false);
    playJoin();
  };

  const handleAddMyself = () => {
    if (!config) return;
    const newId = `P${config.players.length + 1}`;
    const nextColor = PRESET_COLORS[config.players.length % PRESET_COLORS.length].hex;
    const newPlayer: PlayerConfig = {
      id: newId,
      name: `Guest ${newId}`,
      color: nextColor,
      isHuman: true,
      avatar: 'person',
      domain: 'MORTAL',
      isReady: false
    };
    const updated = { ...config, players: [...config.players, newPlayer] };
    updateConfig(updated);
    setMyPlayerId(newId);
    triggerHaptic('confirm');
    playJoin();
  };

  const updateMyPlayer = (changes: Partial<PlayerConfig>) => {
    if (!config || !myPlayerId) return;
    const updatedPlayers = config.players.map(p => 
      p.id === myPlayerId ? { ...p, ...changes } : p
    );
    updateConfig({ ...config, players: updatedPlayers });
  };

  const toggleReady = () => {
    if (!config || !myPlayerId) return;
    const me = config.players.find(p => p.id === myPlayerId);
    if (me) {
      triggerHaptic('tap');
      updateMyPlayer({ isReady: !me.isReady });
    }
  };

  // Render "Join" Screen
  if (joinMode && !config) {
    return (
      <JoinScreen 
        sessionCode={sessionCode}
        setSessionCode={setSessionCode}
        onJoin={() => handleJoinSession()}
        onCreate={handleCreateHost}
        onExit={onExit}
      />
    );
  }

  // Render Lobby (Host & Guest)
  if (!config) return <div className="h-screen bg-black flex items-center justify-center text-white">Connecting...</div>;

  return (
    <ActiveLobby 
      config={config}
      myPlayerId={myPlayerId}
      onAddMyself={handleAddMyself}
      onUpdatePlayer={updateMyPlayer}
      onToggleReady={toggleReady}
      onStartGame={onStartGame}
      onExit={onExit}
    />
  );
};
