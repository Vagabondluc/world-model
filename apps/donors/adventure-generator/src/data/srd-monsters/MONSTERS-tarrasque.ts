
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_TARRASQUE: SavedMonster = {
  "id": "srd-tarrasque",
  "name": "Tarrasque",
  "description": "The tarrasque is a creature of legend, a gargantuan monstrosity of pure destruction. It is a walking apocalypse, capable of leveling entire cities in its mindless rage.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan monstrosity (titan)",
      "size": "Gargantuan",
      "alignment": "unaligned",
      "armorClass": "25 (natural armor)",
      "hitPoints": "676 (33d20+330)",
      "speed": "40 ft.",
      "senses": "blindsight 120 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "30 (155,000 XP)",
      "keyAbilities": "STR +10, DEX +0, CON +10, INT -4, WIS +0, CHA +0",
      "role": "Solo"
    },
    "savingThrows": {
      "str": 17,
      "dex": 7,
      "con": 17,
      "int": 5,
      "wis": 11,
      "cha": 9
    },
    "abilitiesAndTraits": "**Legendary Resistance (3/Day).** If the tarrasque fails a saving throw, it can choose to succeed instead.\n\n**Magic Resistance.** The tarrasque has advantage on saving throws against spells and other magical effects.\n\n**Reflective Carapace.** Any time the tarrasque is targeted by a *magic missile* spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the tarrasque, turning the caster into the target.\n\n**Siege Monster.** The tarrasque deals double damage to objects and structures.",
    "actions": "**Multiattack.** The tarrasque can use its Frightful Presence. It then makes five attacks: one with its bite, two with its claws, one with its horns, and one with its tail. It can use its Swallow instead of its bite.\n\n**Bite.** *Melee Weapon Attack:* +19 to hit, reach 10 ft., one target. *Hit:* 36 (4d12+10) piercing damage. If the target is a creature, it is grappled (escape DC 20). Until this grapple ends, the target is restrained, and the tarrasque can't bite another target.\n\n**Claw.** *Melee Weapon Attack:* +19 to hit, reach 15 ft., one target. *Hit:* 28 (4d8+10) slashing damage.\n\n**Horns.** *Melee Weapon Attack:* +19 to hit, reach 10 ft., one target. *Hit:* 32 (4d10+10) piercing damage.\n\n**Tail.** *Melee Weapon Attack:* +19 to hit, reach 20 ft., one target. *Hit:* 24 (4d6+10) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be knocked prone.\n\n**Frightful Presence.** Each creature of the tarrasque's choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the tarrasque is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the tarrasque's Frightful Presence for the next 24 hours.\n\n**Swallow.** The tarrasque makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the bite's damage, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) acid damage at the start of each of the tarrasque's turns.",
    "roleplayingAndTactics": "There is no tactic against the tarrasque other than survival. It is an engine of pure destruction, attacking anything in its path with its bite, claws, horns, and tail. Its reflective carapace makes it a nightmare for spellcasters."
  },
  "statblock": "### Tarrasque\n\n*Gargantuan monstrosity (titan), unaligned*\n\n___\n\n- **Armor Class** 25 (natural armor)\n\n- **Hit Points** 676 (33d20+330)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 30 (+10) | 11 (+0) | 30 (+10) | 3 (-4) | 11 (+0) | 11 (+0) |\n\n___\n\n- **Saving Throws** Str +17, Dex +7, Con +17, Int +5, Wis +11, Cha +9\n- **Senses** blindsight 120 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 30 (155,000 XP)\n\n___\n\n***Legendary Resistance (3/Day).*** If the tarrasque fails a saving throw, it can choose to succeed instead.\n\n***Magic Resistance.*** The tarrasque has advantage on saving throws against spells and other magical effects.\n\n***Reflective Carapace.*** Any time the tarrasque is targeted by a *magic missile* spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the tarrasque, turning the caster into the target.\n\n***Siege Monster.*** The tarrasque deals double damage to objects and structures.\n\n### Actions\n***Multiattack.*** The tarrasque can use its Frightful Presence. It then makes five attacks: one with its bite, two with its claws, one with its horns, and one with its tail. It can use its Swallow instead of its bite.\n\n***Bite.*** *Melee Weapon Attack:* +19 to hit, reach 10 ft., one target. *Hit:* 36 (4d12+10) piercing damage. If the target is a creature, it is grappled (escape DC 20). Until this grapple ends, the target is restrained, and the tarrasque can't bite another target.\n\n***Claw.*** *Melee Weapon Attack:* +19 to hit, reach 15 ft., one target. *Hit:* 28 (4d8+10) slashing damage.\n\n***Horns.*** *Melee Weapon Attack:* +19 to hit, reach 10 ft., one target. *Hit:* 32 (4d10+10) piercing damage.\n\n***Tail.*** *Melee Weapon Attack:* +19 to hit, reach 20 ft., one target. *Hit:* 24 (4d6+10) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be knocked prone.\n\n***Frightful Presence.*** Each creature of the tarrasque's choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the tarrasque is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the tarrasque's Frightful Presence for the next 24 hours.\n\n***Swallow.*** The tarrasque makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the bite's damage, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) acid damage at the start of each of the tarrasque's turns."
};

export default SRD_MONSTER_TARRASQUE;