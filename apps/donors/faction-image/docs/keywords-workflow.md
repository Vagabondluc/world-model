# Keywords Workflow

1. Run `npm run icons:auto-tag` to generate `data/icons/keywords.draft.json` from canonical `icons/**`.
2. Manually review draft records and add domain affinity + quality tags.
3. Promote curated output to `public/icons/keywords.index.json`.
4. Run `npm run icons:build-index` then `npm run icons:validate-index` before merge.

Manual review target:
- 3-5 keywords per icon
- domain affinity scores
- exclusion flags for mismatched domains
