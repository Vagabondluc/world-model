import type { Era, GameSettings } from '@mi/types';

export const eras: Era[] = [
  { id: 0, name: "Basics & Setup", icon: "📖" },
  { id: 1, name: "Age of Creation", icon: "🌍" },
  { id: 2, name: "Age of Myth", icon: "⚡" },
  { id: 3, name: "Age of Foundation", icon: "🏛️" },
  { id: 4, name: "Age of Discovery", icon: "🗺️" },
  { id: 5, name: "Age of Empires", icon: "👑" },
  { id: 6, name: "Age of Collapse", icon: "🔥" }
];

export const TURNS_PER_ERA: Record<GameSettings['length'], { 3: number; 4: number; 5: number; 6: number; }> = {
    Short: { 3: 3, 4: 3, 5: 4, 6: 3 },
    Standard: { 3: 3, 4: 6, 5: 6, 6: 5 },
    Long: { 3: 3, 4: 8, 5: 8, 6: 6 },
    Epic: { 3: 3, 4: 11, 5: 12, 6: 10 }
};