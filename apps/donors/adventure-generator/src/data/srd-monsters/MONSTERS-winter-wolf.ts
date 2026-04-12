
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WINTER_WOLF: SavedMonster = {
  "id": "srd-winter-wolf",
  "name": "Winter Wolf",
  "description": "Larger and more intelligent than a common wolf, the winter wolf is a cunning predator of the frozen wastes. Its fur is as white as snow, and its breath is a blast of freezing cold.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "neutral evil",
      "armorClass": "13 (natural armor)",
      "hitPoints": "75 (10d10+20)",
      "speed": "50 ft.",
      "senses": "passive Perception 15",
      "languages": "Common, Giant, Winter Wolf",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +4, DEX +1, CON +2, INT -2, WIS +1, CHA -1",
      "role": ""
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n**Pack Tactics.** The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n**Snow Camouflage.** The wolf has advantage on Dexterity (Stealth) checks made to hide in snowy terrain.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone.\n\n**Cold Breath (Recharge 5-6).** The wolf exhales a blast of freezing wind in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Winter wolves are intelligent pack hunters. They use their snow camouflage to ambush prey, opening with their cold breath to weaken a group before singling out a target. They fight with a cunning born of their evil intelligence."
  },
  "statblock": "### Winter Wolf\n\n*Large monstrosity, neutral evil*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 75 (10d10+20)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 13 (+1) | 14 (+2) | 7 (-2) | 12 (+1) | 8 (-1) |\n\n___\n\n- **Skills** Perception +5, Stealth +3\n\n- **Senses** passive Perception 15\n\n- **Languages** Common, Giant, Winter Wolf\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Keen Hearing and Smell.*** The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n***Pack Tactics.*** The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n***Snow Camouflage.*** The wolf has advantage on Dexterity (Stealth) checks made to hide in snowy terrain.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone.\n\n***Cold Breath (Recharge 5-6).*** The wolf exhales a blast of freezing wind in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_WINTER_WOLF;
