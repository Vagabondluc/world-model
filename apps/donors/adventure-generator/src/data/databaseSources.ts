
export interface DatabaseSource {
    id: string;
    name: string;
    shortDescription: string;
    license: string;
    licenseDetails: {
        fullName: string;
        permissions: string[];
        requirements: string[];
        exclusions: string[];
        fullTextUrl?: string;
        sourceUrl?: string;
    };
}

export const DATABASE_SOURCES: DatabaseSource[] = [
    {
        id: 'srd5.1',
        name: 'Wizards SRD 5.1',
        shortDescription: 'Core 5e ruleset (mechanics, classes, spells).',
        license: 'CC-BY 4.0',
        licenseDetails: {
            fullName: 'Creative Commons Attribution 4.0 International',
            permissions: ['Copy, modify, and redistribute commercially.'],
            requirements: ['Credit Wizards of the Coast.', 'Include a link to the CC-BY 4.0 license.'],
            exclusions: ['Trademarks (D&D, Wizards of the Coast, Beholder, etc.).', 'Product Identity as defined in the OGL.'],
            fullTextUrl: 'https://creativecommons.org/licenses/by/4.0/',
            sourceUrl: 'https://dnd.wizards.com/resources/systems-reference-document'
        }
    },
    {
        id: 'a5esrd',
        name: 'Level Up: Advanced 5E (A5ESRD)',
        shortDescription: 'Expanded progression, exploration & fatigue systems.',
        license: 'CC-BY 4.0',
        licenseDetails: {
            fullName: 'Creative Commons Attribution 4.0 International',
            permissions: ['Copy, modify, and redistribute commercially.'],
            requirements: ['Credit EN Publishing.'],
            exclusions: [],
            fullTextUrl: 'https://creativecommons.org/licenses/by/4.0/',
            sourceUrl: 'https://a5esrd.com/'
        }
    },
    {
        id: 'bfrd',
        name: 'Black Flag Reference (BFRD 1.0)',
        shortDescription: 'Kobold Press’ open 5e-derived rules.',
        license: 'CC-BY 4.0',
        licenseDetails: {
            fullName: 'Creative Commons Attribution 4.0 International',
            permissions: ['Copy, modify, and redistribute commercially.'],
            requirements: ['Credit Kobold Press.'],
            exclusions: [],
            fullTextUrl: 'https://creativecommons.org/licenses/by/4.0/',
            sourceUrl: 'https://www.blackflagrpg.com/'
        }
    },
    {
        id: 'kp-ogl',
        name: 'Kobold Press Monsters & Magic',
        shortDescription: 'Monster & magic expansions. Product Identity excluded.',
        license: 'OGL v1.0a',
        licenseDetails: {
            fullName: 'Open Game License v1.0a',
            permissions: ['Copy, modify, and distribute Open Game Content.'],
            requirements: ['Include the full OGL text with your distribution.'],
            exclusions: ['Product Identity (trademarks, proper names, etc.) as defined by Kobold Press.'],
            fullTextUrl: 'https://dnd.wizards.com/resources/systems-reference-document',
            sourceUrl: 'https://koboldpress.com/'
        }
    },
    {
        id: 'mit-libs',
        name: 'MIT Libraries (Internal Tools)',
        shortDescription: 'Enables local search, sorting, and markdown parsing.',
        license: 'MIT',
        licenseDetails: {
            fullName: 'MIT License',
            permissions: ['Use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software.'],
            requirements: ['Include the original copyright and license notice in all copies or substantial portions of the software.'],
            exclusions: [],
            fullTextUrl: 'https://opensource.org/licenses/MIT',
        }
    },
];
