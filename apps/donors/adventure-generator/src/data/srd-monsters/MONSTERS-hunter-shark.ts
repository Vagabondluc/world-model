

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HUNTER_SHARK: SavedMonster = {
  "id": "srd-hunter-shark",
  "name": "Hunter Shark",
  "description": "A large, aggressive predator of the deep, the hunter shark is a relentless killing machine, drawn by the scent of blood in the water.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "45 (6d10+12)",
      "speed": "0 ft., swim 40 ft.",
      "senses": "blindsight 30 ft., passive Perception 12",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +1, CON +2, INT -5, WIS +0, CHA -3",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Blood Frenzy.** The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n**Water Breathing.** The shark can breathe only underwater.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) piercing damage.",
    "roleplayingAndTactics": "Hunter sharks are straightforward predators. They circle their prey, waiting for an opportunity to strike. Once a target is wounded, their Blood Frenzy makes them even more dangerous. They are not subtle and will attack any creature they perceive as food or a threat."
  },
  "statblock": "### Hunter Shark\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 45 (6d10+12)\n\n- **Speed** 0 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 13 (+1) | 15 (+2) | 1 (-5) | 10 (+0) | 4 (-3) |\n\n___\n\n- **Skills** Perception +2\n\n- **Senses** blindsight 30 ft., passive Perception 12\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Blood Frenzy.*** The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n***Water Breathing.*** The shark can breathe only underwater.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) piercing damage."
};

export default SRD_MONSTER_HUNTER_SHARK;