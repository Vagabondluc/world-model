
import React, { useEffect, useRef } from 'react';
import { useTimeStore } from '../stores/useTimeStore';
import { useWorldStore } from '../stores/useWorldStore';
import { SimSystem } from '../sim/SimSystem';
import { YEAR_US } from '../core/time/Constants';

/**
 * SimulationOrchestrator
 * Watches the absoluteTime from useTimeStore and triggers incremental
 * simulation steps in the useWorldStore (1.0) and SimSystem (2.0).
 */
export const SimulationOrchestrator: React.FC = () => {
  const { absoluteTime, timeScale, isPaused, isGeologicActive } = useTimeStore();
  const { config, simState, runGeologicStep, runCivStep, updatePlanetAge, syncClimateOverlay } = useWorldStore();
  
  // Track time with BigInt to match store
  const lastAbsoluteTimeRef = useRef<bigint>(absoluteTime);
  const accumulatedGeologicTimeRef = useRef(0);
  const lastClimateSyncTimeRef = useRef<bigint>(0n);

  useEffect(() => {
    if (isPaused) {
      lastAbsoluteTimeRef.current = absoluteTime;
      return;
    }

    // Calculate delta in microseconds
    // Ensure BigInt arithmetic to avoid type errors
    // Defensive check: absoluteTime should be bigint, but if store hydration fails or mocks act up, it might be number
    const currentAbs = typeof absoluteTime === 'bigint' ? absoluteTime : BigInt(Math.floor(Number(absoluteTime)));
    const lastAbs = typeof lastAbsoluteTimeRef.current === 'bigint' ? lastAbsoluteTimeRef.current : BigInt(Math.floor(Number(lastAbsoluteTimeRef.current)));
    
    const dt = currentAbs - lastAbs;
    lastAbsoluteTimeRef.current = currentAbs;

    if (dt <= 0n) return;

    // --- 2.0 Engine Update ---
    // dt is already BigInt microseconds from useTimeStore
    SimSystem.update(dt);

    // --- Visual Sync Throttle ---
    // Sync climate every ~5 days of game time to keep visuals smooth but performant
    const SYNC_INTERVAL = 5n * 24n * 3600n * 1_000_000n; 
    if (currentAbs - lastClimateSyncTimeRef.current > SYNC_INTERVAL) {
        syncClimateOverlay(SimSystem.climate);
        lastClimateSyncTimeRef.current = currentAbs;
    }

    // --- 1.0 Legacy Bridge ---
    const { dayLengthSeconds, yearLengthDays } = config.orbital;
    const yearInSeconds = dayLengthSeconds * yearLengthDays;
    
    // Convert dt (microseconds) to years (float)
    // dt (us) / 1,000,000 (s) / yearInSeconds
    const dtSeconds = Number(dt) / 1_000_000;
    const deltaYears = dtSeconds / yearInSeconds;

    if (deltaYears > 0) {
      updatePlanetAge(deltaYears);
    }

    if (simState.planetAge - simState.lastCivUpdate >= 0.1) {
      runCivStep();
    }

    if (isGeologicActive(dayLengthSeconds, yearLengthDays)) {
      accumulatedGeologicTimeRef.current += deltaYears;
      const GEOLOGIC_THRESHOLD_YEARS = 100;
      
      if (accumulatedGeologicTimeRef.current >= GEOLOGIC_THRESHOLD_YEARS) {
        runGeologicStep(accumulatedGeologicTimeRef.current);
        accumulatedGeologicTimeRef.current = 0;
      }
    } else {
      accumulatedGeologicTimeRef.current = 0;
    }

  }, [
    absoluteTime, 
    isPaused, 
    timeScale, 
    config.orbital, 
    isGeologicActive, 
    runGeologicStep, 
    runCivStep, 
    updatePlanetAge, 
    simState.planetAge, 
    simState.lastCivUpdate,
    syncClimateOverlay
  ]);

  return null;
};
