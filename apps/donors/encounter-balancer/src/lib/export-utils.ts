import type { 
  Monster, 
  TacticalElement, 
  Reward, 
  Difficulty,
  PhysicalFeature,
  EnvironmentalMechanic,
  EnemyForce,
  DynamicChange,
  EncounterOutcome,
  TransitionHook
} from './encounter-types';

// ============== Types ==============

export interface ExportableEncounter {
  name: string;
  location?: string;
  difficulty: Difficulty;
  partyLevel: number;
  playerCount: number;
  monsters: Monster[];
  tacticalElements: TacticalElement[];
  rewards: Reward[];
  notes?: string;
  // Environmental
  physicalFeatures?: PhysicalFeature[];
  environmentalMechanics?: EnvironmentalMechanic[];
  enemyForces?: EnemyForce[];
  dynamicChanges?: DynamicChange[];
  outcomes?: EncounterOutcome[];
  transitionHooks?: TransitionHook[];
}

export type ExportFormat = 'json' | 'markdown' | 'text';

// ============== JSON Export ==============

export function exportAsJSON(encounter: ExportableEncounter): string {
  return JSON.stringify(encounter, null, 2);
}

export function downloadJSON(encounter: ExportableEncounter, filename?: string): void {
  const json = exportAsJSON(encounter);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${encounter.name || 'encounter'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============== Markdown Export ==============

export function exportAsMarkdown(encounter: ExportableEncounter): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`# ${encounter.name || 'Unnamed Encounter'}`);
  lines.push('');
  
  // Metadata
  lines.push('## Overview');
  lines.push('');
  lines.push(`- **Difficulty:** ${encounter.difficulty.charAt(0).toUpperCase() + encounter.difficulty.slice(1)}`);
  lines.push(`- **Party Level:** ${encounter.partyLevel}`);
  lines.push(`- **Players:** ${encounter.playerCount}`);
  if (encounter.location) {
    lines.push(`- **Location:** ${encounter.location}`);
  }
  lines.push('');
  
  // Monsters
  if (encounter.monsters.length > 0) {
    lines.push('## Monsters');
    lines.push('');
    lines.push('| Name | CR | XP | Count | Type |');
    lines.push('|------|-----|-----|-------|------|');
    encounter.monsters.forEach(m => {
      lines.push(`| ${m.name} | ${m.cr} | ${m.xp.toLocaleString()} | ${m.count} | ${m.type} |`);
    });
    lines.push('');
    
    // XP Summary
    const totalXP = encounter.monsters.reduce((sum, m) => sum + (m.xp * m.count), 0);
    const totalMonsters = encounter.monsters.reduce((sum, m) => sum + m.count, 0);
    lines.push(`**Total XP:** ${totalXP.toLocaleString()} (${totalMonsters} monsters)`);
    lines.push('');
  }
  
  // Tactical Elements
  if (encounter.tacticalElements && encounter.tacticalElements.length > 0) {
    lines.push('## Tactical Elements');
    lines.push('');
    encounter.tacticalElements.forEach(t => {
      lines.push(`### ${t.name}`);
      lines.push(`*${t.type}*`);
      lines.push(t.description);
      lines.push('');
    });
  }
  
  // Rewards
  if (encounter.rewards && encounter.rewards.length > 0) {
    lines.push('## Rewards');
    lines.push('');
    encounter.rewards.forEach(r => {
      lines.push(`- **${r.type.charAt(0).toUpperCase() + r.type.slice(1)}:** ${r.description}`);
      if (r.value) {
        lines.push(`  - Value: ${r.value.toLocaleString()} gp`);
      }
    });
    lines.push('');
  }
  
  // Environmental Elements
  if (encounter.physicalFeatures && encounter.physicalFeatures.length > 0) {
    lines.push('## Physical Features');
    lines.push('');
    encounter.physicalFeatures.forEach(f => {
      lines.push(`- **${f.name}** (${f.size})`);
      lines.push(`  ${f.description}`);
    });
    lines.push('');
  }
  
  if (encounter.environmentalMechanics && encounter.environmentalMechanics.length > 0) {
    lines.push('## Environmental Mechanics');
    lines.push('');
    encounter.environmentalMechanics.forEach(m => {
      lines.push(`- **${m.name}**`);
      lines.push(`  - Trigger: ${m.trigger}`);
      if (m.damageDice) {
        lines.push(`  - Damage: ${m.damageDice} ${m.damageType}`);
      }
    });
    lines.push('');
  }
  
  if (encounter.enemyForces && encounter.enemyForces.length > 0) {
    lines.push('## Enemy Forces');
    lines.push('');
    encounter.enemyForces.forEach(f => {
      lines.push(`- **${f.name}** (${f.position})`);
      lines.push(`  ${f.description}`);
    });
    lines.push('');
  }
  
  if (encounter.dynamicChanges && encounter.dynamicChanges.length > 0) {
    lines.push('## Dynamic Changes');
    lines.push('');
    encounter.dynamicChanges.forEach(c => {
      lines.push(`- **Round ${c.round}:** ${c.description}`);
    });
    lines.push('');
  }
  
  if (encounter.outcomes && encounter.outcomes.length > 0) {
    lines.push('## Possible Outcomes');
    lines.push('');
    encounter.outcomes.forEach(o => {
      lines.push(`- **${o.name}** (${o.probability})`);
      lines.push(`  ${o.description}`);
    });
    lines.push('');
  }
  
  if (encounter.transitionHooks && encounter.transitionHooks.length > 0) {
    lines.push('## Transition Hooks');
    lines.push('');
    encounter.transitionHooks.forEach(h => {
      lines.push(`- **${h.name}**`);
      lines.push(`  ${h.description}`);
    });
    lines.push('');
  }
  
  // Notes
  if (encounter.notes) {
    lines.push('## Notes');
    lines.push('');
    lines.push(encounter.notes);
    lines.push('');
  }
  
  return lines.join('\n');
}

