import Ajv from "ajv";
import canonicalBundleSchema from "@contracts/CanonicalBundle.schema.json";
import versionText from "@contracts/VERSION.txt?raw";
import type { CanonicalBundle } from "@/domain/canonical";

const CONTRACT_VERSION = versionText.trim();

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  allowUnionTypes: true,
  validateFormats: false
});

ajv.addFormat("float", true);

const validateCanonicalBundle = ajv.compile(canonicalBundleSchema as object);

function formatErrors(): string {
  const errors = validateCanonicalBundle.errors?.map((error) => {
    const location = error.instancePath || "/";
    return `${location} ${error.message ?? "is invalid"}`;
  });
  return errors && errors.length > 0 ? errors.join("; ") : "unknown validation error";
}

export function getCanonicalContractVersion(): string {
  return CONTRACT_VERSION;
}

export function createEmptyCanonicalBundle(): CanonicalBundle {
  return {
    assets: {},
    entities: {},
    events: [],
    migrations: [],
    projections: {},
    relations: [],
    workflows: {},
    world: null
  };
}

export function loadCanonicalBundle(input: string | unknown): CanonicalBundle {
  const parsed = typeof input === "string" ? JSON.parse(input) : input;
  if (!validateCanonicalBundle(parsed)) {
    throw new Error(`Canonical bundle validation failed: ${formatErrors()}`);
  }
  return parsed as CanonicalBundle;
}

export function saveCanonicalBundle(bundle: CanonicalBundle): string {
  const validated = loadCanonicalBundle(bundle);
  return `${JSON.stringify(validated, null, 2)}\n`;
}

export function assertContractCompatibility(expectedVersion: string): void {
  if (expectedVersion !== CONTRACT_VERSION) {
    throw new Error(
      `Canonical contract version mismatch: expected ${expectedVersion}, got ${CONTRACT_VERSION}`
    );
  }
}
