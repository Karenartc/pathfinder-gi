import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import DetailHeader from "@/components/details/DetailHeader";
import InfoChip from "@/components/details/InfoChip";
import DetailSection from "@/components/details/DetailSection";
import styles from "@/components/details/detail.module.css";
import { getEventById } from "@/libs/data/mock";

export const revalidate = 0;

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

export default async function EventDetailPage({ params }: PageProps) {
    const { id } = await params;

    const event = await getEventById(id);
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
}
