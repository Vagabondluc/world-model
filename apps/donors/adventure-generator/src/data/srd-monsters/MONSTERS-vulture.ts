
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_VULTURE: SavedMonster = {
  "id": "srd-vulture",
  "name": "Vulture",
  "description": "A common scavenger bird found in deserts and wastelands, vultures are known for circling high above, waiting for creatures to die.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "5 (1d8+1)",
      "speed": "10 ft., fly 50 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -2, DEX +0, CON +1, INT -4, WIS +1, CHA -3",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Keen Sight and Smell.** The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell.\n\n**Pack Tactics.** The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Beak.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) piercing damage.",
    "roleplayingAndTactics": "Vultures are cowardly creatures that will not attack a healthy creature. They will flock to a carcass or a dying creature, using their pack tactics to overwhelm it."
  },
  "statblock": "### Vulture\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 5 (1d8+1)\n\n- **Speed** 10 ft., fly 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 7 (-2) | 10 (+0) | 13 (+1) | 2 (-4) | 12 (+1) | 4 (-3) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Keen Sight and Smell.*** The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell.\n\n***Pack Tactics.*** The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Beak.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) piercing damage."
};

export default SRD_MONSTER_VULTURE;
