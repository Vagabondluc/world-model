
import React, { useState } from 'react';
import ActionSidebar from './ActionSidebar';
import InspectorSidebar from './InspectorSidebar';
import MapViewport from './MapViewport';
import DiceTray from './DiceTray';

interface MainViewProps {
  isErrorState: boolean;
  toggleErrorState: () => void;
}

const MainView: React.FC<MainViewProps> = ({ isErrorState, toggleErrorState }) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  return (
    <>
      <DiceTray />
      
      <ActionSidebar 
        isErrorState={isErrorState} 
        toggleErrorState={toggleErrorState} 
        activeAction={activeAction}
        onActionSelect={setActiveAction}
      />
      
      <MapViewport 
        isErrorState={isErrorState} 
        toggleErrorState={toggleErrorState}
        activeExternalAction={activeAction}
      />
      
      <InspectorSidebar 
        isErrorState={isErrorState} 
      />
    </>
  );
};

export default MainView;
