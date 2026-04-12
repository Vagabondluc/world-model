import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GOAT: SavedMonster = {
  "id": "srd-goat",
  "name": "Goat",
  "description": "A common domestic and wild herbivore, known for its stubborn nature and surprising agility on rocky terrain.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "4 (1d8)",
      "speed": "40 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR +1, DEX +0, CON +0, INT -4, WIS +0, CHA -3",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Charge.** If the goat moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 2 (1d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 10 Strength saving throw or be knocked prone.\n\n**Sure-Footed.** The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.",
    "actions": "**Ram.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 3 (1d4+1) bludgeoning damage.",
    "roleplayingAndTactics": "Goats are not aggressive but are fiercely territorial. A male goat (a buck) will use its powerful charge to knock down perceived threats. They are excellent climbers."
  },
  "statblock": "### Goat\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 4 (1d8)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 10 (+0) | 11 (+0) | 2 (-4) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Charge.*** If the goat moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 2 (1d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 10 Strength saving throw or be knocked prone.\n\n***Sure-Footed.*** The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.\n\n### Actions\n***Ram.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 3 (1d4 + 1) bludgeoning damage."
};

export default SRD_MONSTER_GOAT;