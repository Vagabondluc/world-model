import type { ElementCard, Player, Resource, Deity, Location, Faction, Settlement, Event, Character, War, Monument, GameSettings } from '../types';

/**
 * Helper function to trigger a file download in the browser.
 */
function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
}

/**
 * Generates and downloads a 'chronicle-feed.json' file.
 * This file contains the entire world state in a format suitable for hosting and sharing.
 */
export function exportChronicleFeed(
    elements: ElementCard[],
    players: Player[],
    gameSettings: GameSettings | null,
    currentPlayer: Player | null
) {
    const feedData = {
        manifest: {
            gameName: "Mappa Imperium Chronicle",
            version: "1.0",
            exportedBy: currentPlayer?.name || "Observer",
            timestamp: new Date().toISOString(),
            elementCount: elements.length,
            gameSettings: gameSettings
        },
        players: players.map(({ playerNumber, name }) => ({ playerNumber, name })), // Only export non-sensitive player info
        elements: elements
    };
    
    const jsonString = JSON.stringify(feedData, null, 2);
    downloadFile(jsonString, 'chronicle-feed.json', 'application/json');
}


function buildHtml(element: ElementCard, content: string, symbol: string) {
     return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Element: ${element.name}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 2rem auto; padding: 0 1rem; background-color: #f9f9f9; }
        .container { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #8B4513; border-bottom: 2px solid #D2B48C; padding-bottom: 0.5rem; }
        h2 { color: #8B4513; margin-top: 1.5rem; }
        pre { background: #f0f0f0; padding: 1rem; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; font-family: "Courier New", Courier, monospace; }
        .symbol { font-size: 3rem; float: right; margin-left: 1rem; }
        .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 4px;}
        .meta-item { display: flex; flex-direction: column; }
        .meta-item strong { color: #555; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .meta-item span { font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="container">
        <span class="symbol">${symbol}</span>
        <h1>${element.name}</h1>
        ${content}
    </div>
</body>
</html>`;
}

function buildMarkdown(element: ElementCard, content: string, format: 'regular' | 'homebrewery', emoji: string, symbol?: string) {
    if (format === 'homebrewery') {
        return `
> ##### ${element.name} ${emoji}
> ___
${symbol ? `> - **Symbol Name**: ${symbol}\n` : ''}
${content.replace(/^/gm, '> ')}
`.trim();
    } else {
        return `
# ${element.name} ${emoji}
${symbol ? `\n**Symbol Name**: ${symbol}\n` : ''}
${content}
`.trim();
    }
}

const typeIcons: { [key in ElementCard['type']]: string } = {
    Resource: '💎', Deity: '✨', Location: '🏞️', Faction: '🛡️', Settlement: '🏠',
    Event: '📜', Character: '👤', War: '⚔️', Monument: '🏛️',
};

/**
 * Generates and downloads an HTML file for a single element.
 */
export function exportElementToHtml(element: ElementCard, players: Player[]) {
    const filename = `${sanitizeFilename(element.name)}.html`;
    let metaContent = '', mainContent = '', symbol = '';
    
    switch (element.type) {
        case 'Resource':
            const resource = element.data as Resource;
            symbol = resource.symbol;
            metaContent = `<div class="meta-item"><strong>Type:</strong> <span>${element.type} (${resource.type})</span></div>`;
            mainContent = `<h2>Properties & Uniqueness</h2><pre>${resource.properties}</pre>`;
            break;
        case 'Deity':
            const deity = element.data as Deity;
            symbol = deity.emoji;
            metaContent = `<div class="meta-item"><strong>Type:</strong> <span>${element.type}</span></div><div class="meta-item"><strong>Domain:</strong> <span>${deity.domain}</span></div><div class="meta-item"><strong>Symbol:</strong> <span>${deity.symbol}</span></div>`;
            mainContent = `<h2>Description</h2><pre>${deity.description}</pre>`;
            break;
        case 'Location':
            const location = element.data as Location;
            symbol = location.symbol;
            metaContent = `<div class="meta-item"><strong>Type:</strong> <span>${element.type}</span></div><div class="meta-item"><strong>Site Type:</strong> <span>${location.siteType}</span></div>`;
            mainContent = `<h2>Description</h2><pre>${location.description}</pre>`;
            break;
        case 'Faction':
            const faction = element.data as Faction;
            symbol = faction.emoji;
            metaContent = `<div class="meta-item"><strong>Type:</strong> <span>${element.type}</span></div><div class="meta-item"><strong>Race:</strong> <span>${faction.race}</span></div><div class="meta-item"><strong>Leader:</strong> <span>${faction.leaderName}</span></div><div class="meta-item"><strong>Symbol Name:</strong> <span>${faction.symbolName}</span></div>${faction.capitalName ? `<div class="meta-item"><strong>Capital:</strong> <span>${faction.capitalName}</span></div>` : ''}`;
            mainContent = `<h2>Theme</h2><pre>${faction.theme}</pre><h2>Description</h2><pre>${faction.description}</pre>`;
            if (faction.industry) {
                mainContent += `<h2>Prosperity: ${faction.industry}</h2><pre>${faction.industryDescription || 'No details provided.'}</pre>`;
            }
            break;
        case 'Settlement':
            const settlement = element.data as Settlement;
            symbol = '🏠';
            metaContent = `<div class="meta-item"><strong>Type:</strong> <span>${element.type}</span></div><div class="meta-item"><strong>Purpose:</strong> <span>${settlement.purpose}</span></div>`;
            mainContent = `<h2>Description</h2><pre>${settlement.description || 'No description provided.'}</pre>`;
            break;
        case 'Event':
        case 'War':
        case 'Monument':
            const genericData = element.data as Event | War | Monument;
            symbol = typeIcons[element.type];
            metaContent = `<div class="meta-item"><strong>Type:</strong> <span>${element.type}</span></div>`;
            mainContent = `<h2>Description</h2><pre>${genericData.description || 'No description provided.'}</pre>`;
            break;
        case 'Character':
            const character = element.data as Character;
            symbol = typeIcons.Character;
            metaContent = `<div class="meta-item"><strong>Type:</strong> <span>${element.type}</span></div>`;
            mainContent = `<h2>Description</h2><pre>${character.description || 'No description provided.'}</pre>`;
            break;
    }

    const fullMeta = `
        <div class="meta-grid">
            ${metaContent}
            <div class="meta-item"><strong>Era:</strong> <span>${element.era}</span></div>
            ${element.createdYear ? `<div class="meta-item"><strong>Year:</strong> <span>${element.createdYear}</span></div>` : ''}
            ${element.creationStep ? `<div class="meta-item"><strong>Step:</strong> <span>${element.creationStep}</span></div>` : ''}
        </div>
    `;

    downloadFile(buildHtml(element, fullMeta + mainContent, symbol), filename, 'text/html');
}

/**
 * Generates and downloads a Markdown file for a single element.
 */
export function exportElementToMarkdown(element: ElementCard, players: Player[], format: 'regular' | 'homebrewery') {
    const filename = `${sanitizeFilename(element.name)}.md`;
    let metaContent = '', mainContent = '', emoji = '', symbolDesc = '';

    switch (element.type) {
        case 'Resource':
            const resource = element.data as Resource;
            emoji = resource.symbol;
            metaContent = `- **Type**: ${element.type} (${resource.type})`;
            mainContent = `## Properties & Uniqueness\n\n${resource.properties}`;
            break;
        case 'Deity':
            const deity = element.data as Deity;
            emoji = deity.emoji;
            symbolDesc = deity.symbol;
            metaContent = `- **Type**: ${element.type}\n- **Domain**: ${deity.domain}`;
            mainContent = `## Description\n\n${deity.description}`;
            break;
        case 'Location':
            const location = element.data as Location;
            emoji = location.symbol;
            metaContent = `- **Type**: ${element.type}\n- **Site Type**: ${location.siteType}`;
            mainContent = `## Description\n\n${location.description}`;
            break;
        case 'Faction':
            const faction = element.data as Faction;
            emoji = faction.emoji;
            symbolDesc = faction.symbolName;
            metaContent = `- **Type**: ${element.type}\n- **Race**: ${faction.race}\n- **Leader**: ${faction.leaderName}`;
            if(faction.capitalName) metaContent += `\n- **Capital**: ${faction.capitalName}`;
            mainContent = `## Theme\n\n${faction.theme}\n\n## Description\n\n${faction.description}`;
            if (faction.industry) {
                mainContent += `\n\n## Prosperity: ${faction.industry}\n\n${faction.industryDescription || 'No details provided.'}`;
            }
            break;
        case 'Settlement':
            const settlement = element.data as Settlement;
            emoji = '🏠';
            metaContent = `- **Type**: ${element.type}\n- **Purpose**: ${settlement.purpose}`;
            mainContent = `## Description\n\n${settlement.description || 'No description provided.'}`;
            break;
        case 'Character':
            const character = element.data as Character;
            emoji = typeIcons.Character;
            metaContent = `- **Type**: ${element.type}`;
            mainContent = `## Description\n\n${character.description || 'No description provided.'}`;
            break;
        case 'Event':
        case 'War':
        case 'Monument':
            const genericData = element.data as Event | War | Monument;
            emoji = typeIcons[element.type];
            metaContent = `- **Type**: ${element.type}`;
            mainContent = `## Description\n\n${genericData.description || 'No description provided.'}`;
            break;
    }

    let fullMeta = `${metaContent}\n- **Era**: ${element.era}`;
    if (element.createdYear) {
        fullMeta += `\n- **Year**: ${element.createdYear}`;
    }
    if (element.creationStep) {
        fullMeta += `\n- **Step**: ${element.creationStep}`;
    }
    const fullContent = `${fullMeta}${mainContent ? `\n\n${mainContent}`: ''}`;
    
    downloadFile(buildMarkdown(element, fullContent, format, emoji, symbolDesc), filename, 'text/markdown');
}