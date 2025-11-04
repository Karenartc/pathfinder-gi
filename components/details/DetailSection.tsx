import { ReactNode } from "react";
import styles from "./detail.module.css";

type Props = {
    title: string;
    children: ReactNode;
};

export default function DetailSection({ title, children }: Props) {
    return (
        <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionBody}>{children}</div>
        </section>
    );
}
