'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ExploreSection from "@/components/explore/ExploreSection";
import type { Place } from "@/libs/types";
import { ROUTES } from "@/libs/routes";

export default function ExplorePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!authLoading && !user) {
            router.push(ROUTES.login);
        }
    }, [user, authLoading, router]);

    // Cargar lugares desde API
    useEffect(() => {
        async function fetchPlaces() {
            if (!user) return;

            try {
                const token = await user.getIdToken();
                const res = await fetch("/api/places", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();

                if (res.ok && data.ok) {
                    setPlaces(data.places || []);
                } else {
                    console.error("Error al cargar lugares:", data.message);
                    setPlaces([]);
                }
            } catch (err) {
                console.error("Error:", err);
                setPlaces([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPlaces();
    }, [user]);

    if (loading || authLoading) {
        return (
            <main style={{ padding: "2rem", textAlign: "center" }}>
                Cargando lugares...
            </main>
        );
    }

    return <ExploreSection places={places} />;
}
