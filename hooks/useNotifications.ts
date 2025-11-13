// hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  message: string;
  type: 'lesson' | 'qr' | 'event' | 'system';
  dateISO: string;
  read: boolean;
  link: string | undefined;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  // Función para obtener notificaciones
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setHasUnread(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();

      const res = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setNotifications(data.notifications);
        setHasUnread(data.unreadCount > 0);
      } else {
        console.error("Error al cargar notificaciones:", data.message);
        setError(data.message);
        setNotifications([]);
        setHasUnread(false);
      }
    } catch (err: any) {
      console.error("Error en useNotifications:", err);
      setError(err.message);
      setNotifications([]);
      setHasUnread(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Función para marcar una notificación como leída
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const res = await fetch(`/api/notifications/${notificationId}/mark-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.ok) {

        // SOLO UN setNotifications
        setNotifications((prev) => {
          const updated = prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          );

          // recalcular hasUnread aquí
          const stillHasUnread = updated.some((n) => !n.read);
          setHasUnread(stillHasUnread);

          return updated;
        });

        } else {
        console.error("Error al marcar como leída:", data.message);
      }
    } catch (err: any) {
      console.error("Error al marcar notificación como leída:", err);
    }
  }, [user]);


  // Función para marcar TODAS las notificaciones como leídas
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    const unreadNotifications = notifications.filter((n) => !n.read);

    // Marcar todas en paralelo
    const promises = unreadNotifications.map((n) => markAsRead(n.id));
    await Promise.all(promises);

    setHasUnread(false);
  }, [user, notifications, markAsRead]);

  // Cargar notificaciones al montar o cuando cambie el usuario
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    hasUnread,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}