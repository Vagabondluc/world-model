import React, { useState, Suspense } from 'react'
import { useCanonicalStore, WorldRecord } from './store/canonicalStore'
import { DONOR_SOURCES } from './donorSources'

const HARNESS_WORLD: WorldRecord = {
  world_id: 'world-harness',
  metadata: { label: 'Harness World', summary: null, tags: ['harness'] },
  payload: {},
  root_event_ledger: { event_ids: [] },
  root_schema_binding: null,
  workflow_registry_references: [],
  simulation_attachment: null,
  asset_attachments: [],
  top_level_entity_index: [],
}

const LazyMIApp = React.lazy(() => import('@mi/App'))
const LazyFaction = React.lazy(() => import('./donors/faction-image'))

export default function App() {
  const world = useCanonicalStore((s) => s.world)
  const setWorld = useCanonicalStore((s) => s.setWorld)
  const [selectedDonor, setSelectedDonor] = useState<string>('mappa-imperium')

  if (!world) {
    return (
      <div style={{ padding: 20 }}>
        <h1>World Model — Donor Harness</h1>
        <p>No canonical world loaded yet.</p>
        <button
          onClick={() => setWorld(HARNESS_WORLD)}
          style={{ padding: '8px 16px', marginTop: 12 }}
        >
          Load Harness World
        </button>
      </div>
    )
  }

  const donor = DONOR_SOURCES.find((d) => d.id === selectedDonor)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 260, borderRight: '1px solid #ddd', padding: 12 }}>
        <h2>Donor Selector</h2>
        <div style={{ marginTop: 8 }}>
          {DONOR_SOURCES.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDonor(d.id)}
              style={{ display: 'block', width: '100%', padding: 8, marginBottom: 6, textAlign: 'left' }}
            >
              {d.label} {d.recommended === 'ported' ? '• ported' : d.recommended === 'port' ? '• candidate' : ''}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => setWorld(HARNESS_WORLD)} style={{ padding: '8px 12px' }}>
            Reset / Load Harness World
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 12 }}>
        {selectedDonor === 'mappa-imperium' ? (
          <Suspense fallback={<div>Loading donor…</div>}>
            <LazyMIApp />
          </Suspense>
        ) : selectedDonor === 'faction-image' ? (
          <Suspense fallback={<div>Loading faction-image port…</div>}>
            <LazyFaction />
          </Suspense>
        ) : donor?.url ? (
          <iframe src={donor.url} style={{ width: '100%', height: '100%', border: 'none' }} />
        ) : (
          <div style={{ padding: 20 }}>
            <h3>{donor?.label ?? selectedDonor}</h3>
            <p>This donor is not ported into the harness yet.</p>
            <p>Recommendation: {donor?.recommended}</p>
            {donor?.path && (
              <p>
                Source: <em>{donor.path}</em>
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
