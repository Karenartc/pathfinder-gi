"use client";

import { useEffect, useState } from "react";
import { getUser, getAchievements } from "@/libs/data/mock";
import type { User, Achievement } from "@/libs/types";
import AchievementsSection from "@/components/profile/AchievementsSection";
import ProfilePanel from "@/components/profile/ProfilePanel";
import styles from "./profile.module.css";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        getUser().then(setUser);
        getAchievements().then(setAchievements);
    }, []);

    const recentAchievements = achievements.slice(0, 8);

    return (
        <main className={styles.profilePage}>
        <div className={styles.content}>
            
            {/* Columna derecha: perfil + configuración */}
            {user && (
            <section className={styles.left}>
                <ProfilePanel user={user} />
            </section>
            )}

            {/* Columna izquierda: logros */}
            <section className={styles.right}>
            <AchievementsSection achievements={recentAchievements} />
            </section>
        </div>
        </main>
    );
}
