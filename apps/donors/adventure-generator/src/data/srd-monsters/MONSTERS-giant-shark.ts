import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_SHARK: SavedMonster = {
  "id": "srd-giant-shark",
  "name": "Giant Shark",
  "description": "An apex predator of the ocean, the giant shark is a terrifyingly efficient killing machine, capable of swallowing a human whole.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "126 (11d12+55)",
      "speed": "0 ft., swim 50 ft.",
      "senses": "blindsight 60 ft., passive Perception 13",
      "languages": "-",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +6, DEX +0, CON +5, INT -5, WIS +0, CHA -3",
      "role": "Ambusher"
    },
    "savingThrows": {
      "str": 9,
      "con": 8
    },
    "abilitiesAndTraits": "**Blood Frenzy.** The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n**Water Breathing.** The shark can breathe only underwater.",
    "actions": "**Bite.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 22 (3d10+6) piercing damage.",
    "roleplayingAndTactics": "Driven by a constant hunger, the giant shark is a relentless hunter. It uses its keen sense of smell to track prey from miles away. Its Blood Frenzy makes it even more dangerous once it has wounded a target."
  },
  "statblock": "### Giant Shark\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 126 (11d12+55)\n\n- **Speed** 0 ft., swim 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 11 (+0) | 21 (+5) | 1 (-5) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Saving Throws** Str +9, Con +8\n- **Skills** Perception +3\n\n- **Senses** blindsight 60 ft., passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Blood Frenzy.*** The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n***Water Breathing.*** The shark can breathe only underwater.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 22 (3d10+6) piercing damage."
};

export default SRD_MONSTER_GIANT_SHARK;