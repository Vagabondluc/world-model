
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DRAGON_TURTLE: SavedMonster = {
  "id": "srd-dragon-turtle",
  "name": "Dragon Turtle",
  "description": "A massive, shelled reptile with the head and breath of a dragon. Dragon turtles are among the most powerful creatures of the sea, often demanding tribute from sailors who cross their territory.",
  "profile": {
    "table": {
      "creatureType": "Gargantuan dragon",
      "size": "Gargantuan",
      "alignment": "neutral",
      "armorClass": "20 (natural armor)",
      "hitPoints": "341 (22d20+110)",
      "speed": "20 ft., swim 40 ft.",
      "senses": "darkvision 120 ft., passive Perception 11",
      "languages": "Aquan, Draconic",
      "challengeRating": "17 (18,000 XP)",
      "keyAbilities": "STR +7, DEX +0, CON +5, INT +0, WIS +1, CHA +1",
      "role": "Solo"
    },
    "savingThrows": {
      "dex": 6,
      "con": 11,
      "wis": 7
    },
    "abilitiesAndTraits": "**Amphibious.** The dragon turtle can breathe air and water.",
    "actions": "**Multiattack.** The dragon turtle makes three attacks: one with its bite and two with its claws. It can make one tail attack in place of its two claw attacks.\n\n**Bite.** *Melee Weapon Attack:* +13 to hit, reach 15 ft., one target. *Hit:* 26 (3d12+7) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +13 to hit, reach 10 ft., one target. *Hit:* 16 (2d8+7) slashing damage.\n\n**Tail.** *Melee Weapon Attack:* +13 to hit, reach 15 ft., one target. *Hit:* 26 (3d12+7) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be pushed up to 10 feet away from the dragon turtle and knocked prone.\n\n**Steam Breath (Recharge 5-6).** The dragon turtle exhales scalding steam in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 52 (15d6) fire damage on a failed save, or half as much damage on a successful one. Being underwater doesn't grant resistance against this damage.",
    "roleplayingAndTactics": "Dragon turtles are greedy and territorial. They will often capsize ships to claim their cargo as tribute. In combat, they open with their powerful Steam Breath, then use their bite and claws to tear apart vessels and creatures alike. Their tail is a formidable weapon for knocking enemies off balance."
  },
  "statblock": "### Dragon Turtle\n\n*Gargantuan dragon, neutral*\n\n___\n\n- **Armor Class** 20 (natural armor)\n\n- **Hit Points** 341 (22d20+110)\n\n- **Speed** 20 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 25 (+7) | 10 (+0) | 20 (+5) | 10 (+0) | 12 (+1) | 12 (+1) |\n\n___\n\n- **Saving Throws** Dex +6, Con +11, Wis +7\n- **Senses** darkvision 120 ft., passive Perception 11\n\n- **Languages** Aquan, Draconic\n\n- **Challenge** 17 (18,000 XP)\n\n___\n\n***Amphibious.*** The dragon turtle can breathe air and water.\n\n### Actions\n***Multiattack.*** The dragon turtle makes three attacks: one with its bite and two with its claws. It can make one tail attack in place of its two claw attacks.\n\n***Bite.*** *Melee Weapon Attack:* +13 to hit, reach 15 ft., one target. *Hit:* 26 (3d12+7) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +13 to hit, reach 10 ft., one target. *Hit:* 16 (2d8+7) slashing damage.\n\n***Tail.*** *Melee Weapon Attack:* +13 to hit, reach 15 ft., one target. *Hit:* 26 (3d12+7) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be pushed up to 10 feet away from the dragon turtle and knocked prone."
};

export default SRD_MONSTER_DRAGON_TURTLE;