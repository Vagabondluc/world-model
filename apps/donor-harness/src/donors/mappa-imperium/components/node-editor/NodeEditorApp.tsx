/**
 * Node Editor App Wrapper
 * 
 * This component serves as the root for the isolated Node Editor view.
 * It ensures the editor runs in a clean context without the main game's
 * overhead or UI interference.
 */

import React from 'react';
import { NodeEditor } from './NodeEditor';

const NodeEditorApp: React.FC = () => {
    return (
        <div className="w-screen h-screen overflow-hidden bg-slate-900 text-slate-800 font-sans">
            <NodeEditor />
        </div>
    );
};

export default NodeEditorApp;
