import {useId} from "react";
import styles from "./SettingsModal.module.css";
import {useWebSearchTool, useTheme} from "../../stores/settingsStore";

export function SettingsModal({isOpen, onClose}) {
    const [useWebSearch, setUseWebSearch] = useWebSearchTool();
    const [theme, setTheme] = useTheme();
    const themeSelectId = useId();

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.Backdrop}>
            <div className={styles.Modal}>
                <div className={styles.Header}>
                    <h3 className={styles.Title}>Settings</h3>
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
                            onChange={(e) => setTheme(e.target.value)}
                            className={styles.Select}
                        >
                            <option value="auto">Auto (System)</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
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
        </div>
    );
}
