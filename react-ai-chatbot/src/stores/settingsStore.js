import {create} from "zustand";
import {persist} from "zustand/middleware";

export const SETTING_KEYS = {
    USE_WEB_SEARCH: "useWebSearch"
};

const getDefaultSettings = () => {
    return {
        [SETTING_KEYS.USE_WEB_SEARCH]: false
    }
};

const ensureKeyExists = (key) => {
    if (!Object.values(SETTING_KEYS).includes(key)) {
        const error = `${key} is not a valid setting.`
        console.error(error);
        throw new Error(error);
    }
}

export const useSettingsStore = create(
    persist(
        (set, get) => ({
            // Initialize with default settings
            ...getDefaultSettings(),

            // Generic action for any setting
            updateSetting: (key, value) => {
                ensureKeyExists(key);

                const currentState = get();

                if (currentState[key] === value) {
                    return;
                }

                set({[key]: value});
            },

            getSetting: (key) => {
                ensureKeyExists(key);
                return get()[key];
            },

            // Reset to defaults
            resetSettings: () =>
                set(getDefaultSettings()),
        }),
        {
            name: "chatbot-settings", // localStorage key
        }
    )
);

const selectUseWebSearch = (state) => state[SETTING_KEYS.USE_WEB_SEARCH];

export const useWebSearchTool = () => {
    const value = useSettingsStore(selectUseWebSearch);
    const updateSetting = useSettingsStore((state) => state.updateSetting);

    return [
        value,
        (newValue) => updateSetting(SETTING_KEYS.USE_WEB_SEARCH, newValue)
    ];
};