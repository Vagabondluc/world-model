
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ORC: SavedMonster = {
  "id": "srd-orc",
  "name": "Orc",
  "description": "Orcs are savage, brutish humanoids with a lust for slaughter and destruction. They are known for their foul tempers and their tendency to gather in large, war-mongering tribes.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (orc)",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "13 (hide armor)",
      "hitPoints": "15 (2d8+6)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Common, Orc",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +3, INT -2, WIS +0, CHA +0",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Aggressive.** As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.",
    "actions": "**Greataxe.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 9 (1d12+3) slashing damage.",
    "roleplayingAndTactics": "Orcs are aggressive combatants who live for the thrill of battle. They will use their Aggressive ability to close with the enemy as quickly as possible, overwhelming them with brute force. They are not subtle and will charge headlong into a fight, but they respect strength and may follow a powerful leader."
  },
  "statblock": "### Orc\n\n*Medium humanoid (orc), chaotic evil*\n\n___\n\n- **Armor Class** 13 (hide armor)\n\n- **Hit Points** 15 (2d8+6)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 12 (+1) | 16 (+3) | 7 (-2) | 11 (+0) | 10 (+0) |\n\n___\n\n- **Skills** Intimidation +2\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Common, Orc\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Aggressive.*** As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.\n\n### Actions\n***Greataxe.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 9 (1d12+3) slashing damage."
};

export default SRD_MONSTER_ORC;
