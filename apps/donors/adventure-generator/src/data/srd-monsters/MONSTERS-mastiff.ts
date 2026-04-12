import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MASTIFF: SavedMonster = {
  "id": "srd-mastiff",
  "name": "Mastiff",
  "description": "These large, powerful dogs are known for their loyalty and courage. They are often used as guard dogs and companions.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "5 (1d8+1)",
      "speed": "40 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +1, DEX +2, CON +1, INT -4, WIS +1, CHA -2",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The mastiff has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
    "actions": "**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.",
    "roleplayingAndTactics": "A mastiff is a loyal companion that will fiercely defend its master or territory. In combat, it will try to knock an opponent prone with its bite, then stand over them, growling. It is not inherently vicious but is a capable and brave fighter."
  },
  "statblock": "### Mastiff\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 5 (1d8+1)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 14 (+2) | 12 (+1) | 3 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Keen Hearing and Smell.*** The mastiff has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."
};

export default SRD_MONSTER_MASTIFF;