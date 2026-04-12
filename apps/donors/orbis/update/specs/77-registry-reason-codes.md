# 🔒 REGISTRY & REASON CODES (CORE CONTRACT)

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`00-data-types.md`]
- `Owns`: [`ReasonCode`, `RegistryId`, `NamespaceId`, `ReasonSeverity`]
- `Writes`: `[]`

---

## 1. Registry Architecture
To ensure deterministic execution across all domains, every numeric identifier must belong to a registered namespace.

```ts
type NamespaceId = uint16
type RegistryId = uint32

enum ReasonSeverity {
  INFO = 0,
  WARN = 1,
  HALT = 2,
  FATAL = 3
}

interface ReasonCode {
  id: uint32
  severity: ReasonSeverity
  namespace: NamespaceId
  mnemonic: string // e.g. "ERR_INSUFFICIENT_ENERGY"
}
```

## 2. Global Namespace Partitioning
| Range Start | Domain | Purpose |
| :--- | :--- | :--- |
| `0x0000` | FOUNDATION | Math, Time, Data Types |
| `0x1000` | PHYSICS | Climate, Carbon, Magnetosphere |
| `0x2000` | BIOLOGY | Species, Trophic, Population |
| `0x3000` | CIVILIZATION | Needs, Factions, Economics |
| `0x4000` | INFRASTRUCTURE | Parameters, Auth, Snapshots |
| `0x8000` | MODDING | Experimental and User Content |

## 3. Mandatory Reason Codes (Frozen)
| ID | Mnemonic | Severity | Trigger |
| :--- | :--- | :--- | :--- |
| `0x0001` | `SUCCESS_OK` | INFO | Default success state |
| `0x0002` | `ERR_INTERNAL_CLAMP` | WARN | Value exceeded bounds and was capped |
| `0x0003` | `ERR_DIVIDE_BY_ZERO` | FATAL | Deterministic halt on math error |
| `0x0004` | `ERR_AUTH_VIOLATION` | HALT | Domain attempted unauthorized write |
| `0x0005` | `ERR_DIGEST_MISMATCH`| FATAL | Save/Load integrity failed |

## 4. Determinism Rules
- **No Strings**: Solvers must return `uint32` IDs. String lookup is for View-Model only.
- **Append Only**: Once a code is defined, it is immutable.
- **Traceability**: Every `WorldDelta` must include a `ReasonCode`.
