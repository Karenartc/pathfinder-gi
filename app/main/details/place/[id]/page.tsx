import { notFound } from "next/navigation";
import { MapPin, Clock } from "lucide-react";
import DetailHeader from "@/components/details/DetailHeader";
import InfoChip from "@/components/details/InfoChip";
import DetailSection from "@/components/details/DetailSection";
import styles from "@/components/details/detail.module.css";
import { getPlaceById } from "@/libs/data/mock";

export const revalidate = 0;

type PageProps = { params: Promise<{ id: string }> };

export default async function PlaceDetailPage({ params }: PageProps) {
    const { id } = await params;
    const place = await getPlaceById(id);
    if (!place) return notFound();

    return (
        <div>
        {/* Hero con overlay */}
        <DetailHeader
            image={place.image}
            titleOverlap="Detalles del Lugar"
            backHref="/main/explore"
        />

        <div className={styles.wrapper}>
            <h1 className={styles.title}>{place.name}</h1>

            <div className={styles.infoRow}>
            <InfoChip
                icon={<MapPin size={18} />}
                title={place.location || "Ubicación no disponible"}
                subtitle="Sede Institucional"
            />
            <InfoChip
                icon={<Clock size={18} />}
                title="Horario"
                subtitle={place.hours || "Horario no disponible"}
            />
            </div>

            <DetailSection title="Acerca del lugar">
            <p>{place.description}</p>
            </DetailSection>
        </div>
        </div>
    );
}
