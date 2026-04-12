import { marked } from 'marked';
import { SavedMonster } from '../types/npc';

function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

function formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

const renderPropertyLine = (label: string, value: string | undefined | null) => {
    if (!value) return '';
    return `<p><strong>${label}</strong> ${value}</p>`;
}

const renderListProperty = (label: string, items: string[] | undefined | null) => {
    if (!items || items.length === 0) return '';
    return `<p><strong>${label}</strong> ${items.join(', ')}</p>`;
}

export function renderMonsterStatblock(monster: SavedMonster): string {
    const { name, profile } = monster;
    const {
        table,
        abilityScores,
        savingThrows,
        skills,
        damageVulnerabilities,
        damageResistances,
        damageImmunities,
        conditionImmunities,
        abilitiesAndTraits,
        actions,
        legendaryActions
    } = profile;

    const abilityScoreTable = abilityScores ? `
        <table>
            <thead>
                <tr>
                    <th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${abilityScores.str} (${formatModifier(getAbilityModifier(abilityScores.str as number))})</td>
                    <td>${abilityScores.dex} (${formatModifier(getAbilityModifier(abilityScores.dex as number))})</td>
                    <td>${abilityScores.con} (${formatModifier(getAbilityModifier(abilityScores.con as number))})</td>
                    <td>${abilityScores.int} (${formatModifier(getAbilityModifier(abilityScores.int as number))})</td>
                    <td>${abilityScores.wis} (${formatModifier(getAbilityModifier(abilityScores.wis as number))})</td>
                    <td>${abilityScores.cha} (${formatModifier(getAbilityModifier(abilityScores.cha as number))})</td>
                </tr>
            </tbody>
        </table>
    ` : '';
    
    let savingThrowsHtml = '';
    if (savingThrows && Object.keys(savingThrows).length > 0) {
        const saves = Object.entries(savingThrows).map(([stat, value]) => `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${formatModifier(value as number)}`).join(', ');
        savingThrowsHtml = renderPropertyLine('Saving Throws', saves);
    }
    
    let skillsHtml = '';
    if (skills && Object.keys(skills).length > 0) {
        const skillList = Object.entries(skills).map(([skill, value]) => `${skill} ${formatModifier(value as number)}`).join(', ');
        skillsHtml = renderPropertyLine('Skills', skillList);
    }

    const traitsHtml = abilitiesAndTraits ? marked.parse(abilitiesAndTraits) as string : '';
    const actionsHtml = actions ? `<h3>Actions</h3>${marked.parse(actions) as string}` : '';
    const legendaryActionsHtml = legendaryActions ? `<h3>Legendary Actions</h3>${marked.parse(legendaryActions) as string}` : '';

    return `
        <h3>${name}</h3>
        <p><em>${table.size} ${table.creatureType}, ${table.alignment}</em></p>
        <hr>
        ${renderPropertyLine('Armor Class', table.armorClass)}
        ${renderPropertyLine('Hit Points', table.hitPoints)}
        ${renderPropertyLine('Speed', table.speed)}
        <hr>
        ${abilityScoreTable}
        <hr>
        ${savingThrowsHtml}
        ${skillsHtml}
        ${renderListProperty('Damage Vulnerabilities', damageVulnerabilities)}
        ${renderListProperty('Damage Resistances', damageResistances)}
        ${renderListProperty('Damage Immunities', damageImmunities)}
        ${renderListProperty('Condition Immunities', conditionImmunities)}
        ${renderPropertyLine('Senses', table.senses)}
        ${renderPropertyLine('Languages', table.languages)}
        ${renderPropertyLine('Challenge', table.challengeRating)}
        <hr>
        ${traitsHtml}
        ${actionsHtml}
        ${legendaryActionsHtml}
    `;
}