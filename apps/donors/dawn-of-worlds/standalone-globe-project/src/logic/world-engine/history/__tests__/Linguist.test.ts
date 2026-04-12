
import { WorldLinguist, NameStyle } from '../WorldLinguist';
import { MarkovGenerator } from '../../../utils/MarkovGenerator';

describe('Linguistics System', () => {

    describe('MarkovGenerator', () => {
        it('should train and generate valid strings', () => {
            const gen = new MarkovGenerator(2);
            // Train on simple pattern "ABAB"
            gen.train(['ABAB', 'BABA']);
            const result = gen.generate();
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle empty training data gracefully', () => {
            const gen = new MarkovGenerator(2);
            expect(gen.generate()).toBe("ERROR");
        });
    });

    describe('WorldLinguist', () => {
        let linguist: WorldLinguist;

        beforeEach(() => {
            linguist = new WorldLinguist();
        });

        it('should generate Constructive names (Space Separated)', () => {
            const name = linguist.getName(NameStyle.Constructive);
            console.log('Constructive Name:', name);
            // Constructive names usually have spaces or are compound "River Wood"
            expect(name).toBeTruthy();
            expect(typeof name).toBe('string');
        });

        it('should generate Germanic names', () => {
            const name = linguist.getName(NameStyle.Germanic);
            console.log('Germanic Name:', name);
            expect(name).toBeTruthy();
        });

        it('should generate Japanese names', () => {
            const name = linguist.getName(NameStyle.Asian);
            console.log('Asian Name:', name);
            expect(name).toBeTruthy();
        });

        it('should generate Greek names', () => {
            const name = linguist.getName(NameStyle.Greek);
            console.log('Greek Name:', name);
            expect(name).toBeTruthy();
        });

        it('should generate Slavic names', () => {
            const name = linguist.getName(NameStyle.Slavic);
            console.log('Slavic Name:', name);
            expect(name).toBeTruthy();
            expect(name.length).toBeGreaterThan(2);
        });

        it('should generate French and Spanish names', () => {
            const french = linguist.getName(NameStyle.French);
            const spanish = linguist.getName(NameStyle.Spanish);
            console.log('French:', french, 'Spanish:', spanish);
            expect(french).toBeTruthy();
            expect(spanish).toBeTruthy();
        });

        it('should generate English and German names', () => {
            const english = linguist.getName(NameStyle.English);
            const german = linguist.getName(NameStyle.German);
            console.log('English:', english, 'German:', german);
            expect(english).toBeTruthy();
            expect(german).toBeTruthy();
        });

        it('should generate diverse new styles (Maori, Arabic, Polish)', () => {
            const maori = linguist.getName(NameStyle.Maori);
            const arabic = linguist.getName(NameStyle.Arabic);
            const polish = linguist.getName(NameStyle.Polish);
            console.log('Maori:', maori, 'Arabic:', arabic, 'Polish:', polish);
            expect(maori).toBeTruthy();
            expect(arabic).toBeTruthy();
            expect(polish).toBeTruthy();
        });

        it('should generate Juxtaposition names (Adjective Noun)', () => {
            const name = linguist.getName(NameStyle.Juxtaposition);
            console.log('Juxtaposition Name:', name);
            expect(name).toBeTruthy();
            expect(name).toContain(' '); // Should have a space like "Silent River"
        });
    });
});

