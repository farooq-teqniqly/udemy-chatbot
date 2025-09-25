import styles from "./SettingsModal.module.css";
import {useWebSearchTool} from "../../stores/settingsStore";

export function SettingsModal({
                                  isOpen,
                                  onClose
                              }) {

    const [useWebSearch, setUseWebSearch] = useWebSearchTool();

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
                </div>
                <div className={styles.Footer}>
                    <button className={styles.CloseButton} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
