'use client';

import React from 'react';
import Image from 'next/image';
import NavbarPublic from '@/components/commons/NavbarPublic';
import Footer from '@/components/commons/Footer';
import RegisterForm from '@/components/commons/RegisterForm';
import '../../globals.css';
import './register.css';

export default function RegisterPage() {
    return (
        <>
        <NavbarPublic />

        <main className="registerLayout">
            <div className="registerGrid">

            <div className="registerContent">
                <h1 className="registerTitle">Únete y comienza tu aventura</h1>
                <RegisterForm />
            </div>

            <div className="registerIllustration">
                <Image
                src="/images/PathFox-emocionado2.png"
                alt="PathFox, la mascota de PathFinder"
                width={320}
                height={320}
                priority
                className="registerImage"
                />
            </div>
            </div>
        </main>

        <Footer />
        </>
    );
}
