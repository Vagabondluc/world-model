
import { NarrativeGenerator } from '../NarrativeGenerator';
import { HistoryEventType } from '../WorldHistorian';
import { NameStyle } from '../WorldLinguist';

describe('NarrativeGenerator', () => {
    let generator: NarrativeGenerator;

    beforeEach(() => {
        generator = new NarrativeGenerator();
    });

    it('should generate mythic and scientific text for Tectonics', () => {
        const output = generator.generate(HistoryEventType.TECTONICS_FORMED, { id: 1 }, NameStyle.Germanic);

        expect(output.mythic).toContain("And the earth was without form");
        expect(output.mythic).toContain("plate of");
        expect(output.scientific).toContain("Tectonic Plate");
    });

    it('should generate mythic and scientific text for River Carving', () => {
        const output = generator.generate(HistoryEventType.RIVER_CARVED, { id: 1 }, NameStyle.Asian);

        expect(output.mythic).toContain("From the heights");
        expect(output.mythic).toContain("life-giver of the valley");
        expect(output.scientific).toContain("River");
    });

    it('should generate mythic and scientific text for Settlement', () => {
        const output = generator.generate(HistoryEventType.SETTLEMENT_FOUNDED, { id: 1, type: 'CITY' }, NameStyle.Greek);

        expect(output.mythic).toContain("raising the stones of");
        expect(output.scientific).toContain("Settlement (CITY)");
    });

    it('should handle different NameStyles producing unique names', () => {
        const out1 = generator.generate(HistoryEventType.TECTONICS_FORMED, { id: 1 }, NameStyle.Germanic);
        const out2 = generator.generate(HistoryEventType.TECTONICS_FORMED, { id: 1 }, NameStyle.Asian);

        // Names should be different ( statistically probable )
        // We can't guarantee uniqueness with 1 sample but we can check if they contain characters specific to style
        // Or just that they "ran"
        expect(out1.mythic).not.toBe(out2.mythic);
    });
});
