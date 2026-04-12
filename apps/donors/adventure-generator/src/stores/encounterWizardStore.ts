import { create } from 'zustand';
import { EncounterStage, EncounterSceneNode, AINarrativeResponse, FactionContext } from '../schemas/encounter';
import { generateSetupNode, generateApproachNode, generateTwistNode, generateChallengeNode, generateClimaxNode, generateAftermathNode } from '../utils/encounterGenerator';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { generateEncounterAIDraft } from '../services/encounterHandlers';
import { useCampaignStore } from './campaignStore';
import { JobPost } from '../schemas/tavern';
import { JobPost as ProceduralJobPost } from '../types/jobGenerator';
import type { DelveSceneNode } from '../types/delve';

interface EncounterWizardState {
    currentStage: EncounterStage;
    nodes: EncounterSceneNode[];
    encounterTitle: string;
    locationContext?: string;
    // Faction Clock Automation (DEC-077) - Extended faction context
    factionContext?: string[]; // Faction IDs for backward compatibility
    factionContextDetails?: FactionContext[]; // Detailed faction context with relationships
    // State for Stage 2
    approachMode: string;
    obstacles: string[];
    // State for Stage 3
    twistType: string;
    // State for Stage 4
    challengeType: string;
    challengeDifficulty: string;
    // State for Stage 5
    climaxType: string;
    // State for Stage 6
    aftermathType: string;
    // Final Editor State
    editedNarrative: string;
    // AI state
    aiDrafts: Record<string, AINarrativeResponse | null>;
    aiLoadingStage: EncounterStage | null;
    parentNodeId?: string;
    parentDungeonId?: string;
}

interface EncounterWizardActions {
    setStage: (stage: EncounterStage) => void;
    goToStage: (nextStage: EncounterStage) => void;
    updateNode: (node: EncounterSceneNode) => void;
    setEncounterTitle: (title: string) => void;
    setLocationContext: (context: string) => void;
    setFactionContext: (factionIds: string[]) => void;
    // Faction Clock Automation (DEC-077)
    addFactionContextDetail: (context: FactionContext) => void;
    removeFactionContextDetail: (factionId: string) => void;
    updateFactionContextDetail: (factionId: string, updates: Partial<FactionContext>) => void;
    // Stage 2 actions
    setApproachMode: (mode: string) => void;
    setObstacles: (obstacles: string[]) => void;
    generateApproachNodeAction: () => void;
    // Stage 3 actions
    setTwistType: (type: string) => void;
    generateTwistNodeAction: () => void;
    // Stage 4 actions
    setChallengeType: (type: string) => void;
    setChallengeDifficulty: (difficulty: string) => void;
    generateChallengeNodeAction: () => void;
    // Stage 5 actions
    setClimaxType: (type: string) => void;
    generateClimaxNodeAction: () => void;
    // Stage 6 actions
    setAftermathType: (type: string) => void;
    generateAftermathNodeAction: () => void;
    // Other actions
    generateSetupNodeAction: () => void;
    generateAIDraftAction: (apiService: ImprovedAdventureAPIService, nodeId: string) => Promise<void>;
    reset: () => void;
    initializeFromJob: (job: JobPost | ProceduralJobPost) => void;

    // Final Editor Actions
    setEditedNarrative: (narrative: string) => void;
    useProceduralDraft: () => void;
    useAIDraft: () => void;
    mergeDrafts: () => void;
    saveCurrentEdits: () => void;
    initializeFromRoom: (room: DelveSceneNode, dungeonId: string) => void;
}

const STAGE_ORDER: EncounterStage[] = ["Setup", "Approach", "Twist", "Challenge", "Climax", "Aftermath"];

const initialState: EncounterWizardState = {
    currentStage: "Setup",
    nodes: [],
    encounterTitle: '',
    locationContext: '',
    factionContext: [],
    factionContextDetails: [],
    approachMode: '',
    obstacles: [],
    twistType: '',
    challengeType: '',
    challengeDifficulty: 'Medium',
    climaxType: '',
    aftermathType: '',
    editedNarrative: '',
    aiDrafts: {},
    aiLoadingStage: null,
};

