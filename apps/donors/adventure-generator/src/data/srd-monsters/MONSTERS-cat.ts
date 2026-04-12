import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CAT: SavedMonster = {
  "id": "srd-cat",
  "name": "Cat",
  "description": "A common feline, found in homes, alleys, and wild spaces alike. Cats are known for their grace, independence, and sharp senses.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "2 (1d4)",
      "speed": "40 ft., climb 30 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +2, CON +0, INT -4, WIS +1, CHA -2",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Keen Smell.** The cat has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Claws.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 slashing damage.",
    "roleplayingAndTactics": "A typical cat avoids combat with creatures larger than itself. If cornered, it will hiss and scratch before attempting to flee. It is a silent hunter of tiny prey."
  },
  "statblock": "### Cat\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 2 (1d4)\n\n- **Speed** 40 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 3 (-4) | 15 (+2) | 10 (+0) | 3 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3, Stealth +4\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Keen Smell.*** The cat has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Claws.*** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 slashing damage."
};

export default SRD_MONSTER_CAT;