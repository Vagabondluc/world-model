export function generateName(seed: string): string {
  const syllables = [
    "al",
    "ar",
    "bel",
    "cor",
    "den",
    "el",
    "fal",
    "gar",
    "hal",
    "is",
    "jor",
    "kel",
    "lor",
    "mar",
    "nor",
    "or",
    "pel",
    "qua",
    "ran",
    "sar",
    "tor",
    "ul",
    "ver",
    "wel",
    "yor",
    "zen"
  ];
  const chars = [...seed.trim().toLowerCase().replace(/[^a-z0-9]/g, "")];
  const base = chars.length > 0 ? chars : ["w", "o", "r", "l", "d"];
  const index = base.reduce((sum, char, position) => sum + char.charCodeAt(0) * (position + 1), 0);
  const a = syllables[index % syllables.length];
  const b = syllables[(index + 5) % syllables.length];
  const c = syllables[(index + 11) % syllables.length];
  return `${a}${b}${c}`.replace(/^(.)/, (letter) => letter.toUpperCase());
}
