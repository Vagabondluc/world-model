import { create } from 'zustand';
import { weatherDb, isDatabaseAvailable, type DBWeather } from '../services/db';

/**
 * Weather Store - Weather state management
 *
 * Manages state for weather generation and editing.
 * Connected to Tauri backend for persistence.
 */

export interface Weather {
    id: string;
    name: string;
    season: string;
    climate: string;
    precipitation: string;
    wind: string;
    temperature: string;
    visibility: string;
    hazards: string[];
    promptContext: string;
    createdAt: string;
    updatedAt?: string;
}

export interface WeatherState {
    // Draft state
    name: string;
    season: string;
    climate: string;
    precipitation: string;
    wind: string;
    temperature: string;
    visibility: string;
    hazards: string[];
    promptContext: string;

    // Collection state
    weatherPatterns: Weather[];
    selectedWeatherId: string | null;

    // Loading state
    isLoading: boolean;
    error: string | null;
}

export interface WeatherActions {
    setName: (name: string) => void;
    setSeason: (season: string) => void;
    setClimate: (climate: string) => void;
    // Legacy alias used by older pages
    setWeatherClimate: (climate: string) => void;
    setPrecipitation: (precipitation: string) => void;
    setWind: (wind: string) => void;
    setTemperature: (temperature: string) => void;
    setVisibility: (visibility: string) => void;
    setHazards: (hazards: string[]) => void;
    setPromptContext: (promptContext: string) => void;

    setWeatherPatterns: (weatherPatterns: Weather[]) => void;
    addWeather: (weather: Weather) => Promise<void>;
    updateWeather: (id: string, updates: Partial<Weather>) => Promise<void>;
    deleteWeather: (id: string) => Promise<void>;
    setSelectedWeatherId: (id: string | null) => void;
    resetWeather: () => void;
    loadWeather: () => Promise<void>;
    clearError: () => void;
}

type WeatherStore = WeatherState & WeatherActions;

const initialState: WeatherState = {
    name: '',
    season: '',
    climate: '',
    precipitation: '',
    wind: '',
    temperature: '',
    visibility: '',
    hazards: [],
    promptContext: '',

    weatherPatterns: [],
    selectedWeatherId: null,
    isLoading: false,
    error: null,
};

// Helper to convert DB weather to frontend
function dbToWeather(db: DBWeather): Weather {
    return {
        id: db.id || '',
        name: db.name,
        season: '',
        climate: '',
        precipitation: '',
        wind: '',
        temperature: db.temperature_range || '',
        visibility: db.visibility || '',
        hazards: db.hazards || [],
        promptContext: db.description || '',
        createdAt: db.created_at || new Date().toISOString(),
        updatedAt: db.updated_at,
    };
}

// Helper to convert frontend weather to DB
function weatherToDb(w: Partial<Weather>): Partial<DBWeather> {
    return {
        id: w.id,
        name: w.name,
        weather_type: w.precipitation || 'clear',
        severity: 'moderate',
        description: w.promptContext,
        hazards: w.hazards,
        temperature_range: w.temperature,
        visibility: w.visibility,
    };
}

export const useWeatherStore = create<WeatherStore>()((set, get) => ({
    ...initialState,

    setName: (name) => set({ name }),
    setSeason: (season) => set({ season }),
    setClimate: (climate) => set({ climate }),
    setWeatherClimate: (climate) => set({ climate }),
    setPrecipitation: (precipitation) => set({ precipitation }),
    setWind: (wind) => set({ wind }),
    setTemperature: (temperature) => set({ temperature }),
    setVisibility: (visibility) => set({ visibility }),
    setHazards: (hazards) => set({ hazards }),
    setPromptContext: (promptContext) => set({ promptContext }),

    setWeatherPatterns: (weatherPatterns) => set({ weatherPatterns }),

    addWeather: async (weather) => {
        set({ isLoading: true, error: null });
        try {
            let newWeather = { ...weather };

            if (isDatabaseAvailable()) {
                const dbWeather = weatherToDb(weather) as DBWeather;
                const id = await weatherDb.create(dbWeather);
                newWeather = { ...weather, id };
            }

            set((state) => ({
                weatherPatterns: [...state.weatherPatterns, newWeather],
                isLoading: false,
            }));
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    updateWeather: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            if (isDatabaseAvailable()) {
                const dbUpdates = weatherToDb(updates) as DBWeather;
                await weatherDb.update(id, dbUpdates);
            }

            set((state) => ({
                weatherPatterns: state.weatherPatterns.map((w) =>
                    w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
                ),
                isLoading: false,
            }));
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    deleteWeather: async (id) => {
        set({ isLoading: true, error: null });
        try {
            if (isDatabaseAvailable()) {
                await weatherDb.delete(id);
            }

            set((state) => ({
                weatherPatterns: state.weatherPatterns.filter((w) => w.id !== id),
                selectedWeatherId: state.selectedWeatherId === id ? null : state.selectedWeatherId,
                isLoading: false,
            }));
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    setSelectedWeatherId: (id) => set({ selectedWeatherId: id }),

    resetWeather: () => set(initialState),

    loadWeather: async () => {
        set({ isLoading: true, error: null });
        try {
            if (isDatabaseAvailable()) {
                const dbList = await weatherDb.list();
                const weatherPatterns = dbList.map(dbToWeather);
                set({ weatherPatterns, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
