import type { EraUIState } from '@/types';

export const initialEraUiState: EraUIState = {
    eraOne: { gameplayStep: 'geography' },
    eraTwo: { gameplayStep: 'setup' },
    eraThree: { gameplayStep: 'faction' },
    eraFour: { gameplayStep: 'exploration' },
    eraFive: { gameplayStep: 'expansion' },
    eraSix: { gameplayStep: 'events' },
};