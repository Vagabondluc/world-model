
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SHAMBLING_MOUND: SavedMonster = {
  "id": "srd-shambling-mound",
  "name": "Shambling Mound",
  "description": "A shambling mound, or shambler, is a large, animate plant that resembles a heap of rotting vegetation. It is a mindless predator that engulfs and crushes its prey.",
  "profile": {
    "table": {
      "creatureType": "Large plant",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "15 (natural armor)",
      "hitPoints": "136 (16d10+48)",
      "speed": "20 ft., swim 20 ft.",
      "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 10",
      "languages": "-",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX -1, CON +3, INT -3, WIS +0, CHA -3",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Lightning Absorption.** Whenever the shambling mound is subjected to lightning damage, it takes no damage and regains a number of hit points equal to the lightning damage dealt.",
    "actions": "**Multiattack.** The shambling mound makes two slam attacks. If both attacks hit a Medium or smaller target, the target is grappled (escape DC 14), and the shambling mound uses its Engulf on it.\n\n**Slam.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage.\n\n**Engulf.** The shambling mound engulfs a Medium or smaller creature grappled by it. The engulfed creature is blinded, restrained, and unable to breathe, and it must succeed on a DC 14 Constitution saving throw at the start of each of the mound's turns or take 13 (2d8+4) bludgeoning damage.",
    "roleplayingAndTactics": "Shambling mounds are ambush predators that lie in wait, appearing as a pile of vegetation. They are drawn to movement and will attempt to grapple and engulf the nearest creature. They are healed by lightning, making them a particularly tricky foe for spellcasters."
  },
  "statblock": "### Shambling Mound\n\n*Large plant, unaligned*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 136 (16d10+48)\n\n- **Speed** 20 ft., swim 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 8 (-1) | 16 (+3) | 5 (-3) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Skills** Stealth +2\n\n- **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Lightning Absorption.*** Whenever the shambling mound is subjected to lightning damage, it takes no damage and regains a number of hit points equal to the lightning damage dealt.\n\n### Actions\n***Multiattack.*** The shambling mound makes two slam attacks. If both attacks hit a Medium or smaller target, the target is grappled (escape DC 14), and the shambling mound uses its Engulf on it.\n\n***Slam.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) bludgeoning damage."
};

export default SRD_MONSTER_SHAMBLING_MOUND;