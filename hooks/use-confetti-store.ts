import { create } from 'zustand';

type ConfettiStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

/**
 * TODO: あとで調べる
 */
export const useConfettiStore = create<ConfettiStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
