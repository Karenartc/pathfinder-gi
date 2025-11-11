"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import LessonSidebar from "./LessonSidebar";
import styles from "../lesson.module.css";
import type { LessonDetail as LessonType, CourseDetail } from "@/libs/types";
import { getLessonById, getCourseById } from "@/libs/data";
import { getAuth } from "firebase/auth";

type Props = {
    courseId: string;
    lessonId: string;
};

export default function LessonDetail({ courseId, lessonId }: Props) {
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [lesson, setLesson] = useState<LessonType | null>(null);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchData() {
        try {
          // Obtener token
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (!currentUser) return;

          const token = await currentUser.getIdToken();

          // Obtener curso y lección desde las APIs
          const [courseRes, lessonRes] = await Promise.all([
            fetch(`/api/modules/${courseId}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            }),
            fetch(`/api/modules/${courseId}/lessons/${lessonId}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            }),
          ]);

          const courseData = await courseRes.json();
          const lessonData = await lessonRes.json();

          if (courseData.ok) setCourse(courseData.course || null);
          if (lessonData.ok) setLesson(lessonData.lesson || null);

        } catch (error) {
          console.error("Error al cargar datos:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [courseId, lessonId]);

    if (loading) {
        return <div className={styles.lessonContent}><p>Cargando lección...</p></div>;
    }

    if (!course || !lesson) {
        return (
        <div className={styles.lessonContent}>
            <h2>Lección no encontrada</h2>
            <p>Revisa el mock data.</p>
        </div>
        );
    }

    return (
        <div className={styles.lessonLayout}>
        {/* Botón abrir sidebar (mobile) */}
        <button
            className={styles.sidebarToggleMobile}
            onClick={() => setSidebarExpanded(true)}
            aria-label="Abrir menú de lecciones"
        >
            <ChevronRight size={22} />
        </button>

        {/* Sidebar de lecciones */}
        <LessonSidebar
            course={course}
            activeLessonId={lesson.id}
            sidebarExpanded={sidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
        />

        {/* Overlay (mobile) */}
        {sidebarExpanded && (
            <div
            className={styles.sidebarOverlay}
            onClick={() => setSidebarExpanded(false)}
            />
        )}

        {/* Contenido principal */}
        <div className={styles.lessonContent}>
        {/* HEADER SUPERIOR: Curso + Back + Progreso */}
        <div className={styles.lessonTopHeader}>
            <Link href="/main/courses" className={styles.backBtnTop}>
            <ChevronRight size={18} style={{ transform: "rotate(180deg)" }} /> Volver al curso
            </Link>

            <div className={styles.lessonTopInfo}>
            <div className={styles.progressTop}>
                <span>Progreso</span>
                <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${course.progress}%` }}
                />
                </div>
                <span>{course.progress}%</span>
            </div>
            </div>
        </div>

        {/* CONTENIDO DE LA LECCIÓN */}
        <div className={styles.lessonBody}>
            <div className={styles.lessonHeaderTop}>
            <Image
                src={lesson.image}
                alt={lesson.title}
                width={120}
                height={120}
                className={styles.lessonImage}
            />
            <div className={styles.lessonTextHeader}>
                <h1>{lesson.title}</h1>
                {lesson.subtitle && <h4>{lesson.subtitle}</h4>}
            </div>
            </div>

            <div className={styles.lessonDescription}>
            {lesson.content.map((p, i) => (
                <p key={i}>{p}</p>
            ))}
            </div>
        </div>

        {/* FOOTER: Separador + botón alineado a la izquierda */}
        <div className={styles.lessonFooter}>
            <div className={styles.footerDivider}></div>
            <Link
            href={`/main/courses/${courseId}/lesson/${lesson.id}/quiz`}
            className={styles.quizButtonFooter}
            >
            Comenzar Quiz
            </Link>
        </div>
        </div>
        </div>
    );
}
