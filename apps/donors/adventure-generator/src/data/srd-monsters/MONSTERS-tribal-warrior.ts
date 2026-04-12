
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_TRIBAL_WARRIOR: SavedMonster = {
  "id": "srd-tribal-warrior",
  "name": "Tribal Warrior",
  "description": "These warriors are members of tribes living on the fringes of civilization, fiercely protective of their lands and people. They can be found in jungles, deserts, and frozen wastes.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "12 (hide armor)",
      "hitPoints": "11 (2d8 + 2)",
      "speed": "30 ft.",
      "senses": "passive Perception 10",
      "languages": "any one language",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +1, DEX +0, CON +1, INT -1, WIS +0, CHA -1",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Pack Tactics.** The warrior has advantage on an attack roll against a creature if at least one of the warrior's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Spear.** *Melee or Ranged Weapon Attack:* +3 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack.",
    "roleplayingAndTactics": "Tribal warriors fight with a primal ferocity, using Pack Tactics to overwhelm their enemies. They are skilled hunters and trackers and will use their knowledge of the terrain to set ambushes."
  },
  "statblock": "### Tribal Warrior\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 12 (hide armor)\n\n- **Hit Points** 11 (2d8 + 2)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 11 (+0) | 12 (+1) | 8 (-1) | 11 (+0) | 8 (-1) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** any one language\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Pack Tactics.*** The warrior has advantage on an attack roll against a creature if at least one of the warrior's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Spear.*** *Melee or Ranged Weapon Attack:* +3 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack."
};

export default SRD_MONSTER_TRIBAL_WARRIOR;