export function downloadMarkdown(encounter: ExportableEncounter, filename?: string): void {
  const markdown = exportAsMarkdown(encounter);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${encounter.name || 'encounter'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============== Text Export (Print-friendly) ==============

export function exportAsText(encounter: ExportableEncounter): string {
  const lines: string[] = [];
  
  lines.push('═'.repeat(50));
  lines.push(`  ${encounter.name || 'Unnamed Encounter'}`);
  lines.push('═'.repeat(50));
  lines.push('');
  
  lines.push(`Difficulty: ${encounter.difficulty.toUpperCase()}`);
  lines.push(`Party Level: ${encounter.partyLevel} | Players: ${encounter.playerCount}`);
  if (encounter.location) {
    lines.push(`Location: ${encounter.location}`);
  }
  lines.push('');
  
  if (encounter.monsters.length > 0) {
    lines.push('─'.repeat(50));
    lines.push('MONSTERS');
    lines.push('─'.repeat(50));
    encounter.monsters.forEach(m => {
      lines.push(`  • ${m.name} (CR ${m.cr}) - ${m.count}x - ${m.xp.toLocaleString()} XP each`);
    });
    const totalXP = encounter.monsters.reduce((sum, m) => sum + (m.xp * m.count), 0);
    lines.push('');
    lines.push(`  Total XP: ${totalXP.toLocaleString()}`);
    lines.push('');
  }
  
  if (encounter.tacticalElements && encounter.tacticalElements.length > 0) {
    lines.push('─'.repeat(50));
    lines.push('TACTICAL ELEMENTS');
    lines.push('─'.repeat(50));
    encounter.tacticalElements.forEach(t => {
      lines.push(`  • ${t.name} [${t.type}]`);
      lines.push(`    ${t.description}`);
    });
    lines.push('');
  }
  
  if (encounter.rewards && encounter.rewards.length > 0) {
    lines.push('─'.repeat(50));
    lines.push('REWARDS');
    lines.push('─'.repeat(50));
    encounter.rewards.forEach(r => {
      lines.push(`  • ${r.type}: ${r.description}`);
      if (r.value) lines.push(`    Value: ${r.value.toLocaleString()} gp`);
    });
    lines.push('');
  }
  
  if (encounter.notes) {
    lines.push('─'.repeat(50));
    lines.push('NOTES');
    lines.push('─'.repeat(50));
    lines.push(encounter.notes);
    lines.push('');
  }
  
  lines.push('═'.repeat(50));
  lines.push(`Generated: ${new Date().toLocaleDateString()}`);
  lines.push('═'.repeat(50));
  
  return lines.join('\n');
}

export function downloadText(encounter: ExportableEncounter, filename?: string): void {
  const text = exportAsText(encounter);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${encounter.name || 'encounter'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============== Print Functionality ==============

export function printEncounter(encounter: ExportableEncounter): void {
  const printContent = generatePrintHTML(encounter);
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the encounter');
    return;
  }
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

function generatePrintHTML(encounter: ExportableEncounter): string {
  const totalXP = encounter.monsters.reduce((sum, m) => sum + (m.xp * m.count), 0);
  const totalMonsters = encounter.monsters.reduce((sum, m) => sum + m.count, 0);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${encounter.name || 'Encounter'} - D&D Encounter Builder</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Georgia, 'Times New Roman', serif; 
      font-size: 12pt; 
      line-height: 1.4;
      color: #1a1a1a;
      padding: 20px;
      max-width: 8.5in;
      margin: 0 auto;
    }
    
    .header { 
      text-align: center; 
      border-bottom: 3px double #333;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 { 
      font-size: 24pt; 
      margin-bottom: 5px;
      font-variant: small-caps;
    }
    .header .meta { 
      font-size: 10pt; 
      color: #555;
    }
    
    .section { 
      margin-bottom: 20px; 
      page-break-inside: avoid;
    }
    .section-title { 
      font-size: 14pt;
      font-weight: bold;
      border-bottom: 1px solid #333;
      margin-bottom: 10px;
      font-variant: small-caps;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    th, td { 
      border: 1px solid #ccc; 
      padding: 6px 10px; 
      text-align: left;
    }
    th { 
      background: #f5f5f5; 
      font-weight: bold;
    }
    tr:nth-child(even) { background: #fafafa; }
    
    .stat-block {
      background: #f9f9f9;
      border: 1px solid #ddd;
      padding: 10px;
      margin-bottom: 10px;
    }
    .stat-block .name { font-weight: bold; font-size: 11pt; }
    .stat-block .type { font-style: italic; color: #666; font-size: 10pt; }
    
    .xp-summary {
      text-align: right;
      font-size: 11pt;
      font-weight: bold;
      border-top: 1px solid #333;
      padding-top: 10px;
      margin-top: 10px;
    }
    
    .difficulty-easy { color: #166534; }
    .difficulty-medium { color: #854d0e; }
    .difficulty-hard { color: #c2410c; }
    .difficulty-deadly { color: #b91c1c; }
    
    .notes {
      background: #fffef0;
      border: 1px solid #e5e5c0;
      padding: 10px;
      font-style: italic;
    }
    
    .footer {
      text-align: center;
      font-size: 9pt;
      color: #888;
      margin-top: 30px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }
    
    @media print {
      body { padding: 0; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${encounter.name || 'Unnamed Encounter'}</h1>
    <div class="meta">
      <span class="difficulty-${encounter.difficulty}">${encounter.difficulty.toUpperCase()}</span>
      &nbsp;|&nbsp; Party Level ${encounter.partyLevel}
      &nbsp;|&nbsp; ${encounter.playerCount} Players
      ${encounter.location ? `&nbsp;|&nbsp; ${encounter.location}` : ''}
    </div>
  </div>
  
  ${encounter.monsters.length > 0 ? `
  <div class="section">
    <div class="section-title">Monsters</div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>CR</th>
          <th>XP</th>
          <th>Count</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        ${encounter.monsters.map(m => `
          <tr>
            <td><strong>${m.name}</strong>${m.isLegendary ? ' ★' : ''}</td>
            <td>${m.cr}</td>
            <td>${m.xp.toLocaleString()}</td>
            <td>${m.count}</td>
            <td>${m.type}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="xp-summary">
      Total: ${totalMonsters} monsters &nbsp;|&nbsp; ${totalXP.toLocaleString()} XP
    </div>
  </div>
  ` : ''}
  
  ${encounter.tacticalElements && encounter.tacticalElements.length > 0 ? `
  <div class="section">
    <div class="section-title">Tactical Elements</div>
    ${encounter.tacticalElements.map(t => `
      <div class="stat-block">
        <div class="name">${t.name} <span class="type">(${t.type})</span></div>
        <div>${t.description}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  ${encounter.rewards && encounter.rewards.length > 0 ? `
  <div class="section">
    <div class="section-title">Rewards</div>
    ${encounter.rewards.map(r => `
      <div class="stat-block">
        <div class="name">${r.type.charAt(0).toUpperCase() + r.type.slice(1)}</div>
        <div>${r.description}${r.value ? ` (${r.value.toLocaleString()} gp)` : ''}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  ${encounter.physicalFeatures && encounter.physicalFeatures.length > 0 ? `
  <div class="section">
    <div class="section-title">Physical Features</div>
    ${encounter.physicalFeatures.map(f => `
      <div class="stat-block">
        <div class="name">${f.name} <span class="type">(${f.size})</span></div>
        <div>${f.description}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  ${encounter.environmentalMechanics && encounter.environmentalMechanics.length > 0 ? `
  <div class="section">
    <div class="section-title">Environmental Mechanics</div>
    ${encounter.environmentalMechanics.map(m => `
      <div class="stat-block">
        <div class="name">${m.name}</div>
        <div><strong>Trigger:</strong> ${m.trigger}</div>
        ${m.damageDice ? `<div><strong>Damage:</strong> ${m.damageDice} ${m.damageType}</div>` : ''}
        ${m.saveDC ? `<div><strong>Save:</strong> DC ${m.saveDC} ${m.saveType}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  ${encounter.notes ? `
  <div class="section">
    <div class="section-title">Notes & Tactics</div>
    <div class="notes">${encounter.notes.replace(/\n/g, '<br>')}</div>
  </div>
  ` : ''}
  
  <div class="footer">
    Generated by D&D Encounter Builder &nbsp;|&nbsp; ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
  `;
}

// ============== Import Functionality ==============

export function parseImportedJSON(jsonString: string): ExportableEncounter | null {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate required fields
    if (typeof data !== 'object') return null;
    
    return {
      name: data.name || 'Imported Encounter',
      location: data.location,
      difficulty: data.difficulty || 'medium',
      partyLevel: data.partyLevel || 5,
      playerCount: data.playerCount || 4,
      monsters: Array.isArray(data.monsters) ? data.monsters : [],
      tacticalElements: Array.isArray(data.tacticalElements) ? data.tacticalElements : [],
      rewards: Array.isArray(data.rewards) ? data.rewards : [],
      notes: data.notes,
      physicalFeatures: data.physicalFeatures,
      environmentalMechanics: data.environmentalMechanics,
      enemyForces: data.enemyForces,
      dynamicChanges: data.dynamicChanges,
      outcomes: data.outcomes,
      transitionHooks: data.transitionHooks,
    };
  } catch {
    return null;
  }
}

export function readImportedFile(file: File): Promise<ExportableEncounter | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (file.name.endsWith('.json')) {
        resolve(parseImportedJSON(content));
      } else {
        // Try to parse as JSON anyway
        const result = parseImportedJSON(content);
        resolve(result);
      }
    };
    
    reader.onerror = () => resolve(null);
    reader.readAsText(file);
  });
}
