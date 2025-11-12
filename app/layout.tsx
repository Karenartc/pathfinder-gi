import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'
import ThemeProvider from '../components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';  // 🔹 importa tu contexto

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  title: 'PathFinder GI',
  description: 'Aplicación de apoyo para estudiantes en su primer año de estudio.',
  icons: {
    icon: '/icons/PathFox-logo-192x192.png',
    apple: '/icons/PathFox-logo-192x192.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {/* 🔹 Envuelve toda tu app en el AuthProvider */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
