// components/ranking/RankingList.tsx
import Image from "next/image";
import styles from "./ranking.module.css";
import { Star } from "lucide-react";
import type { User } from "@/libs/types";

type Props = {
  users: User[];
  currentUserId: string;
  rightLabel?: string;
  emptyLabel?: string;
};

export default function RankingList({
  users,
  currentUserId,
  rightLabel = "Puntos",
  emptyLabel = "Sin datos",
}: Props) {
  if (!users?.length) return <p className={styles.empty}>{emptyLabel}</p>;

  return (
    <ul className={styles.rankingList}>
      {users.map((u, idx) => (
        <li
          id={`rank-${u.id}`}
          key={u.id}
          className={`${styles.rankingItem} ${
            u.id === currentUserId ? styles.current : ""
          }`}
        >
          <div className={styles.rankNumber}>
            {String(idx + 1).padStart(2, "0")}
          </div>

          <div className={styles.userInfo}>
            <div className={styles.userLeft}>
              <div className={styles.avatarListWrap}>
                {u.avatarUrl ? (
                  <Image
                    src={u.avatarUrl}
                    alt={u.name}
                    width={36}
                    height={36}
                    className={styles.avatarList}
                  />
                ) : (
                  <div className={`${styles.avatarList} ${styles.avatarFallback}`}>
                    {u.name?.charAt(0) ?? "?"}
                  </div>
                )}
              </div>
              <span className={styles.userName}>{u.name}</span>
            </div>
            <span className={styles.userCareer}>{u.career ?? "—"}</span>
          </div>

          <div
            className={styles.userPoints}
            aria-label={`${u.points} ${rightLabel}`}
          >
            <Star className={styles.starIcon} aria-hidden />
            {u.points} {rightLabel}
          </div>
        </li>
      ))}
    </ul>
  );
}
