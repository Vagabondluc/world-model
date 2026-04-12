
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_YOUNG_BLACK_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-young-black-dragon-chromatic",
  "name": "Young Black Dragon (Chromatic)",
  "description": "A young black dragon is a vile and cruel creature, its heart filled with the evil that will one day make it a terror of the swamps. Its scales are already the color of polished obsidian.",
  "profile": {
    "table": {
      "creatureType": "Large dragon",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "127 (15d10+45)",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 16",
      "languages": "Common, Draconic",
      "challengeRating": "7 (2,900 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +3, INT +1, WIS +0, CHA +2",
      "role": ""
    },
    "savingThrows": {
      "dex": 5,
      "con": 6,
      "wis": 3,
      "cha": 5
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.",
    "actions": "**Multiattack.** The dragon makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one target. *Hit:* 15 (2d10+4) piercing damage plus 4 (1d8) acid damage.\n\n**Claw.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) slashing damage.",
    "roleplayingAndTactics": "A young black dragon is a cunning and spiteful combatant. It will use its amphibious nature to its advantage, ambushing from murky water. It will use its acid breath at the first opportunity and enjoys the suffering of its victims."
  },
  "statblock": "### Young Black Dragon (Chromatic)\n\n*Large dragon, chaotic evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 127 (15d10+45)\n\n- **Speed** 40 ft., fly 80 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 14 (+2) | 17 (+3) | 12 (+1) | 11 (+0) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +5, Con +6, Wis +3, Cha +5\n- **Skills** Perception +6, Stealth +5\n\n- **Senses** blindsight 30 ft., darkvision 120 ft., passive Perception 16\n\n- **Languages** Common, Draconic\n\n- **Challenge** 7 (2,900 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n### Actions\n***Multiattack.*** The dragon makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one target. *Hit:* 15 (2d10+4) piercing damage plus 4 (1d8) acid damage.\n\n***Claw.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) slashing damage."
};

export default SRD_MONSTER_YOUNG_BLACK_DRAGON_CHROMATIC;
