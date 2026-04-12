
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_RUG_OF_SMOTHERING_ANIMATED_OBJECT: SavedMonster = {
  "id": "srd-rug-of-smothering-animated-object",
  "name": "Rug of Smothering (Animated Object)",
  "description": "This animated object appears to be a normal, albeit valuable, rug. When a creature steps on it, it rises up to engulf and suffocate its victim.",
  "profile": {
    "table": {
      "creatureType": "Large construct",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "33 (6d10)",
      "speed": "10 ft.",
      "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 6",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +0, INT -5, WIS -4, CHA -5",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Antimagic Susceptibility.** The rug is incapacitated while in the area of an *antimagic field*. If targeted by *dispel magic*, the rug must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.\n\n**Damage Transfer.** While it is grappling a creature, the rug takes only half the damage dealt to it, and the creature grappled by the rug takes the other half.\n\n**False Appearance.** While the rug remains motionless, it is indistinguishable from a normal rug.",
    "actions": "**Smother.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one Medium or smaller creature. *Hit:* The creature is grappled (escape DC 13). Until this grapple ends, the target is restrained, blinded, and at risk of suffocating, and the rug can't smother another target. In addition, at the start of each of the target's turns, the target takes 10 (2d6+3) bludgeoning damage.",
    "roleplayingAndTactics": "The rug of smothering is a mindless trap. It lies in wait, using its false appearance to lure creatures onto it. Once it has grappled a target, it will attempt to smother it while its Damage Transfer ability makes it difficult to destroy without harming the victim."
  },
  "statblock": "### Rug of Smothering (Animated Object)\n\n*Large construct, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 33 (6d10)\n\n- **Speed** 10 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 14 (+2) | 10 (+0) | 1 (-5) | 3 (-4) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 6\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Antimagic Susceptibility.*** The rug is incapacitated while in the area of an *antimagic field*. If targeted by *dispel magic*, the rug must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.\n\n***Damage Transfer.*** While it is grappling a creature, the rug takes only half the damage dealt to it, and the creature grappled by the rug takes the other half.\n\n***False Appearance.*** While the rug remains motionless, it is indistinguishable from a normal rug.\n\n### Actions\n***Smother.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one Medium or smaller creature. *Hit:* The creature is grappled (escape DC 13). Until this grapple ends, the target is restrained, blinded, and at risk of suffocating, and the rug can't smother another target. In addition, at the start of each of the target's turns, the target takes 10 (2d6+3) bludgeoning damage."
};

export default SRD_MONSTER_RUG_OF_SMOTHERING_ANIMATED_OBJECT;
