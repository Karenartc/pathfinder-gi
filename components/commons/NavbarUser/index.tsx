'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {Bell, Star, Menu, X, Home, BookOpen, Compass, MessageSquare, } from 'lucide-react';
import styles from './NavbarUser.module.css';
import { ROUTES } from '@/libs/routes';
import { getUser, getNotifications } from '@/libs/data/mock';
import NotificationsModal from "@/components/notifications/NotificationsModal";

export default function NavbarUser() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [user, setUser] = useState<{ name: string; points: number } | null>(null);
    const [notifOpen, setNotifOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    // Detectar tamaño de pantalla
    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth <= 1100);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    // TRAER EL USUARIO DESDE EL MOCK
    useEffect(() => {
        async function fetchUser() {
        const data = await getUser();
        setUser({ name: data.name, points: data.points });
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchNotifications() {
            const data = await getNotifications();
            setHasUnread(data.some((n) => !n.read));
        }
        fetchNotifications();
        }, []);


    const navItems = [
        { label: 'Principal', href: ROUTES.userhome, icon: <Home size={18} /> },
        { label: 'Cursos', href: ROUTES.courses, icon: <BookOpen size={18} /> },
        { label: 'Explorar', href: ROUTES.explore, icon: <Compass size={18} /> },
        { label: 'PathBot', href: ROUTES.pathbot, icon: <MessageSquare size={18} /> },
    ];

    return (
        <header className={styles.nav}>
        <div className={styles.inner}>

            <div className={styles.logoBox}>
            <Image
                src="/images/PathFinder-Logo.png"
                alt="PathFinder"
                width={160}
                height={36}
                className={styles.logo}
                priority
            />
            </div>

            {!isMobile && (
            <nav className={styles.navLinks}>
                {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    >
                    {item.icon}
                    <span>{item.label}</span>
                    </Link>
                );
                })}
            </nav>
            )}


            <div className={styles.right}>
            <button className={`${styles.iconBtn} ${hasUnread ? styles.hasUnread : ''}`} aria-label="Notificaciones" onClick={() => setNotifOpen(true)}>
                <Bell size={20} />
                {hasUnread && <span className={styles.bellDot}></span>}
            </button>

            <div className={styles.divider}></div>

            <Link
                href={ROUTES.ranking}
                className={`${styles.points} ${
                pathname.startsWith(ROUTES.ranking) ? styles.activePoints : ''
                }`}
            >
                <Star size={18} />
                <span>{user ? user.points : '...'}</span>
            </Link>

            <div className={styles.divider}></div>

            <Link
                href={ROUTES.profile}
                className={`${styles.profile} ${
                pathname.startsWith(ROUTES.profile) ? styles.activeProfile : ''
                }`}
            >
                <Image
                src="/images/fox-avatar.png"
                alt={user?.name || 'Usuario'}
                width={28}
                height={28}
                className={styles.avatar}
                />
                {!isMobile && (
                    <span className={styles.username}>
                        {user?.name || 'Usuario'}
                    </span>
                )}
            </Link>

            {isMobile && (
                <button
                className={styles.menuToggle}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menú"
                >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}
            </div>
        </div>

        {isMobile && menuOpen && (
            <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
        )}

        {isMobile && menuOpen && (
            <div className={styles.mobileMenu}>
            <nav>
                {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`${styles.mobileItem} ${
                    pathname.startsWith(item.href) ? styles.activeMobile : ''
                    }`}
                >
                    {item.icon}
                    {item.label}
                </Link>
                ))}

                <hr className={styles.mobileDivider} />

                <Link
                href={ROUTES.profile}
                onClick={() => setMenuOpen(false)}
                className={`${styles.mobileItem} ${
                    pathname.startsWith(ROUTES.profile) ? styles.activeMobile : ''
                }`}
                >
                <Image
                    src="/images/fox-avatar.png"
                    alt={user?.name || 'Usuario'}
                    width={26}
                    height={26}
                    className={styles.avatar}
                />
                <span>{user?.name || 'Usuario'}</span>
                </Link>
            </nav>
            </div>
        )}
        <NotificationsModal
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            onUpdateUnread={(hasUnread) => setHasUnread(hasUnread)}
        />
        </header>
    );
}
