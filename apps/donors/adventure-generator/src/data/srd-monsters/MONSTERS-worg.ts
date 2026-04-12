
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WORG: SavedMonster = {
  "id": "srd-worg",
  "name": "Worg",
  "description": "Worgs are large, evil, and intelligent wolves, often found in the company of goblins and orcs who use them as mounts. They are larger and more ferocious than common wolves.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "neutral evil",
      "armorClass": "13 (natural armor)",
      "hitPoints": "26 (4d10+4)",
      "speed": "50 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "Goblin, Worg",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +1, INT -2, WIS +0, CHA -1",
      "role": ""
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The worg has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
    "roleplayingAndTactics": "Worgs are vicious and cunning predators. They are intelligent enough to understand speech and will follow the commands of their riders. In the wild, they hunt in packs, using their size and strength to knock down prey."
  },
  "statblock": "### Worg\n\n*Large monstrosity, neutral evil*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 26 (4d10+4)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 13 (+1) | 13 (+1) | 7 (-2) | 11 (+0) | 8 (-1) |\n\n___\n\n- **Skills** Perception +4\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** Goblin, Worg\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Keen Hearing and Smell.*** The worg has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
};

export default SRD_MONSTER_WORG;
