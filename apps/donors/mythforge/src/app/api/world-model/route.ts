import { NextResponse } from 'next/server';
import { buildMythforgeCreateWorldRequest, buildMythforgeUpsertEntityRequest, runWorldModelDriver, type MythforgeWorldStateOverlay } from '@/lib/world-model';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const state = await request.json() as MythforgeWorldStateOverlay;

  if (!Array.isArray(state.entities) || !Array.isArray(state.relationships)) {
    return NextResponse.json({ error: 'Invalid world state payload.' }, { status: 400 });
  }

  let response = runWorldModelDriver(buildMythforgeCreateWorldRequest(state));

  for (const entity of state.entities) {
    response = runWorldModelDriver({
      ...buildMythforgeUpsertEntityRequest(entity, state),
      bundle: response.bundle,
    });
  }

  return NextResponse.json(response);
}

