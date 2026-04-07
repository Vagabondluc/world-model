import { z } from 'zod';
import { CampaignStateExportSchema } from './campaign';
import { LocationStateExportSchema } from './location';
import { CompendiumStateExportSchema } from './compendium';
import { GeneratorStateCleanedSchema } from './generator';

export const SessionStateV2Schema = z.object({
    version: z.literal(2),
    campaignState: CampaignStateExportSchema,
    locationState: LocationStateExportSchema,
    compendiumState: CompendiumStateExportSchema,
    generatorState: GeneratorStateCleanedSchema,
});
