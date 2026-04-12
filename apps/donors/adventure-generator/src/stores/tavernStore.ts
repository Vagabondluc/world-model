import { create } from 'zustand';
import { z } from 'zod';
import { JobPost, JobPostSchema, OracleOutcome, OracleResponse, OracleResponseSchema } from '../schemas/tavern';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { CONFIG } from '../data/constants';
import { JobPost as ProceduralJobPost, JobContext } from '../types/jobGenerator';
import { generateJobPost } from '../utils/jobGenerator';
import { generateId } from '../utils/helpers';
import { useCompendiumStore } from './compendiumStore';
import { useLocationStore } from './locationStore';
import { GroundingService } from '../services/GroundingService';

interface ChatMessage {
    id: string;
    sender: "npc" | "dm";
    content: string;
}

export type TavernPanel = "job-board" | "npc-chat" | "oracle" | "boxed-text" | "portrait" | "scene";

interface TavernState {
    activePanel: TavernPanel;
    activeNpcId: string | null;
    chatHistory: Record<string, ChatMessage[]>;
    jobPosts: (JobPost | ProceduralJobPost)[];
    oracleOutcomes: OracleOutcome[] | null;
    readAloudText: string | null;
    portraitUrl: string | null;
    sceneImageUrl: string | null;
    aiLoading: boolean;
    error: string | null;
}

interface TavernActions {
    setActivePanel: (panel: TavernPanel) => void;
    setActiveNpcId: (id: string | null) => void;
    generateJobPosts: (apiService: ImprovedAdventureAPIService, setting: string, theme: string) => Promise<void>;
    generateProceduralJobs: (context: JobContext, count?: number) => void;
    generateOraclePrediction: (apiService: ImprovedAdventureAPIService, situation: string) => Promise<void>;
    generateReadAloudText: (apiService: ImprovedAdventureAPIService, context: string, length: string, tone: string) => Promise<void>;
    streamNpcResponse: (apiService: ImprovedAdventureAPIService, message: string) => Promise<void>;
    generateNpcPortrait: (apiService: ImprovedAdventureAPIService, style: string) => Promise<void>;
    generateSceneImage: (apiService: ImprovedAdventureAPIService, description: string, time: string, weather: string) => Promise<void>;
    summarizeConversation: (apiService: ImprovedAdventureAPIService, npcId: string) => Promise<void>;
}

