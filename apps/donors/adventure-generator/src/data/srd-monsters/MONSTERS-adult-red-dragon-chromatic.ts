
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ADULT_RED_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-adult-red-dragon-chromatic",
  "name": "Adult Red Dragon (Chromatic)",
  "description": "The archetypal evil dragon, red dragons are arrogant, greedy, and obsessed with their treasure hoards. They prefer to live in warm mountains and volcanoes, their scales the color of molten rock and flame.",
  "profile": {
    "table": {
      "creatureType": "Huge dragon",
      "size": "Huge",
      "alignment": "chaotic evil",
      "armorClass": "19 (natural armor)",
      "hitPoints": "256 (19d12+133)",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 23",
      "languages": "Common, Draconic",
      "challengeRating": "17 (18,000 XP)",
      "keyAbilities": "STR +8, DEX +0, CON +7, INT +3, WIS +1, CHA +5",
      "role": "Brute"
    },
    "savingThrows": {
      "dex": 6,
      "con": 13,
      "wis": 7,
      "cha": 11
    },
    "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 19 (2d10+8) piercing damage plus 7 (2d6) fire damage.\n\n**Claw.** *Melee Weapon Attack:* +14 to hit, reach 5 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +14 to hit, reach 15 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Fire Breath (Recharge 5-6).** The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A red dragon is supremely confident in its abilities. It opens combat with its fire breath, seeking to incinerate as many foes as possible. It is a terrifying melee combatant and enjoys demonstrating its physical power. It will fight to the death to protect its hoard."
  },
  "statblock": "### Adult Red Dragon (Chromatic)\n\n*Huge dragon, chaotic evil*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 256 (19d12+133)\n\n- **Speed** 40 ft., climb 40 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 27 (+8) | 10 (+0) | 25 (+7) | 16 (+3) | 13 (+1) | 21 (+5) |\n\n___\n\n- **Saving Throws** Dex +6, Con +13, Wis +7, Cha +11\n- **Skills** Perception +13, Stealth +6\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 23\n\n- **Languages** Common, Draconic\n\n- **Challenge** 17 (18,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 19 (2d10+8) piercing damage plus 7 (2d6) fire damage.\n\n***Claw.*** *Melee Weapon Attack:* +14 to hit, reach 5 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +14 to hit, reach 15 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Fire Breath (Recharge 5-6).*** The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ADULT_RED_DRAGON_CHROMATIC;
