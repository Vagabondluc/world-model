
import React from 'react';
import { useWorldStore } from '../../stores/useWorldStore';

interface InspectorJournalTabProps {
    hexId: string;
    content: string;
    onChange: (content: string) => void;
}

export const InspectorJournalTab: React.FC<InspectorJournalTabProps> = ({ hexId, content, onChange }) => {
    const { updateHexDescription } = useWorldStore();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        onChange(newVal);
        updateHexDescription(hexId, newVal);
    };

    return (
        <div className="h-full flex flex-col bg-slate-900">
            <div className="flex-none p-2 border-b border-slate-800 bg-slate-950/30">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-2">Field Notes (Markdown)</span>
            </div>
            <textarea
              value={content}
              onChange={handleChange}
              placeholder="# Entry Title\n\nRecord observations..."
              className="flex-1 w-full bg-transparent p-4 text-sm font-mono text-slate-300 focus:outline-none resize-none placeholder:text-slate-600 leading-relaxed"
            />
        </div>
    );
};
