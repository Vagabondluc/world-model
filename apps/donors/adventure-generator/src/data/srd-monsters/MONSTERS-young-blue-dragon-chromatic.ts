
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_YOUNG_BLUE_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-young-blue-dragon-chromatic",
  "name": "Young Blue Dragon (Chromatic)",
  "description": "Vain and territorial, a young blue dragon is a lord of the desert skies. It carves out a lair in high, rocky mesas and demands tribute from any who pass through its domain.",
  "profile": {
    "table": {
      "creatureType": "Large dragon",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "152 (16d10+64)",
      "speed": "40 ft., burrow 20 ft., fly 80 ft.",
      "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 19",
      "languages": "Common, Draconic",
      "challengeRating": "9 (5,000 XP)",
      "keyAbilities": "STR +5, DEX +0, CON +4, INT +2, WIS +1, CHA +3",
      "role": ""
    },
    "savingThrows": {
      "dex": 4,
      "con": 8,
      "wis": 5,
      "cha": 7
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The dragon makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 16 (2d10+5) piercing damage plus 5 (1d10) lightning damage.\n\n**Claw.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 12 (2d6+5) slashing damage.",
    "roleplayingAndTactics": "A young blue dragon is an arrogant and tactical fighter. It prefers to fight from the air, strafing its opponents with lightning breath. It will use its burrow speed to create ambushes in the sand. It is intelligent and will retreat if a battle turns against it."
  },
  "statblock": "### Young Blue Dragon (Chromatic)\n\n*Large dragon, lawful evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 152 (16d10+64)\n\n- **Speed** 40 ft., burrow 20 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 21 (+5) | 10 (+0) | 19 (+4) | 14 (+2) | 13 (+1) | 17 (+3) |\n\n___\n\n- **Saving Throws** Dex +4, Con +8, Wis +5, Cha +7\n- **Skills** Perception +9, Stealth +4\n\n- **Senses** blindsight 30 ft., darkvision 120 ft., passive Perception 19\n\n- **Languages** Common, Draconic\n\n- **Challenge** 9 (5,000 XP)\n\n___\n\n### Actions\n***Multiattack.*** The dragon makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 16 (2d10+5) piercing damage plus 5 (1d10) lightning damage.\n\n***Claw.*** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 12 (2d6+5) slashing damage."
};

export default SRD_MONSTER_YOUNG_BLUE_DRAGON_CHROMATIC;
