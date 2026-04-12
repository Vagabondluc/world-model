
import { WorldLinguist, NameStyle } from '../WorldLinguist';

describe('WorldLinguist Advanced', () => {
    let linguist: WorldLinguist;

    beforeEach(() => {
        linguist = new WorldLinguist();
    });

    describe('Constructive Style', () => {
        it('should generate names strings', () => {
            const name = linguist.getName(NameStyle.Constructive);
            expect(name).toBeTruthy();
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThan(2);
        });

        it('should handle formatting (Title Case)', () => {
            const name = linguist.getName(NameStyle.Constructive);
            // Check capital first letter
            expect(name[0]).toMatch(/[A-Z]/);
        });
    });

    describe('Juxtaposition Style', () => {
        it('should generate Adj + Noun', () => {
            // Mock random to be predictable?
            // Or just check format: "Word Word"
            const name = linguist.getName(NameStyle.Juxtaposition);
            expect(name).toContain(' ');
            const parts = name.split(' ');
            expect(parts.length).toBeGreaterThanOrEqual(1); // "Darkforest"? Space might be occasional?
            // Implementation says `${adj} ${noun}` always.
            expect(parts.length).toBe(2);
        });
    });

    describe('Standard Styles', () => {
        it('should support Asian style', () => {
            const name = linguist.getName(NameStyle.Asian);
            expect(name).toBeTruthy();
        });

        it('should support Germanic style', () => {
            const name = linguist.getName(NameStyle.Germanic);
            expect(name).toBeTruthy();
        });

        it('should default to Unnamed if style missing', () => {
            // How to assume missing? We can't pass invalid Enum in TS easily.
            // But if we forced it:
            // (linguist as any).markovs.delete(NameStyle.Greek);
            // expect(linguist.getName(NameStyle.Greek)).toBe("Unnamed");
            // Actually getName returns "Unnamed" if generator missing.
            // Let's simulate a missing generator.

            (linguist as any).markovs.clear();
            // Constructive/Juxta are hardcoded, so use a Markov one
            expect(linguist.getName(NameStyle.Germanic)).toBe('Unnamed');
        });
    });
});
