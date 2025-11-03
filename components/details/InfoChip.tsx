import { ReactNode } from "react";
import styles from "./detail.module.css";

type Props = {
    icon: ReactNode;
    title: string;
    subtitle?: string;
};

export default function InfoChip({ icon, title, subtitle }: Props) {
    return (
        <div className={styles.chip}>
        <div className={styles.chipIcon}>{icon}</div>
        <div className={styles.chipContent}>
            <div className={styles.chipTitle}>{title}</div>
            {subtitle && <div className={styles.chipSubtitle}>{subtitle}</div>}
        </div>
        </div>
    );
}