export const useEncounterWizardStore = create<EncounterWizardState & EncounterWizardActions>((set, get) => ({
    ...initialState,
    setStage: (stage) => set({ currentStage: stage }),
    goToStage: (nextStage) => {
        const { currentStage, editedNarrative, nodes } = get();

        const currentNode = nodes.find(n => n.stage === currentStage);

        const nodesWithSave = currentNode && editedNarrative !== currentNode.narrative
            ? nodes.map(n => n.id === currentNode.id ? { ...n, narrative: editedNarrative } : n)
            : nodes;

        const nextNode = nodesWithSave.find(n => n.stage === nextStage);

        set({
            nodes: nodesWithSave,
            currentStage: nextStage,
            editedNarrative: nextNode?.narrative || ''
        });
    },
    updateNode: (node) => set(state => {
        const newNodes = state.nodes.find(n => n.id === node.id)
            ? state.nodes.map(n => n.id === node.id ? node : n)
            : [...state.nodes, node];

        if (node.stage === state.currentStage) {
            return { nodes: newNodes, editedNarrative: node.narrative };
        }
        return { nodes: newNodes };
    }),
    setEncounterTitle: (title) => set({ encounterTitle: title }),
    setLocationContext: (context) => set({ locationContext: context }),
    setFactionContext: (factionIds) => set({ factionContext: factionIds }),

    // Faction Clock Automation (DEC-077)
    addFactionContextDetail: (context) => set(state => {
        // Check if faction already exists
        const existingIndex = state.factionContextDetails?.findIndex(fc => fc.factionId === context.factionId);
        let newDetails = state.factionContextDetails || [];
        
        if (existingIndex !== -1) {
            // Update existing
            newDetails = [...newDetails];
            newDetails[existingIndex] = context;
        } else {
            // Add new
            newDetails = [...newDetails, context];
        }
        
        // Also update factionContext IDs for backward compatibility
        const factionIds = newDetails.map(fc => fc.factionId);
        
        return {
            factionContext: factionIds,
            factionContextDetails: newDetails
        };
    }),

    removeFactionContextDetail: (factionId) => set(state => {
        const newDetails = (state.factionContextDetails || []).filter(fc => fc.factionId !== factionId);
        const factionIds = newDetails.map(fc => fc.factionId);
        
        return {
            factionContext: factionIds,
            factionContextDetails: newDetails
        };
    }),

    updateFactionContextDetail: (factionId, updates) => set(state => {
        const newDetails = (state.factionContextDetails || []).map(fc =>
            fc.factionId === factionId ? { ...fc, ...updates } : fc
        );
        
        return {
            factionContextDetails: newDetails
        };
    }),

    // Stage 2 actions
    setApproachMode: (mode) => set({ approachMode: mode }),
    setObstacles: (obstacles) => set({ obstacles }),
    generateApproachNodeAction: () => {
        const { approachMode, obstacles, updateNode } = get();
        if (!approachMode) return;
        const approachNode = generateApproachNode(approachMode, obstacles);
        updateNode(approachNode);
    },

    // Stage 3 actions
    setTwistType: (type) => set({ twistType: type }),
    generateTwistNodeAction: () => {
        const { twistType, updateNode } = get();
        if (!twistType) return;
        const twistNode = generateTwistNode(twistType);
        updateNode(twistNode);
    },

    // Stage 4 actions
    setChallengeType: (type) => set({ challengeType: type }),
    setChallengeDifficulty: (difficulty) => set({ challengeDifficulty: difficulty }),
    generateChallengeNodeAction: () => {
        const { challengeType, challengeDifficulty, updateNode } = get();
        if (!challengeType) return;
        const challengeNode = generateChallengeNode(challengeType, challengeDifficulty);
        updateNode(challengeNode);
    },

    // Stage 5 actions
    setClimaxType: (type) => set({ climaxType: type }),
    generateClimaxNodeAction: () => {
        const { climaxType, updateNode } = get();
        if (!climaxType) return;
        const climaxNode = generateClimaxNode(climaxType);
        updateNode(climaxNode);
    },

    // Stage 6 actions
    setAftermathType: (type) => set({ aftermathType: type }),
    generateAftermathNodeAction: () => {
        const { aftermathType, updateNode } = get();
        if (!aftermathType) return;
        const aftermathNode = generateAftermathNode(aftermathType);
        updateNode(aftermathNode);
    },

    generateSetupNodeAction: () => {
        const { locationContext, factionContext, updateNode } = get();
        if (!locationContext.trim()) return;
        const setupNode = generateSetupNode(locationContext, factionContext || []);
        updateNode(setupNode);
    },
    generateAIDraftAction: async (apiService, nodeId) => {
        const { nodes, locationContext, factionContext } = get();
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        set({ aiLoadingStage: node.stage });
        try {
            const campaignConfig = useCampaignStore.getState().config;

            // Build history for context (T-705)
            const currentIdx = STAGE_ORDER.indexOf(node.stage);
            const history = nodes.filter(n => STAGE_ORDER.indexOf(n.stage) < currentIdx);

            const aiDraft = await generateEncounterAIDraft(apiService, campaignConfig, node, locationContext || '', factionContext || [], history);

            set(state => ({
                aiDrafts: { ...state.aiDrafts, [nodeId]: aiDraft },
                aiLoadingStage: null,
            }));
        } catch (error) {
            console.error("Failed to generate AI draft for encounter:", error);
            set({ aiLoadingStage: null });
        }
    },
    reset: () => set(initialState),

    initializeFromJob: (job) => {
        get().reset();
        let context = `${job.summary}`;
        if ('details' in job && job.details) {
            context += `\n\nDetails: ${job.details}`;
        }
        set({
            encounterTitle: `Encounter for: ${job.title}`,
            locationContext: context,
        });
    },

    // Final Editor Actions
    setEditedNarrative: (narrative: string) => set({ editedNarrative: narrative }),
    useProceduralDraft: () => {
        const { nodes, currentStage, setEditedNarrative } = get();
        const currentNode = nodes.find(n => n.stage === currentStage);
        if (currentNode) {
            setEditedNarrative(currentNode.narrative);
        }
    },
    useAIDraft: () => {
        const { nodes, currentStage, aiDrafts, setEditedNarrative } = get();
        const currentNode = nodes.find(n => n.stage === currentStage);
        const draft = currentNode ? aiDrafts[currentNode.id] : null;
        if (draft) {
            setEditedNarrative(draft.narrative);
        }
    },
    mergeDrafts: () => {
        const { nodes, currentStage, aiDrafts, setEditedNarrative } = get();
        const currentNode = nodes.find(n => n.stage === currentStage);
        if (currentNode) {
            const aiDraft = aiDrafts[currentNode.id];
            const mergedText = `${currentNode.narrative}\n\n---\n\n**AI Enhancement:**\n${aiDraft ? aiDraft.narrative : ''}`;
            setEditedNarrative(mergedText);
        }
    },
    saveCurrentEdits: () => {
        const { currentStage, editedNarrative, nodes } = get();
        const currentNode = nodes.find(n => n.stage === currentStage);
        if (currentNode && editedNarrative !== currentNode.narrative) {
            set(state => ({
                nodes: state.nodes.map(n => n.id === currentNode.id ? { ...n, narrative: editedNarrative } : n)
            }));
        }
    },
    initializeFromRoom: (room, dungeonId) => {
        set({
            ...initialState,
            encounterTitle: `Room: ${room.title}`,
            locationContext: room.narrative,
            parentNodeId: room.id,
            parentDungeonId: dungeonId
        });
    },
}));
