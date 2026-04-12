import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ANCIENT_BLACK_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-ancient-black-dragon-chromatic",
  "name": "Ancient Black Dragon (Chromatic)",
  "description": "The most ancient of black dragons are truly terrifying, their malevolence so potent it warps the swamp around their lairs into a foul, bubbling morass. Their scales are dull, pitted obsidian, and their faces are skeletal visages of pure hatred.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan dragon",
      "size": "Gargantuan",
      "alignment": "chaotic evil",
      "armorClass": "22 (natural armor)",
      "hitPoints": "367 (21d20+147)",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 26",
      "languages": "Common, Draconic",
      "challengeRating": "21 (33,000 XP)",
      "keyAbilities": "STR +8, DEX +2, CON +7, INT +3, WIS +2, CHA +4",
      "role": "Artillery"
    },
    "savingThrows": {
      "dex": 9,
      "con": 14,
      "wis": 9,
      "cha": 11
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.\n\n**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +15 to hit, reach 15 ft., one target. *Hit:* 19 (2d10+8) piercing damage plus 9 (2d8) acid damage.\n\n**Claw.** *Melee Weapon Attack:* +15 to hit, reach 10 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +15 to hit, reach 20 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Acid Breath (Recharge 5-6).** The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "An ancient black dragon is a master of its swampy territory. It ambushes prey from deep pools of acid or murky water, using its breath weapon to dissolve armor and flesh before engaging. It is exceptionally cruel and will use its Legendary Actions to disrupt spellcasters and reposition itself."
  },
  "statblock": "### Ancient Black Dragon (Chromatic)\n\n*Gargantuan dragon, chaotic evil*\n\n___\n\n- **Armor Class** 22 (natural armor)\n\n- **Hit Points** 367 (21d20+147)\n\n- **Speed** 40 ft., fly 80 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 27 (+8) | 14 (+2) | 25 (+7) | 16 (+3) | 15 (+2) | 19 (+4) |\n\n___\n\n- **Saving Throws** Dex +9, Con +14, Wis +9, Cha +11\n- **Skills** Perception +16, Stealth +9\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 26\n\n- **Languages** Common, Draconic\n\n- **Challenge** 21 (33,000 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +15 to hit, reach 15 ft., one target. *Hit:* 19 (2d10+8) piercing damage plus 9 (2d8) acid damage.\n\n***Claw.*** *Melee Weapon Attack:* +15 to hit, reach 10 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +15 to hit, reach 20 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Acid Breath (Recharge 5-6).*** The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ANCIENT_BLACK_DRAGON_CHROMATIC;