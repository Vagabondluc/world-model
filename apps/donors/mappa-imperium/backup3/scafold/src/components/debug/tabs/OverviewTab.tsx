import React from 'react';
import { FileText, Zap, Database, Cloud } from 'lucide-react';
import type { DebugData } from '../types/debugTypes';

interface OverviewTabProps {
  debugData: DebugData;
  onRunAudit: () => void;
  onExportReport: () => void;
  onClearConsole: () => void;
  onNavigateToGameTools: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  debugData, 
  onRunAudit, 
  onExportReport, 
  onClearConsole, 
  onNavigateToGameTools 
}) => {
    const { fileHealthChecks, performanceMetrics, environment } = debugData;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2"><FileText className="w-5 h-5 text-blue-600" /><h3 className="font-semibold text-gray-900">Files</h3></div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{fileHealthChecks.filter(f => f.exists).length}/{fileHealthChecks.length}</div>
                    <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="bg-white border p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2"><Zap className="w-5 h-5 text-green-600" /><h3 className="font-semibold text-gray-900">Performance</h3></div>
                    <div className="text-2xl font-bold text-green-600 mb-1">{performanceMetrics ? `${performanceMetrics.renderTime}ms` : '-'}</div>
                    <p className="text-sm text-gray-600">Render Time</p>
                </div>
                <div className="bg-white border p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2"><Database className="w-5 h-5 text-purple-600" /><h3 className="font-semibold text-gray-900">Memory</h3></div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">{performanceMetrics ? `${performanceMetrics.memoryUsage}MB` : '-'}</div>
                    <p className="text-sm text-gray-600">Heap Size</p>
                </div>
                <div className="bg-white border p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2"><Cloud className="w-5 h-5 text-indigo-600" /><h3 className="font-semibold text-gray-900">Environment</h3></div>
                    <div className="text-lg font-bold text-indigo-600 mb-1 capitalize">{environment.replace('-', ' ')}</div>
                    <p className="text-sm text-gray-600">Deployment</p>
                </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button onClick={onRunAudit} className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">Run File Audit</button>
                    <button onClick={onExportReport} className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">Export Report</button>
                    <button onClick={onClearConsole} className="bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700">Clear Console</button>
                    <button onClick={onNavigateToGameTools} className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700">Game Tools</button>
                </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-900">System Health Summary</h3>
                <div className="space-y-2 text-gray-900">
                    <div className="flex items-center justify-between"><span>File Health:</span><span className={`font-mono ${fileHealthChecks.every(f => f.exists) ? 'text-green-600' : 'text-red-600'}`}>{fileHealthChecks.filter(f => f.exists).length}/{fileHealthChecks.length} OK</span></div>
                    <div className="flex items-center justify-between"><span>Content Strategy:</span><span className="font-mono text-blue-600">{environment === 'cloud-run' ? 'Bundled' : 'Fetch + Fallback'}</span></div>
                    <div className="flex items-center justify-between"><span>Average Load Time:</span><span className="font-mono">{fileHealthChecks.length > 0 ? `${(fileHealthChecks.reduce((sum, f) => sum + f.loadTime, 0) / fileHealthChecks.length).toFixed(1)}ms` : '-'}</span></div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;