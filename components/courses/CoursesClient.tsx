"use client";

import { useMemo, useState } from "react";
import type { CourseDetail } from "@/libs/types";
import CoursesSidebar from "./CoursesSidebar";
import CourseHeader from "./Courseheader";
import CourseLesson from "./CourseLesson";
import styles from "@/app/main/courses/courses.module.css";
import { ChevronRight } from "lucide-react";

export default function CoursesClient({ courses }: { courses: CourseDetail[] }) {
  const all = useMemo(() => courses.sort((a, b) => b.progress - a.progress), [courses]);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeCourse = all.find((c) => c.id === activeId) || null;

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
        {!activeCourse ? (
          <div className={styles.courseEmpty}>
            <p>No se ha seleccionado un curso</p>
          </div>
        ) : (
          <>
            <CourseHeader
              title={activeCourse.title}
              image={activeCourse.image}
              progress={activeCourse.progress}
            />
            <div className={styles.lessonList}>
              {activeCourse.lessons.map((lesson) => (
                <CourseLesson
                  key={lesson.id}
                  lesson={lesson}
                  courseId={activeCourse.id} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
