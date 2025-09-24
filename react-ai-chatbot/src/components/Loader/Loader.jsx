import styles from "./Loader.module.css";

export function Loader() {
    return (
        <div className={styles.LoaderWrapper} role="status" aria-live="polite">
            <div className={styles.Loader} aria-label="Loading..."></div>
        </div>
    );
}
