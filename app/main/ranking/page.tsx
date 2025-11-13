'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import RankingView from "@/components/ranking/RankingView";
import type { User } from "@/libs/types";
import { ROUTES } from "@/libs/routes";

export default function RankingPage() {
    const { user, userData, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [globalData, setGlobalData] = useState<User[]>([]);
    const [careerData, setCareerData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!authLoading && !user) {
          router.push(ROUTES.login);
        }
    }, [user, authLoading, router]);

    // Cargar rankings desde las APIs
    useEffect(() => {
        async function loadRankings() {
            if (!user || !userData) return;

            try {
                const token = await user.getIdToken();

                const [globalRes, careerRes] = await Promise.all([
                    fetch('/api/ranking/global', {
                        headers: { 'Authorization': `Bearer ${token}` },
                    }),
                    fetch(`/api/ranking/career?career=${encodeURIComponent(userData.career || '')}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    }),
                ]);

                const globalResponse = await globalRes.json();
                const careerResponse = await careerRes.json();

                // GLOBAL RANKING
                if (globalRes.ok) {
                    const formattedGlobal = globalResponse.ranking.map((u: any) => ({
                        id: u.id,
                        name: u.fullName,
                        career: u.career,
                        points: u.totalPoints,
                        avatarUrl: u.avatarUrl?.startsWith('http') ? u.avatarUrl : "/images/fox-avatar.png",
                        email: '',
                        globalRank: u.globalRank,
                        careerCount: 0,
                        preferences: { darkMode: false, notificationsEnabled: true },
                    }));
                    setGlobalData(formattedGlobal);
                }

                // CAREER RANKING
                if (careerRes.ok) {
                    const formattedCareer = careerResponse.ranking.map((u: any) => ({
                        id: u.id,
                        name: u.fullName,
                        career: u.career,
                        points: u.totalPoints,
                        avatarUrl: u.avatarUrl?.startsWith('http') ? u.avatarUrl : "/images/fox-avatar.png",
                        email: '',
                        globalRank: 0,
                        careerCount: u.careerRank || u.careerCount,
                        preferences: { darkMode: false, notificationsEnabled: true },
                    }));
                    setCareerData(formattedCareer);
                }

            } catch (error) {
                console.error("Error al cargar rankings:", error);
            } finally {
                setLoading(false);
            }
        }

        loadRankings();
    }, [user, userData]);

    // Estados de carga
    if (authLoading || loading) {
        return (
            <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Cargando ranking...</p>
            </main>
        );
    }

    if (!user || !userData) {
        return (
            <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No se pudo cargar el perfil del usuario.</p>
            </main>
        );
    }

    return (
        <main className="container">
            <RankingView
                globalData={globalData}
                careerData={careerData}
                currentUserId={user.uid}
                userCareer={userData.career || "Mi carrera"}
            />
        </main>
    );  
}
