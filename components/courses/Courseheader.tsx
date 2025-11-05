"use client";

import styles from "@/app/main/courses/courses.module.css";

export default function CourseHeader({
    title,
    image,
    progress,
    }: {
    title: string;
    image: string;
    progress: number;
    }) {
    return (
        <header className={styles.courseHeaderSecondary}>
        <div className={styles.courseHeaderInfo}>
            <h1>{title}</h1>
            <div className={styles.courseProgressBar}>
            <div className={styles.courseProgressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.courseProgressText}>{progress}% completado</span>
        </div>
        <img src={image} alt={title} className={styles.courseHeaderImg} />
        </header>
    );
}
