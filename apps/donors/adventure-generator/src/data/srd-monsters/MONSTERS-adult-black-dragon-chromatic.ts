
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ADULT_BLACK_DRAGON_CHROMATIC: SavedMonster = {
    "id": "srd-adult-black-dragon-chromatic",
    "name": "Adult Black Dragon (Chromatic)",
    "description": "Black dragons are the most evil-tempered and vile of the chromatic dragons. They make their lairs in fetid swamps and crumbling ruins, and are notable for their horned heads and skeletal appearance.",
    "profile": {
      "table": {
        "creatureType": "Huge dragon",
        "size": "Huge",
        "alignment": "chaotic evil",
        "armorClass": "19 (natural armor)",
        "hitPoints": "195 (17d12+85)",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
        "languages": "Common, Draconic",
        "challengeRating": "14 (11,500 XP)",
        "keyAbilities": "STR +6, DEX +2, CON +5, INT +2, WIS +1, CHA +3",
        "role": "Artillery"
      },
      "savingThrows": {
        "dex": 7,
        "con": 10,
        "wis": 6,
        "cha": 8
      },
      "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.\n\n**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
      "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage plus 4 (1d8) acid damage.\n\n**Claw.** *Melee Weapon Attack:* +11 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +11 to hit, reach 15 ft., one target. *Hit:* 15 (2d8+6) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Acid Breath (Recharge 5-6).** The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one.",
      "roleplayingAndTactics": "A black dragon prefers to ambush its targets, using its swampy lair to its advantage. It will use its acid breath from a distance or from the water before closing for melee. It is cruel and will torment its prey."
    },
    "statblock": "### Adult Black Dragon (Chromatic)\n\n*Huge dragon, chaotic evil*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 195 (17d12+85)\n\n- **Speed** 40 ft., fly 80 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 14 (+2) | 21 (+5) | 14 (+2) | 13 (+1) | 17 (+3) |\n\n___\n\n- **Saving Throws** Dex +7, Con +10, Wis +6, Cha +8\n- **Skills** Perception +11, Stealth +7\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 21\n\n- **Languages** Common, Draconic\n\n- **Challenge** 14 (11,500 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage plus 4 (1d8) acid damage.\n\n***Claw.*** *Melee Weapon Attack:* +11 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +11 to hit, reach 15 ft., one target. *Hit:* 15 (2d8+6) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Acid Breath (Recharge 5-6).*** The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one."
  };
export default SRD_MONSTER_ADULT_BLACK_DRAGON_CHROMATIC;
