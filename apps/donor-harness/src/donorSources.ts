export type DonorId = string

export interface DonorSource {
  id: DonorId
  label: string
  url?: string
  /** Optional local repo path (for triage/porting) */
  path?: string
  framework?: 'react' | 'next' | 'vite' | 'unknown'
  tech?: 'ts' | 'js' | 'mixed' | 'unknown'
  recommended?: 'port' | 'iframe' | 'skip' | 'ported' | 'investigate' | 'embed' | 'later'
  notes?: string
}

export const DONOR_SOURCES: DonorSource[] = [
  { id: 'mythforge', label: 'Mythforge', url: 'http://127.0.0.1:3000', framework: 'unknown', tech: 'unknown', recommended: 'investigate' },
  { id: 'orbis', label: 'Orbis', url: 'http://127.0.0.1:2222', framework: 'unknown', tech: 'unknown', recommended: 'iframe' },
  { id: 'adventure-generator', label: 'Adventure Generator', path: '../../to be merged/dungeon generator', framework: 'unknown', tech: 'mixed', recommended: 'later' },
  { id: 'world-builder', label: 'World Builder UI', path: '../../to be merged/world-builder-ui', framework: 'vite', tech: 'ts', recommended: 'port' },
  { id: 'faction-image', label: 'Faction Image', path: '../../to be merged/faction-image', framework: 'vite', tech: 'ts', recommended: 'port' },
  { id: 'mappa-imperium', label: 'Mappa Imperium', path: '../../to be merged/mappa imperium', framework: 'vite', tech: 'ts', recommended: 'ported', notes: 'Already integrated as @mi in src/donors/mappa-imperium' },
  { id: 'apocalypse', label: 'Apocalypse', path: '../../to be merged/apocalypse', framework: 'next', tech: 'ts', recommended: 'later' },
  { id: 'character-creator', label: 'Character Creator', path: '../../to be merged/character-creator', framework: 'next', tech: 'ts', recommended: 'later' },
  { id: 'deity-creator', label: 'Deity Creator', path: '../../to be merged/deity creator', framework: 'next', tech: 'ts', recommended: 'later' },
  { id: 'genesis', label: 'Genesis', path: '../../to be merged/genesis', framework: 'next', tech: 'ts', recommended: 'later' },
  { id: 'dungeon-generator', label: 'Dungeon Generator', path: '../../to be merged/dungeon generator', framework: 'unknown', tech: 'mixed', recommended: 'later' },
  { id: 'watabou-city', label: 'Watabou City', path: '../../to be merged/watabou-city-clean-room', framework: 'react', tech: 'js', recommended: 'embed' },
  { id: 'orbis-spec', label: 'Orbis Spec', path: '../../to be merged/Orbis Spec 2.0', framework: 'unknown', tech: 'unknown', recommended: 'investigate' },
  { id: 'true-orbis', label: 'True Orbis', path: '../../to be merged/true orbis', framework: 'unknown', tech: 'unknown', recommended: 'investigate' },
]
