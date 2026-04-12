
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ADULT_GREEN_DRAGON_CHROMATIC: SavedMonster = {
    "id": "srd-adult-green-dragon-chromatic",
    "name": "Adult Green Dragon (Chromatic)",
    "description": "Master manipulators and liars, green dragons make their homes in ancient forests. Their scales have an emerald sheen, and they often smell of chlorine and fresh pine.",
    "profile": {
      "table": {
        "creatureType": "Huge dragon",
        "size": "Huge",
        "alignment": "lawful evil",
        "armorClass": "19 (natural armor)",
        "hitPoints": "207 (18d12+90)",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 22",
        "languages": "Common, Draconic",
        "challengeRating": "15 (13,000 XP)",
        "keyAbilities": "STR +6, DEX +1, CON +5, INT +4, WIS +2, CHA +3",
        "role": "Controller"
      },
      "savingThrows": {
        "dex": 6,
        "con": 10,
        "wis": 7,
        "cha": 8
      },
      "abilitiesAndTraits": "**Amphibious.** The dragon can breathe air and water.\n\n**Legendary Resistance (3/Day).** If the dragon fails a saving throw, it can choose to succeed instead.",
      "actions": "**Multiattack.** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage plus 7 (2d6) poison damage.\n\n**Claw.** *Melee Weapon Attack:* +11 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +11 to hit, reach 15 ft., one target. *Hit:* 15 (2d8+6) bludgeoning damage.\n\n**Frightful Presence.** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n**Poison Breath (Recharge 5-6).** The dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 56 (16d6) poison damage on a failed save, or half as much damage on a successful one.",
      "roleplayingAndTactics": "A green dragon is a cunning adversary that prefers to fight on its own terms, using the forest to its advantage. It will use its Poison Breath to weaken groups before engaging in melee, often focusing on a single target. It is highly intelligent and will attempt to trick or bargain with creatures it deems useful."
    },
    "statblock": "### Adult Green Dragon (Chromatic)\n\n*Huge dragon, lawful evil*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 207 (18d12+90)\n\n- **Speed** 40 ft., fly 80 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 12 (+1) | 21 (+5) | 18 (+4) | 15 (+2) | 17 (+3) |\n\n___\n\n- **Saving Throws** Dex +6, Con +10, Wis +7, Cha +8\n- **Skills** Deception +8, Insight +7, Perception +12, Persuasion +8, Stealth +6\n\n- **Senses** blindsight 60 ft., darkvision 120 ft., passive Perception 22\n\n- **Languages** Common, Draconic\n\n- **Challenge** 15 (13,000 XP)\n\n___\n\n***Amphibious.*** The dragon can breathe air and water.\n\n***Legendary Resistance (3/Day).*** If the dragon fails a saving throw, it can choose to succeed instead.\n\n### Actions\n***Multiattack.*** The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 17 (2d10+6) piercing damage plus 7 (2d6) poison damage.\n\n***Claw.*** *Melee Weapon Attack:* +11 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +11 to hit, reach 15 ft., one target. *Hit:* 15 (2d8+6) bludgeoning damage.\n\n***Frightful Presence.*** Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.\n\n***Poison Breath (Recharge 5-6).*** The dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 56 (16d6) poison damage on a failed save, or half as much damage on a successful one."
  };
export default SRD_MONSTER_ADULT_GREEN_DRAGON_CHROMATIC;
