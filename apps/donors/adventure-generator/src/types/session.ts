
import { CampaignStateExport } from './campaign';
import { LocationStateExport } from './location';
import { CompendiumStateExport } from './compendium';
import { GeneratorStateCleaned } from './generator';

// --- V2 Session State ---
// This format is a container for the exported state of each major store.
export interface SessionStateV2 {
    version: 2;
    campaignState: CampaignStateExport;
    locationState: LocationStateExport;
    compendiumState: CompendiumStateExport;
    generatorState: GeneratorStateCleaned; // Using the cleaned type which omits UI state naturally
}

export type AnySessionState = SessionStateV2 | { version: 1; [key: string]: unknown };
