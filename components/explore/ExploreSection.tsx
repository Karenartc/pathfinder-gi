"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/main/explore/explore.module.css";
import type { Place } from "@/libs/types";
import { Search, MapPin, Clock, ScanQrCode } from "lucide-react";
import { ROUTES } from "@/libs/routes";

type Props = { places: Place[] };

export default function ExploreSection({ places }: Props) {
    const [query, setQuery] = useState("");

    const filtered = places.filter(
        (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.location?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section className={styles.explore}>
        <div className={styles.header}>
            <h2>Explorar Campus</h2>

            <div className={styles.searchBar}>
            <Search size={18} className={styles.icon} />
            <input
                type="text"
                placeholder="Buscar ubicación..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                className={styles.qrButton}
                onClick={() => alert("Función de escanear QR próximamente")}
            >
                <ScanQrCode size={20} />
            </button>
            </div>
        </div>

        <div className={styles.grid}>
            {filtered.map((place) => (
            <Link
                key={place.id}
                href={ROUTES.details.place(place.id)}
                className={styles.card}
            >
                <div className={styles.media}>
                <Image
                    src={place.image}
                    alt={place.name}
                    width={600}
                    height={180}
                    className={styles.image}
                />
                </div>
                <div className={styles.content}>
                <h3>{place.name}</h3>
                <p className={styles.desc}>{place.description}</p>
                <ul className={styles.meta}>
                    {place.location && (
                    <li>
                        <MapPin size={16} /> {place.location}
                    </li>
                    )}
                    {place.hours && (
                    <li>
                        <Clock size={16} /> {place.hours}
                    </li>
                    )}
                </ul>
                </div>
            </Link>
            ))}

            {filtered.length === 0 && (
            <p className={styles.empty}>No se encontraron resultados.</p>
            )}
        </div>
        </section>
    );
}
