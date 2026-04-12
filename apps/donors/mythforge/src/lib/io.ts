// =============================================================================
// MythosForge - Import/Export Utilities
// =============================================================================

import type { Entity, Relationship } from '@/lib/types';

export interface WorldExport {
  entities: Entity[];
  relationships: Relationship[];
  exportedAt: string;
  version: number;
}

/**
 * Export the current world state as a downloadable JSON blob.
 */
export function exportWorldAsBlob(state: {
  entities: Entity[];
  relationships: Relationship[];
}): Blob {
  const data: WorldExport = {
    entities: state.entities,
    relationships: state.relationships,
    exportedAt: new Date().toISOString(),
    version: 1,
  };
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}

/**
 * Trigger a browser download of the world state as JSON.
 */
export function downloadWorldJSON(state: {
  entities: Entity[];
  relationships: Relationship[];
}): void {
  const blob = exportWorldAsBlob(state);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mythosforge-world-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import a world from a JSON file. Validates that the file contains
 * entities and relationships arrays.
 */
export function importWorld(jsonFile: File): Promise<{
  entities: Entity[];
  relationships: Relationship[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          reject(new Error('Failed to read file contents.'));
          return;
        }

        const parsed = JSON.parse(text) as WorldExport;

        // Validate structure
        if (!Array.isArray(parsed.entities)) {
          reject(new Error('Invalid file: missing "entities" array.'));
          return;
        }
        if (!Array.isArray(parsed.relationships)) {
          reject(new Error('Invalid file: missing "relationships" array.'));
          return;
        }

        // Basic entity validation — each must have an id, title, category
        for (const entity of parsed.entities) {
          if (!entity.id || !entity.title || !entity.category) {
            reject(
              new Error(
                `Invalid entity: missing required fields (id, title, category).`
              )
            );
            return;
          }
        }

        resolve({
          entities: parsed.entities,
          relationships: parsed.relationships,
        });
      } catch {
        reject(new Error('Failed to parse JSON file. Is it valid JSON?'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsText(jsonFile);
  });
}
