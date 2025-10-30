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
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icons/PathFox-logo-192x192.png" />
      </head>
      <body>
        {}
        <ThemeProvider>
          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}