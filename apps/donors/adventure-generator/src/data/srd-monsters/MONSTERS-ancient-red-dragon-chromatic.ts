
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ANCIENT_RED_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-ancient-red-dragon-chromatic",
  "name": "Ancient Red Dragon (Chromatic)",
  "description": "The embodiment of draconic power and arrogance, an ancient red dragon is a terrifying engine of destruction. Its mountain hoard is the stuff of legend, and its fiery rage can level kingdoms.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan dragon",
      "size": "Gargantuan",
      "alignment": "chaotic evil",
      "armorClass": "22 (natural armor)",
      "hitPoints": "546 (28d20+252)",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 26",
      "languages": "Common, Draconic",
      "challengeRating": "24 (62,000 XP)",
      "keyAbilities": "STR +10, DEX +0, CON +9, INT +4, WIS +2, CHA +6",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +17 to hit, reach 15 ft., one target. *Hit:* 21 (2d10+10) piercing damage plus 14 (4d6) fire damage.\n\n**Claw.** *Melee Weapon Attack:* +17 to hit, reach 10 ft., one target. *Hit:* 17 (2d6+10) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +17 to hit, reach 20 ft., one target. *Hit:* 19 (2d8+10) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the dragon is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Fire Breath (Recharge 5-6).** The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "This dragon believes itself to be the pinnacle of existence. It begins combat with its breath weapon, aiming for maximum devastation. It is incredibly strong and will use its physical attacks to crush any who survive the initial blast. It uses Legendary Actions to make additional attacks and to move into tactically superior positions."
  },
  "statblock": "### Ancient Red Dragon (Chromatic)\n\n*Gargantuan dragon, chaotic evil*\n\n___\n\n- **Armor Class** 22 (natural armor)\n\n- **Hit Points** 546 (28d20+252)\n\n- **Speed** 40 ft., climb 40 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 30 (+10) | 10 (+0) | 29 (+9) | 18 (+4) | 15 (+2) | 23 (+6) |\n\n___\n\n- **Skills** Perception +16, Stealth +7\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 26\n\n- **Languages** Common, Draconic\n\n- **Challenge** 24 (62,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +17 to hit, reach 15 ft., one target. *Hit:* 21 (2d10+10) piercing damage plus 14 (4d6) fire damage.\n\n***Claw.*** *Melee Weapon Attack:* +17 to hit, reach 10 ft., one target. *Hit:* 17 (2d6+10) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +17 to hit, reach 20 ft., one target. *Hit:* 19 (2d8+10) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of it and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the dragon is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Fire Breath (Recharge 5-6).*** The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ANCIENT_RED_DRAGON_CHROMATIC;
