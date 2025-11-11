"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./quiz.module.css";
import { getLessonById, getCourseById } from "@/libs/data";
import type { LessonDetail, CourseDetail } from "@/libs/types";
import { getAuth } from "firebase/auth";

type Props = {
    params: Promise<{ courseId: string; lessonId: string }>;
};

export default function LessonQuizPage({ params }: Props) {
    const { courseId, lessonId } = React.use(params);

    const [lesson, setLesson] = useState<LessonDetail | null>(null);
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [completed, setCompleted] = useState(false);
    const [questionOrder, setQuestionOrder] = useState<string[]>([]);
    const [wrongQuestions, setWrongQuestions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null); // 👈 NUEVO

    useEffect(() => {
      async function fetchData() {
        try {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (!currentUser) return;

          const token = await currentUser.getIdToken();

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
          if (lessonData.ok) {
            setLesson(lessonData.lesson || null);
            if (lessonData.lesson?.questions) {
              setQuestionOrder(lessonData.lesson.questions.map((q: any) => q.id));
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
      fetchData();
    }, [courseId, lessonId]);

    if (!lesson || !course) {
        return <div className={styles.quizContainer}>Cargando...</div>;
    }

    const questions = lesson.questions || [];
    const currentId = questionOrder[currentIndex];
    const current = questions.find((q) => q.id === currentId);

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        const isCorrect = index === current?.correctIndex;
        setFeedback(isCorrect ? "correct" : "incorrect");
    };

    const handleNext = () => {
        if (selectedIndex === null) return;

        const isCorrect = selectedIndex === current?.correctIndex;
        const currentId = current?.id;

        // Creamos una copia actualizada de wrongQuestions
        let newWrong = [...wrongQuestions];
        if (!isCorrect && currentId && !newWrong.includes(currentId)) {
        newWrong.push(currentId);
        }

        setFeedback(null);
        setSelectedIndex(null);

        // Si aún quedan preguntas en este ciclo
        if (currentIndex < questionOrder.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setWrongQuestions(newWrong);
        return;
        }

        // Si terminamos el ciclo, repetimos las falladas
        if (newWrong.length > 0) {
        setQuestionOrder(newWrong);
        setWrongQuestions([]); // limpiamos para el siguiente ciclo
        setCurrentIndex(0);
        return;
        }

        // Si ya todas correctas, completamos
        setCompleted(true);
    };
    return (
        <div className={styles.quizContainer}>
        {!completed && current && (
            <>
            <div className={styles.quizBody}>
                <div className={styles.quizTop}>
                <Image
                    src="/images/PathFox-Pregunta.png"
                    alt="PathFox pensativo"
                    width={100}
                    height={100}
                    className={styles.quizImage}
                />
                <div className={styles.quizQuestionHeader}>
                    <span className={styles.questionTag}>
                    Pregunta {currentIndex + 1} de {questionOrder.length}
                    </span>
                    <h1>{current.question}</h1>
                    <p>Selecciona la respuesta correcta</p>
                </div>
                </div>

                {/* Opciones */}
                <div className={styles.optionsContainer}>
                {current.options.map((opt, i) => {
                    const isSelected = selectedIndex === i;
                    const isCorrect = feedback === "correct" && isSelected;
                    const isWrong = feedback === "incorrect" && isSelected;

                    return (
                    <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className={`${styles.optionBtn}
                        ${isSelected ? styles.selected : ""}
                        ${isCorrect ? styles.correct : ""}
                        ${isWrong ? styles.incorrect : ""}`}
                        disabled={selectedIndex !== null} // Bloquea tras elegir
                    >
                        {opt}
                    </button>
                    );
                })}
                </div>

                {/* Botón aparece solo tras seleccionar */}
                {selectedIndex !== null && (
                <div className={styles.quizFooter}>
                    <button onClick={handleNext} className={styles.nextBtn}>
                    Siguiente
                    </button>
                </div>
                )}
            </div>
            </>
        )}

        {completed && (
            <div className={styles.completedSection}>
            <Image
                src="/images/PathFox-Premio.png"
                alt="PathFox celebrando"
                width={120}
                height={120}
            />
            <h2>¡Lección completada!</h2>
            <p>Has respondido correctamente todas las preguntas.</p>
            <Link href={`/main/courses`} className={styles.finishBtn}>
                Terminar Lección
            </Link>
            </div>
        )}
        </div>
    );
}
