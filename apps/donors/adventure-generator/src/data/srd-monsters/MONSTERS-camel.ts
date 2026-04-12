import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CAMEL: SavedMonster = {
  "id": "srd-camel",
  "name": "Camel",
  "description": "These hardy desert animals are known for their resilience and stubborn temperament. They are commonly used as beasts of burden in arid climates.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "9",
      "hitPoints": "15 (2d10+4)",
      "speed": "50 ft.",
      "senses": "passive Perception 9",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +3, DEX -1, CON +2, INT -4, WIS -1, CHA -3",
      "role": ""
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage.",
    "roleplayingAndTactics": "Camels are not aggressive but will spit or bite if provoked. They are notoriously stubborn and may refuse to move if mistreated or overburdened. In combat, they are more likely to flee than fight."
  },
  "statblock": "### Camel\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 9\n\n- **Hit Points** 15 (2d10+4)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 8 (-1) | 14 (+2) | 2 (-4) | 8 (-1) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage."
};

export default SRD_MONSTER_CAMEL;