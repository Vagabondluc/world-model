# Google AI Studio + Cloud Backend Integration Guide (Revised)

This document outlines a simplified, realistic, and phased approach to integrating a backend with the Mappa Imperium application, ensuring compatibility with the existing build-less AI Studio environment while providing a clear path to a robust Cloud Run deployment.

## Critical Issues with Over-Engineered Approaches

-   **Violates Build-less Philosophy**: Adding complex JavaScript classes or build steps to the frontend contradicts the project's deliberate build-less approach, which is necessary for AI Studio compatibility.
-   **Ignores Cloud Run Constraints**: A complex solution may not account for the stateless nature of the target deployment environment.
-   **Premature Optimization**: Adds complexity before validating the basic backend need.

## Phase 1: Minimal Backend Foundation (AI Studio Compatible)

This phase focuses on adding a simple, non-intrusive configuration to the existing frontend that allows it to gracefully switch between local storage and a backend API when it becomes available.

### 1. Add Configuration to `index.html`

Add this single, simple configuration block to `index.html`, after existing scripts but before your main React application script.

```html
<!-- Add this AFTER your existing scripts, before React code -->
<script>
  // Simple backend configuration - no classes or complex logic
  window.BACKEND_CONFIG = {
    // Auto-detect environment
    IS_AI_STUDIO: window.location.hostname.includes('googleusercontent.com'),
    IS_PRODUCTION: window.location.hostname.includes('.run.app'),
    
    // Simple feature flags - UPDATE THESE AFTER DEPLOYMENT
    HAS_BACKEND: false,
    API_BASE: null,
    
    // Simple fallback check
    canUseBackend: function() {
      return this.HAS_BACKEND && this.API_BASE && !this.IS_AI_STUDIO;
    }
  };
  
  // Simple API wrapper - no classes or complex patterns
  window.api = {
    // Save game state
    saveGame: async function(gameData) {
      if (window.BACKEND_CONFIG.canUseBackend()) {
        try {
          const response = await fetch(`${window.BACKEND_CONFIG.API_BASE}/api/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
          });
          return await response.json();
        } catch (error) {
          console.warn('Backend save failed, using localStorage:', error);
          return this.saveLocal(gameData);
        }
      } else {
        return this.saveLocal(gameData);
      }
    },
    
    // Load game state
    loadGame: async function(gameId) {
      if (window.BACKEND_CONFIG.canUseBackend()) {
        try {
          const response = await fetch(`${window.BACKEND_CONFIG.API_BASE}/api/load/${gameId}`);
          return await response.json();
        } catch (error) {
          console.warn('Backend load failed, using localStorage:', error);
          return this.loadLocal(gameId);
        }
      } else {
        return this.loadLocal(gameId);
      }
    },
    
    // Fallback to your existing localStorage logic
    saveLocal: function(gameData) {
      localStorage.setItem('mappaGameData', JSON.stringify(gameData));
      return Promise.resolve({ success: true, source: 'local' });
    },
    
    loadLocal: function(gameId) {
      const data = localStorage.getItem('mappaGameData');
      return Promise.resolve(data ? JSON.parse(data) : null);
    }
  };
</script>
```

### 2. React Integration (Minimal Changes)

Create a simple hook to check backend status and integrate the `window.api` wrapper into your existing components.

```typescript
// src/hooks/useSimpleBackend.ts
import { useState, useEffect } from 'react';

export function useSimpleBackend() {
  const [backendStatus, setBackendStatus] = useState('checking');
  
  useEffect(() => {
    const checkBackend = async () => {
      if (window.BACKEND_CONFIG.canUseBackend()) {
        try {
          const response = await fetch(`${window.BACKEND_CONFIG.API_BASE}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
          });
          if (response.ok) {
            setBackendStatus('connected');
            return;
          }
        } catch (error) {
          console.log('Backend not available:', error.message);
        }
      }
      setBackendStatus('local');
    };
    
    checkBackend();
  }, []);
  
  return {
    isBackendConnected: backendStatus === 'connected',
    isLocal: backendStatus === 'local',
    status: backendStatus
  };
}

// Example usage in a component:
/*
function YourExistingGameComponent() {
  const { isBackendConnected, status } = useSimpleBackend();
  
  const handleSave = async (gameData) => {
    const result = await window.api.saveGame(gameData);
    console.log('Game saved:', result.source); // 'backend' or 'local'
  };
  
  return (
    <div>
      <div className={`text-xs p-2 ${isBackendConnected ? 'bg-green-100' : 'bg-yellow-100'}`}>
        Status: {status === 'connected' ? 'Cloud sync active' : 'Local storage mode'}
      </div>
      <button onClick={() => handleSave(yourGameData)}>Save Game</button>
    </div>
  );
}
*/
```

## Phase 2: Backend Implementation (Outside AI Studio)

This work should be done locally or in a cloud environment like GitHub Codespaces, then deployed to Cloud Run.

### Minimal Node.js Backend

**`server.js`**
```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const games = new Map(); // Replace with a real database in a later phase

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/save', (req, res) => {
  try {
    const gameData = req.body;
    const gameId = gameData.id || `game-${Date.now()}`;
    if (!gameData || typeof gameData !== 'object') {
      return res.status(400).json({ error: 'Invalid game data' });
    }
    games.set(gameId, { ...gameData, id: gameId, savedAt: new Date().toISOString() });
    res.json({ success: true, gameId, source: 'backend', message: 'Game saved' });
  } catch (error) {
    res.status(500).json({ error: 'Save failed', details: error.message });
  }
});

app.get('/api/load/:gameId', (req, res) => {
  const { gameId } = req.params;
  const gameData = games.get(gameId);
  if (!gameData) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(gameData);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Simple `Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server.js ./
EXPOSE 8080
CMD ["node", "server.js"]
```

### Simple `package.json`

```json
{
  "name": "mappa-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "engines": { "node": ">=18" }
}
```

## Phase 3: Deployment Strategy

1.  **Repository Structure**: Create a monorepo with `frontend/` (your AI Studio code) and `backend/` directories.
2.  **Continuous Deployment**: Use a service like GitHub Actions to automatically deploy both the frontend and backend to separate Google Cloud Run services.
3.  **Enable Backend in Frontend**: After deployment, update the `window.BACKEND_CONFIG` object in `index.html` with the new backend URL:
    ```javascript
    window.BACKEND_CONFIG.HAS_BACKEND = true;
    window.BACKEND_CONFIG.API_BASE = 'https://mappa-backend-[YOUR-PROJECT].run.app';
    ```

## Migration Path

1.  **Week 1**: Implement the frontend changes (Phase 1) in AI Studio. The app remains fully functional using local storage.
2.  **Week 2**: Set up the GitHub repository and Actions for deployment.
3.  **Week 3**: Deploy the minimal backend and test the live integration.
4.  **Future**: Replace the in-memory `Map` storage in `server.js` with a persistent database like Cloud Firestore or Cloud SQL. Expand API capabilities as needed.

This approach respects the current constraints while providing a clear, low-risk path to full backend functionality without over-engineering the solution.