# Debug System Refactoring Plan

## Current Issues with Monolithic Implementation

**File Size**: 600+ lines in a single component violates maintainability standards
**Responsibility Overload**: One component handling 6 different functional areas
**Testing Complexity**: Difficult to unit test individual features
**Code Reusability**: Logic trapped in monolithic structure
**Debugging Difficulty**: Hard to isolate issues to specific functionality

## Proposed File Structure

```
src/components/debug/
├── UnifiedDebugSystem.tsx                    # Main container (100-150 lines)
├── hooks/
│   ├── useDebugData.ts                      # Data gathering logic
│   ├── useFileHealthCheck.ts                # File analysis logic
│   ├── usePerformanceMetrics.ts             # Performance monitoring
│   ├── useSystemInfo.ts                     # System information gathering
│   └── useConsoleLogger.ts                  # Console functionality
├── tabs/
│   ├── OverviewTab.tsx                      # Overview dashboard (contains StatusCard child component)
│   ├── FileHealthTab.tsx                    # File analysis display (contains FileHealthCard child component)
│   ├── PerformanceTab.tsx                   # Performance metrics
│   ├── SystemInfoTab.tsx                    # System information
│   ├── ConsoleTab.tsx                       # Console interface (contains ConsoleEntry child component)
│   └── GameToolsTab.tsx                     # Game management tools
├── utils/
│   ├── environmentDetection.ts              # Environment checking
│   ├── fileAnalysis.ts                      # File dependency mapping
│   ├── reportExporter.ts                    # Debug report generation
│   └── mockDataGenerators.ts                # Test data generation
└── types/
    └── debugTypes.ts                        # TypeScript interfaces
```
**Architectural Note**: To reduce file clutter, small, single-use display components (like `StatusCard.tsx`, `FileHealthCard.tsx`, `ConsoleEntry.tsx`) will be defined as child components directly within their parent Tab component (`OverviewTab.tsx`, `FileHealthTab.tsx`, etc.) rather than as separate files.

## Refactoring Steps

### Step 1: Extract TypeScript Interfaces
**File**: `src/components/debug/types/debugTypes.ts`
```typescript
export interface FileHealthCheck {
  path: string;
  exists: boolean;
  size: number;
  lineCount: number;
  loadTime: number;
  source: 'fetch' | 'bundled' | 'error';
  references: string[];
  referencedBy: string[];
  errorMessage?: string;
}

export interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  networkRequests: number;
  cacheHits: number;
  bundleSize: number;
  domNodes: number;
  frameRate: number;
}

export interface ConsoleEntry {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  source: string;
}

export interface SystemInfo {
  userAgent: string;
  viewport: { width: number; height: number };
  memory: any;
  connection: any;
  platform: string;
  cookiesEnabled: boolean;
  onlineStatus: boolean;
}

export interface DebugData {
  fileHealthChecks: FileHealthCheck[];
  performanceMetrics: PerformanceMetrics | null;
  systemInfo: SystemInfo | null;
  consoleEntries: ConsoleEntry[];
  environment: 'cloud-run' | 'development';
}
```

### Step 2: Extract Environment Detection
**File**: `src/components/debug/utils/environmentDetection.ts`
```typescript
export const isGoogleCloudRun = (): boolean => {
  return (
    window.location.hostname.includes('.run.app') ||
    window.location.hostname.includes('cloudrun') ||
    window.location.hostname.includes('.goog') ||
    Boolean(process.env.PORT && process.env.PORT !== '3000') ||
    process.env.NODE_ENV === 'production'
  );
};

export const getEnvironment = (): 'cloud-run' | 'development' => {
  return isGoogleCloudRun() ? 'cloud-run' : 'development';
};
```

