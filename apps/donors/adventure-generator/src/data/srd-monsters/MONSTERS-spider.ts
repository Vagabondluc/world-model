
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SPIDER: SavedMonster = {
  "id": "srd-spider",
  "name": "Spider",
  "description": "A common arachnid, this tiny spider is an ambush predator that spins webs to catch its prey.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "1 (1d4-1)",
      "speed": "20 ft., climb 20 ft.",
      "senses": "darkvision 30 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +2, CON -1, INT -5, WIS +0, CHA -4",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Spider Climb.** The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n**Web Sense.** While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.\n\n**Web Walker.** The spider ignores movement restrictions caused by webbing.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 1 piercing damage, and the target must succeed on a DC 9 Constitution saving throw or take 2 (1d4) poison damage.",
    "roleplayingAndTactics": "A normal spider is no threat to an adventurer. It will only bite if handled or threatened."
  },
  "statblock": "### Spider\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 20 ft., climb 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 14 (+2) | 8 (-1) | 1 (-5) | 10 (+0) | 2 (-4) |\n\n___\n\n- **Skills** Stealth +4\n\n- **Senses** darkvision 30 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Spider Climb.*** The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n***Web Sense.*** While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.\n\n***Web Walker.*** The spider ignores movement restrictions caused by webbing.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 1 piercing damage, and the target must succeed on a DC 9 Constitution saving throw or take 2 (1d4) poison damage."
};

export default SRD_MONSTER_SPIDER;