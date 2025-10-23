'use client'

import React from 'react';
import NavbarPublic from '@/components/commons/NavbarPublic';
import HeroSection from '@/components/sections/HeroSection';
import ThemeToggle from '@/components/dev/ThemeToggle';

export default function PublicHomePage() {
  return (
    <>
      <NavbarPublic />
      <HeroSection />
      <ThemeToggle /> {/* Botón temporal */}
    </>
  );
}
