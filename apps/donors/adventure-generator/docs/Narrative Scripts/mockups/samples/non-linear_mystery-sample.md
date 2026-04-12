# Sample Output: non-linear_mystery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


# Mystery Structure: The Serpent's Coil (Loop Framework)

### 1. Structure Overview
**Framework:** Loop Structure (4 Nodes)
**Mystery Name:** The Serpent's Coil
**Entry Points:** Node A (The Ruined Temple), Node D (The Smuggler's Den).

### 2. The Loop Mapping
- **MysteryNode_SerpentCoil_Loop_A.txt (The Ruined Temple)**
    - *Clues to:* B (The Ritual Site), D (The Smuggler's Den).
    - *Proactive Trigger:* A dying cultist whispers a location.
- **MysteryNode_SerpentCoil_Loop_B.txt (The Ritual Site)**
    - *Clues to:* C (The High Priest's Cell), A (The Ruined Temple).
- **MysteryNode_SerpentCoil_Loop_C.txt (The High Priest's Cell)**
    - *Clues to:* D (The Smuggler's Den), B (The Ritual Site).
- **MysteryNode_SerpentCoil_Loop_D.txt (The Smuggler's Den)**
    - *Clues to:* A (The Ruined Temple), C (The High Priest's Cell).
    - *Dead End point:* Includes a lead to Node X (The Abandoned Mine).

### 3. Dead End Implementation
- **MysteryNode_SerpentCoil_DeadEnd_X.txt (The Abandoned Mine)**
    - *Info:* Non-essential lore about the serpent god's origin.
    - *Reward:* A *Circlet of Poison Resistance* and extra XP for the "Lost History" discovery.

### 4. Loop Conclusion (The "Break")
Once players have found at least 4 out of the 6 major clues in the loop, **Node E (The Temple Heart)** is revealed.
- **MysteryNode_SerpentCoil_Conclusion_E.txt (The Temple Heart)**
    - *Climax:* Confronting the Avatar of the Serpent.

### 5. File Manifest
- `MysteryNode_SerpentCoil_Loop_A.txt`
- `MysteryNode_SerpentCoil_Loop_B.txt`
- `MysteryNode_SerpentCoil_Loop_C.txt`
- `MysteryNode_SerpentCoil_Loop_D.txt`
- `MysteryNode_SerpentCoil_DeadEnd_X.txt`
- `MysteryNode_SerpentCoil_Conclusion_E.txt`
