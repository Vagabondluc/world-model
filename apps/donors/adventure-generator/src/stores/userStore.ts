import { createPersistedStore } from './storeFactory';

export type UserRole = 'GM' | 'Designer' | 'Admin';

interface UserState {
    userRole: UserRole;
    showAdvancedSettings: boolean;
    hasSeenWelcome: boolean;

    setUserRole: (role: UserRole) => void;
    toggleAdvancedSettings: () => void;
    setHasSeenWelcome: (seen: boolean) => void;
}

export const useUserStore = createPersistedStore<UserState>(
    (set) => ({
        userRole: 'GM', // Default to GM as requested
        showAdvancedSettings: false,
        hasSeenWelcome: false,

        setUserRole: (role) => set({ userRole: role }),
        toggleAdvancedSettings: () => set((state) => ({ showAdvancedSettings: !state.showAdvancedSettings })),
        setHasSeenWelcome: (seen) => set({ hasSeenWelcome: seen }),
    }),
    {
        name: 'antigravity-user-storage',
        version: 1,
    }
);
