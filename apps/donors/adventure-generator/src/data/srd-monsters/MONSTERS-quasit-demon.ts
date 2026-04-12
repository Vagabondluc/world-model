
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_QUASIT_DEMON: SavedMonster = {
  "id": "srd-quasit-demon",
  "name": "Quasit (Demon)",
  "description": "Quasits are lowly demons that serve as familiars to evil spellcasters. In their true form, they are small, green-skinned humanoids with tiny horns and wings, but they can change shape into common animals.",
  "profile": {
    "table": {
      "creatureType": "Tiny fiend (demon, shapechanger)",
      "size": "Tiny",
      "alignment": "chaotic evil",
      "armorClass": "13",
      "hitPoints": "7 (3d4)",
      "speed": "40 ft.",
      "senses": "darkvision 120 ft., passive Perception 10",
      "languages": "Abyssal, Common",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR -3, DEX +3, CON +0, INT -2, WIS +0, CHA +0",
      "role": "Scout"
    },
    "savingThrows": {
        "dex": 5
    },
    "abilitiesAndTraits": "**Shapechanger.** The quasit can use its action to polymorph into a beast form that resembles a bat (speed 10 ft. fly 40 ft.), a centipede (40 ft., climb 40 ft.), or a toad (40 ft., swim 40 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n**Magic Resistance.** The quasit has advantage on saving throws against spells and other magical effects.",
    "actions": "**Claws (Bite in Beast Form).** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage, and the target must succeed on a DC 10 Constitution saving throw or take 5 (2d4) poison damage and become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n\n**Scare (1/Day).** One creature of the quasit's choice within 20 feet of it must succeed on a DC 10 Wisdom saving throw or be frightened for 1 minute. The target can repeat the saving throw at the end of each of its turns, with disadvantage if the quasit is within line of sight, ending the effect on itself on a success.\n\n**Invisibility.** The quasit magically turns invisible until it attacks or uses Scare, or until its concentration ends (as if concentrating on a spell). Any equipment the quasit wears or carries is invisible with it.",
    "roleplayingAndTactics": "A quasit is a cowardly creature that relies on its invisibility and shapechanging to spy on its master's enemies. In a fight, it will deliver a venomous claw attack and then turn invisible to escape. They are spiteful and enjoy causing minor chaos."
  },
  "statblock": "### Quasit (Demon)\n\n*Tiny fiend (demon, shapechanger), chaotic evil*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 7 (3d4)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 5 (-3) | 17 (+3) | 10 (+0) | 7 (-2) | 10 (+0) | 10 (+0) |\n\n___\n\n- **Saving Throws** Dex +5\n- **Skills** Stealth +5\n\n- **Senses** darkvision 120 ft., passive Perception 10\n\n- **Languages** Abyssal, Common\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Shapechanger.*** The quasit can use its action to polymorph into a beast form that resembles a bat (speed 10 ft. fly 40 ft.), a centipede (40 ft., climb 40 ft.), or a toad (40 ft., swim 40 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n***Magic Resistance.*** The quasit has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Claws (Bite in Beast Form).*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d4+3) piercing damage, and the target must succeed on a DC 10 Constitution saving throw or take 5 (2d4) poison damage and become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n\n***Scare (1/Day).*** One creature of the quasit's choice within 20 feet of it must succeed on a DC 10 Wisdom saving throw or be frightened for 1 minute. The target can repeat the saving throw at the end of each of its turns, with disadvantage if the quasit is within line of sight, ending the effect on itself on a success.\n\n***Invisibility.*** The quasit magically turns invisible until it attacks or uses Scare, or until its concentration ends (as if concentrating on a spell). Any equipment the quasit wears or carries is invisible with it."
};

export default SRD_MONSTER_QUASIT_DEMON;
