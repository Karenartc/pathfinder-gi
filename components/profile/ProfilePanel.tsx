"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./ProfilePanel.module.css";
import { useState } from "react";
import type { User } from "@/libs/types";
import { Moon, Bell, LogOut } from "lucide-react";
import { ROUTES } from "@/libs/routes";

export default function ProfilePanel({ user }: { user: User }) {
    const [darkMode, setDarkMode] = useState(user.preferences?.darkMode ?? false);
    const [notifications, setNotifications] = useState(
        user.preferences?.notificationsEnabled ?? true
    );
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push(ROUTES.home);
    };

    return (
        <aside className={styles.panel}>
        {/* ─────────────── Información personal ─────────────── */}
        <div className={styles.infoSection}>
            <div className={styles.avatarBox}>
            <Image
                src={user.avatarUrl || "/images/fox-avatar.png"}
                alt={user.name}
                width={100}
                height={100}
                className={styles.avatar}
                priority
            />
            <button className={styles.editAvatar}>＋</button>
            </div>

            <h2 className={styles.sectionTitle}>Información Personal</h2>

            <li className={styles.infoList}>
                <ul className={styles.infoItem}>
                    <p className={styles.infoLabel}>Nombre Completo</p>
                    <p className={styles.infoValue}>{user.name}</p>
                </ul>
                <ul className={styles.infoItem}>
                    <p className={styles.infoLabel}>Correo Electrónico</p>
                    <p className={styles.infoValue}>{user.email || "—"}</p>
                </ul>
                <ul className={styles.infoItem}>
                    <p className={styles.infoLabel}>Carrera</p>
                    <p className={styles.infoValue}>{user.career}</p>
                </ul>
            </li>
        </div>

        {/* ─────────────── Configuración ─────────────── */}
        <div className={styles.settings}>
            <h3 className={styles.subTitle}>Configuración</h3>

            {/* Modo oscuro */}
            <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
                <div className={styles.iconWrap}>
                <Moon size={20} />
                </div>
                <div>
                <p className={styles.settingTitle}>Modo Oscuro</p>
                <p className={styles.settingDesc}>
                    Cambia el tema a modo oscuro.
                </p>
                </div>
            </div>
            <label className={styles.toggle}>
                <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                />
                <span className={styles.slider}></span>
            </label>
            </div>

            {/* Notificaciones */}
            <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
                <div className={styles.iconWrap}>
                <Bell size={20} />
                </div>
                <div>
                <p className={styles.settingTitle}>Notificaciones</p>
                <p className={styles.settingDesc}>
                    Recibe notificaciones push.
                </p>
                </div>
            </div>
            <label className={styles.toggle}>
                <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                />
                <span className={styles.slider}></span>
            </label>
            </div>
            {/* 🚪 Cerrar sesión */}
            <button onClick={handleLogout} className={styles.logoutBtn}>
                <LogOut size={18} />
                Cerrar sesión
            </button>
        </div>
        </aside>
    );
}
