
import { Context, PowerAtom, Rule } from '../types/monsterGrammar';
export { assembleMonsterFromPowers } from '../utils/monsterAssembler';
export { buildBudget } from '../utils/monsterMechanics';

export function generatePowers(ctx: Context, rules: Rule[], complexity: 'Simple' | 'Standard' | 'Complex'): PowerAtom[] {
    const out: PowerAtom[] = [];
    const applied = new Set<string>();
    let budget = { ...ctx.budget };

    const complexityMultiplier = {
        'Simple': 1.25,
        'Standard': 1.0,
        'Complex': 0.8
    }[complexity];

    // Filter valid rules first
    const validRules = rules.filter(r => {
        const w = r.when;
        if (r.oncePerMonster && applied.has(r.id)) return false;
        if (r.guards && !r.guards(ctx)) return false;

        // Check Constraints
        if (w.minCR && ctx.cr < w.minCR) return false;
        if (w.maxCR && ctx.cr > w.maxCR) return false;
        if (w.roles && !w.roles.includes(ctx.role)) return false;
        if (w.align && !w.align.includes(ctx.alignment)) return false;

        // Tag Logic (AND) - Combination Rules
        if (w.requireTagsAll) {
            if (!w.requireTagsAll.every(t => ctx.tags.includes(t))) return false;
        }

        // Tag Logic (OR) - Standard Rules
        // If a rule requires specific tags (OR), the monster must have at least one.
        // If requireTags is undefined, it's a generic rule (allowed for everyone unless forbidden).
        if (w.requireTags) {
            if (!w.requireTags.some(t => ctx.tags.includes(t))) return false;
        }

        // Forbid Logic
        if (w.forbidTags && w.forbidTags.some(t => ctx.tags.includes(t))) return false;

        return true;
    });

    // Helper to pick from a list based on budget
    const pickAndApply = (candidates: Rule[]) => {
        if (candidates.length === 0) return false;

        const affordable = candidates.filter(r =>
            Object.entries(r.budgetUse || {}).every(([k, v]) => {
                const key = k as keyof typeof budget;
                const value = v ?? 0;
                return budget[key] >= value * complexityMultiplier;
            })
        );

        if (affordable.length === 0) return false;

        const sum = affordable.reduce((s, r) => s + r.weight, 0);
        let pick = ctx.rng() * sum;
        let rule = affordable[0];
        for (const r of affordable) {
            pick -= r.weight;
            if (pick <= 0) { rule = r; break; }
        }

        const atoms = rule.produce(ctx);
        out.push(...atoms);
        atoms.forEach(a => a.tags?.forEach(t => ctx.graph.tags.add(t)));
        
        for (const [k, v] of Object.entries(rule.budgetUse || {})) {
            const key = k as keyof typeof budget;
            const value = v ?? 0;
            budget[key] = Math.max(0, budget[key] - value * complexityMultiplier);
        }
        applied.add(rule.id);
        return true;
    };

    // Split rules into Combinations (High Specificity) and Standard
    const comboRules = validRules.filter(r => r.when.requireTagsAll && r.when.requireTagsAll.length > 1);
    const standardRules = validRules.filter(r => !comboRules.includes(r));

    // Generation Loop
    let attempts = 0;
    const maxActions = 10;
    
    // Pass 1: Try to force at least one combo rule if applicable
    if (comboRules.length > 0) {
         pickAndApply(comboRules);
    }

    // Pass 2: Fill with standard rules
    while (out.length < maxActions && attempts < 20) {
        // We can mix combo and standard rules here, but standard rules are more likely to fill gaps.
        // Let's prioritize standard rules for the remaining slots to ensure basic functionality.
        const success = pickAndApply(standardRules.length > 0 ? standardRules : validRules);
        if (!success) break; // Out of budget or rules
        attempts++;
    }

    return out;
}
