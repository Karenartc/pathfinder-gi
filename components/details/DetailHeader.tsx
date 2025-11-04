'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import styles from "./detail.module.css";

type Props = {
    image: string;
    titleOverlap?: string;
    backHref?: string;
};

export default function DetailHeader({
    image,
    titleOverlap = "Detalles",
    backHref = ROUTES.userhome,
    }: Props) {
    const router = useRouter();

    const onBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        } else {
        router.push(backHref);
        }
    };

    return (
        <div className={styles.hero}>
        <img src={image} alt="" className={styles.heroImg} />
        <div className={styles.heroOverlay} />
        <button className={styles.backBtn} onClick={onBack} aria-label="Volver">
            <ArrowLeft size={20} />
            <span className={styles.backLabel}>Volver</span>
        </button>
        <div className={styles.heroBottom}>
            <span className={styles.heroKicker}>{titleOverlap}</span>
        </div>
        </div>
    );
}
