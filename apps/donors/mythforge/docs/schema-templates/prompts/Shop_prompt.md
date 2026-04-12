## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/Locations/CreateFantasyCity_v1.txt` and `Quick_settlement.txt`

Use the sections below as the instruction skeleton for generating a shop or merchant. Focus on inventory, services, and adventure hooks. The final output must be strict JSON matching the schema below.

Shop Skeleton

- Name & Short Hook
- Owner / Proprietor
- Shop Type / Specialization
- Typical Inventory & Services
- Signature Item(s)
- Price Range and Rarity
- Reputation and Clientele
- Location / District
- Hooks and Adventure Uses
- Staff / NPCs associated

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Shop` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Shop` JSON schema:

```
{
  "name": string,
  "owner": string | null,
  "type": string,
  "location": string | null,
  "inventory": [{ "name": string, "type": string, "price": number | null, "rarity": string | null }],
  "services": [string],
  "signature_items": [string],
  "price_range": string | null,
  "reputation": string | null,
  "staff": [{ "name": string, "role": string }],
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
