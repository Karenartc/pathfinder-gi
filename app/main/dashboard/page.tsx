import Image from "next/image";
import { getUser, getCourses, getEvents } from "@/libs/data/mock"; 
import HeaderWelcome from "@/components/dashboard/HeaderWelcome";
import CoursesSection from "@/components/dashboard/CoursesSection";
import EventsSection from "@/components/dashboard/EventsSection";
import styles from "@/components/dashboard/dashboard.module.css";

export const revalidate = 0; 

export default async function DashboardPage() {
    const [user, courses, events] = await Promise.all([
        getUser(),
        getCourses(),
        getEvents(),
    ]);

    return (
    <>
       {/* Header de bienvenida */}
        <section className={`${styles.fullBleed} section`}>
            <div className="container">
            <HeaderWelcome
                user={user}
                illustrationSrc="/images/PathFox-emocion2.png"
            />
            </div>
        </section>

      {/* El resto vuelve al layout centrado */}
        <main className="container">
            {/* Mis cursos */}
            <section className="section">
            <h2>Mis Cursos</h2>
            <CoursesSection courses={courses} />
            </section>

            {/* Eventos próximos */}
            <section className="section">
            <h2>Eventos</h2>
            <EventsSection events={events} />
            </section>
        </main>
        </>
    );
}
