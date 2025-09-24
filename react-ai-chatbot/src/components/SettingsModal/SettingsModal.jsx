import styles from "./SettingsModal.module.css";

export function SettingsModal({
  isOpen,
  onClose,
  useWebSearch,
  onWebSearchChange,
}) {
  if (!isOpen) return null;

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
              onChange={onWebSearchChange}
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
