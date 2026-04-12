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
            <div className="space-y-2">
                {fileHealthChecks.map((check, index) => {
                    const status = getHealthStatus(check);
                    const isExpanded = expandedFiles.has(check.path);
                    return (
                        <div key={index} className={`border rounded-lg ${
                            status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}>
                            <div className="p-3 cursor-pointer flex items-center justify-between" onClick={() => toggleFileExpansion(check.path)}>
                                <div className="flex items-center gap-3">
                                    {getHealthIcon(status)}
                                    <span className="font-mono text-sm">{check.path}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="border-t p-3 bg-white">
                                  <div className="text-sm"><strong>Details:</strong> {check.lineCount} lines, {Math.round(check.size / 1024)}KB, {check.loadTime.toFixed(1)}ms load time from {check.source}.</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FileHealthTab;