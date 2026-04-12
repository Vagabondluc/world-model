import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BANDIT_CAPTAIN: SavedMonster = {
  "id": "srd-bandit-captain",
  "name": "Bandit Captain",
  "description": "It takes a strong personality, a sharp sword, and a reputation for cruelty to keep a gang of bandits in line. The bandit captain is a seasoned warrior and a ruthless leader.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any non-lawful alignment",
      "armorClass": "15 (studded leather)",
      "hitPoints": "65 (10d8 + 20)",
      "speed": "30 ft.",
      "senses": "passive Perception 10",
      "languages": "any two languages",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX +3, CON +2, INT +2, WIS +0, CHA +2",
      "role": "Leader"
    },
    "savingThrows": {
      "str": 4,
      "dex": 5,
      "wis": 2
    },
    "abilitiesAndTraits": "**Parry.** The captain adds 2 to its AC against one melee attack that would hit it. To do so, the captain must see the attacker and be wielding a melee weapon.",
    "actions": "**Multiattack.** The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers.\n\n**Scimitar.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6 + 3) slashing damage.\n\n**Dagger.** *Melee or Ranged Weapon Attack:* +5 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 5 (1d4 + 2) piercing damage.",
    "roleplayingAndTactics": "A bandit captain is a pragmatic fighter, directing their underlings to flank and harry opponents while they pick off weaker targets. They are not above using dirty tricks and will use their Parry ability to stay alive. If a fight is lost, a bandit captain will sacrifice their own crew to cover their escape."
  },
  "statblock": "### Bandit Captain\n\n*Medium humanoid (any race), any non-lawful alignment*\n\n___\n\n- **Armor Class** 15 (studded leather)\n\n- **Hit Points** 65 (10d8 + 20)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 16 (+3) | 14 (+2) | 14 (+2) | 11 (+0) | 14 (+2) |\n\n___\n\n- **Saving Throws** Str +4, Dex +5, Wis +2\n- **Skills** Athletics +4, Deception +4\n\n- **Senses** passive Perception 10\n\n- **Languages** any two languages\n\n- **Challenge** 2 (450 XP)\n\n___\n\n### Actions\n***Multiattack.*** The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers.\n\n***Scimitar.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6 + 3) slashing damage.\n\n***Dagger.*** *Melee or Ranged Weapon Attack:* +5 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 5 (1d4 + 2) piercing damage.\n\n***Parry.*** The captain adds 2 to its AC against one melee attack that would hit it. To do so, the captain must see the attacker and be wielding a melee weapon."
};

export default SRD_MONSTER_BANDIT_CAPTAIN;