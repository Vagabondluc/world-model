import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import type { ConsoleEntry } from '../types/debugTypes';

interface ConsoleTabProps {
    consoleEntries: ConsoleEntry[];
    addEntry: (level: ConsoleEntry['level'], message: string, source?: string) => void;
    clearConsole: () => void;
}

const ConsoleTab: React.FC<ConsoleTabProps> = ({ consoleEntries, addEntry, clearConsole }) => {
    const consoleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [consoleEntries]);
    
    return (
        <div className="flex flex-col h-full">
          <div ref={consoleRef} className="flex-1 bg-gray-800 text-white font-mono text-xs p-4 rounded-lg overflow-y-auto">
            {consoleEntries.map((entry, i) => (
              <div key={i} className={`flex gap-3 py-1 ${
                entry.level === 'error' ? 'text-red-400' :
                entry.level === 'warn' ? 'text-yellow-400' :
                'text-gray-300'
              }`}>
                <span className="flex-shrink-0 text-gray-500">{entry.timestamp}</span>
                <span className="flex-shrink-0 font-bold">{`[${entry.source}]`}</span>
                <span className="flex-grow">{entry.message}</span>
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 mt-4">
            <div className="flex gap-2">
              <button onClick={() => addEntry('log', 'Test log message')} className="flex-1 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm text-white">Log</button>
              <button onClick={() => addEntry('warn', 'Test warning message')} className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-sm text-white">Warn</button>
              <button onClick={() => addEntry('error', 'Test error message')} className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm text-white">Error</button>
              <button onClick={clearConsole} className="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
    );
};

export default ConsoleTab;