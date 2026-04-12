# Discovery Runtime Modes

Default mode is local file-backed discovery.

## Env variables
- `VITE_ICON_PROVIDER_MODE=local|api`
- `VITE_ICON_API_BASE=/api` (used when mode is `api`)

## Quick start
- Local mode: `npm run dev`
- API mode (mock API via Vite middleware): `npm run dev:api`

## Local mode
- Index: `/icons/keywords.index.json`
- Assets: canonical `icons/**` via API raw endpoint path references like `/icons/subfolder/name.svg`

## API mode
- `GET {base}/icon-index`
- `GET {base}/icon-index/search?q=&domain=&category=&limit=`
- `GET {base}/icon-index/by-id?id=...`
- `GET {base}/icon-assets/raw?path=...`

In dev, these are served by a Vite middleware plugin from local files in `public/`.
The raw endpoint also serves canonical repo icons from `icons/` when `path` starts with `/icons/`.
