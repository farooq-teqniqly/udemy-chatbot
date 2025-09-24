import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useSettingsStore = create(
    persist(
        (set) => ({
            // Settings state
            useWebSearch: false,

            // Actions for individual settings
            setUseWebSearch: (value) => set({useWebSearch: value}),

            // Reset to defaults
            resetSettings: () =>
                set({
                    useWebSearch: false,
                }),
        }),
        {
            name: "chatbot-settings", // localStorage key
        }
    )
);