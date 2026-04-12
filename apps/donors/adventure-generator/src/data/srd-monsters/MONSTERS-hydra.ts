

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HYDRA: SavedMonster = {
  "id": "srd-hydra",
  "name": "Hydra",
  "description": "A hydra is a reptilian horror with multiple heads. For each head severed, two more grow in its place, making it a terrifyingly resilient foe unless fire is used to cauterize the stumps.",
  "profile": {
    "table": {
      "creatureType": "Huge monstrosity",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "15 (natural armor)",
      "hitPoints": "172 (15d12+75)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 16",
      "languages": "-",
      "challengeRating": "8 (3,900 XP)",
      "keyAbilities": "STR +5, DEX +1, CON +5, INT -4, WIS +0, CHA -2",
      "role": "Brute"
    },
    "savingThrows": {
      "wis": 3
    },
    "abilitiesAndTraits": "**Hold Breath.** The hydra can hold its breath for 1 hour.\n\n**Multiple Heads.** The hydra has five heads. While it has more than one head, the hydra has advantage on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious. Whenever the hydra takes 25 or more damage in a single turn, one of its heads dies. If all its heads die, the hydra dies. At the end of its turn, it grows two heads for each of its heads that died since its last turn, unless it has taken fire damage since its last turn. The hydra regains 10 hit points for each head regrown in this way.\n\n**Reactive Heads.** For each head the hydra has beyond one, it gets an extra reaction that can be used only for opportunity attacks.\n\n**Wakeful.** While the hydra sleeps, at least one of its heads is awake.",
    "actions": "**Multiattack.** The hydra makes as many bite attacks as it has heads.\n\n**Bite.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 10 (1d10 + 5) piercing damage.",
    "roleplayingAndTactics": "A hydra is a ravenous beast that attacks with all of its heads at once. Its multiple heads give it many reactions for opportunity attacks, making it dangerous to move away from. It is a simple combatant, but its regenerative abilities and multi-attack make it a formidable challenge for any party."
  },
  "statblock": "### Hydra\n\n*Huge monstrosity, unaligned*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 172 (15d12+75)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 20 (+5) | 12 (+1) | 20 (+5) | 2 (-4) | 10 (+0) | 7 (-2) |\n\n___\n\n- **Saving Throws** Wis +3\n- **Skills** Perception +6\n\n- **Senses** darkvision 60 ft., passive Perception 16\n\n- **Languages** -\n\n- **Challenge** 8 (3,900 XP)\n\n___\n\n***Hold Breath.*** The hydra can hold its breath for 1 hour.\n\n***Multiple Heads.*** The hydra has five heads. While it has more than one head, the hydra has advantage on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious. Whenever the hydra takes 25 or more damage in a single turn, one of its heads dies. If all its heads die, the hydra dies. At the end of its turn, it grows two heads for each of its heads that died since its last turn, unless it has taken fire damage since its last turn. The hydra regains 10 hit points for each head regrown in this way.\n\n***Reactive Heads.*** For each head the hydra has beyond one, it gets an extra reaction that can be used only for opportunity attacks.\n\n***Wakeful.*** While the hydra sleeps, at least one of its heads is awake.\n\n### Actions\n***Multiattack.*** The hydra makes as many bite attacks as it has heads.\n\n***Bite.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 10 (1d10 + 5) piercing damage."
};

export default SRD_MONSTER_HYDRA;