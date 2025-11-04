"use client";

import { useEffect, useState } from "react";
import styles from "./notifications.module.css";
import { getNotifications } from "@/libs/data";
import type { Notification } from "@/libs/types";
import NotificationItem from "./NotificationItem";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdateUnread: (hasUnread: boolean) => void;
};

export default function NotificationsModal({ open, onClose, onUpdateUnread }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (open) {
      getNotifications().then((data) => {
        const unreadOnly = data.filter((n) => !n.read);
        const sorted = unreadOnly.sort((a, b) =>
          a.dateISO < b.dateISO ? 1 : -1
        );
        const limited = sorted.slice(0, 5);
        setNotifications(limited);
      });
    }
  }, [open]);

  useEffect(() => {
    onUpdateUnread(notifications.some((n) => !n.read));
  }, [notifications, onUpdateUnread]);


  const handleMarkAsRead = (id: string, link?: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id); 
      onUpdateUnread(updated.some((n) => !n.read));
      return updated;
    });

    if (link) window.open(link, "_blank");
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h3>Notificaciones</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </header>

        <section className={styles.list}>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onClick={() => handleMarkAsRead(n.id,  n.link)}
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
