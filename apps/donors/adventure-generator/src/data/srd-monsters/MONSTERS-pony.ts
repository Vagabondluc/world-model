
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PONY: SavedMonster = {
  "id": "srd-pony",
  "name": "Pony",
  "description": "A small horse, often used as a mount for halflings and gnomes, or as a pack animal. Ponies are known for their sturdy build and sometimes stubborn temperament.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "11 (2d8+2)",
      "speed": "40 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +1, INT -4, WIS +0, CHA -2",
      "role": ""
    },
    "abilitiesAndTraits": "",
    "actions": "**Hooves.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4 + 2) bludgeoning damage.",
    "roleplayingAndTactics": "Ponies are not combatants and will flee from danger. If cornered, they may kick with their hooves in self-defense."
  },
  "statblock": "### Pony\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 10 (+0) | 13 (+1) | 2 (-4) | 11 (+0) | 7 (-2) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n### Actions\n***Hooves.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4 + 2) bludgeoning damage."
};

export default SRD_MONSTER_PONY;
