
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_COPPER_DRAGON_WYRMLING_METALLIC: SavedMonster = {
  "id": "srd-copper-dragon-wyrmling-metallic",
  "name": "Copper Dragon Wyrmling (Metallic)",
  "description": "Young copper dragons are known for their love of jokes, riddles, and pranks. Their scales are the color of new pennies, and they have a mischievous glint in their eyes.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "chaotic good",
      "armorClass": "16 (natural armor)",
      "hitPoints": "22 (4d8+4)",
      "speed": "30 ft., climb 30 ft., fly 60 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +1, INT +2, WIS +0, CHA +1",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 3,
      "con": 3,
      "wis": 2,
      "cha": 3
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage.\n\n**Breath Weapons (Recharge 5-6).** The dragon uses one of the following breath weapons:\n- **Acid Breath.** The dragon exhales acid in a 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 18 (4d8) acid damage on a failed save, or half as much damage on a successful one.\n- **Slowing Breath.** The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw. On a failed save, the creature can't use a reaction, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute.",
    "roleplayingAndTactics": "A copper wyrmling is not aggressive and will try to engage creatures in a battle of wits rather than a physical fight. If threatened, it uses its Slowing Breath to make foes clumsy and its climb speed to gain an advantageous position before using its Acid Breath. It is a prankster at heart."
  },
  "statblock": "### Copper Dragon Wyrmling (Metallic)\n\n*Medium dragon, chaotic good*\n\n___\n\n- **Armor Class** 16 (natural armor)\n\n- **Hit Points** 22 (4d8+4)\n\n- **Speed** 30 ft., climb 30 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 12 (+1) | 13 (+1) | 14 (+2) | 11 (+0) | 13 (+1) |\n\n___\n\n- **Saving Throws** Dex +3, Con +3, Wis +2, Cha +3\n- **Skills** Perception +4, Stealth +3\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 1 (200 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10+2) piercing damage.\n\n***Breath Weapons (Recharge 5-6).*** The dragon uses one of the following breath weapons:\n- **Acid Breath.** The dragon exhales acid in a 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 18 (4d8) acid damage on a failed save, or half as much damage on a successful one.\n- **Slowing Breath.** The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw. On a failed save, the creature can't use a reaction, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute."
};

export default SRD_MONSTER_COPPER_DRAGON_WYRMLING_METALLIC;