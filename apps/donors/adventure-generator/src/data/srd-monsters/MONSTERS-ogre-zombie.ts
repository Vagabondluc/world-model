
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_OGRE_ZOMBIE: SavedMonster = {
  "id": "srd-ogre-zombie",
  "name": "Ogre Zombie",
  "description": "The reanimated corpse of an ogre, this creature is a mountain of rotting flesh and mindless fury. It combines the brute strength of an ogre with the relentless nature of the undead.",
  "profile": {
    "table": {
      "creatureType": "Large undead",
      "size": "Large",
      "alignment": "neutral evil",
      "armorClass": "8",
      "hitPoints": "85 (9d10+36)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 8",
      "languages": "understands Common and Giant but can't speak",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX -2, CON +4, INT -4, WIS -2, CHA -3",
      "role": "Brute"
    },
    "savingThrows": {
        "wis": 0
    },
    "abilitiesAndTraits": "**Undead Fortitude.** If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
    "actions": "**Morningstar.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage.",
    "roleplayingAndTactics": "An ogre zombie is a simple and direct combatant. It lumbers toward the nearest living creature and attempts to smash it with its morningstar. Its Undead Fortitude makes it surprisingly durable, and it will continue to fight until completely dismembered."
  },
  "statblock": "### Ogre Zombie\n\n*Large undead, neutral evil*\n\n___\n\n- **Armor Class** 8\n\n- **Hit Points** 85 (9d10+36)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 6 (-2) | 18 (+4) | 3 (-4) | 6 (-2) | 5 (-3) |\n\n___\n\n- **Saving Throws** Wis +0\n- **Senses** darkvision 60 ft., passive Perception 8\n\n- **Languages** understands Common and Giant but can't speak\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Undead Fortitude.*** If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.\n\n### Actions\n***Morningstar.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8 + 4) bludgeoning damage."
};

export default SRD_MONSTER_OGRE_ZOMBIE;
