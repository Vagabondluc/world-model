
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HexTile } from './HexTile';
import { BiomeType } from '@mi/types';

describe('HexTile Component', () => {
    const mockHex = { q: 0, r: 0 };
    const mockBiome: BiomeType = 'grassland';
    const mockSize = 30;

    it('renders an SVG polygon in svg mode', () => {
        const { container } = render(
            <svg>
                <HexTile
                    hex={mockHex}
                    biome={mockBiome}
                    mode="svg"
                    size={mockSize}
                />
            </svg>
        );
        const polygon = container.querySelector('polygon');
        expect(polygon).toBeInTheDocument();
        // Check if fill color is present (mocked logic normally, but here we check attribute)
        expect(polygon).toHaveAttribute('fill');
    });

    it('renders an Image in tile mode', () => {
        const { container } = render(
            <svg>
                <HexTile
                    hex={mockHex}
                    biome={mockBiome}
                    mode="tile"
                    size={mockSize}
                    theme="classic"
                />
            </svg>
        );
        const image = container.querySelector('image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('href', '/assets/tilesets/classic/fantasyhextiles_v3.png');
    });

    it('calls onHexClick with correct coordinates when clicked', () => {
        const handleHexClick = vi.fn();
        const { container } = render(
            <svg>
                <HexTile
                    hex={mockHex}
                    biome={mockBiome}
                    mode="svg"
                    size={mockSize}
                    onHexClick={handleHexClick}
                />
            </svg>
        );

        const element = container.querySelector('polygon');
        if (element) {
            fireEvent.click(element);
        }

        expect(handleHexClick).toHaveBeenCalledTimes(1);
        expect(handleHexClick).toHaveBeenCalledWith(expect.objectContaining({ q: 0, r: 0 }));
    });
});
