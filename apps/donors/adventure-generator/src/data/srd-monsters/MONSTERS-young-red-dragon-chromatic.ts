
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_YOUNG_RED_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-young-red-dragon-chromatic",
  "name": "Young Red Dragon (Chromatic)",
  "description": "Arrogant, greedy, and powerful, a young red dragon is the epitome of draconic might and fury. It seeks to establish its own hoard, often by destroying any who stand in its way.",
  "profile": {
    "table": {
      "creatureType": "Large dragon",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "178 (17d10+85)",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 18",
      "languages": "Common, Draconic",
      "challengeRating": "10 (5,900 XP)",
      "keyAbilities": "STR +6, DEX +0, CON +5, INT +2, WIS +0, CHA +4",
      "role": ""
    },
    "savingThrows": {
      "dex": 4,
      "con": 9,
      "wis": 4,
      "cha": 8
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The dragon makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage plus 3 (1d6) fire damage.\n\n**Claw.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.",
    "roleplayingAndTactics": "A young red dragon is a supremely confident and aggressive combatant. It will open a fight with its fire breath, then revel in melee, using its bite and claws to savage its foes. It is arrogant and may underestimate smaller opponents."
  },
  "statblock": "### Young Red Dragon (Chromatic)\n\n*Large dragon, chaotic evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 178 (17d10+85)\n\n- **Speed** 40 ft., climb 40 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 10 (+0) | 21 (+5) | 14 (+2) | 11 (+0) | 19 (+4) |\n\n___\n\n- **Saving Throws** Dex +4, Con +9, Wis +4, Cha +8\n- **Skills** Perception +8, Stealth +4\n\n- **Senses** blindsight 30 ft., darkvision 120 ft., passive Perception 18\n\n- **Languages** Common, Draconic\n\n- **Challenge** 10 (5,900 XP)\n\n___\n\n### Actions\n***Multiattack.*** The dragon makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage plus 3 (1d6) fire damage.\n\n***Claw.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage."
};

export default SRD_MONSTER_YOUNG_RED_DRAGON_CHROMATIC;
