'use client';

import React from 'react';
import Image from 'next/image';
import NavbarPublic from '@/components/commons/NavbarPublic';
import Footer from '@/components/commons/Footer';
import LoginForm from '@/components/commons/LoginForm';
import '../../globals.css';
import './login.css';

export default function LoginPage() {
    return (
        <>
        <NavbarPublic />

        <main className="loginLayout">
            <div className="loginGrid">

            <div className="loginIllustration">
                <Image
                src="/images/PathFox-emocionado2.png"
                alt="PathFox, la mascota de PathFinder"
                width={320}
                height={320}
                priority
                className="loginImage"
                />
            </div>


            <div className="loginContent">
                <h1 className="loginTitle">Es hora de continuar tu aventura</h1>
                <LoginForm />
            </div>
            </div>
        </main>

        <Footer />
        </>
    );
}
