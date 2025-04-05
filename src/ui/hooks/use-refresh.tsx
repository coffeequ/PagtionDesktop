import { create } from "zustand";


interface RefreshState {
    shouldRefresh: boolean;
    triggerRefresh: () => void;
}

const useRefreshStore = create<RefreshState>((set) => ({
    shouldRefresh: false,
    triggerRefresh: () => set((state) => ({shouldRefresh: !state.shouldRefresh})),
}));

export default useRefreshStore;