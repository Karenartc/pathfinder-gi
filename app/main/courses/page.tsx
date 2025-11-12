"use client";

import { useEffect, useState } from "react";
import CoursesClient from "@/components/courses/CoursesClient";
import { useAuth } from "@/contexts/AuthContext";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/modules/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.ok) setCourses(data.courses || []);
      } catch (err) {
        console.error("Error cargando cursos:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <p style={{ padding: "2rem" }}>Cargando cursos...</p>;

  return <CoursesClient courses={courses} />;
}
