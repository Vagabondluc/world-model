import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ADULT_WHITE_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-adult-white-dragon-chromatic",
  "name": "Adult White Dragon (Chromatic)",
  "description": "The smallest and most bestial of the chromatic dragons, white dragons are vicious, primal hunters who live in frozen lands. Their scales are a stark, chilling white, and they are often covered in frost.",
  "profile": {
    "table": {
      "creatureType": "Huge dragon",
      "size": "Huge",
      "alignment": "chaotic evil",
      "armorClass": "18 (natural armor)",
      "hitPoints": "200 (16d12+96)",
      "speed": "40 ft., burrow 30 ft., fly 80 ft., swim 40 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
      "languages": "Common, Draconic",
      "challengeRating": "13 (10,000 XP)",
      "keyAbilities": "STR +6, DEX +0, CON +6, INT -1, WIS +1, CHA +1",
      "role": "Ambusher"
    },
    "savingThrows": {
      "dex": 5,
      "con": 11,
      "wis": 6,
      "cha": 6
    },
    "abilitiesAndTraits": "**Ice Walk.** The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra moment.\n\n**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage plus 4 (1d8) cold damage.\n\n**Claw.** *Melee Weapon Attack:* +11 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +11 to hit, reach 15 ft., one target. *Hit:* 15 (2d8+6) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 14 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Cold Breath (Recharge 5-6).** The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A white dragon is a savage hunter. It uses its Ice Walk and burrow speed to ambush prey, bursting from the snow or ice to attack. It opens combat with its Cold Breath and then uses its physical attacks. It has a vindictive memory and will hold grudges for any slight."
  },
  "statblock": "### Adult White Dragon (Chromatic)\n\n*Huge dragon, chaotic evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 200 (16d12+96)\n\n- **Speed** 40 ft., burrow 30 ft., fly 80 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 22 (+6) | 10 (+0) | 22 (+6) | 8 (-1) | 12 (+1) | 12 (+1) |\n\n___\n\n- **Saving Throws** Dex +5, Con +11, Wis +6, Cha +6\n- **Skills** Perception +11, Stealth +5\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 21\n\n- **Languages** Common, Draconic\n\n- **Challenge** 13 (10,000 XP)\n\n___\n\n***Ice Walk.*** The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra moment.\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage plus 4 (1d8) cold damage.\n\n***Claw.*** *Melee Weapon Attack:* +11 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +11 to hit, reach 15 ft., one target. *Hit:* 15 (2d8+6) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 14 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Cold Breath (Recharge 5-6).*** The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ADULT_WHITE_DRAGON_CHROMATIC;