"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./dashboard.module.css";
import type { Event } from "@/libs/types";
import { CalendarDays, MapPin } from "lucide-react";
import { ROUTES } from "@/libs/routes";

type Props = { events: Event[] };

function formatDate(dateISO: string) {
  if (!dateISO) return "Sin fecha";
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default function EventsSection({ events }: Props) {
  if (!events.length) {
    return <p className={styles.emptyState}>No hay eventos disponibles.</p>;
  }

  return (
    <div className={styles.eventsGrid}>
      {events.map((e) => (
        <Link key={e.id} href={ROUTES.details.event(e.id)} className={styles.eventCard}>
          <div className={styles.eventMedia}>
            <Image
              src={e.imageUrl || "/images/PathFox-eventoDefault.png"}
              alt={e.title || "Evento sin título"}
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
                <CalendarDays className={styles.metaIcon} /> {formatDate(e.dateISO)}
              </li>
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
}
