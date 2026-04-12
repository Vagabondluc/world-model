import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MERFOLK: SavedMonster = {
  "id": "srd-merfolk",
  "name": "Merfolk",
  "description": "Merfolk are aquatic humanoids with the upper body of a human and the lower body of a fish. They are a proud and reclusive people, living in grand cities beneath the waves.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (merfolk)",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "11",
      "hitPoints": "11 (2d8+2)",
      "speed": "10 ft., swim 40 ft.",
      "senses": "passive Perception 12",
      "languages": "Aquan, Common",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +0, DEX +1, CON +1, INT +0, WIS +0, CHA +1",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Amphibious.** The merfolk can breathe air and water.",
    "actions": "**Spear.** *Melee or Ranged Weapon Attack:* +2 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 3 (1d6) piercing damage, or 4 (1d8) piercing damage if used with two hands to make a melee attack.",
    "roleplayingAndTactics": "Merfolk are wary of surface dwellers and are fiercely protective of their underwater domains. They are not naturally aggressive but will defend themselves with spears and tridents if threatened. They use their superior swimming speed to their advantage, making quick strikes before retreating into the depths."
  },
  "statblock": "### Merfolk\n\n*Medium humanoid (merfolk), neutral*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 10 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 13 (+1) | 12 (+1) | 11 (+0) | 11 (+0) | 12 (+1) |\n\n___\n\n- **Skills** Perception +2\n\n- **Senses** passive Perception 12\n\n- **Languages** Aquan, Common\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Amphibious.*** The merfolk can breathe air and water.\n\n### Actions\n***Spear.*** *Melee or Ranged Weapon Attack:* +2 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 3 (1d6) piercing damage, or 4 (1d8) piercing damage if used with two hands to make a melee attack."
};

export default SRD_MONSTER_MERFOLK;