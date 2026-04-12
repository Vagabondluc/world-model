import { get, set, del } from 'idb-keyval';
import { PersistStorage, StorageValue } from 'zustand/middleware';
import { reviveState, serializeState } from '../logic/serialization';

// Custom storage adapter that handles Map and Set serialization
// because standard JSON.stringify does not support them.
export const customStorage: PersistStorage<any> = {
  getItem: async (name: string) => {
    try {
      const data = await get(name);
      if (!data) return null;

      // Revive Maps and Sets in the state object
      if (data.state) {
        data.state = reviveState(data.state);
      }
      return data;
    } catch (e) {
      console.error("[StorageAdapter] Rehydration failure:", e);
      return null;
    }
  },

  setItem: async (name: string, value: StorageValue<any>) => {
    try {
      // Serialize Maps to Entry Arrays using shared logic
      const serialized = {
        ...value,
        state: serializeState(value.state)
      };

      await set(name, serialized);
    } catch (e) {
      console.error("[StorageAdapter] Serialization failure:", e);
    }
  },

  removeItem: async (name: string) => {
    await del(name);
  }
};