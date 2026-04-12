/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index'; // Initialize Global Styles
import { AppContent } from './components/App';

const App = () => (
    <AppContent />
);

const container = document.getElementById('root');
if (container) {
    createRoot(container).render(<App />);
}
