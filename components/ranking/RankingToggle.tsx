"use client";
import styles from "./ranking.module.css";

type Props = {
    mode: "career" | "global";
    onChange: (m: "career" | "global") => void;
};

export default function RankingToggle({ mode, onChange }: Props) {
    return (
        <div className={styles.toggleWrap} role="tablist" aria-label="Tipo de ranking">
        <button
            role="tab"
            aria-selected={mode === "career"}
            className={`${styles.toggleBtn} ${mode === "career" ? styles.active : ""}`}
            onClick={() => onChange("career")}
        >
            Mi Carrera
        </button>
        <button
            role="tab"
            aria-selected={mode === "global"}
            className={`${styles.toggleBtn} ${mode === "global" ? styles.active : ""}`}
            onClick={() => onChange("global")}
        >
            Global
        </button>
        </div>
    );
}
