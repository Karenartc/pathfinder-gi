'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import CoursesClient from "@/components/courses/CoursesClient";

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    async function fetchCourses() {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/modules/progress', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchCourses();
    }
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando cursos...</div>;
  }

  return <CoursesClient courses={courses} />;
}