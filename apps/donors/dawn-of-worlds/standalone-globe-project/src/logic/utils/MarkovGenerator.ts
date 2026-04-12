
/**
 * Markov Chain Generator for procedural text generation.
 * Trains on a list of input strings to learn character transition probabilities.
 */
export class MarkovGenerator {
    private model: Map<string, string[]>;
    private order: number;

    constructor(order: number = 2) {
        this.order = order;
        this.model = new Map();
    }

    /**
     * Train the model with a list of sample words
     */
    public train(samples: string[]): void {
        for (let word of samples) {
            word = word.trim().toUpperCase();
            if (!word) continue;

            // Pad with start/end tokens
            const padded = "^".repeat(this.order) + word + "$";

            for (let i = 0; i < padded.length - this.order; i++) {
                const gram = padded.substring(i, i + this.order);
                const nextChar = padded[i + this.order];

                if (!this.model.has(gram)) {
                    this.model.set(gram, []);
                }
                this.model.get(gram)!.push(nextChar);
            }
        }
    }

    /**
     * Generate a new word
     */
    public generate(minLength: number = 4, maxLength: number = 10): string {
        if (this.model.size === 0) return "ERROR";

        let attempts = 0;
        while (attempts < 50) {
            attempts++;
            let current = "^".repeat(this.order);
            let name = "";

            while (true) {
                if (!this.model.has(current)) break; // Dead end

                const candidates = this.model.get(current)!;
                const nextChar = candidates[Math.floor(Math.random() * candidates.length)];

                if (nextChar === "$") break; // End of word

                name += nextChar;
                current = current.substring(1) + nextChar;

                if (name.length > maxLength) break;
            }

            if (name.length >= minLength && name.length <= maxLength) {
                // Capitalize first letter, lower rest
                return name.charAt(0) + name.slice(1).toLowerCase();
            }
        }

        return "Unknown"; // Fallback if generation fails
    }
}
