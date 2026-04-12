import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CHAIN_DEVIL: SavedMonster = {
  "id": "srd-chain-devil",
  "name": "Chain Devil",
  "description": "This devil, also known as a kyton, is draped in animated, razor-sharp chains that are extensions of its own body. It is a living instrument of torture, serving as jailers and tormentors in the Nine Hells.",
  "profile": {
    "table": {
      "creatureType": "Medium fiend (devil)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "16 (natural armor)",
      "hitPoints": "85 (10d8+40)",
      "speed": "30 ft.",
      "senses": "darkvision 120 ft., passive Perception 11",
      "languages": "Infernal, telepathy 120 ft.",
      "challengeRating": "8 (3,900 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +4, INT +0, WIS +1, CHA +2",
      "role": "Controller"
    },
    "savingThrows": {
      "con": 7,
      "wis": 4,
      "cha": 5
    },
    "abilitiesAndTraits": "**Devil's Sight.** Magical darkness doesn't impede the devil's darkvision.\n\n**Magic Resistance.** The devil has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The devil makes two attacks with its chains.\n\n**Chain.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 11 (2d6+4) slashing damage. The target is grappled (escape DC 14) if the devil isn't already grappling a creature. Until this grapple ends, the target is restrained and takes 7 (2d6) piercing damage at the start of each of its turns.\n\n**Animate Chains (Recharges after a Short or Long Rest).** Up to four chains the devil can see within 60 feet of it magically sprout razor-edged barbs and animate under the devil's control, provided that the chains aren't being worn or carried.",
    "roleplayingAndTactics": "Chain devils are sadistic and patient. They enjoy the sounds of suffering. In combat, they use their chains to grapple and restrain victims from a distance, slowly reeling them in. Their Animate Chains ability allows them to control the battlefield, creating a deadly web of slashing metal."
  },
  "statblock": "### Chain Devil\n\n*Medium fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 16 (natural armor)\n\n- **Hit Points** 85 (10d8+40)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 15 (+2) | 18 (+4) | 11 (+0) | 12 (+1) | 14 (+2) |\n\n___\n\n- **Saving Throws** Con +7, Wis +4, Cha +5\n- **Senses** darkvision 120 ft., passive Perception 11\n\n- **Languages** Infernal, telepathy 120 ft.\n\n- **Challenge** 8 (3,900 XP)\n\n___\n\n***Devil's Sight.*** Magical darkness doesn't impede the devil's darkvision.\n\n***Magic Resistance.*** The devil has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The devil makes two attacks with its chains.\n\n***Chain.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 11 (2d6+4) slashing damage. The target is grappled (escape DC 14) if the devil isn't already grappling a creature. Until this grapple ends, the target is restrained and takes 7 (2d6) piercing damage at the start of each of its turns.\n\n***Animate Chains (Recharges after a Short or Long Rest).*** Up to four chains the devil can see within 60 feet of it magically sprout razor-edged barbs and animate under the devil's control, provided that the chains aren't being worn or carried."
};

export default SRD_MONSTER_CHAIN_DEVIL;