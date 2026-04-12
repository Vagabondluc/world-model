
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// @ts-ignore
const buildTime = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : new Date().toISOString();
console.log(`%c 🏗️ Build Timestamp: ${buildTime}`, 'background: #222; color: #bada55; padding: 4px; border-radius: 4px;');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
);
