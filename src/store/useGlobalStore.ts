import { create } from 'zustand';

type IGlobalState = {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
};

export const useGlobalStore = create<IGlobalState>((set) => ({
  isLoading: false,
  setIsLoading: (state) =>
    set(() => {
      return { isLoading: state };
    }),
}));
