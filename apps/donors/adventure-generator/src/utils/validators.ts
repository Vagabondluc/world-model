
import { CampaignConfiguration } from '../types/campaign';
import { SimpleAdventureDetails } from '../types/generator';
import { AdventureGenerationError } from './errorUtils';

export const parseAndValidateSimpleAdventures = (parsed: unknown, expectedLength: number): SimpleAdventureDetails[] => {
    if (!Array.isArray(parsed)) {
        throw new AdventureGenerationError('Expected array response from AI service', 'Parsing Adventure Details', 'Validation');
    }
    
    if (parsed.length !== expectedLength) {
        throw new AdventureGenerationError(`AI response length mismatch: expected ${expectedLength}, got ${parsed.length}`, 'Parsing Adventure Details', 'Validation');
    }
    
    for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (typeof item.origin !== 'string' || typeof item.positioning !== 'string' || typeof item.stakes !== 'string') {
            throw new AdventureGenerationError(`Invalid response structure at index ${i}`, 'Parsing Adventure Details', 'Validation');
        }
    }
    
    return parsed as SimpleAdventureDetails[];
};

export class ConfigurationValidator {
    validateCampaignConfig(config: CampaignConfiguration): void {
        const warnings: string[] = [];
        if (config.tone === 'comedic' && config.genre === 'horror') {
            warnings.push('Comedic tone with horror genre may create conflicting instructions');
        }
        const maxLength = 2000;
        if (config.worldInformation.length > maxLength) warnings.push(`World information is very long (${config.worldInformation.length} chars). Consider condensing.`);
        if (config.playerInformation.length > maxLength) warnings.push(`Player information is very long (${config.playerInformation.length} chars). Consider condensing.`);
        if (config.npcInformation.length > maxLength) warnings.push(`NPC information is very long (${config.npcInformation.length} chars). Consider condensing.`);
        if (warnings.length > 0) {
            console.warn('Configuration warnings:', warnings);
        }
    }
}
