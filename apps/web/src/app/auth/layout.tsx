import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - PetBook',
    default: 'PetBook - Sistema de Gestão para Pet Shops',
  },
  description: 'Sistema completo de gestão para pet shops',
};

export const viewport: Viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
