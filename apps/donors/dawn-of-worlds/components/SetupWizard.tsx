import React, { useState } from 'react';
import { GameSessionConfig } from '../types';
import { triggerHaptic } from '../logic/haptics';
import { PRESET_COLORS } from '../logic/wizard-data';
import { Step1World } from './setup-wizard/Step1World';
import { Step2Pantheon } from './setup-wizard/Step2Pantheon';
import { Step3Review } from './setup-wizard/Step3Review';

interface SetupWizardProps {
  onComplete: (config: GameSessionConfig) => void;
  onCancel: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<GameSessionConfig>({
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    lastPlayed: Date.now(),
    worldName: '',
    mapSize: 'STANDARD',
    initialAge: 1,
    players: [
      { id: 'P1', name: 'The Architect', color: PRESET_COLORS[0].hex, isHuman: true, secret: '', avatar: 'eye', domain: 'FORGE' },
      { id: 'P2', name: 'The Weaver', color: PRESET_COLORS[1].hex, isHuman: true, secret: '', avatar: 'flare', domain: 'LIFE' }
    ],
    rules: {
      strictAP: true,
      draftMode: false
    },
    worldGen: {
      waterLevel: 0.5,
      mountainDensity: 0.3,
      forestDensity: 0.4,
      seed: Math.floor(Math.random() * 1000000)
    }
  });

  const nextStep = () => { triggerHaptic('confirm'); setStep(s => s + 1); };
  const prevStep = () => { triggerHaptic('tap'); setStep(s => s - 1); };

  const handleFinish = () => {
    triggerHaptic('confirm');
    onComplete(config);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 p-4 backdrop-blur-sm">
      <div className="w-full max-w-7xl bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[850px] max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-16 px-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-lg font-bold text-white font-display tracking-wide uppercase">Genesis Protocol</h2>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 w-12 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary shadow-glow' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {step === 1 && <Step1World config={config} setConfig={setConfig} />}
          {step === 2 && <Step2Pantheon config={config} setConfig={setConfig} />}
          {step === 3 && <Step3Review config={config} setConfig={setConfig} />}
        </div>

        {/* Footer */}
        <div className="h-20 border-t border-white/5 bg-white/[0.02] flex items-center justify-between px-8">
          {step === 1 ? (
            <button onClick={onCancel} className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
          ) : (
            <button onClick={prevStep} className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">Back</button>
          )}

          {step < 3 ? (
            <button 
              onClick={nextStep}
              disabled={step === 1 && !config.worldName}
              className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="px-8 py-3 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-lg hover:bg-primary-hover shadow-[0_0_30px_rgba(127,19,236,0.4)] hover:scale-105 transition-all"
            >
              Forge World
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SetupWizard;