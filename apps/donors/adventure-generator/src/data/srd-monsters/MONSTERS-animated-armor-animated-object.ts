import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ANIMATED_ARMOR_ANIMATED_OBJECT: SavedMonster = {
  "id": "srd-animated-armor-animated-object",
  "name": "Animated Armor (Animated Object)",
  "description": "This suit of empty plate armor clanks to life, animated by magic to serve as a tireless guardian.",
  "profile": {
    "table": {
      "creatureType": "Medium construct",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "18 (natural armor)",
      "hitPoints": "33 (6d8+6)",
      "speed": "25 ft.",
      "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 6",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +1, INT -5, WIS -4, CHA -5",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**Antimagic Susceptibility.** The armor is incapacitated while in the area of an *antimagic field*. If targeted by *dispel magic*, the armor must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.\n\n**False Appearance.** While the armor remains motionless, it is indistinguishable from a normal suit of armor.",
    "actions": "**Multiattack.** The armor makes two melee attacks.\n\n**Slam.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) bludgeoning damage.",
    "roleplayingAndTactics": "An animated armor acts with cold, mindless obedience, following its last orders without deviation. It attacks intruders on sight, fighting until destroyed. It cannot be reasoned with or intimidated."
  },
  "statblock": "### Animated Armor (Animated Object)\n\n*Medium construct, unaligned*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 33 (6d8+6)\n\n- **Speed** 25 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 11 (+0) | 13 (+1) | 1 (-5) | 3 (-4) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 6\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Antimagic Susceptibility.*** The armor is incapacitated while in the area of an *antimagic field*. If targeted by *dispel magic*, the armor must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.\n\n***False Appearance.*** While the armor remains motionless, it is indistinguishable from a normal suit of armor.\n\n### Actions\n***Multiattack.*** The armor makes two melee attacks.\n\n***Slam.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) bludgeoning damage."
};

export default SRD_MONSTER_ANIMATED_ARMOR_ANIMATED_OBJECT;