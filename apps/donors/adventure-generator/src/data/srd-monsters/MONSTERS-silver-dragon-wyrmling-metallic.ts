
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SILVER_DRAGON_WYRMLING_METALLIC: SavedMonster = {
  "id": "srd-silver-dragon-wyrmling-metallic",
  "name": "Silver Dragon Wyrmling (Metallic)",
  "description": "Young silver dragons are curious and friendly, with a deep love for humanoid races. They often live among them in disguise, offering aid and counsel.",
  "profile": {
    "table": {
      "creatureType": "Medium dragon",
      "size": "Medium",
      "alignment": "lawful good",
      "armorClass": "17 (natural armor)",
      "hitPoints": "45 (6d8+18)",
      "speed": "30 ft., fly 60 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
      "languages": "Draconic",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT +1, WIS +0, CHA +2",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 2,
      "con": 5,
      "wis": 2,
      "cha": 4
    },
    "abilitiesAndTraits": "**Immunity to Cold.** Silver dragons are immune to cold damage.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (1d10+4) piercing damage.\n\n**Breath Weapons (Recharge 5-6).** The dragon uses one of the following breath weapons.\n- **Cold Breath.** The dragon exhales an icy blast in a 15-foot cone. Each creature in that area must make a DC 13 Constitution saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one.\n- **Paralyzing Breath.** The dragon exhales paralyzing gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "roleplayingAndTactics": "A silver dragon wyrmling is playful and good-natured. It will avoid combat if possible, but if forced to fight, it uses its two breath weapons tactically: Paralyzing Breath to incapacitate a foe, and Cold Breath to damage a group. It will always prioritize protecting the innocent."
  },
  "statblock": "### Silver Dragon Wyrmling (Metallic)\n\n*Medium dragon, lawful good*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 45 (6d8+18)\n\n- **Speed** 30 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 10 (+0) | 17 (+3) | 12 (+1) | 11 (+0) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +2, Con +5, Wis +2, Cha +4\n- **Skills** Perception +4, Stealth +2\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 14\n\n- **Languages** Draconic\n\n- **Challenge** 2 (450 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (1d10+4) piercing damage.\n\n***Breath Weapons (Recharge 5-6).*** The dragon uses one of the following breath weapons: Cold Breath or Paralyzing Breath."
};

export default SRD_MONSTER_SILVER_DRAGON_WYRMLING_METALLIC;