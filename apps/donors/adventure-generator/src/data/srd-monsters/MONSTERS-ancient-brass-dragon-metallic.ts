import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ANCIENT_BRASS_DRAGON_METALLIC: SavedMonster = {
  "id": "srd-ancient-brass-dragon-metallic",
  "name": "Ancient Brass Dragon (Metallic)",
  "description": "Ancient brass dragons are among the most talkative creatures in the world, with a wit as sharp as their claws. They love the heat of the desert and bury themselves in the sand, leaving only their heads exposed to chat with passersby.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan dragon",
      "size": "Gargantuan",
      "alignment": "chaotic good",
      "armorClass": "20 (natural armor)",
      "hitPoints": "297 (17d20+119)",
      "speed": "40 ft., burrow 40 ft., fly 80 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 24",
      "languages": "Common, Draconic",
      "challengeRating": "20 (25,000 XP)",
      "keyAbilities": "STR +8, DEX +0, CON +7, INT +3, WIS +2, CHA +4",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 6,
      "con": 13,
      "wis": 8,
      "cha": 10
    },
    "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +14 to hit, reach 15 ft., one target. *Hit:* 19 (2d10+8) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +14 to hit, reach 20 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Breath Weapons (Recharge 5-6).** The dragon uses one of the following breath weapons:\n\n**Change Shape.** The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).",
    "roleplayingAndTactics": "This dragon will try to talk its way out of a fight, but if provoked, it uses its Sleep Breath to neutralize threats without killing them. It will use its Fire Breath on creatures that resist sleep or seem irredeemably evil. Its burrow speed allows it to strategically reposition in desert terrain."
  },
  "statblock": "### Ancient Brass Dragon (Metallic)\n\n*Gargantuan dragon, chaotic good*\n\n___\n\n- **Armor Class** 20 (natural armor)\n\n- **Hit Points** 297 (17d20+119)\n\n- **Speed** 40 ft., burrow 40 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 27 (+8) | 10 (+0) | 25 (+7) | 16 (+3) | 15 (+2) | 19 (+4) |\n\n___\n\n- **Saving Throws** Dex +6, Con +13, Wis +8, Cha +10\n- **Skills** History +9, Perception +14, Persuasion +10, Stealth +6\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 24\n\n- **Languages** Common, Draconic\n\n- **Challenge** 20 (25,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +14 to hit, reach 15 ft., one target. *Hit:* 19 (2d10+8) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +14 to hit, reach 10 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +14 to hit, reach 20 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Breath Weapons (Recharge 5-6).*** The dragon uses one of the following breath weapons:\n\n***Change Shape.*** The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice)."
};

export default SRD_MONSTER_ANCIENT_BRASS_DRAGON_METALLIC;