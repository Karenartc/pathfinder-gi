'use client';
import React from 'react';
import styles from './FeaturesSection.module.css';
import Card from '@/components/ui/Card';
import Image from 'next/image';

export default function FeaturesSection() {
    return (
        <section className={styles.features}>
        <div className="container">
            <div className={styles.grid}>
            <Card
                variant="elevated"
                padding="lg"
                title="Guías de Confianza"
                media={
                <Image
                    src="/images/PathFox-Camino.png"
                    alt="Guías de Confianza"
                    width={200}
                    height={200}
                />
                }
            >
                <p className="body">
                Domina lo administrativo y académico con lecciones interactivas.
                Supera los retos y asegura tu comprensión antes de avanzar.
                </p>
            </Card>

            <Card
                variant="elevated"
                padding="lg"
                title="Explora y Desbloquea"
                media={
                <Image
                    src="/images/PathFox-mapa.png"
                    alt="Explora y Desbloquea"
                    width={200}
                    height={200}
                />
                }
            >
                <p className="body">
                Usa el mapa didáctico para familiarizarte con el campus.
                Escanea códigos QR en puntos clave para desbloquear recompensas
                y avanzar en tu formación.
                </p>
            </Card>

            <Card
                variant="elevated"
                padding="lg"
                title="Acompañamiento 24/7"
                media={
                <Image
                    src="/images/PathFox-Pensandofuerte.png"
                    alt="Acompañamiento 24/7"
                    width={200}
                    height={200}
                />
                }
            >
                <p className="body">
                Resuelve tus dudas al instante. Nuestro chatbot inteligente está
                listo para guiarte en trámites, horarios y contactos
                importantes, sin guardar tus conversaciones.
                </p>
            </Card>
            </div>
        </div>
        </section>
    );
}
