
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_FLYING_SWORD_ANIMATED_OBJECT: SavedMonster = {
  "id": "srd-flying-sword-animated-object",
  "name": "Flying Sword (Animated Object)",
  "description": "A sword that hovers in the air, animated by magic. It attacks with mindless persistence, defending a location or following its creator's orders.",
  "profile": {
    "table": {
      "creatureType": "Small construct",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "17 (natural armor)",
      "hitPoints": "17 (5d6)",
      "speed": "0 ft., fly 50 ft. (hover)",
      "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 7",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX +2, CON +0, INT -5, WIS -3, CHA -5",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Antimagic Susceptibility.** The sword is incapacitated while in the area of an *antimagic field*. If targeted by *dispel magic*, the sword must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.\n\n**False Appearance.** While the sword remains motionless and isn't flying, it is indistinguishable from a normal sword.",
    "actions": "**Longsword.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8 + 1) slashing damage.",
    "roleplayingAndTactics": "The flying sword is a mindless guardian. It relies on its False Appearance to surprise intruders, animating suddenly to strike. It fights until destroyed or until its quarry leaves its guarded area."
  },
  "statblock": "### Flying Sword (Animated Object)\n\n*Small construct, unaligned*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 17 (5d6)\n\n- **Speed** 0 ft., fly 50 ft. (hover)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 15 (+2) | 11 (+0) | 1 (-5) | 5 (-3) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 7\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Antimagic Susceptibility.*** The sword is incapacitated while in the area of an *antimagic field*. If targeted by *dispel magic*, the sword must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.\n\n***False Appearance.*** While the sword remains motionless and isn't flying, it is indistinguishable from a normal sword.\n\n### Actions\n***Longsword.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8 + 1) slashing damage."
};

export default SRD_MONSTER_FLYING_SWORD_ANIMATED_OBJECT;
