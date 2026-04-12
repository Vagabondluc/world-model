# Icon Discovery API Contracts (Optional Adapter Mode)

## `GET /api/icon-index/search`
Query params:
- `q` string
- `domain` optional
- `category` optional
- `limit` optional

Response:
```json
{
  "items": [],
  "elapsedMs": 0
}
```

## `GET /api/icon-assets/:id`
Response:
```json
{
  "id": "delapouite/ancient-sword",
  "assetPath": "/assets/delapouite/ancient-sword.svg"
}
```

## `GET /api/icon-assets/raw?path=...`
Returns raw SVG text.
