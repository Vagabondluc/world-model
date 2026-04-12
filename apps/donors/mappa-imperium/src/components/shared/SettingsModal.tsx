import React from 'react';
import { SettingsModalProps } from '../../types';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave, gameSettings }) => {
    const [settings, setSettings] = React.useState(currentSettings);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(settings);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-stone-200">
                <h2 className="text-2xl font-bold mb-6 text-stone-800">Application Settings</h2>

                <div className="space-y-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Map Rendering Mode</label>
                        <select
                            value={settings.mapRender?.mode || 'svg'}
                            onChange={(e) => setSettings({
                                ...settings,
                                mapRender: { ...settings.mapRender, mode: e.target.value as any }
                            })}
                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
                        >
                            <option value="svg">Tactical Schematic (SVG)</option>
                            <option value="tile">Illustrated Atlas (Tiles)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Tile Theme</label>
                        <select
                            value={settings.mapRender?.theme || 'classic'}
                            onChange={(e) => setSettings({
                                ...settings,
                                mapRender: { ...settings.mapRender, theme: e.target.value as any }
                            })}
                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
                        >
                            <option value="classic">Classic</option>
                            <option value="vibrant">Vibrant (Thick)</option>
                            <option value="pastel">Pastel (Flat)</option>
                            <option value="sketchy">Sketchy</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                            <span>Accessibility / Color Blind Mode</span>
                        </label>
                        <select
                            value={settings.colorBlindMode || 'none'}
                            onChange={(e) => setSettings({
                                ...settings,
                                colorBlindMode: e.target.value as any
                            })}
                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
                        >
                            <option value="none">Standard</option>
                            <option value="deuteranopia">Deuteranopia (Red-Green)</option>
                            <option value="protanopia">Protanopia (Red-Weak)</option>
                            <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
