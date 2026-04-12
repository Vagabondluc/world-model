
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ROC: SavedMonster = {
  "id": "srd-roc",
  "name": "Roc",
  "description": "A roc is a bird of such immense size that it is said to prey on elephants and whales. Their nests are vast structures built on the highest mountain peaks, often containing the wreckage of ships and caravans.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan monstrosity",
      "size": "Gargantuan",
      "alignment": "unaligned",
      "armorClass": "15 (natural armor)",
      "hitPoints": "248 (16d20+80)",
      "speed": "20 ft., fly 120 ft.",
      "senses": "passive Perception 14",
      "languages": "-",
      "challengeRating": "11 (7,200 XP)",
      "keyAbilities": "STR +9, DEX +0, CON +5, INT -4, WIS +0, CHA -1",
      "role": "Brute"
    },
    "savingThrows": {
        "dex": 4,
        "con": 9,
        "wis": 4,
        "cha": 3
    },
    "abilitiesAndTraits": "**Keen Sight.** The roc has advantage on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Multiattack.** The roc makes two attacks: one with its beak and one with its talons.\n\n**Beak.** *Melee Weapon Attack:* +13 to hit, reach 10 ft., one target. *Hit:* 27 (4d8+9) piercing damage.\n\n**Talons.** *Melee Weapon Attack:* +13 to hit, reach 5 ft., one target. *Hit:* 23 (4d6+9) slashing damage, and the target is grappled (escape DC 19). Until this grapple ends, the target is restrained, and the roc can't use its talons on another target.",
    "roleplayingAndTactics": "A roc is a territorial predator that attacks anything that enters its domain. It will use its incredible size and strength to snatch prey from the ground or sea, carrying it back to its nest to be devoured. It is a simple but overwhelming combatant."
  },
  "statblock": "### Roc\n\n*Gargantuan monstrosity, unaligned*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 248 (16d20+80)\n\n- **Speed** 20 ft., fly 120 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 28 (+9) | 10 (+0) | 20 (+5) | 3 (-4) | 10 (+0) | 9 (-1) |\n\n___\n\n- **Saving Throws** Dex +4, Con +9, Wis +4, Cha +3\n- **Skills** Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 11 (7,200 XP)\n\n___\n\n***Keen Sight.*** The roc has advantage on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Multiattack.*** The roc makes two attacks: one with its beak and one with its talons.\n\n***Beak.*** *Melee Weapon Attack:* +13 to hit, reach 10 ft., one target. *Hit:* 27 (4d8+9) piercing damage.\n\n***Talons.*** *Melee Weapon Attack:* +13 to hit, reach 5 ft., one target. *Hit:* 23 (4d6+9) slashing damage, and the target is grappled (escape DC 19). Until this grapple ends, the target is restrained, and the roc can't use its talons on another target."
};

export default SRD_MONSTER_ROC;