export const useTavernStore = create<TavernState & TavernActions>((set, get) => ({
    activePanel: "job-board",
    activeNpcId: null,
    chatHistory: {},
    jobPosts: [],
    oracleOutcomes: null,
    readAloudText: null,
    portraitUrl: null,
    sceneImageUrl: null,
    aiLoading: false,
    error: null,

    setActivePanel: (panel) => set({
        activePanel: panel,
        oracleOutcomes: null,
        readAloudText: null,
        portraitUrl: null,
        sceneImageUrl: null,
        error: null,
    }),
    setActiveNpcId: (id) => set({ activeNpcId: id }),

    generateJobPosts: async (apiService, setting, theme) => {
        set({ aiLoading: true, error: null });
        try {
            const prompt = `Generate 4 interesting D&D job board postings or quest hooks.
Setting Context: ${setting || 'A bustling fantasy tavern'}
Theme/Tone: ${theme}

Return an array of job posts with titles, summaries, potential complications, and rewards.`;

            const posts = await apiService.generateStructuredContent(
                prompt,
                z.array(JobPostSchema),
                CONFIG.AI_MODEL,
                "You are a creative Dungeon Master helper. Create engaging, specific side-quests."
            );

            set({ jobPosts: posts });
        } catch (e) {
            console.error("Failed to generate jobs:", e);
            set({ error: "Failed to generate job posts. Please try again." });
        } finally {
            set({ aiLoading: false });
        }
    },

    generateProceduralJobs: (context, count = 4) => {
        const posts: ProceduralJobPost[] = [];
        for (let i = 0; i < count; i++) {
            posts.push(generateJobPost(context));
        }
        set({ jobPosts: posts });
    },

    generateOraclePrediction: async (apiService, situation) => {
        set({ aiLoading: true, error: null, oracleOutcomes: null });
        try {
            const prompt = `You are a creative Dungeon Master's assistant, acting as an oracle. The DM has provided a situation and needs three distinct, interesting, and plausible outcomes.

Situation: "${situation}"

For each outcome, provide a title, the immediate result, and the consequences.`;

            const response = await apiService.generateStructuredContent(
                prompt,
                OracleResponseSchema,
                CONFIG.AI_MODEL,
                "You are an oracle that provides three potential futures. Be creative, concise, and focus on actionable consequences."
            ) as OracleResponse;

            set({ oracleOutcomes: response.outcomes });
        } catch (e) {
            console.error("Failed to generate oracle prediction:", e);
            set({ error: "The mists of fate are cloudy. The oracle could not provide an answer." });
        } finally {
            set({ aiLoading: false });
        }
    },

    generateReadAloudText: async (apiService, context, length, tone) => {
        set({ aiLoading: true, error: null, readAloudText: '' });

        const systemInstruction = "You are a master storyteller and Dungeon Master. Your task is to write immersive, sensory-rich 'read-aloud' text for a tabletop roleplaying game. Focus on what the characters see, hear, smell, and feel. Do not include game mechanics or metagame information.";

        const prompt = `Write a ${length} read-aloud description for a scene with a ${tone} tone.
Context: "${context}"`;

        try {
            await apiService.streamTextContent(
                prompt,
                CONFIG.AI_MODEL,
                systemInstruction,
                (chunk) => {
                    set({ readAloudText: chunk });
                }
            );
        } catch (e) {
            console.error("Failed to generate read-aloud text:", e);
            set({ error: "The muse is silent. Could not generate a description." });
        } finally {
            set({ aiLoading: false });
        }
    },

    streamNpcResponse: async (apiService, message) => {
        const { activeNpcId, chatHistory } = get();
        if (!activeNpcId) return;

        const npc = useCompendiumStore.getState().compendiumEntries.find(e => e.id === activeNpcId);
        if (!npc) return;

        const userMessage: ChatMessage = { id: generateId(), sender: 'dm', content: message };
        const currentHistory = chatHistory[activeNpcId] || [];

        set({
            aiLoading: true,
            error: null,
            chatHistory: { ...chatHistory, [activeNpcId]: [...currentHistory, userMessage] }
        });

        const modelMessageId = generateId();
        let fullResponse = '';

        const historyForPrompt = [...currentHistory, userMessage]
            .slice(-6) // Keep context window reasonable
            .map(m => `${m.sender === 'dm' ? 'You' : npc.title}: ${m.content}`)
            .join('\n');

        const prompt = `You are roleplaying as an NPC in a Dungeons & Dragons game.
### NPC Profile
**Name:** ${npc.title}
**Summary:** ${npc.summary}
**Full Details:** ${npc.fullContent}

### Your Task
Respond to the Dungeon Master's (DM) message as the NPC. Keep your response concise (1-3 sentences), in-character, and engaging. Do not break character.

### Conversation History
${historyForPrompt}

### Your Response as ${npc.title}:
`;

        const grounding = useLocationStore.getState().getGroundingContext();
        const baseSystem = "You are a master roleplayer embodying a fantasy character.";
        const finalSystem = grounding
            ? new GroundingService().constructSystemPrompt(baseSystem, grounding)
            : baseSystem;

        try {
            await apiService.streamTextContent(
                prompt,
                CONFIG.AI_MODEL,
                finalSystem,
                (chunk) => {
                    fullResponse = chunk;
                    set(state => {
                        const history = state.chatHistory[activeNpcId] || [];
                        const existingModelMsg = history.find(m => m.id === modelMessageId);
                        if (existingModelMsg) {
                            const updatedHistory = history.map(m => m.id === modelMessageId ? { ...m, content: fullResponse } : m);
                            return { chatHistory: { ...state.chatHistory, [activeNpcId]: updatedHistory } };
                        } else {
                            const modelMessage: ChatMessage = { id: modelMessageId, sender: 'npc', content: fullResponse };
                            return { chatHistory: { ...state.chatHistory, [activeNpcId]: [...history, modelMessage] } };
                        }
                    });
                }
            );
        } catch (e) {
            console.error("NPC Chat stream error:", e);
            const errorMessage: ChatMessage = { id: generateId(), sender: 'npc', content: "*The NPC seems lost in thought... (Error generating response)*" };
            set(state => ({
                error: "Failed to get a response from the NPC.",
                chatHistory: { ...state.chatHistory, [activeNpcId]: [...(state.chatHistory[activeNpcId] || []), errorMessage] }
            }));
        } finally {
            set({ aiLoading: false });
        }
    },

    generateNpcPortrait: async (apiService, style) => {
        set({ aiLoading: true, error: null, portraitUrl: null });
        const { activeNpcId } = get();
        if (!activeNpcId) {
            set({ aiLoading: false, error: "No NPC selected." });
            return;
        }
        const npc = useCompendiumStore.getState().compendiumEntries.find(e => e.id === activeNpcId);
        if (!npc) {
            set({ aiLoading: false, error: "Selected NPC not found." });
            return;
        }

        try {
            const prompt = `${style} portrait of a fantasy character named ${npc.title}. Description: ${npc.summary}. Details: ${npc.fullContent}`;
            const imageUrl = await apiService.generateImage(prompt);
            if (imageUrl) {
                set({ portraitUrl: imageUrl });
            } else {
                throw new Error("API returned no image.");
            }
        } catch (e) {
            console.error("Failed to generate portrait:", e);
            set({ error: "Failed to generate portrait. Please try again." });
        } finally {
            set({ aiLoading: false });
        }
    },

    generateSceneImage: async (apiService, description, time, weather) => {
        set({ aiLoading: true, error: null, sceneImageUrl: null });
        try {
            const prompt = `Fantasy landscape painting of ${description}. Time of day: ${time}. Weather: ${weather}.`;
            const imageUrl = await apiService.generateImage(prompt);
            if (imageUrl) {
                set({ sceneImageUrl: imageUrl });
            } else {
                throw new Error("API returned no image.");
            }
        } catch (e) {
            console.error("Failed to generate scene image:", e);
            set({ error: "Failed to generate scene image. Please try again." });
        } finally {
            set({ aiLoading: false });
        }
    },

    summarizeConversation: async (apiService, npcId) => {
        const history = get().chatHistory[npcId];
        if (!history || history.length === 0) return;

        set({ aiLoading: true, error: null });
        try {
            const transcript = history.map(m => `${m.sender === 'dm' ? 'DM' : 'NPC'}: ${m.content}`).join('\n');
            const prompt = `Based on the following conversation transcript between a DM and an NPC, provide a 1-2 sentence narrative summary of what was revealed, decided, or how the relationship changed. This will be used as a "memory" for the NPC.
            
Transcript:
${transcript}`;

            const summary = await apiService.generateTextContent(prompt, CONFIG.AI_MODEL, "You are a concise narrative archivist.");
            useCompendiumStore.getState().updateNpcMemory(npcId, summary.trim());
        } catch (e) {
            console.error("Failed to summarize conversation:", e);
            set({ error: "Failed to summarize the conversation into the NPC's memory." });
        } finally {
            set({ aiLoading: false });
        }
    }
}));
