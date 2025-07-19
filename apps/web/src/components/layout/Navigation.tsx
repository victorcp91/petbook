'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  LogOut,
  Settings,
  Home,
  Calendar,
  Users,
  PawPrint,
  ShoppingBag,
  BarChart3,
  Shield,
} from 'lucide-react';

export function Navigation() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [{ href: '/dashboard', label: 'Dashboard', icon: Home }];

    // Owner and Admin can access everything
    if (user.role === 'owner' || user.role === 'admin') {
      return [
        ...baseItems,
        { href: '/appointments', label: 'Agendamentos', icon: Calendar },
        { href: '/clients', label: 'Clientes', icon: Users },
        { href: '/pets', label: 'Pets', icon: PawPrint },
        { href: '/services', label: 'Serviços', icon: ShoppingBag },
        { href: '/reports', label: 'Relatórios', icon: BarChart3 },
        { href: '/admin', label: 'Administração', icon: Shield },
      ];
    }

    // Groomer can access appointments and pets
    if (user.role === 'groomer') {
      return [
        ...baseItems,
        { href: '/appointments', label: 'Agendamentos', icon: Calendar },
        { href: '/pets', label: 'Pets', icon: PawPrint },
      ];
    }

    // Attendant can access appointments, clients, and pets
    if (user.role === 'attendant') {
      return [
        ...baseItems,
        { href: '/appointments', label: 'Agendamentos', icon: Calendar },
        { href: '/clients', label: 'Clientes', icon: Users },
        { href: '/pets', label: 'Pets', icon: PawPrint },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  if (!user) {
    return null; // Don't show navigation for unauthenticated users
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-blue-600"
              >
                PetBook
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.name || user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden">
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} pt-2 pb-3 space-y-1`}
        >
          {navigationItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
