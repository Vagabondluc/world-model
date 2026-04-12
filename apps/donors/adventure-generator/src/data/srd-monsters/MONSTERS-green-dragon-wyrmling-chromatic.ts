import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GREEN_DRAGON_WYRMLING_CHROMATIC: SavedMonster = {
  "id": "srd-green-dragon-wyrmling-chromatic",
  "name": "Green Dragon Wyrmling (Chromatic)",
  "description": "Cunning and treacherous even from birth, a young green dragon delights in deception and manipulation. It makes its home in deep forests, viewing all other creatures as pawns or food.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "38 (7d8+7)",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +1, INT +2, WIS +0, CHA +1",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 3,
      "con": 3,
      "wis": 2,
      "cha": 3
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage plus 3 (1d6) poison damage.\n\n**Poison Breath (Recharge 5-6).** The dragon exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 11 Constitution saving throw, taking 21 (6d6) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A green dragon wyrmling is a cowardly bully. It prefers to fight from a distance, using its poison breath and then flying away. It might try to trick or bargain with creatures, but its promises are always false."
  },
  "statblock": "### Green Dragon Wyrmling (Chromatic)\n\n*Medium dragon, lawful evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 38 (7d8+7)\n\n- **Speed** 30 ft., fly 60 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 12 (+1) | 13 (+1) | 14 (+2) | 11 (+0) | 13 (+1) |\n\n___\n\n- **Saving Throws** Dex +3, Con +3, Wis +2, Cha +3\n- **Skills** Perception +4, Stealth +3\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage plus 3 (1d6) poison damage.\n\n***Poison Breath (Recharge 5-6).*** The dragon exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 11 Constitution saving throw, taking 21 (6d6) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_GREEN_DRAGON_WYRMLING_CHROMATIC;