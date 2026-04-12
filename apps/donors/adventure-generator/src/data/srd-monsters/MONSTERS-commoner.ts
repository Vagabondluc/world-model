
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_COMMONER: SavedMonster = {
  "id": "srd-commoner",
  "name": "Commoner",
  "description": "A typical peasant, artisan, or merchant found in towns and villages across the land. They are the backbone of civilization.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "10",
      "hitPoints": "4 (1d8)",
      "speed": "30 ft.",
      "senses": "passive Perception 10",
      "languages": "any one language (usually Common)",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR +0, DEX +0, CON +0, INT +0, WIS +0, CHA +0",
      "role": "Minion"
    },
    "abilitiesAndTraits": "",
    "actions": "**Club.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage.",
    "roleplayingAndTactics": "Commoners are not warriors and will avoid combat at all costs, either by fleeing or surrendering. If forced to fight for their lives or families, they may form a mob and attack with improvised weapons, but they are easily routed."
  },
  "statblock": "### Commoner\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 4 (1d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 10 (+0) | 10 (+0) | 10 (+0) | 10 (+0) | 10 (+0) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 0 (10 XP)\n\n___\n\n### Actions\n***Club.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage."
};

export default SRD_MONSTER_COMMONER;