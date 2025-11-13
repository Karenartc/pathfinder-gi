'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DetailHeader from "@/components/details/DetailHeader";
import InfoChip from "@/components/details/InfoChip";
import DetailSection from "@/components/details/DetailSection";
import styles from "@/components/details/detail.module.css";

type Event = {
    id: string;
    title: string;
    description: string;
    dateISO: string;
    place: string;
    image: string;
    category?: string;
    building?: string;
    room?: string;
};

function formatDateLong(iso: string) {
    try {
        const d = new Date(iso);
        return new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        }).format(d);
    } catch {
        return iso;
    }
}

type PageProps = { params: Promise<{ id: string }> };

export default function EventDetailPage({ params }: PageProps) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [eventId, setEventId] = useState<string>("");
    
    // Resolver params
    useEffect(() => {
      params.then((p) => setEventId(p.id));
    }, [params]);

    // Redirigir si no está autenticado
    useEffect(() => {
      if (!authLoading && !user) {
        router.push("/auth/login");
      }
    }, [user, authLoading, router]);

    // Cargar evento desde API
    useEffect(() => {
        params.then((p) => setEventId(p.id));
    }, [params]);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, authLoading, router]);

    // Cargar evento desde API
    useEffect(() => {
        async function fetchEvent() {
            if (!user || !eventId) return;

            try {
                const token = await user.getIdToken();
                const res = await fetch(`/api/events/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (res.ok && data.ok) {
                    setEvent(data.event);
                } else {
                    console.error("Error al cargar evento:", data.message);
                    setEvent(null);
                }

            } catch (error) {
                console.error("Error:", error);
                setEvent(null);

            } finally {
                setLoading(false);
            }
        }

        if (user && eventId) {
            fetchEvent();
        }
    }, [user, eventId]);    

    if (loading || authLoading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                Cargando evento...
            </div>
        );
    }

    if (!event) return notFound();
    
    const dateLabel = formatDateLong(event.dateISO);
    const placeLabel = event.place;
    const imageSrc = event.image || "/images/default-event.jpg";

    return (
        <div>
            {/* Hero con overlay e imagen */}
            <DetailHeader
                image={imageSrc}
                titleOverlap="Detalles del Evento"
                backHref="/main/dashboard"
            />

            {/* Contenido */}
            <div className={styles.wrapper}>
                <h1 className={styles.title}>{event.title}</h1>

                <div className={styles.infoRow}>
                    <InfoChip
                        icon={<MapPin size={18} />}
                        title={placeLabel}
                        subtitle="Sede Institucional"
                    />
                    <InfoChip
                        icon={<CalendarDays size={18} />}
                        title={dateLabel}
                        subtitle="Horario por confirmar"
                    />
                </div>

                <DetailSection title="Acerca del evento">
                    <p>{event.description}</p>
                </DetailSection>
            </div>
        </div>
    );
};
