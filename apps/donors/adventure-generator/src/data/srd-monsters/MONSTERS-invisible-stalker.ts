

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_INVISIBLE_STALKER: SavedMonster = {
  "id": "srd-invisible-stalker",
  "name": "Invisible Stalker",
  "description": "An invisible stalker is a creature of elemental air, summoned to the Material Plane to perform a specific task. It is a relentless hunter, invisible to the naked eye.",
  "profile": {
    "table": {
      "creatureType": "Medium elemental",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "14",
      "hitPoints": "104 (16d8+32)",
      "speed": "50 ft., fly 50 ft. (hover)",
      "senses": "darkvision 60 ft., passive Perception 18",
      "languages": "Auran, understands Common but doesn't speak it",
      "challengeRating": "6 (2,300 XP)",
      "keyAbilities": "STR +3, DEX +4, CON +2, INT +0, WIS +2, CHA +0",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Invisibility.** The stalker is invisible.\n\n**Faultless Tracker.** The stalker is given a quarry by its summoner. The stalker knows the direction and distance to its quarry as long as the two of them are on the same plane of existence. The stalker also knows the location of its summoner.",
    "actions": "**Multiattack.** The stalker makes two slam attacks.\n\n**Slam.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) bludgeoning damage.",
    "roleplayingAndTactics": "An invisible stalker is a patient and relentless hunter. It follows its quarry without rest, waiting for the perfect moment to strike. In combat, it uses its invisibility to its full advantage, making slam attacks before flying away. It fights until it or its target is destroyed, or until its summoner releases it."
  },
  "statblock": "### Invisible Stalker\n\n*Medium elemental, neutral*\n\n___\n\n- **Armor Class** 14\n\n- **Hit Points** 104 (16d8+32)\n\n- **Speed** 50 ft., fly 50 ft. (hover)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 19 (+4) | 14 (+2) | 10 (+0) | 15 (+2) | 11 (+0) |\n\n___\n\n- **Skills** Perception +8, Stealth +10\n\n- **Senses** darkvision 60 ft., passive Perception 18\n\n- **Languages** Auran, understands Common but doesn't speak it\n\n- **Challenge** 6 (2,300 XP)\n\n___\n\n***Invisibility.*** The stalker is invisible.\n\n***Faultless Tracker.*** The stalker is given a quarry by its summoner. The stalker knows the direction and distance to its quarry as long as the two of them are on the same plane of existence. The stalker also knows the location of its summoner.\n\n### Actions\n***Multiattack.*** The stalker makes two slam attacks.\n\n***Slam.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) bludgeoning damage."
};

export default SRD_MONSTER_INVISIBLE_STALKER;