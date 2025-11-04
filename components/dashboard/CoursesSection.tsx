"use client";

import { useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./dashboard.module.css";
import type { CourseDetail } from "@/libs/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  courses: CourseDetail[];
};

export default function CoursesSection({ courses }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filtrar solo cursos no completados
    const visibleCourses = useMemo(
        () => courses.filter((c) => c.progress < 100),
        [courses]
    );

    const scroll = (direction: "left" | "right") => {
        const container = scrollRef.current;
        if (!container) return;
        const amount = container.clientWidth * 0.9;
        container.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
        });
    };

    // Ruta según progreso del curso
    const getLessonPath = (course: CourseDetail): string => {
        if (!course.lessons || course.lessons.length === 0) {
        return `/main/courses/${course.id}`;
        }

        if (course.progress === 100) {
        const last = course.lessons[course.lessons.length - 1];
        return `/main/courses/${course.id}/lesson/${last.id}`;
        }

        if (course.progress === 0) {
        const first = course.lessons[0];
        return `/main/courses/${course.id}/lesson/${first.id}`;
        }

        const next = course.lessons.find((l) => !l.completed);
        return `/main/courses/${course.id}/lesson/${next ? next.id : course.lessons[0].id}`;
    };

    return (
        <div className={styles.coursesWrapper}>
        {/* Flechas navegación */}
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
            {visibleCourses.length > 0 ? (
                visibleCourses.map((c) => (
                <Link
                    key={c.id}
                    href={getLessonPath(c)}
                    className={styles.courseBanner}
                >
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
                </Link>
                ))
            ) : (
                <p className={styles.noCoursesMsg}>
                ¡Has completado todos tus cursos!
                </p>
            )}
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
