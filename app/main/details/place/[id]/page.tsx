'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { MapPin, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DetailHeader from "@/components/details/DetailHeader";
import InfoChip from "@/components/details/InfoChip";
import DetailSection from "@/components/details/DetailSection";
import styles from "@/components/details/detail.module.css";

type Place = {
    id: string;
    name: string;
    description: string;
    image: string;
    location: string;
    hours: string;
    building?: string;
    room?: string;
    qrCodeUrl?: string;
};

type PageProps = { params: Promise<{ id: string }> };

export default function PlaceDetailPage({ params }: PageProps) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);
    const [placeId, setPlaceId] = useState<string>("");

    // Resolver params
    useEffect(() => {
        params.then((p) => setPlaceId(p.id));
    }, [params]);
    
    // Redirigir si no está autenticado
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, authLoading, router]);

    // Cargar lugar desde API
    useEffect(() => {
        async function fetchPlace() {
            if (!user || !placeId) return;

            try {
                const token = await user.getIdToken();
                const res = await fetch(`/api/places/${placeId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                
                if (res.ok && data.ok) {
                    setPlace(data.place);
                } else {
                    console.error("Error al cargar lugar:", data.message);
                    setPlace(null);
                }
            } catch (error) {
                console.error("Error:", error);
                setPlace(null);
            } finally {
                setLoading(false);
            }
        }

        if (user && placeId) {
            fetchPlace();
        }
    }, [user, placeId]);

    if (loading || authLoading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                Cargando lugar...
            </div>
        );
    }

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
