"use client";

import { CheckCircle2, Info } from "lucide-react";
import styles from "@/app/main/courses/courses.module.css";
import type { CourseLesson } from "@/libs/types";
import Link from "next/link";
import { ROUTES } from "@/libs/routes";

type Props = {
  lesson: CourseLesson;
  courseId: string;
};

export default function CourseLesson({ lesson, courseId }: Props) {
  const Icon = lesson.completed ? CheckCircle2 : Info;
  const description =
    lesson.description || lesson.subtitle || lesson.content?.[0] || "Lección disponible";

  return (
    <Link
      href={ROUTES.detailsCourse.courseLesson(courseId, lesson.id)}
      className={`${styles.lessonCard} ${lesson.completed ? styles.lessonDone : ""}`}
    >
      <Icon className={styles.lessonIcon} />
      <div className={styles.lessonInfo}>
        <h3>{lesson.title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );
}
