'use client'

import React from 'react';
import NavbarPublic from '@/components/commons/NavbarPublic';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import DownloadSection from '@/components/sections/DownloadSection';
import Footer from '@/components/commons/Footer';

export default function PublicHomePage() {
  return (
    <>
      <NavbarPublic />
      <HeroSection />
      <FeaturesSection />
      <DownloadSection />
      <Footer />
    </>
  );
}
