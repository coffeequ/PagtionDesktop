import { create } from "zustand";

type CoverImageStore = {
    url?: string
    isOpen: boolean;
    isRepalce?: boolean;
    setCoverImage: (url: string) => void; 
    onOpen: () => void;
    onClose: () => void;
    onReplace: (url: string) => void;
}

export const useCoverImage = create<CoverImageStore>((set) => ({
    url: undefined,
    isRepalce: false,
    isOpen: false,
    setCoverImage: (url) => {
        set({url});
    },
    onOpen: () => set((state => ({ isOpen: true, url: state.url, isRepalce: true }))),
    onClose: () => set((state) => ({ isOpen: false, url: state.url})),
    onReplace: (url: string) => {set({ isOpen: true, url })}
}))