### Step 3: Extract Data Gathering Hooks
**File**: `src/components/debug/hooks/useFileHealthCheck.ts`
```typescript
import { useState } from 'react';
import { FileHealthCheck } from '../types/debugTypes';
import { getFileReferences, getReferencedBy } from '../utils/fileAnalysis';
import { getEnvironment } from '../utils/environmentDetection';

export const useFileHealthCheck = () => {
  const [fileHealthChecks, setFileHealthChecks] = useState<FileHealthCheck[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const runFileHealthCheck = async () => {
    setIsAuditing(true);
    // Move existing logic here
    setIsAuditing(false);
  };

  return {
    fileHealthChecks,
    isAuditing,
    runFileHealthCheck
  };
};
```

**File**: `src/components/debug/hooks/usePerformanceMetrics.ts`
```typescript
import { useState, useEffect } from 'react';
import { PerformanceMetrics } from '../types/debugTypes';

export const usePerformanceMetrics = (fileHealthChecks: any[]) => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  const gatherPerformanceMetrics = () => {
    // Move existing logic here
  };

  useEffect(() => {
    const interval = setInterval(gatherPerformanceMetrics, 5000);
    return () => clearInterval(interval);
  }, [fileHealthChecks]);

  return {
    performanceMetrics,
    gatherPerformanceMetrics
  };
};
```

### Step 4: Create Tab Components
**File**: `src/components/debug/tabs/OverviewTab.tsx`
```typescript
import React from 'react';
import { FileText, Zap, Database, Cloud } from 'lucide-react';
import { DebugData } from '../types/debugTypes';

// Child Component defined within the parent file
const StatusCard = ({ icon: Icon, title, value, subtitle, color }) => {
  // ... implementation ...
};

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
  // Move overview tab logic here
  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard
          icon={FileText}
          title="Files"
          value={`${debugData.fileHealthChecks.filter(f => f.exists).length}/${debugData.fileHealthChecks.length}`}
          subtitle="Available"
          color="blue"
        />
        {/* Other status cards */}
      </div>
      {/* Rest of overview content */}
    </div>
  );
};

export default OverviewTab;
```

### Step 5: Refine Main Container
**File**: `src/components/debug/UnifiedDebugSystem.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { Bug, Monitor, FileText, Zap, Database, Activity, Settings } from 'lucide-react';

// Import hooks
import { useFileHealthCheck } from './hooks/useFileHealthCheck';
// ... other hook imports

// Import tabs
import OverviewTab from './tabs/OverviewTab';
// ... other tab imports

// Import utilities
import { getEnvironment } from './utils/environmentDetection';
import { exportDebugReport } from './utils/reportExporter';

const UnifiedDebugSystem: React.FC<UnifiedDebugSystemProps> = (props) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Use extracted hooks
  const fileHealth = useFileHealthCheck();
  // ... other hooks

  const debugData = { /* ... combine data ... */ };

  const handleExportReport = () => {
    exportDebugReport(debugData, props);
  };

  if (!props.isOpen) return null;

  return (
    // Main container JSX, which renders the active tab component
    <div className="fixed inset-0 z-50 ...">
        {/* ... Header and Tab Navigation ... */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeTab === 'overview' && <OverviewTab debugData={debugData} {...props} />}
          {/* ... other tab components ... */}
        </main>
    </div>
  );
};

export default UnifiedDebugSystem;
```

## Implementation Priority

1. **High Priority**: Extract interfaces, environment detection, and main data hooks
2. **Medium Priority**: Create tab components and co-locate child components within them
3. **Low Priority**: Extract utility functions and add comprehensive tests

## Benefits of This Refactoring

**Maintainability**: Each file has a single, clear responsibility
**Testability**: Individual hooks and components can be unit tested
**Co-location**: Tightly-coupled UI logic is kept together, reducing file clutter
**Debugging**: Issues can be isolated to specific files and functions
**Team Development**: Multiple developers can work on different parts simultaneously
**Performance**: Smaller components enable better React optimization

## Migration Strategy

1. Create new file structure alongside existing component
2. Extract one section at a time (start with types and utilities)
3. Test each extracted section thoroughly
4. Replace imports in main component gradually
5. Remove original monolithic code only after full verification

This refactoring will transform the debug system from a maintenance burden into a well-architected, professional development tool.