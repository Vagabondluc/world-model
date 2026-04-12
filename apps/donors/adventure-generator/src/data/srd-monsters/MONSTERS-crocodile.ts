
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CROCODILE: SavedMonster = {
  "id": "srd-crocodile",
  "name": "Crocodile",
  "description": "A patient, powerful amphibious reptile, the crocodile is an ambush predator that lurks in swamps, rivers, and coastlines.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "19 (3d10+3)",
      "speed": "20 ft., swim 30 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +1, INT -4, WIS +0, CHA -3",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Hold Breath.** The crocodile can hold its breath for 15 minutes.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 7 (1d10 + 2) piercing damage, and the target is grappled (escape DC 12). Until this grapple ends, the target is restrained, and the crocodile can't bite another target.",
    "roleplayingAndTactics": "Crocodiles are masters of the ambush, waiting silently with just their eyes above the water. They will lunge at prey on the shoreline, attempting to grapple them and drag them underwater to drown."
  },
  "statblock": "### Crocodile\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 19 (3d10+3)\n\n- **Speed** 20 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 10 (+0) | 13 (+1) | 2 (-4) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Skills** Stealth +2\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Hold Breath.*** The crocodile can hold its breath for 15 minutes.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 7 (1d10 + 2) piercing damage, and the target is grappled (escape DC 12). Until this grapple ends, the target is restrained, and the crocodile can't bite another target."
};

export default SRD_MONSTER_CROCODILE;