
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_REEF_SHARK: SavedMonster = {
  "id": "srd-reef-shark",
  "name": "Reef Shark",
  "description": "A common predator of coastal waters and reefs. They are sleek, powerful hunters that often travel in small packs.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "22 (4d8+4)",
      "speed": "0 ft., swim 40 ft.",
      "senses": "blindsight 30 ft., passive Perception 12",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +1, INT -5, WIS +0, CHA -3",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Pack Tactics.** The shark has advantage on an attack roll against a creature if at least one of the shark's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n**Water Breathing.** The shark can breathe only underwater.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage.",
    "roleplayingAndTactics": "Reef sharks are opportunistic hunters. They use their Pack Tactics to surround and overwhelm prey. The scent of blood can drive them into a frenzy."
  },
  "statblock": "### Reef Shark\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 22 (4d8+4)\n\n- **Speed** 0 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 13 (+1) | 13 (+1) | 1 (-5) | 10 (+0) | 4 (-3) |\n\n___\n\n- **Skills** Perception +2\n\n- **Senses** blindsight 30 ft., passive Perception 12\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Pack Tactics.*** The shark has advantage on an attack roll against a creature if at least one of the shark's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n***Water Breathing.*** The shark can breathe only underwater.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage."
};

export default SRD_MONSTER_REEF_SHARK;
