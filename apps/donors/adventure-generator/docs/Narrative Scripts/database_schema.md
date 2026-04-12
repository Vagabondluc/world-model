# Database Schema: Google Cloud Firestore

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


This document outlines the database schema for the Element Manager application, utilizing Google Cloud Firestore as its NoSQL document database. The primary data entity is the "Card," which represents a filled form or an adventure node.

## 1. Collections Overview

The main collection will be `cards`, storing all individual card documents. Other collections might be introduced for user management, templates, or prompt definitions, but the core content resides in `cards`.

*   **`cards` Collection:**
    *   Stores individual `Card` documents.
    *   Each document's ID will be its `uuid`.

## 2. Card Document Structure

Each document within the `cards` collection will represent a single card and adhere to the following structure:

*   **Document ID:** `string` (UUID of the card) - This will be the `uuid` field itself, ensuring unique and easily retrievable documents.

*   **Fields:**

    *   **`uuid`**: `string`
        *   **Description:** A universally unique identifier for the card. This also serves as the document ID in Firestore.
        *   **Example:** `"a1b2c3d4-e5f6-7890-1234-567890abcdef"`

    *   **`title`**: `string`
        *   **Description:** A concise, human-readable title for the card (e.g., "Sir Reginald the Brave," "The Whispering Woods," "The Goblin Ambush"). This is often derived from a specific field within the `formData` (e.g., `NPC Name`, `Location Name`).
        *   **Example:** `"The Sunken Temple"`

    *   **`type`**: `string`
        *   **Description:** Defines the category or type of the card (e.g., "NPC," "Location," "Adventure Hook," "Adventure Node"). This helps in rendering the correct form and UI.
        *   **Example:** `"Adventure Node"`

    *   **`description`**: `string`
        *   **Description:** A general overview or summary of the card's content. This can be a longer text field used for quick previews or search results.
        *   **Example:** `"A crumbling temple submerged in a swamp, rumored to hold ancient treasures and a lurking horror."`

    *   **`categories`**: `array<string>`
        *   **Description:** An array of strings used for flexible tagging and organization. Allows for multiple categorizations.
        *   **Example:** `["Dungeon", "Swamp", "Exploration", "Horror"]`

    *   **`formData`**: `map` (object)
        *   **Description:** A flexible map (object) containing key-value pairs representing the specific fields and their values from the form that created or edited this card. The structure of this map depends on the `type` of the card and its associated `formSchema`.
        *   **Example (for an "Adventure Node" type):**
            ```json
            {
              "nodeTitle": "The Sunken Temple",
              "nodeDescription": "A crumbling temple submerged in a swamp...",
              "challengeRating": 8,
              "encounterDetails": "Giant crocodiles and undead guardians.",
              "rewards": "A cursed amulet and 500gp."
            }
            ```

    *   **`connections`**: `array<map>`
        *   **Description:** An array of objects, defining directed connections from this card to other cards. This is particularly relevant for "Adventure Node" cards to represent branching paths.
        *   **Structure of each connection object:**
            *   **`targetUUID`**: `string` (UUID of connected card)
            *   **`connectionType`**: `string` (e.g., "linear," "choice," "branch," "prerequisite")
            *   **`label`**: `string` (optional label for the connection, e.g., "Path A," "Requires Key")
        *   **Example:**
            ```json
            [
              {
                "targetUUID": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
                "connectionType": "choice",
                "label": "Take the left path"
              },
              {
                "targetUUID": "c3d4e5f6-a7b8-9012-3456-7890abcdef01",
                "connectionType": "choice",
                "label": "Take the right path"
              }
            ]
            ```

    *   **`createdAt`**: `timestamp`
        *   **Description:** The server timestamp when the card document was first created.
        *   **Example:** `Timestamp(seconds=1678886400, nanoseconds=0)`

    *   **`updatedAt`**: `timestamp`
        *   **Description:** The server timestamp when the card document was last updated.
        *   **Example:** `Timestamp(seconds=1678887000, nanoseconds=0)`

    *   **`createdBy`**: `string`
        *   **Description:** The user ID of the user who created the card.
        *   **Example:** `"user123abc"`

## 3. Indexing Considerations

For efficient querying, especially for filtering and sorting cards, the following Firestore indexes should be considered:

*   **Single-field indexes:** Automatically created by Firestore for most fields.
*   **Composite indexes:** May be required for queries involving multiple `where` clauses or `orderBy` clauses on different fields (e.g., querying `cards` by `type` and `categories`).
    *   Example: An index on `type` ASC, `createdAt` DESC for displaying recent cards of a specific type.
    *   Example: An index on `categories` array-contains for efficient searching by category.

## 4. Security Rules (High-Level)

Firestore security rules will be crucial to control access to data.

*   **Authentication:** Only authenticated users can read/write.
*   **Authorization:** Users can only read/write their own cards, or cards shared with them (if sharing is implemented).
*   **Data Validation:** Rules can enforce data types and required fields before writes are committed.
