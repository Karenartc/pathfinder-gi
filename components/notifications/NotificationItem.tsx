"use client";

import styles from "./notifications.module.css";
import type { Notification } from "@/libs/types";
import { BookOpenCheck, QrCode, CalendarDays, Bell } from "lucide-react";

type Props = {
  notification: Notification;
  onClick: () => void;
};

export default function NotificationItem({ notification, onClick }: Props) {
  const icon = {
    lesson: <BookOpenCheck className={styles.iconLesson} />,
    qr: <QrCode className={styles.iconQr} />,
    event: <CalendarDays className={styles.iconEvent} />,
    system: <Bell className={styles.iconSystem} />,
  }[notification.type];

  const date = new Date(notification.dateISO).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
  });

  return (
      <div className={styles.item} onClick={onClick}>
      <div className={styles.iconWrap}>{icon}</div>
      <div className={styles.content}>
        <p className={styles.message}>{notification.message}</p>
        <span className={styles.date}>{date}</span>
      </div>
      {!notification.read && <span className={styles.dot}></span>} 
    </div>
  );
}
