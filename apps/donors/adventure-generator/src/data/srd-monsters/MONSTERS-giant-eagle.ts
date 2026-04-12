
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_EAGLE: SavedMonster = {
  "id": "srd-giant-eagle",
  "name": "Giant Eagle",
  "description": "A noble and intelligent bird of prey of immense size, giant eagles are sentient creatures who befriend good-aligned humanoids and serve as messengers and mounts for the forces of light.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "neutral good",
      "armorClass": "13",
      "hitPoints": "26 (4d10+4)",
      "speed": "10 ft., fly 80 ft.",
      "senses": "passive Perception 14",
      "languages": "Giant Eagle, understands Common and Auran but can't speak them",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +3, DEX +3, CON +1, INT -1, WIS +2, CHA +0",
      "role": "Skirmisher"
    },
    "savingThrows": {
      "wis": 4
    },
    "abilitiesAndTraits": "**Keen Sight.** The eagle has advantage on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Multiattack.** The eagle makes two attacks: one with its beak and one with its talons.\n\n**Beak.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n**Talons.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage.",
    "roleplayingAndTactics": "Giant eagles are proud and will not serve as simple beasts of burden. They form partnerships with those they deem worthy. In combat, they are masters of aerial tactics, using their superior flight to make diving attacks on enemies, particularly orcs and goblins, whom they despise."
  },
  "statblock": "### Giant Eagle\n\n*Large beast, neutral good*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 26 (4d10+4)\n\n- **Speed** 10 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 17 (+3) | 13 (+1) | 8 (-1) | 14 (+2) | 10 (+0) |\n\n___\n\n- **Saving Throws** Wis +4\n- **Skills** Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** Giant Eagle, understands Common and Auran but can't speak them\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Keen Sight.*** The eagle has advantage on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Multiattack.*** The eagle makes two attacks: one with its beak and one with its talons.\n\n***Beak.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n***Talons.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage."
};

export default SRD_MONSTER_GIANT_EAGLE;