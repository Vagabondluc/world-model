
import { Age } from '../types';

export const formatAgeRoman = (age: Age | number): string => {
    if (age === 1) return 'I';
    if (age === 2) return 'II';
    if (age === 3) return 'III';
    return String(age);
};
