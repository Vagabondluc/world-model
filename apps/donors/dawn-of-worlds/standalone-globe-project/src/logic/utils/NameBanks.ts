
/**
 * Data banks for Procedural Name Generation.
 * Includes explicit lists for Constructive generation and Corpus lists for Markov training.
 */

// Re-export from new modular structure
export * from './linguistics/banks';

import {
    germanic,
    romance,
    asian,
    greek,
    slavic,
    sinotibetan,
    austronesian,
    afroasiatic,
    nigercongo,
    amerindian,
    uralic,
    spanish, french, english, german,
    celtic, italian, portuguese, polish, dutch,
    arabic, persian, turkish, hindi,
    korean, vietnamese, maori,
    swahili, yoruba,
    nahuatl, inuit,
    ConstructiveBanks as CB
} from './linguistics/banks';

export const ConstructiveBanks = CB;

export const MarkovBanks = {
    germanic,
    romance,
    asian,
    greek,
    slavic,
    sinotibetan,
    austronesian,
    afroasiatic,
    nigercongo,
    amerindian,
    uralic,
    spanish,
    french,
    english,
    german,
    celtic,
    italian,
    portuguese,
    polish,
    dutch,
    arabic,
    persian,
    turkish,
    hindi,
    korean,
    vietnamese,
    maori,
    swahili,
    yoruba,
    nahuatl,
    inuit
};
