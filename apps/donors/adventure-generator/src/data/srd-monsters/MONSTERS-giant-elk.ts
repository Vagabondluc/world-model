import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_ELK: SavedMonster = {
  "id": "srd-giant-elk",
  "name": "Giant Elk",
  "description": "These majestic creatures are as large as elephants, with antlers as wide as a wagon. They are intelligent, noble beasts that serve as guardians of ancient forests.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "14 (natural armor)",
      "hitPoints": "42 (5d12+10)",
      "speed": "60 ft.",
      "senses": "passive Perception 14",
      "languages": "Giant Elk, understands Common, Elvish, and Sylvan but can't speak them",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +3, CON +2, INT -2, WIS +2, CHA +0",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Charge.** If the elk moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone.",
    "actions": "**Ram.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.\n\n**Hooves.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one prone creature. *Hit:* 22 (4d8+4) bludgeoning damage.",
    "roleplayingAndTactics": "Giant elk are protectors of the wilderness and are wary of humanoids who despoil it. They will use their powerful charge to knock down a perceived threat, then follow up by trampling them with their hooves. Their speed allows them to control the engagement."
  },
  "statblock": "### Giant Elk\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 42 (5d12+10)\n\n- **Speed** 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 16 (+3) | 14 (+2) | 7 (-2) | 14 (+2) | 10 (+0) |\n\n___\n\n- **Skills** Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** Giant Elk, understands Common, Elvish, and Sylvan but can't speak them\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Charge.*** If the elk moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone.\n\n### Actions\n***Ram.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.\n\n***Hooves.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one prone creature. *Hit:* 22 (4d8+4) bludgeoning damage."
};

export default SRD_MONSTER_GIANT_ELK;