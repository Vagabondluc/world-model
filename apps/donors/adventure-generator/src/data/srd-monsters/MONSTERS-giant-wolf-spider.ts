import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_WOLF_SPIDER: SavedMonster = {
  "id": "srd-giant-wolf-spider",
  "name": "Giant Wolf Spider",
  "description": "Unlike other giant spiders, this aggressive hunter does not spin webs to catch prey. Instead, it stalks its victims on the ground, relying on its speed and venomous bite.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "11 (2d8+2)",
      "speed": "40 ft., climb 40 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 13",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX +3, CON +1, INT -4, WIS +1, CHA -3",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Spider Climb.** The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n**Web Sense.** While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.\n\n**Web Walker.** The spider ignores movement restrictions caused by webbing.",
    "actions": "**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 4 (1d6+1) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 7 (2d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.",
    "roleplayingAndTactics": "The giant wolf spider is a relentless pursuer. It uses its superior stealth to get close to prey, then leaps to attack with a paralyzing bite. It does not retreat and will fight to the death."
  },
  "statblock": "### Giant Wolf Spider\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 40 ft., climb 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 16 (+3) | 13 (+1) | 3 (-4) | 12 (+1) | 4 (-3) |\n\n___\n\n- **Skills** Perception +3, Stealth +7\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Spider Climb.*** The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n***Web Sense.*** While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.\n\n***Web Walker.*** The spider ignores movement restrictions caused by webbing.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 4 (1d6+1) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 7 (2d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
};

export default SRD_MONSTER_GIANT_WOLF_SPIDER;