
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_OCTOPUS: SavedMonster = {
  "id": "srd-octopus",
  "name": "Octopus",
  "description": "An intelligent and reclusive cephalopod, the octopus is a master of camouflage, able to change its color and texture to blend in with its surroundings.",
  "profile": {
    "table": {
      "creatureType": "Small beast",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "3 (1d6)",
      "speed": "5 ft., swim 30 ft.",
      "senses": "darkvision 30 ft., passive Perception 12",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -3, DEX +2, CON +0, INT -4, WIS +0, CHA -3",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Hold Breath.** While out of water, the octopus can hold its breath for 30 minutes.\n\n**Underwater Camouflage.** The octopus has advantage on Dexterity (Stealth) checks made while underwater.\n\n**Water Breathing.** The octopus can breathe only underwater.",
    "actions": "**Tentacles.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 1 bludgeoning damage, and the target is grappled (escape DC 10). Until this grapple ends, the octopus can't use its tentacles on another target.\n\n**Ink Cloud (Recharges after a Short or Long Rest).** A 5-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action.",
    "roleplayingAndTactics": "The octopus is an ambush predator. It will hide until prey is close, then lash out with its tentacles to grapple. If threatened by a larger foe, it releases a cloud of ink to cover its escape."
  },
  "statblock": "### Octopus\n\n*Small beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 3 (1d6)\n\n- **Speed** 5 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 4 (-3) | 15 (+2) | 11 (+0) | 3 (-4) | 10 (+0) | 4 (-3) |\n\n___\n\n- **Skills** Perception +2, Stealth +4\n\n- **Senses** darkvision 30 ft., passive Perception 12\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Hold Breath.*** While out of water, the octopus can hold its breath for 30 minutes.\n\n***Underwater Camouflage.*** The octopus has advantage on Dexterity (Stealth) checks made while underwater.\n\n***Water Breathing.*** The octopus can breathe only underwater.\n\n### Actions\n***Tentacles.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 1 bludgeoning damage, and the target is grappled (escape DC 10). Until this grapple ends, the octopus can't use its tentacles on another target."
};

export default SRD_MONSTER_OCTOPUS;
