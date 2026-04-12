import type { EnvironmentConstraints } from '../hooks/useEnvironmentConstraints';
import { Player } from '@/types';

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

export interface UnifiedDebugSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onPrepopulateEra: (era: number, playerNumber: number) => void;
  onUnlockAllEras: () => void;
  onExportGameData: () => void;
  onImportGameData: (file: File) => void;
  onClearAllData: () => void;
  currentEraId: number;
  completedEras: number[];
  players: Player[];
  isDebugMode: boolean;
}

export interface DebugData {
  fileHealthChecks: FileHealthCheck[];
  performanceMetrics: PerformanceMetrics | null;
  systemInfo: SystemInfo | null;
  consoleEntries: ConsoleEntry[];
  environmentConstraints: EnvironmentConstraints;
  environment: 'cloud-run' | 'development';
}