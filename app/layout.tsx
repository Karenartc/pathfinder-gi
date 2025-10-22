import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PathFinder GI', 
  description: 'Aplicación de apoyo para estudiantes en su primer año de estudio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Estos son los metatags clave para PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" /> {/* Asegúrate que coincida con tu manifest */}
        <link rel="icon" href="/icons/PathFox-logo-192x192.png" />
        {/* Puedes agregar más metatags de PWA aquí si quieres */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}