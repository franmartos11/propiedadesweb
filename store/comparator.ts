import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ComparatorState {
  propertyIds: string[];
  addProperty: (id: string) => void;
  removeProperty: (id: string) => void;
  clear: () => void;
}

export const useComparatorStore = create<ComparatorState>()(
  persist(
    (set) => ({
      propertyIds: [],
      addProperty: (id) =>
        set((state) => {
          if (state.propertyIds.includes(id)) return state;
          if (state.propertyIds.length >= 3) {
            // Cannot add more than 3
            return state;
          }
          return { propertyIds: [...state.propertyIds, id] };
        }),
      removeProperty: (id) =>
        set((state) => ({
          propertyIds: state.propertyIds.filter((p) => p !== id),
        })),
      clear: () => set({ propertyIds: [] }),
    }),
    {
      name: 'property-comparator-storage',
    }
  )
);
