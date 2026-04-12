# 060 - Semantic AI Personality System (The "Pressure" Model)

## 1. Core Philosophy
**Tags represent Imbalance (Pressure). Stores represent Intent (Discharge).**

Instead of a static "Aggression" stat, the AI accumulates **Semantic Tags** (debts/pressures) from events. It then selects **Stores** (strategies) to resolve these tags based on its culture and capabilities.

> **"Vengeful" is not a trait.** It is an unpaid debt created when a city is razed. The AI seeks to "pay" this debt via military, economic, or diplomatic damage.

---

## 2. The Tag Taxonomy (Imbalance Families)

Tags fall into four orthogonal imbalance families. They do not force specific actions; they demand resolution.

| Family | Core Question | Example Tags |
| :--- | :--- | :--- |
| **GRUDGE** | *"We were harmed."* | `WRONGED`, `VENGEFUL`, `BETRAYED` |
| **FEAR** | *"We are unsafe."* | `THREATENED`, `PARANOID`, `ENCIRCLED` |
| **SHAME** | *"We were diminished."* | `HUMILIATED`, `DISRESPECTED`, `ILLEGITIMATE` |
| **AMBITION** | *"We are unfulfilled."* | `EXPANSION_DESIRE`, `DESTINY_DRIVEN`, `OPPORTUNISTIC` |

---

## 3. Data Structures

### 3.1. Semantic Tags (The Pressure)
Stateful obligations that decay or are satisfied.

```typescript
type TagFamily = "GRUDGE" | "FEAR" | "SHAME" | "AMBITION";

interface SemanticTag {
    id: string;             // e.g. "VENGEFUL_CITY_RAZED"
    family: TagFamily;
    source: string;         // entityId of who caused it
    intensity: number;      // 0.0 - 1.0 (Pressure level)
    urgency: number;        // How fast damage grows if ignored
    
    // The "Win Condition" for this tag
    satisfaction: {
        type: "THRESHOLD" | "SYMBOLIC" | "ESCALATING";
        metric: string;     // e.g. "damage_inflicted", "turns_peace"
        requirement: number;
    };
    
    // Tracking progress
    accumulatedValue: number; 
    accumulatedLoss: number; // Cost sunk into this tag
}
```

### 3.2. Stores (The Resolution Vector)
Strategies to discharge pressure. Stores have costs and risks.

```typescript
interface StoreProfile {
    id: string; // e.g. "MILITARY_RAID", "TRADE_EMBARGO", "DENUNCIATION"
    
    // What tags does this store satisfy?
    reduces: string[]; // e.g. ["VENGEFUL", "HUMILIATED"]
    
    // Cost Profile (Paid immediately)
    costs: {
        military: number;
        economic: number;
        political: number;
        stability: number;
    };
    
    risk: number;        // Uncertainty of outcome
    visibility: number;  // Public impact
}
```

### 3.3. Personality Profile (The Filter)
How a specific civilization interprets logic.

```typescript
interface CulturalBias {
    id: string; // e.g. "WARLORD", "MERCHANT_PRINCE"
    
    // Preference for specific Stores
    storeWeights: Record<string, number>; 
    
    // Sensitivity
    lossTolerance: number;       // How much failing costs before quitting
    symbolismPreference: number; // Preference for "Shame" tags over "Ambiton"
}
```

---

## 4. The Decision Loop

1.  **Event Occurs**: (e.g. Player razes City A).
2.  **Tag Created**: AI gains `VENGEFUL` tag (Source: Player, Intensity: 1.0).
3.  **Planning Cycle**:
    *   AI calculates `Priority = Intensity * Urgency * LossTolerance`.
    *   AI selects top N Tags.
4.  **Store Selection**:
    *   AI evaluates valid Stores (Raid, Sanction, Denounce).
    *   AI picks Store based on `CulturalBias` + `Capability`.
5.  **Action**: AI executes "Trade Embargo".
6.  **Feedback**:
    *   Embargo inflicts Economic Damage.
    *   `VENGEFUL` tag intensity reduces.
    *   If `accumulatedValue >= requirement`, Tag is **Satisfied** (Removed).

---

## 5. Obsolescence (The "Give Up" Mechanic)

If the cost of pursuing a tag exceeds its value, the AI abandons it.

```typescript
if (tag.accumulatedLoss > (tag.intensity * bias.lossTolerance * FACTOR)) {
    markObsolete(tag); // Becomes a "Scar" or "Memory"
}
```

**Result**: Instead of infinite war, the AI might give up and become `BITTER` or `TRAUMATIZED` (new passive tags), shifting from active hostility to cold aversion.

---

## 6. Serialization (Save Game)

```json
{
  "active_tags": [
    {
      "id": "VENGEFUL_GAME_TURN_120",
      "type": "VENGEFUL",
      "source": "PLAYER_1",
      "intensity": 0.8,
      "accumulated_loss": 0.2
    }
  ],
  "memories": [
    {
      "id": "FAILED_WAR_OF_140",
      "obsolete_reason": "TOO_COSTLY"
    }
  ]
}
```
