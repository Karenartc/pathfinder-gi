'use client';
import { useEffect, useState } from 'react';

export default function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detectar sistema y modo
        const ua = window.navigator.userAgent.toLowerCase();
        const iOS = /iphone|ipad|ipod/.test(ua);
        const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone;

        setIsIOS(iOS);
        setIsStandalone(standalone);

        // Escuchar el evento de instalación (Android/Desktop)
        const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
        };

        const handleAppInstalled = () => {
        setIsInstallable(false);
        setIsStandalone(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installApp = async () => {
if (!deferredPrompt) return null;

    deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        setDeferredPrompt(null);
        setIsInstallable(false);

        return outcome; 
    };

    return { isInstallable, isStandalone, isIOS, installApp };
}
