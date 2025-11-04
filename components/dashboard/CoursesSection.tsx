"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./dashboard.module.css";
import type { Course } from "@/libs/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    courses: Course[];
};

export default function CoursesSection({ courses }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        const container = scrollRef.current;
        if (!container) return;
        const amount = container.clientWidth * 0.9; 
        container.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
        });
    };

    return (
        <div className={styles.coursesWrapper}>
        {/* Botones solo visibles en desktop */}
        <button
            className={`${styles.arrowBtn} ${styles.left}`}
            onClick={() => scroll("left")}
            aria-label="Anterior"
        >
            <ChevronLeft />
        </button>

        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />

        {/* Contenedor desplazable */}
        <div ref={scrollRef} className={styles.coursesScroller}>
            <div className={styles.coursesTrack}>
            {courses.map((c) => (
                <article key={c.id} className={styles.courseBanner}>
                <div className={styles.courseBannerMedia}>
                    <Image
                    src={c.image}
                    alt={c.title}
                    width={120}
                    height={120}
                    loading="lazy"
                    />
                </div>

                <div className={styles.courseBannerBody}>
                    <h3 className={styles.courseBannerTitle}>{c.title}</h3>

                    <div
                    className={styles.progressWrap}
                    aria-label={`Progreso ${c.progress}%`}
                    >
                    <div className={styles.progressBar}>
                        <span
                        className={styles.progressFill}
                        style={{ width: `${c.progress}%` }}
                        />
                    </div>
                    <span className="caption">{c.progress}%</span>
                    </div>
                </div>
                </article>
            ))}
            </div>
        </div>

        <button
            className={`${styles.arrowBtn} ${styles.right}`}
            onClick={() => scroll("right")}
            aria-label="Siguiente"
        >
            <ChevronRight />
        </button>
        </div>
    );
}
