
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_VAMPIRE_SPAWN: SavedMonster = {
  "id": "srd-vampire-spawn",
  "name": "Vampire Spawn",
  "description": "Vampire spawn are the undead servants of a true vampire, created from humanoids slain by the vampire's draining kiss. They retain their cunning but are bound to their master's will.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "82 (11d8+33)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "the languages it knew in life",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +3, DEX +3, CON +3, INT +0, WIS +0, CHA +1",
      "role": "Ambusher"
    },
    "savingThrows": {
      "dex": 6,
      "wis": 3
    },
    "abilitiesAndTraits": "**Regeneration.** The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.\n\n**Spider Climb.** The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n**Vampire Weaknesses.** The vampire has the following flaws:\n- *Forbiddance.* The vampire can't enter a residence without an invitation from one of the occupants.\n- *Harmed by Running Water.* The vampire takes 20 acid damage if it ends its turn in running water.\n- *Stake to the Heart.* If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed.\n- *Sunlight Hypersensitivity.* The vampire takes 20 radiant damage when it starts its turn in sunlight.",
    "actions": "**Multiattack.** The vampire makes two attacks, only one of which can be a bite attack.\n\n**Claws.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one creature. *Hit:* 8 (2d4+3) slashing damage. Instead of dealing damage, the vampire can grapple the target (escape DC 13).\n\n**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. *Hit:* 6 (1d6+3) piercing damage plus 7 (2d6) necrotic damage.",
    "roleplayingAndTactics": "Vampire spawn are cunning predators that use their spider climb and regeneration to their advantage. They will work together to surround and overwhelm a target, seeking to drain its blood. They are utterly loyal to their master and will fight to the death to protect them."
  },
  "statblock": "### Vampire Spawn\n\n*Medium undead, neutral evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 82 (11d8+33)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 16 (+3) | 16 (+3) | 11 (+0) | 10 (+0) | 12 (+1) |\n\n___\n\n- **Saving Throws** Dex +6, Wis +3\n- **Skills** Perception +3, Stealth +6\n\n- **Senses** darkvision 60 ft., passive Perception 13\n\n- **Languages** the languages it knew in life\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Regeneration.*** The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.\n\n***Spider Climb.*** The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n***Vampire Weaknesses.*** The vampire has the following flaws:\n\n### Actions\n***Multiattack.*** The vampire makes two attacks, only one of which can be a bite attack."
};

export default SRD_MONSTER_VAMPIRE_SPAWN;