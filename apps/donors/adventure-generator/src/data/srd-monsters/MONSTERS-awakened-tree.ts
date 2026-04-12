import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_AWAKENED_TREE: SavedMonster = {
  "id": "srd-awakened-tree",
  "name": "Awakened Tree",
  "description": "An ordinary tree brought to sentience and mobility by the `awaken` spell or similar magic. It often serves as a guardian for a druid's grove or a sacred forest.",
  "profile": {
    "table": {
      "creatureType": "Huge plant",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "59 (7d12+14)",
      "speed": "20 ft.",
      "senses": "passive Perception 10",
      "languages": "one language known by its creator",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX -2, CON +2, INT +0, WIS +0, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**False Appearance.** While the tree remains motionless, it is indistinguishable from a normal tree.",
    "actions": "**Slam.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 14 (3d6+4) bludgeoning damage.",
    "roleplayingAndTactics": "An awakened tree is a slow but powerful combatant. It will stand its ground, using its long reach to slam enemies. It is vulnerable to fire and will focus on any creature wielding it. As a plant, it is immune to many mind-affecting spells."
  },
  "statblock": "### Awakened Tree\n\n*Huge plant, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 59 (7d12+14)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 6 (-2) | 15 (+2) | 10 (+0) | 10 (+0) | 7 (-2) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** one language known by its creator\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***False Appearance.*** While the tree remains motionless, it is indistinguishable from a normal tree.\n\n### Actions\n***Slam.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 14 (3d6+4) bludgeoning damage."
};

export default SRD_MONSTER_AWAKENED_TREE;