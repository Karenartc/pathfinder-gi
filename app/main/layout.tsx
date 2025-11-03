"use client";

import '../globals.css';
import { usePathname } from "next/navigation";
import NavbarUser from '@/components/commons/NavbarUser';
import Footer from '@/components/commons/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDetail = pathname?.startsWith("/main/details/");

    return (
        <>
        {!isDetail && <NavbarUser />}
        <main className="section">{children}</main>
        {!isDetail && <Footer />}
        </>
    );
}
