"use client";

import { useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import styles from "./dashboard.module.css";
import type { CourseDetail } from "@/libs/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    courses: CourseDetail[];
};

export default function CoursesSection({ courses }: Props) {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filtrar solo cursos no completados
    const visibleCourses = useMemo(
        () => courses.filter((c) => c.progress < 100),
        [courses]
    );

    // Scroll horizontal
    const scroll = (direction: "left" | "right") => {
        const container = scrollRef.current;
        if (!container) return;
        const amount = container.clientWidth * 0.9;
        container.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
        });
    };

    // Al hacer click en un curso: buscar primera lección no completada
    const handleCourseClick = async (courseId: string) => {
        try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            console.error("Usuario no autenticado");
            return;
        }

        const token = await user.getIdToken();

        const res = await fetch(`/api/modules/${courseId}/lessons`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!data.ok) {
            console.error("Error al cargar lecciones:", data.message);
            return;
        }

        const lessons = data.module.lessons;

        // Buscar la primera no completada
        const nextLesson = lessons.find((l: any) => !l.completed);
        const targetLesson = nextLesson ?? lessons[lessons.length - 1];

        // Redirigir a esa lección
        router.push(`/main/courses/${courseId}/lesson/${targetLesson.id}`);
        } catch (err) {
        console.error("Error al redirigir al curso:", err);
        }
    };

    return (
        <div className={styles.coursesWrapper}>
        {/* Flechas de navegación */}
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
                <div
                    key={c.id}
                    className={styles.courseBanner}
                    onClick={() => handleCourseClick(c.id)}
                    role="button"
                    tabIndex={0}
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
                </div>
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
