# Specification: Revelation List Manager (revelations_dm_aid)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Revelation List Manager (DM Aid) reverses the mystery view: mapping Inbound Clues to Nodes. It audits the "Three Clue Rule" and highlights bottlenecks.

## 2. Component Architecture
### 2.1 Core Panels
- **Revelation Matrix**:
    - Lists Nodes (A, B, C...).
    - Lists *inbound* clues for each.
- **Audit Engine**:
    - Counter (Clues/Node).
    - Status Indicators (Green/Yellow/Red).
- **Critical Path Analyzer**:
    - Highlights "Fragile" connections.
- **Proactive Register**:
    - Summary of available backup nodes.

## 3. Interaction Logic
- **Reverse-Mapping**:
    - Parses Node files to build the inbound list.
- **Audit Fixes**:
    - Clicking "Suggest Source" on a Red node queries AI for a new clue placement.
- **Deep Linking**:
    - "From Node B" link scrolls to Node B detail.

## 4. Visual Design
- **Aesthetic**: Utility / Spreadsheet.
- **Coding**: Red=Critical Bottleneck.

## 5. Data Model
```typescript
interface RevelationAudit {
  nodes: AuditedNode[];
  proactiveNodes: string[];
}

interface AuditedNode {
  id: string;
  inboundClues: InboundClue[];
  status: 'Critical' | 'Warning' | 'Valid';
}

interface InboundClue {
  sourceNode: string;
  description: string;
}
```
