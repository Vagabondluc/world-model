
/**
 * A lightweight Markov chain generator for fantasy names.
 */
export class MarkovGenerator {
    private chain: Record<string, string[]> = {};
    private starters: string[] = [];
    private avgLength: number;

    constructor(trainingData: string[], order: number = 2) {
        this.avgLength = trainingData.reduce((sum, s) => sum + s.length, 0) / trainingData.length;
        this.train(trainingData, order);
    }

    private train(data: string[], order: number) {
        data.forEach(word => {
            if (word.length <= order) return;

            this.starters.push(word.substring(0, order));

            for (let i = 0; i < word.length - order; i++) {
                const gram = word.substring(i, i + order);
                const next = word[i + order];

                if (!this.chain[gram]) this.chain[gram] = [];
                this.chain[gram].push(next);
            }

            // End of word token (null)
            const lastGram = word.substring(word.length - order);
            if (!this.chain[lastGram]) this.chain[lastGram] = [];
            this.chain[lastGram].push(""); // Represents end
        });
    }

    generate(minLength: number = 4, maxLength: number = 12): string {
        let attempts = 0;
        while (attempts < 50) {
            attempts++;
            let name = this.starters[Math.floor(Math.random() * this.starters.length)];
            let current = name;

            while (name.length < maxLength) {
                const possibilities = this.chain[current];
                if (!possibilities || possibilities.length === 0) break;

                const next = possibilities[Math.floor(Math.random() * possibilities.length)];
                if (next === "") {
                    if (name.length >= minLength) return this.capitalize(name);
                    break; // Too short, retry
                }

                name += next;
                current = name.substring(name.length - current.length);
            }

            if (name.length >= minLength && name.length <= maxLength) {
                return this.capitalize(name);
            }
        }
        return "Althos"; // Fallback
    }

    private capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    }
}

// --- Training Sets ---

export const MARKOV_DATA = {
    human: ["Alaric", "Alden", "Beric", "Cade", "Doran", "Edric", "Garrick", "Harlan", "Jory", "Kaelen", "Leopold", "Merrick", "Osric", "Perrin", "Quill", "Rowan", "Stellan", "Tanton", "Ulric", "Vance", "Wyatt", "Zarek", "Aveline", "Beatrix", "Cora", "Dahlia", "Elowen", "Feya", "Gwen", "Hanna", "Isolde", "Juna", "Kiera", "Lyra", "Maeve", "Nora", "Opal", "Petra", "Rhiannon", "Sela", "Tessa", "Vesper", "Wren"],
    elven: ["Aeliana", "Baelen", "Caerwyn", "Darshee", "Elowen", "Faerandol", "Galinndan", "Halaema", "Ilyrana", "Keyleth", "Luthien", "Melandir", "Nalaer", "Olorin", "Paelias", "Quelenna", "Rinn", "Sariel", "Thalia", "Ushala", "Valerius", "Xanaphia", "Yuelna"],
    dwarven: ["Balder", "Dain", "Eirik", "Farin", "Gimli", "Hogar", "Ioran", "Kili", "Lodin", "Moria", "Nori", "Oin", "Poldi", "Rurik", "Storn", "Thrain", "Udin", "Varin", "Weldon"],
    infernal: ["Azazel", "Belial", "Coronzon", "Dagon", "Erebus", "Furniculus", "Geryon", "Haborym", "Ipos", "Jezebeth", "Kasdeya", "Lucifer", "Malphas", "Nergal", "Orobas", "Paimon", "Ronove", "Samyaza", "Thammuz", "Vual", "Xaphan"],
    draconic: ["Arkan", "Balthazar", "Crimson", "Drakon", "Ember", "Fyre", "Glaurung", "Hiss", "Ignis", "Jaws", "Kalah", "Lava", "Mage", "Nox", "Obsidian", "Pyre", "Quake", "Rage", "Scale", "Talon", "Ur", "Vex", "Wyrm"]
};
