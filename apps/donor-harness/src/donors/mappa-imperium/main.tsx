import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import NodeEditorApp from './components/node-editor/NodeEditorApp.tsx'
import ErrorBoundary from './components/shared/ErrorBoundary.tsx'
import './index.css'

// Simple URL-based router
const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {path === '/editor' ? <NodeEditorApp /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>,
)
