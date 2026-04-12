
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_STONE_GOLEM: SavedMonster = {
  "id": "srd-stone-golem",
  "name": "Stone Golem",
  "description": "A stone golem is a massive, humanoid construct carved from a single block of stone. It is a tireless guardian, immune to most forms of magic.",
  "profile": {
    "table": {
      "creatureType": "Large construct",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "17 (natural armor)",
      "hitPoints": "178 (17d10+85)",
      "speed": "30 ft.",
      "senses": "darkvision 120 ft., passive Perception 10",
      "languages": "understands the languages of its creator but can't speak",
      "challengeRating": "10 (5,900 XP)",
      "keyAbilities": "STR +6, DEX -1, CON +5, INT -4, WIS +0, CHA -5",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Immutable Form.** The golem is immune to any spell or effect that would alter its form.\n\n**Magic Resistance.** The golem has advantage on saving throws against spells and other magical effects.\n\n**Magic Weapons.** The golem's weapon attacks are magical.",
    "actions": "**Multiattack.** The golem makes two slam attacks.\n\n**Slam.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 19 (3d8+6) bludgeoning damage.\n\n**Slow (Recharge 5-6).** The golem targets one or more creatures it can see within 10 feet of it. Each target must make a DC 17 Wisdom saving throw against this magic. On a failed save, a target can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the target can take either an action or a bonus action on its turn, not both. These effects last for 1 minute.",
    "roleplayingAndTactics": "Stone golems are mindless automatons that follow their creator's orders without question. They are slow but incredibly powerful, and their ability to slow creatures makes them difficult to escape. They will fight until destroyed."
  },
  "statblock": "### Stone Golem\n\n*Large construct, unaligned*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 178 (17d10+85)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 22 (+6) | 9 (-1) | 20 (+5) | 3 (-4) | 11 (+0) | 1 (-5) |\n\n___\n\n- **Senses** darkvision 120 ft., passive Perception 10\n\n- **Languages** understands the languages of its creator but can't speak\n\n- **Challenge** 10 (5,900 XP)\n\n___\n\n***Immutable Form.*** The golem is immune to any spell or effect that would alter its form.\n\n***Magic Resistance.*** The golem has advantage on saving throws against spells and other magical effects.\n\n***Magic Weapons.*** The golem's weapon attacks are magical.\n\n### Actions\n***Multiattack.*** The golem makes two slam attacks.\n\n***Slam.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 19 (3d8+6) bludgeoning damage.\n\n***Slow (Recharge 5-6).*** The golem targets one or more creatures it can see within 10 feet of it. Each target must make a DC 17 Wisdom saving throw against this magic. On a failed save, a target can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the target can take either an action or a bonus action on its turn, not both. These effects last for 1 minute."
};

export default SRD_MONSTER_STONE_GOLEM;