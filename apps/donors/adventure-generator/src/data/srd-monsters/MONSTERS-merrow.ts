import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MERROW: SavedMonster = {
  "id": "srd-merrow",
  "name": "Merrow",
  "description": "Merrow are monstrous, aquatic ogres, twisted by demonic power. They are brutish underwater bullies who prey on merfolk and coastal settlements.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "13 (natural armor)",
      "hitPoints": "45 (6d10+12)",
      "speed": "10 ft., swim 40 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Abyssal, Aquan",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +2, INT -1, WIS +0, CHA -1",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Amphibious.** The merrow can breathe air and water.",
    "actions": "**Multiattack.** The merrow makes two attacks: one with its bite and one with its claws or harpoon.\n\n**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (2d4+4) slashing damage.\n\n**Harpoon.** *Melee or Ranged Weapon Attack:* +6 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 11 (2d6+4) piercing damage. If the target is a Large or smaller creature, it must succeed on a Strength contest against the merrow or be pulled up to 20 feet toward the merrow.",
    "roleplayingAndTactics": "Merrow are straightforward and brutal fighters. They use their harpoons to drag victims into the water, where they have the advantage. They are not particularly intelligent and will attack the nearest target with savage fury."
  },
  "statblock": "### Merrow\n\n*Large monstrosity, chaotic evil*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 45 (6d10+12)\n\n- **Speed** 10 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 10 (+0) | 15 (+2) | 8 (-1) | 10 (+0) | 9 (-1) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Abyssal, Aquan\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Amphibious.*** The merrow can breathe air and water.\n\n### Actions\n***Multiattack.*** The merrow makes two attacks: one with its bite and one with its claws or harpoon.\n\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) piercing damage.\n\n***Harpoon.*** *Melee or Ranged Weapon Attack:* +6 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 11 (2d6+4) piercing damage. If the target is a Large or smaller creature, it must succeed on a Strength contest against the merrow or be pulled up to 20 feet toward the merrow."
};

export default SRD_MONSTER_MERROW;