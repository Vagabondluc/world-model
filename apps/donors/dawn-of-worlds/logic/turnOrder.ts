
import { PlayerId } from '../types';

export const getNextPlayerIndex = (players: PlayerId[], currentIndex: number): number =>
    (currentIndex + 1) % players.length;

export const getNextPlayer = (players: PlayerId[], activePlayerId: PlayerId): PlayerId => {
    const currentIndex = players.indexOf(activePlayerId);
    return players[getNextPlayerIndex(players, currentIndex)];
};
