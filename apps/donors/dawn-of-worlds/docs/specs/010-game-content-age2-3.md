
# SPEC-010: Game Content - Age II & III Actions

**Feature:** Expanded Gameplay Actions
**Dependencies:** SPEC-009 (Architecture Hardening), docs/rules/03_POWERS_AND_COSTS.md
**Status:** Implemented & Verified
**Priority:** High

## 1. Executive Summary
This specification defines the game logic, validation rules, and data structures for the core actions of Age II (Rise of Civilizations) and Age III (Conflict & Politics).

## 2. Implemented Logic

### Age II: The Rise of Civilizations

#### 2.1 Action: Create Race (`A2_CREATE_RACE`)
*   **Cost:** 2 AP
*   **Target:** Hex
*   **Validation:**
    *   Age >= 2
    *   Not Water
    *   Hex empty (no existing Race)

#### 2.2 Action: Create Subrace (`A2_CREATE_SUBRACE`)
*   **Cost:** 4 AP
*   **Target:** Hex
*   **Validation:**
    *   Age >= 2
    *   Adjacent to existing `RACE`
    *   Hex empty (no existing Race)

#### 2.3 Action: Found City (`A2_FOUND_CITY`)
*   **Cost:** 3 AP
*   **Target:** Hex
*   **Validation:**
    *   Age >= 2
    *   Existing `RACE` on target hex (Dependency)

#### 2.4 Action: Create Order (`A2_CREATE_ORDER`)
*   **Cost:** 6 AP
*   **Target:** Hex
*   **Validation:**
    *   Age >= 2
    *   Existing `RACE` on target hex

#### 2.5 Action: Create Avatar (`A2_CREATE_AVATAR`)
*   **Cost:** 7 AP
*   **Target:** Hex
*   **Validation:**
    *   Age <= 2 (Age 3 has separate action)

### Age III: Politics & Conflict

#### 3.1 Action: Found Nation (`A3_FOUND_NATION`)
*   **Cost:** 3 AP
*   **Target:** Hex
*   **Validation:**
    *   Age >= 3
    *   Existing `SETTLEMENT` (City) on target hex

#### 3.2 Action: Claim Border (`A3_CLAIM_BORDER`)
*   **Cost:** 2 AP
*   **Target:** Hex
*   **Validation:**
    *   Age >= 3
    *   Adjacent to existing `NATION` or `BORDER`

#### 3.3 Action: Declare War (`A3_DECLARE_WAR`)
*   **Cost:** 4 AP
*   **Target:** World Object (`NATION`)
*   **Validation:**
    *   Age >= 3

#### 3.4 Action: Create Avatar (`A3_CREATE_AVATAR`)
*   **Cost:** 8 AP
*   **Target:** Hex
*   **Validation:**
    *   Age >= 3

## 3. Visual Representation
*   **Races**: `groups` icon.
*   **Cities**: `apartment` icon + Glow effect.
*   **Orders**: `verified` badge.
*   **Nations**: Vector borders + `public` icon.
