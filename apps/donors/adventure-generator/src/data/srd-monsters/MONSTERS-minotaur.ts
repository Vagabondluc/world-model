import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MINOTAUR: SavedMonster = {
  "id": "srd-minotaur",
  "name": "Minotaur",
  "description": "A savage, bull-headed monster that possesses a cunning sense of direction and a love for the hunt. Minotaurs are often found in labyrinths, where they stalk their prey with terrifying patience.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "14 (natural armor)",
      "hitPoints": "76 (9d10+27)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 17",
      "languages": "Abyssal",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT -2, WIS +3, CHA -1",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Charge.** If the minotaur moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone.\n\n**Labyrinthine Recall.** The minotaur can perfectly recall any path it has traveled.\n\n**Reckless.** At the start of its turn, the minotaur can gain advantage on all melee weapon attack rolls it makes during that turn, but attack rolls against it have advantage until the start of its next turn.",
    "actions": "**Greataxe.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 17 (2d12+4) slashing damage.\n\n**Gore.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) piercing damage.",
    "roleplayingAndTactics": "A minotaur is a ferocious combatant that uses its Charge to devastating effect. It will often charge a target to knock them prone, then follow up with reckless greataxe attacks. Its Labyrinthine Recall makes it an inescapable foe in any maze-like environment."
  },
  "statblock": "### Minotaur\n\n*Large monstrosity, chaotic evil*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 76 (9d10+27)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 11 (+0) | 16 (+3) | 6 (-2) | 16 (+3) | 9 (-1) |\n\n___\n\n- **Skills** Perception +7\n\n- **Senses** darkvision 60 ft., passive Perception 17\n\n- **Languages** Abyssal\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Charge.*** If the minotaur moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone.\n\n***Labyrinthine Recall.*** The minotaur can perfectly recall any path it has traveled.\n\n***Reckless.*** At the start of its turn, the minotaur can gain advantage on all melee weapon attack rolls it makes during that turn, but attack rolls against it have advantage until the start of its next turn.\n\n### Actions\n***Greataxe.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 17 (2d12+4) slashing damage.\n\n***Gore.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) piercing damage."
};

export default SRD_MONSTER_MINOTAUR;