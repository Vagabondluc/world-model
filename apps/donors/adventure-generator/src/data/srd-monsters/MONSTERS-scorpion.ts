
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SCORPION: SavedMonster = {
  "id": "srd-scorpion",
  "name": "Scorpion",
  "description": "A common desert and underdark predator, this tiny arachnid has a venomous stinger that can be surprisingly painful.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "11 (natural armor)",
      "hitPoints": "1 (1d4-1)",
      "speed": "10 ft.",
      "senses": "blindsight 10 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +0, CON -1, INT -5, WIS -1, CHA -4",
      "role": "Minion"
    },
    "abilitiesAndTraits": "",
    "actions": "**Sting.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one creature. *Hit:* 1 piercing damage, and the target must make a DC 9 Constitution saving throw, taking 4 (1d8) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Scorpions are ambush predators that hide under rocks or sand. They strike with their stinger if threatened. A single scorpion is a nuisance, but a swarm can be deadly."
  },
  "statblock": "### Scorpion\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 10 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 11 (+0) | 8 (-1) | 1 (-5) | 8 (-1) | 2 (-4) |\n\n___\n\n- **Senses** blindsight 10 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n### Actions\n***Sting.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one creature. *Hit:* 1 piercing damage, and the target must make a DC 9 Constitution saving throw, taking 4 (1d8) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_SCORPION;
