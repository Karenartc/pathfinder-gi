"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Moon, Bell, LogOut } from "lucide-react";

import styles from "./ProfilePanel.module.css";
import { ROUTES } from "@/libs/routes";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/libs/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// Tipo flexible para usar el userData del AuthContext
type ProfileUser = {
  uid: string;
  fullName?: string;
  name?: string;
  email: string | null;
  career?: string;
  avatarUrl?: string;
  preferences?: {
    darkMode?: boolean;
    notificationsEnabled?: boolean;
  };
};

export default function ProfilePanel({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const { user: firebaseUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [darkMode, setDarkMode] = useState(
    user.preferences?.darkMode ?? theme === "dark"
  );
  const [notifications, setNotifications] = useState(
    user.preferences?.notificationsEnabled ?? true
  );

  const handleLogout = () => {
    document.cookie = "auth=; path=/; max-age=0;";
    localStorage.clear();
    router.push(ROUTES.home);
  };

  const handleToggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    setTheme(newValue ? "dark" : "light");

    if (!firebaseUser) return;

    try {
      const ref = doc(db, "users", firebaseUser.uid);
      await updateDoc(ref, {
        "preferences.darkMode": newValue,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error actualizando darkMode en Firestore:", err);
    }
  };

  // (Opcional) si quieres guardar también las notificaciones en BD
  const handleToggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);

    if (!firebaseUser) return;

    try {
      const ref = doc(db, "users", firebaseUser.uid);
      await updateDoc(ref, {
        "preferences.notificationsEnabled": newValue,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error actualizando notifications en Firestore:", err);
    }
  };

  return (
    <aside className={styles.panel}>
      {/* ─────────────── Información personal ─────────────── */}
      <div className={styles.infoSection}>
        <div className={styles.avatarBox}>
          <Image
            src={user.avatarUrl || "/images/fox-avatar.png"}
            alt={user.fullName || user.name || "Usuario"}
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
            <p className={styles.infoValue}>
              {user.fullName || user.name || "—"}
            </p>
          </ul>
          <ul className={styles.infoItem}>
            <p className={styles.infoLabel}>Correo Electrónico</p>
            <p className={styles.infoValue}>{user.email || "—"}</p>
          </ul>
          <ul className={styles.infoItem}>
            <p className={styles.infoLabel}>Carrera</p>
            <p className={styles.infoValue}>{user.career || "—"}</p>
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
                Cambia el tema a modo oscuro o claro.
              </p>
            </div>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleToggleDarkMode}
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
                Activa o desactiva notificaciones.
              </p>
            </div>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={handleToggleNotifications}
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
