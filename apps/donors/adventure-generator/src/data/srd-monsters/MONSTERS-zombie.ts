
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ZOMBIE: SavedMonster = {
  "id": "srd-zombie",
  "name": "Zombie",
  "description": "A reanimated corpse that mindlessly obeys the will of its dark master. It moves with a slow, shambling gait and groans with insatiable hunger for the flesh of the living.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "8",
      "hitPoints": "22 (3d8+9)",
      "speed": "20 ft.",
      "senses": "darkvision 60 ft., passive Perception 8",
      "languages": "understands the languages it knew in life but can't speak",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX -2, CON +3, INT -4, WIS -2, CHA -3",
      "role": "Minion"
    },
    "savingThrows": {
      "wis": 0
    },
    "abilitiesAndTraits": "**Undead Fortitude.** If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
    "actions": "**Slam.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) bludgeoning damage.",
    "roleplayingAndTactics": "Zombies are mindless automatons that attack any living creature they can see. They move with a shambling gait and can be surprisingly resilient due to their Undead Fortitude. They will fight until destroyed."
  },
  "statblock": "### Zombie\n\n*Medium undead, neutral evil*\n\n___\n\n- **Armor Class** 8\n\n- **Hit Points** 22 (3d8+9)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 6 (-2) | 16 (+3) | 3 (-4) | 6 (-2) | 5 (-3) |\n\n___\n\n- **Saving Throws** Wis +0\n- **Damage Immunities** poison\n- **Condition Immunities** poisoned\n- **Senses** darkvision 60 ft., passive Perception 8\n- **Languages** understands the languages it knew in life but can't speak\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Undead Fortitude.*** If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.\n\n### Actions\n***Slam.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) bludgeoning damage."
};

export default SRD_MONSTER_ZOMBIE;
