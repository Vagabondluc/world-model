import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ETTIN: SavedMonster = {
  "id": "srd-ettin",
  "name": "Ettin",
  "description": "An ettin is a foul-tempered, two-headed giant. The two heads are separate personalities, constantly arguing with each other, but they cooperate in battle to become a whirlwind of destruction.",
  "profile": {
    "table": {
      "creatureType": "Large giant",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "12 (natural armor)",
      "hitPoints": "85 (10d10+30)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "Giant, Orc",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +5, DEX -1, CON +3, INT -2, WIS +0, CHA -1",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Two Heads.** The ettin has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious.\n\n**Wakeful.** When one of the ettin's heads is asleep, its other head is awake.",
    "actions": "**Multiattack.** The ettin makes two attacks: one with its battleaxe and one with its morningstar.\n\n**Battleaxe.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 14 (2d8+5) slashing damage.",
    "roleplayingAndTactics": "An ettin is a straightforward and brutal combatant. It wades into melee, swinging its two weapons at the nearest targets. Its two heads make it difficult to surprise or disable with mind-affecting spells. They are dim-witted and can sometimes be tricked or distracted by clever opponents."
  },
  "statblock": "### Ettin\n\n*Large giant, chaotic evil*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 85 (10d10+30)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 21 (+5) | 8 (-1) | 17 (+3) | 6 (-2) | 10 (+0) | 8 (-1) |\n\n___\n\n- **Skills** Perception +4\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** Giant, Orc\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Two Heads.*** The ettin has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious.\n\n***Wakeful.*** When one of the ettin's heads is asleep, its other head is awake.\n\n### Actions\n***Multiattack.*** The ettin makes two attacks: one with its battleaxe and one with its morningstar.\n\n***Battleaxe.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 14 (2d8+5) slashing damage."
};

export default SRD_MONSTER_ETTIN;