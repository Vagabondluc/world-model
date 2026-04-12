import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ELEPHANT: SavedMonster = {
  "id": "srd-elephant",
  "name": "Elephant",
  "description": "These colossal, thick-skinned herbivores are known for their intelligence, long memories, and the powerful charge they can unleash when threatened.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "76 (8d12+24)",
      "speed": "40 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +6, DEX -1, CON +3, INT -4, WIS +0, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Trampling Charge.** If the elephant moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the elephant can make one stomp attack against it as a bonus action.",
    "actions": "**Gore.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 19 (3d8 + 6) piercing damage.\n\n**Stomp.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one prone creature. *Hit:* 22 (3d10 + 6) bludgeoning damage.",
    "roleplayingAndTactics": "Elephants are peaceful unless provoked or threatened. When they fight, they use their immense size and weight to crush opponents. They will charge to knock foes prone and then trample them."
  },
  "statblock": "### Elephant\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 76 (8d12+24)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 22 (+6) | 9 (-1) | 17 (+3) | 3 (-4) | 11 (+0) | 6 (-2) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Trampling Charge.*** If the elephant moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the elephant can make one stomp attack against it as a bonus action.\n\n### Actions\n***Gore.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 19 (3d8 + 6) piercing damage.\n\n***Stomp.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one prone creature. *Hit:* 22 (3d10 + 6) bludgeoning damage."
};

export default SRD_MONSTER_ELEPHANT;
