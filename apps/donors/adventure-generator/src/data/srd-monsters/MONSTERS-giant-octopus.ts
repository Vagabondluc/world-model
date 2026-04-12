import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_OCTOPUS: SavedMonster = {
  "id": "srd-giant-octopus",
  "name": "Giant Octopus",
  "description": "An intelligent and reclusive cephalopod, the giant octopus is a master of camouflage and a dangerous grappler in its underwater domain.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "52 (8d10+8)",
      "speed": "10 ft., swim 60 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +1, INT -3, WIS +0, CHA -3",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Hold Breath.** While out of water, the octopus can hold its breath for 1 hour.\n\n**Underwater Camouflage.** The octopus has advantage on Dexterity (Stealth) checks made while underwater.\n\n**Water Breathing.** The octopus can breathe only underwater.",
    "actions": "**Tentacles.** *Melee Weapon Attack:* +5 to hit, reach 15 ft., one target. *Hit:* 10 (2d6+3) bludgeoning damage. If the target is a creature, it is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the octopus can't use its tentacles on another target.\n\n**Ink Cloud (Recharges after a Short or Long Rest).** A 20-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action.",
    "roleplayingAndTactics": "The giant octopus is a cunning hunter. It uses its camouflage to ambush prey, grappling a target with its long tentacles. If it feels threatened, it will release its Ink Cloud to cover its escape."
  },
  "statblock": "### Giant Octopus\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 52 (8d10+8)\n\n- **Speed** 10 ft., swim 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 13 (+1) | 13 (+1) | 4 (-3) | 10 (+0) | 4 (-3) |\n\n___\n\n- **Skills** Perception +4, Stealth +5\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Hold Breath.*** While out of water, the octopus can hold its breath for 1 hour.\n\n***Underwater Camouflage.*** The octopus has advantage on Dexterity (Stealth) checks made while underwater.\n\n***Water Breathing.*** The octopus can breathe only underwater.\n\n### Actions\n***Tentacles.*** *Melee Weapon Attack:* +5 to hit, reach 15 ft., one target. *Hit:* 10 (2d6+3) bludgeoning damage. If the target is a creature, it is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the octopus can't use its tentacles on another target.\n\n***Ink Cloud (Recharges after a Short or Long Rest).*** A 20-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action."
};

export default SRD_MONSTER_GIANT_OCTOPUS;