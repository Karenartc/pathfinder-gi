"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LessonDetail from "@/app/main/courses/[courseId]/lesson/[lessonId]/LessonDetail";
import { useAuth } from "@/contexts/AuthContext";

export default function LessonPage() {
  const { user } = useAuth();
  const { courseId, lessonId } = useParams();
  const [exists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo validar existencia: LessonDetail hará el fetch real
    const check = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/modules/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const found = data?.module?.lessons?.find((l: any) => l.id === lessonId);
        setExists(Boolean(found));
      } catch {
        setExists(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [user, courseId, lessonId]);

  if (loading)
    return (
      <div style={{ display: "grid", placeItems: "center", height: "80vh" }}>
        <p>Cargando lección...</p>
      </div>
    );

  if (!exists)
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "80vh",
          color: "gray",
        }}
      >
        <h2>Lección no encontrada</h2>
      </div>
    );

  return (
    <LessonDetail
      courseId={String(courseId)}
      lessonId={String(lessonId)}
    />
  );
}
