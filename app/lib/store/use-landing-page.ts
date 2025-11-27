// lib/store/useCounterStore.ts
import { create } from 'zustand';

// 1. Define the state shape (optional but recommended with TypeScript)
interface LandinPageState {
    hero_header: string;
    hero_content: string;
    loading: boolean;
    set_loading: () => void;
    events: any;
    set_events: (events: any) => void;
}

// 2. Create the store
export const useLandingPageStore = create<LandinPageState>((set) => ({
  // Iniiial State
  loading: false,
  hero_header: 'C.A.C Mount Zion',
  hero_content: 'Join us in the Kingdom Zone',
  set_loading: () => set((state) => ({loading: state.loading})),
  events: [],
  set_events: (events: any) => set((state) => ({events: events})),
}));