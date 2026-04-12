
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_OTYUGH: SavedMonster = {
  "id": "srd-otyugh",
  "name": "Otyugh",
  "description": "Otyughs are grotesque, three-legged aberrations that lurk in piles of offal and waste, consuming anything that wanders into their lairs. They have a single large eye on a stalk and two rubbery tentacles for grabbing prey.",
  "profile": {
    "table": {
      "creatureType": "Large aberration",
      "size": "Large",
      "alignment": "neutral",
      "armorClass": "14 (natural armor)",
      "hitPoints": "114 (12d10+48)",
      "speed": "30 ft.",
      "senses": "darkvision 120 ft., passive Perception 11",
      "languages": "Otyugh",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +4, INT -2, WIS +1, CHA -2",
      "role": "Controller"
    },
    "savingThrows": {
        "con": 7
    },
    "abilitiesAndTraits": "**Limited Telepathy.** The otyugh can magically transmit simple messages and images to any creature within 120 feet of it that can understand a language. This form of telepathy doesn't allow the receiving creature to telepathically respond.",
    "actions": "**Multiattack.** The otyugh makes three attacks: one with its bite and two with its tentacles.\n\n**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 12 (2d8+3) piercing damage. If the target is a creature, it must succeed on a DC 15 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the target must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. The disease is cured on a success. The target dies if the disease reduces its hit point maximum to 0. This reduction to the target's hit point maximum lasts until the disease is cured.\n\n**Tentacle.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 7 (1d8+3) bludgeoning damage plus 4 (1d8) piercing damage. If the target is Medium or smaller, it is grappled (escape DC 13) and restrained until the grapple ends. The otyugh has two tentacles, each of which can grapple one target.",
    "roleplayingAndTactics": "An otyugh is a patient ambush predator, hiding in refuse until a meal comes within reach. In combat, it will use its tentacles to grapple two different targets, then focus its diseased bite on one of them. While not intelligent, they can be bargained with, often exchanging passage for a tasty meal."
  },
  "statblock": "### Otyugh\n\n*Large aberration, neutral*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 114 (12d10+48)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 11 (+0) | 19 (+4) | 6 (-2) | 13 (+1) | 6 (-2) |\n\n___\n\n- **Saving Throws** Con +7\n- **Senses** darkvision 120 ft., passive Perception 11\n\n- **Languages** Otyugh\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Limited Telepathy.*** The otyugh can magically transmit simple messages and images to any creature within 120 feet of it that can understand a language. This form of telepathy doesn't allow the receiving creature to telepathically respond.\n\n### Actions\n***Multiattack.*** The otyugh makes three attacks: one with its bite and two with its tentacles.\n\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 12 (2d8+3) piercing damage. If the target is a creature, it must succeed on a DC 15 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the target must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. The disease is cured on a success. The target dies if the disease reduces its hit point maximum to 0. This reduction to the target's hit point maximum lasts until the disease is cured.\n\n***Tentacle.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 7 (1d8+3) bludgeoning damage plus 4 (1d8) piercing damage. If the target is Medium or smaller, it is grappled (escape DC 13) and restrained until the grapple ends. The otyugh has two tentacles, each of which can grapple one target."
};

export default SRD_MONSTER_OTYUGH;
