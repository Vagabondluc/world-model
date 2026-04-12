
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PHASE_SPIDER: SavedMonster = {
  "id": "srd-phase-spider",
  "name": "Phase Spider",
  "description": "This monstrous spider has the terrifying ability to shift between the Material and Ethereal Planes, allowing it to appear as if from nowhere to ambush its prey.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "32 (5d10+5)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +1, INT -2, WIS +0, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Ethereal Jaunt.** As a bonus action, the spider can magically shift from the Material Plane to the Ethereal Plane, or vice versa.\n\n**Spider Climb.** The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n**Web Walker.** The spider ignores movement restrictions caused by webbing.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 7 (1d10+2) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 18 (4d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.",
    "roleplayingAndTactics": "Phase spiders are deadly ambush predators. They will wait in the Ethereal Plane until prey is vulnerable, then shift to the Material Plane to deliver a venomous bite before phasing out again. This tactic makes them incredibly difficult to fight, as they can attack and retreat with impunity."
  },
  "statblock": "### Phase Spider\n\n*Large monstrosity, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 32 (5d10+5)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 15 (+2) | 12 (+1) | 6 (-2) | 10 (+0) | 6 (-2) |\n\n___\n\n- **Skills** Stealth +6\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Ethereal Jaunt.*** As a bonus action, the spider can magically shift from the Material Plane to the Ethereal Plane, or vice versa.\n\n***Spider Climb.*** The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n***Web Walker.*** The spider ignores movement restrictions caused by webbing.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 7 (1d10+2) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 18 (4d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
};

export default SRD_MONSTER_PHASE_SPIDER;
