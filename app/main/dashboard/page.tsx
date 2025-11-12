'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import HeaderWelcome from "@/components/dashboard/HeaderWelcome";
import CoursesSection from "@/components/dashboard/CoursesSection";
import EventsSection from "@/components/dashboard/EventsSection";
import styles from "@/components/dashboard/dashboard.module.css";
import { User, Event } from "@/libs/types";

// Tipo para cursos con progreso
type CourseWithProgress = {
  id: string;
  title: string;
  progress: number;
  image: string;
  lessons: any[];
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirigir si no hay sesión
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  // Cargar datos reales
  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        console.log("🔑 Token obtenido:", token.substring(0, 20) + "...");

        // Fetch simultáneo de backend real
        const [profileRes, coursesRes, eventsRes] = await Promise.all([
          fetch("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/modules/progress", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const profileData = await profileRes.json();
        const coursesData = await coursesRes.json();
        const eventsData = await eventsRes.json();

        // 🔹 Perfil del usuario
        if (profileRes.ok && profileData.ok) {
            const userInfo = profileData.user || profileData;
            console.log("👤 Perfil cargado:", userInfo.fullName);
            setUserProfile({
            id: userInfo.uid,
            name: userInfo.fullName || "Usuario",
            career: userInfo.career || "Sin carrera",
            points: userInfo.totalPoints || 0,
            avatarUrl: userInfo.avatarUrl || "/images/fox-avatar.png",
            email: userInfo.email,
            globalRank: 0,
            careerCount: 0,
            preferences: profileData.preferences || {
                darkMode: false,
                notificationsEnabled: true,
            },
            });
        } else {
            console.error("❌ Error perfil:", profileData.message);
        }
        // 🔹 Cursos
        if (coursesRes.ok && coursesData.ok) {
          setCourses(coursesData.courses || []);
        }

        // 🔹 Eventos
        if (eventsRes.ok && eventsData.ok) {
          setEvents(eventsData.events || []);
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error("❌ Error cargando dashboard:", err);
        setError(err.message || "Error al cargar datos.");
        setIsLoading(false);
      }
    }
    if (!authLoading && user) loadDashboardData();
  }, [user, authLoading]);

  if (authLoading || isLoading)
    return <main className="container"><p>Cargando tu dashboard...</p></main>;

  if (error)
    return <main className="container"><p style={{ color: "red" }}>{error}</p></main>;

  if (!userProfile)
    return <main className="container"><p>No se pudo cargar el perfil del usuario.</p></main>;

  return (
    <>
      {/* Header */}
      <section className={styles.fullBleed}>
        <div className="container">
          <HeaderWelcome
            user={userProfile}
            illustrationSrc="/images/PathFox-emocion2.png"
          />
        </div>
      </section>

      {/* Cursos */}
      <main className="container">
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Mis Cursos</h2>
          {courses.length > 0 ? (
            <CoursesSection courses={courses} />
          ) : (
            <p className={styles.emptyState}>No tienes cursos asignados aún.</p>
          )}
        </section>

        {/* Eventos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Eventos</h2>
          {events.length > 0 ? (
            <EventsSection events={events} />
          ) : (
            <p className={styles.emptyState}>No hay eventos disponibles en este momento.</p>
          )}
        </section>
      </main>
    </>
  );
}
