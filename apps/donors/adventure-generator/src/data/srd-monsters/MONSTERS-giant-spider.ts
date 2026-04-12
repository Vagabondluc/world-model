import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_SPIDER: SavedMonster = {
  "id": "srd-giant-spider",
  "name": "Giant Spider",
  "description": "These monstrous arachnids lurk in dark forests and subterranean lairs, spinning vast webs to trap unwary prey.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "14 (natural armor)",
      "hitPoints": "26 (4d10+4)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +3, CON +1, INT -4, WIS +0, CHA -3",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Spider Climb.** The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n**Web Sense.** While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.\n\n**Web Walker.** The spider ignores movement restrictions caused by webbing.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 7 (1d8+3) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 9 (2d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.\n\n**Web (Recharge 5-6).** *Ranged Weapon Attack:* +5 to hit, range 30/60 ft., one creature. *Hit:* The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage).",
    "roleplayingAndTactics": "Giant spiders are patient ambush predators. They use their webs to restrain victims before descending to deliver a paralyzing, venomous bite. They will often drag paralyzed prey back to their nests to be consumed later."
  },
  "statblock": "### Giant Spider\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 26 (4d10+4)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 16 (+3) | 12 (+1) | 2 (-4) | 11 (+0) | 4 (-3) |\n\n___\n\n- **Skills** Stealth +7\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Spider Climb.*** The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n***Web Sense.*** While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.\n\n***Web Walker.*** The spider ignores movement restrictions caused by webbing.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 7 (1d8+3) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 9 (2d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.\n\n***Web (Recharge 5-6).*** *Ranged Weapon Attack:* +5 to hit, range 30/60 ft., one creature. *Hit:* The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage)."
};

export default SRD_MONSTER_GIANT_SPIDER;