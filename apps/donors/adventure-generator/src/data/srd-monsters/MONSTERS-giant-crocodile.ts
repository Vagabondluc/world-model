
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_CROCODILE: SavedMonster = {
  "id": "srd-giant-crocodile",
  "name": "Giant Crocodile",
  "description": "A primeval reptile of immense size and strength, the giant crocodile is an apex predator of swamps and rivers. Its bone-crushing jaws are its most formidable weapon.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "14 (natural armor)",
      "hitPoints": "85 (9d12+27)",
      "speed": "30 ft., swim 50 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +5, DEX -1, CON +3, INT -4, WIS +0, CHA -2",
      "role": "Ambusher"
    },
    "savingThrows": {
      "str": 8,
      "con": 6
    },
    "abilitiesAndTraits": "**Hold Breath.** The crocodile can hold its breath for 30 minutes.",
    "actions": "**Multiattack.** The crocodile makes two attacks: one with its bite and one with its tail.\n\n**Bite.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 21 (3d10+5) piercing damage, and the target is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the crocodile can't bite another target.\n\n**Tail.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target that is not grappled by the crocodile. *Hit:* 14 (2d8+5) bludgeoning damage. If the target is a creature, it must succeed on a DC 16 Strength saving throw or be knocked prone.",
    "roleplayingAndTactics": "The giant crocodile is a patient ambush predator. It waits submerged for prey to approach the water's edge, then lunges to bite and grapple a victim. It will attempt to drag its grappled prey into the water to drown it, while using its powerful tail to knock other attackers prone."
  },
  "statblock": "### Giant Crocodile\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 85 (9d12+27)\n\n- **Speed** 30 ft., swim 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 21 (+5) | 9 (-1) | 17 (+3) | 2 (-4) | 10 (+0) | 7 (-2) |\n\n___\n\n- **Saving Throws** Str +8, Con +6\n- **Skills** Stealth +5\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Hold Breath.*** The crocodile can hold its breath for 30 minutes.\n\n### Actions\n***Multiattack.*** The crocodile makes two attacks: one with its bite and one with its tail.\n\n***Bite.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 21 (3d10+5) piercing damage, and the target is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the crocodile can't bite another target.\n\n***Tail.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target that is not grappled by the crocodile. *Hit:* 14 (2d8+5) bludgeoning damage. If the target is a creature, it must succeed on a DC 16 Strength saving throw or be knocked prone."
};

export default SRD_MONSTER_GIANT_CROCODILE;