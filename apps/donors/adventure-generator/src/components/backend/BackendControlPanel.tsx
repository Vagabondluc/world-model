import { BackendStatusIndicator } from './BackendStatusIndicator';
import { LogViewer } from './LogViewer';
import { AddonCard } from './AddonCard';
import { RagControlPanel } from './RagControlPanel';
import { ProviderStatusPanel } from './ProviderStatusPanel';
import { ModelSelector } from './ModelSelector';
import { OllamaStatusPanel } from './OllamaStatusPanel';
import { useBackendStore } from '../../stores/backendStore';
import { Cpu, RefreshCw, Power, RotateCcw, Share2, Shield, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { SettingsManager } from '../settings/SettingsManager';

interface BackendControlPanelProps {
    onBack?: () => void;
    onSaveSession: () => void;
    onLoadSession: () => void;
    onClearSession: () => void;
    onCreateBackup: () => void;
    onRestoreBackup: () => void;
}

export const BackendControlPanel: React.FC<BackendControlPanelProps> = ({ onSaveSession, onLoadSession, onClearSession, onCreateBackup, onRestoreBackup }) => {
    const {
        addons,
        temperature,
        updateConfig,
        connectLogs,
        toggleAddon,
        activeProvider,
        setProvider,
        restartServer,
        stopServer,
        apiKey,
        setApiKey
    } = useBackendStore();

    const { userRole, setUserRole } = useUserStore();
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        connectLogs();
    }, [connectLogs]);

    const renderRoleSelector = () => (
        <div className="flex gap-2 mb-6 p-1 bg-black/20 rounded-lg w-max">
            {(['GM', 'Designer', 'Admin'] as const).map(role => (
                <button
                    key={role}
                    onClick={() => setUserRole(role)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${userRole === role
                        ? 'bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-sm'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    {role}
                </button>
            ))}
        </div>
    );

    const renderGMView = () => (
        <div className="space-y-6 max-w-2xl">
            {/* AI Status Card */}
            <OllamaStatusPanel />

            {/* Simple Help / Context */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-gray-200 font-semibold mb-2">About Settings</h3>
                <p className="text-sm text-gray-400">
                    Most settings are managed automatically.
                    Switch to <strong>Designer</strong> or <strong>Admin</strong> mode above if you need to configure specific AI models, API keys, or knowledge bases.
                </p>
            </div>
        </div>
    );

    const renderDesignerView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <OllamaStatusPanel />

                {/* AI Behavior (Temperature) */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-4 text-purple-300">
                        <Cpu className="w-5 h-5" />
                        <h3 className="font-bold">AI Behavior</h3>
                    </div>

                    <div className="space-y-4">
                        <ModelSelector />

                        <div>
                            <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                                <label>Creativity Level (Temperature)</label>
                                <span>{temperature}</span>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.1"
                                value={temperature}
                                onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
                                className="w-full accent-purple-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Lower values are more predictable. Higher values are more creative but chaotic.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Addons */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <BlocksIcon />
                        <span className="text-sm font-bold uppercase tracking-wider">Installed Add-ons</span>
                    </div>

                    <div className="grid gap-4">
                        <AddonCard
                            name="D&D 5e Core"
                            description="Standard 5th edition ruleset, creature generation, and encounter balancing."
                            isActive={addons.includes('dnd')}
                            onToggle={(enabled: boolean) => toggleAddon('dnd', enabled)}
                        />
                        <AddonCard
                            name="Sci-Fi Expansion (Alpha)"
                            description="Starship generation and planetary systems. (In Development)"
                            isActive={false}
                            onToggle={() => { }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAdminView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Left Column: Config & RAG */}
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                <ProviderStatusPanel />

                {/* Security Config */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2 mb-4 text-emerald-300">
                        <Shield className="w-5 h-5" />
                        <h3 className="font-bold">Security</h3>
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1">
                            API Key (Required for external access)
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type={showKey ? "text" : "password"}
                                    value={apiKey || ""}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter Server API Key..."
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm focus:border-emerald-500 outline-none text-slate-200"
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legacy Model Config (Full) */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2 mb-4 text-purple-300">
                        <Cpu className="w-5 h-5" />
                        <h3 className="font-bold">Advanced Model Config</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center gap-1">
                                <Share2 size={10} />
                                Active Provider
                            </label>
                            <select
                                value={activeProvider}
                                onChange={(e) => setProvider(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm focus:border-purple-500 outline-none text-slate-200"
                            >
                                <option value="ollama">Ollama (Local/Native)</option>
                                <option value="lm_studio">LM Studio (Local Host)</option>
                                <option value="webui">Text Gen WebUI (Port 5000)</option>
                            </select>
                        </div>
                        <ModelSelector />
                    </div>
                </div>

                <RagControlPanel />
            </div>

            {/* Right Column: Server Control & Logs */}
            <div className="flex flex-col gap-6 h-full">
                <div className="p-4 rounded-xl bg-rose-900/10 border border-rose-500/20">
                    <h3 className="text-rose-400 font-bold mb-2">Server Lifecycle</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => restartServer()}
                            className="flex items-center gap-2 px-3 py-2 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                        >
                            <RotateCcw size={16} /> Restart Server
                        </button>
                        <button
                            onClick={() => stopServer()}
                            className="flex items-center gap-2 px-3 py-2 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                        >
                            <Power size={16} /> Stop Server
                        </button>
                    </div>
                </div>

                <LogViewer />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full gap-6 text-gray-200 overflow-y-auto p-6 custom-scrollbar">
            <div className="flex justify-between items-start flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-amber-100 font-display mb-1">
                        Settings
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage AI configuration, addons, and system preferences.
                    </p>
                </div>
                {renderRoleSelector()}
            </div>

            <div className="w-full h-px bg-white/10 flex-shrink-0" />

            {/* View Dispatcher */}
            {userRole === 'GM' && renderGMView()}
            {userRole === 'Designer' && renderDesignerView()}
            {userRole === 'Admin' && renderAdminView()}

            {/* Shared Project Settings (Bottom) */}
            <div className="mt-8 border-t border-white/10 pt-8 pb-8 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-300 mb-4">Project & Session</h2>
                <div className="bg-white/5 rounded-xl p-4">
                    <SettingsManager
                        onSaveSession={onSaveSession}
                        onLoadSession={onLoadSession}
                        onClearSession={onClearSession}
                        onCreateBackup={onCreateBackup}
                        onRestoreBackup={onRestoreBackup}
                    />
                </div>
            </div>
        </div>
    );
};

const BlocksIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
    </svg>
);
