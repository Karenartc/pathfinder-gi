"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import LessonSidebar from "./LessonSidebar";
import styles from "../lesson.module.css";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  courseId: string;
  lessonId: string;
};

export default function LessonDetail({ courseId, lessonId }: Props) {
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/modules/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.ok) {
          setCourse(data.module);
          const found = data.module.lessons.find((l: any) => l.id === lessonId);
          setLesson(found);
        }
      } catch (err) {
        console.error("❌ Error cargando lección:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, courseId, lessonId]);

  if (loading) {
    return (
      <div className={styles.lessonContent}>
        <p>Cargando lección...</p>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className={styles.lessonContent}>
        <h2>Lección no encontrada</h2>
        <p>Revisa la base de datos.</p>
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
        <div className={styles.lessonTopHeader}>
          <Link href={`/main/courses/${courseId}`} className={styles.backBtnTop}>
            <ChevronRight size={18} style={{ transform: "rotate(180deg)" }} />{" "}
            Volver al curso
          </Link>

          <div className={styles.lessonTopInfo}>
            <div className={styles.progressTop}>
              <span>Progreso</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${course.progress || 0}%` }}
                />
              </div>
              <span>{course.progress || 0}%</span>
            </div>
          </div>
        </div>

        {/* CONTENIDO DE LA LECCIÓN */}
        <div className={styles.lessonBody}>
          <div className={styles.lessonHeaderTop}>
            {lesson.image && (
              <Image
                src={lesson.image}
                alt={lesson.title}
                width={120}
                height={120}
                className={styles.lessonImage}
              />
            )}
            <div className={styles.lessonTextHeader}>
              <h1>{lesson.title}</h1>
              {lesson.subtitle && <h4>{lesson.subtitle}</h4>}
            </div>
          </div>

          <div className={styles.lessonDescription}>
            {(lesson.content || []).map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* FOOTER */}
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
