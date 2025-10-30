'use client';

import React from 'react';
import Image from 'next/image';
import styles from './NavbarPublic.module.css';

export default function NavbarPublic() {
    return (
        <header className={styles.navbar}>
      <div className={styles.wrapper}>
        <div className={styles.logoWrapper}>
            <Image
                src="/images/PathFinder-Logo.png"
                alt="PathFinder"
                fill
                priority
                className={styles.logo}
                sizes="(max-width: 768px) 160px, 200px" // 👈 adapta según viewport
            />
        </div>
      </div>
    </header>
    );
}
