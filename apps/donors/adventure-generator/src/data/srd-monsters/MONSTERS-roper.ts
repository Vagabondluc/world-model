
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ROPER: SavedMonster = {
  "id": "srd-roper",
  "name": "Roper",
  "description": "This bizarre creature perfectly imitates a stalagmite, waiting patiently for prey to wander into its subterranean lair. Its body is covered in eye-spots and it can lash out with long, grasping tendrils.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "neutral evil",
      "armorClass": "20 (natural armor)",
      "hitPoints": "93 (11d10+33)",
      "speed": "10 ft., climb 10 ft.",
      "senses": "darkvision 60 ft., passive Perception 16",
      "languages": "-",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX -1, CON +3, INT -2, WIS +3, CHA -2",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**False Appearance.** While the roper remains motionless, it is indistinguishable from a normal cave formation, such as a stalagmite.\n\n**Grasping Tendrils.** The roper can have up to six tendrils at a time. Each tendril can be attacked (AC 20; 10 hit points; immunity to poison and psychic damage). Destroying a tendril deals no damage to the roper, which can extrude a replacement tendril on its next turn. A tendril can also be broken if a creature takes an action and succeeds on a DC 15 Strength check against it.\n\n**Spider Climb.** The roper can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
    "actions": "**Multiattack.** The roper makes four attacks with its tendrils, uses Reel, and makes one attack with its bite.\n\n**Bite.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 22 (4d8+4) piercing damage.\n\n**Tendril.** *Melee Weapon Attack:* +7 to hit, reach 50 ft., one creature. *Hit:* The target is grappled (escape DC 15). Until the grapple ends, the target is restrained and has disadvantage on Strength checks and Strength saving throws, and the roper can't use the same tendril on another target.\n\n**Reel.** The roper pulls each creature grappled by it up to 25 feet straight toward it.",
    "roleplayingAndTactics": "The roper is a patient ambush predator. It will remain motionless until multiple targets are within range of its tendrils. It will then attempt to grapple several victims at once, reeling them in to be devoured by its central maw. Its high armor class makes it a difficult foe to damage."
  },
  "statblock": "### Roper\n\n*Large monstrosity, neutral evil*\n\n___\n\n- **Armor Class** 20 (natural armor)\n\n- **Hit Points** 93 (11d10+33)\n\n- **Speed** 10 ft., climb 10 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 8 (-1) | 17 (+3) | 7 (-2) | 16 (+3) | 6 (-2) |\n\n___\n\n- **Skills** Perception +6, Stealth +5\n\n- **Senses** darkvision 60 ft., passive Perception 16\n\n- **Languages** -\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***False Appearance.*** While the roper remains motionless, it is indistinguishable from a normal cave formation, such as a stalagmite.\n\n***Grasping Tendrils.*** The roper can have up to six tendrils at a time. Each tendril can be attacked (AC 20; 10 hit points; immunity to poison and psychic damage). Destroying a tendril deals no damage to the roper, which can extrude a replacement tendril on its next turn. A tendril can also be broken if a creature takes an action and succeeds on a DC 15 Strength check against it.\n\n***Spider Climb.*** The roper can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n### Actions\n***Multiattack.*** The roper makes four attacks with its tendrils, uses Reel, and makes one attack with its bite.\n\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 22 (4d8+4) piercing damage.\n\n***Tendril.*** *Melee Weapon Attack:* +7 to hit, reach 50 ft., one creature. *Hit:* The target is grappled (escape DC 15). Until the grapple ends, the target is restrained and has disadvantage on Strength checks and Strength saving throws, and the roper can't use the same tendril on another target."
};

export default SRD_MONSTER_ROPER;
