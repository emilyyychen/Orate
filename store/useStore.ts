/**
 * Minimal zustand-compatible store using React useSyncExternalStore.
 * Drop-in replacement that avoids the zustand npm dependency.
 */
import { useSyncExternalStore } from 'react';

/* ------------------------------------------------------------------ */
/*  Zustand-lite: create()                                            */
/* ------------------------------------------------------------------ */
type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
type StoreCreator<T> = (set: SetState<T>) => T;

function create<T>(creator: StoreCreator<T>) {
  let state: T;
  const listeners = new Set<() => void>();

  const set: SetState<T> = (partial) => {
    const next = typeof partial === 'function' ? (partial as (s: T) => Partial<T>)(state) : partial;
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  };

  state = creator(set);

  const getState = () => state;
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  function useStoreHook(): T;
  function useStoreHook<U>(selector: (state: T) => U): U;
  function useStoreHook<U>(selector?: (state: T) => U) {
    const getSnapshot = selector
      ? () => selector(getState())
      : () => getState();
    const snap = useSyncExternalStore(subscribe, getSnapshot as () => any, getSnapshot as () => any);
    return snap;
  }

  useStoreHook.getState = getState;
  useStoreHook.setState = set;
  return useStoreHook;
}

/* ------------------------------------------------------------------ */
/*  App State                                                         */
/* ------------------------------------------------------------------ */

export interface FocusArea {
  id: string;
  title: string;
  selected: boolean;
}

export interface AppState {
  /* user */
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
    joinedDate: string;
    tier: 'free' | 'pro';
  };

  /* onboarding */
  isOnboarded: boolean;
  setOnboarded: (v: boolean) => void;

  /* session */
  currentSessionId: string | null;
  isRecording: boolean;
  recordingSeconds: number;

  /* focus areas */
  focusAreas: FocusArea[];
  toggleFocus: (id: string) => void;

  /* reminders */
  remindersEnabled: boolean;
  reminderDays: string[];
  reminderTime: string;
  toggleReminders: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: {
    name: 'Emily',
    email: 'emily@orate.app',
    avatarUrl: null,
    joinedDate: 'Oct 2026',
    tier: 'free',
  },

  isOnboarded: false,
  setOnboarded: (v) => set({ isOnboarded: v }),

  currentSessionId: null,
  isRecording: false,
  recordingSeconds: 0,

  focusAreas: [
    { id: 'pacing', title: 'Pacing & pausing', selected: true },
    { id: 'filler', title: 'Filler words', selected: true },
    { id: 'structure', title: 'Structure & flow', selected: false },
    { id: 'storytelling', title: 'Storytelling', selected: false },
    { id: 'confidence', title: 'Confidence', selected: false },
    { id: 'vocal', title: 'Vocal variety', selected: false },
  ],
  toggleFocus: (id) =>
    set((s) => ({
      focusAreas: s.focusAreas.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f)),
    })),

  remindersEnabled: true,
  reminderDays: ['Mon', 'Wed', 'Fri'],
  reminderTime: '9:00 AM',
  toggleReminders: () => set((s) => ({ remindersEnabled: !s.remindersEnabled })),
}));
