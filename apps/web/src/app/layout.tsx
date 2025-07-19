import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { SessionProvider } from '@/components/auth/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PetBook - Livro Digital de Banho & Tosa',
  description:
    'Digitalize o Livro de Banho & Tosa exigido pela Vigilância Sanitária. Elimine fichas em papel e garanta conformidade legal em poucos cliques.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <SessionProvider>{children}</SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
