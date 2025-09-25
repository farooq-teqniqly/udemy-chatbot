import {useId} from "react";
import styles from "./SettingsModal.module.css";
import {useWebSearchTool, useTheme, THEMES} from "../../stores/settingsStore";

export function SettingsModal({isOpen, onClose}) {
    const [useWebSearch, setUseWebSearch] = useWebSearchTool();
    const [theme, setTheme] = useTheme();
    const themeSelectId = useId();
    const titleId = useId();

    if (!isOpen) {
        return null;
    }

    const handleThemeChange = (theme) => {
        if (!Object.values(THEMES).includes(theme)) {
            return;
        }

        setTheme(theme);
    }

    return (<div className={styles.Backdrop}>
            <div className={styles.Modal}>
                <div className={styles.Header}>
                    <h3 id={titleId} className={styles.Title}>Settings</h3>
                </div>
                <div className={styles.Content}>
                    <label className={styles.CheckboxLabel}>
                        <input
                            type="checkbox"
                            checked={useWebSearch}
                            onChange={(e) => setUseWebSearch(e.target.checked)}
                            className={styles.Checkbox}
                        />
                        Use web search tool
                    </label>

                    <div className={styles.SettingGroup}>
                        <label className={styles.Label} htmlFor={themeSelectId}>Theme</label>
                        <select
                            id={themeSelectId}
                            value={theme}
                            onChange={(e) => handleThemeChange(e.target.value)}
                            className={styles.Select}
                        >
                            <option value={THEMES.AUTO}>Auto (System)</option>
                            <option value={THEMES.LIGHT}>Light</option>
                            <option value={THEMES.DARK}>Dark</option>
                        </select>
                    </div>
                </div>
                <div className={styles.Footer}>
                    <button
                        type="button"
                        className={styles.CloseButton}
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>);
}
