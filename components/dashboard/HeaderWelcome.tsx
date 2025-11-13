"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./dashboard.module.css";
import { BookOpen, Star, Globe2 } from "lucide-react";
import type { User } from "@/libs/types";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
    user: User;
    illustrationSrc?: string;
};

export default function HeaderWelcome({ user, illustrationSrc }: Props) {

    const { user: authUser } = useAuth();

    const [globalRank, setGlobalRank] = useState<number | null>(null);
    const [careerRank, setCareerRank] = useState<number | null>(null);
    const [totalPoints, setTotalPoints] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRanking() {
        if (!authUser) return;

        setLoading(true);

        const token = await authUser.getIdToken();

        // 1) Ranking GLOBAL
        const globalRes = await fetch("/api/ranking/global", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const globalData = await globalRes.json();

        if (globalData.ok) {
            const index = globalData.ranking.findIndex((u: any) => u.id === authUser.uid);
            if (index !== -1) {
            setGlobalRank(index + 1);
            setTotalPoints(globalData.ranking[index].totalPoints);
            }
        }

        // 2) Ranking por CARRERA
        const careerRes = await fetch(`/api/ranking/career?career=${user.career}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const careerData = await careerRes.json();

        if (careerData.ok) {
            const index = careerData.ranking.findIndex((u: any) => u.id === authUser.uid);
            if (index !== -1) setCareerRank(index + 1);
        }

        setLoading(false);
        }

        loadRanking();
    }, [authUser, user.career]);

    return (
        <div className={`${styles.welcomeRow} container`}>

        <div className={styles.welcomeMedia}>
            <Image
            src={illustrationSrc ?? "/images/fox-simple.png"}
            alt="PathFox saludando"
            width={260}
            height={260}
            priority
            />
        </div>

        <div className={styles.welcomeText}>
            <h1 className={styles.welcomeTitle}>Hola, {user.name}</h1>
            <p className="body">¡Conozcamos tu carrera y sede!</p>

            <div className={styles.welcomeStatsInline}>

            <div className={styles.statInline}>
                <Star className={styles.statIcon} />
                <span className="overline">Puntos</span>
                <strong>{loading ? "..." : totalPoints}</strong>
            </div>

            <div className={styles.statInline}>
                <BookOpen className={styles.statIcon} />
                <span className="overline">Carrera</span>
                <strong>#{loading ? "..." : careerRank}</strong>
            </div>

            <div className={styles.statInline}>
                <Globe2 className={styles.statIcon} />
                <span className="overline">Global</span>
                <strong>#{loading ? "..." : globalRank}</strong>
            </div>

            </div>
        </div>

        </div>
    );
}
