import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ANCIENT_BLUE_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-ancient-blue-dragon-chromatic",
  "name": "Ancient Blue Dragon (Chromatic)",
  "description": "Ancient blue dragons are living legends, commanding the desert winds and the lightning from the sky. Their sapphire-like scales hum with static electricity, and they look down upon lesser creatures with utter contempt.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan dragon",
      "size": "Gargantuan",
      "alignment": "lawful evil",
      "armorClass": "22 (natural armor)",
      "hitPoints": "481 (26d20+208)",
      "speed": "40 ft., burrow 40 ft., fly 80 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 27",
      "languages": "Common, Draconic",
      "challengeRating": "23 (50,000 XP)",
      "keyAbilities": "STR +9, DEX +0, CON +8, INT +4, WIS +3, CHA +5",
      "role": "Artillery"
    },
    "savingThrows": {
      "dex": 7,
      "con": 15,
      "wis": 10,
      "cha": 12
    },
    "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +16 to hit, reach 15 ft., one target. *Hit:* 20 (2d10+9) piercing damage plus 11 (2d10) lightning damage.\n\n**Claw.** *Melee Weapon Attack:* +16 to hit, reach 10 ft., one target. *Hit:* 16 (2d6+9) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +16 to hit, reach 20 ft., one target. *Hit:* 18 (2d8+9) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Lightning Breath (Recharge 5-6).** The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "This dragon prefers to attack from the sky, staying out of melee reach and unleashing its devastating lightning breath. It uses its burrow speed to create ambushes, emerging from beneath the sand to surprise its foes. It sees itself as a king and will demand tribute before resorting to violence."
  },
  "statblock": "### Ancient Blue Dragon (Chromatic)\n\n*Gargantuan dragon, lawful evil*\n\n___\n\n- **Armor Class** 22 (natural armor)\n\n- **Hit Points** 481 (26d20+208)\n\n- **Speed** 40 ft., burrow 40 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 29 (+9) | 10 (+0) | 27 (+8) | 18 (+4) | 17 (+3) | 21 (+5) |\n\n___\n\n- **Saving Throws** Dex +7, Con +15, Wis +10, Cha +12\n- **Skills** Perception +17, Stealth +7\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 27\n\n- **Languages** Common, Draconic\n\n- **Challenge** 23 (50,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +16 to hit, reach 15 ft., one target. *Hit:* 20 (2d10+9) piercing damage plus 11 (2d10) lightning damage.\n\n***Claw.*** *Melee Weapon Attack:* +16 to hit, reach 10 ft., one target. *Hit:* 16 (2d6+9) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +16 to hit, reach 20 ft., one target. *Hit:* 18 (2d8+9) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Lightning Breath (Recharge 5-6).*** The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ANCIENT_BLUE_DRAGON_CHROMATIC;