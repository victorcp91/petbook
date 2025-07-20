import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function SkipLink({
  href,
  children,
  className,
  'aria-label': ariaLabel,
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'absolute left-4 top-4 z-50 -translate-y-full rounded-md bg-petbook-primary px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-petbook-primary focus:ring-offset-2',
        className
      )}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </a>
  );
}

export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content" aria-label="Skip to main content">
        Skip to main content
      </SkipLink>
      <SkipLink href="#navigation" aria-label="Skip to navigation">
        Skip to navigation
      </SkipLink>
    </>
  );
}
