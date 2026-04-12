
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WEASEL: SavedMonster = {
  "id": "srd-weasel",
  "name": "Weasel",
  "description": "A small, slender carnivore known for its speed and ferocity. Weasels are relentless hunters of small prey.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "1 (1d4-1)",
      "speed": "30 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +3, CON -1, INT -4, WIS +1, CHA -4",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage.",
    "roleplayingAndTactics": "A weasel is a quick and vicious predator. It will bite and hold onto its prey, refusing to let go. While a single weasel is not a great threat, they can be dangerous in a swarm."
  },
  "statblock": "### Weasel\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 3 (-4) | 16 (+3) | 8 (-1) | 2 (-4) | 12 (+1) | 3 (-4) |\n\n___\n\n- **Skills** Perception +3, Stealth +5\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Keen Hearing and Smell.*** The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage."
};

export default SRD_MONSTER_WEASEL;
