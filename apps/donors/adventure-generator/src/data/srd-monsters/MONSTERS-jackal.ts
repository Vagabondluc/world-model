

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_JACKAL: SavedMonster = {
  "id": "srd-jackal",
  "name": "Jackal",
  "description": "A small, canine scavenger found in deserts and grasslands. They are known for their distinctive cries and for hunting in packs.",
  "profile": {
    "table": {
      "creatureType": "Small beast",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "3 (1d6)",
      "speed": "40 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -1, DEX +2, CON +0, INT -4, WIS +1, CHA -2",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The jackal has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n**Pack Tactics.** The jackal has advantage on an attack roll against a creature if at least one of the jackal's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Bite.** *Melee Weapon Attack:* +1 to hit, reach 5 ft., one target. *Hit:* 1 (1d4-1) piercing damage.",
    "roleplayingAndTactics": "Jackals are cowardly alone but bold in a pack. They use their speed and Pack Tactics to surround and harry larger prey, nipping at their heels. They will flee if they face a strong, unified defense."
  },
  "statblock": "### Jackal\n\n*Small beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 3 (1d6)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 8 (-1) | 15 (+2) | 11 (+0) | 3 (-4) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Keen Hearing and Smell.*** The jackal has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n***Pack Tactics.*** The jackal has advantage on an attack roll against a creature if at least one of the jackal's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +1 to hit, reach 5 ft., one target. *Hit:* 1 (1d4 - 1) piercing damage."
};

export default SRD_MONSTER_JACKAL;