import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_AIR_ELEMENTAL: SavedMonster = {
  "id": "srd-air-elemental",
  "name": "Air Elemental",
  "description": "A creature of living air, an air elemental appears as a swirling vortex of wind and dust, barely visible but powerfully present.",
  "profile": {
    "table": {
      "creatureType": "Large elemental",
      "size": "Large",
      "alignment": "neutral",
      "armorClass": "15",
      "hitPoints": "90 (12d10+24)",
      "speed": "0 ft., fly 90 ft. (hover)",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Auran",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +2, DEX +5, CON +2, INT -2, WIS +0, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Air Form.** The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.",
    "actions": "**Multiattack.** The elemental makes two slam attacks.\n\n**Slam.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 14 (2d8+5) bludgeoning damage.\n\n**Whirlwind (Recharge 4-6).** Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8+2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone.",
    "roleplayingAndTactics": "An air elemental is a chaotic force of nature. It uses its high fly speed and Whirlwind ability to sow chaos, flinging enemies around the battlefield. It will often focus on spellcasters to disrupt their concentration."
  },
  "statblock": "### Air Elemental\n\n*Large elemental, neutral*\n\n___\n\n- **Armor Class** 15\n\n- **Hit Points** 90 (12d10+24)\n\n- **Speed** 0 ft., fly 90 ft. (hover)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 20 (+5) | 14 (+2) | 6 (-2) | 10 (+0) | 6 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Auran\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Air Form.*** The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.\n\n### Actions\n***Multiattack.*** The elemental makes two slam attacks.\n\n***Slam.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 14 (2d8+5) bludgeoning damage.\n\n***Whirlwind (Recharge 4-6).*** Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8+2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone."
};

export default SRD_MONSTER_AIR_ELEMENTAL;