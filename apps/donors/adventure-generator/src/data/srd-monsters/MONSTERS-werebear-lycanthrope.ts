
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WEREBEAR_LYCANTHROPE: SavedMonster = {
  "id": "srd-werebear-lycanthrope",
  "name": "Werebear (Lycanthrope)",
  "description": "Werebears are powerful, reclusive lycanthropes who are often guardians of the forest. They are generally good-natured but have a fierce temper when provoked.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (human, shapechanger)",
      "size": "Medium",
      "alignment": "neutral good",
      "armorClass": "10 in humanoid form, 11 (natural armor) in bear and hybrid form",
      "hitPoints": "135 (18d8+54)",
      "speed": "30 ft. (40 ft., climb 30 ft. in bear or hybrid form)",
      "senses": "passive Perception 17",
      "languages": "Common (can't speak in bear form)",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT +0, WIS +1, CHA +1",
      "role": "Brute"
    },
    "savingThrows": {
      "str": 7,
      "con": 6
    },
    "abilitiesAndTraits": "**Shapechanger.** The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n**Keen Smell.** The werebear has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Multiattack.** In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid.\n\n**Bite (Bear or Hybrid Form Only).** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 15 (2d10+4) piercing damage. If the target is a humanoid, it must succeed on a DC 14 Constitution saving throw or be cursed with werebear lycanthropy.\n\n**Claw (Bear or Hybrid Form Only).** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage.\n\n**Greataxe (Humanoid or Hybrid Form Only).** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 10 (1d12+4) slashing damage.",
    "roleplayingAndTactics": "A werebear will try to avoid combat, but if forced to fight, it will transform into its massive bear or hybrid form. It is a powerful brawler, using its claws and bite to devastating effect."
  },
  "statblock": "### Werebear (Lycanthrope)\n\n*Medium humanoid (human, shapechanger), neutral good*\n\n___\n\n- **Armor Class** 10 in humanoid form, 11 (natural armor) in bear and hybrid form\n\n- **Hit Points** 135 (18d8+54)\n\n- **Speed** 30 ft. (40 ft., climb 30 ft. in bear or hybrid form)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 10 (+0) | 17 (+3) | 11 (+0) | 12 (+1) | 12 (+1) |\n\n___\n\n- **Saving Throws** Str +7, Con +6\n- **Skills** Perception +7\n\n- **Senses** passive Perception 17\n\n- **Languages** Common (can't speak in bear form)\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Shapechanger.*** The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n***Keen Smell.*** The werebear has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Multiattack.*** In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid.\n\n***Bite (Bear or Hybrid Form Only).*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 15 (2d10+4) piercing damage. If the target is a humanoid, it must succeed on a DC 14 Constitution saving throw or be cursed with werebear lycanthropy.\n\n***Claw (Bear or Hybrid Form Only).*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage."
};

export default SRD_MONSTER_WEREBEAR_LYCANTHROPE;
