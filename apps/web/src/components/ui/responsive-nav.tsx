import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ResponsiveNavProps {
  items: NavItem[];
  className?: string;
  'aria-label'?: string;
}

export function ResponsiveNav({
  items,
  className,
  'aria-label': ariaLabel,
}: ResponsiveNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Close menu on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <nav className={cn('relative', className)} aria-label={ariaLabel}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center md:space-x-6">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="text-sm font-medium text-petbook-text-secondary hover:text-petbook-text-primary transition-colors"
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <h2 className="text-lg font-semibold text-petbook-text-primary">
                Menu
              </h2>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-2">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-petbook-text-secondary hover:text-petbook-text-primary hover:bg-petbook-background-secondary rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export function ResponsiveBreadcrumb({ items }: { items: NavItem[] }) {
  return (
    <nav
      className="flex items-center space-x-1 md:space-x-2 text-sm"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span
              className="text-petbook-text-muted hidden sm:inline"
              aria-hidden="true"
            >
              /
            </span>
          )}
          <a
            href={item.href}
            className={cn(
              'text-petbook-text-secondary hover:text-petbook-text-primary transition-colors',
              index === items.length - 1 && 'text-petbook-text-primary'
            )}
            aria-current={index === items.length - 1 ? 'page' : undefined}
          >
            {item.label}
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
}
