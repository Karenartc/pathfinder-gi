"use client";

import { CheckCircle2, Info } from "lucide-react";
import styles from "@/app/main/courses/courses.module.css";
import type { CourseLesson } from "@/libs/types";

export default function CourseLesson({ lesson }: { lesson: CourseLesson }) {
  const Icon = lesson.completed ? CheckCircle2 : Info;
  return (
    <div className={`${styles.lessonCard} ${lesson.completed ? styles.lessonDone : ""}`}>
      <Icon className={styles.lessonIcon} />
      <div className={styles.lessonInfo}>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
      </div>
    </div>
  );
}
