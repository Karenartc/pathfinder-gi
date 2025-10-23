'use client';

import React from 'react';
import Image from 'next/image';
import styles from './NavbarPublic.module.css';
import logo from '../../public/images/PathFinder-Logo.png'; 

export default function NavbarPublic() {
    return (
        <header className={styles.navbar}>
            <div className={styles.wrapper}>
            <Image
                src="/images/PathFinder-Logo.png"
                alt="PathFinder"
                className={styles.logo}
                priority
                width={200}
                height={40}
            />
            </div>
        </header>
    );
}
