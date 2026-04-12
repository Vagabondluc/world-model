import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ANCIENT_WHITE_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-ancient-white-dragon-chromatic",
  "name": "Ancient White Dragon (Chromatic)",
  "description": "An ancient white dragon is a primal engine of destruction, a living blizzard of claws and ice. They are spiteful, cruel, and solitary, viewing all other creatures as either food or annoyances to be frozen solid.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan dragon",
      "size": "Gargantuan",
      "alignment": "chaotic evil",
      "armorClass": "20 (natural armor)",
      "hitPoints": "333 (18d20+144)",
      "speed": "40 ft., burrow 40 ft., fly 80 ft., swim 40 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 23",
      "languages": "Common, Draconic",
      "challengeRating": "20 (25,000 XP)",
      "keyAbilities": "STR +8, DEX +0, CON +8, INT +0, WIS +1, CHA +2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Ice Walk.** The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra moment.\n\n**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +14 to hit, reach 15 ft., one target. *Hit:* 19 (2d10+8) piercing damage plus 9 (2d8) cold damage.\n\n**Claw.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +14 to hit, reach 20 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Cold Breath (Recharge 5-6).** The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 72 (16d8) cold damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "This dragon is a savage, straightforward fighter. It uses its Ice Walk and burrow speed to ambush foes from beneath the snow, starting combat with its Cold Breath. It is not subtle and will relentlessly attack the nearest target with its bites and claws. Its intelligence is purely instinctual and predatory."
  },
  "statblock": "### Ancient White Dragon (Chromatic)\n\n*Gargantuan dragon, chaotic evil*\n\n___\n\n- **Armor Class** 20 (natural armor)\n\n- **Hit Points** 333 (18d20+144)\n\n- **Speed** 40 ft., burrow 40 ft., fly 80 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 26 (+8) | 10 (+0) | 26 (+8) | 10 (+0) | 13 (+1) | 14 (+2) |\n\n___\n\n- **Skills** Perception +13, Stealth +6\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 23\n\n- **Languages** Common, Draconic\n\n- **Challenge** 20 (25,000 XP)\n\n___\n\n***Ice Walk.*** The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra moment.\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +14 to hit, reach 15 ft., one target. *Hit:* 19 (2d10+8) piercing damage plus 9 (2d8) cold damage.\n\n***Claw.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +14 to hit, reach 20 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Cold Breath (Recharge 5-6).*** The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 72 (16d8) cold damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ANCIENT_WHITE_DRAGON_CHROMATIC;