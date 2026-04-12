import React from 'react';
import type { SystemInfo } from '../types/debugTypes';

interface SystemInfoTabProps {
    systemInfo: SystemInfo | null;
}

const SystemInfoTab: React.FC<SystemInfoTabProps> = ({ systemInfo }) => {
    return (
        <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-900">Browser & Environment</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-900">
                    <div><strong className="block">User Agent:</strong> {systemInfo?.userAgent}</div>
                    <div><strong className="block">Viewport:</strong> {systemInfo?.viewport.width}x{systemInfo?.viewport.height}</div>
                    <div><strong className="block">Online:</strong> {systemInfo?.onlineStatus ? 'Yes' : 'No'}</div>
                    <div><strong className="block">Cookies:</strong> {systemInfo?.cookiesEnabled ? 'Enabled' : 'Disabled'}</div>
                    <div><strong className="block">Platform:</strong> {systemInfo?.platform}</div>
                </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-900">System Memory</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-900">
                    <div><strong className="block">JS Heap Limit:</strong> {systemInfo?.memory ? `${Math.round(systemInfo.memory.jsHeapSizeLimit / 1024 / 1024)}MB` : 'N/A'}</div>
                    <div><strong className="block">Total Heap Size:</strong> {systemInfo?.memory ? `${Math.round(systemInfo.memory.totalJSHeapSize / 1024 / 1024)}MB` : 'N/A'}</div>
                    <div><strong className="block">Used Heap Size:</strong> {systemInfo?.memory ? `${Math.round(systemInfo.memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A'}</div>
                </div>
            </div>
        </div>
    );
};

export default SystemInfoTab;