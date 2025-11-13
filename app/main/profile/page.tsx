"use client";

import { useEffect, useState } from "react";
import styles from "./profile.module.css";

import AchievementsSection from "@/components/profile/AchievementsSection";
import ProfilePanel from "@/components/profile/ProfilePanel";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/libs/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Achievement } from "@/libs/types";

export default function ProfilePage() {
  const { user, userData, loading } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);

  // Cargar logros reales desde Firestore
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "users", user.uid, "userAchievements"),
          orderBy("awardedAt", "desc")
        );
        const snap = await getDocs(q);

        const list: Achievement[] = snap.docs.map((doc) => {
          const data = doc.data() as any;

          // awardedAt puede ser Timestamp o string
          let dateUnlocked: string | undefined;
          const rawDate = data.awardedAt || data.dateUnlocked;

          if (rawDate?.toDate) {
            dateUnlocked = rawDate.toDate().toISOString();
          } else if (typeof rawDate === "string") {
            dateUnlocked = rawDate;
          }

          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            pointsAwarded: data.pointsAwarded ?? 0,
            iconUrl: data.iconUrl,
            dateUnlocked,
          };
        });

        setAchievements(list);
      } catch (err) {
        console.error("❌ Error cargando logros del usuario:", err);
      } finally {
        setLoadingAchievements(false);
      }
    };

    load();
  }, [user]);

  const recentAchievements = achievements.slice(0, 8);

  if (loading || !userData) {
    return (
      <main className={styles.profilePage}>
        <div className={styles.content}>
          <p>Cargando perfil...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.profilePage}>
      <div className={styles.content}>
        {/* Columna izquierda: perfil + configuración */}
        <section className={styles.left}>
          <ProfilePanel user={userData} />
        </section>

        {/* Columna derecha: logros */}
        <section className={styles.right}>
          {loadingAchievements ? (
            <p>Cargando logros...</p>
          ) : (
            <AchievementsSection achievements={recentAchievements} />
          )}
        </section>
      </div>
    </main>
  );
}
