// File size: ~25 lines
import React, { createContext, useContext, PropsWithChildren } from 'react';
import { ImprovedAdventureAPIService } from '../services/aiService';

interface AppContextType {
    apiService: ImprovedAdventureAPIService | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren<{ value: AppContextType }>> = ({ children, value }) => {
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};