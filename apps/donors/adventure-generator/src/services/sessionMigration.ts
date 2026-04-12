import { CampaignStateExportSchema } from '../schemas/campaign';
import { CompendiumStateExportSchema } from '../schemas/compendium';
import { GeneratorStateCleanedSchema } from '../schemas/generator';
import { LocationStateExportSchema } from '../schemas/location';
import { SessionStateV2Schema } from '../schemas/session';
import type { SessionStateV2 } from '../types/session';

type MigrationResult = {
    session: SessionStateV2;
    warnings: string[];
};

const safeParseOrWarn = <T>(
    schema: { safeParse: (data: unknown) => { success: boolean; data: T; error?: { message: string } } },
    data: unknown,
    warnings: string[],
    label: string
): T | null => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        warnings.push(`${label} failed validation: ${parsed.error?.message ?? 'unknown error'}`);
        return null;
    }
    return parsed.data;
};

export const migrateSession = (raw: unknown, fallback: SessionStateV2): MigrationResult => {
    const warnings: string[] = [];

    const parsedV2 = SessionStateV2Schema.safeParse(raw);
    if (parsedV2.success) {
        return { session: parsedV2.data, warnings };
    }

    const rawObject = (raw && typeof raw === 'object') ? (raw as Record<string, unknown>) : {};
    const version = rawObject.version;

    if (version !== 1 && version !== 2) {
        warnings.push('Unknown session version. Falling back to safe import.');
    }

    const campaignState = safeParseOrWarn(CampaignStateExportSchema, rawObject.campaignState, warnings, 'campaignState')
        ?? fallback.campaignState;
    const locationState = safeParseOrWarn(LocationStateExportSchema, rawObject.locationState, warnings, 'locationState')
        ?? fallback.locationState;
    const compendiumState = safeParseOrWarn(CompendiumStateExportSchema, rawObject.compendiumState, warnings, 'compendiumState')
        ?? fallback.compendiumState;
    const generatorState = safeParseOrWarn(GeneratorStateCleanedSchema, rawObject.generatorState, warnings, 'generatorState')
        ?? fallback.generatorState;

    return {
        session: {
            version: 2,
            campaignState,
            locationState,
            compendiumState,
            generatorState,
        },
        warnings,
    };
};
