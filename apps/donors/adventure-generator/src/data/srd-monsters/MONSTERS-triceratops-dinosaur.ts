
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_TRICERATOPS_DINOSAUR: SavedMonster = {
  "id": "srd-triceratops-dinosaur",
  "name": "Triceratops (Dinosaur)",
  "description": "A massive, three-horned herbivore, the triceratops is a living battering ram. Its bony frill protects it from predators, and its charge is a devastating force.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "95 (10d12+30)",
      "speed": "50 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +6, DEX -1, CON +3, INT -4, WIS +0, CHA -3",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Trampling Charge.** If the triceratops moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the triceratops can make one stomp attack against it as a bonus action.",
    "actions": "**Gore.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 24 (4d8+6) piercing damage.\n\n**Stomp.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one prone creature. *Hit:* 22 (3d10+6) bludgeoning damage.",
    "roleplayingAndTactics": "Triceratops are herd animals and are fiercely protective of their young. If threatened, they will form a defensive circle. An angered triceratops will use its Trampling Charge to gore and trample anything it perceives as a threat."
  },
  "statblock": "### Triceratops (Dinosaur)\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 95 (10d12+30)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 22 (+6) | 9 (-1) | 17 (+3) | 2 (-4) | 11 (+0) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Trampling Charge.*** If the triceratops moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the triceratops can make one stomp attack against it as a bonus action.\n\n### Actions\n***Gore.*** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 24 (4d8+6) piercing damage.\n\n***Stomp.*** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one prone creature. *Hit:* 22 (3d10+6) bludgeoning damage."
};

export default SRD_MONSTER_TRICERATOPS_DINOSAUR;