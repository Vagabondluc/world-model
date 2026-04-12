import React from 'react';
import type { ConnectionStatus } from '../../types';
import { useGame } from '../../contexts/GameContext';

const CollaborationStatus = () => {
    const { connectionStatus } = useGame();

    const statusText: { [key in ConnectionStatus]: string } = {
        connecting: 'Connecting to collaboration service...',
        connected: 'Collaboration Status: Connected',
        disconnected: 'Collaboration Status: Disconnected',
    };

    const bgColor: { [key in ConnectionStatus]: string } = {
        connecting: 'bg-yellow-600',
        connected: 'bg-green-700',
        disconnected: 'bg-red-700',
    };


    return (
        <footer className={`${bgColor[connectionStatus]} text-white p-2 text-center text-sm w-full z-10 transition-colors duration-500`}>
            {statusText[connectionStatus]}
        </footer>
    );
}

export default CollaborationStatus;
