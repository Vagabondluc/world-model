export interface RuntimeEventEnvelopeV1<TPayload> {
  traceId: string;
  eventId: string;
  timestamp: number;
  tick: number;
  source: string;
  schemaVersion: 'runtime.event.v1';
  payload: TPayload;
}

let runtimeEventSeq = 1;

export function createRuntimeEnvelopeV1<TPayload>(
  traceId: string,
  tick: number,
  source: string,
  payload: TPayload
): RuntimeEventEnvelopeV1<TPayload> {
  const eventId = `evt_${String(runtimeEventSeq).padStart(10, '0')}`;
  runtimeEventSeq += 1;
  return {
    traceId,
    eventId,
    timestamp: Date.now(),
    tick,
    source,
    schemaVersion: 'runtime.event.v1',
    payload,
  };
}

