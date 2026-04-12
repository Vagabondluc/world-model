
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ABOLETH: SavedMonster = {
    "id": "srd-aboleth",
    "name": "Aboleth",
    "description": "Before the coming of the gods, aboleths lurked in primordial oceans and underground lakes. They reached out with their minds and seized control of the burgeoning life-forms of the mortal realm, making those creatures their slaves.",
    "profile": {
      "table": {
        "creatureType": "Large aberration",
        "size": "Large",
        "alignment": "lawful evil",
        "armorClass": "17 (natural armor)",
        "hitPoints": "135 (18d10 + 36)",
        "speed": "10 ft., swim 40 ft.",
        "senses": "darkvision 120 ft., passive Perception 20",
        "languages": "Deep Speech, telepathy 120 ft.",
        "challengeRating": "10 (5,900 XP)",
        "keyAbilities": "STR +5, CON +2, INT +4",
        "role": "Controller"
      },
      "savingThrows": {
        "con": 6,
        "int": 8,
        "wis": 6
      },
      "abilitiesAndTraits": "**Amphibious.** The aboleth can breathe air and water.\n\n**Mucous Cloud.** While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only water.\n\n**Probing Telepathy.** If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
      "actions": "**Multiattack.** The aboleth makes three tentacle attacks.\n\n**Tentacle.** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by *heal* or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.\n\n**Tail.** *Melee Weapon Attack:* +9 to hit, reach 10 ft. one target. *Hit:* 15 (3d6 + 5) bludgeoning damage.\n\n**Enslave (3/Day).** The aboleth targets one creature it can see within 30 feet of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.",
      "roleplayingAndTactics": "Aboleths are ancient, intelligent masterminds. They prefer to use their Enslave ability on physically powerful but low-Wisdom targets, turning them against their allies. In combat, they stay underwater to utilize their Mucous Cloud and will use their high reach to strike from a distance."
    },
    "statblock": "### Aboleth\n*Large aberration, lawful evil*\n___\n- **Armor Class** 17 (natural armor)\n- **Hit Points** 135 (18d10 + 36)\n- **Speed** 10 ft., swim 40 ft.\n___\n| STR | DEX | CON | INT | WIS | CHA |\n|:---:|:---:|:---:|:---:|:---:|:---:|\n| 21 (+5) | 9 (-1) | 15 (+2) | 18 (+4) | 15 (+2) | 18 (+4) |\n___\n- **Saving Throws** Con +6, Int +8, Wis +6\n- **Skills** History +12, Perception +10\n- **Senses** darkvision 120 ft., passive Perception 20\n- **Languages** Deep Speech, telepathy 120 ft.\n- **Challenge** 10 (5,900 XP)\n___\n***Amphibious.*** The aboleth can breathe air and water.\n\n***Mucous Cloud.*** While underwater, the aboleth is surrounded by transformative mucus... (see actions for full text).\n\n***Probing Telepathy.*** If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.\n\n### Actions\n***Multiattack.*** The aboleth makes three tentacle attacks.\n\n***Tentacle.*** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased...\n\n***Tail.*** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 15 (3d6 + 5) bludgeoning damage.\n\n***Enslave (3/Day).*** The aboleth targets one creature it can see within 30 feet of it... (see actions for full text).\n\n### Legendary Actions\nThe aboleth can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The aboleth regains spent legendary actions at the start of its turn.\n\n- **Detect.** The aboleth makes a Wisdom (Perception) check.\n- **Tail Swipe.** The aboleth makes one tail attack.\n- **Psychic Drain (Costs 2 Actions).** One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes."
  };
export default SRD_MONSTER_ABOLETH;
