'use client';
import React from 'react';
import styles from './IOSInstallModal.module.css';
import Image from 'next/image';
import { X, Share2, Home } from 'lucide-react';

type IOSInstallModalProps = {
    onClose: () => void;
};

export default function IOSInstallModal({ onClose }: IOSInstallModalProps) {
    return (
        <div className={styles.backdrop}>
        <div className={styles.modal}>
            <button className={styles.close} onClick={onClose} aria-label="Cerrar">
            <X size={20} />
            </button>

            <h2 className={styles.title}>Agregar PathFinder a tu pantalla</h2>
            <p className={styles.text}>Sigue estos pasos en Safari:</p>

            <ol className={styles.steps}>
            <li>
                1. Toca el ícono de compartir
                <Share2 size={20} className={styles.icon} />
            </li>
            <li>
                2. Luego selecciona <strong>“Agregar a pantalla de inicio”</strong>
                <Home size={20} className={styles.icon} />
            </li>
            </ol>

            <p className={styles.footer}>
            Así podrás abrir PathFinder como una app
            </p>
        </div>
        </div>
    );
}
