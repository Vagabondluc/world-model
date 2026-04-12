
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ADULT_BRASS_DRAGON_METALLIC: SavedMonster = {
    "id": "srd-adult-brass-dragon-metallic",
    "name": "Adult Brass Dragon (Metallic)",
    "description": "Brass dragons are the most gregarious of the metallic dragons, known for their love of conversation. They lair in warm, dry climates, and their scales shine like polished brass.",
    "profile": {
      "table": {
        "creatureType": "Huge dragon",
        "size": "Huge",
        "alignment": "chaotic good",
        "armorClass": "18 (natural armor)",
        "hitPoints": "172 (15d12+75)",
        "speed": "40 ft., burrow 30 ft., fly 80 ft.",
        "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
        "languages": "Common, Draconic",
        "challengeRating": "13 (10,000 XP)",
        "keyAbilities": "STR +6, DEX +0, CON +5, INT +2, WIS +1, CHA +3",
        "role": "Controller"
      },
      "savingThrows": {
        "dex": 5,
        "con": 10,
        "wis": 6,
        "cha": 8
      },
      "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
      "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +11 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +11 to hit, reach 15 ft., one target. *Hit:* 15 (2d8+6) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Breath Weapons (Recharge 5-6).** The dragon uses one of the following breath weapons.",
      "roleplayingAndTactics": "A brass dragon avoids combat if possible, preferring to talk. If forced to fight, it uses its Sleep Breath to incapacitate foes non-lethally. It might use its burrow speed to move around the battlefield and will only fight to kill if its life or hoard is truly threatened."
    },
    "statblock": "### Adult Brass Dragon (Metallic)\n\n*Huge dragon, chaotic good*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 172 (15d12+75)\n\n- **Speed** 40 ft., burrow 30 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 10 (+0) | 21 (+5) | 14 (+2) | 13 (+1) | 17 (+3) |\n\n___\n\n- **Saving Throws** Dex +5, Con +10, Wis +6, Cha +8\n- **Skills** History +7, Perception +11, Persuasion +8, Stealth +5\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 21\n\n- **Languages** Common, Draconic\n\n- **Challenge** 13 (10,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +11 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +11 to hit, reach 15 ft., one target. *Hit:* 15 (2d8+6) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Breath Weapons (Recharge 5-6).*** The dragon uses one of the following breath weapons."
  };
export default SRD_MONSTER_ADULT_BRASS_DRAGON_METALLIC;
