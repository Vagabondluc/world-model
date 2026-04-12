
import React from 'react';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
  onSearchClick: () => void;
  onEndTurnClick: () => void;
  onTimelineClick: () => void;
  onBrandClick: () => void;
  onChroniclerClick: () => void;
  onShortcutsClick: () => void;
  onCounselorClick: () => void;
  isTimelineActive: boolean;
  isErrorState: boolean;
}

import ChronicleToast from './ChronicleToast';

const Layout: React.FC<LayoutProps> = ({
  children,
  onSearchClick,
  onEndTurnClick,
  onTimelineClick,
  onBrandClick,
  onChroniclerClick,
  onShortcutsClick,
  onCounselorClick,
  isTimelineActive
}) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Header
        onBrandClick={onBrandClick}
        onCounselorClick={onCounselorClick}
        onShortcutsClick={onShortcutsClick}
        onChroniclerClick={onChroniclerClick}
        onSearchClick={onSearchClick}
        onEndTurnClick={onEndTurnClick}
      />

      <ChronicleToast onClick={onChroniclerClick} />

      <main className="flex flex-1 overflow-hidden relative" role="main">
        {children}
      </main>

      <Footer
        onTimelineClick={onTimelineClick}
        isTimelineActive={isTimelineActive}
      />
    </div>
  );
};

export default Layout;
