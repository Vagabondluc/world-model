import React from 'react';
import type { PerformanceMetrics } from '../types/debugTypes';

interface PerformanceTabProps {
    performanceMetrics: PerformanceMetrics | null;
    environment: string;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ performanceMetrics, environment }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-gray-900">Memory & CPU</h4>
                    <div className="space-y-2 text-gray-900">
                        <div className="flex justify-between"><span>Heap Usage:</span><span className="font-mono">{performanceMetrics?.memoryUsage || 0}MB</span></div>
                        <div className="flex justify-between"><span>Render Time:</span><span className="font-mono">{performanceMetrics?.renderTime || 0}ms</span></div>
                        <div className="flex justify-between"><span>DOM Nodes:</span><span className="font-mono">{performanceMetrics?.domNodes.toLocaleString() || 0}</span></div>
                        <div className="flex justify-between"><span>Frame Rate:</span><span className="font-mono">{performanceMetrics?.frameRate || 0}fps</span></div>
                    </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-gray-900">Network & Caching</h4>
                    <div className="space-y-2 text-gray-900">
                        <div className="flex justify-between"><span>Network Requests:</span><span className="font-mono">{performanceMetrics?.networkRequests || 0}</span></div>
                        <div className="flex justify-between"><span>Cache Hits:</span><span className="font-mono">{performanceMetrics?.cacheHits || 0}</span></div>
                        <div className="flex justify-between"><span>Bundle Size:</span><span className="font-mono">{Math.round((performanceMetrics?.bundleSize || 0) / 1024)}KB</span></div>
                        <div className="flex justify-between"><span>Content Strategy:</span><span className="font-mono text-blue-600">{environment === 'cloud-run' ? 'Bundled' : 'Hybrid'}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceTab;