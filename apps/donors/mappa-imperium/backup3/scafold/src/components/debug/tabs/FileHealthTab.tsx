import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import type { FileHealthCheck } from '../types/debugTypes';

interface FileHealthTabProps {
    fileHealthChecks: FileHealthCheck[];
}

const FileHealthTab: React.FC<FileHealthTabProps> = ({ fileHealthChecks }) => {
    const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

    const toggleFileExpansion = (filePath: string) => {
        const newExpanded = new Set(expandedFiles);
        newExpanded.has(filePath) ? newExpanded.delete(filePath) : newExpanded.add(filePath);
        setExpandedFiles(newExpanded);
    };

    const getHealthStatus = (check: FileHealthCheck) => {
        if (!check.exists) return 'error';
        if (check.errorMessage) return 'warning';
        return 'success';
    };

    const getHealthIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-4 text-gray-900">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">File Health Check Results</h3>
                <p className="text-sm text-blue-700">Analysis of application files, dependencies, and load performance.</p>
            </div>
            <div className="space-y-2">
                {fileHealthChecks.map((check, index) => {
                    const status = getHealthStatus(check);
                    const isExpanded = expandedFiles.has(check.path);
                    return (
                        <div key={index} className={`border rounded-lg ${
                            status === 'success' ? 'border-green-200 bg-green-50' :
                            status === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'
                        }`}>
                            <div className="p-3 cursor-pointer flex items-center justify-between" onClick={() => toggleFileExpansion(check.path)}>
                                <div className="flex items-center gap-3">
                                    {getHealthIcon(status)}
                                    <span className="font-mono text-sm">{check.path}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        check.source === 'fetch' ? 'bg-blue-100 text-blue-800' :
                                        check.source === 'bundled' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                    }`}>{check.source}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <span>{check.lineCount} lines</span>
                                    <span>{Math.round(check.size / 1024)}KB</span>
                                    <span>{check.loadTime.toFixed(1)}ms</span>
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="border-t p-3 bg-white"><div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div className="text-gray-900"><h5 className="font-medium mb-2">File Details</h5><div className="space-y-1"><div>Size: {check.size.toLocaleString()} bytes</div><div>Lines: {check.lineCount.toLocaleString()}</div><div>Load Time: {check.loadTime.toFixed(2)}ms</div><div>Source: {check.source}</div>{check.errorMessage && <div className="text-red-600">Error: {check.errorMessage}</div>}</div></div><div><h5 className="font-medium mb-2">Dependencies</h5><div className="space-y-1"><div><strong>References:</strong>{check.references.length > 0 ? <ul className="ml-4 list-disc">{check.references.map((ref, i) => <li key={i} className="font-mono text-xs">{ref}</li>)}</ul> : <span className="text-gray-500 ml-2">None</span>}</div><div><strong>Referenced By:</strong>{check.referencedBy.length > 0 ? <ul className="ml-4 list-disc">{check.referencedBy.map((ref, i) => <li key={i} className="font-mono text-xs">{ref}</li>)}</ul> : <span className="text-gray-500 ml-2">None</span>}</div></div></div></div></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FileHealthTab;