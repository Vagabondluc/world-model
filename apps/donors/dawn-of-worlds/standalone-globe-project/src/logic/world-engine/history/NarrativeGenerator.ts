
import { NameStyle, WorldLinguist } from "./WorldLinguist";
import { HistoryEventType } from "./types";

export interface NarrativeOutput {
    mythic: string;
    scientific: string;
}

export class NarrativeGenerator {
    private linguist: WorldLinguist;

    constructor() {
        this.linguist = new WorldLinguist();
    }

    public generate(type: HistoryEventType, data: any, cultureId: NameStyle): NarrativeOutput {
        switch (type) {
            case HistoryEventType.TECTONICS_FORMED:
                return this.genTectonics(data, cultureId);
            case HistoryEventType.RIVER_CARVED:
                return this.genRiver(data, cultureId);
            case HistoryEventType.SETTLEMENT_FOUNDED:
                return this.genSettlement(data, cultureId);
            case HistoryEventType.ERA_COMPLETE:
                return {
                    mythic: `And so ended the Age of ${data.era}.`,
                    scientific: `Era ${data.era} simulation step complete.`
                };
            default:
                return { mythic: "Something happened.", scientific: "Unknown event." };
        }
    }

    private genTectonics(data: any, style: NameStyle): NarrativeOutput {
        // Example Data: { id: 1, plateCount: 5 }
        const plateName = this.linguist.getName(style);

        return {
            mythic: `And the earth was without form, until the great plate of ${plateName} rose from the deep, dividing the waters.`,
            scientific: `Tectonic Plate ${data.id} shifted, causing orogenous uplift.`
        };
    }

    private genRiver(data: any, style: NameStyle): NarrativeOutput {
        // Example Data: { id: 12, length: 50, regionName: "The North" }
        const riverName = this.linguist.getName(style);
        const mountainName = this.linguist.getName(style);

        return {
            mythic: `From the heights of Mount ${mountainName}, the waters gathered, birthing the ${riverName}, life-giver of the valley.`,
            scientific: `River ${data.id} formed due to hydraulic erosion flux > threshold.`
        };
    }

    private genSettlement(data: any, style: NameStyle): NarrativeOutput {
        // Example Data: { id: 502, type: 'CITY', location: [...] }
        const cityName = this.linguist.getName(style);
        const peopleName = style.toString();

        const settlementType = data.type === 'CITY' ? "great city" : "village";

        return {
            mythic: `And the people of the ${peopleName} settled in the plains, raising the stones of ${cityName}, a ${settlementType} of renown.`,
            scientific: `Settlement (${data.type}) placed at ${data.id} based on suitability score.`
        };
    }
}
