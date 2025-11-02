"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./ranking.module.css";
import RankingHeader from "./RankingHeader";
import RankingList from "./RankingList";
import RankingToggle from "./RankingToggle";
import type { User } from "@/libs/types";

type Props = {
    globalData: User[];
    careerData: User[];
    currentUserId: string;
    userCareer: string;
};

export default function RankingView({
    globalData,
    careerData,
    currentUserId,
    userCareer,
    }: Props) {
    const [mode, setMode] = useState<"career" | "global">("global");

    const data = mode === "global" ? globalData : careerData;

    // Ordenar dataset
    const ordered = useMemo(
        () => [...data].sort((a, b) => b.points - a.points),
        [data]
    );

    // Scroll automático al usuario activo
    useEffect(() => {
        const timer = setTimeout(() => {
            const el = document.getElementById(`rank-${currentUserId}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 400);
        return () => clearTimeout(timer);
    }, [currentUserId, mode]);

    return (
        <>

        <header className={`${styles.fullBleed} ${styles.headerGradient}`}>
            <div className="container">
            <h1 className={styles.title}>Ranking</h1>
            <RankingHeader topUsers={ordered.slice(0, 3)} />
            </div>
        </header>

        <div className={styles.floatingToggle}>
            <RankingToggle mode={mode} onChange={setMode} />
        </div>

        <section className={`${styles.sectionScroll} section`}>
            <RankingList
            users={ordered}
            currentUserId={currentUserId}
            rightLabel="Puntos"
            emptyLabel={
                mode === "career"
                ? `Aún no hay ranking para ${userCareer}`
                : "Aún no hay ranking global"
            }
            />
        </section>
        </>
    );
}
