import Image from "next/image";
import { getUser, getCourses, getEvents, getCoursesDetail } from "@/libs/data/mock"; 
import HeaderWelcome from "@/components/dashboard/HeaderWelcome";
import CoursesSection from "@/components/dashboard/CoursesSection";
import EventsSection from "@/components/dashboard/EventsSection";
import styles from "@/components/dashboard/dashboard.module.css";

export const revalidate = 0; 

export default async function DashboardPage() {
    const [user, courses, events] = await Promise.all([
        getUser(),
        getCoursesDetail(),
        getEvents(),
    ]);

    return (
        <>
        {/* Header de bienvenida */}
        <section className={`${styles.fullBleed}`}>
            <div className="container">
            <HeaderWelcome
                user={user}
                illustrationSrc="/images/PathFox-emocion2.png"
            />
            </div>
        </section>

        {/* Contenido principal */}
        <main className="container">
            <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Mis Cursos</h2>
            <CoursesSection courses={courses} />
            </section>

            <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Eventos</h2>
            <EventsSection events={events} />
            </section>
        </main>
        </>
    );
}
