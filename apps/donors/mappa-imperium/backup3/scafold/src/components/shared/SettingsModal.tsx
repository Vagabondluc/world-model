import React, { useState, useEffect } from 'react';
import type { SettingsModalProps, AppSettings } from '../../types';

const SettingsModal = ({ isOpen, onClose, currentSettings, onSave, gameSettings }: SettingsModalProps) => {
    const [settings, setSettings] = useState<AppSettings>(currentSettings);

    useEffect(() => {
        setSettings(currentSettings);
    }, [currentSettings, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(settings);
    };

    const handleMarkdownFormatChange = (format: AppSettings['markdownFormat']) => {
        setSettings(prev => ({ ...prev, markdownFormat: format }));
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md m-4 animate-fade-in-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-amber-800 mb-6">Settings</h2>
                
                <div className="space-y-6">
                    {gameSettings && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Game</h3>
                            <div className="p-3 bg-gray-50 rounded-lg border text-sm text-gray-800 space-y-1">
                                <p><strong>Players:</strong> {gameSettings.players}</p>
                                <p><strong>Game Length:</strong> {gameSettings.length}</p>
                                <p><strong>Turn Duration:</strong> {gameSettings.turnDuration} years</p>
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Markdown Export Format</h3>
                        <p className="text-sm text-gray-500 mb-3">Choose the format for Markdown file exports.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleMarkdownFormatChange('regular')}
                                className={`px-4 py-3 rounded-md font-semibold text-left transition-colors duration-200 border-2 ${
                                    settings.markdownFormat === 'regular'
                                        ? 'bg-amber-600 text-white border-amber-800'
                                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-amber-100 hover:border-amber-400'
                                }`}
                            >
                                <span className="block font-bold">Regular</span>
                                <span className="text-xs">Standard, compatible Markdown.</span>
                            </button>
                             <button
                                type="button"
                                onClick={() => handleMarkdownFormatChange('homebrewery')}
                                className={`px-4 py-3 rounded-md font-semibold text-left transition-colors duration-200 border-2 ${
                                    settings.markdownFormat === 'homebrewery'
                                        ? 'bg-amber-600 text-white border-amber-800'
                                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-amber-100 hover:border-amber-400'
                                }`}
                            >
                                <span className="block font-bold">Homebrewery</span>
                                <span className="text-xs">Styled for Homebrewery/GM Binder.</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;