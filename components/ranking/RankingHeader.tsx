import styles from "./ranking.module.css";
import type { User } from "@/libs/types";

type Props = {
    topUsers: User[];
};

export default function RankingHeader({ topUsers }: Props) {
    const [first, second, third] = topUsers;

    return (
        <div className={styles.podium}>
        {second && (
            <div className={`${styles.podiumItem} ${styles.pos2}`}>
            <span className={`${styles.badge} ${styles.badge2}`}>2</span>
            <div className={styles.avatarWrap}>
                <img
                src={second.avatarUrl}
                alt={second.name}
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
                src={first.avatarUrl}
                alt={first.name}
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
                src={third.avatarUrl}
                alt={third.name}
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
