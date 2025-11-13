"use client";

import styles from "./notifications.module.css";
import NotificationItem from "./NotificationItem";
import { X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NotificationsModal({ open, onClose }: Props) {
  const {
    notifications,
    loading,
    markAsRead,
  } = useNotifications();

  // Filtrar solo las no leídas y limitar a 5
  const unreadNotifications = notifications
    .filter((n) => !n.read)
    .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
    .slice(0, 5);

  // IMPORTANTE: NO EXISTE NINGÚN useEffect AQUÍ

  const handleNotificationClick = async (id: string, link?: string) => {
    await markAsRead(id);
    if (link) window.open(link, "_blank");
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3>Notificaciones</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </header>

        <section className={styles.list}>
          {loading ? (
            <p className={styles.empty}>Cargando notificaciones...</p>
          ) : unreadNotifications.length > 0 ? (
            unreadNotifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onClick={() => handleNotificationClick(n.id, n.link)}
              />
            ))
          ) : (
            <p className={styles.empty}>No tienes notificaciones pendientes</p>
          )}
        </section>
      </div>
    </div>
  );
}
