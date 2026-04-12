
import React from 'react';
import { OnboardingStep, useGameStore } from '../store/gameStore';
import { ui } from '../logic/ui.tokens';

interface OnboardingHintProps {
  step: OnboardingStep;
}

const HINT_DATA: Record<Exclude<OnboardingStep, 'DONE'>, { text: string; icon: string; position: string; mobilePos: string }> = {
  MAP_TAP: {
    text: "Tap a hex to begin shaping your world's history.",
    icon: "touch_app",
    position: "bottom-32 left-1/2 -translate-x-1/2",
    mobilePos: "bottom-24 left-1/2 -translate-x-1/2"
  },
  INSPECT: {
    text: "This panel shows what exists here. Notice how history is recorded for every sector.",
    icon: "info",
    position: "top-24 right-[340px]",
    mobilePos: "top-20 left-1/2 -translate-x-1/2"
  },
  ACTION: {
    text: "Choose an action to expend Action Points (AP) and modify the world.",
    icon: "bolt",
    position: "top-40 left-[300px]",
    mobilePos: "bottom-32 left-1/2 -translate-x-1/2"
  },
  END_TURN: {
    text: "When finished, end your turn to pass authority to the next Architect.",
    icon: "play_arrow",
    position: "top-16 right-8",
    mobilePos: "top-16 right-4"
  }
};

const OnboardingHint: React.FC<OnboardingHintProps> = ({ step }) => {
  const setStep = useGameStore(state => state.setOnboardingStep);
  const isMobile = window.innerWidth < 1024;

  if (step === 'DONE') return null;
  const hint = HINT_DATA[step];
  if (!hint) return null;

  return (
    <div className={`fixed z-[100] ${isMobile ? hint.mobilePos : hint.position} animate-hint pointer-events-none`}>
      <div className={`${ui.color.bg.input} border border-primary/50 ${ui.radius.panel} p-4 shadow-[0_10px_40px_rgba(127,19,236,0.3)] max-w-[240px] pointer-events-auto`}>
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-lg">{hint.icon}</span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] leading-relaxed font-bold text-white/90">{hint.text}</p>
            <button
              onClick={() => setStep('DONE')}
              className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
            >
              Skip Guide
            </button>
          </div>
        </div>
        {/* Arrow Pointing (Hide on mobile as positions vary) */}
        {!isMobile && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary/50"></div>
        )}
      </div>
    </div>
  );
};

export default OnboardingHint;
