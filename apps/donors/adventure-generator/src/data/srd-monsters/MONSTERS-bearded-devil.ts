import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BEARDED_DEVIL: SavedMonster = {
  "id": "srd-bearded-devil",
  "name": "Bearded Devil",
  "description": "Rank-and-file soldiers of the Nine Hells, these devils fight with a saw-toothed glaive and a beard of writhing, venomous tendrils.",
  "profile": {
    "table": {
      "creatureType": "Medium fiend (devil)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "13 (natural armor)",
      "hitPoints": "52 (8d8+16)",
      "speed": "30 ft.",
      "senses": "darkvision 120 ft., passive Perception 10",
      "languages": "Infernal, telepathy 120 ft.",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +2, INT -1, WIS +0, CHA +0",
      "role": "Soldier"
    },
    "savingThrows": {
      "str": 5,
      "con": 4,
      "wis": 2
    },
    "abilitiesAndTraits": "**Devil's Sight.** Magical darkness doesn't impede the devil's darkvision.\n\n**Magic Resistance.** The devil has advantage on saving throws against spells and other magical effects.\n\n**Steadfast.** The devil can't be frightened while it can see an allied creature within 30 feet of it.",
    "actions": "**Multiattack.** The devil makes two attacks: one with its beard and one with its glaive.\n\n**Beard.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 6 (1d8+2) piercing damage, and the target must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute. While poisoned in this way, the target can't regain hit points. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n\n**Glaive.** *Melee Weapon Attack:* +5 to hit, reach 10 ft., one target. *Hit:* 8 (1d10+3) slashing damage. If the target is a creature other than an undead or a construct, it must succeed on a DC 12 Constitution saving throw or lose 5 (1d10) hit points at the start of each of its turns from an infernal wound. The wound also closes if the target receives magical healing.",
    "roleplayingAndTactics": "Bearded devils are shock troops that fight in disciplined formations. They use their glaives to attack from reach and their beards to inflict a lingering, healing-negating poison. They are steadfast and will fight to the death if a superior commands it."
  },
  "statblock": "### Bearded Devil\n\n*Medium fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 52 (8d8+16)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 15 (+2) | 15 (+2) | 9 (-1) | 11 (+0) | 11 (+0) |\n\n___\n\n- **Saving Throws** Str +5, Con +4, Wis +2\n- **Senses** darkvision 120 ft., passive Perception 10\n\n- **Languages** Infernal, telepathy 120 ft.\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Devil's Sight.*** Magical darkness doesn't impede the devil's darkvision.\n\n***Magic Resistance.*** The devil has advantage on saving throws against spells and other magical effects.\n\n***Steadfast.*** The devil can't be frightened while it can see an allied creature within 30 feet of it.\n\n### Actions\n***Multiattack.*** The devil makes two attacks: one with its beard and one with its glaive.\n\n***Beard.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 6 (1d8+2) piercing damage, and the target must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute. While poisoned in this way, the target can't regain hit points. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n\n***Glaive.*** *Melee Weapon Attack:* +5 to hit, reach 10 ft., one target. *Hit:* 8 (1d10+3) slashing damage. If the target is a creature other than an undead or a construct, it must succeed on a DC 12 Constitution saving throw or lose 5 (1d10) hit points at the start of each of its turns from an infernal wound. The wound also closes if the target receives magical healing."
};

export default SRD_MONSTER_BEARDED_DEVIL;