'use client';

import React from 'react';
import styles from './HeroSection.module.css';
import Image from 'next/image';
import PathFox from '../../public/images/PathFox-Emocionado.png'; 
import Button from '@/components/ui/Button';
import { ROUTES } from '@/libs/routes';

export default function HeroSection() {
    return (
        <section className={styles.hero}>
        <div className="container">
            <div className={styles.wrapper}>
                <div className={styles.text}>
                    <h1 className="display">Tu Sede. Tu Carrera. Tu Éxito. En un solo lugar</h1>

                    <div className={styles.buttons}>
                    <Button href={ROUTES.register} variant="primary">¡Empezar a Explorar!</Button>
                    <Button href={ROUTES.login} variant="outline">Ya tengo una cuenta</Button>
                    </div>
                </div>

                <div className={styles.image}>
                    <Image
                    src={PathFox}
                    alt="Zorro PathFinder"
                    className={styles.fox}
                    width={320}
                    height={320}
                    priority
                    />
                </div>
            </div>
        </div>
        </section>
    );
}