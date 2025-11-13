'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import HeaderWelcome from "@/components/dashboard/HeaderWelcome";
import CoursesSection from "@/components/dashboard/CoursesSection";
import EventsSection from "@/components/dashboard/EventsSection";
import styles from "@/components/dashboard/dashboard.module.css";
import { User, Event } from "@/libs/types";

// Tipo para los cursos con progreso
type CourseWithProgress = {
  id: string;
  title: string;
  progress: number;
  image: string;
  lessons: any[];
};

export default function DashboardPage() {
    const { user, userData, loading: authLoading } = useAuth();
    const router = useRouter();

    const [userRanking, setUserRanking] = useState<{
        globalRank: number;
        careerRank: number;
    } | null>(null);
    const [courses, setCourses] = useState<CourseWithProgress[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, authLoading, router]);

    // Cargar datos del dashboard
    useEffect(() => {
        async function loadDashboardData() {
            if (!user || !userData) return;
            
            try {
                // 🔑 PASO CLAVE: Obtener el ID Token del usuario
                const token = await user.getIdToken();
                console.log("🔑 Token obtenido exitosamente");

                // Hacer las peticiones en paralelo con el token
                const [coursesRes, eventsRes, globalRankingRes, careerRankingRes] = await Promise.all([
                    fetch('/api/modules/progress', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    fetch('/api/events', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    // Rankings comentados temporalmente - los arreglaremos después
                    fetch('/api/ranking/global', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    fetch(`/api/ranking/career?career=${encodeURIComponent(userData.career || '')}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                ]);

                // Parsear respuestas
                const coursesData = await coursesRes.json();
                const eventsData = await eventsRes.json();
                const globalRankingData = await globalRankingRes.json();
                const careerRankingData = await careerRankingRes.json();

                // Verificar y actualizar cursos
                if (coursesRes.ok && coursesData.ok) {
                    console.log("✅ Cursos cargados:", coursesData.count);
                    setCourses(coursesData.courses || []);
                } else {
                    console.error("❌ Error al cargar cursos:", coursesData.message);
                    setCourses([]);
                }

                // Verificar y actualizar eventos
                if (eventsRes.ok && eventsData.ok) {
                    console.log("✅ Eventos cargados:", eventsData.events?.length || 0);
                    setEvents(eventsData.events || []);
                } else {
                    console.error("❌ Error al cargar eventos:", eventsData.message);
                    setEvents([]);
                }

                // Calcular ranking del usuario (temporal)
                if (globalRankingRes.ok && globalRankingData.ok && careerRankingRes.ok && careerRankingData.ok) {
                    console.log("🏆 Rankings obtenidos exitosamente");
                    
                    // Buscar la posición del usuario en ambos rankings
                    const globalUser = globalRankingData.ranking?.find((u: any) => u.id === user.uid);
                    const careerUser = careerRankingData.ranking?.find((u: any) => u.id === user.uid);

                    setUserRanking({
                        globalRank: globalUser?.globalRank || 0,
                        careerRank: careerUser?.careerRank || careerUser?.careerCount || 0,
                    });

                    console.log("📊 Posición global:", globalUser?.globalRank || 0);
                    console.log("📊 Posición carrera:", careerUser?.careerRank || 0);
                } else {
                    console.warn("⚠️ Error al cargar rankings");
                    setUserRanking({ globalRank: 0, careerRank: 0 });
                }

                setIsLoading(false);
                console.log("✅ Dashboard cargado exitosamente");

            } catch (err: any) {
                console.error("❌ Error al cargar datos del dashboard:", err);
                setError(err.message || "Error al cargar los datos. Intenta recargar la página.");
                setIsLoading(false);
            }
        }

        if (user && userData) {
            loadDashboardData();
        }
    }, [user, userData, router]);

    // Estado de carga
    if (authLoading || isLoading) {
        return (
            <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <div className={styles.loadingContainer}>
                    <p>Cargando tu dashboard...</p>
                </div>
            </main>
        );
    }

    // Estado de error
    if (error) {
        return (
            <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <div className={styles.errorContainer}>
                    <p style={{ color: 'red' }}>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className={styles.retryButton}
                    >
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    // Si no hay userData (no debería pasar, pero por seguridad)
    if (!userData) {
        return (
            <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>No se pudo cargar el perfil del usuario.</p>
            </main>
        );
    }

    // Construir objeto User para HeaderWelcome
    const userForHeader: User = {
        id: userData.uid,
        name: userData.fullName || `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Usuario",
        career: userData.career || "Sin carrera",
        points: userData.totalPoints || 0,
        avatarUrl: userData.avatarUrl || "/images/fox-avatar.png",
        email: userData.email || "",
        globalRank: userRanking?.globalRank || 0,
        careerCount: userRanking?.careerRank || 0,
        preferences: {
            darkMode: false,
            notificationsEnabled: true,
        }
    };

    return (
        <>
            {/* Header de bienvenida */}
            <section className={`${styles.fullBleed}`}>
                <div className="container">
                    <HeaderWelcome
                        user={userForHeader}
                        illustrationSrc="/images/PathFox-emocion2.png"
                    />
                </div>
            </section>

            {/* Contenido principal */}
            <main className="container">
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Mis Cursos</h2>
                    {courses.length > 0 ? (
                        <CoursesSection courses={courses} />
                    ) : (
                        <p className={styles.emptyState}>
                            No tienes cursos asignados aún.
                        </p>
                    )}
                </section>
            
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Eventos</h2>
                    {events.length > 0 ? (
                        <EventsSection events={events} />
                    ) : (
                        <p className={styles.emptyState}>
                            No hay eventos disponibles en este momento.
                        </p>
                    )}
                </section>
            </main>
        </>
    );
}
