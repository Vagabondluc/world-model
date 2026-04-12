
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_XORN: SavedMonster = {
  "id": "srd-xorn",
  "name": "Xorn",
  "description": "A xorn is a strange elemental from the Plane of Earth, with a barrel-shaped body, three arms, three legs, and a single large mouth on top of its head. It is driven by an insatiable hunger for precious metals and gems.",
  "profile": {
    "table": {
      "creatureType": "Medium elemental",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "19 (natural armor)",
      "hitPoints": "73 (7d8+42)",
      "speed": "20 ft., burrow 20 ft.",
      "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 16",
      "languages": "Terran",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +6, INT +0, WIS +0, CHA +0",
      "role": ""
    },
    "savingThrows": {
      "str": 6,
      "con": 9
    },
    "abilitiesAndTraits": "**Earth Glide.** The xorn can burrow through nonmagical, unworked earth and stone. While doing so, the xorn doesn't disturb the material it moves through.\n\n**Stone Camouflage.** The xorn has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.\n\n**Treasure Sense.** The xorn can pinpoint, by scent, the location of precious metals and stones, such as coins and gems, within 60 feet of it.",
    "actions": "**Multiattack.** The xorn makes three claw attacks and one bite attack.\n\n**Claw.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage.",
    "roleplayingAndTactics": "Xorn are not typically hostile unless their food source (gems and metals) is threatened. If attacked, they are formidable opponents, using their three-armed multiattack to tear into foes. They can glide through earth and stone, making them difficult to corner."
  },
  "statblock": "### Xorn\n\n*Medium elemental, neutral*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 73 (7d8+42)\n\n- **Speed** 20 ft., burrow 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 10 (+0) | 22 (+6) | 11 (+0) | 10 (+0) | 11 (+0) |\n\n___\n\n- **Saving Throws** Str +6, Con +9\n- **Skills** Perception +6, Stealth +3\n\n- **Senses** darkvision 60 ft., tremorsense 60 ft., passive Perception 16\n\n- **Languages** Terran\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Earth Glide.*** The xorn can burrow through nonmagical, unworked earth and stone. While doing so, the xorn doesn't disturb the material it moves through.\n\n***Stone Camouflage.*** The xorn has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.\n\n***Treasure Sense.*** The xorn can pinpoint, by scent, the location of precious metals and stones, such as coins and gems, within 60 feet of it.\n\n### Actions\n***Multiattack.*** The xorn makes three claw attacks and one bite attack.\n\n***Claw.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage."
};

export default SRD_MONSTER_XORN;
