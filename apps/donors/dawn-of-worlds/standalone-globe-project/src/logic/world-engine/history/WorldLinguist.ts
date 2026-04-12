
import { MarkovGenerator } from '../../utils/MarkovGenerator';
import { ConstructiveBanks, MarkovBanks } from '../../utils/NameBanks';

export enum NameStyle {
    Constructive = 'Constructive',
    Juxtaposition = 'Juxtaposition', // New Style
    Germanic = 'Germanic',
    Romance = 'Romance',
    Asian = 'Asian',
    Greek = 'Greek',
    Slavic = 'Slavic',
    SinoTibetan = 'SinoTibetan',
    Austronesian = 'Austronesian',
    AfroAsiatic = 'AfroAsiatic',
    NigerCongo = 'NigerCongo',
    Amerindian = 'Amerindian',
    Uralic = 'Uralic',
    Spanish = 'Spanish',
    French = 'French',
    English = 'English',
    German = 'German',
    Celtic = 'Celtic',
    Italian = 'Italian',
    Portuguese = 'Portuguese',
    Polish = 'Polish',
    Dutch = 'Dutch',
    Arabic = 'Arabic',
    Persian = 'Persian',
    Turkish = 'Turkish',
    Hindi = 'Hindi',
    Korean = 'Korean',
    Vietnamese = 'Vietnamese',
    Maori = 'Maori',
    Swahili = 'Swahili',
    Yoruba = 'Yoruba',
    Nahuatl = 'Nahuatl',
    Inuit = 'Inuit'
}

export class WorldLinguist {
    private markovs: Map<string, MarkovGenerator>;

    constructor() {
        this.markovs = new Map();

        // Initialize Markov Generators
        this.initMarkov(NameStyle.Germanic, MarkovBanks.germanic);
        this.initMarkov(NameStyle.Romance, MarkovBanks.romance);
        this.initMarkov(NameStyle.Asian, MarkovBanks.asian);
        this.initMarkov(NameStyle.Greek, MarkovBanks.greek);
        this.initMarkov(NameStyle.Slavic, MarkovBanks.slavic);
        this.initMarkov(NameStyle.SinoTibetan, MarkovBanks.sinotibetan);
        this.initMarkov(NameStyle.Austronesian, MarkovBanks.austronesian);
        this.initMarkov(NameStyle.AfroAsiatic, MarkovBanks.afroasiatic);
        this.initMarkov(NameStyle.NigerCongo, MarkovBanks.nigercongo);
        this.initMarkov(NameStyle.Amerindian, MarkovBanks.amerindian);
        this.initMarkov(NameStyle.Uralic, MarkovBanks.uralic);
        this.initMarkov(NameStyle.Spanish, MarkovBanks.spanish);
        this.initMarkov(NameStyle.French, MarkovBanks.french);
        this.initMarkov(NameStyle.English, MarkovBanks.english);
        this.initMarkov(NameStyle.German, MarkovBanks.german);
        this.initMarkov(NameStyle.Celtic, MarkovBanks.celtic);
        this.initMarkov(NameStyle.Italian, MarkovBanks.italian);
        this.initMarkov(NameStyle.Portuguese, MarkovBanks.portuguese);
        this.initMarkov(NameStyle.Polish, MarkovBanks.polish);
        this.initMarkov(NameStyle.Dutch, MarkovBanks.dutch);
        this.initMarkov(NameStyle.Arabic, MarkovBanks.arabic);
        this.initMarkov(NameStyle.Persian, MarkovBanks.persian);
        this.initMarkov(NameStyle.Turkish, MarkovBanks.turkish);
        this.initMarkov(NameStyle.Hindi, MarkovBanks.hindi);
        this.initMarkov(NameStyle.Korean, MarkovBanks.korean);
        this.initMarkov(NameStyle.Vietnamese, MarkovBanks.vietnamese);
        this.initMarkov(NameStyle.Maori, MarkovBanks.maori);
        this.initMarkov(NameStyle.Swahili, MarkovBanks.swahili);
        this.initMarkov(NameStyle.Yoruba, MarkovBanks.yoruba);
        this.initMarkov(NameStyle.Nahuatl, MarkovBanks.nahuatl);
        this.initMarkov(NameStyle.Inuit, MarkovBanks.inuit);
    }

    private initMarkov(style: string, data: string[]) {
        const gen = new MarkovGenerator(2);
        gen.train(data);
        this.markovs.set(style, gen);
    }

    /**
     * Generate a name based on the requested style
     */
    public getName(style: NameStyle): string {
        if (style === NameStyle.Constructive) {
            return this.generateConstructive();
        }
        if (style === NameStyle.Juxtaposition) {
            return this.generateJuxtaposition();
        }

        const generator = this.markovs.get(style);
        if (generator) {
            return generator.generate();
        }

        return "Unnamed";
    }

    public getRandomStyle(): NameStyle {
        const styles = Object.values(NameStyle);
        return styles[Math.floor(Math.random() * styles.length)] as NameStyle;
    }

    /**
     * Helper for Constructive Generation (Prefix + Root + Suffix)
     */
    private generateConstructive(): string {
        const usePrefix = Math.random() > 0.3;
        const prefix = usePrefix ? this.getRandom(ConstructiveBanks.prefixes) : "";
        const root = this.getRandom(ConstructiveBanks.roots);
        const suffix = this.getRandom(ConstructiveBanks.suffixes);

        // Simple assembly
        let name = prefix ? `${prefix} ${root}${suffix}` : `${root}${suffix}`;

        // Formatting
        name = name.trim().replace(/\s+/g, ' '); // remove double spaces

        // Title case handling
        return this.toTitleCase(name);
    }

    /**
     * Helper for Juxtaposition Generation (Adjective + Noun)
     */
    private generateJuxtaposition(): string {
        const adj = this.getRandom(ConstructiveBanks.adjectives);
        const noun = this.getRandom(ConstructiveBanks.nouns);
        return `${adj} ${noun}`;
    }

    private getRandom(arr: string[]): string {
        if (!arr || arr.length === 0) return "Void";
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private toTitleCase(str: string): string {
        return str.split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
    }
}
