import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_SCORPION: SavedMonster = {
  "id": "srd-giant-scorpion",
  "name": "Giant Scorpion",
  "description": "An enormous arachnid of the desert and Underdark, its claws can crush a person and its tail delivers a potent venom.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "15 (natural armor)",
      "hitPoints": "52 (7d10+14)",
      "speed": "40 ft.",
      "senses": "blindsight 60 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +2, INT -5, WIS -1, CHA -4",
      "role": "Ambusher"
    },
    "savingThrows": {
      "con": 4
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The scorpion makes three attacks: two with its claws and one with its sting.\n\n**Claw.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) bludgeoning damage, and the target is grappled (escape DC 12). The scorpion has two claws, each of which can grapple only one target.\n\n**Sting.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 7 (1d10+2) piercing damage, and the target must make a DC 12 Constitution saving throw, taking 22 (4d10) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Giant scorpions are aggressive predators that use their blindsight to hunt in darkness. They grapple prey with their claws before delivering a fatal sting. They are territorial and will attack any creature that enters their hunting grounds."
  },
  "statblock": "### Giant Scorpion\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 52 (7d10+14)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 13 (+1) | 15 (+2) | 1 (-5) | 9 (-1) | 3 (-4) |\n\n___\n\n- **Saving Throws** Con +4\n- **Senses** blindsight 60 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 3 (700 XP)\n\n___\n\n### Actions\n***Multiattack.*** The scorpion makes three attacks: two with its claws and one with its sting.\n\n***Claw.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) bludgeoning damage, and the target is grappled (escape DC 12). The scorpion has two claws, each of which can grapple only one target.\n\n***Sting.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 7 (1d10+2) piercing damage, and the target must make a DC 12 Constitution saving throw, taking 22 (4d10) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_GIANT_SCORPION;