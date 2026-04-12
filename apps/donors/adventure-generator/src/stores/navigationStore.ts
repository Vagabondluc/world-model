
import { createStore } from './storeFactory';
import { ActiveView, useCampaignStore } from './campaignStore';

interface NavigationState {
    viewStack: ActiveView[];

    // Actions
    pushView: (view: ActiveView) => void;
    popView: () => void;
    replaceView: (view: ActiveView) => void;
    resetNavigation: (initialView?: ActiveView) => void;
}

export const useNavigationStore = createStore<NavigationState>((set, get) => ({
    viewStack: ['adventure'],

    pushView: (view) => {
        const { viewStack } = get();
        // Prevent double-pushing the same view
        if (viewStack[viewStack.length - 1] === view) return;

        const newStack = [...viewStack, view];
        set({ viewStack: newStack });
        useCampaignStore.getState().setActiveView(view);
    },

    popView: () => {
        const { viewStack } = get();
        if (viewStack.length <= 1) return;

        const newStack = [...viewStack];
        newStack.pop();
        const previousView = newStack[newStack.length - 1];

        set({ viewStack: newStack });
        useCampaignStore.getState().setActiveView(previousView);
    },

    replaceView: (view) => {
        const { viewStack } = get();
        const newStack = [...viewStack];
        newStack[newStack.length - 1] = view;

        set({ viewStack: newStack });
        useCampaignStore.getState().setActiveView(view);
    },

    resetNavigation: (initialView = 'adventure') => {
        set({ viewStack: [initialView] });
        useCampaignStore.getState().setActiveView(initialView);
    },
}));
