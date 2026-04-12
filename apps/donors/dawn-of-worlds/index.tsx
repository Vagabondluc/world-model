import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// --- Architecture Enforcement ---
import { verifyArchitecture } from './logic/architecture';
import { chronicler } from './logic/chronicler';
import { useGameStore } from './store/gameStore';

// This ensures the project satisfies the constitution at compile time.
// It effectively "locks" the Chronicler and Simulation Core into the build.
try {
  verifyArchitecture(chronicler, useGameStore.getState());
} catch (e) {
  // Should never happen at runtime if TS compiles
  console.error("Architectural Violation:", e);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);