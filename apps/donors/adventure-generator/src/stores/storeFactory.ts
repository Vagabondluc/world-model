import { create, type StateCreator } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';

export const createStore = <T>(creator: StateCreator<T>) => create<T>(creator);

export const createPersistedStore = <T>(
    creator: StateCreator<T>,
    options: PersistOptions<T>
) => create<T>()(persist(creator, options));
