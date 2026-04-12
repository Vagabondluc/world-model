
/**
 * Procedural Audio Engine
 * Generates UI sound effects using Web Audio API to avoid external asset dependencies.
 */
import { useGameStore } from '../store/gameStore';

let audioCtx: AudioContext | null = null;

const getContext = () => {
  // Check mute setting from store
  const state = useGameStore.getState();
  if (state.settings?.ui?.audioMuted) return null;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Resume context on user interaction (required by browsers)
export const initAudio = () => {
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
};

const createOscillator = (freq: number, type: OscillatorType, startTime: number, duration: number) => {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gain.gain.setValueAtTime(0.1, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playClick = () => {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  createOscillator(800, 'sine', t, 0.1);
};

export const playJoin = () => {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  // Ascending Major Triad (C5 - E5 - G5)
  createOscillator(523.25, 'triangle', t, 0.3);
  createOscillator(659.25, 'triangle', t + 0.1, 0.3);
  createOscillator(783.99, 'triangle', t + 0.2, 0.6);
};

export const playWhisper = () => {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  // High pitched chime (E6), very pure
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1318.51, t); // E6
  
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5); // Long decay

  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(t);
  osc.stop(t + 1.5);
};

export const playChat = () => {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  
  // White noise buffer for paper rustle sound
  const bufferSize = ctx.sampleRate * 0.1; // 100ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1000;
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  noise.start(t);
};

export const playGong = () => {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  
  // Fundamental + Harmonics for metallic sound
  [100, 240, 290].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = i === 0 ? 'sine' : 'square'; // Fundamental is sine, harmonics are harsher
    osc.frequency.setValueAtTime(freq, t);
    // Slight detune for gong wobble
    osc.frequency.linearRampToValueAtTime(freq * 0.99, t + 3);

    gain.gain.setValueAtTime(0.3 / (i + 1), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(t);
    osc.stop(t + 4);
  });
};
