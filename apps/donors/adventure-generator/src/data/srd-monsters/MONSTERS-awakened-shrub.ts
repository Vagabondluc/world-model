import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_AWAKENED_SHRUB: SavedMonster = {
  "id": "srd-awakened-shrub",
  "name": "Awakened Shrub",
  "description": "A common shrub magically given sentience and mobility, often to serve as a simple guard or spy.",
  "profile": {
    "table": {
      "creatureType": "Small plant",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "9",
      "hitPoints": "10 (3d6)",
      "speed": "20 ft.",
      "senses": "passive Perception 10",
      "languages": "one language known by its creator",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX -1, CON +0, INT +0, WIS +0, CHA -2",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**False Appearance.** While the shrub remains motionless, it is indistinguishable from a normal shrub.",
    "actions": "**Rake.** *Melee Weapon Attack:* +1 to hit, reach 5 ft., one target. *Hit:* 1 (1d4-1) slashing damage.",
    "roleplayingAndTactics": "Awakened shrubs are not intelligent and follow their last orders mindlessly. They will attack intruders without hesitation but are easily defeated. They often serve as an early warning system for a more powerful master."
  },
  "statblock": "### Awakened Shrub\n\n*Small plant, unaligned*\n\n___\n\n- **Armor Class** 9\n\n- **Hit Points** 10 (3d6)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 3 (-4) | 8 (-1) | 11 (+0) | 10 (+0) | 10 (+0) | 6 (-2) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** one language known by its creator\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***False Appearance.*** While the shrub remains motionless, it is indistinguishable from a normal shrub.\n\n### Actions\n***Rake.*** *Melee Weapon Attack:* +1 to hit, reach 5 ft., one target. *Hit:* 1 (1d4-1) slashing damage."
};

export default SRD_MONSTER_AWAKENED_SHRUB;