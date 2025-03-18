import { create } from 'zustand';

type PageNavState = {
  isPageNavOpen: boolean;
  togglePageNav: () => void;
};

export const usePageNavStore = create<PageNavState>((set) => ({
  isPageNavOpen: true,
  togglePageNav: () => set((state) => ({ isPageNavOpen: !state.isPageNavOpen })),
}));