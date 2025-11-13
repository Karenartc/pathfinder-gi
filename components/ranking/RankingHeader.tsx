// components/ranking/RankingHeader.tsx
import styles from "./ranking.module.css";
import type { User } from "@/libs/types";

type Props = {
    topUsers: User[];
};

export default function RankingHeader({ topUsers }: Props) {
    const [first, second, third] = topUsers;

    // 👇 FUNCIÓN para obtener avatar válido o usar por defecto
    const getAvatarSrc = (avatarUrl: string | undefined): string => {
      if (avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('/'))) {
        return avatarUrl;
      }
      return "/images/fox-avatar.png";
    };

    return (
        <div className={styles.podium}>
        {second && (
            <div className={`${styles.podiumItem} ${styles.pos2}`}>
            <span className={`${styles.badge} ${styles.badge2}`}>2</span>
            <div className={styles.avatarWrap}>
                <img
                  src={getAvatarSrc(second.avatarUrl)}
                  alt={second.name || "Usuario"}
                  className={styles.avatar}
                />
            </div>
            <p className={styles.podiumName}>{second.name}</p>
            <p className={styles.podiumPoints}>{second.points} pts</p>
            </div>
        )}

        {first && (
            <div className={`${styles.podiumItem} ${styles.pos1}`}>
            <span className={`${styles.badge} ${styles.badge1}`}>1</span>
            <div className={styles.avatarWrap}>
                <img
                  src={getAvatarSrc(first.avatarUrl)}
                  alt={first.name || "Usuario"}
                  className={styles.avatar}
                />
            </div>
            <p className={styles.podiumName}>{first.name}</p>
            <p className={styles.podiumPoints}>{first.points} pts</p>
            </div>
        )}

        {third && (
            <div className={`${styles.podiumItem} ${styles.pos3}`}>
            <span className={`${styles.badge} ${styles.badge3}`}>3</span>
            <div className={styles.avatarWrap}>
                <img
                  src={getAvatarSrc(third.avatarUrl)}
                  alt={third.name || "Usuario"}
                  className={styles.avatar}
                />
            </div>
            <p className={styles.podiumName}>{third.name}</p>
            <p className={styles.podiumPoints}>{third.points} pts</p>
            </div>
        )}
        </div>
    );
}