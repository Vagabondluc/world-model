
import { ColorBlindMode } from '@mi/types';

export const getColorBlindFilter = (mode: ColorBlindMode): string => {
    switch (mode) {
        case 'deuteranopia':
            return 'url(#deuteranopia-filter)';
        case 'protanopia':
            return 'url(#protanopia-filter)';
        case 'tritanopia':
            return 'url(#tritanopia-filter)';
        default:
            return 'none';
    }
};

export const getColorBlindHexColor = (color: string, mode: ColorBlindMode): string => {
    // Simple shifting for SVG mode (if not using CSS filters globaly)
    // Real implementation would optimally use an SVG filter on the parent container
    // But for individual fills, we can shift.
    // However, CSS filters on the parent container is MUCH more performant and accurate.
    return color;
};

// SVG Filters definitions to be included in the AppLayout or MapRenderer
export const SVG_FILTERS = `
<svg style="display: none;">
  <defs>
    <filter id="deuteranopia-filter">
      <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0
                                           0.7, 0.3, 0, 0, 0
                                           0, 0.3, 0.7, 0, 0
                                           0, 0, 0, 1, 0" />
    </filter>
    <filter id="protanopia-filter">
      <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0
                                           0.558, 0.442, 0, 0, 0
                                           0, 0.242, 0.758, 0, 0
                                           0, 0, 0, 1, 0" />
    </filter>
    <filter id="tritanopia-filter">
      <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0
                                           0, 0.433, 0.567, 0, 0
                                           0, 0.475, 0.525, 0, 0
                                           0, 0, 0, 1, 0" />
    </filter>
  </defs>
</svg>
`;
