import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BADGER: SavedMonster = {
  "id": "srd-badger",
  "name": "Badger",
  "description": "These small, burrowing mammals are known for their surprising ferocity when cornered.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "3 (1d4+1)",
      "speed": "20 ft., burrow 5 ft.",
      "senses": "darkvision 30 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -3, DEX +0, CON +1, INT -4, WIS +1, CHA -3",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Keen Smell.** The badger has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Bite.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage.",
    "roleplayingAndTactics": "A badger will typically flee from larger creatures, but if cornered or if its burrow is threatened, it attacks with surprising ferocity. It will not back down once engaged."
  },
  "statblock": "### Badger\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 3 (1d4+1)\n\n- **Speed** 20 ft., burrow 5 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 4 (-3) | 11 (+0) | 12 (+1) | 2 (-4) | 12 (+1) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 30 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Keen Smell.*** The badger has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage."
};

export default SRD_MONSTER_BADGER;