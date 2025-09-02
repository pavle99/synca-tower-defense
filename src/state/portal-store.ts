import { create } from "zustand";

type OpenPortal =
  | "map-editor"
  | "tower-dialog"
  | "help-dialog"
  | "mode-toggle"
  | null;

interface PortalStore {
  openPortal: OpenPortal;
  setOpenPortal: (openPortal: OpenPortal) => void;
}

export const usePortalStore = create<PortalStore>((set) => ({
  openPortal: null,
  setOpenPortal: (openPortal: OpenPortal) => set({ openPortal: openPortal }),
}));
