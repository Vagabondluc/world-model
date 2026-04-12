
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DARKMANTLE: SavedMonster = {
  "id": "srd-darkmantle",
  "name": "Darkmantle",
  "description": "This subterranean predator looks like a small manta ray, clinging to cave ceilings and dropping on unsuspecting prey to crush and suffocate them.",
  "profile": {
    "table": {
      "creatureType": "Small monstrosity",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "22 (5d6+5)",
      "speed": "10 ft., fly 30 ft.",
      "senses": "blindsight 60 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +1, INT -4, WIS +0, CHA -3",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Echolocation.** The darkmantle can't use its blindsight while deafened.\n\n**False Appearance.** While the darkmantle remains motionless, it is indistinguishable from a cave formation such as a stalactite or stalagmite.",
    "actions": "**Crush.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 6 (1d6+3) bludgeoning damage, and the darkmantle attaches to the target. If the target is Medium or smaller and the darkmantle has advantage on the attack roll, it attaches by engulfing the target's head, and the target is also blinded and unable to breathe while the darkmantle is attached in this way.\n\n**Darkness Aura (1/Day).** A 15-foot radius of magical darkness extends out from the darkmantle, moves with it, and spreads around corners. The darkness lasts as long as the darkmantle maintains concentration, up to 10 minutes (as if concentrating on a spell). Darkvision can't see through this darkness, and no natural light can illuminate it. If any of the darkness overlaps with an area of light created by a spell of 2nd level or lower, the spell that created the light is dispelled.",
    "roleplayingAndTactics": "Darkmantles are patient ambush predators. They drop from ceilings to engulf their prey's head, blinding and suffocating them. If facing multiple foes, they will use their Darkness Aura to create chaos and confusion before flying away into the shadows."
  },
  "statblock": "### Darkmantle\n\n*Small monstrosity, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 22 (5d6+5)\n\n- **Speed** 10 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 12 (+1) | 13 (+1) | 2 (-4) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Skills** Stealth +3\n\n- **Senses** blindsight 60 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Echolocation.*** The darkmantle can't use its blindsight while deafened.\n\n***False Appearance.*** While the darkmantle remains motionless, it is indistinguishable from a cave formation such as a stalactite or stalagmite.\n\n### Actions\n***Crush.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 6 (1d6+3) bludgeoning damage, and the darkmantle attaches to the target. If the target is Medium or smaller and the darkmantle has advantage on the attack roll, it attaches by engulfing the target's head, and the target is also blinded and unable to breathe while the darkmantle is attached in this way."
};

export default SRD_MONSTER_DARKMANTLE;