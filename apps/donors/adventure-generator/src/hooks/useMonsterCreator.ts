
import { useState, useCallback } from 'react';
import { z } from "zod";
import { SavedMonster } from '../types/npc';
import { CONFIG } from '../data/constants';
import { buildImprovedSystemPrompt } from '../services/promptBuilder';
import { generateId, getErrorMessage } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';
import { useCampaignStore } from '../stores/campaignStore';
import { useWorkflowStore } from '../stores/workflowStore';
import { CreatureDetailsSchema } from '../schemas';
import { useMonsterCreatorStore } from '../stores/monsterCreatorStore';
import { generatePowers, assembleMonsterFromPowers, buildBudget } from '../services/monsterPowerGenerator';
import { SeededRNG } from '../utils/seededRng';
import { Context, AlignTendency } from '../types/monsterGrammar';
import { ALL_RULES } from '../data/monsterRules/index';
import { GRAMMAR_TAGS } from '../data/grammarTags';
import { useEffect } from 'react';
import { useJobQueue, JobStatus } from './useJobQueue';
import { solveCR } from '../utils/monsterScaler';
import { calculateCR } from '../utils/crCalculator';

export const useMonsterCreator = () => {
    const { apiService } = useAppContext();
    const campaignConfig = useCampaignStore(s => s.config);
    const addToBestiary = useCampaignStore(s => s.addToBestiary);
    const showSystemMessage = useCampaignStore(s => s.showSystemMessage);
    const { error, setError } = useWorkflowStore();

    const store = useMonsterCreatorStore();

    const [generatedMonster, setGeneratedMonster] = useState<SavedMonster | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const modelName = campaignConfig.aiModel || CONFIG.AI_MODEL;

    const handleProceduralGeneration = useCallback(() => {
        setIsGenerating(true);
        setError(null);

        setTimeout(() => {
            try {
                const rng = new SeededRNG(store.lastGenerationSeed);
                const finalBudget = buildBudget(store.role, store.budgetOverrides);

                const context: Context = {
                    cr: store.cr,
                    role: store.role,
                    alignment: store.alignment as AlignTendency,
                    tags: store.tags,
                    env: '',
                    rng: () => rng.nextFloat(),
                    budget: finalBudget,
                    graph: { atoms: [], tags: new Set() }
                };

                const atoms = generatePowers(context, ALL_RULES, store.complexity);

                const tagsReadable = store.tags.map(id => GRAMMAR_TAGS.find(t => t.id === id)?.name || id).join(', ');
                const genName = store.name || `Procedural ${tagsReadable} ${store.role}`;
                const genDesc = store.concept || `A ${store.role} creature embodying the powers of ${tagsReadable}.`;

                const monster = assembleMonsterFromPowers(
                    genName,
                    genDesc,
                    store.cr,
                    store.role,
                    store.alignment as AlignTendency,
                    store.creatureType,
                    store.size,
                    atoms
                );

                setGeneratedMonster(monster);
                store.setLastGenerationSeed(crypto.randomUUID());
            } catch (e) {
                console.error("Procedural gen error", e);
                setError("Failed to generate monster procedurally.");
            } finally {
                setIsGenerating(false);
            }
        }, 50);
    }, [store, setError]);

    const { submitJob, status: jobStatus, result: jobResult, error: jobError, reset: resetJob, position } = useJobQueue();

    const solverResult = useMonsterCreatorStore(s => s.solverResult);

    // Effect to handle queue completion (Optimistic UI update)
    useEffect(() => {
        if (jobStatus === JobStatus.COMPLETED && jobResult) {
            try {
                // Parse the JSON result
                let parsed = typeof jobResult === 'string' ? JSON.parse(jobResult) : jobResult;

                // If it's wrapped in a "response" or similar key (some providers do this), handle it
                // But generally backend LLMService returns content string.
                if (typeof parsed === 'string') {
                    // Double parse if backend returned stringified JSON inside content string
                    parsed = JSON.parse(parsed);
                }

                // Validate with Zod
                const schema = z.object({
                    name: z.string(),
                    description: z.string(),
                    profile: CreatureDetailsSchema
                });

                const validated = schema.parse(parsed);

                const newMonster: SavedMonster = {
                    id: generateId(),
                    name: validated.name,
                    description: validated.description,
                    profile: validated.profile
                };

                setGeneratedMonster(newMonster);
                setIsGenerating(false);     // Reset Local State
                showSystemMessage('success', `Successfully generated "${newMonster.name}"!`);

                // Cleanup job state
                resetJob();
            } catch (e) {
                console.error("Failed to parse queue result", e);
                setError("AI generation failed to produce valid data.");
                setIsGenerating(false);
            }
        } else if (jobStatus === JobStatus.FAILED) {
            setError(jobError || "AI generation failed.");
            setIsGenerating(false);
            resetJob();
        }
    }, [jobStatus, jobResult, jobError, setError, showSystemMessage, resetJob, store]);

    const handleAIGeneration = useCallback(async () => {
        // Validation (keep existing)
        if (!store.cr) { setError("CR is required."); return; }

        setGeneratedMonster(null);
        setIsGenerating(true); // UI Loading State
        setError(null);
        resetJob(); // Clear previous job

        try {
            const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
            const tagsReadable = store.tags.map(id => GRAMMAR_TAGS.find(t => t.id === id)?.name || id).join(', ');

            let userPrompt = `Create a D&D 5e monster statblock based on the following constraints:\n`;
            userPrompt += `- **Name:** ${store.name || "Create a fitting name"}\n`;
            userPrompt += `- **CR:** ${store.cr}\n`;
            userPrompt += `- **Role:** ${store.role}\n`;
            userPrompt += `- **Type:** ${store.creatureType}\n`;
            userPrompt += `- **Size:** ${store.size}\n`;
            userPrompt += `- **Alignment:** ${store.alignment}\n`;
            userPrompt += `- **Tags/Themes:** ${tagsReadable || "Any"}\n`;

            if (store.concept) {
                userPrompt += `\n**Concept / Visuals:**\n"${store.concept}"\n`;
            } else {
                userPrompt += `\n**Concept:** Create a unique and thematic creature fitting the above constraints.`;
            }

            // Append strict JSON instruction
            userPrompt += `\n\nIMPORTANT: Respond ONLY with valid JSON matching this structure:
{
  "name": "string",
  "description": "string",
  "profile": { ... standard dnd statblock fields ... }
}
ensure 'profile' matches the expected 5e statblock schema fully.`;

            // Submit to Queue
            await submitJob("generate", {
                prompt: userPrompt,
                system: systemInstruction,
                model: modelName,
                response_format: { type: "json_object" } // Kwarg for LLMService
            });

            // Note: We don't await result here. The useEffect handles it.

        } catch (e) {
            console.error(`Error submitting job:`, e);
            setError(getErrorMessage(e as Error, 'submitting generation job'));
            setIsGenerating(false);
        }
    }, [campaignConfig, modelName, setError, store, submitJob, resetJob]);

    const handleSave = useCallback((monster: SavedMonster) => {
        addToBestiary(monster);
        showSystemMessage('success', `"${monster.name}" saved to your Bestiary!`);
    }, [addToBestiary, showSystemMessage]);

    // CR Solver Functions
    const handleSolveCR = useCallback(async () => {
        if (!generatedMonster || store.targetCR === null) return;

        store.setIsSolving(true);
        store.resetSolverResult();

        // Use setTimeout to allow UI to update before running solver
        setTimeout(() => {
            try {
                const result = solveCR(
                    generatedMonster,
                    store.targetCR!,
                    store.solverOptions
                );
                store.setSolverResult(result);
            } catch (e) {
                console.error("CR solver error", e);
                setError("Failed to solve CR. See console for details.");
            } finally {
                store.setIsSolving(false);
            }
        }, 50);
    }, [generatedMonster, store, setError]);

    const handleApplySolverResult = useCallback(() => {
        if (!solverResult || !generatedMonster) return;

        // Use the modified monster from the solver result
        const adjustedMonster = solverResult.modifiedMonster;

        // Update the generated monster with the adjusted version
        setGeneratedMonster(adjustedMonster);

        showSystemMessage('success', 'CR adjustments applied!');
        store.resetSolverResult();
    }, [solverResult, generatedMonster, store, showSystemMessage]);

    const handleCancelSolverResult = useCallback(() => {
        store.resetSolverResult();
    }, [store]);

    return {
        isGenerating,
        generatedMonster,
        error,
        handleAIGeneration,
        handleProceduralGeneration,
        handleSave,
        updateGeneratedMonster: setGeneratedMonster,
        clearError: () => setError(null),
        // Queue Info
        jobStatus,
        queuePosition: position,
        // CR Solver
        handleSolveCR,
        handleApplySolverResult,
        handleCancelSolverResult,
        solverResult
    };
};
