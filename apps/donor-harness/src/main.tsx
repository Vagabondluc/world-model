import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Import donor app global styles (Tailwind directives + MI styles)
import '@mi/index.css'
// Local harness styles
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
