import React from 'react';
import type { ProfileProps } from '../../types';

const Profile = ({ onBack }: ProfileProps) => {

    const handleLoad = () => {
        // Placeholder for future functionality
        alert('Profile loaded!');
    };

    const handleExport = () => {
        // Placeholder for future functionality
        alert('Profile exported!');
    };

    return (
        <div className="layout-centered-card p-4">
            <div className="page-card max-w-lg">
                <h1 className="text-4xl font-bold text-amber-800 mb-2 text-center">Player Profiles</h1>
                <p className="text-center text-gray-600 mb-8">Manage your player personas and AI configurations.</p>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="profile-select" className="form-label">
                            Select a Profile to Load
                        </label>
                        <select
                            id="profile-select"
                            className="input-base"
                        >
                            <option>Default Profile</option>
                            <option>Creative Storyteller AI</option>
                            <option>Aggressive Warlord AI</option>
                            <option>My Custom Persona</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleLoad}
                            className="w-full btn btn-primary"
                        >
                            Load Profile
                        </button>
                        <button
                            onClick={handleExport}
                            className="w-full btn btn-secondary bg-green-700 hover:bg-green-600 text-white"
                        >
                            Export Current Profile
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t">
                    <button onClick={onBack} className="w-full btn btn-secondary">
                        &larr; Back to Setup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;