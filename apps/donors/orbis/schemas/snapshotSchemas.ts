
import { z } from 'zod';
import { DomainId } from '../core/types';

export const RNGStateSnapshotSchema = z.object({
  baseSeed: z.string(),
  eventCounter: z.string()
});

export const SchedulerSnapshotSchema = z.object({
  domainNextRun: z.record(z.string(), z.string()), // Key is DomainId (stringified), Value is AbsTime (string)
  activeDomains: z.array(z.nativeEnum(DomainId))
});

export const DomainStateSnapshotSchema = z.object({
  domainId: z.nativeEnum(DomainId),
  schemaVersion: z.number().int(),
  stateVersion: z.number().int(),
  authoritativeState: z.any(),
  derivedCache: z.any().optional(),
  lastRunTime: z.string()
});

export const SnapshotV1Schema = z.object({
  snapshotVersion: z.literal(1),
  engineVersion: z.number().int(),
  registryVersion: z.number().int(),

  absTime: z.string(),
  engineStep: z.string(),

  rngState: RNGStateSnapshotSchema,
  schedulerState: SchedulerSnapshotSchema,

  domainStates: z.array(DomainStateSnapshotSchema),
  
  globalDigest: z.string()
});
