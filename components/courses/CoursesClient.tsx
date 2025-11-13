"use client";

import { useMemo, useState, useEffect } from "react";
import type { CourseDetail } from "@/libs/types";
import CoursesSidebar from "./CoursesSidebar";
import CourseHeader from "./Courseheader";
import CourseLesson from "./CourseLesson";
import styles from "@/app/main/courses/courses.module.css";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CoursesClient({ courses }: { courses: CourseDetail[] }) {
  const { user } = useAuth();

  // Ordenar cursos por progreso
  const all = useMemo(() => {
    // Ordena y elimina duplicados por id
    const unique = new Map<string, CourseDetail>();
    courses.forEach((c) => {
      unique.set(c.id, c); // si hay duplicado, se reemplaza
    });
    return Array.from(unique.values()).sort((a, b) => b.progress - a.progress);
  }, [courses]);

  // Estado del sidebar y curso activo
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Estado del curso y lecciones reales
  const [activeCourse, setActiveCourse] = useState<CourseDetail | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // 🔹 Cargar lecciones reales al seleccionar un curso
  useEffect(() => {
    const loadLessons = async () => {
      if (!user || !activeId) return;

      setLoadingLessons(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/modules/${activeId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.ok) {
          const baseCourse = all.find((c) => c.id === activeId);
          setActiveCourse({
            id: data.module.id,
            title: data.module.title,
            image: data.module.image,
            progress: baseCourse?.progress || 0,
            lessons: data.module.lessons || [],
          });
        }
      } catch (err) {
        console.error("❌ Error cargando lecciones:", err);
      } finally {
        setLoadingLessons(false);
      }
    };

    loadLessons();
  }, [user, activeId]);

  return (
    <div className={styles.coursesLayout}>
      {/* Botón abrir sidebar (solo en mobile) */}
      <button
        className={styles.sidebarToggleMobile}
        onClick={() => setSidebarExpanded(true)}
        aria-label="Abrir menú de cursos"
      >
        <ChevronRight size={22} />
      </button>

      {/* Sidebar */}
      <CoursesSidebar
        courses={all}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setSidebarExpanded(false); // cierra drawer en mobile
        }}
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

      {/* Contenido derecho */}
      <div className={styles.courseContent}>
        {!activeId ? (
          <div className={styles.courseEmpty}>
            <p>Selecciona un curso para ver sus lecciones</p>
          </div>
        ) : loadingLessons ? (
          <div className={styles.courseEmpty}>
            <p>Cargando lecciones...</p>
          </div>
        ) : activeCourse ? (
          <>
            <CourseHeader
              title={activeCourse.title}
              image={activeCourse.image}
              progress={activeCourse.progress}
            />
            <div className={styles.lessonList}>
              {activeCourse.lessons.length > 0 ? (
                activeCourse.lessons.map((lesson) => (
                  <CourseLesson
                    key={lesson.id}
                    lesson={lesson}
                    courseId={activeCourse.id}
                  />
                ))
              ) : (
                <p style={{ opacity: 0.7 }}>No hay lecciones disponibles aún.</p>
              )}
            </div>
          </>
        ) : (
          <div className={styles.courseEmpty}>
            <p>No se pudo cargar el curso.</p>
          </div>
        )}
      </div>
    </div>
  );
}
