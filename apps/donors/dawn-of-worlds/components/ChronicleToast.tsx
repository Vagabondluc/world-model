import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { triggerHaptic } from '../logic/haptics';

interface ChronicleToastProps {
    onClick: () => void;
}

const ChronicleToast: React.FC<ChronicleToastProps> = ({ onClick }) => {
    const candidates = useGameStore(state => state.candidates);
    const [show, setShow] = useState(false);
    const prevCount = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const count = Object.keys(candidates || {}).length;

    useEffect(() => {
        // If we have more candidates than before, it's a new event!
        if (count > prevCount.current) {
            setShow(true);
            triggerHaptic('confirm');

            // Auto-hide after 6 seconds
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setShow(false);
            }, 6000);
        }
        prevCount.current = count;

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [count]);

    if (!show) return null;

    return (
        <div
            onClick={onClick}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] cursor-pointer animate-in slide-in-from-top-4 fade-in duration-500"
        >
            <div className="bg-bg-panel border border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.2)] rounded-full px-6 py-3 flex items-center gap-3 hover:bg-bg-panel/90 transition-colors">
                <div className="size-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                    <span className="material-symbols-outlined text-sm">history_edu</span>
                </div>
                <div>
                    <p className="text-xs font-black text-amber-500 uppercase tracking-widest">History Witnessed</p>
                    <p className="text-[10px] text-text-muted">A new event has been recorded.</p>
                </div>
                <span className="material-symbols-outlined text-white/20 text-sm">arrow_forward</span>
            </div>
        </div>
    );
};

export default ChronicleToast;
