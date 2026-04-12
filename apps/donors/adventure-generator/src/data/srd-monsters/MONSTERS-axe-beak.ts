import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_AXE_BEAK: SavedMonster = {
  "id": "srd-axe-beak",
  "name": "Axe Beak",
  "description": "This large, flightless bird has a heavy, sharp beak shaped like an axe head. They are often used as mounts in regions where horses are scarce.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "19 (3d10+3)",
      "speed": "50 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +1, INT -4, WIS +0, CHA -3",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "",
    "actions": "**Beak.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) slashing damage.",
    "roleplayingAndTactics": "Axe beaks are aggressive and territorial. They are fast runners and will charge at threats, attacking with their powerful beaks. They often travel in small flocks and will swarm a single target."
  },
  "statblock": "### Axe Beak\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 19 (3d10+3)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 12 (+1) | 12 (+1) | 2 (-4) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Beak.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) slashing damage."
};

export default SRD_MONSTER_AXE_BEAK;