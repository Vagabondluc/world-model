
import React, { useEffect, useState } from 'react';
import { X, Trash2, Globe, FileText, HardDrive, Loader2 } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useWorldStore } from '../stores/useWorldStore';
import { listProjectsFromDB, deleteProjectFromDB, EARTH_PRESET_CONFIG, EARTH_PRESET_SEED } from '../services/storageSystem';
import { ProjectMeta } from '../types';

export const LoadModal: React.FC = () => {
  const { isLoadModalOpen, setLoadModalOpen } = useUIStore();
  const { loadWorld, loadPreset } = useWorldStore();
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [activeTab, setActiveTab] = useState<'SAVES' | 'PRESETS'>('SAVES');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoadModalOpen) {
      setIsLoading(true);
      listProjectsFromDB().then(res => {
        setProjects(res);
        setIsLoading(false);
      });
    }
  }, [isLoadModalOpen]);

  if (!isLoadModalOpen) return null;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProjectFromDB(id).then(() => {
        listProjectsFromDB().then(setProjects);
      });
    }
  };

  const handleLoad = async (id: string) => {
    setIsLoading(true);
    await loadWorld(id);
    setIsLoading(false);
    setLoadModalOpen(false);
  };

  const handlePreset = () => {
    loadPreset(EARTH_PRESET_CONFIG, EARTH_PRESET_SEED);
    setLoadModalOpen(false);
  };

  return (
    <div className="absolute inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-500" /> Load Project
          </h2>
          <button onClick={() => setLoadModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-2 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('SAVES')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'SAVES' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            My Saves
          </button>
          <button 
            onClick={() => setActiveTab('PRESETS')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'PRESETS' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            Presets
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}

          {activeTab === 'SAVES' && (
            <>
              {projects.length === 0 && !isLoading ? (
                <div className="text-center py-8 text-slate-600 text-xs font-mono">NO SAVED PROJECTS FOUND</div>
              ) : (
                projects.map((proj) => (
                  <div 
                    key={proj.id}
                    onClick={() => handleLoad(proj.id)}
                    className="group flex items-center justify-between p-3 bg-slate-800/40 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-200 group-hover:text-indigo-300">{proj.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, proj.id)}
                      className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'PRESETS' && (
            <div 
              onClick={handlePreset}
              className="group flex items-center gap-4 p-4 bg-slate-800/40 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
            >
              <div className="p-3 bg-cyan-900/30 rounded-full text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-300">Terra Prime (Earth)</span>
                <span className="text-[10px] text-slate-500">
                  Standard Earth-like configuration. 70% Ocean, Moderate Temp, Carbon-based life suitable.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
