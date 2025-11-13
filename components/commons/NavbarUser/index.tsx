'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Star, Menu, X, Home, BookOpen, Compass, MessageSquare } from 'lucide-react';
import styles from './NavbarUser.module.css';
import { ROUTES } from '@/libs/routes';
import NotificationsModal from "@/components/notifications/NotificationsModal";
import { useNotifications } from '@/hooks/useNotifications';

export default function NavbarUser() {
    const pathname = usePathname();
    const { userData, loading: authLoading } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    // Notificaciones (hook 100% funcional)
    const { 
        notifications, 
        loading: notifLoading,
        hasUnread, 
        fetchNotifications,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    // Detectar tamaño de pantalla
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 1100);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Recargar notificaciones al cerrar
    const handleCloseNotifications = () => {
        setNotifOpen(false);
        fetchNotifications(); // refrescar al cerrar
    };

    const navItems = [
        { label: 'Principal', href: ROUTES.userhome, icon: <Home size={18} /> },
        { label: 'Cursos', href: ROUTES.courses, icon: <BookOpen size={18} /> },
        { label: 'Explorar', href: ROUTES.explore, icon: <Compass size={18} /> },
        { label: 'PathBot', href: ROUTES.pathbot, icon: <MessageSquare size={18} /> },
    ];

    const userName = userData?.firstName || userData?.fullName?.split(' ')[0] || 'Usuario';
    const userPoints = userData?.totalPoints || 0;
    const userAvatar = userData?.avatarUrl || '/images/fox-avatar.png';

    return (
        <header className={styles.nav}>
            <div className={styles.inner}>
                
                {/* LOGO */}
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

                {/* NAV LINKS */}
                {!isMobile && (
                    <nav className={styles.navLinks}>
                        {navItems.map((item) => {
                            const active = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.navItem} ${active ? styles.active : ''}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                )}

                {/* RIGHT ICONS */}
                <div className={styles.right}>
                    
                    {/* NOTIFICATIONS BUTTON */}
                    <button
                        className={`${styles.iconBtn} 
                            ${notifOpen ? styles.activeNotif : ''} 
                            ${hasUnread ? styles.hasUnread : ''}`
                        }
                        aria-label="Notificaciones"
                        onClick={() => setNotifOpen(true)}
                    >
                        <Bell size={20} />
                    </button>

                    <div className={styles.divider}></div>

                    {/* POINTS */}
                    <Link
                        href={ROUTES.ranking}
                        className={`${styles.points} 
                            ${pathname.startsWith(ROUTES.ranking) ? styles.activePoints : ''}`
                        }
                    >
                        <Star size={18} />
                        <span>{authLoading ? '...' : userPoints}</span>
                    </Link>

                    <div className={styles.divider}></div>

                    {/* PROFILE */}
                    <Link
                        href={ROUTES.profile}
                        className={`${styles.profile} 
                            ${pathname.startsWith(ROUTES.profile) ? styles.activeProfile : ''}`
                        }
                    >
                        <Image
                            src={userAvatar}
                            alt={userName}
                            width={28}
                            height={28}
                            className={styles.avatar}
                        />

                        {!isMobile && (
                            <span className={styles.username}>
                                {authLoading ? 'Cargando...' : userName}
                            </span>
                        )}
                    </Link>

                    {/* Mobile menu toggle */}
                    {isMobile && (
                        <button
                            className={styles.menuToggle}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile overlay */}
            {isMobile && menuOpen && (
                <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
            )}

            {/* Mobile menu */}
            {isMobile && menuOpen && (
                <div className={styles.mobileMenu}>
                    <nav>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className={`${styles.mobileItem} 
                                    ${pathname.startsWith(item.href) ? styles.activeMobile : ''}`
                                }
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}

                        <hr className={styles.mobileDivider} />

                        <Link
                            href={ROUTES.profile}
                            onClick={() => setMenuOpen(false)}
                            className={`${styles.mobileItem} 
                                ${pathname.startsWith(ROUTES.profile) ? styles.activeMobile : ''}`
                            }
                        >
                            <Image
                                src={userAvatar}
                                alt={userName}
                                width={26}
                                height={26}
                                className={styles.avatar}
                            />
                            <span>{userName}</span>
                        </Link>
                    </nav>
                </div>
            )}

            {/* NOTIFICATIONS MODAL */}
            <NotificationsModal
                open={notifOpen}
                onClose={handleCloseNotifications}
            />

        </header>
    );
}
