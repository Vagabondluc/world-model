
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WEREBOAR_LYCANTHROPE: SavedMonster = {
  "id": "srd-wereboar-lycanthrope",
  "name": "Wereboar (Lycanthrope)",
  "description": "Wereboars are ill-tempered and brutish lycanthropes who live in small, territorial family groups. They are greedy and aggressive, often acting as thugs or bandits.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (human, shapechanger)",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "10 in humanoid form, 11 (natural armor) in boar or hybrid form",
      "hitPoints": "78 (12d8+24)",
      "speed": "30 ft. (40 ft. in boar form)",
      "senses": "passive Perception 12",
      "languages": "Common (can't speak in boar form)",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +2, INT +0, WIS +0, CHA -1",
      "role": "Brute"
    },
    "savingThrows": {
      "str": 5,
      "con": 4
    },
    "abilitiesAndTraits": "**Shapechanger.** The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n**Charge (Boar or Hybrid Form Only).** If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.\n\n**Relentless (Recharges after a Short or Long Rest).** If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
    "actions": "**Multiattack (Humanoid or Hybrid Form Only).** The wereboar makes two attacks, only one of which can be with its tusks.\n\n**Maul (Humanoid or Hybrid Form Only).** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) bludgeoning damage.\n\n**Tusks (Boar or Hybrid Form Only).** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with wereboar lycanthropy.",
    "roleplayingAndTactics": "A wereboar will charge into combat in its hybrid or boar form, using its tusks to gore and knock down opponents. Its relentless nature makes it a tough opponent to put down for good."
  },
  "statblock": "### Wereboar (Lycanthrope)\n\n*Medium humanoid (human, shapechanger), neutral evil*\n\n___\n\n- **Armor Class** 10 in humanoid form, 11 (natural armor) in boar or hybrid form\n\n- **Hit Points** 78 (12d8+24)\n\n- **Speed** 30 ft. (40 ft. in boar form)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 10 (+0) | 15 (+2) | 10 (+0) | 11 (+0) | 8 (-1) |\n\n___\n\n- **Saving Throws** Str +5, Con +4\n- **Skills** Perception +2\n\n- **Senses** passive Perception 12\n\n- **Languages** Common (can't speak in boar form)\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Shapechanger.*** The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n***Charge (Boar or Hybrid Form Only).*** If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.\n\n***Relentless (Recharges after a Short or Long Rest).*** If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.\n\n### Actions\n***Multiattack (Humanoid or Hybrid Form Only).*** The wereboar makes two attacks, only one of which can be with its tusks.\n\n***Maul (Humanoid or Hybrid Form Only).*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) bludgeoning damage."
};

export default SRD_MONSTER_WEREBOAR_LYCANTHROPE;
