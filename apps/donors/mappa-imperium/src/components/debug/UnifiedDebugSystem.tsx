import React, { useState, useEffect } from 'react';
import { Bug, Monitor, FileText, Zap, Database, Activity, Settings, ShieldCheck } from 'lucide-react';

import { useFileHealthCheck } from './hooks/useFileHealthCheck';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';
import { useSystemInfo } from './hooks/useSystemInfo';
import { useConsoleLogger } from './hooks/useConsoleLogger';
import { useEnvironmentConstraints } from './hooks/useEnvironmentConstraints';


import OverviewTab from './tabs/OverviewTab';
import FileHealthTab from './tabs/FileHealthTab';
import PerformanceTab from './tabs/PerformanceTab';
import SystemInfoTab from './tabs/SystemInfoTab';
import ConsoleTab from './tabs/ConsoleTab';
import GameToolsTab from './tabs/GameToolsTab';
import EnvironmentConstraintsTab from './tabs/EnvironmentConstraintsTab';

import { exportDebugReport } from './utils/reportExporter';
import type { UnifiedDebugSystemProps } from './types/debugTypes';

const UnifiedDebugSystem: React.FC<UnifiedDebugSystemProps> = (props) => {
  const { isOpen, onClose } = props;
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'performance' | 'system' | 'console' | 'game-tools' | 'environment'>('overview');
  
  const fileHealth = useFileHealthCheck(isOpen);
  const performance = usePerformanceMetrics(isOpen, fileHealth.fileHealthChecks);
  const systemInfo = useSystemInfo(isOpen);
  const consoleLogger = useConsoleLogger(isOpen);
  const environmentConstraints = useEnvironmentConstraints();


  const debugData = {
    fileHealthChecks: fileHealth.fileHealthChecks,
    performanceMetrics: performance.performanceMetrics,
    systemInfo: systemInfo.systemInfo,
    consoleEntries: consoleLogger.consoleEntries,
    environmentConstraints: environmentConstraints.constraints,
    environment: fileHealth.environment
  };

  const handleExportReport = () => {
    exportDebugReport(debugData, props);
    consoleLogger.addEntry('info', 'Debug report exported', 'Export System');
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col animate-fade-in-scale-up" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b bg-gray-900 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Bug className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Mappa Imperium Debug System</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl">&times;</button>
        </header>

        <nav className="flex border-b bg-gray-50 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Monitor },
            { id: 'files', label: 'File Health', icon: FileText },
            { id: 'environment', label: 'Environment', icon: ShieldCheck },
            { id: 'performance', label: 'Performance', icon: Zap },
            { id: 'system', label: 'System Info', icon: Database },
            { id: 'console', label: 'Console', icon: Activity },
            { id: 'game-tools', label: 'Game Tools', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {activeTab === 'overview' && (
            <OverviewTab
              debugData={debugData}
              onRunAudit={fileHealth.runFileHealthCheck}
              onExportReport={handleExportReport}
              onClearConsole={consoleLogger.clearConsole}
              onNavigateToGameTools={() => setActiveTab('game-tools')}
            />
          )}
          {activeTab === 'files' && <FileHealthTab fileHealthChecks={debugData.fileHealthChecks} />}
          {activeTab === 'environment' && <EnvironmentConstraintsTab hook={environmentConstraints} />}
          {activeTab === 'performance' && <PerformanceTab performanceMetrics={debugData.performanceMetrics} environment={debugData.environment} />}
          {activeTab === 'system' && <SystemInfoTab systemInfo={debugData.systemInfo} />}
          {activeTab === 'console' && (
            <ConsoleTab 
                consoleEntries={debugData.consoleEntries} 
                addEntry={consoleLogger.addEntry}
                clearConsole={consoleLogger.clearConsole}
            />
          )}
          {activeTab === 'game-tools' && <GameToolsTab {...props} />}
        </main>
      </div>
    </div>
  );
};

export default UnifiedDebugSystem;