
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ADULT_BLUE_DRAGON_CHROMATIC: SavedMonster = {
    "id": "srd-adult-blue-dragon-chromatic",
    "name": "Adult Blue Dragon (Chromatic)",
    "description": "Vain and territorial, blue dragons make their lairs in barren deserts and badlands, using their lightning breath to carve out crystalline caverns. They are master flyers, using storms for cover.",
    "profile": {
      "table": {
        "creatureType": "Huge dragon",
        "size": "Huge",
        "alignment": "lawful evil",
        "armorClass": "19 (natural armor)",
        "hitPoints": "225 (18d12+108)",
        "speed": "40 ft., burrow 30 ft., fly 80 ft.",
        "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 22",
        "languages": "Common, Draconic",
        "challengeRating": "16 (15,000 XP)",
        "keyAbilities": "STR +7, DEX +0, CON +6, INT +3, WIS +2, CHA +4",
        "role": "Artillery"
      },
      "savingThrows": {
        "dex": 5,
        "con": 11,
        "wis": 7,
        "cha": 9
      },
      "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
      "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +12 to hit, reach 10 ft., one target. *Hit:* 18 (2d10+7) piercing damage plus 5 (1d10) lightning damage.\n\n**Claw.** *Melee Weapon Attack:* +12 to hit, reach 5 ft., one target. *Hit:* 14 (2d6+7) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +12 to hit, reach 15 ft., one target. *Hit:* 16 (2d8+7) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Lightning Breath (Recharge 5-6).** The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one.",
      "roleplayingAndTactics": "A blue dragon is a patient hunter. It uses its burrow speed to create sinkholes and ambush prey. In the air, it stays aloft, strafing with lightning breath. It is arrogant and may try to taunt foes, seeing combat as a game it is destined to win."
    },
    "statblock": "### Adult Blue Dragon (Chromatic)\n\n*Huge dragon, lawful evil*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 225 (18d12+108)\n\n- **Speed** 40 ft., burrow 30 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 25 (+7) | 10 (+0) | 23 (+6) | 16 (+3) | 15 (+2) | 19 (+4) |\n\n___\n\n- **Saving Throws** Dex +5, Con +11, Wis +7, Cha +9\n- **Skills** Perception +12, Stealth +5\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 22\n\n- **Languages** Common, Draconic\n\n- **Challenge** 16 (15,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +12 to hit, reach 10 ft., one target. *Hit:* 18 (2d10+7) piercing damage plus 5 (1d10) lightning damage.\n\n***Claw.*** *Melee Weapon Attack:* +12 to hit, reach 5 ft., one target. *Hit:* 14 (2d6+7) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +12 to hit, reach 15 ft., one target. *Hit:* 16 (2d8+7) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Lightning Breath (Recharge 5-6).*** The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one."
  };
export default SRD_MONSTER_ADULT_BLUE_DRAGON_CHROMATIC;
