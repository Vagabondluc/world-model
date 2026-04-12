
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DIRE_WOLF: SavedMonster = {
  "id": "srd-dire-wolf",
  "name": "Dire Wolf",
  "description": "A larger, stronger, and more cunning cousin of the common wolf. Dire wolves are pack hunters of prehistoric size and ferocity.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "14 (natural armor)",
      "hitPoints": "37 (5d10+10)",
      "speed": "50 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +2, INT -4, WIS +1, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n**Pack Tactics.** The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
    "roleplayingAndTactics": "Dire wolves are intelligent pack hunters. They use their speed and Pack Tactics to surround and overwhelm their prey. They will focus on a single target, attempting to knock it prone to gain advantage on subsequent attacks."
  },
  "statblock": "### Dire Wolf\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 37 (5d10+10)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 15 (+2) | 15 (+2) | 3 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3, Stealth +4\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Keen Hearing and Smell.*** The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n***Pack Tactics.*** The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6 + 3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
};

export default SRD_MONSTER_DIRE_WOLF;