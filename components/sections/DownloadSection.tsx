'use client';

import React from 'react';
import styles from './DownloadSection.module.css';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function DownloadSection() {
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
                <Button href="/register" variant="primary" size="lg">
                Agregar a pantalla de inicio
                </Button>
            </div>
            </div>
        </div>
        </section>
    );
}
