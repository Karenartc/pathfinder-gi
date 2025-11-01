'use client';

import React, { useState } from 'react';
import styles from './DownloadSection.module.css';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import usePWAInstall from '@/hooks/usePWAInstall';
import IOSInstallModal from './IOSInstallModal';

export default function DownloadSection() {
    const { isInstallable, isStandalone, isIOS, installApp } = usePWAInstall();
    const [showIOSModal, setShowIOSModal] = useState(false);
    const [installed, setInstalled] = useState(false);

    const handleInstall = async () => {
        const outcome = await installApp();
        if (outcome === 'accepted') {
        setInstalled(true);
        }
    };

    return (
        <section className={styles.download}>
        <div className="container">
            <div className={styles.wrapper}>
            <div className={styles.imageBlock}>
                <Image
                src="/images/PathFox-telefono.png"
                alt="Zorro con teléfono PathFinder"
                width={300}
                height={300}
                className={styles.image}
                />
            </div>

            <div className={styles.textBlock}>
                <h1 className="h1">Lleva tu sede en el bolsillo</h1>

                {/* ANDROID / DESKTOP */}
                {isInstallable && !isStandalone && !isIOS && !installed && (
                <Button onClick={handleInstall} variant="primary" size="lg">
                    Agregar a pantalla de inicio
                </Button>
                )}

                {/* BOTÓN DESPUÉS DE INSTALAR */}
                {(isStandalone || installed) && (
                <Button variant="primary" size="lg" disabled>
                    PathFinder está instalado
                </Button>
                )}

                {/* iOS SAFARI */}
                {isIOS && !isStandalone && (
                <Button
                    onClick={() => setShowIOSModal(true)}
                    variant="primary"
                    size="lg"
                >
                    Agregar a pantalla de inicio
                </Button>
                )}
            </div>
            </div>
        </div>

        {/* MODAL iOS */}
        {showIOSModal && <IOSInstallModal onClose={() => setShowIOSModal(false)} />}

        </section>
    );
}
