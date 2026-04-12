import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MIMIC: SavedMonster = {
  "id": "srd-mimic",
  "name": "Mimic",
  "description": "A notorious dungeon predator, the mimic can alter its shape to look like an inanimate object, most commonly a treasure chest. It waits patiently for a greedy creature to touch it before revealing its true, amorphous form.",
  "profile": {
    "table": {
      "creatureType": "Medium monstrosity (shapechanger)",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "12 (natural armor)",
      "hitPoints": "58 (9d8+18)",
      "speed": "15 ft.",
      "senses": "darkvision 60 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +2, INT -3, WIS +1, CHA -1",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Shapechanger.** The mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n**Adhesive (Object Form Only).** The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled by it (escape DC 13). Ability checks made to escape this grapple have disadvantage.\n\n**False Appearance (Object Form Only).** While the mimic remains motionless, it is indistinguishable from an ordinary object.\n\n**Grappler.** The mimic has advantage on attack rolls against any creature grappled by it.",
    "actions": "**Pseudopod.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) bludgeoning damage. If the mimic is in object form, the target is subjected to its Adhesive trait.\n\n**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) piercing damage.",
    "roleplayingAndTactics": "The mimic is the ultimate ambush predator. It relies entirely on its disguise to lure prey. Once a creature touches it, the mimic's adhesive surface grapples them, and it begins to batter them with its pseudopods. It is not particularly intelligent and will fight to the death to consume its meal."
  },
  "statblock": "### Mimic\n\n*Medium monstrosity (shapechanger), neutral*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 58 (9d8+18)\n\n- **Speed** 15 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 12 (+1) | 15 (+2) | 5 (-3) | 13 (+1) | 8 (-1) |\n\n___\n\n- **Skills** Stealth +5\n\n- **Senses** darkvision 60 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Shapechanger.*** The mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n***Adhesive (Object Form Only).*** The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled by it (escape DC 13). Ability checks made to escape this grapple have disadvantage.\n\n***False Appearance (Object Form Only).*** While the mimic remains motionless, it is indistinguishable from an ordinary object.\n\n***Grappler.*** The mimic has advantage on attack rolls against any creature grappled by it.\n\n### Actions\n***Pseudopod.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) bludgeoning damage. If the mimic is in object form, the target is subjected to its Adhesive trait.\n\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) piercing damage."
};

export default SRD_MONSTER_MIMIC;