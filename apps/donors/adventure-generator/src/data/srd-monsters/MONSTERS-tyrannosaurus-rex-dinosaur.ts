
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_TYRANNOSAURUS_REX_DINOSAUR: SavedMonster = {
  "id": "srd-tyrannosaurus-rex-dinosaur",
  "name": "Tyrannosaurus Rex (Dinosaur)",
  "description": "The tyrant lizard king, a colossal bipedal predator with a massive skull full of dagger-like teeth. It is the apex predator of its prehistoric world.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "136 (13d12+52)",
      "speed": "50 ft.",
      "senses": "passive Perception 14",
      "languages": "-",
      "challengeRating": "8 (3,900 XP)",
      "keyAbilities": "STR +7, DEX +0, CON +4, INT -4, WIS +1, CHA -1",
      "role": "Brute"
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The tyrannosaurus makes two attacks: one with its bite and one with its tail. It can't make both attacks against the same target.\n\n**Bite.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 33 (4d12+7) piercing damage. If the target is a Medium or smaller creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the tyrannosaurus can't bite another target.\n\n**Tail.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 20 (3d8+7) bludgeoning damage.",
    "roleplayingAndTactics": "A tyrannosaurus is a relentless hunter. It will single out a target and pursue it, using its powerful bite to grapple and crush its prey. Its tail can sweep other foes off their feet."
  },
  "statblock": "### Tyrannosaurus Rex (Dinosaur)\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 136 (13d12+52)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 25 (+7) | 10 (+0) | 19 (+4) | 2 (-4) | 12 (+1) | 9 (-1) |\n\n___\n\n- **Skills** Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 8 (3,900 XP)\n\n___\n\n### Actions\n***Multiattack.*** The tyrannosaurus makes two attacks: one with its bite and one with its tail. It can't make both attacks against the same target.\n\n***Bite.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 33 (4d12+7) piercing damage. If the target is a Medium or smaller creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the tyrannosaurus can't bite another target.\n\n***Tail.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 20 (3d8+7) bludgeoning damage."
};

export default SRD_MONSTER_TYRANNOSAURUS_REX_DINOSAUR;