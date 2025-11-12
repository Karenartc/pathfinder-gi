"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./quiz.module.css";
import { useAuth } from "@/contexts/AuthContext";

export default function LessonQuizPage() {
  const { user } = useAuth();

  const [courseId, setCourseId] = useState<string>("");
  const [lessonId, setLessonId] = useState<string>("");
  const [lesson, setLesson] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  // Obtener courseId y lessonId desde la ruta
  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    setCourseId(pathParts[3]);
    setLessonId(pathParts[5]);
  }, []);

  // Cargar preguntas reales desde Firestore
  useEffect(() => {
    const loadLesson = async () => {
      if (!user || !courseId || !lessonId) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/modules/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.ok) {
          const found = data.module.lessons.find((l: any) => l.id === lessonId);
          setLesson(found);
          setQuestions(found?.questions || []);
        }
      } catch (err) {
        console.error("❌ Error cargando lección:", err);
      }
    };
    loadLesson();
  }, [user, courseId, lessonId]);

  if (!lesson) {
    return <div className={styles.quizContainer}>Cargando...</div>;
  }

  const current = questions[currentIndex];

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const isCorrect = index === current?.correctIndex;
    setFeedback(isCorrect ? "correct" : "incorrect");
  };

  const handleNext = async () => {
    if (selectedIndex === null) return;
    const isCorrect = selectedIndex === current?.correctIndex;
    const currentId = current?.id;

    let newWrong = [...wrongQuestions];
    if (!isCorrect && currentId && !newWrong.includes(currentId)) {
      newWrong.push(currentId);
    }

    setFeedback(null);
    setSelectedIndex(null);

    // Si quedan preguntas en este ciclo
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setWrongQuestions(newWrong);
      return;
    }

    // Repetir solo las falladas
    if (newWrong.length > 0) {
      const wrongSet = questions.filter((q) => newWrong.includes(q.id));
      setQuestions(wrongSet);
      setWrongQuestions([]);
      setCurrentIndex(0);
      return;
    }

    // ✅ Si todas correctas → marcar como completado en Firestore
    try {
      if (user) {
        const token = await user.getIdToken();
        await fetch(`/api/modules/${courseId}/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lessonId }),
        });
      }
    } catch (err) {
      console.error("⚠️ Error al registrar progreso:", err);
    }

    // Mostrar pantalla final
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
                  Pregunta {currentIndex + 1} de {questions.length}
                </span>
                <h1>{current.question}</h1>
                <p>Selecciona la respuesta correcta</p>
              </div>
            </div>

            {/* Opciones */}
            <div className={styles.optionsContainer}>
              {current.options.map((opt: string, i: number) => {
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
                    disabled={selectedIndex !== null}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Botón siguiente */}
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
