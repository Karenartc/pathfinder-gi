
"use client";

import Image from "next/image";
import styles from "./dashboard.module.css";
import type { User } from "@/libs/types";
import { BookOpen, Star, Globe2 } from "lucide-react"; 

type Props = {
    user: User;
    illustrationSrc?: string;
};

export default function HeaderWelcome({ user, illustrationSrc }: Props) {
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
            <p className="body">
            ¡Conozcamos tu carrera y sede!
            </p>

            <div className={styles.welcomeStatsInline}>

            <div className={styles.statInline}>
                <Star className={styles.statIcon} />
                <span className="overline">Puntos</span>
                <strong>{user.points}</strong>
            </div>

            <div className={styles.statInline}>
                <BookOpen className={styles.statIcon} />
                <span className="overline">Carrera</span>
                <strong>#{user.careerCount}</strong>
            </div>
            
            <div className={styles.statInline}>
                <Globe2 className={styles.statIcon} />
                <span className="overline">Global</span>
                <strong>#{user.globalRank}</strong>
            </div>
            </div>
        </div>
        </div>
    );
}
