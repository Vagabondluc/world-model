import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BONE_DEVIL: SavedMonster = {
  "id": "srd-bone-devil",
  "name": "Bone Devil",
  "description": "This fiend appears as a desiccated, husk-like humanoid with a bony scorpion's tail. Bone devils serve as the cruel taskmasters of the Nine Hells.",
  "profile": {
    "table": {
      "creatureType": "Large fiend (devil)",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "19 (natural armor)",
      "hitPoints": "142 (15d10+60)",
      "speed": "40 ft., fly 40 ft.",
      "senses": "darkvision 120 ft., passive Perception 12",
      "languages": "Infernal, telepathy 120 ft.",
      "challengeRating": "9 (5,000 XP)",
      "keyAbilities": "STR +4, DEX +3, CON +4, INT +1, WIS +2, CHA +3",
      "role": "Controller"
    },
    "savingThrows": {
      "int": 5,
      "wis": 6,
      "cha": 7
    },
    "abilitiesAndTraits": "**Devil's Sight.** Magical darkness doesn't impede the devil's darkvision.\n\n**Magic Resistance.** The devil has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The devil makes three attacks: two with its claws and one with its sting.\n\n**Claw.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 8 (1d8+4) slashing damage.\n\n**Sting.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 13 (2d8+4) piercing damage plus 17 (5d6) poison damage. The target must succeed on a DC 14 Constitution saving throw or become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "roleplayingAndTactics": "Bone devils are sadistic combatants. They use their flight and reach to stay away from heavily armored fighters, stinging spellcasters and archers with their poison tail. They take grim pleasure in watching their poison slowly cripple their enemies."
  },
  "statblock": "### Bone Devil\n\n*Large fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 142 (15d10+60)\n\n- **Speed** 40 ft., fly 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 16 (+3) | 18 (+4) | 13 (+1) | 14 (+2) | 16 (+3) |\n\n___\n\n- **Saving Throws** Int +5, Wis +6, Cha +7\n- **Skills** Deception +7, Insight +6\n\n- **Senses** darkvision 120 ft., passive Perception 12\n\n- **Languages** Infernal, telepathy 120 ft.\n\n- **Challenge** 9 (5,000 XP)\n\n___\n\n***Devil's Sight.*** Magical darkness doesn't impede the devil's darkvision.\n\n***Magic Resistance.*** The devil has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The devil makes three attacks: two with its claws and one with its sting.\n\n***Claw.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 8 (1d8+4) slashing damage.\n\n***Sting.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 13 (2d8+4) piercing damage plus 17 (5d6) poison damage. The target must succeed on a DC 14 Constitution saving throw or become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
};

export default SRD_MONSTER_BONE_DEVIL;