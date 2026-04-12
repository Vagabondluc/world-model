
import React from 'react';
import { BrandSection } from './BrandSection';
import { ProgressSection } from './ProgressSection';
import { TurnSection } from './TurnSection';
import { GlobalActions } from './GlobalActions';

interface HeaderProps {
  onBrandClick: () => void;
  onCounselorClick: () => void;
  onShortcutsClick: () => void;
  onChroniclerClick: () => void;
  onSearchClick: () => void;
  onEndTurnClick: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header role="banner" className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-bg-dark px-6 relative z-30 shadow-lg">
      <div className="flex items-center gap-8">
        <BrandSection onBrandClick={props.onBrandClick} />
        <div className="h-6 w-[1px] bg-white/5" aria-hidden="true"></div>
        <ProgressSection />
        <div className="h-6 w-[1px] bg-white/5" aria-hidden="true"></div>
        <TurnSection />
      </div>
      <GlobalActions {...props} />
    </header>
  );
};
