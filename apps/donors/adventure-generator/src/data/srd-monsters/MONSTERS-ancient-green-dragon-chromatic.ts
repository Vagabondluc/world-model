import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ANCIENT_GREEN_DRAGON_CHROMATIC: SavedMonster = {
  "id": "srd-ancient-green-dragon-chromatic",
  "name": "Ancient Green Dragon (Chromatic)",
  "description": "Ancient green dragons are masters of intrigue, politics, and poison, with a cruelty that has sharpened over millennia. Their forest lairs are places of unnatural, silent dread, where every plant seems to watch with malice.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan dragon",
      "size": "Gargantuan",
      "alignment": "lawful evil",
      "armorClass": "21 (natural armor)",
      "hitPoints": "385 (22d20 + 154)",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 27",
      "languages": "Common, Draconic",
      "challengeRating": "22 (41,000 XP)",
      "keyAbilities": "STR +8, DEX +1, CON +7, INT +5, WIS +3, CHA +4",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 8,
      "con": 14,
      "wis": 10,
      "cha": 11
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.\n\n**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +15 to hit, reach 15 ft., one target. *Hit:* 19 (2d10+8) piercing damage plus 10 (3d6) poison damage.\n\n**Claw.** *Melee Weapon Attack:* +15 to hit, reach 10 ft., one target. *Hit:* 22 (4d6+8) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +15 to hit, reach 20 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Poison Breath (Recharge 5-6).** The dragon exhales poisonous gas in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 77 (22d6) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "This dragon is a grand manipulator, preferring to defeat its foes through trickery and minions. In combat, it uses its poison breath to weaken as many enemies as possible. It is highly mobile, using the forest canopy for cover and its swim speed to escape into hidden waterways. It will bargain and lie to save its own life if a battle turns against it."
  },
  "statblock": "### Ancient Green Dragon (Chromatic)\n\n*Gargantuan dragon, lawful evil*\n\n___\n\n- **Armor Class** 21 (natural armor)\n\n- **Hit Points** 385 (22d20 + 154)\n\n- **Speed** 40 ft., fly 80 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 27 (+8) | 12 (+1) | 25 (+7) | 20 (+5) | 17 (+3) | 19 (+4) |\n\n___\n\n- **Saving Throws** Dex +8, Con +14, Wis +10, Cha +11\n- **Skills** Deception +11, Insight +10, Perception +17, Persuasion +11, Stealth +8\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 27\n\n- **Languages** Common, Draconic\n\n- **Challenge** 22 (41,000 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +15 to hit, reach 15 ft., one target. *Hit:* 19 (2d10+8) piercing damage plus 10 (3d6) poison damage.\n\n***Claw.*** *Melee Weapon Attack:* +15 to hit, reach 10 ft., one target. *Hit:* 22 (4d6+8) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +15 to hit, reach 20 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Poison Breath (Recharge 5-6).*** The dragon exhales poisonous gas in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 77 (22d6) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ANCIENT_GREEN_DRAGON_CHROMATIC;