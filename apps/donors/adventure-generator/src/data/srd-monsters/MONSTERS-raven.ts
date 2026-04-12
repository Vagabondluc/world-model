
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_RAVEN: SavedMonster = {
  "id": "srd-raven",
  "name": "Raven",
  "description": "A large, intelligent black bird often associated with ill omens and magic. Ravens are known for their ability to mimic sounds.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "1 (1d4-1)",
      "speed": "10 ft., fly 50 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +2, CON -1, INT -4, WIS +1, CHA -2",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Mimicry.** The raven can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering. A creature that hears the sounds can tell they are imitations with a successful DC 10 Wisdom (Insight) check.",
    "actions": "**Beak.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage.",
    "roleplayingAndTactics": "Ravens are clever birds that can be trained as messengers or spies. They are not combatants and will flee from danger, but their mimicry can be used to create diversions or deliver cryptic warnings."
  },
  "statblock": "### Raven\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 10 ft., fly 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 14 (+2) | 8 (-1) | 2 (-4) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Mimicry.*** The raven can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering. A creature that hears the sounds can tell they are imitations with a successful DC 10 Wisdom (Insight) check.\n\n### Actions\n***Beak.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage."
};

export default SRD_MONSTER_RAVEN;
