#!/usr/bin/env python3
"""Generate manifest.json, manifest.yaml, and index.json for Narrative Scripts.

Run: python scripts/generate_manifests.py
"""
import os
import json
import yaml

ROOT = os.path.dirname(os.path.dirname(__file__))
OUT_INDEX = os.path.join(ROOT, 'index.json')
OUT_JSON = os.path.join(ROOT, 'manifest.json')
OUT_YAML = os.path.join(ROOT, 'manifest.yaml')

EXCLUDES = {OUT_INDEX, OUT_JSON, OUT_YAML}

entries = []
manifest = {
    'Engines': {},
    'Payloads': {},
    'Execution_Systems': {},
    'Output': {},
    'AI_Behavior': []
}

for dirpath, dirnames, filenames in os.walk(ROOT):
    # skip scripts folder
    if os.path.basename(dirpath) == 'scripts':
        continue
    for fn in filenames:
        full = os.path.join(dirpath, fn)
        rel = os.path.relpath(full, ROOT).replace('\\', '/')
        if rel in EXCLUDES or fn.startswith('.'):
            continue
        # read first non-empty line
        excerpt = ''
        try:
            with open(full, 'r', encoding='utf8') as f:
                for _ in range(10):
                    line = f.readline()
                    if not line:
                        break
                    s = line.strip()
                    if s:
                        excerpt = s
                        break
        except Exception:
            excerpt = ''
        parts = rel.split('/')
        if parts[0] == 'Engines':
            group = parts[1] if len(parts) > 1 else 'root'
            manifest['Engines'].setdefault(group, []).append(rel)
        elif parts[0] == 'Payloads':
            group = parts[1] if len(parts) > 1 else 'root'
            manifest['Payloads'].setdefault(group, []).append(rel)
        elif parts[0] == 'Execution_Systems':
            group = parts[1] if len(parts) > 1 else 'root'
            manifest['Execution_Systems'].setdefault(group, []).append(rel)
        elif parts[0] == 'Output':
            group = parts[1] if len(parts) > 1 else 'root'
            manifest['Output'].setdefault(group, []).append(rel)
        elif parts[0] == 'AI_Behavior' or parts[0] == 'AI_Behavioral':
            manifest['AI_Behavior'].append(rel)
        else:
            # put into Execution_Systems root by default
            manifest.setdefault('Other', []).append(rel)
        entries.append({
            'filename': fn,
            'relative_path': rel,
            'category': parts[0] if parts else '',
            'tags': [],
            'excerpt': excerpt,
            'source_path': rel
        })

# sort lists
for k, v in manifest.items():
    if isinstance(v, dict):
        for kk in v:
            v[kk] = sorted(v[kk])
    elif isinstance(v, list):
        manifest[k] = sorted(v)

entries_sorted = sorted(entries, key=lambda e: e['relative_path'])

with open(OUT_INDEX, 'w', encoding='utf8') as f:
    json.dump(entries_sorted, f, indent=2, ensure_ascii=False)

with open(OUT_JSON, 'w', encoding='utf8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

with open(OUT_YAML, 'w', encoding='utf8') as f:
    yaml.safe_dump(manifest, f, sort_keys=False, allow_unicode=True)

print('Generated manifests: index.json, manifest.json, manifest.yaml')
