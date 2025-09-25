import {create} from "zustand";
import {persist} from "zustand/middleware";

export const SETTING_KEYS = Object.freeze({
    USE_WEB_SEARCH: "useWebSearch", THEME: "theme",
});

export const THEMES = Object.freeze({
    AUTO: "light dark", LIGHT: "light", DARK: "dark",
});

const getDefaultSettings = () => {
    return {
        [SETTING_KEYS.USE_WEB_SEARCH]: false, [SETTING_KEYS.THEME]: THEMES.AUTO,
    };
};

const ensureKeyExists = (key) => {
    if (!Object.values(SETTING_KEYS).includes(key)) {
        const error = `${key} is not a valid setting.`;
        console.error(error);
        throw new Error(error);
    }
};

export const useSettingsStore = create(persist((set, get) => ({
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
    resetSettings: () => {
        set(getDefaultSettings());

        try {
            useSettingsStore.persist.clearStorage();
        } catch (error) {
            console.error(error);
        }
    },
}), {
    name: "chatbot-settings", // localStorage key
}));

const selectUseWebSearch = (state) => state[SETTING_KEYS.USE_WEB_SEARCH];

export const useWebSearchTool = () => {
    const value = useSettingsStore(selectUseWebSearch);
    const updateSetting = useSettingsStore((state) => state.updateSetting);

    return [value, (newValue) => updateSetting(SETTING_KEYS.USE_WEB_SEARCH, newValue),];
};

const selectTheme = (state) => state[SETTING_KEYS.THEME];

export const useTheme = () => {
    const value = useSettingsStore(selectTheme);
    const updateSetting = useSettingsStore((state) => state.updateSetting);

    return [value, (newValue) => updateSetting(SETTING_KEYS.THEME, Object.values(THEMES).includes(newValue) ? newValue : THEMES.AUTO)];
};
