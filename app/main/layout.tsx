"use client";

import '../globals.css';
import { usePathname } from "next/navigation";
import NavbarUser from '@/components/commons/NavbarUser';
import Footer from '@/components/commons/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Detecta rutas donde no debe aparecer el navbar ni footer
    const isDetail = pathname?.startsWith("/main/details/");
    const isLesson = pathname?.startsWith("/main/courses/") && pathname.includes("/lesson/");
    const isQuiz = pathname?.startsWith("/main/courses/") && pathname.includes("/quiz");

    const hideUI = isDetail || isLesson || isQuiz;

    return (
        <>
        {!hideUI && <NavbarUser />}
        <main className="section">{children}</main>
        {!hideUI && <Footer />}
        </>
    );
}
