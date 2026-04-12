
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SWARM_OF_QUIPPERS: SavedMonster = {
  "id": "srd-swarm-of-quippers",
  "name": "Swarm of Quippers",
  "description": "A frenzied school of carnivorous fish, a swarm of quippers can strip the flesh from a creature in seconds. The water boils with their activity when they sense blood.",
  "profile": {
    "table": {
      "creatureType": "Medium swarm of Tiny beasts",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "28 (8d8-8)",
      "speed": "0 ft., swim 40 ft.",
      "senses": "darkvision 60 ft., passive Perception 8",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +1, DEX +3, CON -1, INT -5, WIS -2, CHA -4",
      "role": ""
    },
    "abilitiesAndTraits": "**Blood Frenzy.** The swarm has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n**Swarm.** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny quipper. The swarm can't regain hit points or gain temporary hit points.\n\n**Water Breathing.** The swarm can breathe only underwater.",
    "actions": "",
    "roleplayingAndTactics": "Quippers are drawn to the scent of blood. Once a creature is wounded, the swarm will enter a blood frenzy, attacking relentlessly until their prey is consumed."
  },
  "statblock": "### Swarm of Quippers\n\n*Medium swarm of Tiny beasts, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 28 (8d8-8)\n\n- **Speed** 0 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 16 (+3) | 9 (-1) | 1 (-5) | 7 (-2) | 2 (-4) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Blood Frenzy.*** The swarm has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n***Swarm.*** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny quipper. The swarm can't regain hit points or gain temporary hit points.\n\n***Water Breathing.*** The swarm can breathe only underwater."
};

export default SRD_MONSTER_SWARM_OF_QUIPPERS;