"use client";

import Link from "next/link";
import styles from "../lesson.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CourseDetail } from "@/libs/types";

type Props = {
    course: CourseDetail;
    activeLessonId: string | null;
    sidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
};

export default function LessonSidebar({
    course,
    activeLessonId,
    sidebarExpanded,
    setSidebarExpanded,
    }: Props) {
    return (
        <aside
        className={`${styles.sidebar} ${
            sidebarExpanded
            ? styles.sidebarExpandedState
            : styles.sidebarCollapsedState
        }`}
        >
        {/* Toggle interno */}
        <button
            className={styles.sidebarToggleInternal}
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label="Toggle sidebar"
        >
            {sidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {sidebarExpanded && <h2 className={styles.sidebarTitle}>{course.title}</h2>}

        <div className={styles.lessonList}>
            {course.lessons.map((lesson, index) => (
            <Link
                key={lesson.id}
                href={`/main/courses/${course.id}/lesson/${lesson.id}`}
                className={`${styles.lessonItem} ${
                activeLessonId === lesson.id ? styles.active : ""
                }`}
                onClick={() => setSidebarExpanded(false)} // en mobile se cierra
            >
                <div className={styles.lessonIndex}>{index + 1}</div>
                {sidebarExpanded && (
                <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                </div>
                )}
            </Link>
            ))}
        </div>
        </aside>
    );
}
