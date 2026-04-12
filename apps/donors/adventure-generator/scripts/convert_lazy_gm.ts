
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

// Paths
const INPUT_DIR = path.resolve('temp_lazy_gm_tools/5e_artisanal_database');
const OUTPUT_DIR = path.resolve('srd_export');

// Mappings
async function convertMonsters() {
    const monstersPath = path.join(INPUT_DIR, 'monsters/monsters.json');
    const outputMonstersPath = path.join(OUTPUT_DIR, 'monsters');

    await fs.mkdir(outputMonstersPath, { recursive: true });

    console.log(`Reading ${monstersPath}...`);
    const rawData = await fs.readFile(monstersPath, 'utf-8');
    const monsters = JSON.parse(rawData);

    console.log(`Found ${monsters.length} monsters. Converting...`);

    let count = 0;
    for (const m of monsters) {
        if (!m.name) continue;

        try {
            const slug = m.slug || m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const outFile = path.join(outputMonstersPath, `${slug}.yaml`);

            // Parse embedded JSON fields
            const actions = safeJsonParse(m.actions_json);
            const abilities = safeJsonParse(m.special_abilities_json);
            const legendary = safeJsonParse(m.legendary_actions_json);
            const speed = safeJsonParse(m.speed_json);
            const skills = safeJsonParse(m.skills_json);

            // Format Markdown content
            const actionMarkdown = formatActions(actions);
            const abilitiesMarkdown = formatActions(abilities); // Same format usually
            const legendaryMarkdown = formatActions(legendary);

            // Format Speed string
            const speedStr = Object.entries(speed || {}).map(([k, v]) => `${k} ${v} ft.`).join(', ');

            // Derive Source from slug or other logic
            const source = deriveSource(slug);

            // Construct YAML Object matching CreatureDetailsSchema
            const monsterData = {
                id: slug,
                name: m.name,
                source: source, // Injected Source ID
                type: m.type,
                statblock: generateStatblockSummary(m),
                details: {
                    table: {
                        creatureType: `${m.type}${m.subtype ? ` (${m.subtype})` : ''}`,
                        size: m.size,
                        alignment: m.alignment,
                        armorClass: `${m.armor_class}${m.armor_desc ? ` (${m.armor_desc})` : ''}`,
                        hitPoints: `${m.hit_points} (${m.hit_dice})`,
                        speed: speedStr || "30 ft.",
                        challengeRating: m.challenge_rating || "0",
                        role: "Unknown", // Not present in source
                        senses: m.senses || "",
                        languages: m.languages || "",
                        keyAbilities: "" // Not easily derived
                    },
                    abilityScores: {
                        str: m.strength || 10,
                        dex: m.dexterity || 10,
                        con: m.constitution || 10,
                        int: m.intelligence || 10,
                        wis: m.wisdom || 10,
                        cha: m.charisma || 10
                    },
                    savingThrows: {
                        // Mapper needed for saves if desired, omitting for brevity/schema optionality
                    },
                    skills: skills,
                    damageVulnerabilities: m.damage_vulnerabilities && m.damage_vulnerabilities !== "False" ? m.damage_vulnerabilities.split(', ') : [],
                    damageResistances: m.damage_resistances && m.damage_resistances !== "False" ? m.damage_resistances.split(', ') : [],
                    damageImmunities: m.damage_immunities && m.damage_immunities !== "False" ? m.damage_immunities.split(', ') : [],
                    conditionImmunities: m.condition_immunities && m.condition_immunities !== "False" ? m.condition_immunities.split(', ') : [],

                    abilitiesAndTraits: abilitiesMarkdown,
                    actions: actionMarkdown,
                    legendaryActions: legendaryMarkdown,
                    roleplayingAndTactics: ""
                }
            };

            const yamlStr = yaml.dump(monsterData);
            await fs.writeFile(outFile, yamlStr);
            count++;
        } catch (err) {
            console.error(`Failed to convert ${m.name}:`, err);
        }
    }

    console.log(`Converted ${count} monsters.`);
}

function deriveSource(slug: string): string {
    if (slug.endsWith('-a5e')) return 'a5e';
    if (slug.endsWith('-tob1-2023')) return 'tome-of-beasts-1-2023';
    if (slug.endsWith('-bf')) return 'black-flag';
    if (slug.endsWith('-fof')) return 'forge-of-foes';
    if (slug.endsWith('-cc')) return 'srd-5.1'; // Creative Commons 5.1 often marked with cc
    // Default to SRD 5.1 if no known suffix, or mixed
    return 'srd-5.1';
}

function safeJsonParse(str: string | null) {
    if (!str || str === 'null' || str === 'False') return null;
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}

function formatActions(actions: any[]) {
    if (!actions || !Array.isArray(actions)) return "";
    return actions.map(a => `**${a.name}.** ${a.desc}`).join('\n\n');
}

function generateStatblockSummary(m: any) {
    return `**Armor Class** ${m.armor_class}
**Hit Points** ${m.hit_points}
**Speed** ${m.speed_json ? JSON.stringify(m.speed_json).replace(/[{"}]/g, '').replace(/:/g, ' ') : ''}`;
}

convertMonsters().catch(console.error);
