import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'
import ThemeProvider from '../components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PathFinder GI',
  description:
    'Aplicación de apoyo para estudiantes en su primer año de estudio.',
  icons: {
    icon: '/icons/PathFox-logo-192x192.png',
    apple: '/icons/PathFox-logo-192x192.png',
  },
  manifest: '/manifest.json',
  themeColor: '#000000',

};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <body>
        {}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}