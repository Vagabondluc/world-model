import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ADULT_SILVER_DRAGON_METALLIC: SavedMonster = {
  "id": "srd-adult-silver-dragon-metallic",
  "name": "Adult Silver Dragon (Metallic)",
  "description": "Silver dragons are the friendliest and most helpful of the metallic dragons, often taking the form of kind old humanoids to live among them. They make their lairs in high, cloud-wrapped mountain peaks.",
  "profile": {
    "table": {
      "creatureType": "Huge dragon",
      "size": "Huge",
      "alignment": "lawful good",
      "armorClass": "19 (natural armor)",
      "hitPoints": "243 (18d12+126)",
      "speed": "40 ft., fly 80 ft.",
      "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
      "languages": "Common, Draconic",
      "challengeRating": "16 (15,000 XP)",
      "keyAbilities": "STR +8, DEX +0, CON +7, INT +3, WIS +1, CHA +5",
      "role": "Leader"
    },
    "savingThrows": {
      "dex": 5,
      "con": 12,
      "wis": 6,
      "cha": 10
    },
    "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
    "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +13 to hit, reach 10 ft., one target. *Hit:* 19 (2d10+8) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +13 to hit, reach 5 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +13 to hit, reach 15 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Breath Weapons (Recharge 5-6).** The dragon uses one of the following breath weapons.\n\n**Change Shape.** The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).",
    "roleplayingAndTactics": "A silver dragon will avoid combat unless absolutely necessary, preferring to use its wisdom and persuasive abilities. When it must fight, it uses its Paralyzing Breath to neutralize the most dangerous threats and its Cold Breath on groups. It is a powerful melee fighter but will always prioritize protecting innocent lives."
  },
  "statblock": "### Adult Silver Dragon (Metallic)\n\n*Huge dragon, lawful good*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 243 (18d12+126)\n\n- **Speed** 40 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 27 (+8) | 10 (+0) | 25 (+7) | 16 (+3) | 13 (+1) | 21 (+5) |\n\n___\n\n- **Saving Throws** Dex +5, Con +12, Wis +6, Cha +10\n- **Skills** Arcana +8, History +8, Perception +11, Stealth +5\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 21\n\n- **Languages** Common, Draconic\n\n- **Challenge** 16 (15,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +13 to hit, reach 10 ft., one target. *Hit:* 19 (2d10+8) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +13 to hit, reach 5 ft., one target. *Hit:* 15 (2d6+8) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +13 to hit, reach 15 ft., one target. *Hit:* 17 (2d8+8) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Breath Weapons (Recharge 5-6).*** The dragon uses one of the following breath weapons.\n\n***Change Shape.*** The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice)."
};

export default SRD_MONSTER_ADULT_SILVER_DRAGON_METALLIC;