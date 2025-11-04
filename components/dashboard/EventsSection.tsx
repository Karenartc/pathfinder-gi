"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./dashboard.module.css";
import type { Event } from "@/libs/types";
import { CalendarDays, MapPin } from "lucide-react";
import { ROUTES } from "@/libs/routes";

type Props = { events: Event[] };

function formatDate(iso: string) {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(d);
    return fmt.replace(/ de ([a-z])/, (m, c) => ` de ${c.toUpperCase()}`);
}

export default function EventsSection({ events }: Props) {
    return (
        <div className={styles.eventsGrid}>
        {events.map((e) => (
            <Link
            key={e.id}
            href={ROUTES.details.event(e.id)}
            className={styles.eventCard}
            >
            <div className={styles.eventMedia}>
                <Image
                src={e.image}
                alt={e.title}
                width={560}
                height={160}
                className={styles.eventImg}
                loading="lazy"
                />
            </div>

            <div className={styles.eventContent}>
                <h3 className={styles.eventTitle}>{e.title}</h3>

                <ul className={styles.eventMeta}>
                <li>
                    <MapPin className={styles.metaIcon} /> {e.place}
                </li>
                <li>
                    <CalendarDays className={styles.metaIcon} />{" "}
                    {formatDate(e.dateISO)}
                </li>
                </ul>
            </div>
            </Link>
        ))}
        </div>
    );
}
