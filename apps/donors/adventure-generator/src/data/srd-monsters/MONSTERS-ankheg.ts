import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ANKHEG: SavedMonster = {
  "id": "srd-ankheg",
  "name": "Ankheg",
  "description": "An ankheg resembles an enormous, multi-legged insect. Its long, flat body is covered in a brown or yellow chitinous exoskeleton, and its powerful mandibles can snap a small tree in half.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "14 (natural armor), 11 while prone",
      "hitPoints": "39 (6d10+6)",
      "speed": "30 ft., burrow 10 ft.",
      "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +1, INT -5, WIS +1, CHA -2",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage plus 3 (1d6) acid damage. If the target is a Large or smaller creature, it is grappled (escape DC 13). Until this grapple ends, the ankheg can bite only the grappled creature and has advantage on attack rolls to do so.\n\n**Acid Spray (Recharge 6).** The ankheg spits acid in a line that is 30 feet long and 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 10 (3d6) acid damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Ankhegs are ambush predators, burrowing beneath the ground and waiting for prey to pass overhead. Once it grabs a target with its bite, it will drag it underground to be consumed. They are driven by hunger and are not particularly intelligent."
  },
  "statblock": "### Ankheg\n\n*Large monstrosity, unaligned*\n\n___\n\n- **Armor Class** 14 (natural armor), 11 while prone\n\n- **Hit Points** 39 (6d10+6)\n\n- **Speed** 30 ft., burrow 10 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 11 (+0) | 13 (+1) | 1 (-5) | 13 (+1) | 6 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., tremorsense 60 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage plus 3 (1d6) acid damage. If the target is a Large or smaller creature, it is grappled (escape DC 13). Until this grapple ends, the ankheg can bite only the grappled creature and has advantage on attack rolls to do so.\n\n***Acid Spray (Recharge 6).*** The ankheg spits acid in a line that is 30 feet long and 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 10 (3d6) acid damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_ANKHEG;