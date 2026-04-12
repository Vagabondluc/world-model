import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ETTERCAP: SavedMonster = {
  "id": "srd-ettercap",
  "name": "Ettercap",
  "description": "An ettercap is a monstrous, spider-like humanoid that spins thick, sticky webs to trap its prey. They are solitary hunters, often found in dark forests and caves, surrounded by giant spiders they have tamed.",
  "profile": {
    "table": {
      "creatureType": "Medium monstrosity",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "13 (natural armor)",
      "hitPoints": "44 (8d8+8)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +1, INT -2, WIS +1, CHA -1",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Spider Climb.** The ettercap can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n**Web Sense.** While in contact with a web, the ettercap knows the exact location of any other creature in contact with the same web.\n\n**Web Walker.** The ettercap ignores movement restrictions caused by webbing.",
    "actions": "**Multiattack.** The ettercap makes two attacks: one with its bite and one with its claws.\n\n**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 6 (1d8+2) piercing damage plus 4 (1d8) poison damage. The target must succeed on a DC 11 Constitution saving throw or be poisoned for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "roleplayingAndTactics": "Ettercaps are cunning trappers. They create elaborate web-filled lairs to ensnare victims. In a fight, an ettercap will try to use its web to restrain a target before closing in for a poisoned bite. They often fight alongside giant spiders, making for a deadly combination."
  },
  "statblock": "### Ettercap\n\n*Medium monstrosity, neutral evil*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 44 (8d8+8)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 15 (+2) | 13 (+1) | 7 (-2) | 12 (+1) | 8 (-1) |\n\n___\n\n- **Skills** Perception +3, Stealth +4, Survival +3\n\n- **Senses** darkvision 60 ft., passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Spider Climb.*** The ettercap can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n***Web Sense.*** While in contact with a web, the ettercap knows the exact location of any other creature in contact with the same web.\n\n***Web Walker.*** The ettercap ignores movement restrictions caused by webbing.\n\n### Actions\n***Multiattack.*** The ettercap makes two attacks: one with its bite and one with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 6 (1d8+2) piercing damage plus 4 (1d8) poison damage. The target must succeed on a DC 11 Constitution saving throw or be poisoned for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
};

export default SRD_MONSTER_ETTERCAP;