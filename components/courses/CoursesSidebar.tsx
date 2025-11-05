"use client";

import Image from "next/image";
import styles from "@/app/main/courses/courses.module.css";
import type { CourseDetail } from "@/libs/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  courses: CourseDetail[];
  activeId: string | null;
  onSelect: (id: string) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
};

export default function CoursesSidebar({
  courses,
  activeId,
  onSelect,
  sidebarExpanded,
  setSidebarExpanded,
}: Props) {
  return (
    <aside
      className={`${styles.sidebar} ${
        sidebarExpanded ? styles.sidebarExpandedState : styles.sidebarCollapsedState
      }`}
    >
      {/* Toggle arriba dentro del sidebar */}
      <button
        className={styles.sidebarToggleInternal}
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
      >
        {sidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {sidebarExpanded && <h2 className={styles.sidebarTitle}>Mis Cursos</h2>}

      <div className={styles.sidebarList}>
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`${styles.sidebarItem} ${
              activeId === c.id ? styles.active : ""
            }`}
          >
            <Image
              src={c.image}
              alt={c.title}
              width={48}
              height={48}
              className={styles.sidebarIcon}
            />
            {sidebarExpanded && (
              <div className={styles.sidebarInfo}>
                <span className={styles.courseTitle}>{c.title}</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    data-state={c.progress === 100 ? "completed" : ""}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                {c.progress === 100 && <span className={styles.badgeDone}>Completado</span>}
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
