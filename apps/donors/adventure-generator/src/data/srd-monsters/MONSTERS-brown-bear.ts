import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BROWN_BEAR: SavedMonster = {
  "id": "srd-brown-bear",
  "name": "Brown Bear",
  "description": "A large, powerful omnivore common to forests and mountains. Brown bears are territorial and highly protective of their young.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "11 (natural armor)",
      "hitPoints": "34 (4d10+12)",
      "speed": "40 ft., climb 30 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT -4, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Keen Smell.** The bear has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Multiattack.** The bear makes two attacks: one with its bite and one with its claws.\n\n**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) piercing damage.",
    "roleplayingAndTactics": "A brown bear will try to intimidate threats by standing on its hind legs and roaring. If pressed, it attacks with a furious combination of bites and claws. It is a straightforward combatant, focusing on the nearest threat until it is neutralized."
  },
  "statblock": "### Brown Bear\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 34 (4d10+12)\n\n- **Speed** 40 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 10 (+0) | 16 (+3) | 2 (-4) | 13 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Keen Smell.*** The bear has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Multiattack.*** The bear makes two attacks: one with its bite and one with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) piercing damage."
};

export default SRD_MONSTER_BROWN_BEAR;