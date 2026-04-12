
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DRETCH_DEMON: SavedMonster = {
  "id": "srd-dretch-demon",
  "name": "Dretch (Demon)",
  "description": "Lemures are the lowest form of devil, mindless blobs of molten flesh from the Nine Hells. They are the tormented souls of the evil and corrupt, now serving as a mindless, endlessly regenerating infantry for their infernal masters.",
  "profile": {
    "table": {
      "creatureType": "Small fiend (demon)",
      "size": "Small",
      "alignment": "chaotic evil",
      "armorClass": "11 (natural armor)",
      "hitPoints": "18 (4d6+4)",
      "speed": "20 ft.",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "Abyssal, telepathy 60 ft. (works only with creatures that understand Abyssal)",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +0, DEX +0, CON +1, INT -3, WIS -1, CHA -4",
      "role": "Minion"
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The dretch makes two attacks: one with its bite and one with its claws.\n\n**Bite.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 3 (1d6) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 5 (2d4) slashing damage.\n\n**Fetid Cloud (1/Day).** A 10-foot radius of disgusting green gas extends out from the dretch. The gas spreads around corners, and its area is heavily obscured. It lasts for 1 minute or until a strong wind disperses it. Any creature that starts its turn in that area must succeed on a DC 11 Constitution saving throw or be poisoned until the start of its next turn. While poisoned in this way, the target can take either an action or a bonus action on its turn, not both, and can't take reactions.",
    "roleplayingAndTactics": "Dretches are cowardly bullies. They attack in mobs, hoping to overwhelm enemies with sheer numbers. If a fight turns against them, they will use their Fetid Cloud to cover a retreat. They are easily intimidated by stronger demons."
  },
  "statblock": "### Dretch (Demon)\n\n*Small fiend (demon), chaotic evil*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 18 (4d6+4)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 11 (+0) | 12 (+1) | 5 (-3) | 8 (-1) | 3 (-4) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 9\n\n- **Languages** Abyssal, telepathy 60 ft. (works only with creatures that understand Abyssal)\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Multiattack.*** The dretch makes two attacks: one with its bite and one with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 3 (1d6) piercing damage."
};

export default SRD_MONSTER_DRETCH_DEMON;