
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_RUST_MONSTER: SavedMonster = {
  "id": "srd-rust-monster",
  "name": "Rust Monster",
  "description": "A strange, insect-like creature with two long, feathery antennae. Rust monsters do not eat flesh, but are driven by an insatiable hunger for ferrous metals, which they can turn to rust with a single touch.",
  "profile": {
    "table": {
      "creatureType": "Medium monstrosity",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "14 (natural armor)",
      "hitPoints": "27 (5d8+5)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +1, DEX +1, CON +1, INT -4, WIS +1, CHA -2",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Iron Scent.** The rust monster can pinpoint, by scent, the location of ferrous metal within 30 feet of it.\n\n**Rust Metal.** Any nonmagical weapon made of metal that hits the rust monster corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the rust monster is destroyed after dealing damage.",
    "actions": "**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8+1) piercing damage.\n\n**Antennae.** The rust monster corrodes a nonmagical ferrous metal object it can see within 5 feet of it. If the object isn't being worn or carried, the touch destroys a 1-foot cube of it. If the object is being worn or carried by a creature, the creature can make a DC 11 Dexterity saving throw to avoid the rust monster's touch.",
    "roleplayingAndTactics": "Rust monsters are not typically aggressive towards creatures, but will ferociously attack any creature carrying or wearing metal. They will use their antennae to corrode weapons and armor, often ignoring the creature itself in favor of its gear. This makes them a terrifying foe for heavily armed adventurers."
  },
  "statblock": "### Rust Monster\n\n*Medium monstrosity, unaligned*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 27 (5d8+5)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 12 (+1) | 13 (+1) | 2 (-4) | 13 (+1) | 6 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Iron Scent.*** The rust monster can pinpoint, by scent, the location of ferrous metal within 30 feet of it.\n\n***Rust Metal.*** Any nonmagical weapon made of metal that hits the rust monster corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the rust monster is destroyed after dealing damage.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8+1) piercing damage.\n\n***Antennae.*** The rust monster corrodes a nonmagical ferrous metal object it can see within 5 feet of it. If the object isn't being worn or carried, the touch destroys a 1-foot cube of it. If the object is being worn or carried by a creature, the creature can make a DC 11 Dexterity saving throw to avoid the rust monster's touch."
};

export default SRD_MONSTER_RUST_MONSTER;
