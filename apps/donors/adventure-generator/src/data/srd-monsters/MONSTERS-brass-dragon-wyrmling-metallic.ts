import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BRASS_DRAGON_WYRMLING_METALLIC: SavedMonster = {
  "id": "srd-brass-dragon-wyrmling-metallic",
  "name": "Brass Dragon Wyrmling (Metallic)",
  "description": "Even at a young age, brass dragons are talkative and inquisitive. They enjoy basking in the sun and collecting shiny, interesting objects.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "chaotic good",
      "armorClass": "16 (natural armor)",
      "hitPoints": "16 (3d8+3)",
      "speed": "30 ft., burrow 15 ft., fly 60 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +1, INT +0, WIS +0, CHA +1",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 2,
      "con": 3,
      "wis": 2,
      "cha": 3
    },
    "abilitiesAndTraits": "**Immunity to Fire.** Brass dragons are immune to fire damage.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage.\n\n**Breath Weapons (Recharge 5-6).** The dragon uses one of the following breath weapons:\n- **Fire Breath.** The dragon exhales fire in a 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 14 (4d6) fire damage on a failed save, or half as much damage on a successful one.\n- **Sleep Breath.** The dragon exhales sleep gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw or fall unconscious for 1 minute. This effect ends for a creature if it takes damage or someone uses an action to wake it.",
    "roleplayingAndTactics": "A brass wyrmling will try to engage intruders in conversation first. If threatened, it prefers to use its Sleep Breath to incapacitate enemies and then make its escape. It will only use its Fire Breath in self-defense."
  },
  "statblock": "### Brass Dragon Wyrmling (Metallic)\n\n*Medium dragon, chaotic good*\n\n___\n\n- **Armor Class** 16 (natural armor)\n\n- **Hit Points** 16 (3d8+3)\n\n- **Speed** 30 ft., burrow 15 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 10 (+0) | 13 (+1) | 10 (+0) | 11 (+0) | 13 (+1) |\n\n___\n\n- **Saving Throws** Dex +2, Con +3, Wis +2, Cha +3\n- **Skills** Perception +4, Stealth +2\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 1 (200 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage.\n\n***Breath Weapons (Recharge 5-6).*** The dragon uses one of the following breath weapons."
};

export default SRD_MONSTER_BRASS_DRAGON_WYRMLING_METALLIC;