import type { ElementCard, Player, GameSettings } from '../types';

export const exportElementToHtml = (element: ElementCard, players: Player[]): string => {
    return `<div><h1>${element.name}</h1><p>${element.desc || ''}</p></div>`;
};

export const exportElementToMarkdown = (element: ElementCard, players: Player[], format: string): string => {
    return `# ${element.name}\n\n${element.desc || ''}`;
};

export const exportChronicleFeed = (elements: ElementCard[], players: Player[], gameSettings: GameSettings | null, currentPlayer: Player | null): string => {
    return JSON.stringify({ elements, players, gameSettings, currentPlayer }, null, 2);
};
