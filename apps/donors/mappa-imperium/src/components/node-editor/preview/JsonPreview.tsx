/**
 * JSON Preview
 * Renders raw execution results as formatted JSON.
 */

import React from 'react';

interface JsonPreviewProps {
    data: Record<string, any>;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
    return (
        <div className="bg-slate-900 text-slate-300 p-3 rounded font-mono text-[10px] overflow-auto max-h-[300px] border border-slate-700 shadow-inner">
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};
