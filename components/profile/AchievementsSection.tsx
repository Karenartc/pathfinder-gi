"use client";

import { Star, BookOpenCheck, QrCode, CalendarDays } from "lucide-react";
import type { Achievement } from "@/libs/types";
import styles from "./AchievementsSection.module.css";

export default function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
    const getIcon = (a: Achievement) => {
        if (a.name.toLowerCase().includes("curso")) return <BookOpenCheck />;
        if (a.name.toLowerCase().includes("biblioteca")) return <QrCode />;
        if (a.name.toLowerCase().includes("clase")) return <CalendarDays />;
        return <Star />;
    };

    return (
        <div className={styles.achievements}>
        <header className={styles.header}>
            <h3>Logros Recientes</h3>
        </header>

        <div className={styles.grid}>
            {achievements.map((a) => (
            <div key={a.id} className={styles.card}>
                <div className={styles.iconWrap}>{getIcon(a)}</div>
                <div className={styles.info}>
                <h3>{a.name}</h3>
                <p>{a.description}</p>
                <div className={styles.meta}>
                    <span className={styles.points}>
                    <Star size={14} /> {a.pointsAwarded} Puntos
                    </span>
                    <span>
                    {new Date(a.dateUnlocked || "").toLocaleDateString("es-CL", {
                        day: "numeric",
                        month: "short",
                    })}
                    </span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}
