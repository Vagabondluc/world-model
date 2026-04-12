
import { create } from 'zustand';
import * as THREE from 'three';

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';

export enum TemporalRegime {
  LIVING = 'LIVING',     // Atmosphere active
  HISTORICAL = 'HISTORICAL', // Mid-speed, stats only
  GEOLOGIC = 'GEOLOGIC',   // Erosion/Tectonics active
}

// Visual Regimes for Rendering Stability (Spec 26)
export enum VisualRegime {
  REALTIME = 0, // <= 100x: Full animation
  FAST = 1,     // <= 1 day/sec: Fast sun, static clouds
  WARP = 2,     // <= 42 days/sec: Locked Sun, Interpolated Seasons
  HYPER = 3     // > 42 days/sec: Static Lighting, No Particles
}

interface TimeState {
  absoluteTime: bigint; // Microseconds
  timeScale: number;
  isPaused: boolean;
  autoPauseEnabled: boolean;
  solarWindFlux: number; // 0..1 intensity of solar activity
  
  // Performance Telemetry
  tps: number;
  
  // Actions
  tick: (dt: number) => void;
  setPaused: (paused: boolean) => void;
  setTimeScale: (scale: number) => void;
  setAutoPause: (enabled: boolean) => void;
  resetTime: () => void;
  setTps: (tps: number) => void;

  // System Gating Helpers
  getRegime: (dayLength: number, yearLengthDays: number) => TemporalRegime;
  getVisualRegime: () => VisualRegime;
  isAtmosphereActive: (dayLength: number) => boolean;
  isGeologicActive: (dayLength: number, yearLengthDays: number) => boolean;

  // Helpers (Calculated)
  getYear: (yearLengthDays: number, dayLengthSeconds: number) => number;
  getDayOfYear: (yearLengthDays: number, dayLengthSeconds: number) => number;
  getLocalTime: (dayLengthSeconds: number) => number; // 0..24
  getSeason: (yearLengthDays: number, dayLengthSeconds: number) => Season;
}

export const useTimeStore = create<TimeState>((set, get) => ({
  absoluteTime: 0n,
  timeScale: 40, // 40x speed = 1 game day (24h) per 36 real minutes
  isPaused: true, 
  autoPauseEnabled: true,
  solarWindFlux: 0.5,
  tps: 60,

  tick: (dt) => {
    if (get().isPaused) return;
    set((state) => {
      // dt is in seconds (float), timeScale is multiplier
      // We need microseconds: dt * timeScale * 1,000,000
      const deltaUs = BigInt(Math.floor(dt * state.timeScale * 1_000_000));
      const nextTime = state.absoluteTime + deltaUs;
      
      // Simulate an 11-year solar cycle with high frequency noise
      // For visual variation, we map it based on simple progress
      const timeSec = Number(nextTime / 1_000_000n);
      const cycleSpeed = 0.0005; 
      const baseFlux = 0.5 + 0.3 * Math.sin(timeSec * cycleSpeed);
      // Fast jitter
      const jitter = Math.sin(timeSec * 0.05) * 0.1 + Math.sin(timeSec * 0.13) * 0.05;
      
      return { 
        absoluteTime: nextTime,
        solarWindFlux: Math.max(0, Math.min(1, baseFlux + jitter))
      };
    });
  },

  setPaused: (paused) => set({ isPaused: paused }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  setAutoPause: (enabled) => set({ autoPauseEnabled: enabled }),
  resetTime: () => set({ absoluteTime: 0n }),
  setTps: (tps) => set({ tps }),

  getRegime: (dayLen, yearLenDays) => {
    const scale = get().timeScale;
    const yearLen = dayLen * yearLenDays;
    if (scale <= dayLen) return TemporalRegime.LIVING;
    if (scale >= yearLen * 20) return TemporalRegime.GEOLOGIC;
    return TemporalRegime.HISTORICAL;
  },

  getVisualRegime: () => {
    const scale = get().timeScale;
    if (scale <= 100) return VisualRegime.REALTIME;
    if (scale <= 86400) return VisualRegime.FAST;
    if (scale <= 3_628_800) return VisualRegime.WARP; // ~42 days/sec
    return VisualRegime.HYPER;
  },

  isAtmosphereActive: (dayLen) => get().timeScale <= dayLen,
  isGeologicActive: (dayLen, yearLenDays) => get().timeScale >= (dayLen * yearLenDays * 20),

  getYear: (yearLenDays, dayLenSec) => {
    const totalSeconds = Number(get().absoluteTime / 1_000_000n);
    return Math.floor(totalSeconds / (yearLenDays * dayLenSec));
  },
  
  getDayOfYear: (yearLenDays, dayLenSec) => {
    const totalSeconds = Number(get().absoluteTime / 1_000_000n);
    return Math.floor((totalSeconds / dayLenSec) % yearLenDays);
  },
  
  getLocalTime: (dayLenSec) => {
    const totalSeconds = Number(get().absoluteTime / 1_000_000n);
    return ((totalSeconds % dayLenSec) / dayLenSec) * 24;
  },

  getSeason: (yearLenDays, dayLenSec) => {
    const day = get().getDayOfYear(yearLenDays, dayLenSec);
    const progress = day / yearLenDays;
    if (progress < 0.25) return 'SPRING';
    if (progress < 0.50) return 'SUMMER';
    if (progress < 0.75) return 'AUTUMN';
    return 'WINTER';
  },
}));
