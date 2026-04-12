
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WHITE_DRAGON_WYRMLING_CHROMATIC: SavedMonster = {
  "id": "srd-white-dragon-wyrmling-chromatic",
  "name": "White Dragon Wyrmling (Chromatic)",
  "description": "The smallest and most bestial of the chromatic dragons, a white dragon wyrmling is a savage, primal hunter. Its scales are the color of snow and ice.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "16 (natural armor)",
      "hitPoints": "32 (5d8+10)",
      "speed": "30 ft., burrow 15 ft., fly 60 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +2, INT -2, WIS +0, CHA +1",
      "role": "Ambusher"
    },
    "savingThrows": {
      "dex": 2,
      "con": 4,
      "wis": 2,
      "cha": 3
    },
    "abilitiesAndTraits": "**Ice Walk.** The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage plus 2 (1d4) cold damage.\n\n**Cold Breath (Recharge 5-6).** The dragon exhales an icy blast in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A white dragon wyrmling is a simple ambush predator. It will burrow under the snow and burst out to attack with its cold breath. It is not particularly intelligent, driven by pure instinct and hunger."
  },
  "statblock": "### White Dragon Wyrmling (Chromatic)\n\n*Medium dragon, chaotic evil*\n\n___\n\n- **Armor Class** 16 (natural armor)\n\n- **Hit Points** 32 (5d8+10)\n\n- **Speed** 30 ft., burrow 15 ft., fly 60 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 10 (+0) | 14 (+2) | 6 (-2) | 11 (+0) | 12 (+1) |\n\n___\n\n- **Saving Throws** Dex +2, Con +4, Wis +2, Cha +3\n- **Skills** Perception +4, Stealth +2\n\n- **Damage Immunities** cold\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Ice Walk.*** The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra moment.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage plus 2 (1d4) cold damage.\n\n***Cold Breath (Recharge 5-6).*** The dragon exhales an icy blast in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_WHITE_DRAGON_WYRMLING_CHROMATIC;
