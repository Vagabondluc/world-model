
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WERETIGER_LYCANTHROPE: SavedMonster = {
  "id": "srd-weretiger-lycanthrope",
  "name": "Weretiger (Lycanthrope)",
  "description": "Weretigers are proud, solitary hunters. They are graceful and confident, with a predatory air. They are often found in jungles or remote forests.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (human, shapechanger)",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "12",
      "hitPoints": "120 (16d8+48)",
      "speed": "30 ft. (40 ft. in tiger form)",
      "senses": "darkvision 60 ft., passive Perception 15",
      "languages": "Common (can't speak in tiger form)",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +3, INT +0, WIS +1, CHA +0",
      "role": "Ambusher"
    },
    "savingThrows": {
      "dex": 4,
      "con": 5
    },
    "abilitiesAndTraits": "**Shapechanger.** The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n**Keen Hearing and Smell.** The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n**Pounce (Tiger or Hybrid Form Only).** If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action.",
    "actions": "**Multiattack (Humanoid or Hybrid Form Only).** In humanoid form, the weretiger makes two scimitar attacks or two longbow attacks. In hybrid form, it can attack like a humanoid or make two claw attacks.\n\n**Bite (Tiger or Hybrid Form Only).** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage. If the target is a humanoid, it must succeed on a DC 13 Constitution saving throw or be cursed with weretiger lycanthropy.\n\n**Claw (Tiger or Hybrid Form Only).** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) slashing damage.\n\n**Scimitar (Humanoid or Hybrid Form Only).** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage.\n\n**Longbow (Humanoid or Hybrid Form Only).** *Ranged Weapon Attack:* +4 to hit, range 150/600 ft., one target. *Hit:* 6 (1d8+2) piercing damage.",
    "roleplayingAndTactics": "A weretiger is a patient and stealthy hunter. It will stalk its prey before using its Pounce ability to gain the upper hand. They are confident in their abilities and will fight with a mix of feline grace and humanoid cunning."
  },
  "statblock": "### Weretiger (Lycanthrope)\n\n*Medium humanoid (human, shapechanger), neutral*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 120 (16d8+48)\n\n- **Speed** 30 ft. (40 ft. in tiger form)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 15 (+2) | 16 (+3) | 10 (+0) | 13 (+1) | 11 (+0) |\n\n___\n\n- **Saving Throws** Dex +4, Con +5\n- **Skills** Perception +5, Stealth +4\n\n- **Senses** darkvision 60 ft., passive Perception 15\n\n- **Languages** Common (can't speak in tiger form)\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Shapechanger.*** The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n***Keen Hearing and Smell.*** The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n***Pounce (Tiger or Hybrid Form Only).*** If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action.\n\n### Actions\n***Multiattack (Humanoid or Hybrid Form Only).*** In humanoid form, the weretiger makes two scimitar attacks or two longbow attacks. In hybrid form, it can attack like a humanoid or make two claw attacks.\n\n***Bite (Tiger or Hybrid Form Only).*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage. If the target is a humanoid, it must succeed on a DC 13 Constitution saving throw or be cursed with weretiger lycanthropy.\n\n***Claw (Tiger or Hybrid Form Only).*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) slashing damage.\n\n***Scimitar (Humanoid or Hybrid Form Only).*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage."
};

export default SRD_MONSTER_WERETIGER_LYCANTHROPE;
