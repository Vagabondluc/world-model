
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_YOUNG_GREEN_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-young-green-dragon-chromatic",
  "name": "Young Green Dragon (Chromatic)",
  "description": "A young green dragon is a master of lies and deception, its heart already twisted with the cunning evil of its kind. It makes its lair in deep forests, viewing all other creatures as pawns in its intricate schemes.",
  "profile": {
    "table": {
      "creatureType": "Large dragon",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "136 (16d10+48)",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
      "languages": "Common, Draconic",
      "challengeRating": "8 (3,900 XP)",
      "keyAbilities": "STR +4, DEX +1, CON +3, INT +3, WIS +1, CHA +2",
      "role": ""
    },
    "savingThrows": {
      "dex": 4,
      "con": 6,
      "wis": 4,
      "cha": 5
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.",
    "actions": "**Multiattack.** The dragon makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one target. *Hit:* 15 (2d10+4) piercing damage plus 7 (2d6) poison damage.\n\n**Claw.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) slashing damage.",
    "roleplayingAndTactics": "A young green dragon is a cunning and treacherous foe. It will try to trick and intimidate its opponents before a fight begins. In combat, it uses its poison breath and its knowledge of the forest terrain to its advantage, striking from the shadows."
  },
  "statblock": "### Young Green Dragon (Chromatic)\n\n*Large dragon, lawful evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 136 (16d10+48)\n\n- **Speed** 40 ft., fly 80 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 12 (+1) | 17 (+3) | 16 (+3) | 13 (+1) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +4, Con +6, Wis +4, Cha +5\n- **Skills** Deception +5, Perception +7, Stealth +4\n\n- **Senses** blindsight 30 ft., darkvision 120 ft., passive Perception 17\n\n- **Languages** Common, Draconic\n\n- **Challenge** 8 (3,900 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n### Actions\n***Multiattack.*** The dragon makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one target. *Hit:* 15 (2d10+4) piercing damage plus 7 (2d6) poison damage.\n\n***Claw.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) slashing damage."
};

export default SRD_MONSTER_YOUNG_GREEN_DRAGON_CHROMATIC;
