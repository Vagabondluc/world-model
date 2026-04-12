import React, { useEffect, useRef } from 'react';
import { useBackendStore } from '../../stores/backendStore';
import { Terminal } from 'lucide-react';

export const LogViewer: React.FC = () => {
    const logs = useBackendStore(state => state.logs);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getLogColor = (log: string) => {
        if (log.includes('[ERROR]')) return 'text-rose-400';
        if (log.includes('[WARNING]')) return 'text-amber-400';
        if (log.includes('[INFO]')) return 'text-emerald-400/80';
        return 'text-slate-300/80';
    };

    return (
        <div className="flex flex-col h-48 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden font-mono text-[11px]">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border-b border-slate-800 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold tracking-tight">System Console</span>
                <div className="ml-auto flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-0.5 custom-scrollbar">
                {logs.length === 0 && (
                    <div className="text-slate-600 italic">Awaiting connection to backend logs...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className={`${getLogColor(log)} break-all leading-relaxed`}>
                        {log}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
